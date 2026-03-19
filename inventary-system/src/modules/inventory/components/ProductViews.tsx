import { useState } from 'react'
import { Package, ChevronRight } from 'lucide-react'
import { useCompanyProducts, useGlobalProducts } from '../services/inventoryHooks'
import { formatCurrency } from '../../../lib/utils'
import type { CompanyProduct, GlobalProduct } from '../services/types'
import Badge from '../../../atoms/Badge'
import { CompanyProductExpanded } from './InventoryViews'

export function MyCompanyView({ search }: { search: string }) {
  const { data: products = [], isLoading } = useCompanyProducts()
  const [expandedId, setExpandedId] = useState<number | null>(null)

  const filtered = (products as CompanyProduct[]).filter(p => {
    const name = p.localNameAlias ?? p.globalProduct?.name ?? ''
    return name.toLowerCase().includes(search.toLowerCase()) || (p.globalProduct?.brand ?? '').toLowerCase().includes(search.toLowerCase())
  })

  if (isLoading) return <div className="flex justify-center py-16 text-ink-muted text-sm">Cargando productos…</div>
  if (filtered.length === 0) return (
    <div className="flex flex-col items-center justify-center py-16 gap-2">
      <Package size={28} className="text-ink-muted" />
      <p className="text-sm text-ink-muted">Sin productos en el catálogo</p>
    </div>
  )

  return (
    <div className="divide-y divide-surface-3">
      {filtered.map((p: CompanyProduct) => (
        <div key={p.id}>
          <div className="flex items-center gap-4 px-6 py-4 hover:bg-surface-2/50 transition-colors cursor-pointer" onClick={() => setExpandedId(expandedId === p.id ? null : p.id)}>
            <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center shrink-0"><Package size={14} className="text-accent" /></div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-ink-primary truncate">{p.localNameAlias ?? p.globalProduct?.name ?? `Producto #${p.id}`}</p>
              <p className="text-xs text-ink-muted">{p.globalProduct?.brand ?? '—'} · {p.globalProduct?.category?.name ?? 'Sin categoría'}</p>
            </div>
            <div className="hidden md:flex items-center gap-6 text-xs text-ink-muted">
              <span>{p.skus?.length ?? 0} SKUs</span><span className="font-mono text-ink-secondary">{p.wholesalePrice ? formatCurrency(p.wholesalePrice) : '—'}</span>
            </div>
            <ChevronRight size={14} className={`text-ink-muted transition-transform duration-200 ${expandedId === p.id ? 'rotate-90' : ''}`} />
          </div>
          {expandedId === p.id && <CompanyProductExpanded product={p} />}
        </div>
      ))}
    </div>
  )
}

export function GlobalView({ search }: { search: string }) {
  const { data: globalProducts = [], isLoading } = useGlobalProducts()
  const filtered = (globalProducts as GlobalProduct[]).filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || (p.brand ?? '').toLowerCase().includes(search.toLowerCase()) || (p.upcBarcode ?? '').includes(search))

  if (isLoading) return <div className="flex justify-center py-16 text-ink-muted text-sm">Cargando catálogo global…</div>
  if (filtered.length === 0) return <div className="flex flex-col items-center justify-center py-16 gap-2"><Package size={28} className="text-ink-muted" /><p className="text-sm text-ink-muted">Sin resultados</p></div>

  return (
    <div className="divide-y divide-surface-3">
      {filtered.map((p: GlobalProduct) => (
        <div key={p.id} className="flex items-center gap-4 px-6 py-4">
          <div className="w-8 h-8 rounded-lg bg-surface-4 flex items-center justify-center shrink-0"><Package size={14} className="text-ink-muted" /></div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-ink-primary truncate">{p.name}</p><p className="text-xs text-ink-muted">{p.brand ?? '—'} · {p.category?.name ?? 'Sin categoría'}</p>
          </div>
          <div className="hidden md:flex items-center gap-4 text-xs text-ink-muted"><span className="font-mono">{p.upcBarcode ?? 'Sin UPC'}</span></div>
          <div>{p.referencedByCompany ? <Badge variant="green">En mi catálogo</Badge> : <Badge variant="gray">No referenciado</Badge>}</div>
        </div>
      ))}
    </div>
  )
}