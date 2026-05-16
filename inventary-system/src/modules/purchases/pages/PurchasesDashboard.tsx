import { Truck, Users, Clock, CheckCircle2 } from 'lucide-react'
import { useOrders, useSuppliers } from '../services/purchasesHooks'
import { useAppStore } from '../../../store/useAppStore'
import StatCard from '../../../components/StatCard'
import SectionHeader from '../../../components/SectionHeader'

export default function PurchasesDashboard() {
  const { selectedCompany, selectedWarehouse } = useAppStore()
  const { data: ordersData, isLoading: loadingOrders } = useOrders()
  const { data: suppliers = [], isLoading: loadingSuppliers } = useSuppliers()

  const orders = ordersData?.items ?? []
  
  const pendingOrders = orders.filter(o => o.status === 0).length
  const confirmedOrders = orders.filter(o => o.status === 1).length

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <SectionHeader 
        title="Dashboard Compras" 
        subtitle={`${selectedCompany?.name} · ${selectedWarehouse?.name}`} 
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          label="Proveedores" 
          value={loadingSuppliers ? '...' : suppliers.length} 
          icon={Users} 
        />
        <StatCard 
          label="Órdenes Pendientes" 
          value={loadingOrders ? '...' : pendingOrders} 
          icon={Clock} 
          variant="warn"
        />
        <StatCard 
          label="Órdenes Confirmadas" 
          value={loadingOrders ? '...' : confirmedOrders} 
          icon={CheckCircle2} 
          variant="default"
        />
        <StatCard 
          label="Total Órdenes" 
          value={loadingOrders ? '...' : orders.length} 
          icon={Truck} 
        />
      </div>

      <div className="card overflow-hidden">
        <div className="px-5 py-4 border-b border-surface-4">
          <h2 className="font-display text-sm font-bold text-ink-secondary uppercase tracking-wider">Órdenes recientes</h2>
        </div>
        {loadingOrders ? (
          <div className="py-8 text-center text-sm text-ink-muted">Cargando...</div>
        ) : orders.length === 0 ? (
          <div className="py-8 text-center text-sm text-ink-muted">No hay órdenes registradas</div>
        ) : (
          <div className="divide-y divide-surface-3">
            {orders.slice(0, 5).map(o => (
              <div key={o.orderCen} className="flex items-center justify-between px-5 py-3">
                <div>
                  <p className="text-xs font-medium text-ink-primary font-mono">{o.orderCen}</p>
                  <p className="text-[10px] text-ink-muted">{o.supplierCen} · {o.itemCount} ítems</p>
                </div>
                <span className={`badge ${o.status === 1 ? 'bg-accent/10 text-accent' : 'bg-yellow-500/10 text-yellow-400'}`}>
                  {o.status === 1 ? 'Confirmada' : 'Pendiente'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
