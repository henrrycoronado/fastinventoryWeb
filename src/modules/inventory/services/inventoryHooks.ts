import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAppStore } from '../../../store/useAppStore'
import { inventoryApi } from './inventoryApi'
import toast from 'react-hot-toast'

export const useInventoryDashboard = () => {
  const companyCen = useAppStore(s => s.selectedCompany?.companyCen)
  return useQuery({
    queryKey: ['inventory-dashboard', companyCen],
    queryFn:  () => inventoryApi.dashboard.get(companyCen!),
    enabled:  !!companyCen,
  })
}

export const useCategories = () => {
  const companyCen = useAppStore(s => s.selectedCompany?.companyCen)
  return useQuery({
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

export const useProducts = (params?: { search?: string; categoryCen?: string; status?: string }) => {
  const companyCen = useAppStore(s => s.selectedCompany?.companyCen)
  return useQuery({
    queryKey: ['products', companyCen, params],
    queryFn:  () => inventoryApi.products.list(companyCen!, params),
    enabled:  !!companyCen,
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

export const useStock = (params?: { productCen?: string; warehouseCen?: string }) => {
  const companyCen = useAppStore(s => s.selectedCompany?.companyCen)
  const warehouseCen = useAppStore(s => s.selectedWarehouse?.warehouseCen)
  return useQuery({
    queryKey: ['stock', companyCen, warehouseCen, params],
    queryFn:  () => inventoryApi.stock.list(companyCen!, { warehouseCen, ...params }),
    enabled:  !!companyCen && !!warehouseCen,
  })
}

export const useInventoryDocuments = (params?: { documentType?: string; from?: string; to?: string }) => {
  const companyCen = useAppStore(s => s.selectedCompany?.companyCen)
  return useQuery({
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

export const useKardex = (productCen: string | undefined, params?: { warehouseCen?: string; from?: string; to?: string }) => {
  const companyCen = useAppStore(s => s.selectedCompany?.companyCen)
  const selectedWarehouseCen = useAppStore(s => s.selectedWarehouse?.warehouseCen)
  
  return useQuery({
    queryKey: ['kardex', companyCen, productCen, selectedWarehouseCen, params],
    queryFn:  () => inventoryApi.kardex.get(companyCen!, productCen!, { warehouseCen: selectedWarehouseCen, ...params }),
    enabled:  !!companyCen && !!productCen && !!selectedWarehouseCen,
  })
}

export const useUnits = () => {
  const companyCen = useAppStore(s => s.selectedCompany?.companyCen)
  return useQuery({
    queryKey: ['units', companyCen],
    queryFn:  () => inventoryApi.units.list(companyCen!),
    enabled:  !!companyCen,
  })
}

export const useWarehouses = () => {
  const companyCen = useAppStore(s => s.selectedCompany?.companyCen)
  return useQuery({
    queryKey: ['warehouses', companyCen],
    queryFn:  () => inventoryApi.warehouses.list(companyCen!),
    enabled:  !!companyCen,
  })
}
