import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { useAppStore } from './store/useAppStore'
import ProtectedRoute from './router/ProtectedRoute'
import PublicRoute from './router/PublicRoute'
import AppLayout from './layouts/AppLayout'
import CompanySelect from './pages/CompanySelect'
import WarehouseSelect from './pages/WarehouseSelect'
import NotFound from './pages/NotFound'
import InventoryDashboard from './modules/inventory/pages/InventoryDashboard'
import SalesDashboard from './modules/sales/pages/SalesDashboard'
import PdvDashboard from './modules/pdv/pages/PdvDashboard'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 1000 * 30 },
  },
})

function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme, accent } = useAppStore()

  useEffect(() => {
    const root = document.documentElement
    root.classList.remove('dark', 'light')
    root.classList.add(theme)

    const accentClasses = [
      'accent-green', 'accent-blue', 'accent-violet',
      'accent-orange', 'accent-rose', 'accent-cyan',
    ]
    root.classList.remove(...accentClasses)
    root.classList.add(accent)
  }, [theme, accent])

  return <>{children}</>
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <BrowserRouter>
          <Routes>

            <Route element={<PublicRoute />}>
              <Route path="/" element={<CompanySelect />} />
              <Route path="/warehouses/:companyId" element={<WarehouseSelect />} />
            </Route>

            <Route element={<ProtectedRoute />}>
              <Route element={<AppLayout />}>
                <Route path="/inventory/dashboard"          element={<InventoryDashboard />} />
                <Route path="/inventory/products"           element={<div className="p-6 text-ink-primary">Productos</div>} />
                <Route path="/inventory/categories"         element={<div className="p-6 text-ink-primary">Mis Categorías</div>} />
                <Route path="/inventory/stock"              element={<div className="p-6 text-ink-primary">Stock</div>} />
                <Route path="/inventory/movements"          element={<div className="p-6 text-ink-primary">Movimientos</div>} />
                <Route path="/inventory/catalog/products"   element={<div className="p-6 text-ink-primary">Productos Globales</div>} />
                <Route path="/inventory/catalog/categories" element={<div className="p-6 text-ink-primary">Categorías Globales</div>} />

                <Route path="/sales/dashboard"              element={<SalesDashboard />} />
                <Route path="/sales/list"                   element={<div className="p-6 text-ink-primary">Ventas</div>} />
                <Route path="/sales/receipts"               element={<div className="p-6 text-ink-primary">Recibos</div>} />
                <Route path="/sales/customers"              element={<div className="p-6 text-ink-primary">Clientes</div>} />
                <Route path="/sales/sellers"                element={<div className="p-6 text-ink-primary">Vendedores</div>} />
                <Route path="/sales/catalog/products"       element={<div className="p-6 text-ink-primary">Mis Productos</div>} />
                <Route path="/sales/catalog/categories"     element={<div className="p-6 text-ink-primary">Mis Categorías</div>} />

                <Route path="/pdv/dashboard"                element={<PdvDashboard />} />
                <Route path="/pdv/orders"                   element={<div className="p-6 text-ink-primary">Órdenes</div>} />
                <Route path="/pdv/tables"                   element={<div className="p-6 text-ink-primary">Mesas</div>} />
                <Route path="/pdv/menus"                    element={<div className="p-6 text-ink-primary">Menús</div>} />
                <Route path="/pdv/stations"                 element={<div className="p-6 text-ink-primary">Estaciones</div>} />
                <Route path="/pdv/catalog/products"         element={<div className="p-6 text-ink-primary">Mis Productos</div>} />
                <Route path="/pdv/catalog/categories"       element={<div className="p-6 text-ink-primary">Mis Categorías</div>} />
                
                <Route path="/company/profile"              element={<div className="p-6 text-ink-primary">Perfil Empresa</div>} />
                <Route path="/settings"                     element={<div className="p-6 text-ink-primary">Configuración</div>} />

              </Route>
            </Route>

            <Route path="*" element={<NotFound />} />

          </Routes>
        </BrowserRouter>
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: 'var(--surface-2)',
              color:      'var(--ink-primary)',
              border:     '1px solid var(--surface-4)',
              fontSize:   '13px',
            },
          }}
        />
      </ThemeProvider>
    </QueryClientProvider>
  )
}