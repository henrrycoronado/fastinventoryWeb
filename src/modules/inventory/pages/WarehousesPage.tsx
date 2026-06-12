import { useState } from 'react'
import { Search, Warehouse, Plus } from 'lucide-react'
import { useWarehouses } from '../services'
import type { Warehouse as WarehouseType } from '../types'
import SectionHeader from '../../../core/components/SectionHeader'
import Modal from '../../../core/components/atoms/Modal'
import Button from '../../../core/components/atoms/Button'
import Input from '../../../core/components/atoms/Input'

export default function WarehousesPage() {
  const { data: warehouses = [], isLoading } = useWarehouses()
  const [search, setSearch]     = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [newName, setNewName]     = useState('')

  const filtered = warehouses.filter(w =>
    w.name.toLowerCase().includes(search.toLowerCase()) ||
    w.warehouseCen.toLowerCase().includes(search.toLowerCase())
  )

  const handleCreate = async () => {
    if (!newName.trim()) return
    setNewName(''); setModalOpen(false)
  }

  return (
    <div className="animate-fade-in">
      <SectionHeader
        title="Almacenes"
        subtitle={`${warehouses.length} almacenes registrados`}
        right={
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
              <input
                className="input pl-8 w-48 text-xs"
                placeholder="Buscar..."
                value={search}
                onChange={(e: any) => setSearch(e.target.value)}
              />
            </div>
            <button onClick={() => setModalOpen(true)} className="btn-primary text-sm">
              <Plus size={13} /> Nuevo almacén
            </button>
          </div>
        }
      />

      <div className="mx-6 mt-4 card overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center py-16 text-ink-muted text-sm">Cargando almacenes…</div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-2">
            <Warehouse size={28} className="text-ink-muted" />
            <p className="text-sm text-ink-muted">Sin almacenes encontrados</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 px-6 py-3 border-b border-surface-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted">Almacén</span>
              <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted">CEN</span>
            </div>
            <div className="divide-y divide-surface-3">
              {filtered.map((w: WarehouseType) => (
                <div key={w.warehouseCen} className="grid grid-cols-2 items-center px-6 py-4 hover:bg-surface-2/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 bg-accent/10">
                      <Warehouse size={13} className="text-accent" />
                    </div>
                    <span className="text-sm font-medium text-ink-primary">{w.name}</span>
                  </div>
                  <span className="text-sm font-mono text-ink-secondary">{w.warehouseCen}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Nuevo Almacén" size="sm">
        <div className="space-y-4">
          <Input
            label="Nombre del Almacén"
            placeholder="Ej: Bodega Principal"
            value={newName}
            onChange={(e: any) => setNewName(e.target.value)}
            autoFocus
          />
          <div className="flex justify-end gap-2">
            <Button onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button
              variant="primary"
              onClick={handleCreate}
              disabled={!newName.trim()}
            >
              Registrar
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}