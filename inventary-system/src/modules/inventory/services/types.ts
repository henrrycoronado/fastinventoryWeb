export interface GlobalCategory {
  id:   number
  name: string
}

export interface GlobalProduct {
  id:          number
  categoryId:  number
  name:        string
  brand?:      string
  upcBarcode?: string
}

export interface CompanyProduct {
  id:              number
  companyId:       number
  globalProductId: number
  localNameAlias?: string
  wholesalePrice?: number
  globalProduct?:  GlobalProduct
}

export interface Sku {
  id:               number
  companyProductId: number
  internalSku?:     string
  retailPrice?:     number
}

export interface SkuAttribute {
  id:          number
  skuId:       number
  attributeId: number
  value:       string
  attribute?:  { id: number; name: string }
}

export interface Batch {
  id:               number
  skuId:            number
  batchNumber:      string
  manufactureDate?: string
  expirationDate?:  string
}

export interface Stock {
  id:                number
  warehouseId:       number
  skuId:             number
  batchId?:          number
  quantity:          number
  availableQuantity: number
  sku?: Sku & {
    companyProduct?: CompanyProduct & {
      globalProduct?: GlobalProduct
    }
  }
  batch?: Batch
}

export interface MovementDetail {
  skuId:     number
  batchId?:  number | null
  quantity:  number
  unitCost:  number
}

export interface Movement {
  id:                number
  companyId:         number
  warehouseId:       number
  targetWarehouseId?: number | null
  typeId:            number
  statusId:          number
  notes?:            string
  createdAt:         string
  details?:          MovementDetail[]
}

export interface KardexEntry {
  id:        number
  date:      string
  typeId:    number
  typeName:  string
  quantity:  number
  unitCost:  number
  balance:   number
  notes?:    string
}