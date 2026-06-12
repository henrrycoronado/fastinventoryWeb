export interface TopProductDashboard {
  productCen?:   string | null
  productName:   string
  totalQuantity: number
  categoryCen?:  string | null
  categoryName?: string | null
  salePrice:     number
}

export interface DailySalesDashboard {
  totalSales:    number
  ticketsCount:  number
  averageTicket: number
}

export interface KdsStatusDashboard {
  pendingCount:   number
  preparingCount: number
  readyCount:     number
}
