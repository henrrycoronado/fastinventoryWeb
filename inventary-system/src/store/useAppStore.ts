import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { DEFAULT_THEME, DEFAULT_ACCENT } from '../config/theme'
import type { ThemeMode, AccentColor } from '../config/theme'
import type { Company, Warehouse } from '../services/types'

interface AppStore {
  theme:  ThemeMode
  accent: AccentColor
  setTheme:  (t: ThemeMode)  => void
  setAccent: (a: AccentColor) => void

  selectedCompany:   Company   | null
  selectedWarehouse: Warehouse | null
  sessionToken:      string    | null

  setCompany:   (c: Company   | null) => void
  setWarehouse: (w: Warehouse | null) => void
  login:        (company: Company, warehouse: Warehouse) => void
  logout:       () => void
}

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      theme:  DEFAULT_THEME,
      accent: DEFAULT_ACCENT,
      selectedCompany:   null,
      selectedWarehouse: null,
      sessionToken:      null,

      setTheme:  (theme)  => set({ theme }),
      setAccent: (accent) => set({ accent }),
      setCompany:   (c) => set({ selectedCompany: c }),
      setWarehouse: (w) => set({ selectedWarehouse: w }),

      login: (company, warehouse) => set({
        selectedCompany:   company,
        selectedWarehouse: warehouse,
        sessionToken:      `session-${company.id}-${warehouse.id}-${Date.now()}`,
      }),

      logout: () => set({
        selectedCompany:   null,
        selectedWarehouse: null,
        sessionToken:      null,
      }),
    }),
    {
      name: 'inventary-app',
      partialize: (s) => ({
        theme:             s.theme,
        accent:            s.accent,
        selectedCompany:   s.selectedCompany,
        selectedWarehouse: s.selectedWarehouse,
        sessionToken:      s.sessionToken,
      }),
    }
  )
)