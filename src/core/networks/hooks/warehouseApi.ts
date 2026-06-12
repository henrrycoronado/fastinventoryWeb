import { inventoryClient } from '../api/client'
import type { Warehouse } from '../types'

export const warehouseApi = {
  list:   (companyCen: string) => inventoryClient.get<Warehouse[]>(`/api/inventory/companies/${companyCen}/warehouses`).then((r: any) => r.data),
  create: (companyCen: string, data: { name: string }) => inventoryClient.post<Warehouse>(`/api/inventory/companies/${companyCen}/warehouses`, data).then((r: any) => r.data),
  update: (companyCen: string, warehouseCen: string, data: { name: string }) => inventoryClient.put<Warehouse>(`/api/inventory/companies/${companyCen}/warehouses/${warehouseCen}`, data).then((r: any) => r.data),
}
