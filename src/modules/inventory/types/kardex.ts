export interface KardexMovement {
  movementCen:  string
  documentCen?: string | null
  productCen:   string
  warehouseCen: string
  movementType: string
  quantity:     number
  unitCost?:    number | null
  reason?:      string | null
  createdAt:    string
}
