import { useState, useMemo } from 'react'
import { Search, Users, Plus } from 'lucide-react'
import { useSuppliers, useCreateSupplier } from '../services/purchasesHooks'
import type { Supplier } from '../services/types'
import SectionHeader from '../../../components/SectionHeader'
import Modal from '../../../atoms/Modal'
import Button from '../../../atoms/Button'
import Input from '../../../atoms/Input'

export default function SuppliersPage() {
  const { data: suppliers = [], isLoading } = useSuppliers()
  const createSupplier = useCreateSupplier()

  const [search, setSearch]   = useState('')
  const [newName, setNewName] = useState('')
  const [modalOpen, setModalOpen] = useState(false)

  const filtered = useMemo(() => {
    return (suppliers as Supplier[]).filter(s => 
      s.name.toLowerCase().includes(search.toLowerCase()) || 
      s.supplierCen.toLowerCase().includes(search.toLowerCase())
    )
  }, [suppliers, search])

  const handleCreate = async () => {
    if (!newName.trim()) return
    await createSupplier.mutateAsync({ name: newName.trim() })
    setNewName(''); setModalOpen(false)
  }

  return (
    <div className="animate-fade-in">
      <SectionHeader 
        title="Proveedores" 
        subtitle={`${(suppliers as Supplier[]).length} registrados`}
        right={
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
              <input className="input pl-8 w-52 text-xs" placeholder="Buscar proveedor..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <button onClick={() => setModalOpen(true)} className="btn-primary text-sm"><Plus size={13} /> Nuevo proveedor</button>
          </div>
        }
      />

      <div className="mx-6 mt-4 card overflow-hidden">
        <div className="grid grid-cols-2 px-6 py-3 border-b border-surface-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted">Proveedor</span>
          <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted text-right">CEN</span>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16 text-sm text-ink-muted">Cargando proveedores…</div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-2">
            <Users size={28} className="text-ink-muted" />
            <p className="text-sm text-ink-muted">Sin resultados</p>
          </div>
        ) : (
          <div className="divide-y divide-surface-3">
            {filtered.map(s => (
              <div key={s.supplierCen} className="grid grid-cols-2 items-center px-6 py-4 hover:bg-surface-2/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-accent">{s.name.charAt(0).toUpperCase()}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-ink-primary">{s.name}</p>
                  </div>
                </div>
                <div className="text-xs text-ink-secondary text-right font-mono">
                  {s.supplierCen}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal 
        open={modalOpen} 
        onClose={() => setModalOpen(false)} 
        title="Nuevo proveedor" 
        size="sm"
      >
        <div className="space-y-4">
          <Input 
            label="Nombre del proveedor"
            placeholder="Ej: Insumos Global S.A." 
            value={newName} 
            onChange={e => setNewName(e.target.value)} 
            autoFocus 
          />
          <div className="flex justify-end gap-2">
            <Button onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button 
              variant="primary" 
              onClick={handleCreate} 
              loading={createSupplier.isPending}
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
