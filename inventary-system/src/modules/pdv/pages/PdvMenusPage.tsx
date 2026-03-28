import { useMemo, useState } from 'react'
import { ChefHat, Plus, Search, Trash2, Package } from 'lucide-react'
import ConfirmModal from '../../../atoms/ConfirmModal'
import SectionHeader from '../../../components/SectionHeader'
import SkuSelector from '../../../components/SkuSelector'
import {
  useCreatePdvMenu,
  useCreatePdvMenuItem,
  useDeletePdvMenu,
  useDeletePdvMenuItem,
  usePdvMenuItems,
  usePdvMenus,
  usePdvStations,
} from '../services/pdvHooks'
import type { PdvMenu } from '../services/types'

export default function PdvMenusPage() {
  const { data: menus = [], isLoading } = usePdvMenus()
  const { data: stations = [] } = usePdvStations()
  const createMenu = useCreatePdvMenu()
  const deleteMenu = useDeletePdvMenu()
  const createMenuItem = useCreatePdvMenuItem()
  const deleteMenuItem = useDeletePdvMenuItem()

  const [search, setSearch] = useState('')
  const [name, setName] = useState('')
  const [selectedMenuId, setSelectedMenuId] = useState<number | ''>('')
  const [selectedStationId, setSelectedStationId] = useState<number | ''>('')
  const [selectedSku, setSelectedSku] = useState<{ skuId: number; skuLabel: string; productName: string } | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<PdvMenu | null>(null)

  const { data: menuItems = [] } = usePdvMenuItems(selectedMenuId ? Number(selectedMenuId) : null)

  const filtered = useMemo(
    () =>
      (menus as PdvMenu[]).filter(menu =>
        menu.name.toLowerCase().includes(search.toLowerCase())
      ),
    [menus, search]
  )

  const handleCreate = async () => {
    if (!name.trim()) return
    await createMenu.mutateAsync({ name: name.trim() })
    setName('')
  }

  const handleAddItem = async () => {
    if (!selectedMenuId || !selectedSku) return

    await createMenuItem.mutateAsync({
      menuId: Number(selectedMenuId),
      data: {
        skuId: selectedSku.skuId,
        stationId: selectedStationId ? Number(selectedStationId) : null,
      },
    })

    setSelectedSku(null)
  }

  return (
    <div className="animate-fade-in">
      <SectionHeader
        title="Menús"
        subtitle={`${(menus as PdvMenu[]).length} registrados`}
        right={
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
            <input
              className="input pl-8 w-52 text-xs"
              placeholder="Buscar menú..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        }
      />

      <div className="mx-6 mt-4 card p-4 mb-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input
            className="input text-sm md:col-span-2"
            placeholder="Nombre del menú"
            value={name}
            onChange={e => setName(e.target.value)}
          />
          <button
            onClick={handleCreate}
            disabled={!name.trim() || createMenu.isPending}
            className="btn-primary text-sm justify-center"
          >
            {createMenu.isPending ? (
              <span className="w-3 h-3 rounded-full border-2 border-surface-0/30 border-t-surface-0 animate-spin" />
            ) : (
              <Plus size={13} />
            )}
            Nuevo menú
          </button>
        </div>
      </div>

      <div className="mx-6 mb-8 card overflow-hidden">
        <div className="grid grid-cols-2 px-6 py-3 border-b border-surface-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted">Menú</span>
          <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted text-right">Acciones</span>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16 text-sm text-ink-muted">Cargando menús…</div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-2">
            <ChefHat size={28} className="text-ink-muted" />
            <p className="text-sm text-ink-muted">Sin menús registrados</p>
          </div>
        ) : (
          <div className="divide-y divide-surface-3">
            {filtered.map(menu => (
              <div key={menu.id} className="grid grid-cols-2 items-center px-6 py-4 hover:bg-surface-2/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                    <ChefHat size={14} className="text-accent" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-ink-primary">{menu.name}</p>
                    <p className="text-xs text-ink-muted">ID #{menu.id}</p>
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={() => setDeleteTarget(menu)}
                    className="p-1.5 text-ink-muted hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                    title="Eliminar menú"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mx-6 mb-8 card overflow-hidden">
        <div className="px-6 py-4 border-b border-surface-4">
          <h2 className="font-display font-bold text-ink-primary">Ítems de Menú</h2>
          <p className="text-xs text-ink-muted mt-1">Configura qué SKUs están disponibles en cada menú</p>
        </div>

        <div className="p-5 border-b border-surface-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <select
              className="input text-sm"
              value={selectedMenuId}
              onChange={e => setSelectedMenuId(Number(e.target.value) || '')}
            >
              <option value="">Seleccionar menú</option>
              {(menus as PdvMenu[]).map(menu => (
                <option key={menu.id} value={menu.id}>{menu.name}</option>
              ))}
            </select>

            <select
              className="input text-sm"
              value={selectedStationId}
              onChange={e => setSelectedStationId(Number(e.target.value) || '')}
            >
              <option value="">Estación (opcional)</option>
              {(stations as Array<{ id: number; name: string }>).map(station => (
                <option key={station.id} value={station.id}>{station.name}</option>
              ))}
            </select>

            <button
              onClick={handleAddItem}
              disabled={!selectedMenuId || !selectedSku || createMenuItem.isPending}
              className="btn-primary text-sm justify-center"
            >
              {createMenuItem.isPending ? (
                <span className="w-3 h-3 rounded-full border-2 border-surface-0/30 border-t-surface-0 animate-spin" />
              ) : (
                <Plus size={13} />
              )}
              Agregar al menú
            </button>
          </div>

          <SkuSelector
            allowCreate={false}
            onAdd={(item) => setSelectedSku(item)}
          />

          {selectedSku && (
            <div className="px-3 py-2 rounded-lg bg-surface-3 border border-surface-4 text-xs text-ink-secondary">
              Seleccionado: <span className="text-ink-primary font-medium">{selectedSku.productName}</span> · {selectedSku.skuLabel}
            </div>
          )}
        </div>

        <div className="divide-y divide-surface-3">
          {!selectedMenuId ? (
            <div className="py-10 text-center text-sm text-ink-muted">Selecciona un menú para ver sus ítems</div>
          ) : (menuItems as Array<{ id: number; skuId: number; stationId?: number | null }>).length === 0 ? (
            <div className="py-10 text-center text-sm text-ink-muted">Este menú aún no tiene ítems</div>
          ) : (
            (menuItems as Array<{ id: number; skuId: number; stationId?: number | null }>).map(item => {
              const station = (stations as Array<{ id: number; name: string }>).find(s => s.id === item.stationId)
              return (
                <div key={item.id} className="flex items-center justify-between px-6 py-4 hover:bg-surface-2/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                      <Package size={14} className="text-accent" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-ink-primary">SKU #{item.skuId}</p>
                      <p className="text-xs text-ink-muted">Estación: {station?.name ?? 'Sin asignar'}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => deleteMenuItem.mutate({ menuId: Number(selectedMenuId), id: item.id })}
                    className="p-1.5 text-ink-muted hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                    title="Eliminar ítem"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              )
            })
          )}
        </div>
      </div>

      <ConfirmModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) deleteMenu.mutate(deleteTarget.id)
          setDeleteTarget(null)
        }}
        title="Eliminar menú"
        description={`¿Seguro que quieres eliminar el menú "${deleteTarget?.name}"?`}
        confirmLabel="Eliminar"
        variant="danger"
      />
    </div>
  )
}
