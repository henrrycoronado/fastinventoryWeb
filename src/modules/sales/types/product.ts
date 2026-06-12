export interface SellableProduct {
  productCen:        string
  name:              string
  categoryCen:       string | null
  categoryName:      string | null
  salePrice:         number
  availableQuantity: number
  isAvailable:       boolean
  stationCode:       string | null
}