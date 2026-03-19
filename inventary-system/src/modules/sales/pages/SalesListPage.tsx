import { useState, useMemo } from 'react'
import { Search, ShoppingCart, ChevronRight } from 'lucide-react'
import { useSales } from '../services/salesHooks'
import { useAppStore } from '../../../store/useAppStore'
import { formatDate, formatCurrency } from '../../../lib/utils'
import type { Sale } from '../services/types'
import SectionHeader from '../../../components/SectionHeader'
import { SaleBadge, SaleExpanded } from '../components/SalesViews'

export default function SalesListPage() {
  const { selectedWarehouse } = useAppStore()
  const { data: sales = [], isLoading } = useSales()
  
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('ALL')
  const [expandedId, setExpandedId] = useState<number | null>(null)

  const filteredSales = useMemo(() => {
    let list = sales as Sale[]
    
    if (filterStatus !== 'ALL') {
      list = list.filter(s => s.status?.code === filterStatus)
    }

    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(s => 
        (s.customer?.name || '').toLowerCase().includes(q) ||
        (s.seller?.name || '').toLowerCase().includes(q)
      )
    }
    return list.sort((a, b) => new Date(b.saleDate).getTime() - new Date(a.saleDate).getTime())
  }, [sales, search, filterStatus])

  const statuses = [
    { code: 'ALL', name: 'Todas' },
    { code: 'CONFIRMED', name: 'Confirmadas' },
    { code: 'CANCELLED', name: 'Anuladas' },
    { code: 'DRAFT', name: 'Borradores' }
  ]

  return (
    <div className="animate-fade-in">
      <SectionHeader 
        title="Historial de Ventas" 
        subtitle={selectedWarehouse?.name}
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 py-4 border-b border-surface-3">
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 hide-scrollbar">
          {statuses.map(s => (
            <button 
              key={s.code} 
              onClick={() => setFilterStatus(s.code)} 
              className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs transition-colors ${
                filterStatus === s.code 
                  ? 'bg-accent/10 text-accent font-medium' 
                  : 'text-ink-secondary hover:bg-surface-3'
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>
        
        <div className="relative w-full sm:w-auto">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
          <input 
            className="input pl-8 text-xs w-full sm:w-64" 
            placeholder="Buscar por cliente o vendedor..." 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
          />
        </div>
      </div>

      <div className="mx-6 mt-4 card overflow-hidden mb-8">
        <div className="hidden md:grid grid-cols-12 px-6 py-3 border-b border-surface-4">
          <span className="col-span-3 text-xs font-semibold uppercase tracking-wider text-ink-muted">Fecha / Estado</span>
          <span className="col-span-3 text-xs font-semibold uppercase tracking-wider text-ink-muted">Cliente</span>
          <span className="col-span-3 text-xs font-semibold uppercase tracking-wider text-ink-muted">Vendedor</span>
          <span className="col-span-2 text-xs font-semibold uppercase tracking-wider text-ink-muted text-right">Total</span>
          <span className="col-span-1"></span>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16 text-sm text-ink-muted">Cargando historial de ventas…</div>
        ) : filteredSales.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-2">
            <ShoppingCart size={28} className="text-ink-muted" />
            <p className="text-sm text-ink-muted">No se encontraron ventas</p>
          </div>
        ) : (
          <div className="divide-y divide-surface-3">
            {filteredSales.map((sale: Sale) => {
              const isExpanded = expandedId === sale.id
              const total = sale.details?.reduce((acc, d) => acc + (d.subtotal || 0), 0) || 0
              
              return (
                <div key={sale.id}>
                  <div 
                    className="grid grid-cols-1 md:grid-cols-12 items-center gap-4 px-6 py-4 hover:bg-surface-2/50 transition-colors cursor-pointer" 
                    onClick={() => setExpandedId(isExpanded ? null : sale.id)}
                  >
                    <div className="col-span-1 md:col-span-3 flex flex-col items-start gap-1.5">
                      <span className="text-sm font-medium text-ink-primary">
                        {formatDate(sale.saleDate)}
                      </span>
                      <SaleBadge status={sale.status} />
                    </div>
                    
                    <div className="col-span-1 md:col-span-3">
                      <p className="text-sm text-ink-secondary truncate">
                        {sale.customer?.name || <span className="text-ink-muted italic">Consumidor Final</span>}
                      </p>
                    </div>
                    
                    <div className="col-span-1 md:col-span-3">
                      <p className="text-sm text-ink-secondary truncate">
                        {sale.seller?.name || <span className="text-ink-muted italic">Sin asignar</span>}
                      </p>
                    </div>
                    
                    <div className="col-span-1 md:col-span-2 text-left md:text-right">
                      <p className="text-sm font-mono font-bold text-ink-primary">
                        {formatCurrency(total)}
                      </p>
                      <p className="text-[10px] text-ink-muted">{sale.details?.length || 0} ítems</p>
                    </div>

                    <div className="col-span-1 flex justify-end">
                      <ChevronRight size={15} className={`text-ink-muted transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`} />
                    </div>
                  </div>
                  
                  {isExpanded && <SaleExpanded sale={sale} />}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}