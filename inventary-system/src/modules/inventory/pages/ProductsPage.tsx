import { useState } from 'react'
import { Search, Package, ChevronRight, Trash2, Tag, Warehouse } from 'lucide-react'
import {
  useCompanyProducts,
  useGlobalProducts, useSkus, useSkuAttributes,
} from '../services/inventoryHooks'
import { useWarehouses } from '../services/inventoryHooks'
import { inventoryApi } from '../services/inventoryApi'
import { useQuery } from '@tanstack/react-query'
import { useAppStore } from '../../../store/useAppStore'
import { formatCurrency } from '../../../lib/utils'
import type { CompanyProduct, GlobalProduct, Sku } from '../services/types'

// ---- helpers ----
function Badge({ children, variant = 'gray' }: { children: React.ReactNode; variant?: 'green' | 'gray' | 'yellow' }) {
  const styles = {
    green:  'bg-accent/10 text-accent',
    gray:   'bg-surface-4 text-ink-muted',
    yellow: 'bg-yellow-500/10 text-yellow-400',
  }
  return <span className={`badge ${styles[variant]}`}>{children}</span>
}

function SectionHeader({ title, subtitle, right }: { title: string; subtitle?: string; right?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between px-6 py-5 border-b border-surface-3">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink-primary">{title}</h1>
        {subtitle && <p className="text-xs text-ink-muted mt-0.5">{subtitle}</p>}
      </div>
      {right}
    </div>
  )
}

