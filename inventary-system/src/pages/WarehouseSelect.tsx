import { useQuery } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router-dom'
import { Warehouse, ChevronRight, ArrowLeft } from 'lucide-react'
import { companyApi, warehouseApi } from '../services/companyApi'
import { useAppStore } from '../store/useAppStore'
import Spinner from '../atoms/Spinner'

export default function WarehouseSelect() {
  const { companyId } = useParams()
  const navigate      = useNavigate()
  const login         = useAppStore(s => s.login)

  const id = Number(companyId)

  const { data: company } = useQuery({
    queryKey: ['company', id],
    queryFn:  () => companyApi.get(id),
    enabled:  !!id,
  })

  const { data: warehouses = [], isLoading } = useQuery({
    queryKey: ['warehouses', id],
    queryFn:  () => warehouseApi.list(id),
    enabled:  !!id,
  })

  const handleSelect = (warehouse: { id: number; name: string; companyId: number }) => {
    if (!company) return
    login(company, warehouse)
    navigate('/inventory/dashboard', { replace: true })
  }

  return (
    <div className="min-h-screen bg-surface-0 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md space-y-6">

        <div className="space-y-1">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-1.5 text-xs text-ink-muted hover:text-ink-secondary transition-colors mb-3"
          >
            <ArrowLeft size={13} /> Volver a empresas
          </button>
          <h2 className="font-display text-2xl font-bold text-ink-primary">
            {company?.name ?? '…'}
          </h2>
          <p className="text-sm text-ink-secondary">Selecciona un almacén para gestionar</p>
        </div>

        <div className="card divide-y divide-surface-4">
          {isLoading ? (
            <div className="flex justify-center py-10">
              <Spinner size={20} />
            </div>
          ) : warehouses.length === 0 ? (
            <div className="py-10 text-center text-sm text-ink-muted">
              No hay almacenes registrados
            </div>
          ) : warehouses.map(warehouse => (
            <button
              key={warehouse.id}
              onClick={() => handleSelect(warehouse)}
              className="w-full flex items-center gap-4 px-5 py-4 hover:bg-surface-3 transition-colors text-left first:rounded-t-xl last:rounded-b-xl"
            >
              <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                <Warehouse size={16} className="text-accent" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-ink-primary">{warehouse.name}</p>
                <p className="text-xs text-ink-muted">ID #{warehouse.id}</p>
              </div>
              <ChevronRight size={15} className="text-ink-muted shrink-0" />
            </button>
          ))}
        </div>

      </div>
    </div>
  )
}