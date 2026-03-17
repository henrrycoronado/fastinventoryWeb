import { useQuery } from '@tanstack/react-query'
import { useAppStore } from '../../../store/useAppStore'
import { inventoryApi } from './inventoryApi'

export const useStock = () => {
  const warehouseId = useAppStore(s => s.selectedWarehouse?.id)
  return useQuery({
    queryKey: ['stock', warehouseId],
    queryFn:  () => inventoryApi.stock.list(warehouseId!),
    enabled:  !!warehouseId,
    refetchInterval: 30_000,
  })
}

export const useCompanyProducts = () => {
  const companyId = useAppStore(s => s.selectedCompany?.id)
  return useQuery({
    queryKey: ['company-products', companyId],
    queryFn:  () => inventoryApi.products.list(companyId!),
    enabled:  !!companyId,
  })
}

export const useMovements = () => {
  const companyId = useAppStore(s => s.selectedCompany?.id)
  return useQuery({
    queryKey: ['movements', companyId],
    queryFn:  () => inventoryApi.movements.list(companyId!),
    enabled:  !!companyId,
  })
}

export const useGlobalCategories = () =>
  useQuery({
    queryKey: ['global-categories'],
    queryFn:  () => inventoryApi.categories.listGlobal(),
    staleTime: Infinity,
  })