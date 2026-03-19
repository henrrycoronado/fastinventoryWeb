import { useState, useMemo } from 'react'
import { ArrowLeftRight, ChevronRight, Plus } from 'lucide-react'
import { useMovements } from '../services/inventoryHooks'
import { useAppStore } from '../../../store/useAppStore'
import { formatDate } from '../../../lib/utils'
import type { Movement } from '../services/types'
import { MovementBadge, MovementExpanded, NewMovementModal } from '../components/MovementModals'
import SectionHeader from '../../../components/SectionHeader'

type MovementCategory = 'all' | 'incoming' | 'outgoing' | 'transfer'

export default function MovementsPage() {
  const { selectedWarehouse } = useAppStore()
  const { data: movements = [], isLoading } = useMovements()
  const [filter, setFilter] = useState<MovementCategory>('all')
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  const filtered = useMemo(() => {
    const list = movements as Movement[]
    if (filter === 'incoming') return list.filter(m => [1, 3, 6].includes(m.typeId))
    if (filter === 'outgoing') return list.filter(m => [2, 4].includes(m.typeId))
    if (filter === 'transfer') return list.filter(m => [5, 6].includes(m.typeId))
    return list
  }, [movements, filter])

  const sorted = useMemo(() => [...filtered].sort((a, b) => new Date(b.movementDate).getTime() - new Date(a.movementDate).getTime()), [filtered])

  const filters: { key: MovementCategory; label: string }[] = [
    { key: 'all', label: 'Todos' }, { key: 'incoming', label: 'Entradas' },
    { key: 'outgoing', label: 'Salidas' }, { key: 'transfer', label: 'Traspasos' },
  ]

  return (
    <div className="animate-fade-in">
      <SectionHeader
        title="Movimientos"
        subtitle={selectedWarehouse?.name}
        right={<button onClick={() => setModalOpen(true)} className="btn-primary text-sm"><Plus size={13} /> Nuevo movimiento</button>}
      />

      <div className="flex items-center gap-1 px-6 py-3 border-b border-surface-3">
        {filters.map(f => (
          <button key={f.key} onClick={() => setFilter(f.key)} className={`px-3 py-1.5 rounded-lg text-xs transition-colors ${filter === f.key ? 'bg-accent/10 text-accent font-medium' : 'text-ink-secondary hover:bg-surface-3'}`}>
            {f.label}
          </button>
        ))}
        <span className="ml-auto text-xs text-ink-muted">{sorted.length} registros</span>
      </div>

      <div className="mx-6 mt-4 card overflow-hidden">
        <div className="grid grid-cols-5 px-6 py-3 border-b border-surface-4">
          {['Tipo', 'Fecha', 'Warehouse', 'Ítems', 'Notas'].map(h => <span key={h} className="text-xs font-semibold uppercase tracking-wider text-ink-muted">{h}</span>)}
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16 text-sm text-ink-muted">Cargando movimientos…</div>
        ) : sorted.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-2"><ArrowLeftRight size={28} className="text-ink-muted" /><p className="text-sm text-ink-muted">Sin movimientos registrados</p></div>
        ) : (
          <div className="divide-y divide-surface-3">
            {sorted.map((m: Movement) => {
              const isExpanded = expandedId === m.id
              return (
                <div key={m.id}>
                  <div className="grid grid-cols-5 items-center px-6 py-4 hover:bg-surface-2/50 transition-colors cursor-pointer" onClick={() => setExpandedId(isExpanded ? null : m.id)}>
                    <MovementBadge typeId={m.typeId} />
                    <span className="text-xs text-ink-secondary">{formatDate(m.movementDate)}</span>
                    <span className="text-xs text-ink-secondary">{selectedWarehouse?.name}</span>
                    <span className="text-xs text-ink-secondary">{m.details?.length ?? 0} ítem(s)</span>
                    <div className="flex items-center justify-between"><span className="text-xs text-ink-muted truncate max-w-[120px]">{m.notes ?? '—'}</span><ChevronRight size={13} className={`text-ink-muted transition-transform duration-200 shrink-0 ${isExpanded ? 'rotate-90' : ''}`} /></div>
                  </div>
                  {isExpanded && <MovementExpanded movement={m} />}
                </div>
              )
            })}
          </div>
        )}
      </div>

      <NewMovementModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  )
}