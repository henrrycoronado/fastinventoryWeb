import { useState, useMemo } from 'react'
import { Search, Truck, Plus, CheckCircle2, ShoppingCart, Trash2 } from 'lucide-react'
import { useOrders, useCreateOrder, useConfirmOrder, useSuppliers } from '../services'
import { useAppStore } from '../../../core/store/useAppStore'
import { formatDate } from '../../../core/utils'
import type { Supplier } from '../types'
import SectionHeader from '../../../core/components/SectionHeader'
import Modal from '../../../core/components/atoms/Modal'
import Button from '../../../core/components/atoms/Button'
import SkuSelector from '../../../core/components/SkuSelector'
import Badge from '../../../core/components/atoms/Badge'

interface CartItem {
  productCen: string
  productName: string
  skuLabel: string
  quantity:   number
}

export default function OrdersPage() {
  const { selectedWarehouse } = useAppStore()
  const { data: ordersData, isLoading } = useOrders()
  const { data: suppliers = [] } = useSuppliers()
  const createOrder = useCreateOrder()
  const confirmOrder = useConfirmOrder()

  const [search, setSearch]   = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  
  // Create Order State
  const [selectedSupplierCen, setSelectedSupplierCen] = useState('')
  const [cart, setCart] = useState<CartItem[]>([])

  const orders = ordersData?.items ?? []

  const filtered = useMemo(() => {
    return orders.filter((o: any) => 
      o.orderCen.toLowerCase().includes(search.toLowerCase()) || 
      o.supplierCen.toLowerCase().includes(search.toLowerCase())
    )
  }, [orders, search])

  const handleAddToCart = (item: any) => {
    setCart(prev => {
      const existing = prev.find(i => i.productCen === item.productCen)
      if (existing) return prev.map(i => i.productCen === item.productCen ? { ...i, quantity: i.quantity + 1 } : i)
      return [...prev, {
        productCen: item.productCen,
        productName: item.productName,
        skuLabel: item.skuLabel,
        quantity: 1
      }]
    })
  }

  const handleCreate = async () => {
    if (!selectedSupplierCen || !selectedWarehouse || cart.length === 0) return
    
    await createOrder.mutateAsync({
      supplierCen: selectedSupplierCen,
      warehouseCen: selectedWarehouse.warehouseCen,
      items: cart.map(i => ({ productCen: i.productCen, quantity: i.quantity }))
    })
    
    setModalOpen(false)
    setCart([])
    setSelectedSupplierCen('')
  }

  const handleConfirm = async (orderCen: string) => {
    await confirmOrder.mutateAsync(orderCen)
  }

  return (
    <div className="animate-fade-in">
      <SectionHeader 
        title="Órdenes de Compra" 
        subtitle={`${orders.length} órdenes registradas`}
        right={
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
              <input className="input pl-8 w-52 text-xs" placeholder="Buscar orden..." value={search} onChange={(e: any) => setSearch(e.target.value)} />
            </div>
            <button onClick={() => setModalOpen(true)} className="btn-primary text-sm"><Plus size={13} /> Nueva orden</button>
          </div>
        }
      />

      <div className="mx-6 mt-4 card overflow-hidden">
        <div className="grid grid-cols-5 px-6 py-3 border-b border-surface-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted">Orden</span>
          <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted">Proveedor</span>
          <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted">Fecha</span>
          <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted">Estado</span>
          <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted text-right">Acciones</span>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16 text-sm text-ink-muted">Cargando órdenes…</div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-2">
            <Truck size={28} className="text-ink-muted" />
            <p className="text-sm text-ink-muted">Sin órdenes encontradas</p>
          </div>
        ) : (
          <div className="divide-y divide-surface-3">
            {filtered.map((o: any) => (
              <div key={o.orderCen} className="grid grid-cols-5 items-center px-6 py-4 hover:bg-surface-2/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                    <Truck size={14} className="text-accent" />
                  </div>
                  <span className="text-sm font-medium text-ink-primary font-mono">{o.orderCen}</span>
                </div>
                <div className="text-sm text-ink-secondary">{o.supplierCen}</div>
                <div className="text-sm text-ink-secondary">{formatDate(o.createdAt)}</div>
                <div>
                  <Badge variant={o.status === 1 ? 'green' : 'yellow'}>
                    {o.status === 1 ? 'Confirmada' : 'Pendiente'}
                  </Badge>
                </div>
                <div className="flex justify-end">
                  {o.status === 0 && (
                    <button 
                      onClick={() => handleConfirm(o.orderCen)}
                      className="btn-ghost !px-2 !py-1 text-accent hover:bg-accent/10"
                      title="Confirmar recepción"
                    >
                      <CheckCircle2 size={16} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal 
        open={modalOpen} 
        onClose={() => setModalOpen(false)} 
        title="Nueva Orden de Compra" 
        size="lg"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="label">Proveedor</label>
              <select 
                className="input text-sm" 
                value={selectedSupplierCen} 
                onChange={(e: any) => setSelectedSupplierCen(e.target.value)}
              >
                <option value="">Seleccionar proveedor...</option>
                {(suppliers as Supplier[]).map(s => (
                  <option key={s.supplierCen} value={s.supplierCen}>{s.name}</option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="label">Productos</label>
              <SkuSelector onAdd={handleAddToCart} />
            </div>
          </div>

          <div className="flex flex-col h-full bg-surface-1 rounded-xl border border-surface-4 overflow-hidden">
            <div className="px-4 py-3 border-b border-surface-4 flex items-center gap-2">
              <ShoppingCart size={14} className="text-accent" />
              <span className="text-sm font-bold">Carrito de compra</span>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {cart.length === 0 ? (
                <p className="text-xs text-ink-muted text-center py-10">El carrito está vacío</p>
              ) : (
                cart.map(item => (
                  <div key={item.productCen} className="flex items-center justify-between bg-surface-2 p-2 rounded-lg border border-surface-4">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium truncate">{item.productName}</p>
                      <p className="text-[10px] text-ink-muted font-mono">{item.skuLabel}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <input 
                        type="number" 
                        className="input !py-0.5 !px-1.5 w-12 text-xs font-mono text-center" 
                        value={item.quantity} 
                        onChange={(e: any) => {
                          const val = parseInt(e.target.value) || 1
                          setCart(prev => prev.map(i => i.productCen === item.productCen ? { ...i, quantity: val } : i))
                        }}
                      />
                      <button 
                        onClick={() => setCart(prev => prev.filter(i => i.productCen !== item.productCen))}
                        className="text-ink-muted hover:text-red-400"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="p-4 border-t border-surface-4 bg-surface-2 flex justify-end gap-2">
              <Button onClick={() => setModalOpen(false)}>Cancelar</Button>
              <Button 
                variant="primary" 
                onClick={handleCreate}
                disabled={!selectedSupplierCen || cart.length === 0 || createOrder.isPending}
                loading={createOrder.isPending}
              >
                Crear Orden
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  )
}
