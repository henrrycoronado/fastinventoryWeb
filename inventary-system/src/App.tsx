import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { useAppStore } from './store/useAppStore'

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
            <Route path="/" element={<Navigate to="/inventory/products" replace />} />

            {/* Inventory */}
            <Route path="/inventory/products"  element={<div>Products</div>} />
            <Route path="/inventory/stock"     element={<div>Stock</div>} />
            <Route path="/inventory/movements" element={<div>Movements</div>} />

            {/* Sales */}
            <Route path="/sales"    element={<div>Sales</div>} />
            <Route path="/receipts" element={<div>Receipts</div>} />

            {/* PdV */}
            <Route path="/pdv" element={<div>PdV</div>} />

            {/* Setup */}
            <Route path="/setup" element={<div>Setup</div>} />

            <Route path="*" element={<Navigate to="/" replace />} />
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