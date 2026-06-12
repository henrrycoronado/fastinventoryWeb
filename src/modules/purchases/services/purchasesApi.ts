import { purchasesClient } from '../../../services/client'
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
  companies: {
    create: (data: { name: string }) =>
      purchasesClient.post(`/api/purchases/companies`, data).then(r => r.data),
    update: (companyCen: string, data: { name: string; isActive: boolean }) =>
      purchasesClient.put(`/api/purchases/companies/${companyCen}`, data).then(r => r.data),
    createWarehouse: (companyCen: string, data: { name: string }) =>
      purchasesClient.post(`/api/purchases/companies/${companyCen}/warehouses`, data).then(r => r.data),
    updateWarehouse: (companyCen: string, warehouseCen: string, data: { name: string; isActive: boolean }) =>
      purchasesClient.put(`/api/purchases/companies/${companyCen}/warehouses/${warehouseCen}`, data).then(r => r.data),
  },

  suppliers: {
    list: (companyCen: string) =>
      purchasesClient.get<Supplier[]>(`/api/purchases/companies/${companyCen}/suppliers`).then(r => r.data),
    create: (companyCen: string, data: { name: string }) =>
      purchasesClient.post<SupplierManagement>(`/api/purchases/companies/${companyCen}/suppliers`, data).then(r => r.data),
    update: (companyCen: string, supplierCen: string, data: { name: string; isActive: boolean }) =>
      purchasesClient.put<SupplierManagement>(`/api/purchases/companies/${companyCen}/suppliers/${supplierCen}`, data).then(r => r.data),
  },

  orders: {
    list: (companyCen: string, params?: { status?: number; page?: number; pageSize?: number }) =>
      purchasesClient.get<PagedResult<PurchaseOrderListItem>>(`/api/purchases/companies/${companyCen}/orders`, { params }).then(r => r.data),
    get: (companyCen: string, orderCen: string) =>
      purchasesClient.get<PurchaseOrderDetail>(`/api/purchases/companies/${companyCen}/orders/${orderCen}`).then(r => r.data),
    create: (companyCen: string, data: CreatePurchaseOrder) =>
      purchasesClient.post<PurchaseOrderSummary>(`/api/purchases/companies/${companyCen}/orders`, data).then(r => r.data),
    confirm: (companyCen: string, orderCen: string) =>
      purchasesClient.post<PurchaseOrderConfirmation>(`/api/purchases/companies/${companyCen}/orders/${orderCen}/confirm`).then(r => r.data),
  },
}
