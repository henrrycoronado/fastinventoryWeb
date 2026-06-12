import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAppStore } from '../../../core/store/useAppStore'
import { inventoryApi } from '../hooks'
import toast from 'react-hot-toast'
import type { Unit } from '../types'

export const useUnits = () => {
  const companyCen = useAppStore(s => s.selectedCompany?.companyCen)
  return useQuery<Unit[]>({
    queryKey: ['units', companyCen],
    queryFn:  () => inventoryApi.units.list(companyCen!),
    enabled:  !!companyCen,
  })
}

export const useCreateUnit = () => {
  const qc         = useQueryClient()
  const companyCen = useAppStore(s => s.selectedCompany?.companyCen)
  return useMutation({
    mutationFn: (data: { name: string; abbreviation: string }) =>
      inventoryApi.units.create(companyCen!, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['units', companyCen] })
      toast.success('Unidad creada')
    },
  })
}