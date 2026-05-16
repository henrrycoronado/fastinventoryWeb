import { apiClient } from '../../../services/client'
import type {
  Supplier,
  SupplierManagement,
  PurchaseOrderListItem,
  PurchaseOrderDetail,
  CreatePurchaseOrder,
  PurchaseOrderSummary,
  PurchaseOrderConfirmation,
  PagedResult,
} from './types'

export const purchasesApi = {
  suppliers: {
    list: (companyCen: string) =>
      apiClient.get<Supplier[]>(`/api/purchases/companies/${companyCen}/suppliers`).then(r => r.data),
    create: (companyCen: string, data: { name: string }) =>
      apiClient.post<SupplierManagement>(`/api/purchases/companies/${companyCen}/suppliers`, data).then(r => r.data),
    update: (companyCen: string, supplierCen: string, data: { name: string; isActive: boolean }) =>
      apiClient.put<SupplierManagement>(`/api/purchases/companies/${companyCen}/suppliers/${supplierCen}`, data).then(r => r.data),
  },

  orders: {
    list: (companyCen: string, params?: { status?: number; page?: number; pageSize?: number }) =>
      apiClient.get<PagedResult<PurchaseOrderListItem>>(`/api/purchases/companies/${companyCen}/orders`, { params }).then(r => r.data),
    get: (companyCen: string, orderCen: string) =>
      apiClient.get<PurchaseOrderDetail>(`/api/purchases/companies/${companyCen}/orders/${orderCen}`).then(r => r.data),
    create: (companyCen: string, data: CreatePurchaseOrder) =>
      apiClient.post<PurchaseOrderSummary>(`/api/purchases/companies/${companyCen}/orders`, data).then(r => r.data),
    confirm: (companyCen: string, orderCen: string) =>
      apiClient.post<PurchaseOrderConfirmation>(`/api/purchases/companies/${companyCen}/orders/${orderCen}/confirm`).then(r => r.data),
  },
}
