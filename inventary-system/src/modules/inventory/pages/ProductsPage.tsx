import { useState } from 'react'
import { Search } from 'lucide-react'
import { useCompanyProducts, useGlobalProducts } from '../services/inventoryHooks'
import SectionHeader from '../../../components/SectionHeader'
import { MyCompanyView, GlobalView } from '../components/ProductViews'

export default function ProductsPage() {
  const [view, setView] = useState<'company' | 'global'>('company')
  const [search, setSearch] = useState('')
  const { data: products = [] } = useCompanyProducts()
  const { data: globalProducts = [] } = useGlobalProducts()

  return (
    <div className="animate-fade-in">
      <SectionHeader
        title="Productos"
        subtitle={view === 'company' ? `${(products as any[]).length} productos en tu catálogo` : `${(globalProducts as any[]).length} productos en catálogo global`}
        right={
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
              <input className="input pl-8 w-52 text-xs" placeholder="Buscar..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <div className="flex rounded-lg border border-surface-4 overflow-hidden text-xs">
              <button onClick={() => setView('company')} className={`px-3 py-2 transition-colors ${view === 'company' ? 'bg-accent/10 text-accent font-medium' : 'text-ink-secondary hover:bg-surface-3'}`}>Mi empresa</button>
              <button onClick={() => setView('global')} className={`px-3 py-2 transition-colors ${view === 'global' ? 'bg-accent/10 text-accent font-medium' : 'text-ink-secondary hover:bg-surface-3'}`}>Catálogo global</button>
            </div>
          </div>
        }
      />
      <div className="mx-6 mt-4 card overflow-hidden">
        {view === 'company' ? <MyCompanyView search={search} /> : <GlobalView search={search} />}
      </div>
    </div>
  )
}