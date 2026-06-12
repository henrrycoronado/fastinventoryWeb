import { inventoryClient } from '../../../core/networks/api/client'
import type { KardexMovement } from '../types'

export const kardexApi = {
  get: (companyCen: string, productCen: string, params?: { warehouseCen?: string; from?: string; to?: string }) =>
    inventoryClient.get<KardexMovement[]>(`/api/inventory/companies/${companyCen}/products/${productCen}/kardex`, { params }).then((r: any) => r.data),
}