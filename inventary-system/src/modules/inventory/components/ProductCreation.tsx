import { useState } from 'react'
import { Package, Plus } from 'lucide-react'
import { useGlobalCategories, useCreateGlobalProduct, useCreateCompanyProduct } from '../services/inventoryHooks'
import { inventoryApi } from '../services/inventoryApi'

export default function CreateProductInline({ onCreated }: { onCreated: (sku: { skuId: number; skuLabel: string; productName: string }) => void }) {
  const { data: categories = [] } = useGlobalCategories()
  const createGlobal  = useCreateGlobalProduct()
  const createCompany = useCreateCompanyProduct()

  const [name, setName] = useState(''); const [brand, setBrand] = useState(''); const [upc, setUpc] = useState(''); const [catId, setCatId] = useState('')
  const [skuCode, setSkuCode] = useState(''); const [retailPrice, setRetailPrice] = useState(''); const [wholesale, setWholesale] = useState(''); const [alias, setAlias] = useState('')

  const handleCreate = async () => {
    if (!name.trim()) return
    const gp = await createGlobal.mutateAsync({ name, brand: brand || undefined, upcBarcode: upc || undefined, categoryId: catId ? parseInt(catId) : undefined })
    const cp = await createCompany.mutateAsync({ globalProductId: (gp as any).id, localNameAlias: alias || undefined, wholesalePrice: wholesale ? parseFloat(wholesale) : undefined })
    const skus = (cp as any).skus ?? []
    let skuId: number, skuLabel: string
    if (skus.length > 0) {
      skuId = skus[0].id; skuLabel = skus[0].internalSku ?? `SKU #${skus[0].id}`
    } else {
      const newSku = await inventoryApi.skus.create((cp as any).id, { internalSku: skuCode || undefined, retailPrice: retailPrice ? parseFloat(retailPrice) : undefined })
      skuId = (newSku as any).id; skuLabel = (newSku as any).internalSku ?? `SKU #${(newSku as any).id}`
    }
    onCreated({ skuId, skuLabel, productName: alias || name })
  }

  const isPending = createGlobal.isPending || createCompany.isPending

  return (
    <div className="border border-accent/20 rounded-xl p-4 space-y-3 bg-accent/5 animate-slide-up">
      <p className="text-xs font-semibold text-accent flex items-center gap-1.5"><Package size={12} /> Crear nuevo producto</p>
      <div className="grid grid-cols-2 gap-2">
        <div><label className="label">Nombre *</label><input className="input text-xs" value={name} onChange={e => setName(e.target.value)} /></div>
        <div><label className="label">Marca</label><input className="input text-xs" value={brand} onChange={e => setBrand(e.target.value)} /></div>
        <div><label className="label">UPC</label><input className="input text-xs font-mono" value={upc} onChange={e => setUpc(e.target.value)} /></div>
        <div>
          <label className="label">Categoría</label>
          <select className="input text-xs" value={catId} onChange={e => setCatId(e.target.value)}>
            <option value="">Sin categoría</option>
            {(categories as any[]).map(c => (<option key={c.id} value={c.id}>{c.name}</option>))}
          </select>
        </div>
        <div><label className="label">Alias</label><input className="input text-xs" value={alias} onChange={e => setAlias(e.target.value)} /></div>
        <div><label className="label">P. Mayoreo</label><input className="input text-xs font-mono" type="number" step="0.01" value={wholesale} onChange={e => setWholesale(e.target.value)} /></div>
        <div><label className="label">SKU *</label><input className="input text-xs font-mono" value={skuCode} onChange={e => setSkuCode(e.target.value)} /></div>
        <div><label className="label">P. Retail *</label><input className="input text-xs font-mono" type="number" step="0.01" value={retailPrice} onChange={e => setRetailPrice(e.target.value)} /></div>
      </div>
      <button onClick={handleCreate} disabled={!name.trim() || !skuCode.trim() || !retailPrice || isPending} className="btn-primary text-xs w-full justify-center">
        {isPending ? <span className="w-3 h-3 rounded-full border-2 border-surface-0/30 border-t-surface-0 animate-spin" /> : <Plus size={12} />} Crear y agregar
      </button>
    </div>
  )
}