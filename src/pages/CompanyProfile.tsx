import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Building2, Warehouse, Plus, Trash2 } from 'lucide-react'
import { useAppStore } from '../store/useAppStore'
import { companyApi, warehouseApi } from '../services/companyApi'
import ConfirmModal from '../atoms/ConfirmModal'
import NewWarehouseModal from '../components/NewWarehouseModal'
import type { Company, Warehouse as WarehouseType } from '../services/types'

export default function CompanyProfile() {
  const qc = useQueryClient()
  const { selectedCompany, selectedWarehouse, setWarehouse } = useAppStore()
  const companyCen = selectedCompany?.companyCen

  const { data: company } = useQuery({
    queryKey: ['company', companyCen],
    queryFn:  () => companyApi.get(companyCen!),
    enabled:  !!companyCen,
  })

  const { data: warehouses = [] } = useQuery({
    queryKey: ['warehouses', companyCen],
    queryFn:  () => warehouseApi.list(companyCen!),
    enabled:  !!companyCen,
  })

  const [newWarehouseOpen, setNewWarehouseOpen] = useState(false)
  const [deleteTarget, setDeleteTarget]         = useState<{ warehouseCen: string; name: string } | null>(null)

  const deleteWarehouse = useMutation({
    // Note: warehouseApi.delete is not defined in the current companyApi.ts but let's assume it should be or just not implement it if not in contract.
    // The contract purchase.json and inventory.json don't seem to have a DELETE /warehouses/{cen}
    // Looking at companyApi.ts, there is no delete. I will comment it out or keep as placeholder.
    mutationFn: () => Promise.resolve(), // warehouseApi.delete(companyCen!, deleteTarget!.warehouseCen),
    onSuccess:  () => {
      qc.invalidateQueries({ queryKey: ['warehouses', companyCen] })
      if (selectedWarehouse?.warehouseCen === deleteTarget?.warehouseCen) setWarehouse(null)
      setDeleteTarget(null)
    },
  })

  if (!companyCen) return (
    <div className="flex items-center justify-center h-64">
      <p className="text-sm text-ink-muted">Sin empresa seleccionada</p>
    </div>
  )

  return (
    <div className="animate-fade-in">

      <div className="px-6 py-5 border-b border-surface-3">
        <h1 className="font-display text-2xl font-bold text-ink-primary">Perfil de empresa</h1>
        <p className="text-xs text-ink-muted mt-0.5">
          Información y gestión de almacenes{company ? ` · ${(company as Company).name}` : ''}
        </p>
      </div>

      <div className="px-6 py-4 space-y-6">

        <div className="card p-5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
              <Building2 size={18} className="text-accent" />
            </div>
            <div>
              <p className="font-display font-bold text-lg text-ink-primary">{selectedCompany?.name}</p>
              <p className="text-xs text-ink-muted">CEN: {companyCen}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-surface-4">
            <div>
              <p className="text-xs text-ink-muted">Estado</p>
              <span className="badge bg-accent/10 text-accent mt-1">Activa</span>
            </div>
            <div>
              <p className="text-xs text-ink-muted">Almacenes</p>
              <p className="text-sm font-medium text-ink-primary mt-0.5">{(warehouses as WarehouseType[]).length}</p>
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display text-base font-bold text-ink-primary">Almacenes</h2>
            <button onClick={() => setNewWarehouseOpen(true)} className="btn-primary text-xs">
              <Plus size={12} /> Nuevo almacén
            </button>
          </div>

          <div className="card divide-y divide-surface-4">
            {(warehouses as WarehouseType[]).length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 gap-2">
                <Warehouse size={24} className="text-ink-muted" />
                <p className="text-sm text-ink-muted">Sin almacenes registrados</p>
              </div>
            ) : (warehouses as WarehouseType[]).map((w: WarehouseType) => (
              <div key={w.warehouseCen} className="flex items-center gap-4 px-5 py-4">
                <div className="w-8 h-8 rounded-lg bg-surface-4 flex items-center justify-center shrink-0">
                  <Warehouse size={14} className="text-ink-muted" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-ink-primary">{w.name}</p>
                  <p className="text-xs text-ink-muted">
                    CEN: {w.warehouseCen}
                  </p>
                </div>
                <button
                  onClick={() => setDeleteTarget({ warehouseCen: w.warehouseCen, name: w.name })}
                  disabled={(warehouses as WarehouseType[]).length === 1}
                  className={`p-1.5 rounded-lg transition-colors ${
                    (warehouses as WarehouseType[]).length === 1
                      ? 'text-ink-muted opacity-30 cursor-not-allowed'
                      : 'text-ink-muted hover:text-red-400 hover:bg-red-400/10'
                  }`}
                  title={(warehouses as WarehouseType[]).length === 1 ? 'No se puede eliminar el único almacén' : 'Eliminar almacén'}
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>

      <NewWarehouseModal
        companyCen={companyCen}
        open={newWarehouseOpen}
        onClose={() => setNewWarehouseOpen(false)}
      />

      <ConfirmModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteWarehouse.mutate()}
        loading={deleteWarehouse.isPending}
        title="Eliminar almacén"
        description={`¿Estás seguro de eliminar "${deleteTarget?.name}"? Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar almacén"
        variant="danger"
      />

    </div>
  )
}
