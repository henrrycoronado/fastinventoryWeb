import { useNavigate } from 'react-router-dom'
import { APP_NAME } from '../core/utils/constants'
import { MoveLeft } from 'lucide-react'

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-surface-0 flex flex-col items-center justify-center gap-4">
      <p className="font-mono text-6xl font-bold text-accent">404</p>
      <div className="text-center space-y-1">
        <h1 className="font-display text-xl font-bold text-ink-primary">Página no encontrada</h1>
        <p className="text-sm text-ink-muted">Esta ruta no existe en {APP_NAME}</p>
      </div>
      <button onClick={() => navigate(-1)} className="btn-ghost text-sm mt-2">
        <MoveLeft size={15} /> Volver
      </button>
    </div>
  )
}