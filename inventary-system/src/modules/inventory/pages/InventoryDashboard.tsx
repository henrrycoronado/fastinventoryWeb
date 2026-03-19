import { useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'
import { Package, Boxes, AlertTriangle, TrendingDown } from 'lucide-react'
import { useAppStore } from '../../../store/useAppStore'
import { useStock, useMovements, useCompanyProducts } from '../services/inventoryHooks'
import { LOW_STOCK_THRESHOLD } from '../../../config/constants'
import type { Stock, Movement } from '../services/types'
import StatCard from '../../../components/StatCard'

const ACCENT_COLORS = ['var(--color-accent)', '#3b82f6', '#f97316', '#8b5cf6', '#f43f5e']

export default function InventoryDashboard() {
  const { selectedCompany, selectedWarehouse } = useAppStore()
  const { data: stockList  = [] } = useStock()
  const { data: movements  = [] } = useMovements()
  const { data: products   = [] } = useCompanyProducts()

  const totalProductos  = products.length
  const totalDisponible = stockList.reduce((acc: number, s: Stock) => acc + s.availableQuantity, 0)
  const sinStock        = stockList.filter((s: Stock) => s.availableQuantity === 0).length
  const stockBajo       = stockList.filter((s: Stock) => s.availableQuantity > 0 && s.availableQuantity <= LOW_STOCK_THRESHOLD).length
  
  const MOVEMENT_TYPE_LABELS: Record<number, { label: string; isEntry: boolean }> = {
    1: { label: 'Entrada por Compra',  isEntry: true  }, 2: { label: 'Salida por Venta',    isEntry: false },
    3: { label: 'Ajuste Positivo',     isEntry: true  }, 4: { label: 'Ajuste Negativo',     isEntry: false },
    5: { label: 'Traspaso Salida',     isEntry: false }, 6: { label: 'Traspaso Entrada',    isEntry: true  },
  }

  const movementsByType = useMemo(() => {
    const map: Record<number, number> = {}
    ;(movements as Movement[]).forEach(m => { map[m.typeId] = (map[m.typeId] ?? 0) + 1 })
    return Object.entries(map).map(([typeId, value]) => ({ name: MOVEMENT_TYPE_LABELS[Number(typeId)]?.label ?? `Tipo ${typeId}`, value }))
  }, [movements])

  const stockByCategory = useMemo(() => {
    const map: Record<string, number> = {}
    stockList.forEach((s: Stock) => { const catName = s.sku?.companyProduct?.globalProduct?.category?.name ?? 'Sin categoría'; map[catName]  = (map[catName] ?? 0) + s.availableQuantity })
    return Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([name, value]) => ({ name, value }))
  }, [stockList])

  const recentMovements = useMemo(() => [...movements].sort((a: Movement, b: Movement) => new Date(b.movementDate).getTime() - new Date(a.movementDate).getTime()).slice(0, 5), [movements])
  const alertStock = useMemo(() => stockList.filter((s: Stock) => s.availableQuantity <= LOW_STOCK_THRESHOLD).sort((a: Stock, b: Stock) => a.availableQuantity - b.availableQuantity).slice(0, 8), [stockList])

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink-primary">Dashboard</h1>
        <p className="text-xs text-ink-muted mt-0.5">{selectedCompany?.name} · {selectedWarehouse?.name}</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Productos" value={totalProductos} icon={Package} />
        <StatCard label="Unidades" value={totalDisponible} icon={Boxes} />
        <StatCard label="Stock bajo" value={stockBajo} icon={TrendingDown} variant="warn" />
        <StatCard label="Sin stock" value={sinStock} icon={AlertTriangle} variant="danger" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card p-5">
          <h2 className="font-display text-sm font-bold text-ink-secondary uppercase tracking-wider mb-3">Movimientos por tipo</h2>
          {movementsByType.length === 0 ? <div className="flex items-center justify-center h-40 text-sm text-ink-muted">Sin movimientos registrados</div> : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={movementsByType} barSize={28}>
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'var(--ink-muted)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--ink-muted)' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: 'var(--surface-3)', border: '1px solid var(--surface-5)', borderRadius: '8px', fontSize: '12px', color: 'var(--ink-primary)' }} cursor={{ fill: 'var(--surface-3)' }} />
                <Bar dataKey="value" fill="var(--color-accent)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
        <div className="card p-5">
          <h2 className="font-display text-sm font-bold text-ink-secondary uppercase tracking-wider mb-3">Stock por categoría</h2>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card">
          <div className="px-5 py-4 border-b border-surface-4"><h2 className="font-display text-sm font-bold text-ink-secondary uppercase tracking-wider">Últimos movimientos</h2></div>
          {recentMovements.length === 0 ? <div className="flex items-center justify-center py-8 text-sm text-ink-muted">Sin movimientos</div> : (
            <div className="divide-y divide-surface-3">
              {recentMovements.map((m: Movement) => {
                const info = MOVEMENT_TYPE_LABELS[m.typeId]
                return (
                  <div key={m.id} className="flex items-center justify-between px-5 py-3">
                    <div><p className="text-xs font-medium text-ink-primary">{info?.label ?? `Tipo ${m.typeId}`}</p><p className="text-xs text-ink-muted">{new Date(m.movementDate).toLocaleDateString('es-BO')}</p></div>
                    <span className={`badge ${info?.isEntry ? 'bg-accent/10 text-accent' : 'bg-red-500/10 text-red-400'}`}>{info?.isEntry ? 'Entrada' : 'Salida'}</span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
        <div className="card">
          <div className="px-5 py-4 border-b border-surface-4"><h2 className="font-display text-sm font-bold text-ink-secondary uppercase tracking-wider">Alertas de stock</h2></div>
          {alertStock.length === 0 ? <div className="flex items-center justify-center py-8 text-sm text-ink-muted">Todo el stock está bien</div> : (
            <div className="divide-y divide-surface-3">
              {alertStock.map((s: Stock) => {
                const nombre = s.sku?.companyProduct?.localNameAlias ?? s.sku?.companyProduct?.globalProduct?.name ?? `SKU ${s.skuId}`
                const isCritical = s.availableQuantity === 0
                return (
                  <div key={s.id} className="flex items-center justify-between px-5 py-3">
                    <div className="flex items-center gap-2 min-w-0"><div className={`w-1.5 h-1.5 rounded-full shrink-0 ${isCritical ? 'bg-red-400' : 'bg-yellow-400'}`} /><div className="min-w-0"><p className="text-xs font-medium text-ink-primary truncate">{nombre}</p><p className="text-xs text-ink-muted font-mono">{s.sku?.internalSku ?? `#${s.skuId}`}</p></div></div>
                    <span className={`badge shrink-0 ml-2 ${isCritical ? 'bg-red-500/10 text-red-400' : 'bg-yellow-500/10 text-yellow-400'}`}>{s.availableQuantity} uds</span>
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