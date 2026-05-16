import { useState } from 'react'
import { Search, Package, Plus } from 'lucide-react'
import { useProducts } from '../modules/inventory/services/inventoryHooks'
import { formatCurrency } from '../lib/utils'
import type { Product } from '../modules/inventory/services/types'

export default function SkuSelector({ onAdd, allowCreate = false, CreateComponent }: { onAdd: (item: any) => void; allowCreate?: boolean; CreateComponent?: React.ElementType }) {
  const [search, setSearch] = useState('')
  const { data: products = [] } = useProducts({ search: search || undefined })
  const [showCreate, setShowCreate] = useState(false)

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
        <input 
          className="input pl-8 text-xs" 
          placeholder="Buscar por SKU o nombre..." 
          value={search} 
          onChange={e => { setSearch(e.target.value); setShowCreate(false) }} 
        />
      </div>
      <div className="max-h-52 overflow-y-auto rounded-lg border border-surface-4 divide-y divide-surface-4">
        {products.length === 0 ? (
          <div className="py-4 text-center space-y-2">
            <p className="text-xs text-ink-muted">Sin resultados</p>
            {allowCreate && <button onClick={() => setShowCreate(true)} className="btn-primary text-xs mx-auto"><Plus size={11} /> Crear nuevo producto</button>}
          </div>
        ) : (
          <>
            {products.map((p: Product) => (
              <button 
                key={p.productCen}
                onClick={() => onAdd({ 
                  productCen: p.productCen, 
                  skuLabel: p.sku, 
                  productName: p.name,
                  price: p.salePrice || 0
                })} 
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-surface-3 transition-colors text-left"
              >
                <Package size={13} className="text-accent shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-ink-primary truncate">{p.name}</p>
                  <p className="text-[10px] text-ink-muted font-mono">{p.sku}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-mono font-medium text-ink-secondary">{formatCurrency(p.salePrice)}</p>
                </div>
              </button>
            ))}
            {allowCreate && <button onClick={() => setShowCreate(true)} className="w-full flex items-center gap-2 px-4 py-3 text-xs text-accent hover:bg-surface-3 transition-colors"><Plus size={11} /> Crear nuevo producto</button>}
          </>
        )}
      </div>
      {allowCreate && showCreate && CreateComponent && <CreateComponent onCreated={(item: any) => { onAdd(item); setShowCreate(false) }} />}
    </div>
  )
}
