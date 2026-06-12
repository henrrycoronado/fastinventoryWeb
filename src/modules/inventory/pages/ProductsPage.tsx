import { useState } from 'react'
import { Search, Plus } from 'lucide-react'
import { useProducts } from '../services'
import SectionHeader from '../../../core/components/SectionHeader'
import { ProductListView } from '../components/ProductViews'
import Modal from '../../../core/components/atoms/Modal'
import ProductForm from '../components/ProductCreation'

export default function ProductsPage() {
  const [search, setSearch] = useState('')
  const { data: products = [] } = useProducts({ search: search || undefined })
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <div className="animate-fade-in">
      <SectionHeader
        title="Productos"
        subtitle={`${products.length} productos en el catálogo`}
        right={
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
              <input className="input pl-8 w-52 text-xs" placeholder="Buscar..." value={search} onChange={(e: any) => setSearch(e.target.value)} />
            </div>
            <button onClick={() => setModalOpen(true)} className="btn-primary text-sm">
              <Plus size={13} /> Nuevo producto
            </button>
          </div>
        }
      />
      <div className="mx-6 mt-4 card overflow-hidden">
        <ProductListView search={search} />
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Nuevo Producto" size="lg">
        <ProductForm onSuccess={() => setModalOpen(false)} />
      </Modal>
    </div>
  )
}
