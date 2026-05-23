import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { UseQueryOptions } from '@tanstack/react-query'
import { useAppStore } from '../../../store/useAppStore'
import { salesApi } from './salesApi'
import toast from 'react-hot-toast'
import type { 
  SellableProduct, 
  DailySalesDashboard, 
  KdsStatusDashboard, 
  Waiter, 
  Ticket, 
  TicketItem, 
  KdsTeam, 
  PaymentMethod, 
  TicketTotals 
} from './types'

export const useSellableProducts = (
  params?: any, 
  options?: Partial<UseQueryOptions<SellableProduct[]>>
) => {
  const companyCen = useAppStore(s => s.selectedCompany?.companyCen)
  return useQuery<SellableProduct[]>({
    queryKey: ['sellable-products', companyCen, params],
    queryFn:  () => salesApi.catalog.listProducts(companyCen!, params),
    enabled:  !!companyCen,
    ...options as any
  })
}


export const useDailySales = (params?: { warehouseCen?: string }) => {
  const companyCen = useAppStore(s => s.selectedCompany?.companyCen)
  return useQuery<DailySalesDashboard>({
    queryKey: ['daily-sales', companyCen, params],
    queryFn:  () => salesApi.dashboard.dailySales(companyCen!, params),
    enabled:  !!companyCen,
  })
}

export const useKdsStatus = (params?: { warehouseCen?: string }) => {
  const companyCen = useAppStore(s => s.selectedCompany?.companyCen)
  return useQuery<KdsStatusDashboard>({
    queryKey: ['kds-status', companyCen, params],
    queryFn:  () => salesApi.dashboard.kdsStatus(companyCen!, params),
    enabled:  !!companyCen,
  })
}

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

export const useTickets = (params?: { warehouseCen?: string }) => {
  const companyCen = useAppStore(s => s.selectedCompany?.companyCen)
  return useQuery<Ticket[]>({
    queryKey: ['tickets', companyCen, params],
    queryFn:  () => salesApi.tickets.list(companyCen!, params),
    enabled:  !!companyCen,
  })
}

export const useCreateTicket = () => {
  const qc         = useQueryClient()
  const companyCen = useAppStore(s => s.selectedCompany?.companyCen)
  return useMutation({
    mutationFn: (data: { waiterCen?: string; warehouseCen?: string }) =>
      salesApi.tickets.create(companyCen!, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tickets', companyCen] })
      toast.success('Ticket abierto')
    },
  })
}


export const useTicketItems = (ticketCen: string | undefined) => {
  const companyCen = useAppStore(s => s.selectedCompany?.companyCen)
  return useQuery<TicketItem[]>({
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

export const useSendTicket = () => {
  const qc         = useQueryClient()
  const companyCen = useAppStore(s => s.selectedCompany?.companyCen)
  return useMutation({
    mutationFn: (ticketCen: string) =>
      salesApi.tickets.sendTicket(companyCen!, ticketCen),
    onSuccess: (_, ticketCen) => {
      qc.invalidateQueries({ queryKey: ['tickets', companyCen] })
      qc.invalidateQueries({ queryKey: ['ticket-items', companyCen, ticketCen] })
      qc.invalidateQueries({ queryKey: ['ticket-totals', companyCen, ticketCen] })
      qc.invalidateQueries({ queryKey: ['kds-items'] })
      qc.invalidateQueries({ queryKey: ['kds-status'] })
      toast.success('Ticket enviado a cocina / caja')
    },
  })
}

export const usePayTicket = () => {
  const qc         = useQueryClient()
  const companyCen = useAppStore(s => s.selectedCompany?.companyCen)
  return useMutation({
    mutationFn: ({ ticketCen, data }: { ticketCen: string; data: { paymentMethodCode: string } }) =>
      salesApi.tickets.pay(companyCen!, ticketCen, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tickets', companyCen] })
      qc.invalidateQueries({ queryKey: ['ticket-items', companyCen] })
      qc.invalidateQueries({ queryKey: ['ticket-totals', companyCen] })
      qc.invalidateQueries({ queryKey: ['stock'] })
      toast.success('Pago procesado')
    },
  })
}

export const useKdsTeams = (params?: { warehouseCen?: string }) => {
  const companyCen = useAppStore(s => s.selectedCompany?.companyCen)
  return useQuery<KdsTeam[]>({
    queryKey: ['kds-teams', companyCen, params],
    queryFn:  () => salesApi.kds.listTeams(companyCen!, params),
    enabled:  !!companyCen,
  })
}


export const usePaymentMethods = () =>
  useQuery<PaymentMethod[]>({
    queryKey: ['payment-methods'],
    queryFn:  () => salesApi.paymentMethods.list(),
  })

export const useTicketTotals = (ticketCen: string | undefined) => {
  const companyCen = useAppStore(s => s.selectedCompany?.companyCen)
  return useQuery<TicketTotals>({
    queryKey: ['ticket-totals', companyCen, ticketCen],
    queryFn:  () => salesApi.tickets.getTotals(companyCen!, ticketCen!),
    enabled:  !!companyCen && !!ticketCen,
  })
}

