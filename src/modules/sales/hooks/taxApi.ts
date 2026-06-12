import { salesClient } from '../../../core/networks/api/client'
import type { TaxConfiguration, UpdateTaxConfigurationRequest } from '../types'

export const taxApi = {
  get: (companyCen: string) =>
    salesClient.get<TaxConfiguration>(`/api/sales/companies/${companyCen}/tax-configuration`).then((r: any) => r.data),
  update: (companyCen: string, data: UpdateTaxConfigurationRequest) =>
    salesClient.put<TaxConfiguration>(`/api/sales/companies/${companyCen}/tax-configuration`, data).then((r: any) => r.data),
}