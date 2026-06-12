import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { DEFAULT_THEME, DEFAULT_ACCENT } from '../themes/constants'
import type { AppStore } from './types'
import { DEFAULT_SETTINGS } from './constants'

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      theme:  DEFAULT_THEME,
      accent: DEFAULT_ACCENT,

      selectedCompany:   null,
      selectedWarehouse: null,
      sessionToken:      null,
      activeTicketCen:   null,

      moduleSettings: {},

      setTheme:  (theme)  => set({ theme }),
      setAccent: (accent) => set({ accent }),
      setCompany:   (c) => set({ selectedCompany: c, activeTicketCen: null }),
      setWarehouse: (w) => set({ selectedWarehouse: w }),
      setActiveTicketCen: (ticketCen) => set({ activeTicketCen: ticketCen }),

      login: (company) => set(state => ({
        selectedCompany:   company,
        selectedWarehouse: null,
        sessionToken:      `session-${company.companyCen}-${Date.now()}`,
        activeTicketCen:   null,
        moduleSettings: {
          ...state.moduleSettings,
          [company.companyCen]: state.moduleSettings[company.companyCen] ?? DEFAULT_SETTINGS,
        },
      })),


      logout: () => set({
        selectedCompany:   null,
        selectedWarehouse: null,
        sessionToken:      null,
        activeTicketCen:   null,
      }),

      toggleModule: (companyCen, module) => set(state => {
        const current = state.moduleSettings[companyCen] ?? DEFAULT_SETTINGS
        const updated = { ...current, [module]: !current[module] }
        if (module === 'salesEnabled' && !updated.salesEnabled) {
          updated.pdvEnabled = false
        }
        return {
          moduleSettings: {
            ...state.moduleSettings,
            [companyCen]: updated,
          },
        }
      }),

      getModuleSettings: (companyCen) =>
        get().moduleSettings[companyCen] ?? DEFAULT_SETTINGS,
    }),
    {
      name: 'inventary-app',
      partialize: (s) => ({
        theme:             s.theme,
        accent:            s.accent,
        selectedCompany:   s.selectedCompany,
        selectedWarehouse: s.selectedWarehouse,
        sessionToken:      s.sessionToken,
        activeTicketCen:   s.activeTicketCen,
        moduleSettings:    s.moduleSettings,
      }),
    }
  )
)
