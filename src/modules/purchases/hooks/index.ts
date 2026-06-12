import { companyApi } from './companyApi'
import { supplierApi } from './supplierApi'
import { orderApi } from './orderApi'

export const purchasesApi = {
  companies: companyApi,
  suppliers: supplierApi,
  orders: orderApi,
}
