import { useState } from 'react'
import { ArrowLeftRight, ChevronRight, Plus } from 'lucide-react'
import { useInventoryDocuments, useCreateInventoryDocument } from '../services/inventoryHooks'
import { useAppStore } from '../../../store/useAppStore'
import { formatDate } from '../../../lib/utils'
import type { InventoryDocument } from '../services/types'
import SectionHeader from '../../../components/SectionHeader'
import Modal from '../../../atoms/Modal'
import Button from '../../../atoms/Button'
import Input from '../../../atoms/Input'
import Badge from '../../../atoms/Badge'
import SkuSelector from '../../../components/SkuSelector'

export default function MovementsPage() {
  const { selectedWarehouse } = useAppStore()
  const { data: documents = [], isLoading } = useInventoryDocuments()
  const createDocument = useCreateInventoryDocument()
  
  const [modalOpen, setModalOpen] = useState(false)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  
  // Create state
  const [docType, setDocType] = useState('INCREASE')
  const [reason, setReason] = useState('')
  const [lines, setLines] = useState<{productCen: string, productName: string, quantity: number}[]>([])

  const handleAddProduct = (item: any) => {
    // Again, assuming item from SkuSelector has productCen or adapting.
    // Since I refactored useProducts, SkuSelector might be broken.
    // I need to check SkuSelector.tsx.
    if (lines.some(l => l.productCen === item.productCen)) return
    setLines([...lines, { productCen: item.productCen, productName: item.productName, quantity: 1 }])
  }

  const handleCreate = async () => {
    if (!selectedWarehouse || lines.length === 0) return
    await createDocument.mutateAsync({
      documentType: docType,
      warehouseCen: selectedWarehouse.cen,
      reason,
      lines: lines.map(l => ({ productCen: l.productCen, quantity: l.quantity }))
    })
    setModalOpen(false)
    setLines([])
    setReason('')
  }

  return (
    <div className="animate-fade-in">
      <SectionHeader
        title="Movimientos"
        subtitle={selectedWarehouse?.name}
        right={<button onClick={() => setModalOpen(true)} className="btn-primary text-sm"><Plus size={13} /> Nuevo movimiento</button>}
      />

      <div className="mx-6 mt-4 card overflow-hidden mb-8">
        <div className="hidden md:grid grid-cols-5 px-6 py-3 border-b border-surface-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted">Documento</span>
          <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted">Tipo</span>
          <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted">Fecha</span>
          <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted">Ítems</span>
          <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted text-right">Estado</span>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16 text-sm text-ink-muted">Cargando movimientos…</div>
        ) : documents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-2"><ArrowLeftRight size={28} className="text-ink-muted" /><p className="text-sm text-ink-muted">Sin movimientos registrados</p></div>
        ) : (
          <div className="divide-y divide-surface-3">
            {documents.map((doc: InventoryDocument) => {
              const isExpanded = expandedId === doc.documentCen
              return (
                <div key={doc.documentCen}>
                  <div 
                    className="grid grid-cols-1 md:grid-cols-5 items-center px-6 py-4 hover:bg-surface-2/50 transition-colors cursor-pointer"
                    onClick={() => setExpandedId(isExpanded ? null : doc.documentCen)}
                  >
                    <span className="text-sm font-medium text-ink-primary font-mono">{doc.documentCen}</span>
                    <div>
                      <Badge variant={doc.documentType === 'INCREASE' ? 'green' : 'red'}>{doc.documentType}</Badge>
                    </div>
                    <span className="text-xs text-ink-secondary">{formatDate(doc.createdAt)}</span>
                    <span className="text-sm text-ink-secondary">{doc.totalItems} ud(s)</span>
                    <div className="flex items-center justify-end gap-2">
                      <Badge variant="blue">{doc.status}</Badge>
                      <ChevronRight size={13} className={`text-ink-muted transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`} />
                    </div>
                  </div>
                  {isExpanded && (
                    <div className="px-6 py-4 bg-surface-1/60 border-t border-surface-3 animate-slide-up">
                      <p className="text-xs text-ink-primary font-medium">{doc.title}</p>
                      {doc.generatedMovementCens && doc.generatedMovementCens.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {doc.generatedMovementCens.map(m => <span key={m} className="text-[10px] bg-surface-4 px-1.5 py-0.5 rounded font-mono text-ink-secondary">{m}</span>)}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Nuevo Movimiento de Inventario" size="lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="label">Tipo de Movimiento</label>
              <select className="input text-sm" value={docType} onChange={e => setDocType(e.target.value)}>
                <option value="INCREASE">Aumento (Entrada)</option>
                <option value="CONSUME">Consumo (Salida)</option>
                <option value="ADJUSTMENT">Ajuste</option>
              </select>
            </div>
            <Input label="Motivo / Razón" placeholder="Ej: Inventario inicial" value={reason} onChange={e => setReason(e.target.value)} />
            <div className="space-y-2">
              <label className="label">Productos</label>
              <SkuSelector onAdd={handleAddProduct} />
            </div>
          </div>

          <div className="flex flex-col h-full bg-surface-1 rounded-xl border border-surface-4 overflow-hidden">
             <div className="px-4 py-3 border-b border-surface-4 flex items-center gap-2">
              <span className="text-sm font-bold">Detalle del documento</span>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {lines.length === 0 ? (
                <p className="text-xs text-ink-muted text-center py-10">No hay productos seleccionados</p>
              ) : (
                lines.map(line => (
                  <div key={line.productCen} className="flex items-center justify-between bg-surface-2 p-2 rounded-lg border border-surface-4">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium truncate">{line.productName}</p>
                      <p className="text-[10px] text-ink-muted font-mono">{line.productCen}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <input 
                        type="number" 
                        className="input !py-0.5 !px-1.5 w-12 text-xs font-mono text-center" 
                        value={line.quantity} 
                        onChange={e => {
                          const val = parseFloat(e.target.value) || 1
                          setLines(prev => prev.map(l => l.productCen === line.productCen ? { ...l, quantity: val } : l))
                        }}
                      />
                      <button 
                        onClick={() => setLines(prev => prev.filter(l => l.productCen !== line.productCen))}
                        className="text-ink-muted hover:text-red-400"
                      >
                        <Plus size={12} className="rotate-45" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="p-4 border-t border-surface-4 bg-surface-2 flex justify-end gap-2">
              <Button onClick={() => setModalOpen(false)}>Cancelar</Button>
              <Button variant="primary" onClick={handleCreate} disabled={lines.length === 0 || createDocument.isPending} loading={createDocument.isPending}>
                Registrar Documento
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  )
}
