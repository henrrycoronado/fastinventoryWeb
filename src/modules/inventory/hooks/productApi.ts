import { inventoryClient } from '../../../core/networks/api/client'
import type { Product, SellableProduct } from '../types'

export const productApi = {
  list: (companyCen: string, params?: { search?: string; categoryCen?: string; status?: string }) =>
    inventoryClient.get<Product[]>(`/api/inventory/companies/${companyCen}/products`, { params }).then((r: any) => r.data),
  lookup: (companyCen: string, data: { productCens: string[] }) =>
    inventoryClient.post<Product[]>(`/api/inventory/companies/${companyCen}/products/lookup`, data).then((r: any) => r.data),
  create: (companyCen: string, data: Partial<Product>) =>
    inventoryClient.post<any>(`/api/inventory/companies/${companyCen}/products`, data).then((r: any) => r.data),
  update: (companyCen: string, productCen: string, data: Partial<Product>) =>
    inventoryClient.put<Product>(`/api/inventory/companies/${companyCen}/products/${productCen}`, data).then((r: any) => r.data),
  updateStatus: (companyCen: string, productCen: string, data: { status: string; reason?: string }) =>
    inventoryClient.patch<Product>(`/api/inventory/companies/${companyCen}/products/${productCen}/status`, data).then((r: any) => r.data),
  listSellable: (companyCen: string, params?: any) =>
    inventoryClient.get<SellableProduct[]>(`/api/inventory/companies/${companyCen}/sellable-products`, { params }).then((r: any) => r.data),
}
