import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAppStore } from '../../../store/useAppStore'
import { purchasesApi } from './purchasesApi'
import type { CreatePurchaseOrder } from './types'
import toast from 'react-hot-toast'

export const useSuppliers = () => {
  const companyCen = useAppStore(s => s.selectedCompany?.cen)
  return useQuery({
    queryKey: ['suppliers', companyCen],
    queryFn:  () => purchasesApi.suppliers.list(companyCen!),
    enabled:  !!companyCen,
  })
}

export const useCreateSupplier = () => {
  const qc         = useQueryClient()
  const companyCen = useAppStore(s => s.selectedCompany?.cen)
  return useMutation({
    mutationFn: (data: { name: string }) =>
      purchasesApi.suppliers.create(companyCen!, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['suppliers', companyCen] })
      toast.success('Proveedor registrado')
    },
  })
}

export const useOrders = (params?: { status?: number; page?: number; pageSize?: number }) => {
  const companyCen = useAppStore(s => s.selectedCompany?.cen)
  return useQuery({
    queryKey: ['purchase-orders', companyCen, params],
    queryFn:  () => purchasesApi.orders.list(companyCen!, params),
    enabled:  !!companyCen,
  })
}

export const useOrderDetail = (orderCen: string | undefined) => {
  const companyCen = useAppStore(s => s.selectedCompany?.cen)
  return useQuery({
    queryKey: ['purchase-order', companyCen, orderCen],
    queryFn:  () => purchasesApi.orders.get(companyCen!, orderCen!),
    enabled:  !!companyCen && !!orderCen,
  })
}

export const useCreateOrder = () => {
  const qc         = useQueryClient()
  const companyCen = useAppStore(s => s.selectedCompany?.cen)
  return useMutation({
    mutationFn: (data: CreatePurchaseOrder) =>
      purchasesApi.orders.create(companyCen!, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['purchase-orders', companyCen] })
      toast.success('Orden de compra creada')
    },
  })
}

export const useConfirmOrder = () => {
  const qc         = useQueryClient()
  const companyCen = useAppStore(s => s.selectedCompany?.cen)
  return useMutation({
    mutationFn: (orderCen: string) =>
      purchasesApi.orders.confirm(companyCen!, orderCen),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['purchase-orders', companyCen] })
      qc.invalidateQueries({ queryKey: ['stock'] })
      toast.success('Orden de compra confirmada y stock actualizado')
    },
  })
}
