export interface Product {
  productCen:   string
  sku:          string
  name:         string
  description?: string | null
  categoryCen:  string
  categoryName: string
  unitCen:      string
  unitName:     string
  salePrice:    number
  costPrice?:   number | null
  reorderLevel: number
  status:       string
  stationCode?: string | null
}

export interface SellableProduct {
  productCen:        string
  name:              string
  categoryCen:       string
  categoryName:      string
  salePrice:         number
  availableQuantity: number
  isAvailable:       boolean
  stationCode?:      string | null
}
