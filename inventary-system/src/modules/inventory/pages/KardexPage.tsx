import { useState } from 'react'
import { useAppStore } from '../../../store/useAppStore'
import type { Sku } from '../services/types'
import SectionHeader from '../../../components/SectionHeader'
import { ProductSkuSelector, KardexTable } from '../components/KardexViews'

export default function KardexPage() {
  const { selectedWarehouse } = useAppStore()
  const [selectedSku, setSelectedSku] = useState<(Sku & { productName: string }) | null>(null)

  return (
    <div className="animate-fade-in">
      <SectionHeader 
        title="Kardex" 
        subtitle={selectedWarehouse?.name} 
        right={selectedSku && <button onClick={() => setSelectedSku(null)} className="btn-ghost text-xs">← Cambiar SKU</button>} 
      />
      <div className="px-6 mt-4">
        {!selectedSku ? (
          <div className="card overflow-hidden">
            <div className="px-5 py-4 border-b border-surface-4">
              <p className="text-xs text-ink-muted">Selecciona un producto y luego un SKU para ver su historial</p>
            </div>
            <div className="p-4">
              <ProductSkuSelector onSelect={setSelectedSku} />
            </div>
          </div>
        ) : (
          <KardexTable 
            skuId={selectedSku.id} 
            productName={selectedSku.productName} 
            skuLabel={selectedSku.internalSku ?? `SKU #${selectedSku.id}`} 
          />
        )}
      </div>
    </div>
  )
}