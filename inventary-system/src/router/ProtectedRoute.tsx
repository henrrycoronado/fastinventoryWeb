import { Navigate, Outlet } from 'react-router-dom'
import { useAppStore } from '../store/useAppStore'

export default function ProtectedRoute() {
  const sessionToken = useAppStore(s => s.sessionToken)
  if (!sessionToken) return <Navigate to="/" replace />
  return <Outlet />
}