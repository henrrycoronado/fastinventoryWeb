import { useMemo } from 'react'
import { Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'
import { Package, Boxes, AlertTriangle, TrendingDown } from 'lucide-react'
import { useAppStore } from '../../../store/useAppStore'
import { useStock, useInventoryDashboard, useProducts } from '../services/inventoryHooks'
import type { StockItem } from '../services/types'
import StatCard from '../../../components/StatCard'

const ACCENT_COLORS = ['var(--color-accent)', '#3b82f6', '#f97316', '#8b5cf6', '#f43f5e']

export default function InventoryDashboard() {
  const { selectedCompany, selectedWarehouse } = useAppStore()
  const { data: dashboardData } = useInventoryDashboard()
  const { data: stockList  = [] } = useStock()
  const { data: products   = [] } = useProducts()

  const totalProductos  = dashboardData?.totalProducts ?? products.length
  const totalDisponible = dashboardData?.totalStockQuantity ?? stockList.reduce((acc: number, s: StockItem) => acc + s.availableQuantity, 0)
  const sinStock        = dashboardData?.outOfStockCount ?? stockList.filter((s: StockItem) => s.availableQuantity === 0).length
  const stockBajo       = dashboardData?.lowStockCount ?? stockList.filter((s: StockItem) => s.isLowStock).length
  
  const stockByCategory = useMemo(() => {
    const map: Record<string, number> = {}
    stockList.forEach((s: StockItem) => { 
      const catName = s.productName.split(' ')[0] ?? 'General'; // Simplified for now since we don't have cat name directly in stockItem
      map[catName]  = (map[catName] ?? 0) + s.availableQuantity 
    })
    return Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([name, value]) => ({ name, value }))
  }, [stockList])

  const alertStock = useMemo(() => stockList.filter((s: StockItem) => s.isLowStock).sort((a: StockItem, b: StockItem) => a.availableQuantity - b.availableQuantity).slice(0, 8), [stockList])

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink-primary">Dashboard</h1>
        <p className="text-xs text-ink-muted mt-0.5">
          {selectedCompany?.name} {selectedWarehouse ? `· ${selectedWarehouse.name}` : '(Consolidado empresa)'}
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Productos" value={totalProductos} icon={Package} />
        <StatCard label="Unidades" value={totalDisponible} icon={Boxes} />
        <StatCard label="Stock bajo" value={stockBajo} icon={TrendingDown} variant="warn" />
        <StatCard label="Sin stock" value={sinStock} icon={AlertTriangle} variant="danger" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card p-5">
          <h2 className="font-display text-sm font-bold text-ink-secondary uppercase tracking-wider mb-3">Resumen de Inventario</h2>
          <div className="h-40 flex items-center justify-center text-sm text-ink-muted">
            <p>{selectedWarehouse ? `Monitoreo activo para ${selectedWarehouse.name}` : 'Consolidado de todas las bodegas'}</p>
          </div>
        </div>

        <div className="card p-5">
          <h2 className="font-display text-sm font-bold text-ink-secondary uppercase tracking-wider mb-3">Stock por producto</h2>
          {stockByCategory.length === 0 ? <div className="flex items-center justify-center h-40 text-sm text-ink-muted">Sin datos de stock</div> : (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={stockByCategory} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={75} innerRadius={40}>
                  {stockByCategory.map((_, i) => <Cell key={i} fill={ACCENT_COLORS[i % ACCENT_COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: 'var(--surface-3)', border: '1px solid var(--surface-5)', borderRadius: '8px', fontSize: '12px', color: 'var(--ink-primary)' }} />
                <Legend iconType="circle" iconSize={8} formatter={(value) => <span style={{ fontSize: '11px', color: 'var(--ink-secondary)' }}>{value}</span>} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div className="card">
          <div className="px-5 py-4 border-b border-surface-4"><h2 className="font-display text-sm font-bold text-ink-secondary uppercase tracking-wider">Alertas de stock</h2></div>
          {alertStock.length === 0 ? <div className="flex items-center justify-center py-8 text-sm text-ink-muted">Todo el stock está bien</div> : (
            <div className="divide-y divide-surface-3">
              {alertStock.map((s: StockItem) => {
                const isCritical = s.availableQuantity === 0
                return (
                  <div key={s.productCen} className="flex items-center justify-between px-5 py-3">
                    <div className="flex items-center gap-2 min-w-0"><div className={`w-1.5 h-1.5 rounded-full shrink-0 ${isCritical ? 'bg-red-400' : 'bg-yellow-400'}`} /><div className="min-w-0"><p className="text-xs font-medium text-ink-primary truncate">{s.productName}</p><p className="text-[10px] text-ink-muted font-mono">{s.productCen}</p></div></div>
                    <span className={`badge shrink-0 ml-2 ${isCritical ? 'bg-red-500/10 text-red-400' : 'bg-yellow-500/10 text-yellow-400'}`}>{s.availableQuantity} {s.unitName ?? 'uds'}</span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
