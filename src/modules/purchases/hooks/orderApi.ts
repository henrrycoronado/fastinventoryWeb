import { purchasesClient } from '../../../core/networks/api/client'
import type { 
  PurchaseOrderListItem, 
  PurchaseOrderDetail, 
  CreatePurchaseOrder, 
  PurchaseOrderSummary, 
  PurchaseOrderConfirmation, 
  PagedResult 
} from '../types'

export const orderApi = {
  list: (companyCen: string, params?: { status?: number; page?: number; pageSize?: number }) =>
    purchasesClient.get<PagedResult<PurchaseOrderListItem>>(`/api/purchases/companies/${companyCen}/orders`, { params }).then((r: any) => r.data),
  get: (companyCen: string, orderCen: string) =>
    purchasesClient.get<PurchaseOrderDetail>(`/api/purchases/companies/${companyCen}/orders/${orderCen}`).then((r: any) => r.data),
  create: (companyCen: string, data: CreatePurchaseOrder) =>
    purchasesClient.post<PurchaseOrderSummary>(`/api/purchases/companies/${companyCen}/orders`, data).then((r: any) => r.data),
  confirm: (companyCen: string, orderCen: string) =>
    purchasesClient.post<PurchaseOrderConfirmation>(`/api/purchases/companies/${companyCen}/orders/${orderCen}/confirm`).then((r: any) => r.data),
}
