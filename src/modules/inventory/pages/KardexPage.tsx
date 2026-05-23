import { useState } from 'react'
import { Search, ScrollText, Package, ChevronRight, TrendingUp, TrendingDown } from 'lucide-react'
import { useProducts, useKardex } from '../services/inventoryHooks'
import { useAppStore } from '../../../store/useAppStore'
import { formatDate, formatCurrency } from '../../../lib/utils'
import type { Product, KardexMovement } from '../services/types'
import SectionHeader from '../../../components/SectionHeader'

export default function KardexPage() {
  const { selectedCompany, selectedWarehouse } = useAppStore()
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [search, setSearch] = useState('')
  const { data: products = [] } = useProducts({ search: search || undefined })

  const { data: kardex = [], isLoading: loadingKardex } = useKardex(selectedProduct?.productCen)

  return (
    <div className="animate-fade-in">
      <SectionHeader 
        title="Kardex" 
        subtitle={selectedWarehouse ? `Almacén: ${selectedWarehouse.name}` : `Empresa: ${selectedCompany?.name} (Global)`} 
        right={selectedProduct && <button onClick={() => setSelectedProduct(null)} className="btn-ghost text-xs">← Cambiar Producto</button>} 
      />
      
      <div className="px-6 mt-4">
        {!selectedProduct ? (
          <div className="card overflow-hidden">
            <div className="px-5 py-4 border-b border-surface-4">
              <p className="text-xs text-ink-muted">Selecciona un producto para ver su historial de movimientos</p>
            </div>
            <div className="p-4 space-y-2">
               <div className="relative mb-4">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
                <input className="input pl-8 text-sm" placeholder="Buscar producto..." value={search} onChange={e => setSearch(e.target.value)} />
              </div>
              <div className="divide-y divide-surface-3">
                {products.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 gap-2"><Package size={24} className="text-ink-muted" /><p className="text-sm text-ink-muted">Sin productos encontrados</p></div>
                ) : products.map((p: Product) => (
                  <button key={p.productCen} onClick={() => setSelectedProduct(p)} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-surface-3 transition-colors text-left">
                    <div className="w-7 h-7 rounded-lg bg-accent/10 flex items-center justify-center shrink-0"><Package size={13} className="text-accent" /></div>
                    <div className="flex-1 min-w-0"><p className="text-sm font-medium text-ink-primary truncate">{p.name}</p><p className="text-xs text-ink-muted">{p.sku}</p></div>
                    <ChevronRight size={13} className="text-ink-muted shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4 animate-fade-in">
            <div className="card p-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center shrink-0"><ScrollText size={16} className="text-accent" /></div>
                <div>
                  <p className="text-sm font-medium text-ink-primary">{selectedProduct.name}</p>
                  <p className="text-xs font-mono text-ink-muted">
                    {selectedProduct.sku} {selectedWarehouse ? `· ${selectedWarehouse.name}` : ''}
                  </p>
                </div>
              </div>
            </div>


            <div className="card overflow-hidden mb-8">
              <div className="grid grid-cols-5 px-6 py-3 border-b border-surface-4">
                {['Fecha', 'Tipo', 'Cantidad', 'Costo', 'Motivo'].map(h => <span key={h} className="text-xs font-semibold uppercase tracking-wider text-ink-muted">{h}</span>)}
              </div>
              {loadingKardex ? (
                <div className="py-12 text-center text-sm text-ink-muted">Cargando movimientos…</div>
              ) : kardex.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 gap-2"><ScrollText size={24} className="text-ink-muted" /><p className="text-sm text-ink-muted">Sin movimientos registrados</p></div>
              ) : (
                <div className="divide-y divide-surface-3">
                  {kardex.map((e: KardexMovement) => {
                    const isEntry = e.movementType.includes('IN') || e.movementType.includes('INCREASE')
                    return (
                      <div key={e.movementCen} className="grid grid-cols-5 items-center px-6 py-3 hover:bg-surface-2/50 transition-colors">
                        <span className="text-xs text-ink-secondary">{formatDate(e.createdAt)}</span>
                        <div className="flex items-center gap-1.5">{isEntry ? <TrendingUp size={12} className="text-accent shrink-0" /> : <TrendingDown size={12} className="text-red-400 shrink-0" />}<span className="text-xs text-ink-secondary truncate">{e.movementType}</span></div>
                        <span className={`text-xs font-mono font-medium ${isEntry ? 'text-accent' : 'text-red-400'}`}>{isEntry ? `+${e.quantity}` : `-${e.quantity}`}</span>
                        <span className="text-xs font-mono text-ink-secondary">{formatCurrency(e.unitCost)}</span>
                        <span className="text-xs text-ink-muted truncate" title={e.reason}>{e.reason || '—'}</span>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
