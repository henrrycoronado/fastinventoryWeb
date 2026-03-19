import { useState, useMemo } from 'react'
import { Search, Package, ChevronRight, Plus } from 'lucide-react'
import { useCompanyProducts, useSkus } from '../modules/inventory/services/inventoryHooks'
import { formatCurrency } from '../lib/utils'
import type { CompanyProduct, Sku } from '../modules/inventory/services/types'

function ProductSkuRow({ product, expanded, onExpand, onSelectSku }: any) {
  const { data: skus = [] } = useSkus(product.id)
  const nombre = product.localNameAlias ?? product.globalProduct?.name ?? `Producto #${product.id}`

  return (
    <div>
      <button onClick={onExpand} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-surface-3 transition-colors text-left">
        <Package size={13} className="text-ink-muted shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-ink-primary truncate">{nombre}</p>
          <p className="text-xs text-ink-muted">{product.globalProduct?.brand ?? '—'}</p>
        </div>
        <ChevronRight size={12} className={`text-ink-muted transition-transform ${expanded ? 'rotate-90' : ''}`} />
      </button>
      {expanded && (
        <div className="bg-surface-1 px-4 pb-2 space-y-1">
          {(skus as Sku[]).map(sku => (
            <button key={sku.id} onClick={() => onSelectSku({ skuId: sku.id, skuLabel: sku.internalSku ?? `SKU #${sku.id}`, productName: nombre })} className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-accent/10 transition-colors group">
              <span className="text-xs font-mono text-ink-secondary group-hover:text-accent">{sku.internalSku ?? `SKU #${sku.id}`}</span>
              <span className="text-xs text-ink-muted">{sku.retailPrice ? formatCurrency(sku.retailPrice) : '—'}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default function SkuSelector({ onAdd, allowCreate = false, CreateComponent }: { onAdd: (item: any) => void; allowCreate?: boolean; CreateComponent?: React.ElementType }) {
  const { data: products = [] } = useCompanyProducts()
  const [search, setSearch] = useState('')
  const [showCreate, setShowCreate] = useState(false)
  const [expandedId, setExpandedId] = useState<number | null>(null)

  const filtered = useMemo(() => (products as CompanyProduct[]).filter(p => {
    const name = p.localNameAlias ?? p.globalProduct?.name ?? ''
    return name.toLowerCase().includes(search.toLowerCase()) || (p.globalProduct?.brand ?? '').toLowerCase().includes(search.toLowerCase())
  }), [products, search])

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
        <input className="input pl-8 text-xs" placeholder="Buscar producto..." value={search} onChange={e => { setSearch(e.target.value); setShowCreate(false) }} />
      </div>
      <div className="max-h-52 overflow-y-auto rounded-lg border border-surface-4 divide-y divide-surface-4">
        {filtered.length === 0 ? (
          <div className="py-4 text-center space-y-2">
            <p className="text-xs text-ink-muted">Sin resultados</p>
            {allowCreate && <button onClick={() => setShowCreate(true)} className="btn-primary text-xs mx-auto"><Plus size={11} /> Crear nuevo producto</button>}
          </div>
        ) : (
          <>
            {filtered.map((p: CompanyProduct) => (
              <ProductSkuRow key={p.id} product={p} expanded={expandedId === p.id} onExpand={() => setExpandedId(expandedId === p.id ? null : p.id)} onSelectSku={onAdd} />
            ))}
            {allowCreate && <button onClick={() => setShowCreate(true)} className="w-full flex items-center gap-2 px-4 py-3 text-xs text-accent hover:bg-surface-3 transition-colors"><Plus size={11} /> Crear nuevo producto</button>}
          </>
        )}
      </div>
      {allowCreate && showCreate && CreateComponent && <CreateComponent onCreated={(item: any) => { onAdd(item); setShowCreate(false) }} />}
    </div>
  )
}