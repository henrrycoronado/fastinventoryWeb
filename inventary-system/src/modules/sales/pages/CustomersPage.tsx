import { useState, useMemo } from 'react'
import { Search, Users, Plus, Trash2 } from 'lucide-react'
import { useCustomers, useDeleteCustomer } from '../services/salesHooks'
import type { Customer } from '../services/types'
import SectionHeader from '../../../components/SectionHeader'
import ConfirmModal from '../../../atoms/ConfirmModal'
import CustomerFormModal from '../components/CustomerFormModal'

export default function CustomersPage() {
  const { data: customers = [], isLoading } = useCustomers()
  const deleteCustomer = useDeleteCustomer()

  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Customer | null>(null)

  const filtered = useMemo(() => {
    return (customers as Customer[]).filter(c => 
      c.name.toLowerCase().includes(search.toLowerCase()) || 
      (c.phone && c.phone.includes(search)) || 
      (c.email && c.email.toLowerCase().includes(search.toLowerCase()))
    )
  }, [customers, search])

  return (
    <div className="animate-fade-in">
      <SectionHeader 
        title="Clientes" 
        subtitle={`${(customers as Customer[]).length} registrados`}
        right={
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
              <input className="input pl-8 w-52 text-xs" placeholder="Buscar cliente..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <button onClick={() => setModalOpen(true)} className="btn-primary text-sm"><Plus size={13} /> Nuevo cliente</button>
          </div>
        }
      />

      <div className="mx-6 mt-4 card overflow-hidden">
        <div className="grid grid-cols-4 px-6 py-3 border-b border-surface-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted col-span-2">Cliente</span>
          <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted">Contacto</span>
          <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted text-right">Acciones</span>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16 text-sm text-ink-muted">Cargando clientes…</div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-2">
            <Users size={28} className="text-ink-muted" />
            <p className="text-sm text-ink-muted">Sin resultados</p>
          </div>
        ) : (
          <div className="divide-y divide-surface-3">
            {filtered.map(c => (
              <div key={c.id} className="grid grid-cols-4 items-center px-6 py-4 hover:bg-surface-2/50 transition-colors">
                <div className="col-span-2 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-accent">{c.name.charAt(0).toUpperCase()}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-ink-primary">{c.name}</p>
                    <p className="text-xs text-ink-muted">ID #{c.id}</p>
                  </div>
                </div>
                <div className="text-xs text-ink-secondary">
                  {c.phone && <p className="font-mono">{c.phone}</p>}
                  {c.email && <p>{c.email}</p>}
                  {!c.phone && !c.email && <span className="text-ink-muted">—</span>}
                </div>
                <div className="flex justify-end">
                  <button onClick={() => setDeleteTarget(c)} className="p-1.5 text-ink-muted hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors" title="Eliminar cliente">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <CustomerFormModal open={modalOpen} onClose={() => setModalOpen(false)} />
      <ConfirmModal 
        open={!!deleteTarget} 
        onClose={() => setDeleteTarget(null)} 
        onConfirm={() => { if(deleteTarget) deleteCustomer.mutate(deleteTarget.id); setDeleteTarget(null) }} 
        title="Eliminar cliente" 
        description={`¿Estás seguro de eliminar a "${deleteTarget?.name}"?`} 
        confirmLabel="Eliminar" 
        variant="danger" 
      />
    </div>
  )
}