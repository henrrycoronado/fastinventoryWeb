import type { ThemeMode, AccentColor, AccentOption } from './types'

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
