import { AlertTriangle, X } from 'lucide-react'

interface ConfirmModalProps {
  open:        boolean
  onClose:     () => void
  onConfirm:   () => void
  title:       string
  description: string
  confirmLabel?: string
  loading?:    boolean
  variant?:    'danger' | 'warn'
}

export default function ConfirmModal({
  open, onClose, onConfirm,
  title, description,
  confirmLabel = 'Confirmar',
  loading = false,
  variant = 'danger',
}: ConfirmModalProps) {
  if (!open) return null

  const colors = {
    danger: { icon: 'bg-red-500/10 text-red-400',  btn: 'btn-danger' },
    warn:   { icon: 'bg-yellow-500/10 text-yellow-400', btn: 'bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400 font-medium px-4 py-2 rounded-lg text-sm transition-all flex items-center gap-2' },
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm card animate-slide-up">

        <div className="flex items-center justify-between px-5 py-4 border-b border-surface-4">
          <h2 className="font-display font-bold text-base text-ink-primary">{title}</h2>
          <button onClick={onClose} className="btn-ghost !px-2 !py-1.5">
            <X size={15} />
          </button>
        </div>

        <div className="px-5 py-4 space-y-4">
          <div className={`flex items-start gap-3 px-3 py-3 rounded-lg ${colors[variant].icon}`}>
            <AlertTriangle size={16} className="shrink-0 mt-0.5" />
            <p className="text-sm">{description}</p>
          </div>

          <div className="flex justify-end gap-2">
            <button onClick={onClose} className="btn-ghost text-sm" disabled={loading}>
              Cancelar
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className={`${colors[variant].btn} text-sm`}
            >
              {loading
                ? <span className="w-3 h-3 rounded-full border-2 border-current/30 border-t-current animate-spin" />
                : confirmLabel
              }
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}