import { useMemo, useState } from 'react'
import { Plus, Search, Trash2, UserCheck } from 'lucide-react'
import ConfirmModal from '../../../atoms/ConfirmModal'
import SectionHeader from '../../../components/SectionHeader'
import { useCreatePdvWaiter, useDeletePdvWaiter, usePdvWaiters } from '../services/pdvHooks'
import type { PdvWaiter } from '../services/types'

export default function PdvWaitersPage() {
  const { data: waiters = [], isLoading } = usePdvWaiters()
  const createWaiter = useCreatePdvWaiter()
  const deleteWaiter = useDeletePdvWaiter()

  const [search, setSearch] = useState('')
  const [name, setName] = useState('')
  const [deleteTarget, setDeleteTarget] = useState<PdvWaiter | null>(null)

  const filtered = useMemo(
    () =>
      (waiters as PdvWaiter[]).filter(waiter =>
        waiter.name.toLowerCase().includes(search.toLowerCase())
      ),
    [waiters, search]
  )

  const handleCreate = async () => {
    if (!name.trim()) return
    await createWaiter.mutateAsync({ name: name.trim() })
    setName('')
  }

  return (
    <div className="animate-fade-in">
      <SectionHeader
        title="Meseros"
        subtitle={`${(waiters as PdvWaiter[]).length} registrados`}
        right={
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
            <input
              className="input pl-8 w-52 text-xs"
              placeholder="Buscar mesero..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        }
      />

      <div className="mx-6 mt-4 card p-4 mb-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input
            className="input text-sm md:col-span-2"
            placeholder="Nombre del mesero"
            value={name}
            onChange={e => setName(e.target.value)}
          />
          <button
            onClick={handleCreate}
            disabled={!name.trim() || createWaiter.isPending}
            className="btn-primary text-sm justify-center"
          >
            {createWaiter.isPending ? (
              <span className="w-3 h-3 rounded-full border-2 border-surface-0/30 border-t-surface-0 animate-spin" />
            ) : (
              <Plus size={13} />
            )}
            Nuevo mesero
          </button>
        </div>
      </div>

      <div className="mx-6 mb-8 card overflow-hidden">
        <div className="grid grid-cols-2 px-6 py-3 border-b border-surface-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted">Mesero</span>
          <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted text-right">Acciones</span>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16 text-sm text-ink-muted">Cargando meseros…</div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-2">
            <UserCheck size={28} className="text-ink-muted" />
            <p className="text-sm text-ink-muted">Sin meseros registrados</p>
          </div>
        ) : (
          <div className="divide-y divide-surface-3">
            {filtered.map(waiter => (
              <div key={waiter.id} className="grid grid-cols-2 items-center px-6 py-4 hover:bg-surface-2/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                    <UserCheck size={14} className="text-accent" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-ink-primary">{waiter.name}</p>
                    <p className="text-xs text-ink-muted">ID #{waiter.id}</p>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => setDeleteTarget(waiter)}
                    className="p-1.5 text-ink-muted hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                    title="Eliminar mesero"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) deleteWaiter.mutate(deleteTarget.id)
          setDeleteTarget(null)
        }}
        title="Eliminar mesero"
        description={`¿Seguro que quieres eliminar al mesero "${deleteTarget?.name}"?`}
        confirmLabel="Eliminar"
        variant="danger"
      />
    </div>
  )
}
