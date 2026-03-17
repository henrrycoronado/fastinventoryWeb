import { Outlet } from 'react-router-dom'

export default function AppLayout() {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar irá aquí */}
      <aside className="w-60 shrink-0 bg-surface-1 border-r border-surface-4">
        {/* Sidebar component — lo construimos después */}
      </aside>

      <main className="flex-1 overflow-y-auto bg-surface-0">
        <Outlet />
      </main>
    </div>
  )
}