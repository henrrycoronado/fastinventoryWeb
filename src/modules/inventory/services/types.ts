export interface Category {
  categoryCen: string
  name:        string
  description?: string
  isActive:    boolean
}

export interface Unit {
  unitCen:      string
  name:         string
  abbreviation: string
  isActive:     boolean
}

export interface Product {
  productCen:   string
  sku:          string
  name:         string
  description?: string
  categoryCen?: string
  categoryName?: string
  unitCen?:      string
  unitName?:     string
  salePrice:    number
  costPrice?:   number
  reorderLevel: number
  status:       string
  stationCode?: string
}

export interface StockItem {
  productCen:        string
  productName:       string
  warehouseCen:      string
  warehouseName:     string
  availableQuantity: number
  reservedQuantity:  number
  unitName?:         string
  reorderLevel:      number
  isLowStock:        boolean
}

export interface InventoryDocument {
  documentCen:   string
  documentType:  string
  status:        string
  title:         string
  createdAt:     string
  totalItems:    number
  generatedMovementCens?: string[]
}

export interface KardexMovement {
  movementCen:  string
  documentCen:  string
  productCen:   string
  warehouseCen: string
  movementType: string
  quantity:     number
  unitCost:     number
  reason?:      string
  createdAt:    string
}

export interface Warehouse {
  warehouseCen: string
  name:         string
  isActive:     boolean
}

export interface InventoryDashboard {
  companyCen:         string
  totalProducts:      number
  totalStockQuantity: number
  lowStockCount:      number
  outOfStockCount:    number
}

export interface SellableProduct {
  productCen:        string
  name:               string
  categoryCen?:      string
  categoryName?:     string
  salePrice:         number
  availableQuantity: number
  isAvailable:       boolean
  stationCode?:      string
}

export interface StockRequirement {
  productCen:        string
  productName:       string
  warehouseCen:      string
  requestedQuantity: number
  availableQuantity: number
  missingQuantity:   number
  unitName?:         string
  reason?:           string
}

export interface StockValidationResponse {
  isValid:      boolean
  requirements: StockRequirement[]
}

export interface StockConsumeResponse {
  success:               boolean
  documentCen?:          string
  documentType?:         string
  generatedMovementCens?: string[]
  requirements?:         StockRequirement[]
}

export interface InventoryAdjustmentLine {
  productCen:     string
  quantity:       number
  adjustmentType: string
}

export interface InventoryAdjustmentRequest {
  warehouseCen: string
  reason:       string
  lines:        InventoryAdjustmentLine[]
}

export interface GeneratedMovement {
  movementCen:  string
  productCen:   string
  warehouseCen: string
  quantity:     number
  movementType: string
}

export interface InventoryAdjustmentResponse {
  adjustmentCen:      string
  status:             string
  generatedMovements: GeneratedMovement[]
}
