import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { UseQueryOptions } from '@tanstack/react-query'
import { useAppStore } from '../../../store/useAppStore'
import { inventoryApi } from './inventoryApi'
import toast from 'react-hot-toast'
import type { 
  Category, 
  Product, 
  StockItem, 
  InventoryDocument, 
  KardexMovement, 
  Unit, 
  Warehouse, 
  InventoryDashboard 
} from './types'

export const useInventoryDashboard = () => {
  const companyCen = useAppStore(s => s.selectedCompany?.companyCen)
  return useQuery<InventoryDashboard>({
    queryKey: ['inventory-dashboard', companyCen],
    queryFn:  () => inventoryApi.dashboard.get(companyCen!),
    enabled:  !!companyCen,
  })
}

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

export const useStock = (params?: { productCen?: string; warehouseCen?: string }) => {
  const companyCen = useAppStore(s => s.selectedCompany?.companyCen)
  const warehouseCen = useAppStore(s => s.selectedWarehouse?.warehouseCen)
  return useQuery<StockItem[]>({
    queryKey: ['stock', companyCen, warehouseCen, params],
    queryFn:  () => inventoryApi.stock.list(companyCen!, { warehouseCen, ...params }),
    enabled:  !!companyCen,
  })
}


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

export const useKardex = (productCen: string | undefined, params?: { warehouseCen?: string; from?: string; to?: string }) => {
  const companyCen = useAppStore(s => s.selectedCompany?.companyCen)
  const selectedWarehouseCen = useAppStore(s => s.selectedWarehouse?.warehouseCen)
  
  return useQuery<KardexMovement[]>({
    queryKey: ['kardex', companyCen, productCen, selectedWarehouseCen, params],
    queryFn:  () => inventoryApi.kardex.get(companyCen!, productCen!, { warehouseCen: selectedWarehouseCen, ...params }),
    enabled:  !!companyCen && !!productCen,
  })
}


export const useUnits = () => {
  const companyCen = useAppStore(s => s.selectedCompany?.companyCen)
  return useQuery<Unit[]>({
    queryKey: ['units', companyCen],
    queryFn:  () => inventoryApi.units.list(companyCen!),
    enabled:  !!companyCen,
  })
}

export const useWarehouses = () => {
  const companyCen = useAppStore(s => s.selectedCompany?.companyCen)
  return useQuery<Warehouse[]>({
    queryKey: ['warehouses', companyCen],
    queryFn:  () => inventoryApi.warehouses.list(companyCen!),
    enabled:  !!companyCen,
  })
}
