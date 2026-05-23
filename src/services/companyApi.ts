import { apiClient } from './client'
import type { Company, Warehouse } from './types'

export const companyApi = {
  list:   () => apiClient.get<Company[]>('/api/inventory/companies').then(r => r.data),
  get:    (cen: string) => apiClient.get<Company>(`/api/inventory/companies/${cen}`).then(r => r.data),
  create: (data: { name: string }) => apiClient.post<Company>('/api/inventory/companies', data).then(r => r.data),
  update: (cen: string, data: { name: string; isActive: boolean }) => apiClient.put<Company>(`/api/inventory/companies/${cen}`, data).then(r => r.data),
}

export const warehouseApi = {
  list:   (companyCen: string) => apiClient.get<Warehouse[]>(`/api/inventory/companies/${companyCen}/warehouses`).then(r => r.data),
  create: (companyCen: string, data: { name: string }) => apiClient.post<Warehouse>(`/api/inventory/companies/${companyCen}/warehouses`, data).then(r => r.data),
  update: (companyCen: string, warehouseCen: string, data: { name: string }) => apiClient.put<Warehouse>(`/api/inventory/companies/${companyCen}/warehouses/${warehouseCen}`, data).then(r => r.data),
}
