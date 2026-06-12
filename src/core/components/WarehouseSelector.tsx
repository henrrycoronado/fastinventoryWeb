import { Warehouse, ChevronDown, Check } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { useAppStore } from '../store/useAppStore'
import { useWarehouses } from '../../modules/inventory/services'
import type { Warehouse as WarehouseType } from '../../modules/inventory/types'

export default function WarehouseSelector() {
  const { selectedWarehouse, setWarehouse } = useAppStore()
  const { data: warehouses = [] } = useWarehouses()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-surface-3 hover:bg-surface-4 transition-colors group"
      >
        <div className="flex items-center gap-2 min-w-0">
          <Warehouse size={12} className="text-accent shrink-0" />
          <span className="text-xs text-ink-secondary truncate">
            {selectedWarehouse?.name || 'Todos los almacenes'}
          </span>
        </div>
        <ChevronDown 
          size={12} 
          className={`text-ink-muted transition-transform group-hover:text-ink-primary ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 card py-1 z-30 animate-slide-up shadow-xl border-accent/10">
          <button
            onClick={() => {
              setWarehouse(null)
              setIsOpen(false)
            }}
            className="w-full flex items-center justify-between px-3 py-2 text-xs text-ink-secondary hover:text-ink-primary hover:bg-surface-3 transition-colors"
          >
            <span>Consolidado (Todos)</span>
            {!selectedWarehouse && <Check size={10} className="text-accent" />}
          </button>
          <div className="h-px bg-surface-4 my-1 mx-2" />
          {warehouses.map((w: WarehouseType) => (
            <button
              key={w.warehouseCen}
              onClick={() => {
                setWarehouse(w)
                setIsOpen(false)
              }}
              className="w-full flex items-center justify-between px-3 py-2 text-xs text-ink-secondary hover:text-ink-primary hover:bg-surface-3 transition-colors"
            >
              <span className="truncate">{w.name}</span>
              {selectedWarehouse?.warehouseCen === w.warehouseCen && (
                <Check size={10} className="text-accent" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
