export interface StockItem {
  productCen:        string
  productName:       string
  warehouseCen:      string
  warehouseName:     string
  availableQuantity: number
  reservedQuantity:  number
  unitName:          string
  reorderLevel:      number
  isLowStock:        boolean
}

export interface StockRequirement {
  productCen:        string
  productName:       string
  warehouseCen:      string
  requestedQuantity: number
  availableQuantity: number
  missingQuantity:   number
  unitName:          string
  reason:            string
}

export interface StockValidationResponse {
  isValid:      boolean
  requirements: StockRequirement[]
}

export interface StockConsumeResponse {
  success:               boolean
  documentCen?:          string | null
  documentType?:         string | null
  generatedMovementCens: string[]
  requirements:          StockRequirement[]
}
