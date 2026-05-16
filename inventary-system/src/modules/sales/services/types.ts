export interface SellableProduct {
  productCen:        string
  name:               string
  categoryCen?:      string
  categoryName?:     string
  salePrice:         number
  availableQuantity: number
  isAvailable:       boolean
  stationCode?:      string
}

export interface Ticket {
  ticketCen:    string
  warehouseCen: string
  waiterCen?:   string
  waiterName?:  string
  status:       string
  total:        number
  createdAt:    string
}

export interface TicketItem {
  ticketItemCen: string
  productCen:    string
  productName:   string
  quantity:      number
  unitPrice:     number
  subtotal:      number
  status:        string
  note?:         string
}

export interface Waiter {
  waiterCen:    string
  name:         string
  warehouseCen: string
}

export interface KdsTeam {
  teamCen:       string
  name:          string
  categoryCens:  string[]
  warehouseCen:  string
}

export interface KdsItem {
  ticketItemCen: string
  ticketCen:     string
  productCen:    string
  productName:   string
  quantity:      number
  status:        string
  note?:         string
  resendCount:   number
  createdAt:     string
}

export interface PaymentMethod {
  paymentMethodCode: string
  name:              string
  isActive:          boolean
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
