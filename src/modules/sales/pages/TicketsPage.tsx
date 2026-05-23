import { useState, useMemo } from 'react'
import { Search, ShoppingCart, ChevronRight, CheckCircle2 } from 'lucide-react'
import { useTickets, useTicketItems, usePayTicket, usePaymentMethods, useWaiters, useTicketTotals } from '../services/salesHooks'
import { useAppStore } from '../../../store/useAppStore'
import { formatDate, formatCurrency } from '../../../lib/utils'
import type { Ticket, TicketItem, Waiter } from '../services/types'
import SectionHeader from '../../../components/SectionHeader'
import Badge from '../../../atoms/Badge'
import Modal from '../../../atoms/Modal'
import Button from '../../../atoms/Button'

export default function TicketsPage() {
  const { selectedWarehouse } = useAppStore()
  const { data: tickets = [], isLoading } = useTickets()
  const { data: paymentMethods = [] } = usePaymentMethods()
  const { data: waiters = [] } = useWaiters()
  const payTicket = usePayTicket()

  const [search, setSearch] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  
  const [payModalOpen, setPayModalOpen] = useState(false)
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  const [paymentMethodCode, setPaymentMethodCode] = useState('')

  const { data: ticketTotals } = useTicketTotals(selectedTicket?.ticketCen)

  const filtered = useMemo(() => {
    return tickets.filter(t => 
      t.ticketCen.toLowerCase().includes(search.toLowerCase()) || 
      (t.waiterCen && t.waiterCen.toLowerCase().includes(search.toLowerCase()))
    ).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }, [tickets, search])

  const getWaiterName = (cen?: string | null) => waiters.find((w: Waiter) => w.waiterCen === cen)?.name || '—'


  const handlePay = async () => {
    if (!selectedTicket || !paymentMethodCode) return
    await payTicket.mutateAsync({
      ticketCen: selectedTicket.ticketCen,
      data: { paymentMethodCode }
    })
    setPayModalOpen(false)
    setSelectedTicket(null)
  }

  return (
    <div className="animate-fade-in">
      <SectionHeader 
        title="Tickets" 
        subtitle={selectedWarehouse?.name}
      />

      <div className="px-6 py-4 border-b border-surface-3">
        <div className="relative w-full max-w-md">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
          <input className="input pl-8 text-xs" placeholder="Buscar por ticket o mesero..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="mx-6 mt-4 card overflow-hidden mb-8">
        <div className="hidden md:grid grid-cols-6 px-6 py-3 border-b border-surface-4">
          <span className="col-span-1 text-xs font-semibold uppercase tracking-wider text-ink-muted">Ticket</span>
          <span className="col-span-1 text-xs font-semibold uppercase tracking-wider text-ink-muted">Fecha</span>
          <span className="col-span-1 text-xs font-semibold uppercase tracking-wider text-ink-muted">Mesero</span>
          <span className="col-span-1 text-xs font-semibold uppercase tracking-wider text-ink-muted">Total</span>
          <span className="col-span-1 text-xs font-semibold uppercase tracking-wider text-ink-muted">Estado</span>
          <span className="col-span-1" />
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16 text-sm text-ink-muted">Cargando tickets…</div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-2">
            <ShoppingCart size={28} className="text-ink-muted" />
            <p className="text-sm text-ink-muted">No se encontraron tickets</p>
          </div>
        ) : (
          <div className="divide-y divide-surface-3">
            {filtered.map((ticket: Ticket) => {
              const isExpanded = expandedId === ticket.ticketCen
              return (
                <div key={ticket.ticketCen}>
                  <div 
                    className="grid grid-cols-1 md:grid-cols-6 items-center gap-4 px-6 py-4 hover:bg-surface-2/50 transition-colors cursor-pointer" 
                    onClick={() => setExpandedId(isExpanded ? null : ticket.ticketCen)}
                  >
                    <span className="text-sm font-medium text-ink-primary font-mono">{ticket.ticketCen}</span>
                    <span className="text-xs text-ink-secondary">{formatDate(ticket.createdAt)}</span>
                    <span className="text-sm text-ink-secondary truncate">{getWaiterName(ticket.waiterCen)}</span>
                    <span className="text-sm font-mono font-bold text-accent">—</span>
                    <div>
                      <Badge variant={ticket.status === 'PAID' ? 'green' : ticket.status === 'OPEN' ? 'yellow' : 'gray'}>
                        {ticket.status}
                      </Badge>
                    </div>

                    <div className="flex justify-end gap-2">
                      {ticket.status === 'OPEN' && (
                        <Button 
                          variant="ghost" 
                          className="!px-2 !py-1 text-accent"
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedTicket(ticket)
                            setPayModalOpen(true)
                          }}
                        >
                          <CheckCircle2 size={16} /> Cobrar
                        </Button>
                      )}
                      <ChevronRight size={15} className={`text-ink-muted transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`} />
                    </div>
                  </div>
                  
                  {isExpanded && <TicketDetailView ticketCen={ticket.ticketCen} />}
                </div>
              )
            })}
          </div>
        )}
      </div>

      <Modal open={payModalOpen} onClose={() => setPayModalOpen(false)} title="Procesar Pago" size="sm">
        <div className="space-y-4">
          <div>
            <p className="text-sm text-ink-secondary mb-2">Ticket: <span className="font-mono font-bold">{selectedTicket?.ticketCen}</span></p>
            <p className="text-lg font-bold text-ink-primary mb-4">Total a pagar: {formatCurrency(ticketTotals?.total || 0)}</p>
          </div>

          <div>
            <label className="label">Método de Pago</label>
            <select className="input text-sm" value={paymentMethodCode} onChange={e => setPaymentMethodCode(e.target.value)}>
              <option value="">Seleccionar...</option>
              {paymentMethods.map(m => <option key={m.paymentMethodCode} value={m.paymentMethodCode}>{m.name}</option>)}
            </select>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button onClick={() => setPayModalOpen(false)}>Cancelar</Button>
            <Button variant="primary" onClick={handlePay} disabled={!paymentMethodCode || payTicket.isPending} loading={payTicket.isPending}>
              Confirmar Pago
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

