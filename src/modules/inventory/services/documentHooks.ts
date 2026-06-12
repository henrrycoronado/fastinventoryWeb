import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAppStore } from '../../../core/store/useAppStore'
import { inventoryApi } from '../hooks'
import toast from 'react-hot-toast'
import type { InventoryDocument } from '../types'

export const useInventoryDocuments = (params?: { documentType?: string; from?: string; to?: string }) => {
  const companyCen = useAppStore(s => s.selectedCompany?.companyCen)
  return useQuery<InventoryDocument[]>({
    queryKey: ['inventory-documents', companyCen, params],
    queryFn:  () => inventoryApi.documents.list(companyCen!, params),
    enabled:  !!companyCen,
  })
}

export const useCreateInventoryDocument = () => {
  const qc         = useQueryClient()
  const companyCen = useAppStore(s => s.selectedCompany?.companyCen)
  return useMutation({
    mutationFn: (data: any) =>
      inventoryApi.documents.create(companyCen!, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['inventory-documents', companyCen] })
      qc.invalidateQueries({ queryKey: ['stock'] })
      toast.success('Documento de inventario registrado')
    },
  })
}