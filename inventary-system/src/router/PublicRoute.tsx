import { Navigate, Outlet } from 'react-router-dom'
import { useAppStore } from '../store/useAppStore'

export default function PublicRoute() {
  const sessionToken = useAppStore(s => s.sessionToken)
  if (sessionToken) return <Navigate to="/inventory/dashboard" replace />
  return <Outlet />
}