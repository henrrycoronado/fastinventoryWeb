import { useState } from 'react'
import { ReceiptText, Ban, Trash2, Package } from 'lucide-react'
import { useCancelSale, useDeleteSale } from '../services/salesHooks'
import { formatCurrency } from '../../../lib/utils'
import type { Sale, SaleDetail } from '../services/types'
import ConfirmModal from '../../../atoms/ConfirmModal'
import ReceiptModal from './ReceiptModal'

const STATUS_COLORS: Record<string, string> = {
  DRAFT:     'bg-surface-4 text-ink-secondary',
  CONFIRMED: 'bg-accent/10 text-accent',
  CANCELLED: 'bg-red-500/10 text-red-400',
  RETURNED:  'bg-yellow-500/10 text-yellow-400',
}

export function SaleBadge({ status }: { status?: { code: string; name: string } }) {
  if (!status) return null
  const colorClass = STATUS_COLORS[status.code] || STATUS_COLORS.DRAFT
  return <span className={`badge ${colorClass}`}>{status.name}</span>
}

export function SaleExpanded({ sale }: { sale: Sale }) {
  const cancelSale  = useCancelSale()
  const deleteSale  = useDeleteSale()

  const [confirmAction, setConfirmAction] = useState<'cancel' | 'delete' | null>(null)
  const [receiptModalOpen, setReceiptModalOpen] = useState(false) // <-- NUEVO ESTADO

  const total = sale.details?.reduce((acc, d) => acc + (d.subtotal || 0), 0) || 0
  const isConfirmed = sale.status?.code === 'CONFIRMED'
  const isCancelled = sale.status?.code === 'CANCELLED'

  return (
    <div className="px-6 py-5 bg-surface-1/60 border-t border-surface-3 animate-slide-up space-y-5">
      <div>
        <p className="text-[10px] uppercase tracking-widest text-ink-muted font-semibold mb-3 flex items-center gap-1.5">
          <Package size={12} /> Productos vendidos
        </p>
        
        {!sale.details || sale.details.length === 0 ? (
          <p className="text-xs text-ink-muted">Sin detalles de productos.</p>
        ) : (
          <div className="space-y-2">
            {sale.details.map((d: SaleDetail) => {
              const nombre = d.sku?.productName ?? `SKU #${d.skuId}`
              const skuCode = d.sku?.internalSku ?? 'Sin código'
              
              return (
                <div key={d.id} className="flex items-center justify-between bg-surface-3 rounded-lg px-4 py-3">
                  <div className="flex-1 min-w-0 pr-4">
                    <p className="text-xs font-medium text-ink-primary truncate">{nombre}</p>
                    <p className="text-xs font-mono text-ink-muted">{skuCode}</p>
                  </div>
                  <div className="flex items-center gap-6 text-xs text-ink-secondary shrink-0">
                    <div className="text-right"><p className="text-ink-muted">Cant.</p><p className="font-mono font-medium text-ink-primary">{d.quantity}</p></div>
                    <div className="text-right"><p className="text-ink-muted">Precio</p><p className="font-mono font-medium text-ink-primary">{formatCurrency(d.unitPrice)}</p></div>
                    <div className="text-right min-w-[70px]"><p className="text-ink-muted">Subtotal</p><p className="font-mono font-medium text-accent">{formatCurrency(d.subtotal)}</p></div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
        
        <div className="flex justify-end pt-3">
          <div className="text-sm text-ink-secondary">
            Total de la venta: <span className="font-display font-bold text-lg text-ink-primary ml-2">{formatCurrency(total)}</span>
          </div>
        </div>
      </div>

      {sale.notes && (
        <div className="px-4 py-3 rounded-lg bg-surface-3 text-xs text-ink-secondary border border-surface-4">
          <span className="font-semibold text-ink-muted block mb-1">Notas:</span>{sale.notes}
        </div>
      )}

      <div className="flex items-center justify-end gap-3 pt-2 border-t border-surface-3">
        {isConfirmed && (
          <>
            <button onClick={() => setConfirmAction('cancel')} className="btn-ghost text-xs text-red-400 hover:bg-red-500/10 hover:text-red-400">
              <Ban size={13} /> Anular Venta
            </button>
            
            <button onClick={() => setReceiptModalOpen(true)} className="btn-primary text-xs">
              <ReceiptText size={13} /> Ver / Generar Recibo
            </button>
          </>
        )}

        {isCancelled && (
          <button onClick={() => setConfirmAction('delete')} className="btn-ghost text-xs text-red-400 hover:bg-red-500/10 hover:text-red-400">
            <Trash2 size={13} /> Eliminar Registro
          </button>
        )}
      </div>

      <ReceiptModal 
        open={receiptModalOpen} 
        onClose={() => setReceiptModalOpen(false)} 
        sale={sale} 
      />

      <ConfirmModal open={confirmAction === 'cancel'} onClose={() => setConfirmAction(null)} onConfirm={() => { cancelSale.mutate(sale.id); setConfirmAction(null) }} title="Anular Venta" description="¿Estás seguro de anular esta venta? Esto no se puede deshacer y el stock podría requerir ajustes manuales dependiendo de las reglas del negocio." confirmLabel="Sí, Anular Venta" variant="danger" />
      <ConfirmModal open={confirmAction === 'delete'} onClose={() => setConfirmAction(null)} onConfirm={() => { deleteSale.mutate(sale.id); setConfirmAction(null) }} title="Eliminar Registro" description="Esta acción eliminará el registro de la venta anulada permanentemente." confirmLabel="Eliminar permanentemente" variant="danger" />
    </div>
  )
}