import { useState, useMemo } from 'react'
import { Search, Boxes, ChevronRight } from 'lucide-react'
import { useStock } from '../services/inventoryHooks'
import { useAppStore } from '../../../store/useAppStore'
import type { StockItem } from '../services/types'
import StatCard from '../../../components/StatCard'
import SectionHeader from '../../../components/SectionHeader'
import Badge from '../../../atoms/Badge'

export default function StockPage() {
  const { selectedWarehouse } = useAppStore()
  const [search, setSearch] = useState('')
  const { data: stockList = [], isLoading } = useStock({ warehouseCen: selectedWarehouse?.warehouseCen })
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const filtered = useMemo(() => stockList.filter(s => {
    return s.productName.toLowerCase().includes(search.toLowerCase()) || 
           s.productCen.toLowerCase().includes(search.toLowerCase())
  }), [stockList, search])

  const stats = useMemo(() => ({
    totalSkus: stockList.length,
    disponible: stockList.reduce((a, s) => a + s.availableQuantity, 0),
    reservado: stockList.reduce((a, s) => a + s.reservedQuantity,  0),
    sinStock: stockList.filter(s => s.availableQuantity === 0).length,
  }), [stockList])

  return (
    <div className="animate-fade-in">
      <SectionHeader title="Stock" subtitle={selectedWarehouse?.name} right={
        <div className="relative">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
          <input className="input pl-8 w-52 text-xs" placeholder="Buscar producto o CEN..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      }/>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 px-6 mt-4">
        <StatCard label="Productos en Stock" value={stats.totalSkus} sub="en este almacén" />
        <StatCard label="Uds disponibles" value={stats.disponible} sub="listas para venta" />
        <StatCard label="Uds reservadas" value={stats.reservado} sub="en órdenes activas" />
        <StatCard label="Sin stock" value={stats.sinStock} sub="requieren reposición" variant={stats.sinStock > 0 ? 'danger' : 'default'} />
      </div>

      <div className="mx-6 mt-4 card overflow-hidden mb-8">
        <div className="hidden md:grid grid-cols-6 px-6 py-3 border-b border-surface-4">
          <span className="col-span-2 text-xs font-semibold uppercase tracking-wider text-ink-muted">Producto</span>
          <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted">Disponible</span>
          <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted">Reservado</span>
          <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted">Reorden</span>
          <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted text-right">Estado</span>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16 text-sm text-ink-muted">Cargando stock…</div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-2"><Boxes size={28} className="text-ink-muted" /><p className="text-sm text-ink-muted">Sin resultados</p></div>
        ) : (
          <div className="divide-y divide-surface-3">
            {filtered.map((s: StockItem) => {
              const isCritical = s.availableQuantity === 0
              const isLow = s.isLowStock

              return (
                <div key={s.productCen}>
                  <div 
                    className="grid grid-cols-1 md:grid-cols-6 items-center px-6 py-4 hover:bg-surface-2/50 transition-colors cursor-pointer"
                    onClick={() => setExpandedId(expandedId === s.productCen ? null : s.productCen)}
                  >
                    <div className="col-span-1 md:col-span-2 flex items-center gap-2 min-w-0">
                      <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${isCritical ? 'bg-red-400' : isLow ? 'bg-yellow-400' : 'bg-accent'}`} />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-ink-primary truncate">{s.productName}</p>
                        <p className="text-[10px] text-ink-muted font-mono">{s.productCen}</p>
                      </div>
                    </div>
                    <span className={`text-sm font-medium font-mono ${isCritical ? 'text-red-400' : isLow ? 'text-yellow-400' : 'text-accent'}`}>{s.availableQuantity}</span>
                    <span className="text-sm font-mono text-ink-secondary">{s.reservedQuantity}</span>
                    <span className="text-sm font-mono text-ink-secondary">{s.reorderLevel}</span>
                    <div className="col-span-1 md:col-span-1 flex items-center justify-end gap-2">
                      <Badge variant={isCritical ? 'red' : isLow ? 'yellow' : 'green'}>
                        {isCritical ? 'Sin Stock' : isLow ? 'Bajo' : 'OK'}
                      </Badge>
                      <ChevronRight size={13} className={`text-ink-muted transition-transform duration-200 ${expandedId === s.productCen ? 'rotate-90' : ''}`} />
                    </div>
                  </div>
                  {expandedId === s.productCen && (
                    <div className="px-6 py-4 bg-surface-1/60 border-t border-surface-3 animate-slide-up">
                      <div className="text-xs text-ink-secondary">
                        <p>Unidad: {s.unitName || 'No definida'}</p>
                        <p className="mt-1">CEN Almacén: {s.warehouseCen}</p>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
