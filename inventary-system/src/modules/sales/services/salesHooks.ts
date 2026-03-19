import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAppStore } from '../../../store/useAppStore'
import { salesApi } from './salesApi'
import toast from 'react-hot-toast'

export const useCustomers = () => {
  const companyId = useAppStore(s => s.selectedCompany?.id)
  return useQuery({
    queryKey: ['customers', companyId],
    queryFn:  () => salesApi.customers.list(companyId!),
    enabled:  !!companyId,
  })
}

export const useCreateCustomer = () => {
  const qc        = useQueryClient()
  const companyId = useAppStore(s => s.selectedCompany?.id)
  return useMutation({
    mutationFn: (data: { name: string; phone?: string; email?: string }) =>
      salesApi.customers.create(companyId!, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['customers', companyId] })
      toast.success('Cliente creado')
    },
  })
}

export const useDeleteCustomer = () => {
  const qc        = useQueryClient()
  const companyId = useAppStore(s => s.selectedCompany?.id)
  return useMutation({
    mutationFn: (id: number) => salesApi.customers.delete(companyId!, id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['customers', companyId] })
      toast.success('Cliente eliminado')
    },
  })
}

export const useSellers = () => {
  const companyId = useAppStore(s => s.selectedCompany?.id)
  return useQuery({
    queryKey: ['sellers', companyId],
    queryFn:  () => salesApi.sellers.list(companyId!),
    enabled:  !!companyId,
  })
}

export const useCreateSeller = () => {
  const qc        = useQueryClient()
  const companyId = useAppStore(s => s.selectedCompany?.id)
  return useMutation({
    mutationFn: (data: { name: string; phone?: string }) =>
      salesApi.sellers.create(companyId!, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['sellers', companyId] })
      toast.success('Vendedor creado')
    },
  })
}

export const useDeleteSeller = () => {
  const qc        = useQueryClient()
  const companyId = useAppStore(s => s.selectedCompany?.id)
  return useMutation({
    mutationFn: (id: number) => salesApi.sellers.delete(companyId!, id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['sellers', companyId] })
      toast.success('Vendedor eliminado')
    },
  })
}

export const useSales = () => {
  const companyId = useAppStore(s => s.selectedCompany?.id)
  return useQuery({
    queryKey: ['sales', companyId],
    queryFn:  () => salesApi.sales.list(companyId!),
    enabled:  !!companyId,
  })
}

export const useCreateSale = () => {
  const qc        = useQueryClient()
  const companyId = useAppStore(s => s.selectedCompany?.id)
  return useMutation({
    mutationFn: (data: any) => salesApi.sales.create(companyId!, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['sales', companyId] })
      toast.success('Venta creada')
    },
  })
}

export const useConfirmSale = () => {
  const qc = useQueryClient()
  const companyId = useAppStore(s => s.selectedCompany?.id)
  return useMutation({
    mutationFn: (id: number) => salesApi.sales.confirm(companyId!, id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['sales', companyId] })
      qc.invalidateQueries({ queryKey: ['stock'] })
      qc.invalidateQueries({ queryKey: ['movements'] })
      qc.invalidateQueries({ queryKey: ['kardex'] })
      
      toast.success('Venta confirmada — stock descontado')
    },
  })
}

export const useCancelSale = () => {
  const qc        = useQueryClient()
  const companyId = useAppStore(s => s.selectedCompany?.id)
  return useMutation({
    mutationFn: (id: number) => salesApi.sales.cancel(companyId!, id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['sales', companyId] })
      toast.success('Venta anulada')
    },
  })
}

export const useDeleteSale = () => {
  const qc        = useQueryClient()
  const companyId = useAppStore(s => s.selectedCompany?.id)
  return useMutation({
    mutationFn: (id: number) => salesApi.sales.delete(companyId!, id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['sales', companyId] })
      toast.success('Venta eliminada')
    },
  })
}

export const useReceipt = (saleId: number | undefined) =>
  useQuery({
    queryKey: ['receipt', saleId],
    queryFn:  () => salesApi.receipts.get(saleId!),
    enabled:  !!saleId,
    retry:    false,
  })

export const useCreateReceipt = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (saleId: number) => salesApi.receipts.create(saleId),
    onSuccess: (_, saleId) => {
      qc.invalidateQueries({ queryKey: ['receipt', saleId] })
      toast.success('Recibo generado')
    },
  })
}

export const useSaleStatuses = () =>
  useQuery({
    queryKey: ['sale-statuses'],
    queryFn:  () => salesApi.catalogs.saleStatuses(),
    staleTime: Infinity,
  })

export const useCategoriesInUse = () => {
  const companyId = useAppStore(s => s.selectedCompany?.id)
  return useQuery({
    queryKey: ['categories-in-use', companyId],
    queryFn:  () => salesApi.catalogs.categoriesInUse(companyId!),
    enabled:  !!companyId,
  })
}
