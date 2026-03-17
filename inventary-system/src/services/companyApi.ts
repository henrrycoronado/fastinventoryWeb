import { apiClient } from './client'
import type { Company, Warehouse } from './types'

export const companyApi = {
  list:   () => apiClient.get<Company[]>('/api/companies').then(r => r.data),
  get:    (id: number) => apiClient.get<Company>(`/api/companies/${id}`).then(r => r.data),
  create: (data: { name: string }) => apiClient.post<Company>('/api/companies', data).then(r => r.data),
  delete: (id: number) => apiClient.delete(`/api/companies/${id}`).then(r => r.data),
}

export const warehouseApi = {
  list:   (companyId: number) => apiClient.get<Warehouse[]>(`/api/companies/${companyId}/warehouses`).then(r => r.data),
  create: (companyId: number, data: { name: string }) => apiClient.post<Warehouse>(`/api/companies/${companyId}/warehouses`, data).then(r => r.data),
  delete: (companyId: number, id: number) => apiClient.delete(`/api/companies/${companyId}/warehouses/${id}`).then(r => r.data),
}
