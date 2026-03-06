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
import { WorldArchivePage } from './world-builder/WorldArchivePage';
import { WorldMapEditorPage } from './world-builder/WorldMapEditorPage';
import { TerrainEditorPage } from './world-builder/TerrainEditorPage';
import { CartographyEditorPage } from './world-builder/CartographyEditorPage';
import { ExportPublishPage } from './export/ExportPublishPage';
import { SceneTransitionsPage } from './transitions/SceneTransitionsPage';
import { EffectsShowcasePage } from './effects/EffectsShowcasePage';
import { TimelineSystemPage } from './timeline/TimelineSystemPage';
import { TimelineCanvasPage } from './timeline/TimelineCanvasPage';
import { StoryStatisticsPage } from './dashboard/StoryStatisticsPage';
import { AssetLoader } from './components/AssetLoader';
import { AudioManagerPage } from './audio/AudioManagerPage';
import { DialogueEditorPage } from './dialogue/DialogueEditorPage';
import { QuestManagerPage } from './quest/QuestManagerPage';
import { AIWritingAssistantPage } from './ai/AIWritingAssistantPage';
import { SettingsPage } from './settings/SettingsPage';
import { MainLayout } from './app-shell/MainLayout';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/story/:id" element={<MainLayout><StoryOverviewPage /></MainLayout>} />
      <Route path="/story/:id/notes" element={<MainLayout><CanvasPage /></MainLayout>} />
      <Route path="/story/:id/characters" element={<MainLayout><CharacterCreatorPage /></MainLayout>} />
      <Route path="/world-builder" element={<MainLayout><WorldArchivePage /></MainLayout>} />
      <Route path="/world-editor" element={<MainLayout><WorldMapEditorPage /></MainLayout>} />
      <Route path="/story/:id/world" element={<MainLayout><WorldBuilderPage /></MainLayout>} />
      <Route path="/story/:id/world-v2" element={<MainLayout><EnhancedWorldBuilderPage /></MainLayout>} />
      <Route path="/story/:id/interior" element={<MainLayout><BuildingInteriorEditor /></MainLayout>} />
      <Route path="/story/:id/cartography" element={<MainLayout><CartographyEditorPage /></MainLayout>} />
      <Route path="/terrain-editor" element={<MainLayout><TerrainEditorPage /></MainLayout>} />
      <Route path="/story/:id/export" element={<MainLayout><ExportPublishPage /></MainLayout>} />
      <Route path="/story/:id/transitions" element={<MainLayout><SceneTransitionsPage /></MainLayout>} />
      <Route path="/effects" element={<MainLayout><EffectsShowcasePage /></MainLayout>} />
      <Route path="/story/:id/scenes" element={<MainLayout><SceneEditorPage /></MainLayout>} />
      <Route path="/story/:id/scenes-v2" element={<MainLayout><EnhancedSceneEditorPage /></MainLayout>} />
      <Route path="/story/:id/timeline" element={<MainLayout><TimelineSystemPage /></MainLayout>} />
      <Route path="/story/:id/timeline-canvas" element={<MainLayout><TimelineCanvasPage /></MainLayout>} />
      <Route path="/story/:id/stats" element={<MainLayout><StoryStatisticsPage /></MainLayout>} />
      <Route path="/assets" element={<MainLayout><AssetLoader /></MainLayout>} />
      <Route path="/audio" element={<MainLayout><AudioManagerPage /></MainLayout>} />
      <Route path="/story/:id/dialogue" element={<MainLayout><DialogueEditorPage /></MainLayout>} />
      <Route path="/story/:id/quests" element={<MainLayout><QuestManagerPage /></MainLayout>} />
      <Route path="/ai-assistant" element={<MainLayout><AIWritingAssistantPage /></MainLayout>} />
      <Route path="/settings" element={<MainLayout><SettingsPage /></MainLayout>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
