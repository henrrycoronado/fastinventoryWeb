import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAppStore } from '../../../store/useAppStore'
import { inventoryApi } from './inventoryApi'
import toast from 'react-hot-toast'

export const useCompanyProducts = () => {
  const companyId = useAppStore(s => s.selectedCompany?.id)
  return useQuery({
    queryKey: ['company-products', companyId],
    queryFn:  () => inventoryApi.products.list(companyId!),
    enabled:  !!companyId,
  })
}

export const useGlobalProducts = () => {
  const companyId = useAppStore(s => s.selectedCompany?.id)
  return useQuery({
    queryKey: ['global-products', companyId],
    queryFn:  () => inventoryApi.products.listGlobal(companyId!),
    enabled:  !!companyId,
  })
}

export const useCreateCompanyProduct = () => {
  const qc        = useQueryClient()
  const companyId = useAppStore(s => s.selectedCompany?.id)
  return useMutation({
    mutationFn: (data: { globalProductId: number; localNameAlias?: string; wholesalePrice?: number }) =>
      inventoryApi.products.create(companyId!, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['company-products', companyId] })
      qc.invalidateQueries({ queryKey: ['global-products', companyId] })
      toast.success('Producto agregado al catálogo')
    },
  })
}

export const useDeleteCompanyProduct = () => {
  const qc        = useQueryClient()
  const companyId = useAppStore(s => s.selectedCompany?.id)
  return useMutation({
    mutationFn: (id: number) => inventoryApi.products.delete(companyId!, id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['company-products', companyId] })
      toast.success('Producto eliminado')
    },
  })
}

export const useCreateGlobalProduct = () => {
  const qc        = useQueryClient()
  const companyId = useAppStore(s => s.selectedCompany?.id)
  return useMutation({
    mutationFn: (data: { categoryId?: number; name: string; brand?: string; upcBarcode?: string }) =>
      inventoryApi.products.createGlobal(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['global-products', companyId] })
      toast.success('Producto global creado')
    },
  })
}

export const useSkus = (companyProductId: number | undefined) =>
  useQuery({
    queryKey: ['skus', companyProductId],
    queryFn:  () => inventoryApi.skus.list(companyProductId!),
    enabled:  !!companyProductId,
  })

export const useCreateSku = (companyProductId: number) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: { internalSku?: string; retailPrice?: number }) =>
      inventoryApi.skus.create(companyProductId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['skus', companyProductId] })
      qc.invalidateQueries({ queryKey: ['company-products'] })
      toast.success('SKU creado')
    },
  })
}

export const useDeleteSku = (companyProductId: number) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => inventoryApi.skus.delete(companyProductId, id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['skus', companyProductId] })
      toast.success('SKU eliminado')
    },
  })
}

export const useAttributes = () => {
  const companyId = useAppStore(s => s.selectedCompany?.id)
  return useQuery({
    queryKey: ['attributes', companyId],
    queryFn:  () => inventoryApi.attributes.listByCompany(companyId!),
    enabled:  !!companyId,
  })
}

export const useSkuAttributes = (skuId: number | undefined) =>
  useQuery({
    queryKey: ['sku-attributes', skuId],
    queryFn:  () => inventoryApi.attributes.listBySku(skuId!),
    enabled:  !!skuId,
  })

export const useGlobalCategories = () =>
  useQuery({
    queryKey: ['global-categories'],
    queryFn:  () => inventoryApi.categories.listGlobal(),
    staleTime: Infinity,
  })

export const useCreateGlobalCategory = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: { name: string }) => inventoryApi.categories.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['global-categories'] })
      toast.success('Categoría creada')
    },
  })
}

export const useStock = () => {
  const warehouseId = useAppStore(s => s.selectedWarehouse?.id)
  return useQuery({
    queryKey: ['stock', warehouseId],
    queryFn:  () => inventoryApi.stock.list(warehouseId!),
    enabled:  !!warehouseId,
    refetchInterval: 30_000,
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

export const useCreateMovement = () => {
  const qc        = useQueryClient()
  const companyId = useAppStore(s => s.selectedCompany?.id)
  return useMutation({
    mutationFn: ({ type, data }: { type: 'incoming' | 'outgoing'; data: any }) =>
      type === 'incoming'
        ? inventoryApi.movements.incoming(companyId!, data)
        : inventoryApi.movements.outgoing(companyId!, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['movements', companyId] })
      qc.invalidateQueries({ queryKey: ['stock'] })
      toast.success('Movimiento registrado')
    },
  })
}

export const useDeleteMovement = () => {
  const qc        = useQueryClient()
  const companyId = useAppStore(s => s.selectedCompany?.id)
  return useMutation({
    mutationFn: (id: number) => inventoryApi.movements.delete(companyId!, id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['movements', companyId] })
      qc.invalidateQueries({ queryKey: ['stock'] })
      toast.success('Movimiento eliminado')
    },
  })
}

export const useKardex = (skuId: number | undefined) => {
  const warehouseId = useAppStore(s => s.selectedWarehouse?.id)
  return useQuery({
    queryKey: ['kardex', warehouseId, skuId],
    queryFn:  () => inventoryApi.kardex.get(warehouseId!, skuId!),
    enabled:  !!warehouseId && !!skuId,
  })
}

export const useWarehouses = () => {
  const companyId = useAppStore(s => s.selectedCompany?.id)
  return useQuery({
    queryKey: ['warehouses', companyId],
    queryFn:  () => inventoryApi.warehouses.list(companyId!),
    enabled:  !!companyId,
  })
}

export const useMovementTypes = () =>
  useQuery({
    queryKey: ['movement-types'],
    queryFn:  () => inventoryApi.catalogs.movementTypes(),
    staleTime: Infinity,
  })

export const useBatches = (skuId: number | undefined) =>
  useQuery({
    queryKey: ['batches', skuId],
    queryFn:  () => inventoryApi.batches.list(skuId!),
    enabled:  !!skuId,
  })