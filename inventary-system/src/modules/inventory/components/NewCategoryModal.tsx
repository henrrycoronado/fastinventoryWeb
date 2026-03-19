import { useState, useMemo } from 'react'
import { Tag, Plus, X } from 'lucide-react'
import { useGlobalCategories, useCreateGlobalCategory } from '../services/inventoryHooks'
import type { GlobalCategory } from '../services/types'

export default function NewCategoryModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { data: categories = [] } = useGlobalCategories()
  const createCategory = useCreateGlobalCategory()
  const [name, setName] = useState('')

  const suggestions = useMemo(() => {
    if (name.length < 2) return []
    return (categories as GlobalCategory[]).filter(c => c.name.toLowerCase().includes(name.toLowerCase()))
  }, [name, categories])

  const handleCreate = async () => {
    if (!name.trim()) return
    await createCategory.mutateAsync({ name: name.trim() })
    setName(''); onClose()
  }

  const handleClose = () => { setName(''); onClose() }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose} />
      <div className="relative w-full max-w-sm card animate-slide-up">
        <div className="flex items-center justify-between px-5 py-4 border-b border-surface-4">
          <h2 className="font-display font-bold text-base text-ink-primary">Nueva categoría</h2>
          <button onClick={handleClose} className="btn-ghost !px-2 !py-1.5"><X size={15} /></button>
        </div>
        <div className="px-5 py-4 space-y-4">
          <div>
            <label className="label">Nombre</label>
            <input className="input" placeholder="Ej: Calzado Deportivo" value={name} onChange={e => setName(e.target.value)} autoFocus />
          </div>
          {suggestions.length > 0 && (
            <div>
              <p className="text-xs text-yellow-400 mb-2">Categorías similares ya existentes:</p>
              <div className="space-y-1">
                {suggestions.map((c: GlobalCategory) => (
                  <div key={c.id} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-yellow-500/5 border border-yellow-500/20">
                    <Tag size={12} className="text-yellow-400 shrink-0" /><span className="text-xs text-ink-secondary">{c.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="flex justify-end gap-2 pt-1">
            <button onClick={handleClose} className="btn-ghost text-sm">Cancelar</button>
            <button onClick={handleCreate} disabled={!name.trim() || createCategory.isPending} className="btn-primary text-sm">
              {createCategory.isPending ? <span className="w-3 h-3 rounded-full border-2 border-surface-0/30 border-t-surface-0 animate-spin" /> : <Plus size={13} />} Crear categoría
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}