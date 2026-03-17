import ModuleDashboard from '../../../layouts/ModuleDashboard'

const cards = [
  { label: 'Órdenes',    path: '/pdv/orders' },
  { label: 'Mesas',      path: '/pdv/tables' },
  { label: 'Menús',      path: '/pdv/menus' },
  { label: 'Estaciones', path: '/pdv/stations' },
]

export default function PdvDashboard() {
  return <ModuleDashboard moduleLabel="Punto de Venta" cards={cards} />
}
