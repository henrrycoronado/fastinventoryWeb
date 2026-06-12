import { salesClient } from '../../../services/client'
import type {
  SellableProduct,
  Ticket,
  TicketItem,
  Waiter,
  KdsTeam,
  KdsItem,
  PaymentMethod,
  DailySalesDashboard,
  KdsStatusDashboard,
} from './types'

export const salesApi = {
  catalog: {
    listProducts: (companyCen: string, params?: any) =>
      salesClient.get<SellableProduct[]>(`/api/sales/companies/${companyCen}/catalog/products`, { params }).then(r => r.data),
  },

  dashboard: {
    dailySales: (companyCen: string, params?: { warehouseCen?: string }) =>
      salesClient.get<DailySalesDashboard>(`/api/sales/companies/${companyCen}/dashboard/daily-sales`, { params }).then(r => r.data),
    kdsStatus: (companyCen: string, params?: { warehouseCen?: string }) =>
      salesClient.get<KdsStatusDashboard>(`/api/sales/companies/${companyCen}/dashboard/kds-status`, { params }).then(r => r.data),
    topProducts: (companyCen: string, params?: { topN?: number; warehouseCen?: string }) =>
      salesClient.get<any[]>(`/api/sales/companies/${companyCen}/dashboard/top-products`, { params }).then(r => r.data),
  },

  kds: {
    listTeams: (companyCen: string, params?: { warehouseCen?: string }) =>
      salesClient.get<KdsTeam[]>(`/api/sales/companies/${companyCen}/kds/teams`, { params }).then(r => r.data),
    createTeam: (companyCen: string, data: Partial<KdsTeam>) =>
      salesClient.post<KdsTeam>(`/api/sales/companies/${companyCen}/kds/teams`, data).then(r => r.data),
    updateTeam: (companyCen: string, teamCen: string, data: any) =>
      salesClient.put<KdsTeam>(`/api/sales/companies/${companyCen}/kds/teams/${teamCen}`, data).then(r => r.data),
    updateItemStatus: (companyCen: string, ticketItemCen: string, status: string) =>
      salesClient.patch(`/api/sales/companies/${companyCen}/kds/items/${ticketItemCen}/status`, { status }).then(r => r.data),
    listTeamItems: (companyCen: string, teamCen: string) =>
      salesClient.get<KdsItem[]>(`/api/sales/companies/${companyCen}/kds/teams/${teamCen}/items`).then(r => r.data),
  },

  tickets: {
    list: (companyCen: string, params?: { warehouseCen?: string }) =>
      salesClient.get<Ticket[]>(`/api/sales/companies/${companyCen}/tickets`, { params }).then(r => r.data),
    create: (companyCen: string, data: { waiterCen?: string | null; warehouseCen?: string | null }) =>
      salesClient.post<Ticket>(`/api/sales/companies/${companyCen}/tickets`, data).then(r => r.data),
    listItems: (companyCen: string, ticketCen: string) =>
      salesClient.get<TicketItem[]>(`/api/sales/companies/${companyCen}/tickets/${ticketCen}/items`).then(r => r.data),
    addItem: (companyCen: string, ticketCen: string, data: { productCen: string; quantity: number; note?: string | null }) =>
      salesClient.post<TicketItem>(`/api/sales/companies/${companyCen}/tickets/${ticketCen}/items`, data).then(r => r.data),
    patchItem: (companyCen: string, ticketCen: string, ticketItemCen: string, data: { quantity?: number; note?: string | null }) =>
      salesClient.patch<TicketItem>(`/api/sales/companies/${companyCen}/tickets/${ticketCen}/items/${ticketItemCen}`, data).then(r => r.data),

    resendItem: (companyCen: string, ticketCen: string, ticketItemCen: string) =>
      salesClient.post<TicketItem>(`/api/sales/companies/${companyCen}/tickets/${ticketCen}/items/${ticketItemCen}/resend`).then(r => r.data),
    sendTicket: (companyCen: string, ticketCen: string) =>
      salesClient.post<TicketItem[]>(`/api/sales/companies/${companyCen}/tickets/${ticketCen}/send`).then(r => r.data),
    assignWaiter: (companyCen: string, ticketCen: string, data: { waiterCen: string }) =>
      salesClient.put(`/api/sales/companies/${companyCen}/tickets/${ticketCen}/waiter`, data).then(r => r.data),
    pay: (companyCen: string, ticketCen: string, data: { paymentMethodCode: string }) =>
      salesClient.post(`/api/sales/companies/${companyCen}/tickets/${ticketCen}/payment`, data).then(r => r.data),
    cancel: (companyCen: string, ticketCen: string, reason: string) =>
      salesClient.post(`/api/sales/companies/${companyCen}/tickets/${ticketCen}/cancel`, { reason }).then(r => r.data),
    print: (companyCen: string, ticketCen: string) =>
      salesClient.get(`/api/sales/companies/${companyCen}/tickets/${ticketCen}/print`).then(r => r.data),
    getTotals: (companyCen: string, ticketCen: string) =>
      salesClient.get(`/api/sales/companies/${companyCen}/tickets/${ticketCen}/totals`).then(r => r.data),
  },

  waiters: {
    list: (companyCen: string) =>
      salesClient.get<Waiter[]>(`/api/sales/companies/${companyCen}/waiters`).then(r => r.data),
    create: (companyCen: string, data: { name: string }) =>
      salesClient.post<Waiter>(`/api/sales/companies/${companyCen}/waiters`, data).then(r => r.data),
    update: (companyCen: string, waiterCen: string, data: { name: string; isActive: boolean }) =>
      salesClient.put<Waiter>(`/api/sales/companies/${companyCen}/waiters/${waiterCen}`, data).then(r => r.data),
  },

  taxConfiguration: {
    get: (companyCen: string) =>
      salesClient.get(`/api/sales/companies/${companyCen}/tax-configuration`).then(r => r.data),
    update: (companyCen: string, data: { globalTaxPercentage: number }) =>
      salesClient.put(`/api/sales/companies/${companyCen}/tax-configuration`, data).then(r => r.data),
  },

  paymentMethods: {
    list: () => salesClient.get<PaymentMethod[]>('/api/sales/payment-methods').then(r => r.data),
  },
}
