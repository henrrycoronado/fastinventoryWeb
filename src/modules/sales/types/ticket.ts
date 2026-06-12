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
