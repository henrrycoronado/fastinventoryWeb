import { useState, useMemo } from 'react'
import { Search, UserCheck, Plus, Trash2 } from 'lucide-react'
import { useSellers, useDeleteSeller } from '../services/salesHooks'
import type { Seller } from '../services/types'
import SectionHeader from '../../../components/SectionHeader'
import ConfirmModal from '../../../atoms/ConfirmModal'
import SellerFormModal from '../components/SellerFormModal'

export default function SellersPage() {
  const { data: sellers = [], isLoading } = useSellers()
  const deleteSeller = useDeleteSeller()

  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Seller | null>(null)

  const filtered = useMemo(() => {
    return (sellers as Seller[]).filter(s => 
      s.name.toLowerCase().includes(search.toLowerCase()) || 
      (s.phone && s.phone.includes(search))
    )
  }, [sellers, search])

  return (
    <div className="animate-fade-in">
      <SectionHeader 
        title="Vendedores" 
        subtitle={`${(sellers as Seller[]).length} registrados`}
        right={
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
              <input className="input pl-8 w-52 text-xs" placeholder="Buscar vendedor..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <button onClick={() => setModalOpen(true)} className="btn-primary text-sm"><Plus size={13} /> Nuevo vendedor</button>
          </div>
        }
      />

      <div className="mx-6 mt-4 card overflow-hidden">
        <div className="grid grid-cols-4 px-6 py-3 border-b border-surface-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted col-span-2">Vendedor</span>
          <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted">Teléfono</span>
          <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted text-right">Acciones</span>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16 text-sm text-ink-muted">Cargando vendedores…</div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-2">
            <UserCheck size={28} className="text-ink-muted" />
            <p className="text-sm text-ink-muted">Sin resultados</p>
          </div>
        ) : (
          <div className="divide-y divide-surface-3">
            {filtered.map(s => (
              <div key={s.id} className="grid grid-cols-4 items-center px-6 py-4 hover:bg-surface-2/50 transition-colors">
                <div className="col-span-2 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-surface-4 flex items-center justify-center shrink-0">
                    <UserCheck size={14} className="text-ink-muted" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-ink-primary">{s.name}</p>
                    <p className="text-xs text-ink-muted">ID #{s.id}</p>
                  </div>
                </div>
                <div className="text-xs text-ink-secondary">
                  {s.phone ? <span className="font-mono">{s.phone}</span> : <span className="text-ink-muted">—</span>}
                </div>
                <div className="flex justify-end">
                  <button onClick={() => setDeleteTarget(s)} className="p-1.5 text-ink-muted hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors" title="Eliminar vendedor">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <SellerFormModal open={modalOpen} onClose={() => setModalOpen(false)} />
      <ConfirmModal 
        open={!!deleteTarget} 
        onClose={() => setDeleteTarget(null)} 
        onConfirm={() => { if(deleteTarget) deleteSeller.mutate(deleteTarget.id); setDeleteTarget(null) }} 
        title="Eliminar vendedor" 
        description={`¿Estás seguro de eliminar a "${deleteTarget?.name}"?`} 
        confirmLabel="Eliminar" 
        variant="danger" 
      />
    </div>
  )
}