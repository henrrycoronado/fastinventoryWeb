import { salesClient } from '../../../core/networks/api/client'
import type { Waiter } from '../types'

export const waiterApi = {
  list: (companyCen: string) =>
    salesClient.get<Waiter[]>(`/api/sales/companies/${companyCen}/waiters`).then((r: any) => r.data),
  create: (companyCen: string, data: { name: string }) =>
    salesClient.post<Waiter>(`/api/sales/companies/${companyCen}/waiters`, data).then((r: any) => r.data),
  update: (companyCen: string, waiterCen: string, data: { name: string; isActive: boolean }) =>
    salesClient.put<Waiter>(`/api/sales/companies/${companyCen}/waiters/${waiterCen}`, data).then((r: any) => r.data),
}
