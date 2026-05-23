export interface Company {
  companyId?:  number
  companyCen:  string
  name:        string
  isActive:    boolean
}


export interface Warehouse {
  warehouseCen: string
  name:         string
  isActive:     boolean
}


export interface Catalog {
  catalogCen:  string
  code: string
  name: string
}

export interface ProblemDetails {
  status:   number
  title:    string
  detail:   string
  instance: string
  traceId:  string
}