import { useMemo, useState } from 'react'
import { ShoppingCart, Trash2, CheckCircle2, Ticket as TicketIcon, CreditCard, Plus } from 'lucide-react'
import { useAppStore } from '../../../core/store/useAppStore'
import {
  useWaiters,
  useCreateTicket,
  useAddTicketItem,
  useSendTicket,
  usePayTicket,
  usePaymentMethods,
  useTicketItems,
  useTicketTotals,
} from '../services'
import { useRestockNotifications } from '../hooks/useRestockNotifications'
import { formatCurrency } from '../../../core/utils'
import SectionHeader from '../../../core/components/SectionHeader'
import SkuSelector from '../../../core/components/SkuSelector'
import Button from '../../../core/components/atoms/Button'
import Badge from '../../../core/components/atoms/Badge'
import Modal from '../../../core/components/atoms/Modal'
import toast from 'react-hot-toast'

interface CartItem {
  productCen: string
  productName: string
  skuLabel: string
  quantity:   number
  unitPrice:  number
}

export default function SalesPosPage() {
  useRestockNotifications()
  const {
    selectedCompany,
    selectedWarehouse,
    activeTicketCen,
    setActiveTicketCen,
  } = useAppStore()
  const { data: waiters = [] } = useWaiters()
  const { data: paymentMethods = [] } = usePaymentMethods()
  const createTicket = useCreateTicket()
  const addTicketItem = useAddTicketItem()
  const sendTicket = useSendTicket()
  const payTicket = usePayTicket()

  const { data: activeTicketItems = [] } = useTicketItems(activeTicketCen ?? undefined)
  const { data: activeTicketTotals } = useTicketTotals(activeTicketCen ?? undefined)

  const [cart, setCart] = useState<CartItem[]>([])
  const [selectedWaiterCen, setSelectedWaiterCen] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentModalOpen, setPaymentModalOpen] = useState(false)
  const [paymentMethodCode, setPaymentMethodCode] = useState('')

  const total = useMemo(() => cart.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0), [cart])
  const activeTicketTotal = activeTicketTotals?.total ?? 0
  const grandTotal = activeTicketCen ? activeTicketTotal + total : total

  const closePaymentModal = () => {
    setPaymentModalOpen(false)
    setPaymentMethodCode('')
  }

  const handleAddToCart = (item: any) => {
    setCart(prev => {
      const existing = prev.find(i => i.productCen === item.productCen)
      if (existing) {
        return prev.map(i => i.productCen === item.productCen ? { ...i, quantity: i.quantity + 1 } : i)
      }
      return [...prev, {
        productCen: item.productCen,
        productName: item.productName,
        skuLabel: item.skuLabel,
        quantity: 1,
        unitPrice: item.price
      }]
    })
  }

  const handleProcessSale = async () => {
    if (cart.length === 0) return
    setIsProcessing(true)
    try {
      let ticketCen = activeTicketCen

      if (!ticketCen) {
        const ticket: any = await createTicket.mutateAsync({
          waiterCen: selectedWaiterCen || undefined
        })

        ticketCen = ticket.ticketCen
        setActiveTicketCen(ticketCen)
      }

      if (!ticketCen) {
        throw new Error('No se pudo resolver el ticket activo')
      }

      await Promise.all(cart.map(item =>
        addTicketItem.mutateAsync({
          ticketCen,
          data: {
            productCen: item.productCen,
            quantity: item.quantity
          }
        })
      ))
      toast.success('¡Ticket registrado con éxito!')
      setCart([])

      if (!activeTicketCen) {
        setSelectedWaiterCen('')
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsProcessing(false)
    }
  }

  const handlePayTicket = async () => {
    if (!activeTicketCen || !paymentMethodCode) return

    await sendTicket.mutateAsync(activeTicketCen)
    await payTicket.mutateAsync({
      ticketCen: activeTicketCen,
      data: { paymentMethodCode },
    })

    toast.success('Ticket cobrado')
    setCart([])
    setSelectedWaiterCen('')
    setActiveTicketCen(null)
    closePaymentModal()
  }

  return (
    <div className="animate-fade-in h-[calc(100vh-64px)] flex flex-col">
      <SectionHeader
        title="Punto de Venta"
        subtitle={selectedWarehouse ? `Almacén: ${selectedWarehouse.name}` : `Empresa: ${selectedCompany?.name}`}
      />


      <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-6 p-6">
        <div className="lg:col-span-7 flex flex-col h-full card overflow-hidden">
          <div className="px-5 py-4 border-b border-surface-4">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-display font-bold text-ink-primary">Productos</h2>
              {activeTicketCen ? (
                <Button variant="ghost" className="!px-3 !py-1.5 text-xs" onClick={() => setActiveTicketCen(null)}>
                  <Plus size={14} /> Nuevo ticket
                </Button>
              ) : null}
            </div>
          </div>
          <div className="p-5 overflow-y-auto flex-1">
            <SkuSelector
              allowCreate={false}
              onAdd={handleAddToCart}
              isSellable={true}
              warehouseCen={selectedWarehouse?.warehouseCen}
            />
          </div>
        </div>

        <div className="lg:col-span-5 flex flex-col h-full card overflow-hidden bg-surface-1/50 border-accent/20">
          <div className="px-5 py-4 border-b border-surface-4 flex items-center justify-between bg-surface-1">
            <h2 className="font-display font-bold text-ink-primary flex items-center gap-2">
              <ShoppingCart size={18} className="text-accent" /> Orden Actual
            </h2>
            <Badge>{cart.length} ítems</Badge>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {activeTicketCen && (
              <div className="rounded-2xl border border-accent/20 bg-accent/5 p-4 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.22em] text-ink-muted font-semibold">Ticket abierto</p>
                    <div className="flex items-center gap-2 mt-1">
                      <TicketIcon size={14} className="text-accent" />
                      <p className="font-mono text-sm font-semibold text-ink-primary break-all">{activeTicketCen}</p>
                    </div>
                    <p className="text-xs text-ink-secondary mt-1">
                      {activeTicketItems.length} ítems cargados
                    </p>
                  </div>
                  <Badge variant="yellow">Abierto</Badge>
                </div>

                <div className="space-y-1 text-xs text-ink-secondary">
                  <div className="flex items-center justify-between">
                    <span>Total actual</span>
                    <span className="font-mono font-semibold text-ink-primary">{formatCurrency(activeTicketTotal)}</span>
                  </div>
                  {cart.length > 0 && (
                    <div className="flex items-center justify-between text-accent">
                      <span>Nuevo carrito</span>
                      <span className="font-mono font-semibold">{formatCurrency(total)}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-ink-muted space-y-2 opacity-60">
                <ShoppingCart size={32} />
                <p className="text-sm">La orden está vacía</p>
              </div>
            ) : (
              <div className="divide-y divide-surface-4">
                {cart.map(item => (
                  <div key={item.productCen} className="py-3 flex justify-between items-center">
                    <div className="min-w-0 pr-2">
                      <p className="text-sm font-medium text-ink-primary truncate">{item.productName}</p>
                      <p className="text-[10px] font-mono text-ink-muted">{item.skuLabel}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center bg-surface-3 rounded-lg border border-surface-5">
                        <button onClick={() => setCart(prev => prev.map(i => i.productCen === item.productCen ? { ...i, quantity: Math.max(1, i.quantity - 1) } : i))} className="px-2 py-1 text-ink-muted hover:text-ink-primary">−</button>
                        <span className="text-xs font-mono w-6 text-center">{item.quantity}</span>
                        <button onClick={() => setCart(prev => prev.map(i => i.productCen === item.productCen ? { ...i, quantity: i.quantity + 1 } : i))} className="px-2 py-1 text-ink-muted hover:text-ink-primary">+</button>
                      </div>
                      <div className="text-right min-w-[70px]">
                        <p className="text-xs font-mono font-bold text-accent">{formatCurrency(item.quantity * item.unitPrice)}</p>
                      </div>
                      <button onClick={() => setCart(prev => prev.filter(i => i.productCen !== item.productCen))} className="text-ink-muted hover:text-red-400 p-1"><Trash2 size={14} /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="border-t border-surface-4 bg-surface-1 p-5 space-y-4 shrink-0">
            <div>
              <label className="text-[10px] uppercase tracking-wider font-semibold text-ink-muted mb-1 block">Mesero</label>
              <select className="input text-xs" value={selectedWaiterCen} onChange={(e: any) => setSelectedWaiterCen(e.target.value)} disabled={!!activeTicketCen}>
                <option value="">Sin asignar</option>
                {waiters.map(w => <option key={w.waiterCen} value={w.waiterCen}>{w.name}</option>)}
              </select>
              {activeTicketCen && <p className="text-[10px] text-ink-muted mt-1">El mesero ya queda fijo en el ticket abierto.</p>}
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-sm font-semibold text-ink-secondary">Total:</span>
              <span className="font-display text-2xl font-bold text-ink-primary">{formatCurrency(grandTotal)}</span>
            </div>

            <div className="flex gap-2">
              <Button
                variant="primary"
                className="flex-1 justify-center py-3"
                disabled={cart.length === 0 || isProcessing}
                loading={isProcessing}
                onClick={handleProcessSale}
              >
                <CheckCircle2 size={16} /> {activeTicketCen ? 'Agregar al ticket' : 'Abrir ticket y agregar'}
              </Button>

              <Button
                variant="ghost"
                className="justify-center py-3 px-4"
                disabled={!activeTicketCen || cart.length > 0 || payTicket.isPending}
                onClick={() => setPaymentModalOpen(true)}
              >
                <CreditCard size={16} /> Cobrar
              </Button>
            </div>

            {cart.length > 0 && activeTicketCen && (
              <p className="text-[11px] text-ink-muted leading-relaxed">
                Primero agrega el carrito al ticket abierto. Después podrás cobrarlo desde esta misma pantalla.
              </p>
            )}
          </div>

        </div>
      </div>

      <Modal open={paymentModalOpen} onClose={closePaymentModal} title="Cobrar ticket" size="sm">
        <div className="space-y-4">
          <div>
            <p className="text-sm text-ink-secondary mb-1">Ticket: <span className="font-mono font-bold text-ink-primary break-all">{activeTicketCen}</span></p>
            <p className="text-lg font-bold text-ink-primary">Total a pagar: {formatCurrency(activeTicketTotal)}</p>
          </div>

          <div>
            <label className="label">Método de pago</label>
            <select className="input text-sm" value={paymentMethodCode} onChange={(e: any) => setPaymentMethodCode(e.target.value)}>
              <option value="">Seleccionar...</option>
              {paymentMethods.map(method => (
                <option key={method.paymentMethodCode} value={method.paymentMethodCode}>{method.name}</option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button onClick={closePaymentModal}>Cancelar</Button>
            <Button
              variant="primary"
              onClick={handlePayTicket}
              disabled={!paymentMethodCode || payTicket.isPending}
              loading={payTicket.isPending}
            >
              Confirmar pago
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}