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