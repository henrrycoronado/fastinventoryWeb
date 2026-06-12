export interface Ticket {
  ticketCen:    string
  dailyNumber:  number
  status:       string
  waiterCen:    string | null
  createdAt:    string
  itemCount:    number
  total:        number
}

export interface TicketItem {
  ticketItemCen: string
  productCen:    string
  productName:   string
  quantity:      number
  unitPrice:     number
  subtotal:      number
  note:          string | null
  kdsStatus:     string
}

export interface TicketTotals {
  subtotal:  number
  taxAmount: number
  total:     number
}

export interface CreateTicketRequest {
  waiterCen?: string | null
}

export interface CreateTicketItemRequest {
  productCen: string
  quantity:   number
  note?:      string | null
}

export interface UpdateTicketItemRequest {
  quantity: number
  note?:    string | null
}

export interface AssignTicketWaiterRequest {
  waiterCen: string
}

export interface AssignTicketWaiterResponse {
  ticketCen:  string
  waiterCen:  string
  waiterName: string
}

export interface CancelTicketRequest {
  reason?: string | null
}

export interface CancelTicketResponse {
  ticketCen: string
  status:    string
}

export interface PayTicketRequest {
  paymentMethodCode: string
}

export interface PayTicketResponse {
  saleCen:               string
  ticketCen:             string
  status:                string
  inventoryDocumentCen: string | null
}