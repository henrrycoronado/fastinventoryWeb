import { apiClient } from '../../../services/client'

export const salesApi = {

  customers: {
    list:   (companyId: number) =>
      apiClient.get(`/api/companies/${companyId}/customers`).then(r => r.data),
    create: (companyId: number, data: { name: string; phone?: string; email?: string }) =>
      apiClient.post(`/api/companies/${companyId}/customers`, data).then(r => r.data),
    delete: (companyId: number, id: number) =>
      apiClient.delete(`/api/companies/${companyId}/customers/${id}`).then(r => r.data),
  },

  sellers: {
    list:   (companyId: number) =>
      apiClient.get(`/api/companies/${companyId}/sellers`).then(r => r.data),
    create: (companyId: number, data: { name: string; phone?: string }) =>
      apiClient.post(`/api/companies/${companyId}/sellers`, data).then(r => r.data),
    delete: (companyId: number, id: number) =>
      apiClient.delete(`/api/companies/${companyId}/sellers/${id}`).then(r => r.data),
  },

  sales: {
    list:    (companyId: number) =>
      apiClient.get(`/api/companies/${companyId}/sales`).then(r => r.data),
    get:     (companyId: number, id: number) =>
      apiClient.get(`/api/companies/${companyId}/sales/${id}`).then(r => r.data),
    create:  (companyId: number, data: any) =>
      apiClient.post(`/api/companies/${companyId}/sales`, data).then(r => r.data),
    confirm: (companyId: number, id: number) =>
      apiClient.post(`/api/companies/${companyId}/sales/${id}/confirm`).then(r => r.data),
    cancel:  (companyId: number, id: number) =>
      apiClient.post(`/api/companies/${companyId}/sales/${id}/cancel`).then(r => r.data),
    delete:  (companyId: number, id: number) =>
      apiClient.delete(`/api/companies/${companyId}/sales/${id}`).then(r => r.data),
  },

  receipts: {
    get:    (saleId: number) =>
      apiClient.get(`/api/sales/${saleId}/receipt`).then(r => r.data),
    create: (saleId: number) =>
      apiClient.post(`/api/sales/${saleId}/receipt`).then(r => r.data),
  },

  catalogs: {
    saleStatuses:     () =>
      apiClient.get(`/api/catalogs/sale-statuses`).then(r => r.data),
    categoriesInUse:  (companyId: number) =>
      apiClient.get(`/api/companies/${companyId}/categories-in-use`).then(r => r.data),
  },
}
