import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { DEFAULT_THEME, DEFAULT_ACCENT } from '../config/theme'
import type { ThemeMode, AccentColor } from '../config/theme'
import type { Company, Warehouse } from '../services/types'

interface ModuleSettings {
  salesEnabled: boolean
  pdvEnabled:   boolean
}

interface AppStore {
  theme:  ThemeMode
  accent: AccentColor
  setTheme:  (t: ThemeMode)   => void
  setAccent: (a: AccentColor) => void

  selectedCompany:   Company   | null
  selectedWarehouse: Warehouse | null
  sessionToken:      string    | null

  setCompany:   (c: Company   | null) => void
  setWarehouse: (w: Warehouse | null) => void
  login:        (company: Company, warehouse: Warehouse) => void
  logout:       () => void

  moduleSettings: Record<number, ModuleSettings>
  toggleModule:   (companyId: number, module: 'salesEnabled' | 'pdvEnabled') => void
  getModuleSettings: (companyId: number) => ModuleSettings
}

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      theme:  DEFAULT_THEME,
      accent: DEFAULT_ACCENT,

      selectedCompany:   null,
      selectedWarehouse: null,
      sessionToken:      null,

      moduleSettings: {},

      setTheme:  (theme)  => set({ theme }),
      setAccent: (accent) => set({ accent }),
      setCompany:   (c) => set({ selectedCompany: c }),
      setWarehouse: (w) => set({ selectedWarehouse: w }),

      login: (company, warehouse) => set(state => ({
        selectedCompany:   company,
        selectedWarehouse: warehouse,
        sessionToken:      `session-${company.id}-${warehouse.id}-${Date.now()}`,
        moduleSettings: {
          ...state.moduleSettings,
          [company.id]: state.moduleSettings[company.id] ?? {
            salesEnabled: true,
            pdvEnabled:   true,
          },
        },
      })),

      logout: () => set({
        selectedCompany:   null,
        selectedWarehouse: null,
        sessionToken:      null,
      }),

      toggleModule: (companyId, module) => set(state => {
        const current = state.moduleSettings[companyId] ?? { salesEnabled: true, pdvEnabled: true }
        const updated = { ...current, [module]: !current[module] }
        if (module === 'salesEnabled' && !updated.salesEnabled) {
          updated.pdvEnabled = false
        }
        return {
          moduleSettings: {
            ...state.moduleSettings,
            [companyId]: updated,
          },
        }
      }),

      getModuleSettings: (companyId) =>
        get().moduleSettings[companyId] ?? { salesEnabled: true, pdvEnabled: true },
    }),
    {
      name: 'inventary-app',
      partialize: (s) => ({
        theme:             s.theme,
        accent:            s.accent,
        selectedCompany:   s.selectedCompany,
        selectedWarehouse: s.selectedWarehouse,
        sessionToken:      s.sessionToken,
        moduleSettings:    s.moduleSettings,
      }),
    }
  )
)