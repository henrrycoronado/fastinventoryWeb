import { useMemo, useState } from 'react'
import { Plus, Search, Table2, Trash2, Users } from 'lucide-react'
import ConfirmModal from '../../../atoms/ConfirmModal'
import SectionHeader from '../../../components/SectionHeader'
import { useCreatePdvTable, useDeletePdvTable, usePdvTables } from '../services/pdvHooks'
import type { PdvTable } from '../services/types'

export default function PdvTablesPage() {
  const { data: tables = [], isLoading } = usePdvTables()
  const createTable = useCreatePdvTable()
  const deleteTable = useDeletePdvTable()

  const [search, setSearch] = useState('')
  const [name, setName] = useState('')
  const [capacity, setCapacity] = useState('')
  const [deleteTarget, setDeleteTarget] = useState<PdvTable | null>(null)

  const filtered = useMemo(
    () =>
      (tables as PdvTable[]).filter(table =>
        table.name.toLowerCase().includes(search.toLowerCase())
      ),
    [tables, search]
  )

  const resetForm = () => {
    setName('')
    setCapacity('')
  }

  const handleCreate = async () => {
    if (!name.trim()) return

    await createTable.mutateAsync({
      name: name.trim(),
      capacity: capacity.trim() ? Number(capacity) : null,
    })

    resetForm()
  }

  return (
    <div className="animate-fade-in">
      <SectionHeader
        title="Mesas"
        subtitle={`${(tables as PdvTable[]).length} registradas`}
        right={
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
              <input
                className="input pl-8 w-52 text-xs"
                placeholder="Buscar mesa..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>
        }
      />

      <div className="mx-6 mt-4 card p-4 mb-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input
            className="input text-sm"
            placeholder="Nombre de mesa"
            value={name}
            onChange={e => setName(e.target.value)}
          />
          <input
            className="input text-sm"
            type="number"
            min="1"
            placeholder="Capacidad (opcional)"
            value={capacity}
            onChange={e => setCapacity(e.target.value)}
          />
          <button
            onClick={handleCreate}
            disabled={!name.trim() || createTable.isPending}
            className="btn-primary text-sm justify-center"
          >
            {createTable.isPending ? (
              <span className="w-3 h-3 rounded-full border-2 border-surface-0/30 border-t-surface-0 animate-spin" />
            ) : (
              <Plus size={13} />
            )}
            Nueva mesa
          </button>
        </div>
      </div>

      <div className="mx-6 mb-8 card overflow-hidden">
        <div className="grid grid-cols-3 px-6 py-3 border-b border-surface-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted">Mesa</span>
          <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted">Capacidad</span>
          <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted text-right">Acciones</span>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16 text-sm text-ink-muted">Cargando mesas…</div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-2">
            <Table2 size={28} className="text-ink-muted" />
            <p className="text-sm text-ink-muted">Sin mesas registradas</p>
          </div>
        ) : (
          <div className="divide-y divide-surface-3">
            {filtered.map(table => (
              <div key={table.id} className="grid grid-cols-3 items-center px-6 py-4 hover:bg-surface-2/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                    <Table2 size={14} className="text-accent" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-ink-primary">{table.name}</p>
                    <p className="text-xs text-ink-muted">ID #{table.id}</p>
                  </div>
                </div>

                <div className="text-sm text-ink-secondary flex items-center gap-2">
                  <Users size={13} className="text-ink-muted" />
                  {table.capacity ?? '—'}
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => setDeleteTarget(table)}
                    className="p-1.5 text-ink-muted hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                    title="Eliminar mesa"
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
          if (deleteTarget) deleteTable.mutate(deleteTarget.id)
          setDeleteTarget(null)
        }}
        title="Eliminar mesa"
        description={`¿Seguro que quieres eliminar la mesa "${deleteTarget?.name}"?`}
        confirmLabel="Eliminar"
        variant="danger"
      />
    </div>
  )
}
