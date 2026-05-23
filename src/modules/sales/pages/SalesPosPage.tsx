import { useState, useMemo } from 'react'
import { ShoppingCart, Trash2, CheckCircle2 } from 'lucide-react'
import { useAppStore } from '../../../store/useAppStore'
import { useWaiters, useCreateTicket, useAddTicketItem } from '../services/salesHooks'
import { formatCurrency } from '../../../lib/utils'
import SectionHeader from '../../../components/SectionHeader'
import SkuSelector from '../../../components/SkuSelector'
import Button from '../../../atoms/Button'
import Badge from '../../../atoms/Badge'
import toast from 'react-hot-toast'

interface CartItem {
  productCen: string
  productName: string
  skuLabel: string
  quantity:   number
  unitPrice:  number
}

export default function SalesPosPage() {
  const { selectedWarehouse } = useAppStore()
  const { data: waiters = [] } = useWaiters()
  
  const createTicket = useCreateTicket()
  const addTicketItem = useAddTicketItem()

  const [cart, setCart] = useState<CartItem[]>([])
  const [selectedWaiterCen, setSelectedWaiterCen] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  const total = useMemo(() => cart.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0), [cart])

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
    if (!selectedWarehouse) return
    if (cart.length === 0) return
    
    setIsProcessing(true)
    try {
      const ticket: any = await createTicket.mutateAsync({ waiterCen: selectedWaiterCen || undefined })
      const ticketCen = ticket.ticketCen

      await Promise.all(cart.map(item => 
        addTicketItem.mutateAsync({
          ticketCen,
          data: {
            productCen: item.productCen,
            quantity: item.quantity,
            unitPrice: item.unitPrice
          }
        })
      ))
      
      toast.success('¡Ticket registrado con éxito!')
      setCart([])
      setSelectedWaiterCen('')
    } catch (error) {
      console.error(error)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="animate-fade-in h-[calc(100vh-64px)] flex flex-col">
      <SectionHeader 
        title="Punto de Venta" 
        subtitle={`Almacén: ${selectedWarehouse?.name}`} 
      />

      <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-6 p-6">
        
        <div className="lg:col-span-7 flex flex-col h-full card overflow-hidden">
          <div className="px-5 py-4 border-b border-surface-4">
            <h2 className="font-display font-bold text-ink-primary">Productos</h2>
          </div>
          <div className="p-5 overflow-y-auto flex-1">
            <SkuSelector allowCreate={false} onAdd={handleAddToCart} />
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
              <select className="input text-xs" value={selectedWaiterCen} onChange={e => setSelectedWaiterCen(e.target.value)}>
                <option value="">Sin asignar</option>
                {waiters.map(w => <option key={w.waiterCen} value={w.waiterCen}>{w.name}</option>)}
              </select>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-sm font-semibold text-ink-secondary">Total:</span>
              <span className="font-display text-2xl font-bold text-ink-primary">{formatCurrency(total)}</span>
            </div>

            <Button 
              variant="primary" 
              className="w-full justify-center py-3"
              disabled={cart.length === 0 || isProcessing}
              loading={isProcessing}
              onClick={handleProcessSale}
            >
              <CheckCircle2 size={16} /> Enviar a Cocina / Caja
            </Button>
          </div>

        </div>
      </div>
    </div>
  )
}
