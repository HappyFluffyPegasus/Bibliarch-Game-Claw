import { Routes, Route, Navigate } from 'react-router-dom';
import { DashboardPage } from '../dashboard/DashboardPage';
import { StoryOverviewPage } from '../dashboard/StoryOverviewPage';
import { CanvasPage } from '../canvas/CanvasPage';
import { MainLayout } from './MainLayout';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/story/:id" element={<MainLayout><StoryOverviewPage /></MainLayout>} />
      <Route path="/story/:id/notes" element={<MainLayout><CanvasPage /></MainLayout>} />
      <Route path="/story/:id/characters" element={<MainLayout><div>Characters</div></MainLayout>} />
      <Route path="/story/:id/world" element={<MainLayout><div>World</div></MainLayout>} />
      <Route path="/story/:id/scenes" element={<MainLayout><div>Scenes</div></MainLayout>} />
      <Route path="/story/:id/timeline" element={<MainLayout><div>Timeline</div></MainLayout>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}