function TicketDetailView({ ticketCen }: { ticketCen: string }) {
  const { data: items = [], isLoading } = useTicketItems(ticketCen)

  if (isLoading) return <div className="p-4 text-center text-xs text-ink-muted">Cargando detalles...</div>

  return (
    <div className="px-6 py-4 bg-surface-1/60 border-t border-surface-3 animate-slide-up space-y-3">
      <p className="text-[10px] uppercase tracking-widest text-ink-muted font-semibold mb-2">Detalle de productos</p>
      <div className="space-y-2">
        {items.map((item: TicketItem) => (
          <div key={item.ticketItemCen} className="flex items-center justify-between bg-surface-3 rounded-lg px-4 py-3">
            <div className="flex-1 min-w-0 pr-4">
              <p className="text-xs font-medium text-ink-primary truncate">{item.productName}</p>
              <p className="text-[10px] font-mono text-ink-muted">{item.productCen}</p>
            </div>
            <div className="flex items-center gap-6 text-xs text-ink-secondary shrink-0">
              <div className="text-right"><p className="text-ink-muted">Cant.</p><p className="font-mono font-medium text-ink-primary">{item.quantity}</p></div>
              <div className="text-right"><p className="text-ink-muted">Precio</p><p className="font-mono font-medium text-ink-primary">{formatCurrency(item.unitPrice)}</p></div>
              <div className="text-right min-w-[70px]"><p className="text-ink-muted">Subtotal</p><p className="font-mono font-medium text-accent">{formatCurrency(item.quantity * item.unitPrice)}</p></div>

              <div><Badge variant={item.status === 'READY' ? 'green' : 'yellow'}>{item.status}</Badge></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
