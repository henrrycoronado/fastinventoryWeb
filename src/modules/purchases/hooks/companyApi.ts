import { purchasesClient } from '../../../core/networks/api/client'

export const companyApi = {
  create: (data: { name: string }) =>
    purchasesClient.post(`/api/purchases/companies`, data).then((r: any) => r.data),
  update: (companyCen: string, data: { name: string; isActive: boolean }) =>
    purchasesClient.put(`/api/purchases/companies/${companyCen}`, data).then((r: any) => r.data),
  createWarehouse: (companyCen: string, data: { name: string }) =>
    purchasesClient.post(`/api/purchases/companies/${companyCen}/warehouses`, data).then((r: any) => r.data),
  updateWarehouse: (companyCen: string, warehouseCen: string, data: { name: string; isActive: boolean }) =>
    purchasesClient.put(`/api/purchases/companies/${companyCen}/warehouses/${warehouseCen}`, data).then((r: any) => r.data),
}
