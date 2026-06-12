import { inventoryClient } from '../../../services/client'
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
      inventoryClient.get<InventoryDashboard>(`/api/inventory/companies/${companyCen}/dashboard`).then(r => r.data),
  },

  categories: {
    list: (companyCen: string) =>
      inventoryClient.get<Category[]>(`/api/inventory/companies/${companyCen}/categories`).then(r => r.data),
    create: (companyCen: string, data: { name: string; description?: string }) =>
      inventoryClient.post<Category>(`/api/inventory/companies/${companyCen}/categories`, data).then(r => r.data),
    update: (companyCen: string, categoryCen: string, data: { name: string; description?: string }) =>
      inventoryClient.put<Category>(`/api/inventory/companies/${companyCen}/categories/${categoryCen}`, data).then(r => r.data),
  },

  units: {
    list: (companyCen: string) =>
      inventoryClient.get<Unit[]>(`/api/inventory/companies/${companyCen}/units`).then(r => r.data),
    create: (companyCen: string, data: { name: string; abbreviation: string }) =>
      inventoryClient.post<Unit>(`/api/inventory/companies/${companyCen}/units`, data).then(r => r.data),
    update: (companyCen: string, unitCen: string, data: { name: string; abbreviation: string }) =>
      inventoryClient.put<Unit>(`/api/inventory/companies/${companyCen}/units/${unitCen}`, data).then(r => r.data),
  },

  warehouses: {
    list: (companyCen: string) =>
      inventoryClient.get<Warehouse[]>(`/api/inventory/companies/${companyCen}/warehouses`).then(r => r.data),
  },

  products: {
    list: (companyCen: string, params?: { search?: string; categoryCen?: string; status?: string }) =>
      inventoryClient.get<Product[]>(`/api/inventory/companies/${companyCen}/products`, { params }).then(r => r.data),
    lookup: (companyCen: string, data: { productCens: string[] }) =>
      inventoryClient.post<Product[]>(`/api/inventory/companies/${companyCen}/products/lookup`, data).then(r => r.data),
    create: (companyCen: string, data: Partial<Product>) =>
      inventoryClient.post<any>(`/api/inventory/companies/${companyCen}/products`, data).then(r => r.data),
    update: (companyCen: string, productCen: string, data: Partial<Product>) =>
      inventoryClient.put<Product>(`/api/inventory/companies/${companyCen}/products/${productCen}`, data).then(r => r.data),
    updateStatus: (companyCen: string, productCen: string, data: { status: string; reason?: string }) =>
      inventoryClient.patch<Product>(`/api/inventory/companies/${companyCen}/products/${productCen}/status`, data).then(r => r.data),
    listSellable: (companyCen: string, params?: any) =>
      inventoryClient.get<SellableProduct[]>(`/api/inventory/companies/${companyCen}/sellable-products`, { params }).then(r => r.data),
  },

  stock: {
    list: (companyCen: string, params?: { productCen?: string; warehouseCen?: string }) =>
      inventoryClient.get<StockItem[]>(`/api/inventory/companies/${companyCen}/stock`, { params }).then(r => r.data),
    validate: (companyCen: string, data: any) =>
      inventoryClient.post<any>(`/api/inventory/companies/${companyCen}/stock/validate`, data).then(r => r.data),
    consume: (companyCen: string, data: any) =>
      inventoryClient.post<any>(`/api/inventory/companies/${companyCen}/stock/consume`, data).then(r => r.data),
    increase: (companyCen: string, data: any) =>
      inventoryClient.post<string>(`/api/inventory/companies/${companyCen}/stock/increase`, data).then(r => r.data),
    adjustment: (companyCen: string, data: any) =>
      inventoryClient.post<any>(`/api/inventory/companies/${companyCen}/stock/adjustments`, data).then(r => r.data),
  },

  documents: {
    list: (companyCen: string, params?: { documentType?: string; from?: string; to?: string }) =>
      inventoryClient.get<InventoryDocument[]>(`/api/inventory/companies/${companyCen}/documents`, { params }).then(r => r.data),
    create: (companyCen: string, data: any) =>
      inventoryClient.post<InventoryDocument>(`/api/inventory/companies/${companyCen}/documents`, data).then(r => r.data),
  },

  kardex: {
    get: (companyCen: string, productCen: string, params?: { warehouseCen?: string; from?: string; to?: string }) =>
      inventoryClient.get<KardexMovement[]>(`/api/inventory/companies/${companyCen}/products/${productCen}/kardex`, { params }).then(r => r.data),
  },
}
