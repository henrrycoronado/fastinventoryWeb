import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { Plus, X, Warehouse as WarehouseIcon } from 'lucide-react'
import { companyApi, warehouseApi } from '../networks/hooks'
import type { Company } from '../networks/types'

const CONFIRM_PASSWORD = 'confirmar'

export default function CreateCompanyModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const qc       = useQueryClient()
  const navigate = useNavigate()

  const createCompany   = useMutation({
    mutationFn: companyApi.create,
    onSuccess:  () => qc.invalidateQueries({ queryKey: ['companies'] }),
  })
  const createWarehouse = useMutation({
    mutationFn: ({ companyCen, name }: { companyCen: string; name: string }) =>
      warehouseApi.create(companyCen, { name }),
  })

  const [step,          setStep]          = useState<'company' | 'warehouse'>('company')
  const [companyName,   setCompanyName]   = useState('')
  const [warehouseName, setWarehouseName] = useState('')
  const [createdCompany, setCreatedCompany] = useState<Company | null>(null)
  const [password,      setPassword]      = useState('')
  const [passwordError, setPasswordError] = useState(false)

  const reset = () => {
    setStep('company'); setCompanyName(''); setWarehouseName('')
    setCreatedCompany(null); setPassword(''); setPasswordError(false)
  }

  const handleClose = () => { reset(); onClose() }

  const handleCreateCompany = async () => {
    if (password !== CONFIRM_PASSWORD) { setPasswordError(true); return }
    const company = await createCompany.mutateAsync({ name: companyName })
    setCreatedCompany(company as Company)
    setStep('warehouse')
  }

  const handleCreateWarehouse = async () => {
    if (!createdCompany) return
    await createWarehouse.mutateAsync({ companyCen: createdCompany.companyCen, name: warehouseName })
    handleClose()
    navigate(`/warehouses/${createdCompany.companyCen}`)
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose} />
      <div className="relative w-full max-w-sm card animate-slide-up">
        <div className="flex items-center justify-between px-5 py-4 border-b border-surface-4">
          <h2 className="font-display font-bold text-base text-ink-primary">
            {step === 'company' ? 'Nueva empresa' : 'Primer almacén'}
          </h2>
          <button onClick={handleClose} className="btn-ghost !px-2 !py-1.5"><X size={15} /></button>
        </div>
        <div className="px-5 py-4 space-y-4">
          {step === 'company' && (
            <>
              <div>
                <label className="label">Nombre de la empresa *</label>
                <input className="input" placeholder="Ej: Zapatería StepUp" value={companyName} onChange={(e: any) => setCompanyName(e.target.value)} autoFocus />
              </div>
              <div>
                <label className="label">Confirmar acción</label>
                <input className={`input ${passwordError ? 'border-red-500 focus:ring-red-500' : ''}`} type="password" placeholder="Escribe: confirmar" value={password} onChange={(e: any) => { setPassword(e.target.value); setPasswordError(false) }} />
                {passwordError && <p className="text-xs text-red-400 mt-1">Contraseña incorrecta</p>}
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <button onClick={handleClose} className="btn-ghost text-sm">Cancelar</button>
                <button onClick={handleCreateCompany} disabled={!companyName.trim() || createCompany.isPending} className="btn-primary text-sm">
                  {createCompany.isPending ? <span className="w-3 h-3 rounded-full border-2 border-surface-0/30 border-t-surface-0 animate-spin" /> : <Plus size={13} />} Crear empresa
                </button>
              </div>
            </>
          )}
          {step === 'warehouse' && (
            <>
              <div className="bg-surface-3 rounded-lg px-3 py-2 text-xs text-ink-secondary">
                Empresa: <span className="text-ink-primary font-medium">{createdCompany?.name}</span>
              </div>
              <div>
                <label className="label">Nombre del almacén *</label>
                <input className="input" placeholder="Ej: Sucursal Centro" value={warehouseName} onChange={(e: any) => setWarehouseName(e.target.value)} autoFocus />
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <button onClick={handleCreateWarehouse} disabled={!warehouseName.trim() || createWarehouse.isPending} className="btn-primary text-sm">
                  {createWarehouse.isPending ? <span className="w-3 h-3 rounded-full border-2 border-surface-0/30 border-t-surface-0 animate-spin" /> : <WarehouseIcon size={13} />} Crear almacén
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
