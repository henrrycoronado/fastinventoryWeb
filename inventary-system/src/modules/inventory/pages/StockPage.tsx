import { useState, useMemo } from 'react'
import { Search, Boxes, ChevronRight } from 'lucide-react'
import { useStock } from '../services/inventoryHooks'
import { useAppStore } from '../../../store/useAppStore'
import { formatDate } from '../../../lib/utils'
import type { Stock } from '../services/types'
import StatCard from '../../../components/StatCard'
import SectionHeader from '../../../components/SectionHeader'
import { StockExpanded } from '../components/InventoryViews'

export default function StockPage() {
  const { selectedWarehouse } = useAppStore()
  const { data: stockList = [], isLoading } = useStock()
  const [search, setSearch] = useState('')
  const [expandedId, setExpandedId] = useState<number | null>(null)

  const filtered = useMemo(() => (stockList as Stock[]).filter(s => {
    const nombre = s.sku?.companyProduct?.localNameAlias ?? s.sku?.companyProduct?.globalProduct?.name ?? ''
    const sku = s.sku?.internalSku ?? ''
    return nombre.toLowerCase().includes(search.toLowerCase()) || sku.toLowerCase().includes(search.toLowerCase())
  }), [stockList, search])

  const stats = useMemo(() => ({
    totalSkus: (stockList as Stock[]).length,
    disponible: (stockList as Stock[]).reduce((a, s) => a + s.availableQuantity, 0),
    reservado: (stockList as Stock[]).reduce((a, s) => a + s.reservedQuantity,  0),
    sinStock: (stockList as Stock[]).filter(s => s.availableQuantity === 0).length,
  }), [stockList])

  return (
    <div className="animate-fade-in">
      <SectionHeader title="Stock" subtitle={selectedWarehouse?.name} right={
        <div className="relative">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
          <input className="input pl-8 w-52 text-xs" placeholder="Buscar producto o SKU..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      }/>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 px-6 mt-4">
        <StatCard label="Total SKUs" value={stats.totalSkus} sub="en este warehouse" />
        <StatCard label="Uds disponibles" value={stats.disponible} sub="listas para uso" />
        <StatCard label="Uds reservadas" value={stats.reservado} sub="en procesos activos" />
        <StatCard label="SKUs sin stock" value={stats.sinStock} sub="requieren reposición" />
      </div>

      <div className="mx-6 mt-4 card overflow-hidden">
        <div className="grid grid-cols-6 px-6 py-3 border-b border-surface-4">
          {['Producto', 'SKU', 'Disponible', 'Reservado', 'Total', 'Actualizado'].map(h => <span key={h} className="text-xs font-semibold uppercase tracking-wider text-ink-muted">{h}</span>)}
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16 text-sm text-ink-muted">Cargando stock…</div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-2"><Boxes size={28} className="text-ink-muted" /><p className="text-sm text-ink-muted">Sin resultados</p></div>
        ) : (
          <div className="divide-y divide-surface-3">
            {filtered.map((s: Stock) => {
              const nombre = s.sku?.companyProduct?.localNameAlias ?? s.sku?.companyProduct?.globalProduct?.name ?? `SKU ${s.skuId}`
              const isExpanded = expandedId === s.id; const isCritical = s.availableQuantity === 0; const isLow = s.availableQuantity > 0 && s.availableQuantity <= 10

              return (
                <div key={s.id}>
                  <div className="grid grid-cols-6 items-center px-6 py-4 hover:bg-surface-2/50 transition-colors cursor-pointer" onClick={() => setExpandedId(isExpanded ? null : s.id)}>
                    <div className="flex items-center gap-2 min-w-0"><div className={`w-1.5 h-1.5 rounded-full shrink-0 ${isCritical ? 'bg-red-400' : isLow ? 'bg-yellow-400' : 'bg-accent'}`} /><span className="text-sm font-medium text-ink-primary truncate">{nombre}</span></div>
                    <span className="text-xs font-mono text-ink-secondary">{s.sku?.internalSku ?? `#${s.skuId}`}</span>
                    <span className={`text-sm font-medium font-mono ${isCritical ? 'text-red-400' : isLow ? 'text-yellow-400' : 'text-accent'}`}>{s.availableQuantity}</span>
                    <span className="text-sm font-mono text-ink-secondary">{s.reservedQuantity}</span>
                    <span className="text-sm font-mono text-ink-secondary">{s.quantity}</span>
                    <div className="flex items-center justify-between"><span className="text-xs text-ink-muted">{formatDate(s.lastUpdated)}</span><ChevronRight size={13} className={`text-ink-muted transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`} /></div>
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