import { Routes, Route, Navigate } from 'react-router-dom';
import { DashboardPage } from '../dashboard/DashboardPage';
import { StoryOverviewPage } from '../dashboard/StoryOverviewPage';
import { CanvasPage } from '../canvas/CanvasPage';
import { CharactersPage } from '../character-creator/CharactersPage';
import { TimelinePage } from '../timeline/TimelinePage';
import { MainLayout } from './MainLayout';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/story/:id" element={<MainLayout><StoryOverviewPage /></MainLayout>} />
      <Route path="/story/:id/notes" element={<MainLayout><CanvasPage /></MainLayout>} />
      <Route path="/story/:id/characters" element={<MainLayout><CharactersPage /></MainLayout>} />
      <Route path="/story/:id/world" element={<MainLayout><WorldPlaceholder /></MainLayout>} />
      <Route path="/story/:id/scenes" element={<MainLayout><ScenesPlaceholder /></MainLayout>} />
      <Route path="/story/:id/timeline" element={<MainLayout><TimelinePage /></MainLayout>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function WorldPlaceholder() {
  return (
    <div className="p-8 text-center">
      <h1 className="text-2xl font-bold mb-4">World Builder</h1>
      <p className="text-muted-foreground">Terrain, cities, and world building tools coming soon.</p>
    </div>
  );
}

function ScenesPlaceholder() {
  return (
    <div className="p-8 text-center">
      <h1 className="text-2xl font-bold mb-4">Scene Editor</h1>
      <p className="text-muted-foreground">3D scene choreography tools coming soon.</p>
    </div>
  );
}