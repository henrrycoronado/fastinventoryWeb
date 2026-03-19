import { useState, useMemo } from 'react'
import { Search, Tag } from 'lucide-react'
import { useGlobalCategories, useCompanyProducts } from '../../inventory/services/inventoryHooks' // Reutilizamos hooks de inventario
import type { GlobalCategory, CompanyProduct } from '../../inventory/services/types'
import SectionHeader from '../../../components/SectionHeader'

export default function SalesCategoriesPage() {
  const { data: categories = [], isLoading } = useGlobalCategories()
  const { data: products   = [] }            = useCompanyProducts()
  
  const [search, setSearch] = useState('')

  // Lógica de conteo reutilizada
  const usedCategoryIds = useMemo(() => {
    const ids = new Set<number>()
    ;(products as CompanyProduct[]).forEach(p => { if (p.globalProduct?.categoryId) ids.add(p.globalProduct.categoryId) })
    return ids
  }, [products])

  const productCountByCategory = useMemo(() => {
    const map: Record<number, number> = {}
    ;(products as CompanyProduct[]).forEach(p => { const catId = p.globalProduct?.categoryId; if (catId) map[catId] = (map[catId] ?? 0) + 1 })
    return map
  }, [products])

  const filtered = useMemo(() => 
    (categories as GlobalCategory[]).filter(c => c.name.toLowerCase().includes(search.toLowerCase())), 
  [categories, search])

  const sorted = useMemo(() => 
    [...filtered].sort((a, b) => (usedCategoryIds.has(b.id) ? 1 : 0) - (usedCategoryIds.has(a.id) ? 1 : 0)), 
  [filtered, usedCategoryIds])

  return (
    <div className="animate-fade-in">
      <SectionHeader
        title="Mis Categorías"
        subtitle={`${usedCategoryIds.size} categorías en uso por tu catálogo`}
        right={
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
            <input 
              className="input pl-8 w-52 text-xs" 
              placeholder="Buscar categoría..." 
              value={search} 
              onChange={e => setSearch(e.target.value)} 
            />
          </div>
        }
      />

      <div className="mx-6 mt-4 card overflow-hidden mb-8">
        {isLoading ? (
          <div className="flex justify-center py-16 text-ink-muted text-sm">Cargando categorías…</div>
        ) : sorted.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-2">
            <Tag size={28} className="text-ink-muted" />
            <p className="text-sm text-ink-muted">Sin categorías encontradas</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 px-6 py-3 border-b border-surface-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted">Categoría</span>
              <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted">Productos</span>
            </div>
            
            <div className="divide-y divide-surface-3">
              {sorted.map((cat: GlobalCategory) => {
                const inUse = usedCategoryIds.has(cat.id);
                const count = productCountByCategory[cat.id] ?? 0
                return (
                  <div key={cat.id} className="grid grid-cols-2 items-center px-6 py-4 hover:bg-surface-2/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${inUse ? 'bg-accent/10' : 'bg-surface-4'}`}>
                        <Tag size={13} className={inUse ? 'text-accent' : 'text-ink-muted'} />
                      </div>
                      <span className="text-sm font-medium text-ink-primary">{cat.name}</span>
                    </div>
                    <span className="text-sm text-ink-secondary">
                      {count > 0 ? `${count} producto${count > 1 ? 's' : ''}` : '—'}
                    </span>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>
    </div>
  )
}