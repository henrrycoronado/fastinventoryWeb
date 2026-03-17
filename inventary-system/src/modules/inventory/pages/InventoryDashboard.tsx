import { useMemo } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts'
import { Package, Boxes, AlertTriangle, ArrowLeftRight, TrendingDown } from 'lucide-react'
import { useAppStore } from '../../../store/useAppStore'
import { useStock, useMovements, useCompanyProducts, useGlobalCategories } from '../services/inventoryHooks'
import { LOW_STOCK_THRESHOLD } from '../../../config/constants'
import type { Stock, Movement } from '../services/types'

const MOVEMENT_TYPE_LABELS: Record<number, string> = {
  1: 'Compra',
  3: 'Ajuste +',
  4: 'Ajuste -',
  5: 'Traslado salida',
  6: 'Traslado entrada',
}

const ACCENT_COLORS = ['var(--color-accent)', '#3b82f6', '#f97316', '#8b5cf6', '#f43f5e']

function StatCard({ label, value, icon: Icon, variant = 'default' }: {
  label: string
  value: string | number
  icon:  any
  variant?: 'default' | 'warn' | 'danger'
}) {
  const colors = {
    default: 'text-accent bg-accent/10',
    warn:    'text-yellow-400 bg-yellow-400/10',
    danger:  'text-red-400 bg-red-400/10',
  }
  return (
    <div className="card p-5 flex items-center gap-4">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${colors[variant]}`}>
        <Icon size={18} />
      </div>
      <div>
        <p className="text-xs text-ink-muted uppercase tracking-wider">{label}</p>
        <p className="font-display text-2xl font-bold text-ink-primary">{value}</p>
      </div>
    </div>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-display text-sm font-bold text-ink-secondary uppercase tracking-wider mb-3">
      {children}
    </h2>
  )
}

export default function InventoryDashboard() {
  const { selectedCompany, selectedWarehouse } = useAppStore()
  const { data: stockList    = [] } = useStock()
  const { data: movements    = [] } = useMovements()
  const { data: products     = [] } = useCompanyProducts()
  const { data: categories   = [] } = useGlobalCategories()

  // Stats
  const totalProductos   = products.length
  const totalDisponible  = stockList.reduce((acc: number, s: Stock) => acc + s.availableQuantity, 0)
  const sinStock         = stockList.filter((s: Stock) => s.availableQuantity === 0).length
  const stockBajo        = stockList.filter((s: Stock) => s.availableQuantity > 0 && s.availableQuantity <= LOW_STOCK_THRESHOLD).length

  // Gráfico 1 — movimientos por tipo
  const movementsByType = useMemo(() => {
    const map: Record<string, number> = {}
    movements.forEach((m: Movement) => {
      const label = MOVEMENT_TYPE_LABELS[m.typeId] ?? `Tipo ${m.typeId}`
      map[label] = (map[label] ?? 0) + 1
    })
    return Object.entries(map).map(([name, value]) => ({ name, value }))
  }, [movements])

  // Gráfico 2 — stock por categoría (top 5)
  const stockByCategory = useMemo(() => {
    const map: Record<string, number> = {}
    stockList.forEach((s: Stock) => {
      const catId    = s.sku?.companyProduct?.globalProduct?.categoryId
      const catName  = categories.find((c: any) => c.id === catId)?.name ?? 'Sin categoría'
      map[catName]   = (map[catName] ?? 0) + s.availableQuantity
    })
    return Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, value]) => ({ name, value }))
  }, [stockList, categories])

  // Últimos 5 movimientos
  const recentMovements = useMemo(() =>
    [...movements]
      .sort((a: Movement, b: Movement) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5),
    [movements]
  )

  // Alertas
  const alertStock = stockList
    .filter((s: Stock) => s.availableQuantity <= LOW_STOCK_THRESHOLD)
    .sort((a: Stock, b: Stock) => a.availableQuantity - b.availableQuantity)
    .slice(0, 8)

  return (
    <div className="p-6 space-y-6 animate-fade-in">

      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-bold text-ink-primary">Dashboard</h1>
        <p className="text-xs text-ink-muted mt-0.5">
          {selectedCompany?.name} · {selectedWarehouse?.name}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Productos registrados" value={totalProductos}  icon={Package} />
        <StatCard label="Unidades disponibles"  value={totalDisponible} icon={Boxes} />
        <StatCard label="Stock bajo"            value={stockBajo}       icon={TrendingDown} variant="warn" />
        <StatCard label="Sin stock"             value={sinStock}        icon={AlertTriangle} variant="danger" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Movimientos por tipo */}
        <div className="card p-5">
          <SectionTitle>Movimientos por tipo</SectionTitle>
          {movementsByType.length === 0 ? (
            <div className="flex items-center justify-center h-40 text-sm text-ink-muted">
              Sin movimientos registrados
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={movementsByType} barSize={28}>
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'var(--ink-muted)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--ink-muted)' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    background: 'var(--surface-3)',
                    border: '1px solid var(--surface-5)',
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: 'var(--ink-primary)',
                  }}
                  cursor={{ fill: 'var(--surface-3)' }}
                />
                <Bar dataKey="value" fill="var(--color-accent)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Stock por categoría */}
        <div className="card p-5">
          <SectionTitle>Stock por categoría</SectionTitle>
          {stockByCategory.length === 0 ? (
            <div className="flex items-center justify-center h-40 text-sm text-ink-muted">
              Sin datos de stock
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={stockByCategory}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={75}
                  innerRadius={40}
                >
                  {stockByCategory.map((_, i) => (
                    <Cell key={i} fill={ACCENT_COLORS[i % ACCENT_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: 'var(--surface-3)',
                    border: '1px solid var(--surface-5)',
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: 'var(--ink-primary)',
                  }}
                />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  formatter={(value) => (
                    <span style={{ fontSize: '11px', color: 'var(--ink-secondary)' }}>{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

      </div>

      {/* Recent movements + alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Últimos movimientos */}
        <div className="card">
          <div className="px-5 py-4 border-b border-surface-4">
            <SectionTitle>Últimos movimientos</SectionTitle>
          </div>
          {recentMovements.length === 0 ? (
            <div className="flex items-center justify-center py-8 text-sm text-ink-muted">
              Sin movimientos
            </div>
          ) : (
            <div className="divide-y divide-surface-3">
              {recentMovements.map((m: Movement) => (
                <div key={m.id} className="flex items-center justify-between px-5 py-3">
                  <div>
                    <p className="text-xs font-medium text-ink-primary">
                      {MOVEMENT_TYPE_LABELS[m.typeId] ?? `Tipo ${m.typeId}`}
                    </p>
                    <p className="text-xs text-ink-muted">
                      {new Date(m.createdAt).toLocaleDateString('es-BO', {
                        day: '2-digit', month: 'short', year: 'numeric'
                      })}
                    </p>
                  </div>
                  <span className={`badge ${
                    [1, 3, 6].includes(m.typeId)
                      ? 'bg-accent/10 text-accent'
                      : 'bg-red-500/10 text-red-400'
                  }`}>
                    {[1, 3, 6].includes(m.typeId) ? 'Entrada' : 'Salida'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Alertas de stock */}
        <div className="card">
          <div className="px-5 py-4 border-b border-surface-4">
            <SectionTitle>Alertas de stock</SectionTitle>
          </div>
          {alertStock.length === 0 ? (
            <div className="flex items-center justify-center py-8 text-sm text-ink-muted">
              Todo el stock está bien
            </div>
          ) : (
            <div className="divide-y divide-surface-3">
              {alertStock.map((s: Stock) => {
                const nombre = s.sku?.companyProduct?.globalProduct?.name ?? `SKU ${s.skuId}`
                const isCritical = s.availableQuantity === 0
                return (
                  <div key={s.id} className="flex items-center justify-between px-5 py-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${isCritical ? 'bg-red-400' : 'bg-yellow-400'}`} />
                      <p className="text-xs text-ink-primary truncate">{nombre}</p>
                    </div>
                    <span className={`badge shrink-0 ml-2 ${
                      isCritical
                        ? 'bg-red-500/10 text-red-400'
                        : 'bg-yellow-500/10 text-yellow-400'
                    }`}>
                      {s.availableQuantity} uds
                    </span>
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