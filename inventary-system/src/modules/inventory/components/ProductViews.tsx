import { useState } from 'react'
import { Package, ChevronRight, Tag, Boxes } from 'lucide-react'
import { useProducts } from '../services/inventoryHooks'
import { formatCurrency } from '../../../lib/utils'
import type { Product } from '../services/types'
import Badge from '../../../atoms/Badge'

export function ProductListView({ search }: { search: string }) {
  const { data: products = [], isLoading } = useProducts({ search: search || undefined })
  const [expandedId, setExpandedId] = useState<string | null>(null)

  if (isLoading) return <div className="flex justify-center py-16 text-ink-muted text-sm">Cargando productos…</div>
  if (products.length === 0) return (
    <div className="flex flex-col items-center justify-center py-16 gap-2">
      <Package size={28} className="text-ink-muted" />
      <p className="text-sm text-ink-muted">Sin productos en el catálogo</p>
    </div>
  )

  return (
    <div className="divide-y divide-surface-3">
      {products.map((p: Product) => (
        <div key={p.productCen}>
          <div 
            className="flex items-center gap-4 px-6 py-4 hover:bg-surface-2/50 transition-colors cursor-pointer" 
            onClick={() => setExpandedId(expandedId === p.productCen ? null : p.productCen)}
          >
            <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
              <Package size={14} className="text-accent" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-ink-primary truncate">{p.name}</p>
              <p className="text-xs text-ink-muted">SKU: {p.sku} · {p.categoryName ?? 'Sin categoría'}</p>
            </div>
            <div className="hidden md:flex items-center gap-6 text-xs text-ink-muted">
              <span className="font-mono text-ink-secondary">{formatCurrency(p.salePrice)}</span>
              <Badge variant={p.status === 'ACTIVE' ? 'green' : 'gray'}>{p.status}</Badge>
            </div>
            <ChevronRight size={14} className={`text-ink-muted transition-transform duration-200 ${expandedId === p.productCen ? 'rotate-90' : ''}`} />
          </div>
          
          {expandedId === p.productCen && (
            <div className="px-6 py-4 bg-surface-1/60 border-t border-surface-3 animate-slide-up space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-ink-muted font-semibold mb-2 flex items-center gap-1.5"><Tag size={10} /> Detalles</p>
                  <p className="text-xs text-ink-secondary">{p.description || 'Sin descripción'}</p>
                  <div className="mt-2 space-y-1">
                    <p className="text-xs text-ink-muted">Costo: <span className="text-ink-secondary font-mono">{p.costPrice ? formatCurrency(p.costPrice) : '—'}</span></p>
                    <p className="text-xs text-ink-muted">Stock Reorden: <span className="text-ink-secondary font-mono">{p.reorderLevel} uds</span></p>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-ink-muted font-semibold mb-2 flex items-center gap-1.5"><Boxes size={10} /> Unidad</p>
                  <p className="text-xs text-ink-secondary">{p.unitName} ({p.unitCen})</p>
                  {p.stationCode && <p className="text-xs text-ink-muted mt-2">Estación: <span className="text-accent">{p.stationCode}</span></p>}
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
