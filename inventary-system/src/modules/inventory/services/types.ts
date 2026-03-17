export interface GlobalCategory {
  id:   number
  name: string
}

export interface GlobalProduct {
  id:                  number
  categoryId:          number
  name:                string
  brand?:              string
  upcBarcode?:         string
  createdAt:           string
  category?:           GlobalCategory
  referencedByCompany?: boolean
}

export interface Sku {
  id:               number
  companyProductId: number
  internalSku?:     string
  retailPrice?:     number
  createdAt?:       string
}

export interface CompanyProduct {
  id:              number
  companyId:       number
  globalProductId: number
  localNameAlias?: string
  wholesalePrice?: number
  createdAt?:      string
  globalProduct?:  GlobalProduct
  skus?:           Sku[]
}

export interface SkuAttribute {
  id:          number
  skuId:       number
  attributeId: number
  value:       string
  createdAt?:  string
  attribute?:  { id: number; name: string }
}

export interface Attribute {
  id:        number
  companyId: number
  name:      string
  createdAt?: string
  skuCount:  number
}

export interface Batch {
  id:               number
  skuId:            number
  batchNumber:      string
  manufactureDate?: string
  expirationDate?:  string
  createdAt?:       string
}

export interface StockSku extends Sku {
  companyProduct?: {
    id:              number
    localNameAlias?: string
    wholesalePrice?: number
    globalProduct?:  GlobalProduct
  }
}

export interface Stock {
  id:                number
  warehouseId:       number
  skuId:             number
  batchId?:          number | null
  quantity:          number
  reservedQuantity:  number
  availableQuantity: number
  lastUpdated:       string
  sku?:              StockSku
}

export interface MovementDetailSku extends Sku {
  companyProduct?: {
    id:              number
    localNameAlias?: string
    wholesalePrice?: number
    globalProduct?:  { id: number; name: string; brand?: string; upcBarcode?: string }
  }
}

export interface MovementDetail {
  id:       number
  skuId:    number
  batchId?: number | null
  quantity: number
  unitCost: number
  sku?:     MovementDetailSku
}

export interface Movement {
  id:                 number
  companyId:          number
  warehouseId:        number
  targetWarehouseId?: number | null
  statusId:           number
  typeId:             number
  movementDate:       string
  notes?:             string
  details?:           MovementDetail[]
}

export interface KardexEntry {
  id:           number
  date:         string
  typeId:       number
  typeName:     string
  quantity:     number
  balanceAfter: number
}

export interface Kardex {
  skuId:       number
  internalSku: string
  productName: string
  entries:     KardexEntry[]
}

export interface Warehouse {
  id:          number
  companyId:   number
  name:        string
  createdAt?:  string
  totalStock?: number
}

export interface MovementType {
  id:        number
  code:      string
  name:      string
  operation: '+' | '-'
}