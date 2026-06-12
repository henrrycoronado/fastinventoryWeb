import { useAppStore } from '../core/store/useAppStore'
import { ShoppingCart, Store, Package, Users, UserCheck, Truck } from 'lucide-react'
import ModuleToggle from '../core/components/ModuleToggle'

export default function Settings() {
  const { selectedCompany, getModuleSettings, toggleModule } = useAppStore()
  const companyCen = selectedCompany?.companyCen

  if (!companyCen) return (
    <div className="flex items-center justify-center h-64">
      <p className="text-sm text-ink-muted">Sin empresa seleccionada</p>
    </div>
  )

  const settings = getModuleSettings(companyCen)

  return (
    <div className="animate-fade-in">

      <div className="px-6 py-5 border-b border-surface-3">
        <h1 className="font-display text-2xl font-bold text-ink-primary">Configuración</h1>
        <p className="text-xs text-ink-muted mt-0.5">Activa o desactiva módulos para {selectedCompany?.name}</p>
      </div>

      <div className="px-6 py-4 space-y-3 max-w-xl">

        <p className="text-xs text-ink-muted uppercase tracking-wider font-semibold">Módulos</p>

        <ModuleToggle
          icon={<Package size={18} />}
          label="Inventario"
          description="Gestión de productos, stock y movimientos. Siempre activo."
          enabled={true}
          disabled={true}
          onToggle={() => {}}
        />

        <ModuleToggle
          icon={<Truck size={18} />}
          label="Compras"
          description="Gestión de proveedores y órdenes de compra."
          enabled={settings.purchasesEnabled}
          onToggle={() => toggleModule(companyCen, 'purchasesEnabled')}
        />

        <ModuleToggle
          icon={<ShoppingCart size={18} />}
          label="Ventas"
          description="Gestión de ventas, clientes, vendedores y recibos."
          enabled={settings.salesEnabled}
          onToggle={() => toggleModule(companyCen, 'salesEnabled')}
        />

        <ModuleToggle
          icon={<Store size={18} />}
          label="Punto de Venta"
          description={
            !settings.salesEnabled
              ? 'Requiere el módulo de Ventas activo'
              : 'Órdenes de PdV, mesas, menús y estaciones.'
          }
          enabled={settings.pdvEnabled}
          disabled={!settings.salesEnabled}
          onToggle={() => {
            if (!settings.salesEnabled) return
            toggleModule(companyCen, 'pdvEnabled')
          }}
        />

        <p className="text-xs text-ink-muted uppercase tracking-wider font-semibold pt-2">
          Módulo Ventas — opciones
        </p>

        <ModuleToggle
          icon={<Users size={18} />}
          label="Clientes"
          description="Registro y gestión de clientes para las ventas."
          enabled={settings.clientsEnabled}
          disabled={!settings.salesEnabled}
          onToggle={() => {
            if (!settings.salesEnabled) return
            toggleModule(companyCen, 'clientsEnabled')
          }}
        />

        <ModuleToggle
          icon={<UserCheck size={18} />}
          label="Vendedores"
          description="Registro y gestión de vendedores asignados a ventas."
          enabled={settings.sellersEnabled}
          disabled={!settings.salesEnabled}
          onToggle={() => {
            if (!settings.salesEnabled) return
            toggleModule(companyCen, 'sellersEnabled')
          }}
        />

        <p className="text-xs text-ink-muted pt-2">
          Los cambios se aplican inmediatamente y se guardan localmente por dispositivo.
        </p>

      </div>
    </div>
  )
}