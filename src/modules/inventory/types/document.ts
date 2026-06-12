export interface DocumentLine {
  lineCen:    string
  productCen: string
  productName: string
  quantity:   number
  unitCost?:  number | null
}

export interface InventoryDocument {
  documentCen:   string
  companyCen:    string
  warehouseCen:  string
  documentType:  string
  status:        string
  title:         string
  reason?:       string | null
  externalReference?: string | null
  createdAt:     string
  totalItems:    number
  generatedMovementCens: string[]
  lines:         DocumentLine[]
}