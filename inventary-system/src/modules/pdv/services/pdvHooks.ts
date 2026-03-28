import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { useAppStore } from '../../../store/useAppStore'
import { pdvApi } from './pdvApi'
import type {
  PdvMenuCreatePayload,
  PdvMenuItemCreatePayload,
  PdvOrderAddItemPayload,
  PdvOrderCreatePayload,
  PdvStationCategoryCreatePayload,
  PdvStationCreatePayload,
  PdvTableCreatePayload,
  PdvWaiterCreatePayload,
} from './types'

export const usePdvTables = () => {
  const companyId = useAppStore(s => s.selectedCompany?.id)
  return useQuery({
    queryKey: ['pdv-tables', companyId],
    queryFn: () => pdvApi.tables.list(companyId!),
    enabled: !!companyId,
  })
}

export const useCreatePdvTable = () => {
  const qc = useQueryClient()
  const companyId = useAppStore(s => s.selectedCompany?.id)

  return useMutation({
    mutationFn: (data: PdvTableCreatePayload) => pdvApi.tables.create(companyId!, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['pdv-tables', companyId] })
      toast.success('Mesa creada')
    },
  })
}

export const useDeletePdvTable = () => {
  const qc = useQueryClient()
  const companyId = useAppStore(s => s.selectedCompany?.id)

  return useMutation({
    mutationFn: (id: number) => pdvApi.tables.delete(companyId!, id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['pdv-tables', companyId] })
      toast.success('Mesa eliminada')
    },
  })
}

export const usePdvWaiters = () => {
  const companyId = useAppStore(s => s.selectedCompany?.id)
  return useQuery({
    queryKey: ['pdv-waiters', companyId],
    queryFn: () => pdvApi.waiters.list(companyId!),
    enabled: !!companyId,
  })
}

export const useCreatePdvWaiter = () => {
  const qc = useQueryClient()
  const companyId = useAppStore(s => s.selectedCompany?.id)

  return useMutation({
    mutationFn: (data: PdvWaiterCreatePayload) => pdvApi.waiters.create(companyId!, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['pdv-waiters', companyId] })
      toast.success('Mesero creado')
    },
  })
}

export const useDeletePdvWaiter = () => {
  const qc = useQueryClient()
  const companyId = useAppStore(s => s.selectedCompany?.id)

  return useMutation({
    mutationFn: (id: number) => pdvApi.waiters.delete(companyId!, id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['pdv-waiters', companyId] })
      toast.success('Mesero eliminado')
    },
  })
}

export const usePdvMenus = () => {
  const companyId = useAppStore(s => s.selectedCompany?.id)
  return useQuery({
    queryKey: ['pdv-menus', companyId],
    queryFn: () => pdvApi.menus.list(companyId!),
    enabled: !!companyId,
  })
}

export const useCreatePdvMenu = () => {
  const qc = useQueryClient()
  const companyId = useAppStore(s => s.selectedCompany?.id)

  return useMutation({
    mutationFn: (data: PdvMenuCreatePayload) => pdvApi.menus.create(companyId!, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['pdv-menus', companyId] })
      toast.success('Menú creado')
    },
  })
}

export const useDeletePdvMenu = () => {
  const qc = useQueryClient()
  const companyId = useAppStore(s => s.selectedCompany?.id)

  return useMutation({
    mutationFn: (id: number) => pdvApi.menus.delete(companyId!, id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['pdv-menus', companyId] })
      qc.invalidateQueries({ queryKey: ['pdv-menu-items'] })
      toast.success('Menú eliminado')
    },
  })
}

export const usePdvMenuItems = (menuId: number | null) =>
  useQuery({
    queryKey: ['pdv-menu-items', menuId],
    queryFn: () => pdvApi.menuItems.list(menuId!),
    enabled: !!menuId,
  })

export const useCreatePdvMenuItem = () => {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: ({ menuId, data }: { menuId: number; data: PdvMenuItemCreatePayload }) =>
      pdvApi.menuItems.create(menuId, data),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ['pdv-menu-items', vars.menuId] })
      toast.success('Producto agregado al menú')
    },
  })
}

export const useDeletePdvMenuItem = () => {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: ({ menuId, id }: { menuId: number; id: number }) => pdvApi.menuItems.delete(menuId, id),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ['pdv-menu-items', vars.menuId] })
      toast.success('Ítem eliminado del menú')
    },
  })
}

