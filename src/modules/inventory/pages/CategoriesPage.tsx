import { useState } from 'react'
import { Search, Tag, Plus } from 'lucide-react'
import { useCategories, useCreateCategory } from '../services'
import type { Category } from '../types'
import SectionHeader from '../../../core/components/SectionHeader'
import Modal from '../../../core/components/atoms/Modal'
import Button from '../../../core/components/atoms/Button'
import Input from '../../../core/components/atoms/Input'

export default function CategoriesPage() {
  const { data: categories = [], isLoading } = useCategories()
  const createCategory = useCreateCategory()
  
  const [search, setSearch]     = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [newName, setNewName]     = useState('')

  const filtered = categories.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    (c.description && c.description.toLowerCase().includes(search.toLowerCase()))
  )

  const handleCreate = async () => {
    if (!newName.trim()) return
    await createCategory.mutateAsync({ name: newName.trim() })
    setNewName(''); setModalOpen(false)
  }

  return (
    <div className="animate-fade-in">
      <SectionHeader
        title="Categorías"
        subtitle={`${categories.length} categorías registradas`}
        right={
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
              <input className="input pl-8 w-48 text-xs" placeholder="Buscar..." value={search} onChange={(e: any) => setSearch(e.target.value)} />
            </div>
            <button onClick={() => setModalOpen(true)} className="btn-primary text-sm"><Plus size={13} /> Nueva categoría</button>
          </div>
        }
      />

      <div className="mx-6 mt-4 card overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center py-16 text-ink-muted text-sm">Cargando categorías…</div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-2">
            <Tag size={28} className="text-ink-muted" />
            <p className="text-sm text-ink-muted">Sin categorías encontradas</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 px-6 py-3 border-b border-surface-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted">Categoría</span>
              <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted">Descripción</span>
            </div>
            <div className="divide-y divide-surface-3">
              {filtered.map((cat: Category) => (
                <div key={cat.categoryCen} className="grid grid-cols-2 items-center px-6 py-4 hover:bg-surface-2/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 bg-accent/10">
                      <Tag size={13} className="text-accent" />
                    </div>
                    <span className="text-sm font-medium text-ink-primary">{cat.name}</span>
                  </div>
                  <span className="text-sm text-ink-secondary">{cat.description || '—'}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Nueva Categoría" size="sm">
        <div className="space-y-4">
          <Input 
            label="Nombre" 
            placeholder="Ej: Electrónica" 
            value={newName} 
            onChange={(e: any) => setNewName(e.target.value)} 
            autoFocus 
          />
          <div className="flex justify-end gap-2">
            <Button onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button 
              variant="primary" 
              onClick={handleCreate} 
              loading={createCategory.isPending}
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
