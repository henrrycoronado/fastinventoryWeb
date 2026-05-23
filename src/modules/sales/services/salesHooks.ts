import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAppStore } from '../../../store/useAppStore'
import { salesApi } from './salesApi'
import toast from 'react-hot-toast'

export const useSellableProducts = (params?: any) => {
  const companyCen = useAppStore(s => s.selectedCompany?.companyCen)
  const warehouseCen = useAppStore(s => s.selectedWarehouse?.warehouseCen)
  return useQuery({
    queryKey: ['sellable-products', companyCen, warehouseCen, params],
    queryFn:  () => salesApi.catalog.listProducts(companyCen!, { warehouseCen, ...params }),
    enabled:  !!companyCen && !!warehouseCen,
  })
}

export const useDailySales = () => {
  const companyCen = useAppStore(s => s.selectedCompany?.companyCen)
  const warehouseCen = useAppStore(s => s.selectedWarehouse?.warehouseCen)
  return useQuery({
    queryKey: ['daily-sales', companyCen, warehouseCen],
    queryFn:  () => salesApi.dashboard.dailySales(companyCen!, warehouseCen!),
    enabled:  !!companyCen && !!warehouseCen,
  })
}

export const useKdsStatus = () => {
  const companyCen = useAppStore(s => s.selectedCompany?.companyCen)
  const warehouseCen = useAppStore(s => s.selectedWarehouse?.warehouseCen)
  return useQuery({
    queryKey: ['kds-status', companyCen, warehouseCen],
    queryFn:  () => salesApi.dashboard.kdsStatus(companyCen!, warehouseCen!),
    enabled:  !!companyCen && !!warehouseCen,
  })
}

export const useWaiters = () => {
  const companyCen = useAppStore(s => s.selectedCompany?.companyCen)
  const warehouseCen = useAppStore(s => s.selectedWarehouse?.warehouseCen)
  return useQuery({
    queryKey: ['waiters', companyCen, warehouseCen],
    queryFn:  () => salesApi.waiters.list(companyCen!, warehouseCen!),
    enabled:  !!companyCen && !!warehouseCen,
  })
}

export const useCreateWaiter = () => {
  const qc         = useQueryClient()
  const companyCen = useAppStore(s => s.selectedCompany?.companyCen)
  const warehouseCen = useAppStore(s => s.selectedWarehouse?.warehouseCen)
  return useMutation({
    mutationFn: (data: { name: string }) =>
      salesApi.waiters.create(companyCen!, { ...data, warehouseCen: warehouseCen! }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['waiters', companyCen, warehouseCen] })
      toast.success('Mesero registrado')
    },
  })
}

export const useTickets = () => {
  const companyCen = useAppStore(s => s.selectedCompany?.companyCen)
  const warehouseCen = useAppStore(s => s.selectedWarehouse?.warehouseCen)
  return useQuery({
    queryKey: ['tickets', companyCen, warehouseCen],
    queryFn:  () => salesApi.tickets.list(companyCen!, warehouseCen!),
    enabled:  !!companyCen && !!warehouseCen,
  })
}

export const useCreateTicket = () => {
  const qc         = useQueryClient()
  const companyCen = useAppStore(s => s.selectedCompany?.companyCen)
  const warehouseCen = useAppStore(s => s.selectedWarehouse?.warehouseCen)
  return useMutation({
    mutationFn: (data: { waiterCen?: string }) =>
      salesApi.tickets.create(companyCen!, { warehouseCen: warehouseCen!, ...data }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tickets', companyCen, warehouseCen] })
      toast.success('Ticket abierto')
    },
  })
}

export const useTicketItems = (ticketCen: string | undefined) => {
  const companyCen = useAppStore(s => s.selectedCompany?.companyCen)
  return useQuery({
    queryKey: ['ticket-items', companyCen, ticketCen],
    queryFn:  () => salesApi.tickets.listItems(companyCen!, ticketCen!),
    enabled:  !!companyCen && !!ticketCen,
  })
}

export const useAddTicketItem = () => {
  const qc         = useQueryClient()
  const companyCen = useAppStore(s => s.selectedCompany?.companyCen)
  return useMutation({
    mutationFn: ({ ticketCen, data }: { ticketCen: string; data: any }) =>
      salesApi.tickets.addItem(companyCen!, ticketCen, data),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ['ticket-items', companyCen, vars.ticketCen] })
      toast.success('Ítem agregado')
    },
  })
}

export const usePayTicket = () => {
  const qc         = useQueryClient()
  const companyCen = useAppStore(s => s.selectedCompany?.companyCen)
  const warehouseCen = useAppStore(s => s.selectedWarehouse?.warehouseCen)
  return useMutation({
    mutationFn: ({ ticketCen, data }: { ticketCen: string; data: { paymentMethodCode: string } }) =>
      salesApi.tickets.pay(companyCen!, ticketCen, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tickets', companyCen, warehouseCen] })
      qc.invalidateQueries({ queryKey: ['stock'] })
      toast.success('Pago procesado')
    },
  })
}

export const useKdsTeams = () => {
  const companyCen = useAppStore(s => s.selectedCompany?.companyCen)
  const warehouseCen = useAppStore(s => s.selectedWarehouse?.warehouseCen)
  return useQuery({
    queryKey: ['kds-teams', companyCen, warehouseCen],
    queryFn:  () => salesApi.kds.listTeams(companyCen!, warehouseCen!),
    enabled:  !!companyCen && !!warehouseCen,
  })
}

export const usePaymentMethods = () =>
  useQuery({
    queryKey: ['payment-methods'],
    queryFn:  () => salesApi.paymentMethods.list(),
  })
