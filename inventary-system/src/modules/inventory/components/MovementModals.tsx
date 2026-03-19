import { useState } from 'react'
import { ArrowDownCircle, ArrowUpCircle, ArrowLeftRight, X, AlertCircle } from 'lucide-react'
import { useCreateMovement, useWarehouses } from '../services/inventoryHooks'
import { useAppStore } from '../../../store/useAppStore'
import { formatCurrency } from '../../../lib/utils'
import type { Movement, MovementDetail } from '../services/types'
import SkuSelector from '../../../components/SkuSelector'
import CreateProductInline from './ProductCreation'

const MOVEMENT_TYPE_INFO: Record<number, { label: string; isEntry: boolean }> = {
  1: { label: 'Entrada por Compra',  isEntry: true  }, 2: { label: 'Salida por Venta',    isEntry: false },
  3: { label: 'Ajuste Positivo',     isEntry: true  }, 4: { label: 'Ajuste Negativo',     isEntry: false },
  5: { label: 'Traspaso Salida',     isEntry: false }, 6: { label: 'Traspaso Entrada',    isEntry: true  },
}

export function MovementBadge({ typeId }: { typeId: number }) {
  const info = MOVEMENT_TYPE_INFO[typeId]
  if (!info) return null
  return <span className={`badge ${info.isEntry ? 'bg-accent/10 text-accent' : 'bg-red-500/10 text-red-400'}`}>{info.label}</span>
}

export function MovementExpanded({ movement }: { movement: Movement }) {
  return (
    <div className="px-6 py-4 bg-surface-1/60 border-t border-surface-3 animate-slide-up">
      <p className="text-[10px] uppercase tracking-widest text-ink-muted font-semibold mb-3">Detalle de productos</p>
      {!movement.details?.length ? <p className="text-xs text-ink-muted">Sin detalles</p> : (
        <div className="space-y-2">
          {movement.details.map((d: MovementDetail) => {
            const nombre = d.sku?.companyProduct?.localNameAlias ?? d.sku?.companyProduct?.globalProduct?.name ?? `SKU ${d.skuId}`
            return (
              <div key={d.id} className="flex items-center gap-4 bg-surface-3 rounded-lg px-4 py-3">
                <div className="flex-1 min-w-0"><p className="text-xs font-medium text-ink-primary truncate">{nombre}</p><p className="text-xs font-mono text-ink-muted">{d.sku?.internalSku ?? `#${d.skuId}`}</p></div>
                <div className="flex items-center gap-6 text-xs text-ink-secondary shrink-0">
                  <div className="text-right"><p className="text-ink-muted">Cant.</p><p className="font-mono font-medium text-ink-primary">{d.quantity}</p></div>
                  <div className="text-right"><p className="text-ink-muted">Costo</p><p className="font-mono font-medium text-ink-primary">{formatCurrency(d.unitCost)}</p></div>
                  <div className="text-right"><p className="text-ink-muted">Subtotal</p><p className="font-mono font-medium text-accent">{formatCurrency(d.quantity * d.unitCost)}</p></div>
                </div>
              </div>
            )
          })}
          <div className="flex justify-end pt-1"><div className="text-xs text-ink-muted">Total: <span className="font-mono font-bold text-ink-primary ml-1">{formatCurrency((movement.details ?? []).reduce((a, d) => a + d.quantity * d.unitCost, 0))}</span></div></div>
        </div>
      )}
      {movement.notes && <div className="mt-3 px-3 py-2 rounded-lg bg-surface-3 text-xs text-ink-secondary"><span className="text-ink-muted">Notas: </span>{movement.notes}</div>}
    </div>
  )
}

type ModalStep        = 'type' | 'products' | 'details' | 'confirm'
type MovementType     = 'incoming' | 'outgoing' | 'transfer'
interface DraftDetail { skuId: number; skuLabel: string; productName: string; batchId: number | null; quantity: number; unitCost: number }

