import { inventoryClient } from '../../../core/networks/api/client'
import type { StockItem } from '../types'

export const stockApi = {
  list: (companyCen: string, params?: { productCen?: string; warehouseCen?: string }) =>
    inventoryClient.get<StockItem[]>(`/api/inventory/companies/${companyCen}/stock`, { params }).then((r: any) => r.data),
  validate: (companyCen: string, data: any) =>
    inventoryClient.post<any>(`/api/inventory/companies/${companyCen}/stock/validate`, data).then((r: any) => r.data),
  consume: (companyCen: string, data: any) =>
    inventoryClient.post<any>(`/api/inventory/companies/${companyCen}/stock/consume`, data).then((r: any) => r.data),
  increase: (companyCen: string, data: any) =>
    inventoryClient.post<string>(`/api/inventory/companies/${companyCen}/stock/increase`, data).then((r: any) => r.data),
  adjustment: (companyCen: string, data: any) =>
    inventoryClient.post<any>(`/api/inventory/companies/${companyCen}/stock/adjustments`, data).then((r: any) => r.data),
}
