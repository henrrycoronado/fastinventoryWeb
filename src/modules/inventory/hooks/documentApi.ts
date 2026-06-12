import { inventoryClient } from '../../../core/networks/api/client'
import type { InventoryDocument } from '../types'

export const documentApi = {
  list: (companyCen: string, params?: { documentType?: string; from?: string; to?: string }) =>
    inventoryClient.get<InventoryDocument[]>(`/api/inventory/companies/${companyCen}/documents`, { params }).then((r: any) => r.data),
  create: (companyCen: string, data: any) =>
    inventoryClient.post<InventoryDocument>(`/api/inventory/companies/${companyCen}/documents`, data).then((r: any) => r.data),
}