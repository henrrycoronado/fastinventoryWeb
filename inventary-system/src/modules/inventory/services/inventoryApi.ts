import { apiClient } from '../../../services/client'
import type {
  Category,
  Unit,
  Product,
  StockItem,
  InventoryDocument,
  KardexMovement,
  Warehouse,
  InventoryDashboard,
  SellableProduct,
} from './types'

export const inventoryApi = {
  dashboard: {
    get: (companyCen: string) =>
      apiClient.get<InventoryDashboard>(`/api/inventory/companies/${companyCen}/dashboard`).then(r => r.data),
  },

  categories: {
    list: (companyCen: string) =>
      apiClient.get<Category[]>(`/api/inventory/companies/${companyCen}/categories`).then(r => r.data),
    create: (companyCen: string, data: { name: string; description?: string }) =>
      apiClient.post<Category>(`/api/inventory/companies/${companyCen}/categories`, data).then(r => r.data),
    update: (companyCen: string, categoryCen: string, data: { name: string; description?: string }) =>
      apiClient.put<Category>(`/api/inventory/companies/${companyCen}/categories/${categoryCen}`, data).then(r => r.data),
  },

  units: {
    list: (companyCen: string) =>
      apiClient.get<Unit[]>(`/api/inventory/companies/${companyCen}/units`).then(r => r.data),
  },

  warehouses: {
    list: (companyCen: string) =>
      apiClient.get<Warehouse[]>(`/api/inventory/companies/${companyCen}/warehouses`).then(r => r.data),
  },

  products: {
    list: (companyCen: string, params?: { search?: string; categoryCen?: string; status?: string }) =>
      apiClient.get<Product[]>(`/api/inventory/companies/${companyCen}/products`, { params }).then(r => r.data),
    create: (companyCen: string, data: Partial<Product>) =>
      apiClient.post<any>(`/api/inventory/companies/${companyCen}/products`, data).then(r => r.data),
    update: (companyCen: string, productCen: string, data: Partial<Product>) =>
      apiClient.put<Product>(`/api/inventory/companies/${companyCen}/products/${productCen}`, data).then(r => r.data),
    updateStatus: (companyCen: string, productCen: string, data: { status: string; reason?: string }) =>
      apiClient.patch<Product>(`/api/inventory/companies/${companyCen}/products/${productCen}/status`, data).then(r => r.data),
    listSellable: (companyCen: string, params?: any) =>
      apiClient.get<SellableProduct[]>(`/api/inventory/companies/${companyCen}/sellable-products`, { params }).then(r => r.data),
  },

  stock: {
    list: (companyCen: string, params?: { productCen?: string; warehouseCen?: string }) =>
      apiClient.get<StockItem[]>(`/api/inventory/companies/${companyCen}/stock`, { params }).then(r => r.data),
  },

  documents: {
    list: (companyCen: string, params?: { documentType?: string; from?: string; to?: string }) =>
      apiClient.get<InventoryDocument[]>(`/api/inventory/companies/${companyCen}/documents`, { params }).then(r => r.data),
    create: (companyCen: string, data: any) =>
      apiClient.post<InventoryDocument>(`/api/inventory/companies/${companyCen}/documents`, data).then(r => r.data),
  },

  kardex: {
    get: (companyCen: string, productCen: string, params?: { warehouseCen?: string; from?: string; to?: string }) =>
      apiClient.get<KardexMovement[]>(`/api/inventory/companies/${companyCen}/products/${productCen}/kardex`, { params }).then(r => r.data),
  },
}
