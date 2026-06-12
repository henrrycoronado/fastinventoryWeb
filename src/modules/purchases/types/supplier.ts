export interface Supplier {
  supplierCen: string
  name:        string
}

export interface CreateSupplierRequest {
  companyCen: string
  name:       string
}

export interface UpdateSupplierRequest {
  name: string
}