import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { useAppStore } from '../store/useAppStore'
import { ACCENT_OPTIONS } from '../config/theme'
import { APP_NAME } from '../config/constants'
import type { AccentColor } from '../config/theme'
import {
  Building2, Warehouse, Sun, Moon, LogOut,
  ChevronDown, LayoutDashboard, Package, Boxes,
  ArrowLeftRight, ShoppingCart, ReceiptText,
  Users, UserCheck, Store, UtensilsCrossed,
  Table2, BookOpen, Tag, ScrollText,
  Settings, UserCircle,
} from 'lucide-react'

const moduleNav = {
  inventory: {
    label: 'Inventario',
    items: [
      { label: 'Dashboard',   path: '/inventory/dashboard',  icon: LayoutDashboard },
      { label: 'Productos',   path: '/inventory/products',   icon: Package },
      { label: 'Categorías',  path: '/inventory/categories', icon: Tag },
      { label: 'Stock',       path: '/inventory/stock',      icon: Boxes },
      { label: 'Movimientos', path: '/inventory/movements',  icon: ArrowLeftRight },
      { label: 'Kardex',      path: '/inventory/kardex',     icon: ScrollText },
    ],
  },
  sales: {
    label: 'Ventas',
    items: [
      { label: 'Dashboard',      path: '/sales/dashboard',           icon: LayoutDashboard },
      { label: 'Ventas',         path: '/sales/list',                icon: ShoppingCart },
      { label: 'Recibos',        path: '/sales/receipts',            icon: ReceiptText },
      { label: 'Clientes',       path: '/sales/customers',           icon: Users },
      { label: 'Vendedores',     path: '/sales/sellers',             icon: UserCheck },
      { label: 'Mis Productos',  path: '/sales/catalog/products',    icon: Package },
      { label: 'Mis Categorías', path: '/sales/catalog/categories',  icon: Tag },
    ],
  },
  pdv: {
    label: 'Punto de Venta',
    items: [
      { label: 'Dashboard',      path: '/pdv/dashboard',             icon: LayoutDashboard },
      { label: 'Órdenes',        path: '/pdv/orders',                icon: Store },
      { label: 'Mesas',          path: '/pdv/tables',                icon: Table2 },
      { label: 'Menús',          path: '/pdv/menus',                 icon: BookOpen },
      { label: 'Estaciones',     path: '/pdv/stations',              icon: UtensilsCrossed },
      { label: 'Mis Productos',  path: '/pdv/catalog/products',      icon: Package },
      { label: 'Mis Categorías', path: '/pdv/catalog/categories',    icon: Tag },
    ],
  },
}


type ModuleKey = keyof typeof moduleNav

function getActiveModule(pathname: string): ModuleKey {
  if (pathname.startsWith('/sales')) return 'sales'
  if (pathname.startsWith('/pdv'))   return 'pdv'
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
  const navigate     = useNavigate()
  const location     = useLocation()
  const { selectedCompany, selectedWarehouse, theme, accent, setTheme, setAccent, logout } = useAppStore()

  const activeModule        = getActiveModule(location.pathname)
  const { label, items }    = moduleNav[activeModule]
  const [moduleOpen, setModuleOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/', { replace: true })
  }

  const handleSwitchModule = (key: ModuleKey) => {
    navigate(`/${key}/dashboard`)
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
            <span className="text-xs text-ink-secondary truncate">{selectedCompany?.name}</span>
          </div>
          <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-surface-3">
            <Warehouse size={12} className="text-accent shrink-0" />
            <span className="text-xs text-ink-secondary truncate">{selectedWarehouse?.name}</span>
          </div>
        </div>

        {/* Module switcher */}
        <div className="px-3 py-3 border-b border-surface-4">
          <div className="relative">
            <button
              onClick={() => setModuleOpen(!moduleOpen)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-surface-3 hover:bg-surface-4 transition-colors"
            >
              <span className="text-xs font-medium text-ink-primary">{label}</span>
              <ChevronDown size={12} className={`text-ink-muted transition-transform ${moduleOpen ? 'rotate-180' : ''}`} />
            </button>
            {moduleOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 card py-1 z-20 animate-slide-up">
                {(Object.keys(moduleNav) as ModuleKey[]).map(key => (
                  <button
                    key={key}
                    onClick={() => handleSwitchModule(key)}
                    className="w-full text-left px-3 py-2 text-xs text-ink-secondary hover:text-ink-primary hover:bg-surface-3 transition-colors"
                  >
                    {moduleNav[key].label}
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

          <NavItem path="/settings"        icon={Settings}    label="Configuración" />
          <NavItem path="/company/profile" icon={UserCircle}  label="Perfil empresa" />

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