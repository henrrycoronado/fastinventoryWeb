import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { STORAGE_KEYS } from '../config/constants'
import { DEFAULT_THEME, DEFAULT_ACCENT }   from '../config/theme'
import type { ThemeMode, AccentColor }     from '../config/theme'

interface Company {
  id:   number
  name: string
}

interface Warehouse {
  id:        number
  name:      string
  companyId: number
}

interface AppStore {
  // ── Apariencia ──
  theme:  ThemeMode
  accent: AccentColor
  setTheme:  (t: ThemeMode)   => void
  setAccent: (a: AccentColor) => void

  // ── Contexto de negocio ──
  selectedCompany:   Company   | null
  selectedWarehouse: Warehouse | null
  setCompany:   (c: Company   | null) => void
  setWarehouse: (w: Warehouse | null) => void
}

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      // defaults
      theme:  DEFAULT_THEME,
      accent: DEFAULT_ACCENT,
      selectedCompany:   null,
      selectedWarehouse: null,

      setTheme:  (theme)  => set({ theme }),
      setAccent: (accent) => set({ accent }),
      setCompany:   (c) => set({ selectedCompany: c, selectedWarehouse: null }),
      setWarehouse: (w) => set({ selectedWarehouse: w }),
    }),
    {
      name: STORAGE_KEYS.THEME,
      partialize: (s) => ({
        theme:             s.theme,
        accent:            s.accent,
        selectedCompany:   s.selectedCompany,
        selectedWarehouse: s.selectedWarehouse,
      }),
    }
  )
)