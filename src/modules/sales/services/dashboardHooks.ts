import { useQuery } from '@tanstack/react-query'
import { useAppStore } from '../../../core/store/useAppStore'
import { salesApi } from '../hooks'
import type { 
  DailySalesDashboard, 
  KdsStatusDashboard, 
  TopProductDashboard 
} from '../types'

export const useDailySales = () => {
  const companyCen = useAppStore(s => s.selectedCompany?.companyCen)
  return useQuery<DailySalesDashboard>({
    queryKey: ['daily-sales', companyCen],
    queryFn:  () => salesApi.dashboard.dailySales(companyCen!),
    enabled:  !!companyCen,
  })
}

export const useKdsStatus = () => {
  const companyCen = useAppStore(s => s.selectedCompany?.companyCen)
  return useQuery<KdsStatusDashboard>({
    queryKey: ['kds-status', companyCen],
    queryFn:  () => salesApi.dashboard.kdsStatus(companyCen!),
    enabled:  !!companyCen,
  })
}

export const useTopProducts = (params?: { topN?: number }) => {
  const companyCen = useAppStore(s => s.selectedCompany?.companyCen)
  return useQuery<TopProductDashboard[]>({
    queryKey: ['top-products', companyCen, params],
    queryFn:  () => salesApi.dashboard.topProducts(companyCen!, params),
    enabled:  !!companyCen,
  })
}
