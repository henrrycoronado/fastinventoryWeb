import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAppStore } from '../../../core/store/useAppStore'
import { salesApi } from '../hooks'
import toast from 'react-hot-toast'
import type { Ticket, TicketItem, TicketTotals } from '../types'

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

export const useTicketTotals = (ticketCen: string | undefined) => {
  const companyCen = useAppStore(s => s.selectedCompany?.companyCen)
  return useQuery<TicketTotals>({
    queryKey: ['ticket-totals', companyCen, ticketCen],
    queryFn:  () => salesApi.tickets.getTotals(companyCen!, ticketCen!),
    enabled:  !!companyCen && !!ticketCen,
  })
}
