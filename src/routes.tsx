import { Routes, Route, Navigate } from 'react-router-dom';
import { DashboardPage } from './dashboard/DashboardPage';
import { StoryOverviewPage } from './dashboard/StoryOverviewPage';
import { CanvasPage } from './canvas/CanvasPage';
import { CharacterCreatorPage } from './character-creator/CharacterCreatorPage';
import { SceneEditorPage } from './scene-editor/SceneEditorPage';
import { EnhancedSceneEditorPage } from './scene-editor/EnhancedSceneEditorPage';
import { WorldBuilderPage } from './world-builder/WorldBuilderPage';
import { EnhancedWorldBuilderPage } from './world-builder/EnhancedWorldBuilderPage';
import { BuildingInteriorEditor } from './world-builder/BuildingInteriorEditor';
import { CartographyEditorPage } from './world-builder/CartographyEditorPage';
import { EffectsShowcasePage } from './effects/EffectsShowcasePage';
import { TimelineSystemPage } from './timeline/TimelineSystemPage';
import { StoryModePage } from './story-mode/StoryModePage';
import { StoryStatisticsPage } from './dashboard/StoryStatisticsPage';
import { AssetLoader } from './components/AssetLoader';
import { AudioManagerPage } from './audio/AudioManagerPage';
import { MainLayout } from './app-shell/MainLayout';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/story/:id" element={<MainLayout><StoryOverviewPage /></MainLayout>} />
      <Route path="/story/:id/notes" element={<MainLayout><CanvasPage /></MainLayout>} />
      <Route path="/story/:id/characters" element={<MainLayout><CharacterCreatorPage /></MainLayout>} />
      <Route path="/story/:id/world" element={<MainLayout><WorldBuilderPage /></MainLayout>} />
      <Route path="/story/:id/world-v2" element={<MainLayout><EnhancedWorldBuilderPage /></MainLayout>} />
      <Route path="/story/:id/interior" element={<MainLayout><BuildingInteriorEditor /></MainLayout>} />
      <Route path="/story/:id/cartography" element={<MainLayout><CartographyEditorPage /></MainLayout>} />
      <Route path="/effects" element={<MainLayout><EffectsShowcasePage /></MainLayout>} />
      <Route path="/story/:id/scenes" element={<MainLayout><SceneEditorPage /></MainLayout>} />
      <Route path="/story/:id/scenes-v2" element={<MainLayout><EnhancedSceneEditorPage /></MainLayout>} />
      <Route path="/story/:id/timeline" element={<MainLayout><TimelineSystemPage /></MainLayout>} />
      <Route path="/story/:id/story" element={<MainLayout><StoryModePage /></MainLayout>} />
      <Route path="/story/:id/stats" element={<MainLayout><StoryStatisticsPage /></MainLayout>} />
      <Route path="/assets" element={<MainLayout><AssetLoader /></MainLayout>} />
      <Route path="/audio" element={<MainLayout><AudioManagerPage /></MainLayout>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
