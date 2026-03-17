import ModuleDashboard from '../../../layouts/ModuleDashboard'

const cards = [
  { label: 'Productos',   path: '/inventory/products' },
  { label: 'Stock',       path: '/inventory/stock' },
  { label: 'Movimientos', path: '/inventory/movements' },
]

export default function InventoryDashboard() {
  return <ModuleDashboard moduleLabel="Inventario" cards={cards} />
}