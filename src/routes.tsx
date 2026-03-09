import { Routes, Route, Navigate } from 'react-router-dom'
import { MainLayout } from './app-shell/MainLayout'
import { DashboardPage } from './dashboard/DashboardPage'

function Placeholder({ name }: { name: string }) {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">{name}</h1>
      <p className="text-muted-foreground">This feature is under construction.</p>
    </div>
  )
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="characters/*" element={<Placeholder name="Characters" />} />
        <Route path="world/*" element={<Placeholder name="World Builder" />} />
        <Route path="scenes/*" element={<Placeholder name="Scene Editor" />} />
        <Route path="timeline/*" element={<Placeholder name="Timeline" />} />
        <Route path="settings/*" element={<Placeholder name="Settings" />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
