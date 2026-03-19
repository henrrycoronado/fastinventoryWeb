import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { useCreateSeller } from '../services/salesHooks'

export default function SellerFormModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const createSeller = useCreateSeller()
  const [name, setName]   = useState('')
  const [phone, setPhone] = useState('')

  const handleClose = () => {
    setName(''); setPhone('')
    onClose()
  }

  const handleSubmit = async () => {
    if (!name.trim()) return
    await createSeller.mutateAsync({ name, phone: phone || undefined })
    handleClose()
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose} />
      <div className="relative w-full max-w-sm card animate-slide-up">
        <div className="flex items-center justify-between px-5 py-4 border-b border-surface-4">
          <h2 className="font-display font-bold text-base text-ink-primary">Nuevo vendedor</h2>
          <button onClick={handleClose} className="btn-ghost !px-2 !py-1.5"><X size={15} /></button>
        </div>
        <div className="px-5 py-4 space-y-4">
          <div>
            <label className="label">Nombre completo *</label>
            <input className="input" placeholder="Ej: María López" value={name} onChange={e => setName(e.target.value)} autoFocus />
          </div>
          <div>
            <label className="label">Teléfono (opcional)</label>
            <input className="input font-mono" placeholder="Ej: 77798765" value={phone} onChange={e => setPhone(e.target.value)} />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button onClick={handleClose} className="btn-ghost text-sm">Cancelar</button>
            <button onClick={handleSubmit} disabled={!name.trim() || createSeller.isPending} className="btn-primary text-sm">
              {createSeller.isPending ? <span className="w-3 h-3 rounded-full border-2 border-surface-0/30 border-t-surface-0 animate-spin" /> : <Plus size={13} />} Registrar vendedor
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}