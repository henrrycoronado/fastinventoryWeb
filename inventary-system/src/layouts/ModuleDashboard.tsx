import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../store/useAppStore'
import { ACCENT_OPTIONS } from '../config/theme'
import type { AccentColor, ThemeMode } from '../config/theme'
import { Sun, Moon, LogOut, ChevronDown } from 'lucide-react'
import { useState } from 'react'

interface NavItem {
  label: string
  path:  string
}

interface ModuleDashboardProps {
  moduleLabel: string
  cards:       NavItem[]
  children?:   React.ReactNode
}

const modules = [
  { label: 'Inventario', path: '/inventory/dashboard' },
  { label: 'Ventas',     path: '/sales/dashboard' },
  { label: 'PdV',        path: '/pdv/dashboard' },
]

export default function ModuleDashboard({ moduleLabel, cards, children }: ModuleDashboardProps) {
  const navigate = useNavigate()
  const { selectedCompany, selectedWarehouse, theme, accent, setTheme, setAccent, logout } = useAppStore()
  const [moduleOpen, setModuleOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/', { replace: true })
  }

  return (
    <div className="min-h-full p-6 space-y-6 animate-fade-in">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <h1 className="font-display text-2xl font-bold text-ink-primary">
            {moduleLabel}
          </h1>
          <p className="text-xs text-ink-muted">
            {selectedCompany?.name} · {selectedWarehouse?.name}
          </p>
        </div>

        <div className="flex items-center gap-2">

          {/* Module switcher */}
          <div className="relative">
            <button
              onClick={() => setModuleOpen(!moduleOpen)}
              className="btn-ghost text-xs gap-1.5"
            >
              Módulo: {moduleLabel}
              <ChevronDown size={12} />
            </button>
            {moduleOpen && (
              <div className="absolute right-0 top-full mt-1 w-44 card py-1 z-20 animate-slide-up">
                {modules.map(m => (
                  <button
                    key={m.path}
                    onClick={() => { navigate(m.path); setModuleOpen(false) }}
                    className="w-full text-left px-4 py-2 text-sm text-ink-secondary hover:text-ink-primary hover:bg-surface-3 transition-colors"
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Theme toggle */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="btn-ghost !px-2.5"
          >
            {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
          </button>

          {/* Accent picker */}
          <div className="flex items-center gap-1.5 px-3 py-2 bg-surface-2 border border-surface-4 rounded-lg">
            {ACCENT_OPTIONS.map(opt => (
              <button
                key={opt.key}
                title={opt.label}
                onClick={() => setAccent(opt.key as AccentColor)}
                className="w-4 h-4 rounded-full transition-transform hover:scale-125"
                style={{
                  backgroundColor: opt.hex,
                  outline: accent === opt.key ? `2px solid ${opt.hex}` : 'none',
                  outlineOffset: '2px',
                }}
              />
            ))}
          </div>

          {/* Logout */}
          <button onClick={handleLogout} className="btn-danger !px-2.5">
            <LogOut size={15} />
          </button>

        </div>
      </div>

      {/* Module nav cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {cards.map(card => (
          <button
            key={card.path}
            onClick={() => navigate(card.path)}
            className="card px-5 py-4 text-left hover:bg-surface-3 transition-colors group"
          >
            <p className="text-sm font-medium text-ink-primary group-hover:text-accent transition-colors">
              {card.label}
            </p>
            <p className="text-xs text-ink-muted mt-0.5">Ver sección</p>
          </button>
        ))}
      </div>

      {children}
    </div>
  )
}