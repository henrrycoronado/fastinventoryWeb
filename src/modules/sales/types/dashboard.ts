export interface DailySalesDashboard {
  totalSales:    number
  ticketsCount:  number
  averageTicket: number
}

export interface MonthlySalesDashboard {
  currentMonth:  MonthlySummary
  previousMonth: MonthlySummary
}

export interface MonthlySummary {
  totalSales:    number
  ticketsCount:  number
  averageTicket: number
}

export interface TopProductDashboard {
  productCen:   string
  productName:  string
  quantity:     number
  totalAmount:  number
}

export interface KdsStatusDashboard {
  pendingItems:            number
  preparingItems:          number
  averageWaitTimeMinutes:  number
}
