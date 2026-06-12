import { inventoryClient } from '../../../core/networks/api/client'
import type { Category } from '../types'

export const categoryApi = {
  list: (companyCen: string) =>
    inventoryClient.get<Category[]>(`/api/inventory/companies/${companyCen}/categories`).then((r: any) => r.data),
  create: (companyCen: string, data: { name: string; description?: string }) =>
    inventoryClient.post<Category>(`/api/inventory/companies/${companyCen}/categories`, data).then((r: any) => r.data),
  update: (companyCen: string, categoryCen: string, data: { name: string; description?: string }) =>
    inventoryClient.put<Category>(`/api/inventory/companies/${companyCen}/categories/${categoryCen}`, data).then((r: any) => r.data),
}
