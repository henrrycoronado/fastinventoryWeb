import { purchasesClient } from '../../../core/networks/api/client'
import type { Supplier, SupplierManagement } from '../types'

export const supplierApi = {
  list: (companyCen: string) =>
    purchasesClient.get<Supplier[]>(`/api/purchases/companies/${companyCen}/suppliers`).then((r: any) => r.data),
  create: (companyCen: string, data: { name: string }) =>
    purchasesClient.post<SupplierManagement>(`/api/purchases/companies/${companyCen}/suppliers`, data).then((r: any) => r.data),
  update: (companyCen: string, supplierCen: string, data: { name: string; isActive: boolean }) =>
    purchasesClient.put<SupplierManagement>(`/api/purchases/companies/${companyCen}/suppliers/${supplierCen}`, data).then((r: any) => r.data),
}
