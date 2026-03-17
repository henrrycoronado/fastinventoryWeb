import { useState, useMemo } from 'react'
import { Search, Tag, Plus, X } from 'lucide-react'
import { useGlobalCategories, useCreateGlobalCategory, useCompanyProducts } from '../services/inventoryHooks'
import type { GlobalCategory, CompanyProduct } from '../services/types'

function NewCategoryModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { data: categories = [] } = useGlobalCategories()
  const createCategory = useCreateGlobalCategory()
  const [name, setName] = useState('')

  const suggestions = useMemo(() => {
    if (name.length < 2) return []
    return (categories as GlobalCategory[]).filter(c =>
      c.name.toLowerCase().includes(name.toLowerCase())
    )
  }, [name, categories])

  const handleCreate = async () => {
    if (!name.trim()) return
    await createCategory.mutateAsync({ name: name.trim() })
    setName('')
    onClose()
  }

  const handleClose = () => {
    setName('')
    onClose()
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose} />
      <div className="relative w-full max-w-sm card animate-slide-up">

        <div className="flex items-center justify-between px-5 py-4 border-b border-surface-4">
          <h2 className="font-display font-bold text-base text-ink-primary">Nueva categoría</h2>
          <button onClick={handleClose} className="btn-ghost !px-2 !py-1.5">
            <X size={15} />
          </button>
        </div>

        <div className="px-5 py-4 space-y-4">
          <div>
            <label className="label">Nombre</label>
            <input
              className="input"
              placeholder="Ej: Calzado Deportivo"
              value={name}
              onChange={e => setName(e.target.value)}
              autoFocus
            />
          </div>

          {suggestions.length > 0 && (
            <div>
              <p className="text-xs text-yellow-400 mb-2">
                Categorías similares ya existentes:
              </p>
              <div className="space-y-1">
                {suggestions.map((c: GlobalCategory) => (
                  <div key={c.id} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-yellow-500/5 border border-yellow-500/20">
                    <Tag size={12} className="text-yellow-400 shrink-0" />
                    <span className="text-xs text-ink-secondary">{c.name}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-ink-muted mt-2">
                Puedes continuar si ninguna se adecúa a lo que buscas.
              </p>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-1">
            <button onClick={handleClose} className="btn-ghost text-sm">
              Cancelar
            </button>
            <button
              onClick={handleCreate}
              disabled={!name.trim() || createCategory.isPending}
              className="btn-primary text-sm"
            >
              {createCategory.isPending
                ? <span className="w-3 h-3 rounded-full border-2 border-surface-0/30 border-t-surface-0 animate-spin" />
                : <Plus size={13} />
              }
              Crear categoría
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}

export default function CategoriesPage() {
  const { data: categories = [], isLoading } = useGlobalCategories()
  const { data: products   = [] }            = useCompanyProducts()
  const [search,   setSearch]   = useState('')
  const [modalOpen, setModalOpen] = useState(false)

  // derivar cuáles categorías usa mi company
  const usedCategoryIds = useMemo(() => {
    const ids = new Set<number>()
    ;(products as CompanyProduct[]).forEach(p => {
      if (p.globalProduct?.categoryId) ids.add(p.globalProduct.categoryId)
    })
    return ids
  }, [products])

  // contar productos por categoría
  const productCountByCategory = useMemo(() => {
    const map: Record<number, number> = {}
    ;(products as CompanyProduct[]).forEach(p => {
      const catId = p.globalProduct?.categoryId
      if (catId) map[catId] = (map[catId] ?? 0) + 1
    })
    return map
  }, [products])

  const filtered = useMemo(() =>
    (categories as GlobalCategory[]).filter(c =>
      c.name.toLowerCase().includes(search.toLowerCase())
    ),
    [categories, search]
  )

  // ordenar: primero las que están en uso
  const sorted = useMemo(() =>
    [...filtered].sort((a, b) => {
      const aUsed = usedCategoryIds.has(a.id) ? 1 : 0
      const bUsed = usedCategoryIds.has(b.id) ? 1 : 0
      return bUsed - aUsed
    }),
    [filtered, usedCategoryIds]
  )

  return (
    <div className="animate-fade-in">

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-surface-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink-primary">Categorías</h1>
          <p className="text-xs text-ink-muted mt-0.5">
            {usedCategoryIds.size} en uso · {(categories as GlobalCategory[]).length} en catálogo global
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
            <input
              className="input pl-8 w-48 text-xs"
              placeholder="Buscar categoría..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <button onClick={() => setModalOpen(true)} className="btn-primary text-sm">
            <Plus size={13} /> Nueva categoría
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="mx-6 mt-4 card overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center py-16 text-ink-muted text-sm">
            Cargando categorías…
          </div>
        ) : sorted.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-2">
            <Tag size={28} className="text-ink-muted" />
            <p className="text-sm text-ink-muted">Sin categorías encontradas</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-3 px-6 py-3 border-b border-surface-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted">Categoría</span>
              <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted">Productos en mi empresa</span>
              <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted">Estado</span>
            </div>
            <div className="divide-y divide-surface-3">
              {sorted.map((cat: GlobalCategory) => {
                const inUse  = usedCategoryIds.has(cat.id)
                const count  = productCountByCategory[cat.id] ?? 0
                return (
                  <div key={cat.id} className="grid grid-cols-3 items-center px-6 py-4 hover:bg-surface-2/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                        inUse ? 'bg-accent/10' : 'bg-surface-4'
                      }`}>
                        <Tag size={13} className={inUse ? 'text-accent' : 'text-ink-muted'} />
                      </div>
                      <span className="text-sm font-medium text-ink-primary">{cat.name}</span>
                    </div>
                    <span className="text-sm text-ink-secondary">
                      {count > 0 ? `${count} producto${count > 1 ? 's' : ''}` : '—'}
                    </span>
                    <div>
                      {inUse
                        ? <span className="badge bg-accent/10 text-accent">En uso</span>
                        : <span className="badge bg-surface-4 text-ink-muted">Global</span>
                      }
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>

      <NewCategoryModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  )
}