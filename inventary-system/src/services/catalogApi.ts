import { apiClient } from './client'
import type { Catalog } from './types'

export const catalogApi = {
  movementStatuses: () => apiClient.get<Catalog[]>('/api/catalogs/movement-statuses').then(r => r.data),
  movementTypes:    () => apiClient.get<Catalog[]>('/api/catalogs/movement-types').then(r => r.data),
  saleStatuses:     () => apiClient.get<Catalog[]>('/api/catalogs/sale-statuses').then(r => r.data),
  pdvOrderStatuses: () => apiClient.get<Catalog[]>('/api/catalogs/pdv-order-statuses').then(r => r.data),
  pdvItemStatuses:  () => apiClient.get<Catalog[]>('/api/catalogs/pdv-item-statuses').then(r => r.data),
}