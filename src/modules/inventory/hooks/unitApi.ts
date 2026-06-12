import { inventoryClient } from '../../../core/networks/api/client'
import type { Unit } from '../types'

export const unitApi = {
  list: (companyCen: string) =>
    inventoryClient.get<Unit[]>(`/api/inventory/companies/${companyCen}/units`).then((r: any) => r.data),
  create: (companyCen: string, data: { name: string; abbreviation: string }) =>
    inventoryClient.post<Unit>(`/api/inventory/companies/${companyCen}/units`, data).then((r: any) => r.data),
  update: (companyCen: string, unitCen: string, data: { name: string; abbreviation: string }) =>
    inventoryClient.put<Unit>(`/api/inventory/companies/${companyCen}/units/${unitCen}`, data).then((r: any) => r.data),
}