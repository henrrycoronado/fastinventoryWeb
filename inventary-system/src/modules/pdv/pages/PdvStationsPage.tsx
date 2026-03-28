import { useMemo, useState } from 'react'
import { ChefHat, Plus, Search, Trash2 } from 'lucide-react'
import ConfirmModal from '../../../atoms/ConfirmModal'
import SectionHeader from '../../../components/SectionHeader'
import { useCreatePdvStation, useDeletePdvStation, usePdvStations } from '../services/pdvHooks'
import type { PdvStation } from '../services/types'

export default function PdvStationsPage() {
  const { data: stations = [], isLoading } = usePdvStations()
  const createStation = useCreatePdvStation()
  const deleteStation = useDeletePdvStation()

  const [search, setSearch] = useState('')
  const [name, setName] = useState('')
  const [deleteTarget, setDeleteTarget] = useState<PdvStation | null>(null)

  const filtered = useMemo(
    () =>
      (stations as PdvStation[]).filter(station =>
        station.name.toLowerCase().includes(search.toLowerCase())
      ),
    [stations, search]
  )

  const handleCreate = async () => {
    if (!name.trim()) return
    await createStation.mutateAsync({ name: name.trim() })
    setName('')
  }

  return (
    <div className="animate-fade-in">
      <SectionHeader
        title="Estaciones"
        subtitle={`${(stations as PdvStation[]).length} registradas`}
        right={
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
            <input
              className="input pl-8 w-52 text-xs"
              placeholder="Buscar estación..."
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
            placeholder="Nombre de estación"
            value={name}
            onChange={e => setName(e.target.value)}
          />
          <button
            onClick={handleCreate}
            disabled={!name.trim() || createStation.isPending}
            className="btn-primary text-sm justify-center"
          >
            {createStation.isPending ? (
              <span className="w-3 h-3 rounded-full border-2 border-surface-0/30 border-t-surface-0 animate-spin" />
            ) : (
              <Plus size={13} />
            )}
            Nueva estación
          </button>
        </div>
      </div>

      <div className="mx-6 mb-8 card overflow-hidden">
        <div className="grid grid-cols-2 px-6 py-3 border-b border-surface-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted">Estación</span>
          <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted text-right">Acciones</span>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16 text-sm text-ink-muted">Cargando estaciones…</div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-2">
            <ChefHat size={28} className="text-ink-muted" />
            <p className="text-sm text-ink-muted">Sin estaciones registradas</p>
          </div>
        ) : (
          <div className="divide-y divide-surface-3">
            {filtered.map(station => (
              <div key={station.id} className="grid grid-cols-2 items-center px-6 py-4 hover:bg-surface-2/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                    <ChefHat size={14} className="text-accent" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-ink-primary">{station.name}</p>
                    <p className="text-xs text-ink-muted">ID #{station.id}</p>
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={() => setDeleteTarget(station)}
                    className="p-1.5 text-ink-muted hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                    title="Eliminar estación"
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
          if (deleteTarget) deleteStation.mutate(deleteTarget.id)
          setDeleteTarget(null)
        }}
        title="Eliminar estación"
        description={`¿Seguro que quieres eliminar la estación "${deleteTarget?.name}"?`}
        confirmLabel="Eliminar"
        variant="danger"
      />
    </div>
  )
}
