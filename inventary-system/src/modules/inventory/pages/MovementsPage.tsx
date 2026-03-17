import { useState, useMemo } from 'react'
import {
  ArrowDownCircle, ArrowUpCircle, ArrowLeftRight,
  ChevronRight, Plus, X, Search, Package, AlertCircle
} from 'lucide-react'
import {
  useMovements, useCreateMovement, useCompanyProducts,
  useCreateGlobalProduct, useCreateCompanyProduct,
  useWarehouses, useSkus, useGlobalCategories,
} from '../services/inventoryHooks'
import { useAppStore } from '../../../store/useAppStore'
import { formatCurrency, formatDate } from '../../../lib/utils'
import type { Movement, MovementDetail, CompanyProduct, Sku } from '../services/types'
import { inventoryApi } from '../services/inventoryApi'

// ── Types ──────────────────────────────────────────────────────────────────
type MovementCategory = 'all' | 'incoming' | 'outgoing' | 'transfer'
type ModalStep        = 'type' | 'products' | 'details' | 'confirm'
type MovementType     = 'incoming' | 'outgoing' | 'transfer'

interface DraftDetail {
  skuId:       number
  skuLabel:    string
  productName: string
  batchId:     number | null
  quantity:    number
  unitCost:    number
}

// ── Helpers ─────────────────────────────────────────────────────────────────
const MOVEMENT_TYPE_INFO: Record<number, { label: string; isEntry: boolean }> = {
  1: { label: 'Entrada por Compra',  isEntry: true  },
  2: { label: 'Salida por Venta',    isEntry: false },
  3: { label: 'Ajuste Positivo',     isEntry: true  },
  4: { label: 'Ajuste Negativo',     isEntry: false },
  5: { label: 'Traspaso Salida',     isEntry: false },
  6: { label: 'Traspaso Entrada',    isEntry: true  },
}

function MovementBadge({ typeId }: { typeId: number }) {
  const info = MOVEMENT_TYPE_INFO[typeId]
  if (!info) return null
  return (
    <span className={`badge ${info.isEntry ? 'bg-accent/10 text-accent' : 'bg-red-500/10 text-red-400'}`}>
      {info.label}
    </span>
  )
}

