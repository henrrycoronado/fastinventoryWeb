export interface ApiResponse<T> {
  success: boolean
  data:    T
  message: string | null
}

export interface Company {
  id:       number
  name:     string
  isActive: boolean
}

export interface Warehouse {
  id:        number
  name:      string
  companyId: number
}

export interface Catalog {
  id:   number
  code: string
  name: string
}