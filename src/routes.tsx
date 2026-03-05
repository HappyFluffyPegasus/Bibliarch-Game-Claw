import { Routes, Route, Navigate } from 'react-router-dom';
import { DashboardPage } from './dashboard/DashboardPage';
import { StoryOverviewPage } from './dashboard/StoryOverviewPage';
import { CanvasPage } from './canvas/CanvasPage';
import { CharacterCreatorPage } from './character-creator/CharacterCreatorPage';
import { SceneEditorPage } from './scene-editor/SceneEditorPage';
import { WorldBuilderPage } from './world-builder/WorldBuilderPage';
import { TimelinePage } from './timeline/TimelinePage';
import { MainLayout } from './app-shell/MainLayout';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/story/:id" element={<MainLayout><StoryOverviewPage /></MainLayout>} />
      <Route path="/story/:id/notes" element={<MainLayout><CanvasPage /></MainLayout>} />
      <Route path="/story/:id/characters" element={<MainLayout><CharacterCreatorPage /></MainLayout>} />
      <Route path="/story/:id/world" element={<MainLayout><WorldBuilderPage /></MainLayout>} />
      <Route path="/story/:id/scenes" element={<MainLayout><SceneEditorPage /></MainLayout>} />
      <Route path="/story/:id/timeline" element={<MainLayout><TimelinePage /></MainLayout>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}