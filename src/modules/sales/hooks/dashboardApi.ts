import { salesClient } from '../../../core/networks/api/client'
import type {
  DailySalesDashboard,
  MonthlySalesDashboard,
  KdsStatusDashboard,
  TopProductDashboard
} from '../types'

export const dashboardApi = {
  dailySales: (companyCen: string) =>
    salesClient.get<DailySalesDashboard>(`/api/sales/companies/${companyCen}/dashboard/daily-sales`).then((r: any) => r.data),
  monthlySales: (companyCen: string) =>
    salesClient.get<MonthlySalesDashboard>(`/api/sales/companies/${companyCen}/dashboard/monthly`).then((r: any) => r.data),
  kdsStatus: (companyCen: string) =>
    salesClient.get<KdsStatusDashboard>(`/api/sales/companies/${companyCen}/dashboard/kds-status`).then((r: any) => r.data),
  topProducts: (companyCen: string, params?: { topN?: number }) =>
    salesClient.get<TopProductDashboard[]>(`/api/sales/companies/${companyCen}/dashboard/top-products`, { params }).then((r: any) => r.data),
}