export function NewMovementModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { selectedWarehouse } = useAppStore()
  const { data: warehouses  = [] } = useWarehouses()
  const createMovement = useCreateMovement()

  const [step, setStep]                           = useState<ModalStep>('type')
  const [movementType, setMovementType]           = useState<MovementType | null>(null)
  const [details, setDetails]                     = useState<DraftDetail[]>([])
  const [targetWarehouse, setTargetWarehouse]     = useState<number | ''>('')
  const [notes, setNotes]                         = useState('')

  const reset = () => { setStep('type'); setMovementType(null); setDetails([]); setTargetWarehouse(''); setNotes('') }
  const handleClose = () => { reset(); onClose() }
  const handleSelectType = (t: MovementType) => { setMovementType(t); setStep('products') }
  const handleAddSku = (item: any) => { if (!details.some(d => d.skuId === item.skuId)) setDetails(prev => [...prev, { ...item, batchId: null, quantity: 1, unitCost: 0 }]) }
  const handleRemoveSku = (skuId: number) => setDetails(prev => prev.filter(d => d.skuId !== skuId))
  const handleDetailChange = (skuId: number, field: 'quantity' | 'unitCost', value: number) => setDetails(prev => prev.map(d => d.skuId === skuId ? { ...d, [field]: value } : d))

  const handleSubmit = async () => {
    if (!selectedWarehouse || !movementType || !details.length) return
    const typeIdMap: Record<MovementType, number> = { incoming: 1, outgoing: 4, transfer: 5 }
    const payload = {
      warehouseId: selectedWarehouse.id, targetWarehouseId: movementType === 'transfer' ? targetWarehouse || null : null,
      typeId: typeIdMap[movementType], notes: notes || undefined,
      details: details.map(d => ({ skuId: d.skuId, batchId: d.batchId, quantity: d.quantity, unitCost: d.unitCost })),
    }
    await createMovement.mutateAsync({ type: movementType === 'transfer' ? 'outgoing' : movementType, data: payload })
    handleClose()
  }

  if (!open) return null
  const stepTitles: Record<ModalStep, string> = { type: 'Tipo de movimiento', products: 'Seleccionar productos', details: 'Cantidades y costos', confirm: 'Confirmar movimiento' }
  const otherWarehouses = (warehouses as any[]).filter(w => w.id !== selectedWarehouse?.id)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose} />
      <div className="relative w-full max-w-lg card animate-slide-up max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-surface-4 shrink-0">
          <div>
            <h2 className="font-display font-bold text-base text-ink-primary">{stepTitles[step]}</h2>
            <div className="flex items-center gap-1 mt-1">
              {(['type', 'products', 'details', 'confirm'] as ModalStep[]).map((s, i) => <div key={s} className={`h-1 rounded-full transition-all ${step === s ? 'w-6 bg-accent' : (['type', 'products', 'details', 'confirm'].indexOf(step) > i) ? 'w-3 bg-accent/40' : 'w-3 bg-surface-5'}`} />)}
            </div>
          </div>
          <button onClick={handleClose} className="btn-ghost !px-2 !py-1.5"><X size={15} /></button>
        </div>

        <div className="px-5 py-4 overflow-y-auto flex-1 space-y-4">
          {step === 'type' && (
            <div className="grid grid-cols-3 gap-3">
              {[ { type: 'incoming' as MovementType, icon: ArrowDownCircle, label: 'Entrada', desc: 'Recepción', color: 'text-accent' },
                 { type: 'outgoing' as MovementType, icon: ArrowUpCircle, label: 'Salida', desc: 'Retiro', color: 'text-red-400' },
                 { type: 'transfer' as MovementType, icon: ArrowLeftRight, label: 'Traslado', desc: 'Mover a warehouse', color: 'text-blue-400' },
              ].map(opt => <button key={opt.type} onClick={() => handleSelectType(opt.type)} className="card p-4 flex flex-col items-center gap-2 hover:bg-surface-3 transition-colors text-center"><opt.icon size={24} className={opt.color} /><p className="text-sm font-medium text-ink-primary">{opt.label}</p><p className="text-xs text-ink-muted">{opt.desc}</p></button>)}
            </div>
          )}

          {step === 'products' && (
            <div className="space-y-4">
              <SkuSelector onAdd={handleAddSku} allowCreate={true} CreateComponent={CreateProductInline} />
              {details.length > 0 && (
                <div>
                  <p className="text-xs text-ink-muted mb-2">Seleccionados:</p>
                  <div className="space-y-1.5">
                    {details.map(d => (
                      <div key={d.skuId} className="flex items-center gap-2 bg-surface-3 rounded-lg px-3 py-2">
                        <div className="flex-1 min-w-0"><p className="text-xs font-medium text-ink-primary truncate">{d.productName}</p><p className="text-xs font-mono text-ink-muted">{d.skuLabel}</p></div>
                        <button onClick={() => handleRemoveSku(d.skuId)} className="text-ink-muted hover:text-red-400 transition-colors p-1"><X size={12} /></button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {movementType === 'transfer' && (
                <div>
                  <label className="label">Warehouse destino</label>
                  <select className="input text-xs" value={targetWarehouse} onChange={e => setTargetWarehouse(Number(e.target.value))}>
                    <option value="">Seleccionar...</option>
                    {otherWarehouses.map((w: any) => (<option key={w.id} value={w.id}>{w.name} ({w.totalStock} uds)</option>))}
                  </select>
                </div>
              )}
            </div>
          )}

          {step === 'details' && (
            <div className="space-y-3">
              {details.map(d => (
                <div key={d.skuId} className="card p-4 space-y-3">
                  <div><p className="text-xs font-medium text-ink-primary">{d.productName}</p><p className="text-xs font-mono text-ink-muted">{d.skuLabel}</p></div>
                  <div className="grid grid-cols-2 gap-3">
                    <div><label className="label">Cantidad</label><input className="input text-xs font-mono" type="number" min="1" value={d.quantity} onChange={e => handleDetailChange(d.skuId, 'quantity', parseFloat(e.target.value) || 0)} /></div>
                    <div><label className="label">Costo unitario</label><input className="input text-xs font-mono" type="number" min="0" step="0.01" value={d.unitCost} onChange={e => handleDetailChange(d.skuId, 'unitCost', parseFloat(e.target.value) || 0)} /></div>
                  </div>
                </div>
              ))}
              <div><label className="label">Notas (opcional)</label><textarea className="input text-xs resize-none" rows={2} value={notes} onChange={e => setNotes(e.target.value)} placeholder="Observaciones..." /></div>
            </div>
          )}

          {step === 'confirm' && (
            <div className="space-y-4">
              <div className="bg-surface-3 rounded-xl p-4 space-y-3">
                <div className="flex justify-between text-xs"><span className="text-ink-muted">Tipo</span><MovementBadge typeId={movementType === 'incoming' ? 1 : movementType === 'outgoing' ? 4 : 5} /></div>
                <div className="flex justify-between text-xs"><span className="text-ink-muted">Warehouse</span><span className="text-ink-secondary">{selectedWarehouse?.name}</span></div>
                {movementType === 'transfer' && targetWarehouse && <div className="flex justify-between text-xs"><span className="text-ink-muted">Destino</span><span className="text-ink-secondary">{(warehouses as any[]).find(w => w.id === targetWarehouse)?.name}</span></div>}
                {notes && <div className="flex justify-between text-xs"><span className="text-ink-muted">Notas</span><span className="text-ink-secondary">{notes}</span></div>}
              </div>
              <div className="space-y-2">
                {details.map(d => (
                  <div key={d.skuId} className="flex items-center justify-between bg-surface-3 rounded-lg px-4 py-3">
                    <div><p className="text-xs font-medium text-ink-primary">{d.productName}</p><p className="text-xs font-mono text-ink-muted">{d.skuLabel}</p></div>
                    <div className="text-right text-xs"><p className="text-ink-secondary">{d.quantity} uds × {formatCurrency(d.unitCost)}</p><p className="font-mono font-medium text-accent">{formatCurrency(d.quantity * d.unitCost)}</p></div>
                  </div>
                ))}
                <div className="flex justify-end pt-1 text-xs text-ink-muted">Total: <span className="font-mono font-bold text-ink-primary ml-1">{formatCurrency(details.reduce((a, d) => a + d.quantity * d.unitCost, 0))}</span></div>
              </div>
              {details.some(d => d.unitCost === 0) && <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-yellow-500/10 text-yellow-400 text-xs"><AlertCircle size={13} /> Algunos ítems tienen costo 0. Verifica antes de confirmar.</div>}
            </div>
          )}
        </div>

        <div className="px-5 py-4 border-t border-surface-4 flex justify-between shrink-0">
          <button onClick={() => { if (step === 'type') handleClose(); if (step === 'products') setStep('type'); if (step === 'details') setStep('products'); if (step === 'confirm') setStep('details'); }} className="btn-ghost text-sm">
            {step === 'type' ? 'Cancelar' : 'Atrás'}
          </button>
          <button onClick={() => { if (step === 'products' && details.length > 0) setStep('details'); if (step === 'details') { const allValid = details.every(d => d.quantity > 0 && d.unitCost >= 0); if (allValid) setStep('confirm') }; if (step === 'confirm') handleSubmit(); }} disabled={(step === 'products' && details.length === 0) || (step === 'products' && movementType === 'transfer' && !targetWarehouse) || (step === 'confirm' && createMovement.isPending)} className="btn-primary text-sm">
            {step === 'confirm' ? createMovement.isPending ? <span className="w-3 h-3 rounded-full border-2 border-surface-0/30 border-t-surface-0 animate-spin" /> : 'Confirmar' : 'Siguiente'}
          </button>
        </div>
      </div>
    </div>
  )
}