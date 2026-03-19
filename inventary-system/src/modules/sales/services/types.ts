export interface Customer {
  id:        number
  companyId: number
  name:      string
  phone?:    string
  email?:    string
  createdAt: string
}

export interface Seller {
  id:        number
  companyId: number
  name:      string
  phone?:    string
  createdAt: string
}

export interface SaleStatus {
  id:   number
  code: 'DRAFT' | 'CONFIRMED' | 'CANCELLED' | 'RETURNED'
  name: string
}

export interface SaleDetailSku {
  id:            number
  internalSku:   string
  retailPrice:   number
  productName:   string
  localNameAlias?: string
}

export interface SaleDetail {
  id:       number
  skuId:    number
  batchId:  number | null
  quantity: number
  unitPrice: number
  subtotal:  number
  sku?:      SaleDetailSku
}

export interface Sale {
  id:          number
  companyId:   number
  warehouseId: number
  sellerId?:   number | null
  customerId?: number | null
  statusId:    number
  saleDate:    string
  notes?:      string
  createdAt:   string
  status?:     SaleStatus
  customer?:   Customer | null
  seller?:     Seller   | null
  details?:    SaleDetail[]
}

export interface Receipt {
  id:          number
  saleId:      number
  totalAmount: number
  issuedAt:    string
  createdAt:   string
}

export interface CategoryInUse {
  id:   number
  name: string
}
