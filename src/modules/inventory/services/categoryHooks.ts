import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAppStore } from '../../../core/store/useAppStore'
import { inventoryApi } from '../hooks'
import toast from 'react-hot-toast'
import type { Category } from '../types'

export const useCategories = () => {
  const companyCen = useAppStore(s => s.selectedCompany?.companyCen)
  return useQuery<Category[]>({
    queryKey: ['categories', companyCen],
    queryFn:  () => inventoryApi.categories.list(companyCen!),
    enabled:  !!companyCen,
  })
}

export const useCreateCategory = () => {
  const qc         = useQueryClient()
  const companyCen = useAppStore(s => s.selectedCompany?.companyCen)
  return useMutation({
    mutationFn: (data: { name: string; description?: string }) =>
      inventoryApi.categories.create(companyCen!, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['categories', companyCen] })
      toast.success('Categoría creada')
    },
  })
}