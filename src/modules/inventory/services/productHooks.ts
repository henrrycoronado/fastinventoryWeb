import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { UseQueryOptions } from '@tanstack/react-query'
import { useAppStore } from '../../../core/store/useAppStore'
import { inventoryApi } from '../hooks'
import toast from 'react-hot-toast'
import type { Product } from '../types'

export const useProducts = (
  params?: { search?: string; categoryCen?: string; status?: string },
  options?: Partial<UseQueryOptions<Product[]>>
) => {
  const companyCen = useAppStore(s => s.selectedCompany?.companyCen)
  return useQuery<Product[]>({
    queryKey: ['products', companyCen, params],
    queryFn:  () => inventoryApi.products.list(companyCen!, params),
    enabled:  !!companyCen,
    ...options as any
  })
}

export const useCreateProduct = () => {
  const qc         = useQueryClient()
  const companyCen = useAppStore(s => s.selectedCompany?.companyCen)
  return useMutation({
    mutationFn: (data: any) =>
      inventoryApi.products.create(companyCen!, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['products', companyCen] })
      toast.success('Producto creado')
    },
  })
}