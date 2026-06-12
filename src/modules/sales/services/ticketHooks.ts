import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAppStore } from '../../../core/store/useAppStore'
import { salesApi } from '../hooks'
import toast from 'react-hot-toast'
import type {
  Ticket,
  TicketItem,
  TicketTotals,
  PayTicketRequest,
  CancelTicketRequest,
  AssignTicketWaiterRequest
} from '../types'

export const useTickets = () => {
  const companyCen = useAppStore(s => s.selectedCompany?.companyCen)
  return useQuery<Ticket[]>({
    queryKey: ['tickets', companyCen],
    queryFn:  () => salesApi.tickets.list(companyCen!),
    enabled:  !!companyCen,
  })
}

export const useCreateTicket = () => {
  const qc         = useQueryClient()
  const companyCen = useAppStore(s => s.selectedCompany?.companyCen)
  return useMutation({
    mutationFn: (data: { waiterCen?: string }) =>
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
      qc.invalidateQueries({ queryKey: ['ticket-totals', companyCen, vars.ticketCen] })
      toast.success('Ítem agregado')
    },
  })
}

export const useUpdateTicketItem = () => {
  const qc         = useQueryClient()
  const companyCen = useAppStore(s => s.selectedCompany?.companyCen)
  return useMutation({
    mutationFn: ({ ticketCen, ticketItemCen, data }: { ticketCen: string; ticketItemCen: string; data: any }) =>
      salesApi.tickets.patchItem(companyCen!, ticketCen, ticketItemCen, data),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ['ticket-items', companyCen, vars.ticketCen] })
      qc.invalidateQueries({ queryKey: ['ticket-totals', companyCen, vars.ticketCen] })
      toast.success('Ítem actualizado')
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
      qc.invalidateQueries({ queryKey: ['kds-items'] })
      qc.invalidateQueries({ queryKey: ['kds-status', companyCen] })
      toast.success('Enviado a cocina')
    },
  })
}

export const useResendItem = () => {
  const qc         = useQueryClient()
  const companyCen = useAppStore(s => s.selectedCompany?.companyCen)
  return useMutation({
    mutationFn: ({ ticketCen, ticketItemCen }: { ticketCen: string; ticketItemCen: string }) =>
      salesApi.tickets.resendItem(companyCen!, ticketCen, ticketItemCen),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ['ticket-items', companyCen, vars.ticketCen] })
      qc.invalidateQueries({ queryKey: ['kds-items'] })
      toast.success('Ítem reenviado')
    },
  })
}

export const useAssignWaiter = () => {
  const qc         = useQueryClient()
  const companyCen = useAppStore(s => s.selectedCompany?.companyCen)
  return useMutation({
    mutationFn: ({ ticketCen, data }: { ticketCen: string; data: AssignTicketWaiterRequest }) =>
      salesApi.tickets.assignWaiter(companyCen!, ticketCen, data),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ['tickets', companyCen] })
      qc.invalidateQueries({ queryKey: ['ticket-items', companyCen, vars.ticketCen] })
      toast.success('Mesero asignado')
    },
  })
}

export const useCancelTicket = () => {
  const qc         = useQueryClient()
  const companyCen = useAppStore(s => s.selectedCompany?.companyCen)
  return useMutation({
    mutationFn: ({ ticketCen, data }: { ticketCen: string; data: CancelTicketRequest }) =>
      salesApi.tickets.cancel(companyCen!, ticketCen, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tickets', companyCen] })
      toast.success('Ticket cancelado')
    },
  })
}

export const usePayTicket = () => {
  const qc         = useQueryClient()
  const companyCen = useAppStore(s => s.selectedCompany?.companyCen)
  return useMutation({
    mutationFn: ({ ticketCen, data }: { ticketCen: string; data: PayTicketRequest }) =>
      salesApi.tickets.pay(companyCen!, ticketCen, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tickets', companyCen] })
      qc.invalidateQueries({ queryKey: ['daily-sales', companyCen] })
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

export const usePrintTicket = () => {
  const companyCen = useAppStore(s => s.selectedCompany?.companyCen)
  return useMutation({
    mutationFn: (ticketCen: string) =>
      salesApi.tickets.print(companyCen!, ticketCen),
    onSuccess: (blob, ticketCen) => {
      const url = window.URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `ticket_${ticketCen}.pdf`)
      document.body.appendChild(link)
      link.click()
      link.remove()
    },
  })
}