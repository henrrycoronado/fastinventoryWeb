import { salesClient } from '../../../core/networks/api/client'
import type { SellableProduct } from '../types'

export const catalogApi = {
  listProducts: (companyCen: string, params?: any) =>
    salesClient.get<SellableProduct[]>(`/api/sales/companies/${companyCen}/catalog/products`, { params }).then((r: any) => r.data),
}