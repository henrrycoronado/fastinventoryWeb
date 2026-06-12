import { TrendingUp, ShoppingCart, DollarSign, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { useAppStore } from '../../../core/store/useAppStore'
import { useDailySales, useMonthlySales, useTopProducts } from '../services/dashboardHooks'
import { useRestockNotifications } from '../hooks/useRestockNotifications'
import StatCard from '../../../core/components/StatCard'

export default function SalesDashboard() {
  const { selectedCompany } = useAppStore()
  
  // Activate SSE notifications
  useRestockNotifications()

  const { data: dailyData,   isLoading: loadingDaily }   = useDailySales()
  const { data: monthlyData, isLoading: loadingMonthly } = useMonthlySales()
  const { data: topProducts, isLoading: loadingTop }     = useTopProducts()

  const currentMonth  = monthlyData?.currentMonth
  const previousMonth = monthlyData?.previousMonth

  const formatCurrency = (val: number = 0) => 
    new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(val)

  const calculateGrowth = (current: number = 0, previous: number = 0) => {
    if (previous === 0) return 100
    return ((current - previous) / previous) * 100
  }

  const salesGrowth = calculateGrowth(currentMonth?.totalSales, previousMonth?.totalSales)

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink-primary">Dashboard de Ventas</h1>
        <p className="text-xs text-ink-muted mt-0.5">
          {selectedCompany?.name} · Resumen de rendimiento
        </p>
      </div>

      {/* Daily Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard 
          label="Ventas de Hoy" 
          value={formatCurrency(dailyData?.totalSales)} 
          icon={DollarSign} 
          loading={loadingDaily}
        />
        <StatCard 
          label="Tickets Hoy" 
          value={dailyData?.ticketsCount ?? 0} 
          icon={ShoppingCart} 
          loading={loadingDaily}
        />
        <StatCard 
          label="Ticket Promedio" 
          value={formatCurrency(dailyData?.averageTicket)} 
          icon={TrendingUp} 
          loading={loadingDaily}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Monthly Comparison - Addresses Case: Price History */}
        <div className="card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-sm font-bold text-ink-secondary uppercase tracking-wider">Comparativa Mensual</h2>
            {loadingMonthly ? (
               <div className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin" />
            ) : (
              <div className={`flex items-center gap-1 text-xs font-medium ${salesGrowth >= 0 ? 'text-green-400' : 'text-rose-400'}`}>
                {salesGrowth >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {Math.abs(salesGrowth).toFixed(1)}% vs mes ant.
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-8 py-2">
            <div className="space-y-1">
              <p className="text-[10px] text-ink-muted uppercase font-bold tracking-tight">Mes Actual</p>
              <p className="text-xl font-display font-bold text-ink-primary">{formatCurrency(currentMonth?.totalSales)}</p>
              <p className="text-xs text-ink-muted">{currentMonth?.ticketsCount ?? 0} tickets emitidos</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] text-ink-muted uppercase font-bold tracking-tight">Mes Anterior</p>
              <p className="text-xl font-display font-bold text-ink-secondary/60">{formatCurrency(previousMonth?.totalSales)}</p>
              <p className="text-xs text-ink-muted">{previousMonth?.ticketsCount ?? 0} tickets emitidos</p>
            </div>
          </div>

          <div className="pt-2 border-t border-surface-4">
            <p className="text-[11px] text-ink-muted italic">
              * El historial de precios se mantiene inmutable. Cambios en el catálogo no afectan ventas pasadas.
            </p>
          </div>
        </div>

        {/* Top Products */}
        <div className="card p-5">
          <h2 className="font-display text-sm font-bold text-ink-secondary uppercase tracking-wider mb-4">Productos más vendidos</h2>
          {loadingTop ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => <div key={i} className="h-10 bg-surface-3 animate-pulse rounded-lg" />)}
            </div>
          ) : topProducts?.length === 0 ? (
            <div className="flex items-center justify-center h-32 text-xs text-ink-muted">Sin datos de ventas hoy</div>
          ) : (
            <div className="space-y-3">
              {topProducts?.map((p, i) => (
                <div key={p.productCen} className="flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-mono text-ink-muted w-4">{i + 1}.</span>
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-ink-primary truncate">{p.productName}</p>
                      <p className="text-[10px] text-ink-muted font-mono">{p.productCen}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-accent">{formatCurrency(p.totalAmount)}</p>
                    <p className="text-[10px] text-ink-muted">{p.quantity} vendidos</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
