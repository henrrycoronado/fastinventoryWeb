import { inventoryClient } from '../../../core/networks/api/client'
import type { InventoryDashboard } from '../types'

export const dashboardApi = {
  get: (companyCen: string) =>
    inventoryClient.get<InventoryDashboard>(`/api/inventory/companies/${companyCen}/dashboard`).then((r: any) => r.data),
}
