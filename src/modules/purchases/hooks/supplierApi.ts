import { purchasesClient } from '../../../core/networks/api/client'
import type { Supplier, CreateSupplierRequest, UpdateSupplierRequest } from '../types'

export const supplierApi = {
  list: (companyCen: string) =>
    purchasesClient.get<Supplier[]>(`/api/purchases/companies/${companyCen}/suppliers`).then((r: any) => r.data),
  create: (companyCen: string, data: CreateSupplierRequest) =>
    purchasesClient.post<Supplier>(`/api/purchases/companies/${companyCen}/suppliers`, data).then((r: any) => r.data),
  update: (companyCen: string, supplierCen: string, data: UpdateSupplierRequest) =>
    purchasesClient.put<Supplier>(`/api/purchases/companies/${companyCen}/suppliers/${supplierCen}`, data).then((r: any) => r.data),
}
