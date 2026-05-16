export interface ApiResponse<T> {
  success: boolean
  data:    T
  message: string | null
}

export interface Company {
  cen:      string
  name:     string
  isActive: boolean
}

export interface Warehouse {
  cen:        string
  name:       string
  companyCen: string
}

export interface Catalog {
  cen:  string
  code: string
  name: string
}