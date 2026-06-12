import { salesClient } from '../../../core/networks/api/client'
import type { DailySalesDashboard, KdsStatusDashboard } from '../types'

export const dashboardApi = {
  dailySales: (companyCen: string, params?: { warehouseCen?: string }) =>
    salesClient.get<DailySalesDashboard>(`/api/sales/companies/${companyCen}/dashboard/daily-sales`, { params }).then((r: any) => r.data),
  kdsStatus: (companyCen: string, params?: { warehouseCen?: string }) =>
    salesClient.get<KdsStatusDashboard>(`/api/sales/companies/${companyCen}/dashboard/kds-status`, { params }).then((r: any) => r.data),
  topProducts: (companyCen: string, params?: { topN?: number; warehouseCen?: string }) =>
    salesClient.get<any[]>(`/api/sales/companies/${companyCen}/dashboard/top-products`, { params }).then((r: any) => r.data),
}
