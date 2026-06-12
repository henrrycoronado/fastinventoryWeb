import { inventoryClient } from '../../../core/networks/api/client'
import type { Warehouse } from '../types'

export const warehouseApi = {
  list: (companyCen: string) =>
    inventoryClient.get<Warehouse[]>(`/api/inventory/companies/${companyCen}/warehouses`).then((r: any) => r.data),
}