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
