import { useState, useMemo } from 'react'
import { ShoppingCart, Trash2, CheckCircle2} from 'lucide-react'
import { useAppStore } from '../../../store/useAppStore'
import { useCustomers, useSellers, useCreateSale, useConfirmSale, useCreateReceipt } from '../services/salesHooks'
import { formatCurrency } from '../../../lib/utils'
import SectionHeader from '../../../components/SectionHeader'
import SkuSelector from '../../../components/SkuSelector'
import toast from 'react-hot-toast'

interface CartItem {
  skuId: number
  skuLabel: string
  productName: string
  quantity: number
  unitPrice: number
}

export default function SalesDashboard() {
  const { selectedWarehouse, selectedCompany, getModuleSettings } = useAppStore()
  const settings = getModuleSettings(selectedCompany?.id ?? 0)

  const { data: customers = [] } = useCustomers()
  const { data: sellers = [] }   = useSellers()
  
  const createSale   = useCreateSale()
  const confirmSale  = useConfirmSale()
  const createReceipt= useCreateReceipt()

  const [cart, setCart]         = useState<CartItem[]>([])
  const [customerId, setCustomerId] = useState<number | ''>('')
  const [sellerId, setSellerId]     = useState<number | ''>('')
  const [notes, setNotes]           = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  const total = useMemo(() => cart.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0), [cart])

  const handleAddToCart = (item: any) => {
    setCart(prev => {
      const existing = prev.find(i => i.skuId === item.skuId)
      if (existing) {
        return prev.map(i => i.skuId === item.skuId ? { ...i, quantity: i.quantity + 1 } : i)
      }
      return [...prev, {
        skuId: item.skuId,
        skuLabel: item.skuLabel,
        productName: item.productName,
        quantity: 1,
        unitPrice: item.price
      }]
    })
  }

  const updateQuantity = (skuId: number, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.skuId === skuId) {
        const newQ = item.quantity + delta
        return newQ > 0 ? { ...item, quantity: newQ } : item
      }
      return item
    }))
  }

  const updatePrice = (skuId: number, newPrice: number) => {
    setCart(prev => prev.map(item => item.skuId === skuId ? { ...item, unitPrice: newPrice } : item))
  }

  const removeFromCart = (skuId: number) => {
    setCart(prev => prev.filter(item => item.skuId !== skuId))
  }

  const resetCart = () => {
    setCart([]); setCustomerId(''); setSellerId(''); setNotes('')
  }

  const handleProcessSale = async () => {
    if (!selectedWarehouse) return toast.error('Selecciona un almacén primero')
    if (cart.length === 0) return
    
    setIsProcessing(true)
    try {
      // 1. Crear Venta (DRAFT)
      const payload = {
        warehouseId: selectedWarehouse.id,
        sellerId: sellerId || null,
        customerId: customerId || null,
        notes: notes || undefined,
        details: cart.map(item => ({
          skuId: item.skuId,
          batchId: null,
          quantity: item.quantity,
          unitPrice: item.unitPrice
        }))
      }
      
      const draftSale: any = await createSale.mutateAsync(payload)
      const saleId = draftSale.id

      // 2. Confirmar Venta (Descuenta Stock)
      await confirmSale.mutateAsync(saleId)

      // 3. Generar Recibo
      await createReceipt.mutateAsync(saleId)

      toast.success('¡Venta completada con éxito!')
      resetCart()
    } catch (error) {
      // El error ya es manejado por el interceptor de Axios
      console.error('Error al procesar la venta:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="animate-fade-in h-[calc(100vh-64px)] flex flex-col">
      <SectionHeader 
        title="Registro de Venta" 
        subtitle={`Almacén activo: ${selectedWarehouse?.name}`} 
      />

      <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-6 p-6">
        
        {/* Columna Izquierda: Buscador de Productos */}
        <div className="lg:col-span-7 flex flex-col h-full card overflow-hidden">
          <div className="px-5 py-4 border-b border-surface-4">
            <h2 className="font-display font-bold text-ink-primary">Agregar productos</h2>
            <p className="text-xs text-ink-muted mt-1">Busca y selecciona SKUs para agregar al carrito</p>
          </div>
          <div className="p-5 overflow-y-auto flex-1">
            <SkuSelector allowCreate={false} onAdd={handleAddToCart} />
          </div>
        </div>

        {/* Columna Derecha: Carrito de Ventas */}
        <div className="lg:col-span-5 flex flex-col h-full card overflow-hidden bg-surface-1/50 border-accent/20">
          <div className="px-5 py-4 border-b border-surface-4 flex items-center justify-between bg-surface-1">
            <h2 className="font-display font-bold text-ink-primary flex items-center gap-2">
              <ShoppingCart size={18} className="text-accent" /> Carrito
            </h2>
            <span className="badge bg-surface-3 text-ink-secondary">{cart.length} ítems</span>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-ink-muted space-y-2 opacity-60">
                <ShoppingCart size={32} />
                <p className="text-sm">El carrito está vacío</p>
              </div>
            ) : (
              <div className="space-y-3">
                {cart.map(item => (
                  <div key={item.skuId} className="bg-surface-0 border border-surface-4 rounded-xl p-3 shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                      <div className="min-w-0 pr-2">
                        <p className="text-sm font-medium text-ink-primary truncate" title={item.productName}>{item.productName}</p>
                        <p className="text-xs font-mono text-ink-muted">{item.skuLabel}</p>
                      </div>
                      <button onClick={() => removeFromCart(item.skuId)} className="text-ink-muted hover:text-red-400 transition-colors p-1">
                        <Trash2 size={14} />
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between gap-4">
                      {/* Control de cantidad */}
                      <div className="flex items-center bg-surface-2 rounded-lg border border-surface-4">
                        <button onClick={() => updateQuantity(item.skuId, -1)} className="px-2.5 py-1 text-ink-secondary hover:text-ink-primary transition-colors">−</button>
                        <span className="text-xs font-mono font-medium w-6 text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.skuId, 1)} className="px-2.5 py-1 text-ink-secondary hover:text-ink-primary transition-colors">+</button>
                      </div>
                      
                      {/* Control de precio unitario editable */}
                      <div className="flex-1 max-w-[100px]">
                        <input 
                          type="number" 
                          className="input !py-1 !px-2 text-xs font-mono text-right" 
                          value={item.unitPrice} 
                          onChange={(e) => updatePrice(item.skuId, parseFloat(e.target.value) || 0)} 
                          step="0.01"
                          min="0"
                        />
                      </div>

                      {/* Subtotal */}
                      <div className="text-right min-w-[70px]">
                        <p className="text-xs font-mono font-bold text-accent">
                          {formatCurrency(item.quantity * item.unitPrice)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Checkout Footer */}
          <div className="border-t border-surface-4 bg-surface-1 p-5 space-y-4 shrink-0">
            <div className="grid grid-cols-2 gap-3">
              {settings.clientsEnabled && (
                <div>
                  <label className="text-[10px] uppercase tracking-wider font-semibold text-ink-muted mb-1 block">Cliente</label>
                  <select className="input text-xs !py-2" value={customerId} onChange={e => setCustomerId(Number(e.target.value) || '')}>
                    <option value="">Consumidor Final</option>
                    {(customers as any[]).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              )}
              {settings.sellersEnabled && (
                <div>
                  <label className="text-[10px] uppercase tracking-wider font-semibold text-ink-muted mb-1 block">Vendedor</label>
                  <select className="input text-xs !py-2" value={sellerId} onChange={e => setSellerId(Number(e.target.value) || '')}>
                    <option value="">Sin asignar</option>
                    {(sellers as any[]).map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
              )}
            </div>

            <div>
              <input 
                className="input text-xs !py-2 w-full" 
                placeholder="Notas de la venta (opcional)..." 
                value={notes} 
                onChange={e => setNotes(e.target.value)} 
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-sm font-semibold text-ink-secondary">Total a cobrar:</span>
              <span className="font-display text-2xl font-bold text-ink-primary">{formatCurrency(total)}</span>
            </div>

            <button 
              onClick={handleProcessSale}
              disabled={cart.length === 0 || isProcessing}
              className="btn-primary w-full justify-center py-3 text-sm shadow-md shadow-accent/20"
            >
              {isProcessing ? (
                <span className="w-4 h-4 rounded-full border-2 border-surface-0/30 border-t-surface-0 animate-spin" />
              ) : (
                <><CheckCircle2 size={16} /> Procesar Venta</>
              )}
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}