import { apiClient } from '../../../services/client'

export const inventoryApi = {

  products: {
    list:         (companyId: number) => apiClient.get(`/api/companies/${companyId}/products`).then(r => r.data),
    get:          (companyId: number, id: number) => apiClient.get(`/api/companies/${companyId}/products/${id}`).then(r => r.data),
    create:       (companyId: number, data: any) => apiClient.post(`/api/companies/${companyId}/products`, data).then(r => r.data),
    delete:       (companyId: number, id: number) => apiClient.delete(`/api/companies/${companyId}/products/${id}`).then(r => r.data),
    listGlobal:   () => apiClient.get('/api/global-products').then(r => r.data),
    getGlobalByUpc: (upc: string) => apiClient.get(`/api/global-products/upc/${upc}`).then(r => r.data),
    createGlobal: (data: any) => apiClient.post('/api/global-products', data).then(r => r.data),
  },

  skus: {
    list:   (companyProductId: number) => apiClient.get(`/api/products/${companyProductId}/skus`).then(r => r.data),
    create: (companyProductId: number, data: any) => apiClient.post(`/api/products/${companyProductId}/skus`, data).then(r => r.data),
    delete: (companyProductId: number, id: number) => apiClient.delete(`/api/products/${companyProductId}/skus/${id}`).then(r => r.data),
  },

  categories: {
    listGlobal: () => apiClient.get('/api/global-categories').then(r => r.data),
    create:     (data: { name: string }) => apiClient.post('/api/global-categories', data).then(r => r.data),
    delete:     (id: number) => apiClient.delete(`/api/global-categories/${id}`).then(r => r.data),
  },

  stock: {
    list:   (warehouseId: number) => apiClient.get(`/api/warehouses/${warehouseId}/stocks`).then(r => r.data),
    bySku:  (warehouseId: number, skuId: number, batchId?: number) =>
      apiClient.get(`/api/warehouses/${warehouseId}/stocks/sku/${skuId}`, {
        params: batchId ? { batchId } : {}
      }).then(r => r.data),
  },

  movements: {
    list:     (companyId: number) => apiClient.get(`/api/companies/${companyId}/movements`).then(r => r.data),
    get:      (companyId: number, id: number) => apiClient.get(`/api/companies/${companyId}/movements/${id}`).then(r => r.data),
    incoming: (companyId: number, data: any) => apiClient.post(`/api/companies/${companyId}/movements/incoming`, data).then(r => r.data),
    outgoing: (companyId: number, data: any) => apiClient.post(`/api/companies/${companyId}/movements/outgoing`, data).then(r => r.data),
    delete:   (companyId: number, id: number) => apiClient.delete(`/api/companies/${companyId}/movements/${id}`).then(r => r.data),
  },

  kardex: {
    get: (warehouseId: number, skuId: number) =>
      apiClient.get(`/api/warehouses/${warehouseId}/kardex/sku/${skuId}`).then(r => r.data),
  },

  batches: {
    list:   (skuId: number) => apiClient.get(`/api/skus/${skuId}/batches`).then(r => r.data),
    create: (skuId: number, data: any) => apiClient.post(`/api/skus/${skuId}/batches`, data).then(r => r.data),
    delete: (skuId: number, id: number) => apiClient.delete(`/api/skus/${skuId}/batches/${id}`).then(r => r.data),
  },

  attributes: {
    listByCompany: (companyId: number) => apiClient.get(`/api/companies/${companyId}/attributes`).then(r => r.data),
    create:        (companyId: number, data: { name: string }) => apiClient.post(`/api/companies/${companyId}/attributes`, data).then(r => r.data),
    listBySku:     (skuId: number) => apiClient.get(`/api/skus/${skuId}/attributes`).then(r => r.data),
    addToSku:      (skuId: number, data: any) => apiClient.post(`/api/skus/${skuId}/attributes`, data).then(r => r.data),
    deleteFromSku: (skuId: number, id: number) => apiClient.delete(`/api/skus/${skuId}/attributes/${id}`).then(r => r.data),
  },
}