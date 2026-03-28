import { useEffect, lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { useAppStore } from './store/useAppStore'
import ProtectedRoute from './router/ProtectedRoute'
import PublicRoute from './router/PublicRoute'
import AppLayout from './layouts/AppLayout'
import Spinner from './atoms/Spinner'

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

const SalesDashboard = lazy(() => import('./modules/sales/pages/SalesDashboard'))
const SalesListPage = lazy(() => import('./modules/sales/pages/SalesListPage'))
const CustomersPage = lazy(() => import('./modules/sales/pages/CustomersPage'))
const SellersPage = lazy(() => import('./modules/sales/pages/SellersPage'))
const SalesProductsPage = lazy(() => import('./modules/sales/pages/SalesProductsPage'))
const SalesCategoriesPage = lazy(() => import('./modules/sales/pages/SalesCategoriesPage'))

const PdvDashboard = lazy(() => import('./modules/pdv/pages/PdvDashboard'))
const PdvOrdersPage = lazy(() => import('./modules/pdv/pages/PdvOrdersPage'))
const PdvTablesPage = lazy(() => import('./modules/pdv/pages/PdvTablesPage'))
const PdvWaitersPage = lazy(() => import('./modules/pdv/pages/PdvWaitersPage'))
const PdvMenusPage = lazy(() => import('./modules/pdv/pages/PdvMenusPage'))
const PdvStationsPage = lazy(() => import('./modules/pdv/pages/PdvStationsPage'))
const MyCatalogProducts = lazy(() => import('./modules/pdv/pages/MyCatalogProducts'))
const MyCatalogCategories = lazy(() => import('./modules/pdv/pages/MyCatalogCategories'))

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
                <Route path="/warehouses/:companyId" element={<WarehouseSelect />} />
              </Route>

              <Route element={<ProtectedRoute />}>
                <Route element={<AppLayout />}>
                  <Route path="/inventory/dashboard"  element={<InventoryDashboard />} />
                  <Route path="/inventory/products" element={<ProductsPage />} />
                  <Route path="/inventory/categories" element={<CategoriesPage />} />
                  <Route path="/inventory/stock" element={<StockPage />} />
                  <Route path="/inventory/movements" element={<MovementsPage />} />
                  <Route path="/inventory/kardex" element={<KardexPage />} />

                  <Route path="/sales/dashboard"              element={<SalesDashboard />} />
                  <Route path="/sales/list" element={<SalesListPage />} />
                  <Route path="/sales/customers"  element={<CustomersPage />} />
                  <Route path="/sales/sellers"    element={<SellersPage />} />
                  <Route path="/sales/catalog/products"       element={<SalesProductsPage />} />
                  <Route path="/sales/catalog/categories"     element={<SalesCategoriesPage />} />

                  <Route path="/pdv/dashboard"                element={<PdvDashboard />} />
                  <Route path="/pdv/orders"                   element={<PdvOrdersPage />} />
                  <Route path="/pdv/tables"                   element={<PdvTablesPage />} />
                  <Route path="/pdv/waiters"                  element={<PdvWaitersPage />} />
                  <Route path="/pdv/menus"                    element={<PdvMenusPage />} />
                  <Route path="/pdv/stations"                 element={<PdvStationsPage />} />
                  <Route path="/pdv/catalog/products"         element={<MyCatalogProducts />} />
                  <Route path="/pdv/catalog/categories"       element={<MyCatalogCategories />} />

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