export const usePdvStations = () => {
  const companyId = useAppStore(s => s.selectedCompany?.id)
  return useQuery({
    queryKey: ['pdv-stations', companyId],
    queryFn: () => pdvApi.stations.list(companyId!),
    enabled: !!companyId,
  })
}

export const useCreatePdvStation = () => {
  const qc = useQueryClient()
  const companyId = useAppStore(s => s.selectedCompany?.id)

  return useMutation({
    mutationFn: (data: PdvStationCreatePayload) => pdvApi.stations.create(companyId!, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['pdv-stations', companyId] })
      toast.success('Estación creada')
    },
  })
}

export const useDeletePdvStation = () => {
  const qc = useQueryClient()
  const companyId = useAppStore(s => s.selectedCompany?.id)

  return useMutation({
    mutationFn: (id: number) => pdvApi.stations.delete(companyId!, id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['pdv-stations', companyId] })
      qc.invalidateQueries({ queryKey: ['pdv-station-categories'] })
      toast.success('Estación eliminada')
    },
  })
}

export const usePdvStationCategories = (stationId: number | null) =>
  useQuery({
    queryKey: ['pdv-station-categories', stationId],
    queryFn: () => pdvApi.stationCategories.list(stationId!),
    enabled: !!stationId,
  })

export const useCreatePdvStationCategory = () => {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: ({ stationId, data }: { stationId: number; data: PdvStationCategoryCreatePayload }) =>
      pdvApi.stationCategories.create(stationId, data),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ['pdv-station-categories', vars.stationId] })
      toast.success('Categoría asignada')
    },
  })
}

export const useDeletePdvStationCategory = () => {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: ({ stationId, id }: { stationId: number; id: number }) =>
      pdvApi.stationCategories.delete(stationId, id),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ['pdv-station-categories', vars.stationId] })
      toast.success('Categoría desvinculada')
    },
  })
}

export const usePdvOrders = () => {
  const companyId = useAppStore(s => s.selectedCompany?.id)
  return useQuery({
    queryKey: ['pdv-orders', companyId],
    queryFn: () => pdvApi.orders.list(companyId!),
    enabled: !!companyId,
    refetchInterval: 30_000,
  })
}

export const useCreatePdvOrder = () => {
  const qc = useQueryClient()
  const companyId = useAppStore(s => s.selectedCompany?.id)

  return useMutation({
    mutationFn: (data: PdvOrderCreatePayload) => pdvApi.orders.open(companyId!, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['pdv-orders', companyId] })
      toast.success('Orden abierta')
    },
  })
}

export const useDeletePdvOrder = () => {
  const qc = useQueryClient()
  const companyId = useAppStore(s => s.selectedCompany?.id)

  return useMutation({
    mutationFn: (id: number) => pdvApi.orders.delete(companyId!, id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['pdv-orders', companyId] })
      toast.success('Orden eliminada')
    },
  })
}

export const useAddPdvOrderItem = () => {
  const qc = useQueryClient()
  const companyId = useAppStore(s => s.selectedCompany?.id)
  const warehouseId = useAppStore(s => s.selectedWarehouse?.id)

  return useMutation({
    mutationFn: ({ orderId, data }: { orderId: number; data: PdvOrderAddItemPayload }) =>
      pdvApi.orders.addItem(companyId!, orderId, warehouseId!, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['pdv-orders', companyId] })
      toast.success('Ítem agregado a la orden')
    },
  })
}

export const useCheckoutPdvOrder = () => {
  const qc = useQueryClient()
  const companyId = useAppStore(s => s.selectedCompany?.id)
  const warehouseId = useAppStore(s => s.selectedWarehouse?.id)

  return useMutation({
    mutationFn: (orderId: number) => pdvApi.orders.checkout(companyId!, orderId, warehouseId!),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['pdv-orders', companyId] })
      qc.invalidateQueries({ queryKey: ['sales', companyId] })
      qc.invalidateQueries({ queryKey: ['stock'] })
      qc.invalidateQueries({ queryKey: ['movements'] })
      qc.invalidateQueries({ queryKey: ['kardex'] })
      toast.success('Orden cobrada y convertida en venta')
    },
  })
}
