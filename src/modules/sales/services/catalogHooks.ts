import { useQuery } from '@tanstack/react-query'
import type { UseQueryOptions } from '@tanstack/react-query'
import { useAppStore } from '../../../core/store/useAppStore'
import { salesApi } from '../hooks'
import type { SellableProduct } from '../types'

export const useSellableProducts = (
  params?: any, 
  options?: Partial<UseQueryOptions<SellableProduct[]>>
) => {
  const companyCen = useAppStore(s => s.selectedCompany?.companyCen)
  return useQuery<SellableProduct[]>({
    queryKey: ['sellable-products', companyCen, params],
    queryFn:  () => salesApi.catalog.listProducts(companyCen!, params),
    enabled:  !!companyCen,
    ...options as any
  })
}
