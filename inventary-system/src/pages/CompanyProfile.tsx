import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Building2, Warehouse, Plus, Trash2, X, AlertCircle } from 'lucide-react'
import { useAppStore } from '../store/useAppStore'
import { companyApi, warehouseApi } from '../services/companyApi'
import { formatDate } from '../lib/utils'

const CONFIRM_PASSWORD = 'confirmar'

function NewWarehouseModal({ companyId, open, onClose }: {
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
            <input
              className="input"
              placeholder="Ej: Sucursal Norte"
              value={name}
              onChange={e => setName(e.target.value)}
              autoFocus
            />
          </div>
          <div className="flex justify-end gap-2">
            <button onClick={handleClose} className="btn-ghost text-sm">Cancelar</button>
            <button
              onClick={() => create.mutate(name)}
              disabled={!name.trim() || create.isPending}
              className="btn-primary text-sm"
            >
              {create.isPending
                ? <span className="w-3 h-3 rounded-full border-2 border-surface-0/30 border-t-surface-0 animate-spin" />
                : <Plus size={13} />
              }
              Crear almacén
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function DeleteWarehouseModal({ companyId, warehouseId, warehouseName, open, onClose }: {
  companyId: number; warehouseId: number; warehouseName: string; open: boolean; onClose: () => void
}) {
  const qc      = useQueryClient()
  const { selectedWarehouse, setWarehouse } = useAppStore()
  const [password,      setPassword]      = useState('')
  const [passwordError, setPasswordError] = useState(false)

  const deleteMutation = useMutation({
    mutationFn: () => warehouseApi.delete(companyId, warehouseId),
    onSuccess:  () => {
      qc.invalidateQueries({ queryKey: ['warehouses', companyId] })
      if (selectedWarehouse?.id === warehouseId) setWarehouse(null)
      handleClose()
    },
  })

  const handleClose = () => { setPassword(''); setPasswordError(false); onClose() }

  const handleDelete = () => {
    if (password !== CONFIRM_PASSWORD) { setPasswordError(true); return }
    deleteMutation.mutate()
  }

  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose} />
      <div className="relative w-full max-w-sm card animate-slide-up">
        <div className="flex items-center justify-between px-5 py-4 border-b border-surface-4">
          <h2 className="font-display font-bold text-base text-ink-primary">Eliminar almacén</h2>
          <button onClick={handleClose} className="btn-ghost !px-2 !py-1.5"><X size={15} /></button>
        </div>
        <div className="px-5 py-4 space-y-4">
          <div className="flex items-start gap-2 px-3 py-3 rounded-lg bg-red-500/10 text-red-400 text-xs">
            <AlertCircle size={14} className="shrink-0 mt-0.5" />
            <p>Estás por eliminar <span className="font-medium">{warehouseName}</span>. Esta acción no se puede deshacer.</p>
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
            {passwordError && <p className="text-xs text-red-400 mt-1">Contraseña incorrecta</p>}
          </div>
          <div className="flex justify-end gap-2">
            <button onClick={handleClose} className="btn-ghost text-sm">Cancelar</button>
            <button
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              className="btn-danger text-sm"
            >
              {deleteMutation.isPending
                ? <span className="w-3 h-3 rounded-full border-2 border-red-400/30 border-t-red-400 animate-spin" />
                : <Trash2 size={13} />
              }
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CompanyProfile() {
  const { selectedCompany } = useAppStore()
  const companyId = selectedCompany?.id

  const { data: company    } = useQuery({
    queryKey: ['company', companyId],
    queryFn:  () => companyApi.get(companyId!),
    enabled:  !!companyId,
  })

  const { data: warehouses = [] } = useQuery({
    queryKey: ['warehouses', companyId],
    queryFn:  () => warehouseApi.list(companyId!),
    enabled:  !!companyId,
  })

  const [newWarehouseOpen,   setNewWarehouseOpen]   = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<{ id: number; name: string } | null>(null)

  if (!companyId) return (
    <div className="flex items-center justify-center h-64">
      <p className="text-sm text-ink-muted">Sin empresa seleccionada</p>
    </div>
  )

  return (
    <div className="animate-fade-in">

      {/* Header */}
      <div className="px-6 py-5 border-b border-surface-3">
        <h1 className="font-display text-2xl font-bold text-ink-primary">Perfil de empresa</h1>
        <p className="text-xs text-ink-muted mt-0.5">Información y gestión de almacenes</p>
      </div>

      <div className="px-6 py-4 space-y-6">

        {/* Company info */}
        <div className="card p-5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
              <Building2 size={18} className="text-accent" />
            </div>
            <div>
              <p className="font-display font-bold text-lg text-ink-primary">{selectedCompany?.name}</p>
              <p className="text-xs text-ink-muted">ID #{companyId}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-surface-4">
            <div>
              <p className="text-xs text-ink-muted">Estado</p>
              <span className="badge bg-accent/10 text-accent mt-1">Activa</span>
            </div>
            <div>
              <p className="text-xs text-ink-muted">Almacenes</p>
              <p className="text-sm font-medium text-ink-primary mt-0.5">{(warehouses as any[]).length}</p>
            </div>
          </div>
        </div>

        {/* Warehouses */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display text-base font-bold text-ink-primary">Almacenes</h2>
            <button onClick={() => setNewWarehouseOpen(true)} className="btn-primary text-xs">
              <Plus size={12} /> Nuevo almacén
            </button>
          </div>

          <div className="card divide-y divide-surface-4">
            {(warehouses as any[]).length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 gap-2">
                <Warehouse size={24} className="text-ink-muted" />
                <p className="text-sm text-ink-muted">Sin almacenes registrados</p>
              </div>
            ) : (warehouses as any[]).map((w: any) => (
              <div key={w.id} className="flex items-center gap-4 px-5 py-4">
                <div className="w-8 h-8 rounded-lg bg-surface-4 flex items-center justify-center shrink-0">
                  <Warehouse size={14} className="text-ink-muted" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-ink-primary">{w.name}</p>
                  <p className="text-xs text-ink-muted">
                    {w.totalStock ?? 0} uds en stock
                    {w.createdAt ? ` · Creado ${formatDate(w.createdAt)}` : ''}
                  </p>
                </div>
                <button
                  onClick={() => setDeleteTarget({ id: w.id, name: w.name })}
                  className="p-1.5 rounded-lg text-ink-muted hover:text-red-400 hover:bg-red-400/10 transition-colors"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>

      <NewWarehouseModal
        companyId={companyId}
        open={newWarehouseOpen}
        onClose={() => setNewWarehouseOpen(false)}
      />

      {deleteTarget && (
        <DeleteWarehouseModal
          companyId={companyId}
          warehouseId={deleteTarget.id}
          warehouseName={deleteTarget.name}
          open={!!deleteTarget}
          onClose={() => setDeleteTarget(null)}
        />
      )}
    </div>
  )
}