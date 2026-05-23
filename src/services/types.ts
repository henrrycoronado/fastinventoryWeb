export interface ApiResponse<T> {
  success: boolean
  data:    T
  message: string | null
}

export interface Company {
  companyCen:      string
  name:     string
  isActive: boolean
}

export interface Warehouse {
  warehouseCen:        string
  name:       string
  companyCen: string
  isActive:   boolean
}

export interface Catalog {
  catalogCen:  string
  code: string
  name: string
}