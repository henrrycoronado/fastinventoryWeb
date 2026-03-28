import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
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
import ProductsPage from './modules/inventory/pages/ProductsPage'
import CategoriesPage from './modules/inventory/pages/CategoriesPage'
import StockPage from './modules/inventory/pages/StockPage'
import MovementsPage from './modules/inventory/pages/MovementsPage'
import KardexPage from './modules/inventory/pages/KardexPage'
import SalesDashboard from './modules/sales/pages/SalesDashboard'
import CustomersPage from './modules/sales/pages/CustomersPage'
import SellersPage from './modules/sales/pages/SellersPage'
import PdvDashboard from './modules/pdv/pages/PdvDashboard'
import Settings from './pages/Settings'
import CompanyProfile from './pages/CompanyProfile'
import SalesListPage from './modules/sales/pages/SalesListPage'
import SalesProductsPage from './modules/sales/pages/SalesProductsPage'
import SalesCategoriesPage from './modules/sales/pages/SalesCategoriesPage'
import PdvOrdersPage from './modules/pdv/pages/PdvOrdersPage'
import PdvTablesPage from './modules/pdv/pages/PdvTablesPage'
import PdvMenusPage from './modules/pdv/pages/PdvMenusPage'
import PdvStationsPage from './modules/pdv/pages/PdvStationsPage'
import MyCatalogProducts from './modules/pdv/pages/MyCatalogProducts'
import MyCatalogCategories from './modules/pdv/pages/MyCatalogCategories'
import PdvWaitersPage from './modules/pdv/pages/PdvWaitersPage'

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