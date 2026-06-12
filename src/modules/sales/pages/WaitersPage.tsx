import { useState, useMemo } from 'react'
import { Search, UserCheck, Plus } from 'lucide-react'
import { useWaiters, useCreateWaiter } from '../services'
import SectionHeader from '../../../core/components/SectionHeader'
import Modal from '../../../core/components/atoms/Modal'
import Button from '../../../core/components/atoms/Button'
import Input from '../../../core/components/atoms/Input'

export default function WaitersPage() {
  const { data: waiters = [], isLoading } = useWaiters()
  const createWaiter = useCreateWaiter()

  const [search, setSearch]   = useState('')
  const [newName, setNewName] = useState('')
  const [modalOpen, setModalOpen] = useState(false)

  const filtered = useMemo(() => {
    return waiters.filter(w =>
      w.name.toLowerCase().includes(search.toLowerCase()) ||
      w.waiterCen.toLowerCase().includes(search.toLowerCase())
    )
  }, [waiters, search])

  const handleCreate = async () => {
    if (!newName.trim()) return
    await createWaiter.mutateAsync({ name: newName.trim() })
    setNewName(''); setModalOpen(false)
  }

  return (
    <div className="animate-fade-in">
      <SectionHeader
        title="Meseros"
        subtitle={`${waiters.length} registrados`}
        right={
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
              <input className="input pl-8 w-52 text-xs" placeholder="Buscar mesero..." value={search} onChange={(e: any) => setSearch(e.target.value)} />
            </div>
            <button onClick={() => setModalOpen(true)} className="btn-primary text-sm"><Plus size={13} /> Nuevo mesero</button>
          </div>
        }
      />

      <div className="mx-6 mt-4 card overflow-hidden">
        <div className="grid grid-cols-2 px-6 py-3 border-b border-surface-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted">Nombre</span>
          <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted text-right">CEN</span>
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
            {filtered.map(w => (
              <div key={w.waiterCen} className="grid grid-cols-2 items-center px-6 py-4 hover:bg-surface-2/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-surface-4 flex items-center justify-center shrink-0">
                    <UserCheck size={14} className="text-ink-muted" />
                  </div>
                  <p className="text-sm font-medium text-ink-primary">{w.name}</p>
                </div>
                <div className="text-xs text-ink-secondary text-right font-mono">
                  {w.waiterCen}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Registrar Mesero" size="sm">
        <div className="space-y-4">
          <Input
            label="Nombre del mesero"
            placeholder="Ej: Marco Polo"
            value={newName}
            onChange={(e: any) => setNewName(e.target.value)}
            autoFocus
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button variant="primary" onClick={handleCreate} disabled={!newName.trim()} loading={createWaiter.isPending}>
              Registrar
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}