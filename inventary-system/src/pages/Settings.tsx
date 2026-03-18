import { useAppStore } from '../store/useAppStore'
import { ShoppingCart, Store, Package, ToggleLeft, ToggleRight } from 'lucide-react'

interface ModuleToggleProps {
  icon:        React.ReactNode
  label:       string
  description: string
  enabled:     boolean
  disabled?:   boolean
  onToggle:    () => void
}

function ModuleToggle({ icon, label, description, enabled, disabled = false, onToggle }: ModuleToggleProps) {
  return (
    <div className={`card p-4 flex items-center gap-4 ${disabled ? 'opacity-60' : ''}`}>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
        enabled ? 'bg-accent/10' : 'bg-surface-4'
      }`}>
        <span className={enabled ? 'text-accent' : 'text-ink-muted'}>{icon}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-ink-primary">{label}</p>
        <p className="text-xs text-ink-muted">{description}</p>
      </div>
      <button
        onClick={onToggle}
        disabled={disabled}
        className="shrink-0 transition-colors"
        title={disabled ? 'Este módulo no puede desactivarse' : undefined}
      >
        {enabled
          ? <ToggleRight size={28} className="text-accent" />
          : <ToggleLeft  size={28} className="text-ink-muted" />
        }
      </button>
    </div>
  )
}

export default function Settings() {
  const { selectedCompany, getModuleSettings, toggleModule } = useAppStore()
  const companyId = selectedCompany?.id

  if (!companyId) return (
    <div className="flex items-center justify-center h-64">
      <p className="text-sm text-ink-muted">Sin empresa seleccionada</p>
    </div>
  )

  const settings = getModuleSettings(companyId)

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
          icon={<ShoppingCart size={18} />}
          label="Ventas"
          description="Gestión de ventas, clientes, vendedores y recibos."
          enabled={settings.salesEnabled}
          onToggle={() => toggleModule(companyId, 'salesEnabled')}
        />

        <ModuleToggle
          icon={<Store size={18} />}
          label="Punto de Venta"
          description="Órdenes de PdV, mesas, menús y estaciones."
          enabled={settings.pdvEnabled}
          onToggle={() => toggleModule(companyId, 'pdvEnabled')}
        />

        <p className="text-xs text-ink-muted pt-2">
          Los cambios se aplican inmediatamente y se guardan localmente por dispositivo.
        </p>

      </div>
    </div>
  )
}