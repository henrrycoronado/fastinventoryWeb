export type ThemeMode = 'dark' | 'light'

export type AccentColor =
  | 'accent-green'
  | 'accent-blue'
  | 'accent-violet'
  | 'accent-orange'
  | 'accent-rose'
  | 'accent-cyan'

export interface AccentOption {
  key:   AccentColor
  label: string
  hex:   string
}

export const ACCENT_OPTIONS: AccentOption[] = [
  { key: 'accent-green',  label: 'Verde',   hex: '#09de81' },
  { key: 'accent-blue',   label: 'Azul',    hex: '#3b82f6' },
  { key: 'accent-violet', label: 'Violeta', hex: '#8b5cf6' },
  { key: 'accent-orange', label: 'Naranja', hex: '#f97316' },
  { key: 'accent-rose',   label: 'Rosa',    hex: '#f43f5e' },
  { key: 'accent-cyan',   label: 'Cyan',    hex: '#06b6d4' },
]

export const DEFAULT_THEME:  ThemeMode  = 'dark'
export const DEFAULT_ACCENT: AccentColor = 'accent-green'