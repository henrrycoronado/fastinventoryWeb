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

export interface Ticket {
  ticketCen:     string
  dailyNumber?:  number
  status:        string
  createdAt:     string
  waiterCen?:    string | null
  warehouseCen?: string | null
  companyCen?:   string | null
  taxAmount?:    number
}

export interface TicketItem {
  ticketItemCen: string
  productCen:    string
  productName:   string
  quantity:      number
  unitPrice:     number
  status:        string
  note?:         string | null
  sentAt?:       string | null
  resendCount?:  number
}

export interface TicketTotals {
  ticketCen: string
  subtotal:  number
  taxAmount: number
  total:     number
}

export interface TaxConfiguration {
  companyCen:          string
  globalTaxPercentage: number
}

export interface TopProductDashboard {
  productCen?:   string | null
  productName:   string
  totalQuantity: number
  categoryCen?:  string | null
  categoryName?: string | null
  salePrice:     number
}

export interface Waiter {
  waiterCen: string
  name:      string
}

export interface KdsTeam {
  teamCen:      string
  name:         string
  categoryCens: string[]
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
