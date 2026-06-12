import { inventoryClient } from '../api/client'
import type { Company } from '../types'

export const companyApi = {
  list:   () => inventoryClient.get<Company[]>('/api/inventory/companies').then((r: any) => r.data),
  get:    (cen: string) => inventoryClient.get<Company>(`/api/inventory/companies/${cen}`).then((r: any) => r.data),
  create: (data: { name: string }) => inventoryClient.post<Company>('/api/inventory/companies', data).then((r: any) => r.data),
  update: (cen: string, data: { name: string; isActive: boolean }) => inventoryClient.put<Company>(`/api/inventory/companies/${cen}`, data).then((r: any) => r.data),
}
