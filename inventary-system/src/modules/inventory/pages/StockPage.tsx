import { useState, useMemo } from 'react'
import { Search, Boxes, ChevronRight, Package, Tag, Calendar } from 'lucide-react'
import { useStock, useSkuAttributes, useBatches } from '../services/inventoryHooks'
import { useAppStore } from '../../../store/useAppStore'
import { formatCurrency, formatDate } from '../../../lib/utils'
import type { Stock } from '../services/types'

function StatCard({ label, value, sub }: { label: string; value: number; sub?: string }) {
  return (
    <div className="card p-4">
      <p className="text-xs text-ink-muted uppercase tracking-wider">{label}</p>
      <p className="font-display text-2xl font-bold text-ink-primary mt-1">{value}</p>
      {sub && <p className="text-xs text-ink-muted mt-0.5">{sub}</p>}
    </div>
  )
}

function StockExpanded({ stock }: { stock: Stock }) {
  const { data: attrs   = [] } = useSkuAttributes(stock.skuId)
  const { data: batches = [] } = useBatches(stock.skuId)
  const gp = stock.sku?.companyProduct?.globalProduct

  return (
    <div className="px-6 py-4 bg-surface-1/60 border-t border-surface-3 animate-slide-up">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        {/* Producto */}
        <div className="space-y-2">
          <p className="text-[10px] uppercase tracking-widest text-ink-muted font-semibold flex items-center gap-1.5">
            <Package size={10} /> Producto
          </p>
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between">
              <span className="text-ink-muted">Nombre global</span>
              <span className="text-ink-secondary font-medium">{gp?.name ?? '—'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-muted">Marca</span>
              <span className="text-ink-secondary">{gp?.brand ?? '—'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-muted">Categoría</span>
              <span className="text-ink-secondary">{gp?.category?.name ?? '—'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-muted">UPC</span>
              <span className="text-ink-secondary font-mono">{gp?.upcBarcode ?? '—'}</span>
            </div>
          </div>
        </div>

        {/* Precios */}
        <div className="space-y-2">
          <p className="text-[10px] uppercase tracking-widest text-ink-muted font-semibold flex items-center gap-1.5">
            <Tag size={10} /> Precios y atributos
          </p>
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between">
              <span className="text-ink-muted">Precio retail</span>
              <span className="text-ink-secondary font-mono">
                {stock.sku?.retailPrice ? formatCurrency(stock.sku.retailPrice) : '—'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-muted">Precio mayoreo</span>
              <span className="text-ink-secondary font-mono">
                {stock.sku?.companyProduct?.wholesalePrice
                  ? formatCurrency(stock.sku.companyProduct.wholesalePrice)
                  : '—'}
              </span>
            </div>
          </div>
          {attrs.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {attrs.map((a: any) => (
                <span key={a.id} className="text-[10px] px-2 py-1 rounded-lg bg-surface-3 text-ink-secondary">
                  {a.attribute?.name}: <span className="text-ink-primary font-medium">{a.value}</span>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Lotes */}
        <div className="space-y-2">
          <p className="text-[10px] uppercase tracking-widest text-ink-muted font-semibold flex items-center gap-1.5">
            <Calendar size={10} /> Lotes
          </p>
          {batches.length === 0 ? (
            <p className="text-xs text-ink-muted">Sin lotes registrados</p>
          ) : (
            <div className="space-y-2">
              {batches.map((b: any) => (
                <div key={b.id} className="bg-surface-3 rounded-lg px-3 py-2 space-y-1 text-xs">
                  <p className="font-mono text-accent">{b.batchNumber}</p>
                  <div className="flex justify-between text-ink-muted">
                    <span>Fabricación</span>
                    <span>{b.manufactureDate ? formatDate(b.manufactureDate) : '—'}</span>
                  </div>
                  <div className="flex justify-between text-ink-muted">
                    <span>Vencimiento</span>
                    <span className={b.expirationDate && new Date(b.expirationDate) < new Date()
                      ? 'text-red-400 font-medium' : ''}>
                      {b.expirationDate ? formatDate(b.expirationDate) : '—'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

export default function StockPage() {
  const { selectedWarehouse } = useAppStore()
  const { data: stockList = [], isLoading } = useStock()
  const [search,     setSearch]     = useState('')
  const [expandedId, setExpandedId] = useState<number | null>(null)

  const filtered = useMemo(() =>
    (stockList as Stock[]).filter(s => {
      const nombre = s.sku?.companyProduct?.localNameAlias
        ?? s.sku?.companyProduct?.globalProduct?.name ?? ''
      const sku    = s.sku?.internalSku ?? ''
      const q      = search.toLowerCase()
      return nombre.toLowerCase().includes(q) || sku.toLowerCase().includes(q)
    }),
    [stockList, search]
  )

  const stats = useMemo(() => ({
    totalSkus:     (stockList as Stock[]).length,
    disponible:    (stockList as Stock[]).reduce((a, s) => a + s.availableQuantity, 0),
    reservado:     (stockList as Stock[]).reduce((a, s) => a + s.reservedQuantity,  0),
    sinStock:      (stockList as Stock[]).filter(s => s.availableQuantity === 0).length,
  }), [stockList])

  return (
    <div className="animate-fade-in">

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-surface-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink-primary">Stock</h1>
          <p className="text-xs text-ink-muted mt-0.5">{selectedWarehouse?.name}</p>
        </div>
        <div className="relative">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
          <input
            className="input pl-8 w-52 text-xs"
            placeholder="Buscar producto o SKU..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 px-6 mt-4">
        <StatCard label="Total SKUs"        value={stats.totalSkus}  sub="en este warehouse" />
        <StatCard label="Uds disponibles"   value={stats.disponible} sub="listas para uso" />
        <StatCard label="Uds reservadas"    value={stats.reservado}  sub="en procesos activos" />
        <StatCard label="SKUs sin stock"    value={stats.sinStock}   sub="requieren reposición" />
      </div>

      {/* Table */}
      <div className="mx-6 mt-4 card overflow-hidden">

        {/* Table header */}
        <div className="grid grid-cols-6 px-6 py-3 border-b border-surface-4">
          {['Producto', 'SKU', 'Disponible', 'Reservado', 'Total', 'Actualizado'].map(h => (
            <span key={h} className="text-xs font-semibold uppercase tracking-wider text-ink-muted">{h}</span>
          ))}
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16 text-sm text-ink-muted">Cargando stock…</div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-2">
            <Boxes size={28} className="text-ink-muted" />
            <p className="text-sm text-ink-muted">Sin resultados</p>
          </div>
        ) : (
          <div className="divide-y divide-surface-3">
            {filtered.map((s: Stock) => {
              const nombre     = s.sku?.companyProduct?.localNameAlias ?? s.sku?.companyProduct?.globalProduct?.name ?? `SKU ${s.skuId}`
              const sku        = s.sku?.internalSku ?? `#${s.skuId}`
              const isExpanded = expandedId === s.id
              const isCritical = s.availableQuantity === 0
              const isLow      = s.availableQuantity > 0 && s.availableQuantity <= 10

              return (
                <div key={s.id}>
                  <div
                    className="grid grid-cols-6 items-center px-6 py-4 hover:bg-surface-2/50 transition-colors cursor-pointer"
                    onClick={() => setExpandedId(isExpanded ? null : s.id)}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                        isCritical ? 'bg-red-400' : isLow ? 'bg-yellow-400' : 'bg-accent'
                      }`} />
                      <span className="text-sm font-medium text-ink-primary truncate">{nombre}</span>
                    </div>

                    <span className="text-xs font-mono text-ink-secondary">{sku}</span>

                    <span className={`text-sm font-medium font-mono ${
                      isCritical ? 'text-red-400' : isLow ? 'text-yellow-400' : 'text-accent'
                    }`}>
                      {s.availableQuantity}
                    </span>

                    <span className="text-sm font-mono text-ink-secondary">{s.reservedQuantity}</span>

                    <span className="text-sm font-mono text-ink-secondary">{s.quantity}</span>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-ink-muted">
                        {formatDate(s.lastUpdated)}
                      </span>
                      <ChevronRight
                        size={13}
                        className={`text-ink-muted transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}
                      />
                    </div>
                  </div>

                  {isExpanded && <StockExpanded stock={s} />}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}