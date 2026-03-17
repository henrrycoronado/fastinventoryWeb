import ModuleDashboard from '../../../layouts/ModuleDashboard'

const cards = [
  { label: 'Ventas',      path: '/sales/list' },
  { label: 'Recibos',     path: '/sales/receipts' },
  { label: 'Clientes',    path: '/sales/customers' },
  { label: 'Vendedores',  path: '/sales/sellers' },
]

export default function SalesDashboard() {
  return <ModuleDashboard moduleLabel="Ventas" cards={cards} />
}