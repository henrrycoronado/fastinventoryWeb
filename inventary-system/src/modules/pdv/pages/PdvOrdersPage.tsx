import { useMemo, useState } from 'react'
import { CheckCircle2, ClipboardList, Plus, ShoppingCart, Trash2, AlertCircle } from 'lucide-react'
import SectionHeader from '../../../components/SectionHeader'
import ConfirmModal from '../../../atoms/ConfirmModal'
import {
  useAddPdvOrderItem,
  useCheckoutPdvOrder,
  useCreatePdvOrder,
  useDeletePdvOrder,
  usePdvMenuItems,
  usePdvMenus,
  usePdvOrders,
  usePdvStations,
  usePdvTables,
  usePdvWaiters,
} from '../services/pdvHooks'
import { useCustomers } from '../../sales/services/salesHooks'
import { formatDate } from '../../../lib/utils'
import type { PdvOrder } from '../services/types'
import { useAppStore } from '../../../store/useAppStore'

function statusBadge(statusId: number) {
  if (statusId === 1) return 'bg-accent/10 text-accent'
  if (statusId === 2) return 'bg-green-500/10 text-green-400'
  if (statusId === 3) return 'bg-red-500/10 text-red-400'
  return 'bg-surface-3 text-ink-secondary'
}

function statusLabel(statusId: number) {
  if (statusId === 1) return 'Abierta'
  if (statusId === 2) return 'Cobrada'
  if (statusId === 3) return 'Anulada'
  return `Estado #${statusId}`
}

