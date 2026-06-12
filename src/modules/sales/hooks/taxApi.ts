import { salesClient } from '../../../core/networks/api/client'

export const taxApi = {
  get: (companyCen: string) =>
    salesClient.get(`/api/sales/companies/${companyCen}/tax-configuration`).then((r: any) => r.data),
  update: (companyCen: string, data: { globalTaxPercentage: number }) =>
    salesClient.put(`/api/sales/companies/${companyCen}/tax-configuration`, data).then((r: any) => r.data),
}
