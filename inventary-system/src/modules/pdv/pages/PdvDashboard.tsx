import { ClipboardList, Table2, ChefHat, UserCheck } from 'lucide-react'
import SectionHeader from '../../../components/SectionHeader'
import StatCard from '../../../components/StatCard'
import { usePdvMenus, usePdvOrders, usePdvTables, usePdvWaiters } from '../services/pdvHooks'

export default function PdvDashboard() {
  const { data: orders = [], isLoading: loadingOrders } = usePdvOrders()
  const { data: tables = [] } = usePdvTables()
  const { data: menus = [] } = usePdvMenus()
  const { data: waiters = [] } = usePdvWaiters()

  const totalOrders = (orders as Array<{ id: number }>).length
  const openOrders = (orders as Array<{ statusId: number }>).filter(order => order.statusId === 1).length

  return (
    <div className="animate-fade-in">
      <SectionHeader
        title="Dashboard Punto de Venta"
        subtitle="Resumen operativo del módulo"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 p-6">
        <StatCard
          label="Órdenes"
          value={loadingOrders ? '...' : totalOrders}
          icon={ClipboardList}
          sub={`${openOrders} abiertas`}
        />
        <StatCard
          label="Mesas"
          value={(tables as Array<{ id: number }>).length}
          icon={Table2}
        />
        <StatCard
          label="Menús"
          value={(menus as Array<{ id: number }>).length}
          icon={ChefHat}
        />
        <StatCard
          label="Meseros"
          value={(waiters as Array<{ id: number }>).length}
          icon={UserCheck}
        />
      </div>

      <div className="mx-6 mb-8 card overflow-hidden">
        <div className="px-6 py-4 border-b border-surface-4">
          <h2 className="font-display font-bold text-ink-primary">Estado rápido</h2>
          <p className="text-xs text-ink-muted mt-1">Monitoreo de órdenes en tiempo real</p>
        </div>

        {loadingOrders ? (
          <div className="py-12 text-center text-sm text-ink-muted">Cargando órdenes…</div>
        ) : (orders as Array<{ id: number; statusId: number }>).length === 0 ? (
          <div className="py-12 text-center text-sm text-ink-muted">Sin órdenes registradas aún</div>
        ) : (
          <div className="divide-y divide-surface-3">
            {(orders as Array<{ id: number; statusId: number; openedAt: string }>).slice(0, 8).map(order => (
              <div key={order.id} className="flex items-center justify-between px-6 py-3">
                <span className="text-sm text-ink-primary">Orden #{order.id}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-ink-muted">{new Date(order.openedAt).toLocaleTimeString('es-BO', { hour: '2-digit', minute: '2-digit' })}</span>
                  <span className={`text-[11px] px-2 py-1 rounded-full ${order.statusId === 1 ? 'bg-accent/10 text-accent' : order.statusId === 2 ? 'bg-green-500/10 text-green-400' : 'bg-surface-3 text-ink-secondary'}`}>
                    {order.statusId === 1 ? 'Abierta' : order.statusId === 2 ? 'Cobrada' : `Estado #${order.statusId}`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}