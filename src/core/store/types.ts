import type { Company, Warehouse } from '../networks/types'
import type { ThemeMode, AccentColor } from '../themes/types'

export interface ModuleSettings {
  salesEnabled:     boolean
  pdvEnabled:       boolean
  clientsEnabled:   boolean
  sellersEnabled:   boolean
  purchasesEnabled: boolean
}

export interface AppStore {
  theme:  ThemeMode
  accent: AccentColor
  setTheme:  (t: ThemeMode)   => void
  setAccent: (a: AccentColor) => void

  selectedCompany:   Company   | null
  selectedWarehouse: Warehouse | null
  sessionToken:      string    | null
  activeTicketCen:   string    | null

  setCompany:   (c: Company   | null) => void
  setWarehouse: (w: Warehouse | null) => void
  login:        (company: Company) => void
  logout:       () => void
  setActiveTicketCen: (ticketCen: string | null) => void

  moduleSettings: Record<string, ModuleSettings>
  toggleModule:   (companyCen: string, module: keyof ModuleSettings) => void
  getModuleSettings: (companyCen: string) => ModuleSettings
}
