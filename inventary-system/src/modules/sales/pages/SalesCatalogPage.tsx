import { useState } from 'react'
import { Search, Package, AlertCircle } from 'lucide-react'
import { useSellableProducts } from '../services/salesHooks'
import { useAppStore } from '../../../store/useAppStore'
import { formatCurrency } from '../../../lib/utils'
import type { SellableProduct } from '../services/types'
import SectionHeader from '../../../components/SectionHeader'

export default function SalesCatalogPage() {
  const { selectedWarehouse } = useAppStore()
  const [search, setSearch] = useState('')
  const { data: products = [], isLoading } = useSellableProducts({ search: search || undefined })

  return (
    <div className="animate-fade-in">
      <SectionHeader 
        title="Catálogo de Ventas" 
        subtitle={`Productos disponibles en ${selectedWarehouse?.name}`}
        right={
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
            <input className="input pl-8 w-52 text-xs" placeholder="Buscar producto..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        }
      />

      <div className="mx-6 mt-4 card overflow-hidden mb-8">
        <div className="hidden md:grid grid-cols-5 px-6 py-3 border-b border-surface-4">
          <span className="col-span-2 text-xs font-semibold uppercase tracking-wider text-ink-muted">Producto</span>
          <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted">Categoría</span>
          <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted">Precio</span>
          <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted text-right">Disponible</span>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16 text-sm text-ink-muted">Cargando catálogo…</div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-2">
            <Package size={28} className="text-ink-muted" />
            <p className="text-sm text-ink-muted">No se encontraron productos disponibles</p>
          </div>
        ) : (
          <div className="divide-y divide-surface-3">
            {products.map((p: SellableProduct) => (
              <div key={p.productCen} className="grid grid-cols-1 md:grid-cols-5 items-center gap-4 px-6 py-4 hover:bg-surface-2/50 transition-colors">
                <div className="col-span-1 md:col-span-2 flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${p.isAvailable ? 'bg-accent/10' : 'bg-red-500/10'}`}>
                    <Package size={14} className={p.isAvailable ? 'text-accent' : 'text-red-400'} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-ink-primary truncate">{p.name}</p>
                    <p className="text-[10px] font-mono text-ink-muted">{p.productCen}</p>
                  </div>
                </div>
                <div className="text-sm text-ink-secondary">{p.categoryName || '—'}</div>
                <div className="text-sm font-mono font-bold text-ink-primary">{formatCurrency(p.salePrice)}</div>
                <div className="flex items-center justify-end gap-2">
                  <span className={`text-sm font-mono font-medium ${p.availableQuantity > 0 ? 'text-accent' : 'text-red-400'}`}>
                    {p.availableQuantity}
                  </span>
                  {!p.isAvailable && <AlertCircle size={14} className="text-red-400" />}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
