import { useState } from 'react'
import { Package, Tag, Warehouse, Trash2, Calendar } from 'lucide-react'
import { useSkus, useWarehouses, useStock, useDeleteCompanyProduct, useSkuAttributes, useBatches } from '../services/inventoryHooks'
import { inventoryApi } from '../services/inventoryApi'
import { useQuery } from '@tanstack/react-query'
import { useAppStore } from '../../../store/useAppStore'
import { formatCurrency, formatDate } from '../../../lib/utils'
import ConfirmModal from '../../../atoms/ConfirmModal'
import type { CompanyProduct, Sku, Stock } from '../services/types'

export function CompanyProductExpanded({ product }: { product: CompanyProduct }) {
  const warehouseId = useAppStore(s => s.selectedWarehouse?.id)
  const { data: skus = [] } = useSkus(product.id)
  const { data: warehouses = [] } = useWarehouses()
  const { data: stockList = [] } = useStock()
  const deleteProduct = useDeleteCompanyProduct()
  const [confirmOpen, setConfirmOpen] = useState(false)

  const hasActiveStock = (skus as Sku[]).some(sku => (stockList as Stock[]).some(s => s.skuId === sku.id && s.availableQuantity > 0))

  const { data: productStockList = [] } = useQuery({
    queryKey: ['stock-all-warehouses', product.id],
    queryFn: async () => {
      const results = await Promise.all((warehouses as any[]).map((w: any) => inventoryApi.stock.list(w.id).then((stocks: any[]) => stocks.filter((s: any) => (skus as Sku[]).some(sk => sk.id === s.skuId)).map((s: any) => ({ ...s, warehouseName: w.name, warehouseId: w.id })))))
      return results.flat()
    },
    enabled: (warehouses as any[]).length > 0 && (skus as Sku[]).length > 0,
  })

  const warehouseStock = (warehouses as any[]).map((w: any) => ({ ...w, available: (productStockList as any[]).filter((s: any) => s.warehouseId === w.id).reduce((acc: number, s: any) => acc + s.availableQuantity, 0) }))

  return (
    <div className="px-6 py-4 bg-surface-1/60 border-t border-surface-3 animate-slide-up space-y-4">
      <div>
        <p className="text-[10px] uppercase tracking-widest text-ink-muted font-semibold mb-2 flex items-center gap-1.5"><Tag size={10} /> SKUs</p>
        {(skus as Sku[]).length === 0 ? <p className="text-xs text-ink-muted">Sin SKUs registrados</p> : <div className="space-y-1.5">{(skus as Sku[]).map(sku => <div key={sku.id} className="flex items-start gap-3 py-2 px-3 rounded-lg bg-surface-3"><div className="flex-1 min-w-0"><p className="text-xs font-mono text-accent">{sku.internalSku ?? `SKU #${sku.id}`}</p><p className="text-xs text-ink-muted mt-0.5">Retail: {sku.retailPrice ? formatCurrency(sku.retailPrice) : '—'}</p></div></div>)}</div>}
      </div>
      <div>
        <p className="text-[10px] uppercase tracking-widest text-ink-muted font-semibold mb-2 flex items-center gap-1.5"><Warehouse size={10} /> Disponibilidad por sucursal</p>
        <div className="flex flex-wrap gap-2">
          {warehouseStock.map((w: any) => (
            <div key={w.id} className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs ${w.id === warehouseId ? 'bg-accent/10 border border-accent/20' : 'bg-surface-3'}`}><span className={w.id === warehouseId ? 'text-accent font-medium' : 'text-ink-secondary'}>{w.name}</span><span className={`font-mono font-medium ${w.available > 0 ? 'text-accent' : 'text-red-400'}`}>{w.available} uds</span></div>
          ))}
        </div>
      </div>
      <div className="pt-2 border-t border-surface-3 flex items-center justify-between">
        <p className="text-xs text-ink-muted">{hasActiveStock ? 'No se puede eliminar: tiene stock activo' : 'Sin stock activo — puede eliminarse'}</p>
        <button onClick={() => setConfirmOpen(true)} disabled={hasActiveStock} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-colors ${hasActiveStock ? 'text-ink-muted bg-surface-4 cursor-not-allowed opacity-50' : 'text-red-400 bg-red-400/10 hover:bg-red-400/20'}`}><Trash2 size={12} /> Eliminar producto</button>
      </div>
      <ConfirmModal open={confirmOpen} onClose={() => setConfirmOpen(false)} onConfirm={() => { deleteProduct.mutate(product.id); setConfirmOpen(false) }} loading={deleteProduct.isPending} title="Eliminar producto" description={`¿Estás seguro de eliminar "${product.localNameAlias ?? product.globalProduct?.name}"?`} confirmLabel="Eliminar producto" variant="danger" />
    </div>
  )
}

export function StockExpanded({ stock }: { stock: Stock }) {
  const { data: attrs   = [] } = useSkuAttributes(stock.skuId)
  const { data: batches = [] } = useBatches(stock.skuId)
  const gp = stock.sku?.companyProduct?.globalProduct

  return (
    <div className="px-6 py-4 bg-surface-1/60 border-t border-surface-3 animate-slide-up">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <p className="text-[10px] uppercase tracking-widest text-ink-muted font-semibold flex items-center gap-1.5"><Package size={10} /> Producto</p>
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between"><span className="text-ink-muted">Nombre</span><span className="text-ink-secondary font-medium">{gp?.name ?? '—'}</span></div>
            <div className="flex justify-between"><span className="text-ink-muted">Marca</span><span className="text-ink-secondary">{gp?.brand ?? '—'}</span></div>
            <div className="flex justify-between"><span className="text-ink-muted">Categoría</span><span className="text-ink-secondary">{gp?.category?.name ?? '—'}</span></div>
            <div className="flex justify-between"><span className="text-ink-muted">UPC</span><span className="text-ink-secondary font-mono">{gp?.upcBarcode ?? '—'}</span></div>
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-[10px] uppercase tracking-widest text-ink-muted font-semibold flex items-center gap-1.5"><Tag size={10} /> Precios y atributos</p>
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between"><span className="text-ink-muted">Retail</span><span className="text-ink-secondary font-mono">{stock.sku?.retailPrice ? formatCurrency(stock.sku.retailPrice) : '—'}</span></div>
            <div className="flex justify-between"><span className="text-ink-muted">Mayoreo</span><span className="text-ink-secondary font-mono">{stock.sku?.companyProduct?.wholesalePrice ? formatCurrency(stock.sku.companyProduct.wholesalePrice) : '—'}</span></div>
          </div>
          {attrs.length > 0 && <div className="flex flex-wrap gap-1.5 mt-2">{attrs.map((a: any) => <span key={a.id} className="text-[10px] px-2 py-1 rounded-lg bg-surface-3 text-ink-secondary">{a.attribute?.name}: <span className="text-ink-primary font-medium">{a.value}</span></span>)}</div>}
        </div>
        <div className="space-y-2">
          <p className="text-[10px] uppercase tracking-widest text-ink-muted font-semibold flex items-center gap-1.5"><Calendar size={10} /> Lotes</p>
          {batches.length === 0 ? <p className="text-xs text-ink-muted">Sin lotes</p> : (
            <div className="space-y-2">{batches.map((b: any) => <div key={b.id} className="bg-surface-3 rounded-lg px-3 py-2 space-y-1 text-xs"><p className="font-mono text-accent">{b.batchNumber}</p><div className="flex justify-between text-ink-muted"><span>Fabr.</span><span>{b.manufactureDate ? formatDate(b.manufactureDate) : '—'}</span></div><div className="flex justify-between text-ink-muted"><span>Venc.</span><span className={b.expirationDate && new Date(b.expirationDate) < new Date() ? 'text-red-400 font-medium' : ''}>{b.expirationDate ? formatDate(b.expirationDate) : '—'}</span></div></div>)}</div>
          )}
        </div>
      </div>
    </div>
  )
}