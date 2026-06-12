import { salesClient } from '../../../core/networks/api/client'
import type { Ticket, TicketItem } from '../types'

export const ticketApi = {
  list: (companyCen: string, params?: { warehouseCen?: string }) =>
    salesClient.get<Ticket[]>(`/api/sales/companies/${companyCen}/tickets`, { params }).then((r: any) => r.data),
  create: (companyCen: string, data: { waiterCen?: string | null; warehouseCen?: string | null }) =>
    salesClient.post<Ticket>(`/api/sales/companies/${companyCen}/tickets`, data).then((r: any) => r.data),
  listItems: (companyCen: string, ticketCen: string) =>
    salesClient.get<TicketItem[]>(`/api/sales/companies/${companyCen}/tickets/${ticketCen}/items`).then((r: any) => r.data),
  addItem: (companyCen: string, ticketCen: string, data: { productCen: string; quantity: number; note?: string | null }) =>
    salesClient.post<TicketItem>(`/api/sales/companies/${companyCen}/tickets/${ticketCen}/items`, data).then((r: any) => r.data),
  patchItem: (companyCen: string, ticketCen: string, ticketItemCen: string, data: { quantity?: number; note?: string | null }) =>
    salesClient.patch<TicketItem>(`/api/sales/companies/${companyCen}/tickets/${ticketCen}/items/${ticketItemCen}`, data).then((r: any) => r.data),

  resendItem: (companyCen: string, ticketCen: string, ticketItemCen: string) =>
    salesClient.post<TicketItem>(`/api/sales/companies/${companyCen}/tickets/${ticketCen}/items/${ticketItemCen}/resend`).then((r: any) => r.data),
  sendTicket: (companyCen: string, ticketCen: string) =>
    salesClient.post<TicketItem[]>(`/api/sales/companies/${companyCen}/tickets/${ticketCen}/send`).then((r: any) => r.data),
  assignWaiter: (companyCen: string, ticketCen: string, data: { waiterCen: string }) =>
    salesClient.put(`/api/sales/companies/${companyCen}/tickets/${ticketCen}/waiter`, data).then((r: any) => r.data),
  pay: (companyCen: string, ticketCen: string, data: { paymentMethodCode: string }) =>
    salesClient.post(`/api/sales/companies/${companyCen}/tickets/${ticketCen}/payment`, data).then((r: any) => r.data),
  cancel: (companyCen: string, ticketCen: string, reason: string) =>
    salesClient.post(`/api/sales/companies/${companyCen}/tickets/${ticketCen}/cancel`, { reason }).then((r: any) => r.data),
  print: (companyCen: string, ticketCen: string) =>
    salesClient.get(`/api/sales/companies/${companyCen}/tickets/${ticketCen}/print`).then((r: any) => r.data),
  getTotals: (companyCen: string, ticketCen: string) =>
    salesClient.get(`/api/sales/companies/${companyCen}/tickets/${ticketCen}/totals`).then((r: any) => r.data),
}
