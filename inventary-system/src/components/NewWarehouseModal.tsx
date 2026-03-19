import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, X } from 'lucide-react'
import { warehouseApi } from '../services/companyApi'

export default function NewWarehouseModal({ companyId, open, onClose }: {
  companyId: number; open: boolean; onClose: () => void
}) {
  const qc     = useQueryClient()
  const create = useMutation({
    mutationFn: (name: string) => warehouseApi.create(companyId, { name }),
    onSuccess:  () => {
      qc.invalidateQueries({ queryKey: ['warehouses', companyId] })
      onClose()
    },
  })
  const [name, setName] = useState('')
  const handleClose = () => { setName(''); onClose() }

  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose} />
      <div className="relative w-full max-w-sm card animate-slide-up">
        <div className="flex items-center justify-between px-5 py-4 border-b border-surface-4">
          <h2 className="font-display font-bold text-base text-ink-primary">Nuevo almacén</h2>
          <button onClick={handleClose} className="btn-ghost !px-2 !py-1.5"><X size={15} /></button>
        </div>
        <div className="px-5 py-4 space-y-4">
          <div>
            <label className="label">Nombre *</label>
            <input className="input" placeholder="Ej: Sucursal Norte" value={name} onChange={e => setName(e.target.value)} autoFocus />
          </div>
          <div className="flex justify-end gap-2">
            <button onClick={handleClose} className="btn-ghost text-sm">Cancelar</button>
            <button onClick={() => create.mutate(name)} disabled={!name.trim() || create.isPending} className="btn-primary text-sm">
              {create.isPending ? <span className="w-3 h-3 rounded-full border-2 border-surface-0/30 border-t-surface-0 animate-spin" /> : <Plus size={13} />}
              Crear almacén
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
