import { salesClient } from '../../../core/networks/api/client'
import type { 
  Ticket, 
  TicketItem, 
  TicketTotals, 
  CreateTicketRequest, 
  CreateTicketItemRequest, 
  UpdateTicketItemRequest, 
  AssignTicketWaiterRequest, 
  AssignTicketWaiterResponse, 
  CancelTicketRequest, 
  CancelTicketResponse, 
  PayTicketRequest, 
  PayTicketResponse 
} from '../types'

export const ticketApi = {
  list: (companyCen: string) =>
    salesClient.get<Ticket[]>(`/api/sales/companies/${companyCen}/tickets`).then((r: any) => r.data),
  
  create: (companyCen: string, data: CreateTicketRequest) =>
    salesClient.post<Ticket>(`/api/sales/companies/${companyCen}/tickets`, data).then((r: any) => r.data),
  
  listItems: (companyCen: string, ticketCen: string) =>
    salesClient.get<TicketItem[]>(`/api/sales/companies/${companyCen}/tickets/${ticketCen}/items`).then((r: any) => r.data),
  
  addItem: (companyCen: string, ticketCen: string, data: CreateTicketItemRequest) =>
    salesClient.post<TicketItem>(`/api/sales/companies/${companyCen}/tickets/${ticketCen}/items`, data).then((r: any) => r.data),
  
  patchItem: (companyCen: string, ticketCen: string, ticketItemCen: string, data: UpdateTicketItemRequest) =>
    salesClient.patch<TicketItem>(`/api/sales/companies/${companyCen}/tickets/${ticketCen}/items/${ticketItemCen}`, data).then((r: any) => r.data),

  sendTicket: (companyCen: string, ticketCen: string) =>
    salesClient.post<TicketItem[]>(`/api/sales/companies/${companyCen}/tickets/${ticketCen}/send`).then((r: any) => r.data),
    
  resendItem: (companyCen: string, ticketCen: string, ticketItemCen: string) =>
    salesClient.post<TicketItem>(`/api/sales/companies/${companyCen}/tickets/${ticketCen}/items/${ticketItemCen}/resend`).then((r: any) => r.data),
  
  assignWaiter: (companyCen: string, ticketCen: string, data: AssignTicketWaiterRequest) =>
    salesClient.put<AssignTicketWaiterResponse>(`/api/sales/companies/${companyCen}/tickets/${ticketCen}/waiter`, data).then((r: any) => r.data),
  
  cancel: (companyCen: string, ticketCen: string, data: CancelTicketRequest) =>
    salesClient.post<CancelTicketResponse>(`/api/sales/companies/${companyCen}/tickets/${ticketCen}/cancel`, data).then((r: any) => r.data),
  
  getTotals: (companyCen: string, ticketCen: string) =>
    salesClient.get<TicketTotals>(`/api/sales/companies/${companyCen}/tickets/${ticketCen}/totals`).then((r: any) => r.data),

  pay: (companyCen: string, ticketCen: string, data: PayTicketRequest) =>
    salesClient.post<PayTicketResponse>(`/api/sales/companies/${companyCen}/tickets/${ticketCen}/payment`, data).then((r: any) => r.data),
  
  print: (companyCen: string, ticketCen: string) =>
    salesClient.get(`/api/sales/companies/${companyCen}/tickets/${ticketCen}/print`, { responseType: 'blob' }).then((r: any) => r.data),
}
