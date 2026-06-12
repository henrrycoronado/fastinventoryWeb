import { useEffect, lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { useAppStore } from './core/store/useAppStore'
import ProtectedRoute from './core/router/ProtectedRoute'
import PublicRoute from './core/router/PublicRoute'
import AppLayout from './layouts/AppLayout'
import Spinner from './core/components/atoms/Spinner'

const CompanySelect = lazy(() => import('./pages/CompanySelect'))
const WarehouseSelect = lazy(() => import('./pages/WarehouseSelect'))
const NotFound = lazy(() => import('./pages/NotFound'))
const Settings = lazy(() => import('./pages/Settings'))
const CompanyProfile = lazy(() => import('./pages/CompanyProfile'))

const InventoryDashboard = lazy(() => import('./modules/inventory/pages/InventoryDashboard'))
const ProductsPage = lazy(() => import('./modules/inventory/pages/ProductsPage'))
const CategoriesPage = lazy(() => import('./modules/inventory/pages/CategoriesPage'))
const StockPage = lazy(() => import('./modules/inventory/pages/StockPage'))
const MovementsPage = lazy(() => import('./modules/inventory/pages/MovementsPage'))
const KardexPage = lazy(() => import('./modules/inventory/pages/KardexPage'))
const WarehousesPage = lazy(() => import('./modules/inventory/pages/WarehousesPage'))
const UnitsPage = lazy(() => import('./modules/inventory/pages/UnitsPage'))


const PurchasesDashboard = lazy(() => import('./modules/purchases/pages/PurchasesDashboard'))
const SuppliersPage = lazy(() => import('./modules/purchases/pages/SuppliersPage'))
const OrdersPage = lazy(() => import('./modules/purchases/pages/OrdersPage'))

const SalesPosPage = lazy(() => import('./modules/sales/pages/SalesPosPage'))
const SalesDashboard = lazy(() => import('./modules/sales/pages/SalesDashboard'))
const TicketsPage = lazy(() => import('./modules/sales/pages/TicketsPage'))
const KdsPage = lazy(() => import('./modules/sales/pages/KdsPage'))
const WaitersPage = lazy(() => import('./modules/sales/pages/WaitersPage'))
const SalesCatalogPage = lazy(() => import('./modules/sales/pages/SalesCatalogPage'))

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

function RouteFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex items-center gap-2 text-sm text-ink-muted">
        <Spinner size={16} />
        Cargando modulo...
      </div>
    </div>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <BrowserRouter>
          <Suspense fallback={<RouteFallback />}>
            <Routes>

              <Route element={<PublicRoute />}>
                <Route path="/" element={<CompanySelect />} />
                <Route path="/:companyCen/warehouses" element={<WarehouseSelect />} />
              </Route>

              <Route element={<ProtectedRoute />}>
                <Route element={<AppLayout />}>
                  <Route path="/inventory/dashboard"  element={<InventoryDashboard />} />
                  <Route path="/inventory/products" element={<ProductsPage />} />
                  <Route path="/inventory/categories" element={<CategoriesPage />} />
                  <Route path="/inventory/stock" element={<StockPage />} />
                  <Route path="/inventory/movements" element={<MovementsPage />} />
                  <Route path="/inventory/kardex" element={<KardexPage />} />
                  <Route path="/inventory/warehouses" element={<WarehousesPage />} />
                  <Route path="/inventory/units" element={<UnitsPage />} />


                  <Route path="/purchases/dashboard" element={<PurchasesDashboard />} />
                  <Route path="/purchases/suppliers" element={<SuppliersPage />} />
                  <Route path="/purchases/orders"    element={<OrdersPage />} />

                  <Route path="/sales/dashboard" element={<SalesDashboard />} />
                  <Route path="/sales/pos"       element={<SalesPosPage />} />
                  <Route path="/sales/tickets"   element={<TicketsPage />} />
                  <Route path="/sales/kds"       element={<KdsPage />} />
                  <Route path="/sales/waiters"   element={<WaitersPage />} />
                  <Route path="/sales/catalog"   element={<SalesCatalogPage />} />

                  <Route path="/company/profile" element={<CompanyProfile />} />
                  <Route path="/settings"        element={<Settings />} />

                </Route>
              </Route>

              <Route path="*" element={<NotFound />} />

            </Routes>
          </Suspense>
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
