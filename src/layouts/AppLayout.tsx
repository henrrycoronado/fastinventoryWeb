import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { useAppStore } from '../core/store/useAppStore'
import { ACCENT_OPTIONS } from '../core/themes/constants'
import { APP_NAME } from '../core/utils/constants'
import type { AccentColor } from '../core/themes/types'
import WarehouseSelector from '../core/components/WarehouseSelector'
import {
  Building2, Warehouse, Sun, Moon, LogOut,
  ChevronDown, LayoutDashboard, Package, Boxes,
  ArrowLeftRight, ShoppingCart, Truck,
  UserCheck, Store, UtensilsCrossed,
  Tag, ScrollText, Ruler,
  Settings, UserCircle,
} from 'lucide-react'

type ModuleKey = 'inventory' | 'sales' | 'purchases'

function getActiveModule(pathname: string): ModuleKey {
  if (pathname.startsWith('/sales'))     return 'sales'
  if (pathname.startsWith('/purchases')) return 'purchases'
  return 'inventory'
}

function NavItem({ path, icon: Icon, label }: { path: string; icon: any; label: string }) {
  return (
    <NavLink
      to={path}
      className={({ isActive }) =>
        `flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-colors ${
          isActive
            ? 'bg-accent/10 text-accent font-medium'
            : 'text-ink-secondary hover:text-ink-primary hover:bg-surface-3'
        }`
      }
    >
      <Icon size={14} />
      {label}
    </NavLink>
  )
}

export default function AppLayout() {
  const navigate  = useNavigate()
  const location  = useLocation()
  const { selectedCompany, theme, accent, setTheme, setAccent, logout } = useAppStore()
  const moduleSettings = useAppStore(s => s.getModuleSettings(s.selectedCompany?.companyCen ?? ''))

  const moduleNav = {
    inventory: {
      label: 'Inventario',
      items: [
        { label: 'Dashboard',   path: '/inventory/dashboard',  icon: LayoutDashboard },
        { label: 'Productos',   path: '/inventory/products',   icon: Package },
        { label: 'Categorías',  path: '/inventory/categories', icon: Tag },
        { label: 'Unidades',    path: '/inventory/units',      icon: Ruler },
        { label: 'Almacenes',   path: '/inventory/warehouses', icon: Warehouse },
        { label: 'Stock',       path: '/inventory/stock',      icon: Boxes },
        { label: 'Movimientos', path: '/inventory/movements',  icon: ArrowLeftRight },
        { label: 'Kardex',      path: '/inventory/kardex',     icon: ScrollText },
      ],
    },

    purchases: {
      label: 'Compras',
      items: [
        { label: 'Dashboard',   path: '/purchases/dashboard',  icon: LayoutDashboard },
        { label: 'Órdenes',     path: '/purchases/orders',     icon: Truck },
        { label: 'Proveedores', path: '/purchases/suppliers',  icon: UserCheck },
      ],
    },
    sales: {
      label: 'Ventas',
      items: [
        { label: 'Dashboard',      path: '/sales/dashboard',          icon: LayoutDashboard },
        { label: 'Punto de Venta', path: '/sales/pos',                icon: Store },
        { label: 'Tickets',        path: '/sales/tickets',            icon: ShoppingCart },
        { label: 'KDS (Cocina)',   path: '/sales/kds',                icon: UtensilsCrossed },
        { label: 'Meseros',        path: '/sales/waiters',            icon: UserCheck },
        { label: 'Catálogo',       path: '/sales/catalog',            icon: Package },
      ],
    },
  }

  const activeModule = getActiveModule(location.pathname)
  const { items }    = moduleNav[activeModule]

  const availableModules = [
    { key: 'inventory' as ModuleKey, label: 'Inventario',      always: true  },
    { key: 'purchases' as ModuleKey, label: 'Compras',         always: false, enabled: moduleSettings.purchasesEnabled },
    { key: 'sales'     as ModuleKey, label: 'Ventas',          always: false, enabled: moduleSettings.salesEnabled },
  ].filter(m => m.always || m.enabled)

  const activeModuleLabel = availableModules.find(m => m.key === activeModule)?.label ?? 'Inventario'

  const [moduleOpen, setModuleOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/', { replace: true })
  }

  const handleSwitchModule = (key: ModuleKey) => {
    navigate(`/${key}/${key === 'sales' ? 'pos' : 'dashboard'}`)
    setModuleOpen(false)
  }

  return (
    <div className="flex h-screen overflow-hidden">

      <aside className="w-56 shrink-0 flex flex-col bg-surface-1 border-r border-surface-4">

        {/* Logo */}
        <div className="px-4 py-4 border-b border-surface-4">
          <span className="font-display text-lg font-bold text-ink-primary">
            {APP_NAME}<span className="text-accent">.</span>
          </span>
        </div>

        {/* Company + Warehouse context */}
        <div className="px-3 py-3 border-b border-surface-4 space-y-1.5">
          <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-surface-3">
            <Building2 size={12} className="text-accent shrink-0" />
            <span className="text-xs text-ink-secondary truncate font-medium">{selectedCompany?.name}</span>
          </div>
          <WarehouseSelector />
        </div>


        {/* Module switcher */}
        <div className="px-3 py-3 border-b border-surface-4">
          <div className="relative">
            <button
              onClick={() => setModuleOpen(!moduleOpen)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-surface-3 hover:bg-surface-4 transition-colors"
            >
              <span className="text-xs font-medium text-ink-primary">{activeModuleLabel}</span>
              <ChevronDown size={12} className={`text-ink-muted transition-transform ${moduleOpen ? 'rotate-180' : ''}`} />
            </button>
            {moduleOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 card py-1 z-20 animate-slide-up">
                {availableModules.map(m => (
                  <button
                    key={m.key}
                    onClick={() => handleSwitchModule(m.key)}
                    className="w-full text-left px-3 py-2 text-xs text-ink-secondary hover:text-ink-primary hover:bg-surface-3 transition-colors"
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Module nav items */}
        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5">
          {items.map(item => (
            <NavItem key={item.path} {...item} />
          ))}
        </nav>

        {/* Bottom */}
        <div className="px-3 py-3 border-t border-surface-4 space-y-0.5">

          {/* Theme + Accent */}
          <div className="flex items-center justify-between px-2 py-2 mb-1">
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="btn-ghost !px-2 !py-1 text-xs gap-1.5"
            >
              {theme === 'dark' ? <Sun size={13} /> : <Moon size={13} />}
              {theme === 'dark' ? 'Claro' : 'Oscuro'}
            </button>
            <div className="flex items-center gap-1.5">
              {ACCENT_OPTIONS.map(opt => (
                <button
                  key={opt.key}
                  title={opt.label}
                  onClick={() => setAccent(opt.key as AccentColor)}
                  className="w-3 h-3 rounded-full transition-transform hover:scale-125"
                  style={{
                    backgroundColor: opt.hex,
                    outline: accent === opt.key ? `2px solid ${opt.hex}` : 'none',
                    outlineOffset: '2px',
                  }}
                />
              ))}
            </div>
          </div>

          <NavItem path="/settings"        icon={Settings}   label="Configuración" />
          <NavItem path="/company/profile" icon={UserCircle} label="Perfil empresa" />

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-red-400 hover:bg-red-500/10 transition-colors mt-1"
          >
            <LogOut size={14} />
            Cerrar sesión
          </button>

        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto bg-surface-0">
        <Outlet />
      </main>

    </div>
  )
}