// ---- SKU row expandible ----
function SkuRow({ sku }: { sku: Sku }) {
  const { data: attrs = [] } = useSkuAttributes(sku.id)
  return (
    <div className="flex items-start gap-3 py-2 px-3 rounded-lg bg-surface-3">
      <div className="flex-1 min-w-0">
        <p className="text-xs font-mono text-accent">{sku.internalSku ?? `SKU #${sku.id}`}</p>
        <p className="text-xs text-ink-muted mt-0.5">
          Retail: {sku.retailPrice ? formatCurrency(sku.retailPrice) : '—'}
        </p>
        {attrs.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1.5">
            {attrs.map((a: any) => (
              <span key={a.id} className="text-[10px] px-1.5 py-0.5 rounded bg-surface-4 text-ink-secondary">
                {a.attribute?.name}: {a.value}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ---- Expanded company product ----
function CompanyProductExpanded({ product }: { product: CompanyProduct }) {
  const companyId   = useAppStore(s => s.selectedCompany?.id)
  const warehouseId = useAppStore(s => s.selectedWarehouse?.id)
  const { data: skus       = [] } = useSkus(product.id)
  const { data: warehouses = [] } = useWarehouses()

  const { data: stockList = [] } = useQuery({
    queryKey: ['stock-all-warehouses', companyId, product.id],
    queryFn: async () => {
      const results = await Promise.all(
        warehouses.map((w: any) =>
          inventoryApi.stock.list(w.id).then((stocks: any[]) =>
            stocks
              .filter((s: any) => skus.some((sk: Sku) => sk.id === s.skuId))
              .map((s: any) => ({ ...s, warehouseName: w.name, warehouseId: w.id }))
          )
        )
      )
      return results.flat()
    },
    enabled: warehouses.length > 0 && skus.length > 0,
  })

  const warehouseStock = warehouses.map((w: any) => ({
    ...w,
    available: stockList
      .filter((s: any) => s.warehouseId === w.id)
      .reduce((acc: number, s: any) => acc + s.availableQuantity, 0),
  }))

  return (
    <div className="px-6 py-4 bg-surface-1/60 border-t border-surface-3 animate-slide-up space-y-4">

      {/* SKUs */}
      <div>
        <p className="text-[10px] uppercase tracking-widest text-ink-muted font-semibold mb-2 flex items-center gap-1.5">
          <Tag size={10} /> SKUs
        </p>
        {skus.length === 0 ? (
          <p className="text-xs text-ink-muted">Sin SKUs registrados</p>
        ) : (
          <div className="space-y-1.5">
            {skus.map((sku: Sku) => <SkuRow key={sku.id} sku={sku} />)}
          </div>
        )}
      </div>

      {/* Stock por warehouse */}
      <div>
        <p className="text-[10px] uppercase tracking-widest text-ink-muted font-semibold mb-2 flex items-center gap-1.5">
          <Warehouse size={10} /> Disponibilidad por sucursal
        </p>
        <div className="flex flex-wrap gap-2">
          {warehouseStock.map((w: any) => (
            <div key={w.id} className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs ${
              w.id === warehouseId ? 'bg-accent/10 border border-accent/20' : 'bg-surface-3'
            }`}>
              <span className={w.id === warehouseId ? 'text-accent font-medium' : 'text-ink-secondary'}>
                {w.name}
              </span>
              <span className={`font-mono font-medium ${w.available > 0 ? 'text-accent' : 'text-red-400'}`}>
                {w.available} uds
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}

// ---- Vista Mi Empresa ----
function MyCompanyView({ search }: { search: string }) {
  const { data: products = [], isLoading } = useCompanyProducts()
  const [expandedId, setExpandedId] = useState<number | null>(null)

  const filtered = (products as CompanyProduct[]).filter(p => {
    const name = p.localNameAlias ?? p.globalProduct?.name ?? ''
    return name.toLowerCase().includes(search.toLowerCase()) ||
      (p.globalProduct?.brand ?? '').toLowerCase().includes(search.toLowerCase())
  })

  if (isLoading) return (
    <div className="flex justify-center py-16 text-ink-muted text-sm">Cargando productos…</div>
  )

  if (filtered.length === 0) return (
    <div className="flex flex-col items-center justify-center py-16 gap-2">
      <Package size={28} className="text-ink-muted" />
      <p className="text-sm text-ink-muted">Sin productos en el catálogo</p>
      <p className="text-xs text-ink-muted">Agrega productos desde Movimientos → Entrada</p>
    </div>
  )

  return (
    <div className="divide-y divide-surface-3">
      {filtered.map((p: CompanyProduct) => (
        <div key={p.id}>
          <div
            className="flex items-center gap-4 px-6 py-4 hover:bg-surface-2/50 transition-colors cursor-pointer"
            onClick={() => setExpandedId(expandedId === p.id ? null : p.id)}
          >
            <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
              <Package size={14} className="text-accent" />
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-ink-primary truncate">
                {p.localNameAlias ?? p.globalProduct?.name ?? `Producto #${p.id}`}
              </p>
              <p className="text-xs text-ink-muted">
                {p.globalProduct?.brand ?? '—'} · {p.globalProduct?.category?.name ?? 'Sin categoría'}
              </p>
            </div>

            <div className="hidden md:flex items-center gap-6 text-xs text-ink-muted">
              <span>{p.skus?.length ?? 0} SKUs</span>
              <span className="font-mono text-ink-secondary">
                {p.wholesalePrice ? formatCurrency(p.wholesalePrice) : '—'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <ChevronRight
                size={14}
                className={`text-ink-muted transition-transform duration-200 ${expandedId === p.id ? 'rotate-90' : ''}`}
              />
            </div>
          </div>

          {expandedId === p.id && <CompanyProductExpanded product={p} />}
        </div>
      ))}
    </div>
  )
}

// ---- Vista Global ----
function GlobalView({ search }: { search: string }) {
  const { data: globalProducts = [], isLoading } = useGlobalProducts()

  const filtered = (globalProducts as GlobalProduct[]).filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.brand ?? '').toLowerCase().includes(search.toLowerCase()) ||
    (p.upcBarcode ?? '').includes(search)
  )

  if (isLoading) return (
    <div className="flex justify-center py-16 text-ink-muted text-sm">Cargando catálogo global…</div>
  )

  if (filtered.length === 0) return (
    <div className="flex flex-col items-center justify-center py-16 gap-2">
      <Package size={28} className="text-ink-muted" />
      <p className="text-sm text-ink-muted">Sin resultados</p>
    </div>
  )

  return (
    <div className="divide-y divide-surface-3">
      {filtered.map((p: GlobalProduct) => (
        <div key={p.id} className="flex items-center gap-4 px-6 py-4">
          <div className="w-8 h-8 rounded-lg bg-surface-4 flex items-center justify-center shrink-0">
            <Package size={14} className="text-ink-muted" />
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-ink-primary truncate">{p.name}</p>
            <p className="text-xs text-ink-muted">
              {p.brand ?? '—'} · {p.category?.name ?? 'Sin categoría'}
            </p>
          </div>

          <div className="hidden md:flex items-center gap-4 text-xs text-ink-muted">
            <span className="font-mono">{p.upcBarcode ?? 'Sin UPC'}</span>
          </div>

          <div>
            {p.referencedByCompany
              ? <Badge variant="green">En mi catálogo</Badge>
              : <Badge variant="gray">No referenciado</Badge>
            }
          </div>
        </div>
      ))}
    </div>
  )
}

// ---- Page ----
export default function ProductsPage() {
  const [view, setView]     = useState<'company' | 'global'>('company')
  const [search, setSearch] = useState('')
  const { data: products = [] }       = useCompanyProducts()
  const { data: globalProducts = [] } = useGlobalProducts()

  return (
    <div className="animate-fade-in">
      <SectionHeader
        title="Productos"
        subtitle={view === 'company'
          ? `${(products as any[]).length} productos en tu catálogo`
          : `${(globalProducts as any[]).length} productos en catálogo global`
        }
        right={
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
              <input
                className="input pl-8 w-52 text-xs"
                placeholder="Buscar..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <div className="flex rounded-lg border border-surface-4 overflow-hidden text-xs">
              <button
                onClick={() => setView('company')}
                className={`px-3 py-2 transition-colors ${view === 'company' ? 'bg-accent/10 text-accent font-medium' : 'text-ink-secondary hover:bg-surface-3'}`}
              >
                Mi empresa
              </button>
              <button
                onClick={() => setView('global')}
                className={`px-3 py-2 transition-colors ${view === 'global' ? 'bg-accent/10 text-accent font-medium' : 'text-ink-secondary hover:bg-surface-3'}`}
              >
                Catálogo global
              </button>
            </div>
          </div>
        }
      />

      <div className="mx-6 mt-4 card overflow-hidden">
        {view === 'company'
          ? <MyCompanyView search={search} />
          : <GlobalView search={search} />
        }
      </div>
    </div>
  )
}