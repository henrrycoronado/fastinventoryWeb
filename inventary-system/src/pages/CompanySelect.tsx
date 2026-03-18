import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { Building2, ChevronRight, Plus, X, Warehouse } from 'lucide-react'
import { companyApi, warehouseApi } from '../services/companyApi'
import { APP_NAME } from '../config/constants'
import Spinner from '../atoms/Spinner'
import type { Company } from '../services/types'

const CONFIRM_PASSWORD = 'confirmar'

function CreateCompanyModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const qc       = useQueryClient()
  const navigate = useNavigate()

  const createCompany   = useMutation({
    mutationFn: companyApi.create,
    onSuccess:  () => qc.invalidateQueries({ queryKey: ['companies'] }),
  })
  const createWarehouse = useMutation({
    mutationFn: ({ companyId, name }: { companyId: number; name: string }) =>
      warehouseApi.create(companyId, { name }),
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
    await createWarehouse.mutateAsync({
      companyId: createdCompany.id,
      name:      warehouseName,
    })
    handleClose()
    navigate(`/warehouses/${createdCompany.id}`)
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
          <button onClick={handleClose} className="btn-ghost !px-2 !py-1.5">
            <X size={15} />
          </button>
        </div>

        <div className="px-5 py-4 space-y-4">
          {step === 'company' && (
            <>
              <div>
                <label className="label">Nombre de la empresa *</label>
                <input
                  className="input"
                  placeholder="Ej: Zapatería StepUp"
                  value={companyName}
                  onChange={e => setCompanyName(e.target.value)}
                  autoFocus
                />
              </div>
              <div>
                <label className="label">Confirmar acción</label>
                <input
                  className={`input ${passwordError ? 'border-red-500 focus:ring-red-500' : ''}`}
                  type="password"
                  placeholder="Escribe: confirmar"
                  value={password}
                  onChange={e => { setPassword(e.target.value); setPasswordError(false) }}
                />
                {passwordError && (
                  <p className="text-xs text-red-400 mt-1">Contraseña incorrecta</p>
                )}
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <button onClick={handleClose} className="btn-ghost text-sm">Cancelar</button>
                <button
                  onClick={handleCreateCompany}
                  disabled={!companyName.trim() || createCompany.isPending}
                  className="btn-primary text-sm"
                >
                  {createCompany.isPending
                    ? <span className="w-3 h-3 rounded-full border-2 border-surface-0/30 border-t-surface-0 animate-spin" />
                    : <Plus size={13} />
                  }
                  Crear empresa
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
                <input
                  className="input"
                  placeholder="Ej: Sucursal Centro"
                  value={warehouseName}
                  onChange={e => setWarehouseName(e.target.value)}
                  autoFocus
                />
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <button
                  onClick={handleCreateWarehouse}
                  disabled={!warehouseName.trim() || createWarehouse.isPending}
                  className="btn-primary text-sm"
                >
                  {createWarehouse.isPending
                    ? <span className="w-3 h-3 rounded-full border-2 border-surface-0/30 border-t-surface-0 animate-spin" />
                    : <Warehouse size={13} />
                  }
                  Crear almacén
                </button>
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  )
}

export default function CompanySelect() {
  const navigate    = useNavigate()
  const [modalOpen, setModalOpen] = useState(false)

  const { data: companies = [], isLoading } = useQuery({
    queryKey: ['companies'],
    queryFn:  companyApi.list,
  })

  return (
    <div className="min-h-screen bg-surface-0 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md space-y-6">

        <div className="text-center space-y-1">
          <h1 className="font-display text-3xl font-bold text-ink-primary">
            {APP_NAME}<span className="text-accent">.</span>
          </h1>
          <p className="text-sm text-ink-secondary">Selecciona una empresa para continuar</p>
        </div>

        <div className="card divide-y divide-surface-4">
          {isLoading ? (
            <div className="flex justify-center py-10"><Spinner size={20} /></div>
          ) : companies.length === 0 ? (
            <div className="py-10 text-center text-sm text-ink-muted">
              No hay empresas registradas
            </div>
          ) : (companies as Company[]).map(company => (
            <button
              key={company.id}
              onClick={() => navigate(`/warehouses/${company.id}`)}
              className="w-full flex items-center gap-4 px-5 py-4 hover:bg-surface-3 transition-colors text-left first:rounded-t-xl last:rounded-b-xl"
            >
              <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                <Building2 size={16} className="text-accent" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-ink-primary">{company.name}</p>
                <p className="text-xs text-ink-muted">ID #{company.id}</p>
              </div>
              <ChevronRight size={15} className="text-ink-muted shrink-0" />
            </button>
          ))}
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="btn-primary w-full justify-center"
        >
          <Plus size={14} /> Nueva empresa
        </button>

      </div>

      <CreateCompanyModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  )
}