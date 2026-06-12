import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAppStore } from '../../../core/store/useAppStore'
import { purchasesApi } from '../hooks'
import toast from 'react-hot-toast'

export const useSuppliers = () => {
  const companyCen = useAppStore(s => s.selectedCompany?.companyCen)
  return useQuery({
    queryKey: ['suppliers', companyCen],
    queryFn:  () => purchasesApi.suppliers.list(companyCen!),
    enabled:  !!companyCen,
  })
}

export const useCreateSupplier = () => {
  const qc         = useQueryClient()
  const companyCen = useAppStore(s => s.selectedCompany?.companyCen)
  return useMutation({
    mutationFn: (data: { name: string }) =>
      purchasesApi.suppliers.create(companyCen!, { ...data, companyCen: companyCen! }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['suppliers', companyCen] })
      toast.success('Proveedor registrado')
    },
  })
}