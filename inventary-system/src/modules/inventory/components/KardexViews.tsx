import { useState, useMemo } from 'react'
import { Search, ScrollText, Package, ChevronRight, TrendingUp, TrendingDown } from 'lucide-react'
import { useCompanyProducts, useKardex } from '../services/inventoryHooks'
import { useAppStore } from '../../../store/useAppStore'
import { formatDate } from '../../../lib/utils'
import type { CompanyProduct, Sku, Kardex, KardexEntry } from '../services/types'

export function ProductSkuSelector({ onSelect }: { onSelect: (sku: Sku & { productName: string }) => void }) {
  const { data: products = [] } = useCompanyProducts()
  const [search, setSearch] = useState('')
  const [expandedId, setExpandedId] = useState<number | null>(null)

  const filtered = useMemo(() => (products as CompanyProduct[]).filter(p => {
    const name = p.localNameAlias ?? p.globalProduct?.name ?? ''
    return name.toLowerCase().includes(search.toLowerCase()) || (p.globalProduct?.brand ?? '').toLowerCase().includes(search.toLowerCase())
  }), [products, search])

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
        <input className="input pl-8 text-sm" placeholder="Buscar producto..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>
      <div className="divide-y divide-surface-3">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 gap-2"><Package size={24} className="text-ink-muted" /><p className="text-sm text-ink-muted">Sin productos encontrados</p></div>
        ) : filtered.map((p: CompanyProduct) => {
          const nombre = p.localNameAlias ?? p.globalProduct?.name ?? `Producto #${p.id}`
          const isExpanded = expandedId === p.id
          return (
            <div key={p.id}>
              <button onClick={() => setExpandedId(isExpanded ? null : p.id)} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-surface-3 transition-colors text-left">
                <div className="w-7 h-7 rounded-lg bg-accent/10 flex items-center justify-center shrink-0"><Package size={13} className="text-accent" /></div>
                <div className="flex-1 min-w-0"><p className="text-sm font-medium text-ink-primary truncate">{nombre}</p><p className="text-xs text-ink-muted">{p.globalProduct?.brand ?? '—'} · {p.skus?.length ?? 0} SKU(s)</p></div>
                <ChevronRight size={13} className={`text-ink-muted transition-transform duration-200 shrink-0 ${isExpanded ? 'rotate-90' : ''}`} />
              </button>
              {isExpanded && (
                <div className="bg-surface-1 px-4 pb-3 space-y-1 animate-slide-up">
                  {!p.skus?.length ? <p className="text-xs text-ink-muted px-3 py-2">Sin SKUs registrados</p> : p.skus.map((sku: Sku) => (
                    <button key={sku.id} onClick={() => onSelect({ ...sku, productName: nombre })} className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-accent/10 transition-colors group">
                      <span className="text-xs font-mono text-ink-secondary group-hover:text-accent">{sku.internalSku ?? `SKU #${sku.id}`}</span><span className="text-xs text-ink-muted">Ver kardex →</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function KardexTable({ skuId, productName, skuLabel }: { skuId: number; productName: string; skuLabel: string }) {
  const { selectedWarehouse } = useAppStore()
  const { data: kardex, isLoading } = useKardex(skuId)

  const stats = useMemo(() => {
    if (!kardex) return { totalEntradas: 0, totalSalidas: 0, balanceFinal: 0 }
    const entries = (kardex as Kardex).entries ?? []
    const totalEntradas = entries.filter(e => [1, 3, 6].includes(e.typeId)).reduce((a, e) => a + e.quantity, 0)
    const totalSalidas = entries.filter(e => [2, 4, 5].includes(e.typeId)).reduce((a, e) => a + e.quantity, 0)
    const balanceFinal = entries.length > 0 ? entries[entries.length - 1].balanceAfter : 0
    return { totalEntradas, totalSalidas, balanceFinal }
  }, [kardex])

  if (isLoading) return <div className="flex justify-center py-16 text-sm text-ink-muted">Cargando kardex…</div>
  if (!kardex) return null

  const entries = (kardex as Kardex).entries ?? []

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="card p-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center shrink-0"><ScrollText size={16} className="text-accent" /></div>
          <div><p className="text-sm font-medium text-ink-primary">{productName}</p><p className="text-xs font-mono text-ink-muted">{skuLabel} · {selectedWarehouse?.name}</p></div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div className="card p-4 text-center"><p className="text-xs text-ink-muted uppercase tracking-wider">Total entradas</p><p className="font-display text-xl font-bold text-accent mt-1">{stats.totalEntradas}</p><p className="text-xs text-ink-muted">unidades</p></div>
        <div className="card p-4 text-center"><p className="text-xs text-ink-muted uppercase tracking-wider">Total salidas</p><p className="font-display text-xl font-bold text-red-400 mt-1">{stats.totalSalidas}</p><p className="text-xs text-ink-muted">unidades</p></div>
        <div className="card p-4 text-center"><p className="text-xs text-ink-muted uppercase tracking-wider">Balance actual</p><p className="font-display text-xl font-bold text-ink-primary mt-1">{stats.balanceFinal}</p><p className="text-xs text-ink-muted">unidades</p></div>
      </div>
      <div className="card overflow-hidden">
        <div className="grid grid-cols-5 px-6 py-3 border-b border-surface-4">{['Fecha', 'Tipo', 'Entrada', 'Salida', 'Balance'].map(h => <span key={h} className="text-xs font-semibold uppercase tracking-wider text-ink-muted">{h}</span>)}</div>
        {entries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 gap-2"><ScrollText size={24} className="text-ink-muted" /><p className="text-sm text-ink-muted">Sin movimientos registrados</p></div>
        ) : (
          <div className="divide-y divide-surface-3">
            {entries.map((e: KardexEntry) => {
              const isEntry = [1, 3, 6].includes(e.typeId)
              return (
                <div key={e.id} className="grid grid-cols-5 items-center px-6 py-3 hover:bg-surface-2/50 transition-colors">
                  <span className="text-xs text-ink-secondary">{formatDate(e.date)}</span>
                  <div className="flex items-center gap-1.5">{isEntry ? <TrendingUp size={12} className="text-accent shrink-0" /> : <TrendingDown size={12} className="text-red-400 shrink-0" />}<span className="text-xs text-ink-secondary truncate">{e.typeName}</span></div>
                  <span className={`text-xs font-mono font-medium ${isEntry ? 'text-accent' : 'text-ink-muted'}`}>{isEntry ? `+${e.quantity}` : '—'}</span>
                  <span className={`text-xs font-mono font-medium ${!isEntry ? 'text-red-400' : 'text-ink-muted'}`}>{!isEntry ? `-${e.quantity}` : '—'}</span>
                  <span className="text-xs font-mono font-bold text-ink-primary">{e.balanceAfter}</span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}