// ── Expanded movement detail ────────────────────────────────────────────────
function MovementExpanded({ movement }: { movement: Movement }) {
  return (
    <div className="px-6 py-4 bg-surface-1/60 border-t border-surface-3 animate-slide-up">
      <p className="text-[10px] uppercase tracking-widest text-ink-muted font-semibold mb-3">
        Detalle de productos
      </p>
      {!movement.details?.length ? (
        <p className="text-xs text-ink-muted">Sin detalles</p>
      ) : (
        <div className="space-y-2">
          {movement.details.map((d: MovementDetail) => {
            const nombre = d.sku?.companyProduct?.localNameAlias
              ?? d.sku?.companyProduct?.globalProduct?.name
              ?? `SKU ${d.skuId}`
            const sku = d.sku?.internalSku ?? `#${d.skuId}`
            return (
              <div key={d.id} className="flex items-center gap-4 bg-surface-3 rounded-lg px-4 py-3">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-ink-primary truncate">{nombre}</p>
                  <p className="text-xs font-mono text-ink-muted">{sku}</p>
                </div>
                <div className="flex items-center gap-6 text-xs text-ink-secondary shrink-0">
                  <div className="text-right">
                    <p className="text-ink-muted">Cantidad</p>
                    <p className="font-mono font-medium text-ink-primary">{d.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-ink-muted">Costo unit.</p>
                    <p className="font-mono font-medium text-ink-primary">
                      {formatCurrency(d.unitCost)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-ink-muted">Subtotal</p>
                    <p className="font-mono font-medium text-accent">
                      {formatCurrency(d.quantity * d.unitCost)}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
          <div className="flex justify-end pt-1">
            <div className="text-xs text-ink-muted">
              Total: <span className="font-mono font-bold text-ink-primary ml-1">
                {formatCurrency(
                  (movement.details ?? []).reduce((a, d) => a + d.quantity * d.unitCost, 0)
                )}
              </span>
            </div>
          </div>
        </div>
      )}
      {movement.notes && (
        <div className="mt-3 px-3 py-2 rounded-lg bg-surface-3 text-xs text-ink-secondary">
          <span className="text-ink-muted">Notas: </span>{movement.notes}
        </div>
      )}
    </div>
  )
}

// ── Create product inline ───────────────────────────────────────────────────
function CreateProductInline({ }: {
  onCreated: (sku: { skuId: number; skuLabel: string; productName: string }) => void
}) {
  const { data: categories = [] } = useGlobalCategories()
  const createGlobal  = useCreateGlobalProduct()
  const createCompany = useCreateCompanyProduct()

  const [name,       setName]       = useState('')
  const [brand,      setBrand]      = useState('')
  const [upc,        setUpc]        = useState('')
  const [catId,      setCatId]      = useState('')
  const [skuCode,    setSkuCode]    = useState('')
  const [retailPrice, setRetailPrice] = useState('')
  const [wholesale,  setWholesale]  = useState('')
  const [alias,      setAlias]      = useState('')

  const handleCreate = async () => {
    if (!name.trim()) return
    const gp  = await createGlobal.mutateAsync({
      name, brand: brand || undefined,
      upcBarcode: upc || undefined,
      categoryId: catId ? parseInt(catId) : undefined,
    })
    const cp = await createCompany.mutateAsync({
      globalProductId: (gp as any).id,
      localNameAlias:  alias || undefined,
      wholesalePrice:  wholesale ? parseFloat(wholesale) : undefined,
    })
    const skus = (cp as any).skus ?? []
    let skuId: number = 0
    let skuLabel: string = ""
    if (skus.length > 0) {
      skuId    = skus[0].id
      skuLabel = skus[0].internalSku ?? `SKU #${skus[0].id}`
    } else {
        const newSku = await inventoryApi.skus.create((cp as any).id, {
            internalSku: skuCode || undefined,
            retailPrice: retailPrice ? parseFloat(retailPrice) : undefined,
        })
        skuId    = (newSku as any).id
        skuLabel = (newSku as any).internalSku ?? `SKU #${(newSku as any).id}`
    }
  }
  

  const isPending = createGlobal.isPending || createCompany.isPending

  return (
    <div className="border border-accent/20 rounded-xl p-4 space-y-3 bg-accent/5 animate-slide-up">
      <p className="text-xs font-semibold text-accent flex items-center gap-1.5">
        <Package size={12} /> Crear nuevo producto
      </p>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="label">Nombre *</label>
          <input className="input text-xs" value={name} onChange={e => setName(e.target.value)} placeholder="Ej: Nike Air Max" />
        </div>
        <div>
          <label className="label">Marca</label>
          <input className="input text-xs" value={brand} onChange={e => setBrand(e.target.value)} placeholder="Ej: Nike" />
        </div>
        <div>
          <label className="label">UPC / Código de barras</label>
          <input className="input text-xs font-mono" value={upc} onChange={e => setUpc(e.target.value)} placeholder="7501234567890" />
        </div>
        <div>
          <label className="label">Categoría</label>
          <select className="input text-xs" value={catId} onChange={e => setCatId(e.target.value)}>
            <option value="">Sin categoría</option>
            {(categories as any[]).map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Alias local</label>
          <input className="input text-xs" value={alias} onChange={e => setAlias(e.target.value)} placeholder="Nombre en tu empresa" />
        </div>
        <div>
          <label className="label">Precio mayoreo</label>
          <input className="input text-xs font-mono" type="number" step="0.01" value={wholesale} onChange={e => setWholesale(e.target.value)} placeholder="0.00" />
        </div>
        <div>
          <label className="label">Código SKU</label>
          <input className="input text-xs font-mono" value={skuCode} onChange={e => setSkuCode(e.target.value)} placeholder="SKU-001" />
        </div>
        <div>
          <label className="label">Precio retail</label>
          <input className="input text-xs font-mono" type="number" step="0.01" value={retailPrice} onChange={e => setRetailPrice(e.target.value)} placeholder="0.00" />
        </div>
      </div>
      <button
        onClick={handleCreate}
        disabled={!name.trim() || isPending}
        className="btn-primary text-xs w-full justify-center"
      >
        {isPending
          ? <span className="w-3 h-3 rounded-full border-2 border-surface-0/30 border-t-surface-0 animate-spin" />
          : <Plus size={12} />
        }
        Crear y agregar al movimiento
      </button>
    </div>
  )
}

// ── SKU selector ────────────────────────────────────────────────────────────
function SkuSelector({ onAdd }: {
  onAdd: (item: { skuId: number; skuLabel: string; productName: string }) => void
}) {
  const { data: products = [] } = useCompanyProducts()
  const [search,     setSearch]     = useState('')
  const [showCreate, setShowCreate] = useState(false)
  const [expandedId, setExpandedId] = useState<number | null>(null)

  const filtered = useMemo(() =>
    (products as CompanyProduct[]).filter(p => {
      const name = p.localNameAlias ?? p.globalProduct?.name ?? ''
      return name.toLowerCase().includes(search.toLowerCase()) ||
        (p.globalProduct?.brand ?? '').toLowerCase().includes(search.toLowerCase())
    }),
    [products, search]
  )

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
        <input
          className="input pl-8 text-xs"
          placeholder="Buscar producto..."
          value={search}
          onChange={e => { setSearch(e.target.value); setShowCreate(false) }}
        />
      </div>

      <div className="max-h-52 overflow-y-auto rounded-lg border border-surface-4 divide-y divide-surface-4">
        {filtered.length === 0 ? (
          <div className="py-4 text-center space-y-2">
            <p className="text-xs text-ink-muted">Sin resultados</p>
            <button
              onClick={() => setShowCreate(true)}
              className="btn-primary text-xs mx-auto"
            >
              <Plus size={11} /> Crear nuevo producto
            </button>
          </div>
        ) : (
          <>
            {filtered.map((p: CompanyProduct) => (
              <ProductSkuRow
                key={p.id}
                product={p}
                expanded={expandedId === p.id}
                onExpand={() => setExpandedId(expandedId === p.id ? null : p.id)}
                onSelectSku={onAdd}
              />
            ))}
            <button
              onClick={() => setShowCreate(true)}
              className="w-full flex items-center gap-2 px-4 py-3 text-xs text-accent hover:bg-surface-3 transition-colors"
            >
              <Plus size={11} /> Crear nuevo producto
            </button>
          </>
        )}
      </div>

      {showCreate && (
        <CreateProductInline
          onCreated={(item) => { onAdd(item); setShowCreate(false) }}
        />
      )}
    </div>
  )
}

function ProductSkuRow({ product, expanded, onExpand, onSelectSku }: {
  product:     CompanyProduct
  expanded:    boolean
  onExpand:    () => void
  onSelectSku: (item: { skuId: number; skuLabel: string; productName: string }) => void
}) {
  const { data: skus = [] } = useSkus(product.id)
  const nombre = product.localNameAlias ?? product.globalProduct?.name ?? `Producto #${product.id}`

  return (
    <div>
      <button
        onClick={onExpand}
        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-surface-3 transition-colors text-left"
      >
        <Package size={13} className="text-ink-muted shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-ink-primary truncate">{nombre}</p>
          <p className="text-xs text-ink-muted">{product.globalProduct?.brand ?? '—'}</p>
        </div>
        <ChevronRight size={12} className={`text-ink-muted transition-transform ${expanded ? 'rotate-90' : ''}`} />
      </button>
      {expanded && (
        <div className="bg-surface-1 px-4 pb-2 space-y-1">
          {(skus as Sku[]).map(sku => (
            <button
              key={sku.id}
              onClick={() => onSelectSku({
                skuId:       sku.id,
                skuLabel:    sku.internalSku ?? `SKU #${sku.id}`,
                productName: nombre,
              })}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-accent/10 transition-colors group"
            >
              <span className="text-xs font-mono text-ink-secondary group-hover:text-accent">
                {sku.internalSku ?? `SKU #${sku.id}`}
              </span>
              <span className="text-xs text-ink-muted">
                {sku.retailPrice ? formatCurrency(sku.retailPrice) : '—'}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ── New movement modal ──────────────────────────────────────────────────────
function NewMovementModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { selectedWarehouse } = useAppStore()
  const { data: warehouses  = [] } = useWarehouses()
  const createMovement = useCreateMovement()

  const [step,            setStep]            = useState<ModalStep>('type')
  const [movementType,    setMovementType]    = useState<MovementType | null>(null)
  const [details,         setDetails]         = useState<DraftDetail[]>([])
  const [targetWarehouse, setTargetWarehouse] = useState<number | ''>('')
  const [notes,           setNotes]           = useState('')

  const reset = () => {
    setStep('type'); setMovementType(null); setDetails([])
    setTargetWarehouse(''); setNotes('')
  }

  const handleClose = () => { reset(); onClose() }

  const handleSelectType = (t: MovementType) => {
    setMovementType(t)
    setStep('products')
  }

  const handleAddSku = (item: { skuId: number; skuLabel: string; productName: string }) => {
    if (details.some(d => d.skuId === item.skuId)) return
    setDetails(prev => [...prev, { ...item, batchId: null, quantity: 1, unitCost: 0 }])
  }

  const handleRemoveSku = (skuId: number) =>
    setDetails(prev => prev.filter(d => d.skuId !== skuId))

  const handleDetailChange = (skuId: number, field: 'quantity' | 'unitCost', value: number) =>
    setDetails(prev => prev.map(d => d.skuId === skuId ? { ...d, [field]: value } : d))

  const handleSubmit = async () => {
    if (!selectedWarehouse || !movementType || !details.length) return

    const typeIdMap: Record<MovementType, number> = {
      incoming: 1,
      outgoing: 4,
      transfer: 5,
    }

    const payload = {
      warehouseId:       selectedWarehouse.id,
      targetWarehouseId: movementType === 'transfer' ? targetWarehouse || null : null,
      typeId:            typeIdMap[movementType],
      notes:             notes || undefined,
      details: details.map(d => ({
        skuId:    d.skuId,
        batchId:  d.batchId,
        quantity: d.quantity,
        unitCost: d.unitCost,
      })),
    }

    await createMovement.mutateAsync({
      type: movementType === 'transfer' ? 'outgoing' : movementType,
      data: payload,
    })
    handleClose()
  }

  if (!open) return null

  const stepTitles: Record<ModalStep, string> = {
    type:     'Tipo de movimiento',
    products: 'Seleccionar productos',
    details:  'Cantidades y costos',
    confirm:  'Confirmar movimiento',
  }

  const otherWarehouses = (warehouses as any[]).filter(
    w => w.id !== selectedWarehouse?.id
  )

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose} />
      <div className="relative w-full max-w-lg card animate-slide-up max-h-[90vh] flex flex-col">

        {/* Modal header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-surface-4 shrink-0">
          <div>
            <h2 className="font-display font-bold text-base text-ink-primary">
              {stepTitles[step]}
            </h2>
            <div className="flex items-center gap-1 mt-1">
              {(['type', 'products', 'details', 'confirm'] as ModalStep[]).map((s, i) => (
                <div key={s} className={`h-1 rounded-full transition-all ${
                  step === s ? 'w-6 bg-accent' :
                  (['type', 'products', 'details', 'confirm'].indexOf(step) > i)
                    ? 'w-3 bg-accent/40' : 'w-3 bg-surface-5'
                }`} />
              ))}
            </div>
          </div>
          <button onClick={handleClose} className="btn-ghost !px-2 !py-1.5">
            <X size={15} />
          </button>
        </div>

        {/* Modal body */}
        <div className="px-5 py-4 overflow-y-auto flex-1 space-y-4">

          {/* Step 1: type */}
          {step === 'type' && (
            <div className="grid grid-cols-3 gap-3">
              {[
                { type: 'incoming' as MovementType, icon: ArrowDownCircle, label: 'Entrada',  desc: 'Recepción de mercancía',  color: 'text-accent' },
                { type: 'outgoing' as MovementType, icon: ArrowUpCircle,   label: 'Salida',   desc: 'Retiro o ajuste negativo', color: 'text-red-400' },
                { type: 'transfer' as MovementType, icon: ArrowLeftRight,  label: 'Traslado', desc: 'Mover a otro warehouse',   color: 'text-blue-400' },
              ].map(opt => (
                <button
                  key={opt.type}
                  onClick={() => handleSelectType(opt.type)}
                  className="card p-4 flex flex-col items-center gap-2 hover:bg-surface-3 transition-colors text-center"
                >
                  <opt.icon size={24} className={opt.color} />
                  <p className="text-sm font-medium text-ink-primary">{opt.label}</p>
                  <p className="text-xs text-ink-muted">{opt.desc}</p>
                </button>
              ))}
            </div>
          )}

          {/* Step 2: products */}
          {step === 'products' && (
            <div className="space-y-4">
              <SkuSelector onAdd={handleAddSku} />

              {details.length > 0 && (
                <div>
                  <p className="text-xs text-ink-muted mb-2">Productos seleccionados:</p>
                  <div className="space-y-1.5">
                    {details.map(d => (
                      <div key={d.skuId} className="flex items-center gap-2 bg-surface-3 rounded-lg px-3 py-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-ink-primary truncate">{d.productName}</p>
                          <p className="text-xs font-mono text-ink-muted">{d.skuLabel}</p>
                        </div>
                        <button
                          onClick={() => handleRemoveSku(d.skuId)}
                          className="text-ink-muted hover:text-red-400 transition-colors p-1"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {movementType === 'transfer' && (
                <div>
                  <label className="label">Warehouse destino</label>
                  <select
                    className="input text-xs"
                    value={targetWarehouse}
                    onChange={e => setTargetWarehouse(Number(e.target.value))}
                  >
                    <option value="">Seleccionar...</option>
                    {otherWarehouses.map((w: any) => (
                      <option key={w.id} value={w.id}>{w.name} ({w.totalStock} uds)</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          )}

          {/* Step 3: details */}
          {step === 'details' && (
            <div className="space-y-3">
              {details.map(d => (
                <div key={d.skuId} className="card p-4 space-y-3">
                  <div>
                    <p className="text-xs font-medium text-ink-primary">{d.productName}</p>
                    <p className="text-xs font-mono text-ink-muted">{d.skuLabel}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="label">Cantidad</label>
                      <input
                        className="input text-xs font-mono"
                        type="number" min="1"
                        value={d.quantity}
                        onChange={e => handleDetailChange(d.skuId, 'quantity', parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <div>
                      <label className="label">Costo unitario</label>
                      <input
                        className="input text-xs font-mono"
                        type="number" min="0" step="0.01"
                        value={d.unitCost}
                        onChange={e => handleDetailChange(d.skuId, 'unitCost', parseFloat(e.target.value) || 0)}
                      />
                    </div>
                  </div>
                </div>
              ))}
              <div>
                <label className="label">Notas (opcional)</label>
                <textarea
                  className="input text-xs resize-none"
                  rows={2}
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Observaciones del movimiento..."
                />
              </div>
            </div>
          )}

          {/* Step 4: confirm */}
          {step === 'confirm' && (
            <div className="space-y-4">
              <div className="bg-surface-3 rounded-xl p-4 space-y-3">
                <div className="flex justify-between text-xs">
                  <span className="text-ink-muted">Tipo</span>
                  <MovementBadge typeId={movementType === 'incoming' ? 1 : movementType === 'outgoing' ? 4 : 5} />
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-ink-muted">Warehouse</span>
                  <span className="text-ink-secondary">{selectedWarehouse?.name}</span>
                </div>
                {movementType === 'transfer' && targetWarehouse && (
                  <div className="flex justify-between text-xs">
                    <span className="text-ink-muted">Destino</span>
                    <span className="text-ink-secondary">
                      {(warehouses as any[]).find(w => w.id === targetWarehouse)?.name}
                    </span>
                  </div>
                )}
                {notes && (
                  <div className="flex justify-between text-xs">
                    <span className="text-ink-muted">Notas</span>
                    <span className="text-ink-secondary">{notes}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                {details.map(d => (
                  <div key={d.skuId} className="flex items-center justify-between bg-surface-3 rounded-lg px-4 py-3">
                    <div>
                      <p className="text-xs font-medium text-ink-primary">{d.productName}</p>
                      <p className="text-xs font-mono text-ink-muted">{d.skuLabel}</p>
                    </div>
                    <div className="text-right text-xs">
                      <p className="text-ink-secondary">{d.quantity} uds × {formatCurrency(d.unitCost)}</p>
                      <p className="font-mono font-medium text-accent">{formatCurrency(d.quantity * d.unitCost)}</p>
                    </div>
                  </div>
                ))}
                <div className="flex justify-end pt-1 text-xs text-ink-muted">
                  Total: <span className="font-mono font-bold text-ink-primary ml-1">
                    {formatCurrency(details.reduce((a, d) => a + d.quantity * d.unitCost, 0))}
                  </span>
                </div>
              </div>

              {details.some(d => d.unitCost === 0) && (
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-yellow-500/10 text-yellow-400 text-xs">
                  <AlertCircle size={13} />
                  Algunos ítems tienen costo 0. Verifica antes de confirmar.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal footer */}
        <div className="px-5 py-4 border-t border-surface-4 flex justify-between shrink-0">
          <button
            onClick={() => {
              if (step === 'type')     handleClose()
              if (step === 'products') setStep('type')
              if (step === 'details')  setStep('products')
              if (step === 'confirm')  setStep('details')
            }}
            className="btn-ghost text-sm"
          >
            {step === 'type' ? 'Cancelar' : 'Atrás'}
          </button>
          <button
            onClick={() => {
              if (step === 'products' && details.length > 0) setStep('details')
              if (step === 'details'  && details.length > 0) setStep('confirm')
              if (step === 'confirm') handleSubmit()
            }}
            disabled={
              (step === 'products' && details.length === 0) ||
              (step === 'products' && movementType === 'transfer' && !targetWarehouse) ||
              (step === 'confirm'  && createMovement.isPending)
            }
            className="btn-primary text-sm"
          >
            {step === 'confirm'
              ? createMovement.isPending
                ? <span className="w-3 h-3 rounded-full border-2 border-surface-0/30 border-t-surface-0 animate-spin" />
                : 'Confirmar'
              : 'Siguiente'
            }
          </button>
        </div>

      </div>
    </div>
  )
}

// ── Main page ───────────────────────────────────────────────────────────────
export default function MovementsPage() {
  const { selectedWarehouse } = useAppStore()
  const { data: movements = [], isLoading } = useMovements()
  const [filter,     setFilter]     = useState<MovementCategory>('all')
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [modalOpen,  setModalOpen]  = useState(false)

  const filtered = useMemo(() => {
    const list = movements as Movement[]
    if (filter === 'all')      return list
    if (filter === 'incoming') return list.filter(m => [1, 3, 6].includes(m.typeId))
    if (filter === 'outgoing') return list.filter(m => [2, 4].includes(m.typeId))
    if (filter === 'transfer') return list.filter(m => [5, 6].includes(m.typeId))
    return list
  }, [movements, filter])

  const sorted = useMemo(() =>
    [...filtered].sort((a, b) =>
      new Date(b.movementDate).getTime() - new Date(a.movementDate).getTime()
    ),
    [filtered]
  )

  const filters: { key: MovementCategory; label: string }[] = [
    { key: 'all',      label: 'Todos' },
    { key: 'incoming', label: 'Entradas' },
    { key: 'outgoing', label: 'Salidas' },
    { key: 'transfer', label: 'Traspasos' },
  ]

  return (
    <div className="animate-fade-in">

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-surface-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink-primary">Movimientos</h1>
          <p className="text-xs text-ink-muted mt-0.5">{selectedWarehouse?.name}</p>
        </div>
        <button onClick={() => setModalOpen(true)} className="btn-primary text-sm">
          <Plus size={13} /> Nuevo movimiento
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-1 px-6 py-3 border-b border-surface-3">
        {filters.map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-3 py-1.5 rounded-lg text-xs transition-colors ${
              filter === f.key
                ? 'bg-accent/10 text-accent font-medium'
                : 'text-ink-secondary hover:bg-surface-3'
            }`}
          >
            {f.label}
          </button>
        ))}
        <span className="ml-auto text-xs text-ink-muted">{sorted.length} registros</span>
      </div>

      {/* Table */}
      <div className="mx-6 mt-4 card overflow-hidden">
        <div className="grid grid-cols-5 px-6 py-3 border-b border-surface-4">
          {['Tipo', 'Fecha', 'Warehouse', 'Ítems', 'Notas'].map(h => (
            <span key={h} className="text-xs font-semibold uppercase tracking-wider text-ink-muted">{h}</span>
          ))}
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16 text-sm text-ink-muted">Cargando movimientos…</div>
        ) : sorted.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-2">
            <ArrowLeftRight size={28} className="text-ink-muted" />
            <p className="text-sm text-ink-muted">Sin movimientos registrados</p>
          </div>
        ) : (
          <div className="divide-y divide-surface-3">
            {sorted.map((m: Movement) => {
              const isExpanded = expandedId === m.id
              return (
                <div key={m.id}>
                  <div
                    className="grid grid-cols-5 items-center px-6 py-4 hover:bg-surface-2/50 transition-colors cursor-pointer"
                    onClick={() => setExpandedId(isExpanded ? null : m.id)}
                  >
                    <MovementBadge typeId={m.typeId} />
                    <span className="text-xs text-ink-secondary">{formatDate(m.movementDate)}</span>
                    <span className="text-xs text-ink-secondary">{selectedWarehouse?.name}</span>
                    <span className="text-xs text-ink-secondary">{m.details?.length ?? 0} ítem(s)</span>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-ink-muted truncate max-w-[120px]">
                        {m.notes ?? '—'}
                      </span>
                      <ChevronRight
                        size={13}
                        className={`text-ink-muted transition-transform duration-200 shrink-0 ${isExpanded ? 'rotate-90' : ''}`}
                      />
                    </div>
                  </div>
                  {isExpanded && <MovementExpanded movement={m} />}
                </div>
              )
            })}
          </div>
        )}
      </div>

      <NewMovementModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  )
}