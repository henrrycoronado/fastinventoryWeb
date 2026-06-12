import { Package, Tag, Warehouse } from 'lucide-react'
import { formatCurrency } from '../../../core/utils'
import type { Product, StockItem } from '../types'

export function ProductExpanded({ product }: { product: Product }) {
  return (
    <div className="px-6 py-4 bg-surface-1/60 border-t border-surface-3 animate-slide-up space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-ink-muted font-semibold mb-2 flex items-center gap-1.5"><Tag size={10} /> Detalles</p>
          <p className="text-xs text-ink-secondary">{product.description || 'Sin descripción'}</p>
          <div className="mt-2 space-y-1">
            <p className="text-xs text-ink-muted">CEN: <span className="text-ink-secondary font-mono">{product.productCen}</span></p>
            <p className="text-xs text-ink-muted">Costo: <span className="text-ink-secondary font-mono">{product.costPrice ? formatCurrency(product.costPrice) : '—'}</span></p>
          </div>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-widest text-ink-muted font-semibold mb-2 flex items-center gap-1.5"><Warehouse size={10} /> Almacén</p>
          <div className="space-y-1">
             <p className="text-xs text-ink-secondary">Estación: {product.stationCode || '—'}</p>
             <p className="text-xs text-ink-secondary">Punto de reorden: {product.reorderLevel} uds</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export function StockExpanded({ stock }: { stock: StockItem }) {
  return (
    <div className="px-6 py-4 bg-surface-1/60 border-t border-surface-3 animate-slide-up">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <p className="text-[10px] uppercase tracking-widest text-ink-muted font-semibold flex items-center gap-1.5"><Package size={10} /> Producto</p>
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between"><span className="text-ink-muted">Nombre</span><span className="text-ink-secondary font-medium">{stock.productName}</span></div>
            <div className="flex justify-between"><span className="text-ink-muted">CEN</span><span className="text-ink-secondary font-mono">{stock.productCen}</span></div>
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-[10px] uppercase tracking-widest text-ink-muted font-semibold flex items-center gap-1.5"><Tag size={10} /> Stock</p>
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between"><span className="text-ink-muted">Disponible</span><span className="text-ink-secondary font-mono">{stock.availableQuantity}</span></div>
            <div className="flex justify-between"><span className="text-ink-muted">Reservado</span><span className="text-ink-secondary font-mono">{stock.reservedQuantity}</span></div>
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-[10px] uppercase tracking-widest text-ink-muted font-semibold flex items-center gap-1.5"><Warehouse size={10} /> Ubicación</p>
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between"><span className="text-ink-muted">Almacén</span><span className="text-ink-secondary">{stock.warehouseName}</span></div>
            <div className="flex justify-between"><span className="text-ink-muted">CEN</span><span className="text-ink-secondary font-mono">{stock.warehouseCen}</span></div>
          </div>
        </div>
      </div>
    </div>
  )
}
