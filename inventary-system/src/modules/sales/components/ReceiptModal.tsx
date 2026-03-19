import { X, ReceiptText, AlertCircle } from 'lucide-react'
import { useReceipt, useCreateReceipt } from '../services/salesHooks'
import type { Sale } from '../services/types'
import Spinner from '../../../atoms/Spinner'
import ReceiptTicket from './ReceiptTicket'

interface ReceiptModalProps {
  open: boolean
  onClose: () => void
  sale: Sale
}

export default function ReceiptModal({ open, onClose, sale }: ReceiptModalProps) {
  const { data: receipt, isLoading, refetch } = useReceipt(open ? sale.id : undefined)
  const createReceipt = useCreateReceipt()

  if (!open) return null

  const handleGenerateReceipt = async () => {
    try {
      await createReceipt.mutateAsync(sale.id)
      refetch()
    } catch (e) {
      // Error manejado por Axios
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Mantenemos el fondo oscuro en pantalla, pero lo ocultamos al imprimir */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm print:hidden" onClick={onClose} />
      
      {/* Modal Card estándar */}
      <div className="relative w-full max-w-sm card animate-slide-up overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header (Oculto al imprimir) */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-surface-4 shrink-0 print:hidden">
          <h2 className="font-display font-bold text-base text-ink-primary flex items-center gap-2">
            <ReceiptText size={18} className="text-accent" /> Recibo de Venta
          </h2>
          <button onClick={onClose} className="btn-ghost !px-2 !py-1.5"><X size={15} /></button>
        </div>

        {/* Body - Mantenemos el scroll y centrado para la pantalla */}
        <div className="p-6 overflow-y-auto bg-surface-1/50 flex flex-col items-center justify-center min-h-[300px]">
          {isLoading ? (
            <div className="flex flex-col items-center text-ink-muted gap-2 print:hidden">
              <Spinner size={24} />
              <p className="text-sm">Buscando recibo...</p>
            </div>
          ) : receipt ? (
            <ReceiptTicket sale={sale} receipt={receipt} />
          ) : (
            <div className="text-center space-y-4 print:hidden">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-yellow-500/10 text-yellow-400 mx-auto">
                <AlertCircle size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-ink-primary">Recibo no generado</p>
                <p className="text-xs text-ink-muted mt-1">La venta está confirmada pero aún no tiene un recibo asignado.</p>
              </div>
              <button onClick={handleGenerateReceipt} disabled={createReceipt.isPending} className="btn-primary w-full justify-center">
                {createReceipt.isPending ? <Spinner size={14} /> : <ReceiptText size={14} />} Generar Recibo Ahora
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}