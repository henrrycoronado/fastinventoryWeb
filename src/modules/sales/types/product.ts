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
