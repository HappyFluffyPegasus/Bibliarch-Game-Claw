import { Routes, Route } from 'react-router-dom'
import { DashboardPage } from './dashboard/DashboardPage'

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<DashboardPage />} />
    </Routes>
  )
}