import { X } from 'lucide-react'

type ModalSize = 'sm' | 'md' | 'lg'

interface ModalProps {
  open:     boolean
  onClose:  () => void
  title:    string
  children: React.ReactNode
  size?:    ModalSize
}

const sizes: Record<ModalSize, string> = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
}

export default function Modal({
  open, onClose, title, children, size = 'md'
}: ModalProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className={`relative w-full card animate-slide-up ${sizes[size]}`}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-surface-4">
          <h2 className="font-display font-bold text-base text-ink-primary">{title}</h2>
          <button onClick={onClose} className="btn-ghost !px-2 !py-1.5">
            <X size={15} />
          </button>
        </div>
        <div className="px-5 py-4">
          {children}
        </div>
      </div>
    </div>
  )
}