import { salesClient } from '../../../core/networks/api/client'
import type { Waiter, CreateWaiterRequest } from '../types'

export const waiterApi = {
  list: (companyCen: string) =>
    salesClient.get<Waiter[]>(`/api/sales/companies/${companyCen}/waiters`).then((r: any) => r.data),
  
  create: (companyCen: string, data: CreateWaiterRequest) =>
    salesClient.post<Waiter>(`/api/sales/companies/${companyCen}/waiters`, data).then((r: any) => r.data),
}
