import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAppStore } from '../../../core/store/useAppStore'
import { salesApi } from '../hooks'
import toast from 'react-hot-toast'
import type { Waiter } from '../types'

export const useWaiters = () => {
  const companyCen = useAppStore(s => s.selectedCompany?.companyCen)
  return useQuery<Waiter[]>({
    queryKey: ['waiters', companyCen],
    queryFn:  () => salesApi.waiters.list(companyCen!),
    enabled:  !!companyCen,
  })
}

export const useCreateWaiter = () => {
  const qc         = useQueryClient()
  const companyCen = useAppStore(s => s.selectedCompany?.companyCen)
  return useMutation({
    mutationFn: (data: { name: string }) =>
      salesApi.waiters.create(companyCen!, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['waiters', companyCen] })
      toast.success('Mesero registrado')
    },
  })
}
