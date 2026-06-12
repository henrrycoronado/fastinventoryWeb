export interface Product {
  productCen:   string
  companyCen:   string
  categoryCen?:  string | null
  categoryName?: string | null
  unitCen?:      string | null
  unitName?:     string | null
  sku:          string
  name:         string
  description?: string | null
  salePrice:    number
  costPrice:    number
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