export default function PdvOrdersPage() {
  const selectedWarehouse = useAppStore(s => s.selectedWarehouse)
  const { data: orders = [], isLoading } = usePdvOrders()
  const { data: tables = [] } = usePdvTables()
  const { data: waiters = [] } = usePdvWaiters()
  const { data: customers = [] } = useCustomers()
  const { data: menus = [] } = usePdvMenus()
  const { data: stations = [] } = usePdvStations()

  const createOrder = useCreatePdvOrder()
  const addOrderItem = useAddPdvOrderItem()
  const checkoutOrder = useCheckoutPdvOrder()
  const deleteOrder = useDeletePdvOrder()

  const [tableId, setTableId] = useState<number | ''>('')
  const [waiterId, setWaiterId] = useState<number | ''>('')
  const [customerId, setCustomerId] = useState<number | ''>('')

  const [selectedOrderId, setSelectedOrderId] = useState<number | ''>('')
  const [selectedMenuId, setSelectedMenuId] = useState<number | ''>('')

  const { data: menuItems = [] } = usePdvMenuItems(selectedMenuId ? Number(selectedMenuId) : null)

  const [menuItemId, setMenuItemId] = useState<number | ''>('')
  const [stationId, setStationId] = useState<number | ''>('')
  const [quantity, setQuantity] = useState('1')
  const [unitPrice, setUnitPrice] = useState('0')
  const [notes, setNotes] = useState('')

  const [deleteTarget, setDeleteTarget] = useState<PdvOrder | null>(null)

  const selectedOrder = useMemo(
    () => (orders as PdvOrder[]).find(order => order.id === Number(selectedOrderId)) ?? null,
    [orders, selectedOrderId]
  )

  const openOrders = useMemo(
    () => (orders as PdvOrder[]).filter(order => order.statusId === 1),
    [orders]
  )

  const handleOpenOrder = async () => {
    if (!selectedWarehouse || !tableId || !waiterId) return

    const result: PdvOrder = await createOrder.mutateAsync({
      warehouseId: selectedWarehouse.id,
      tableId: Number(tableId),
      waiterId: Number(waiterId),
      customerId: customerId ? Number(customerId) : null,
    })

    setSelectedOrderId(result.id)
    setTableId('')
    setWaiterId('')
    setCustomerId('')
  }

  const handleAddItem = async () => {
    if (!selectedOrderId || !menuItemId) return

    await addOrderItem.mutateAsync({
      orderId: Number(selectedOrderId),
      data: {
        menuItemId: Number(menuItemId),
        stationId: stationId ? Number(stationId) : null,
        quantity: Number(quantity) || 1,
        unitPrice: Number(unitPrice) || 0,
        notes: notes || undefined,
      },
    })

    setMenuItemId('')
    setQuantity('1')
    setUnitPrice('0')
    setNotes('')
  }

  const handleCheckout = async () => {
    if (!selectedOrder) return
    await checkoutOrder.mutateAsync(selectedOrder.id)
    setSelectedOrderId('')
  }

  return (
    <div className="animate-fade-in">
      <SectionHeader
        title="Órdenes"
        subtitle={`${(orders as PdvOrder[]).length} órdenes registradas`}
      />

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 p-6">
        <div className="xl:col-span-4 card p-4 space-y-3">
          <h2 className="font-display font-bold text-ink-primary">Abrir orden</h2>

          <select className="input text-sm" value={tableId} onChange={e => setTableId(Number(e.target.value) || '')}>
            <option value="">Seleccionar mesa</option>
            {(tables as Array<{ id: number; name: string }>).map(table => (
              <option key={table.id} value={table.id}>
                {table.name}
              </option>
            ))}
          </select>

          <select className="input text-sm" value={waiterId} onChange={e => setWaiterId(Number(e.target.value) || '')}>
            <option value="">Seleccionar mesero</option>
            {(waiters as Array<{ id: number; name: string }>).map(waiter => (
              <option key={waiter.id} value={waiter.id}>
                {waiter.name}
              </option>
            ))}
          </select>

          <select className="input text-sm" value={customerId} onChange={e => setCustomerId(Number(e.target.value) || '')}>
            <option value="">Consumidor final</option>
            {(customers as Array<{ id: number; name: string }>).map(customer => (
              <option key={customer.id} value={customer.id}>
                {customer.name}
              </option>
            ))}
          </select>

          <button
            onClick={handleOpenOrder}
            disabled={!selectedWarehouse || !tableId || !waiterId || createOrder.isPending}
            className="btn-primary text-sm justify-center w-full"
          >
            {createOrder.isPending ? (
              <span className="w-3 h-3 rounded-full border-2 border-surface-0/30 border-t-surface-0 animate-spin" />
            ) : (
              <Plus size={13} />
            )}
            Abrir orden
          </button>

          {!selectedWarehouse && (
            <p className="text-xs text-yellow-400">Selecciona un almacén para abrir órdenes.</p>
          )}
        </div>

        <div className="xl:col-span-8 card p-4 space-y-3">
          <h2 className="font-display font-bold text-ink-primary">Gestionar orden</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <select
              className="input text-sm"
              value={selectedOrderId}
              onChange={e => setSelectedOrderId(Number(e.target.value) || '')}
            >
              <option value="">Seleccionar orden abierta</option>
              {openOrders.map(order => (
                <option key={order.id} value={order.id}>
                  Orden #{order.id}
                </option>
              ))}
            </select>

            <select className="input text-sm" value={selectedMenuId} onChange={e => setSelectedMenuId(Number(e.target.value) || '')}>
              <option value="">Seleccionar menú</option>
              {(menus as Array<{ id: number; name: string }>).map(menu => (
                <option key={menu.id} value={menu.id}>
                  {menu.name}
                </option>
              ))}
            </select>

            <select className="input text-sm" value={menuItemId} onChange={e => setMenuItemId(Number(e.target.value) || '')}>
              <option value="">Seleccionar ítem de menú</option>
              {(menuItems as Array<{ id: number; skuId: number }>).map(item => (
                <option key={item.id} value={item.id}>
                  Item #{item.id} · SKU #{item.skuId}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <select className="input text-sm" value={stationId} onChange={e => setStationId(Number(e.target.value) || '')}>
              <option value="">Estación (opcional)</option>
              {(stations as Array<{ id: number; name: string }>).map(station => (
                <option key={station.id} value={station.id}>
                  {station.name}
                </option>
              ))}
            </select>
          </div>

          {selectedMenuId && (menuItems as Array<{ id: number }>).length === 0 && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-yellow-500/30 bg-yellow-500/10 text-xs text-yellow-300">
              <AlertCircle size={13} />
              Este menú no tiene ítems. Configúralos desde la sección Menús.
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <input
              className="input text-sm"
              type="number"
              min="1"
              step="1"
              placeholder="Cantidad"
              value={quantity}
              onChange={e => setQuantity(e.target.value)}
            />
            <input
              className="input text-sm"
              type="number"
              min="0"
              step="0.01"
              placeholder="Precio unitario"
              value={unitPrice}
              onChange={e => setUnitPrice(e.target.value)}
            />
            <input
              className="input text-sm md:col-span-2"
              placeholder="Notas del ítem (opcional)"
              value={notes}
              onChange={e => setNotes(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleAddItem}
              disabled={!selectedOrderId || !menuItemId || addOrderItem.isPending}
              className="btn-primary text-sm"
            >
              {addOrderItem.isPending ? (
                <span className="w-3 h-3 rounded-full border-2 border-surface-0/30 border-t-surface-0 animate-spin" />
              ) : (
                <Plus size={13} />
              )}
              Agregar ítem
            </button>

            <button
              onClick={handleCheckout}
              disabled={!selectedOrderId || checkoutOrder.isPending}
              className="btn-ghost text-sm"
            >
              {checkoutOrder.isPending ? (
                <span className="w-3 h-3 rounded-full border-2 border-current/30 border-t-current animate-spin" />
              ) : (
                <CheckCircle2 size={13} />
              )}
              Cobrar orden
            </button>
          </div>

          {selectedOrder && (
            <div className="rounded-lg border border-surface-4 px-3 py-2 text-xs text-ink-secondary">
              Orden #{selectedOrder.id} · abierta {formatDate(selectedOrder.openedAt)}
            </div>
          )}
        </div>
      </div>

      <div className="mx-6 mb-8 card overflow-hidden">
        <div className="hidden md:grid grid-cols-12 px-6 py-3 border-b border-surface-4">
          <span className="col-span-2 text-xs font-semibold uppercase tracking-wider text-ink-muted">Orden</span>
          <span className="col-span-2 text-xs font-semibold uppercase tracking-wider text-ink-muted">Estado</span>
          <span className="col-span-2 text-xs font-semibold uppercase tracking-wider text-ink-muted">Mesa</span>
          <span className="col-span-2 text-xs font-semibold uppercase tracking-wider text-ink-muted">Mesero</span>
          <span className="col-span-3 text-xs font-semibold uppercase tracking-wider text-ink-muted">Apertura</span>
          <span className="col-span-1" />
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16 text-sm text-ink-muted">Cargando órdenes…</div>
        ) : (orders as PdvOrder[]).length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-2">
            <ClipboardList size={28} className="text-ink-muted" />
            <p className="text-sm text-ink-muted">Sin órdenes</p>
          </div>
        ) : (
          <div className="divide-y divide-surface-3">
            {(orders as PdvOrder[]).map(order => {
              const table = (tables as Array<{ id: number; name: string }>).find(x => x.id === order.tableId)
              const waiter = (waiters as Array<{ id: number; name: string }>).find(x => x.id === order.waiterId)

              return (
                <div key={order.id} className="grid grid-cols-1 md:grid-cols-12 items-center gap-3 px-6 py-4 hover:bg-surface-2/50 transition-colors">
                  <div className="md:col-span-2 flex items-center gap-2">
                    <ShoppingCart size={14} className="text-accent" />
                    <span className="text-sm font-medium text-ink-primary">#{order.id}</span>
                  </div>

                  <div className="md:col-span-2">
                    <span className={`text-[11px] px-2 py-1 rounded-full ${statusBadge(order.statusId)}`}>
                      {statusLabel(order.statusId)}
                    </span>
                  </div>

                  <div className="md:col-span-2 text-sm text-ink-secondary">{table?.name ?? `Mesa #${order.tableId}`}</div>
                  <div className="md:col-span-2 text-sm text-ink-secondary">{waiter?.name ?? `Mesero #${order.waiterId}`}</div>
                  <div className="md:col-span-3 text-sm text-ink-secondary">{formatDate(order.openedAt)}</div>

                  <div className="md:col-span-1 flex justify-end">
                    <button
                      onClick={() => setDeleteTarget(order)}
                      className="p-1.5 text-ink-muted hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                      title="Eliminar orden"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <ConfirmModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) deleteOrder.mutate(deleteTarget.id)
          setDeleteTarget(null)
        }}
        title="Eliminar orden"
        description={`¿Seguro que quieres eliminar la orden #${deleteTarget?.id}?`}
        confirmLabel="Eliminar"
        variant="danger"
      />
    </div>
  )
}
