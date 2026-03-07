import { Routes, Route, Navigate } from 'react-router-dom';
import { DashboardPage } from './dashboard/DashboardPage';
import { StoryOverviewPage } from './dashboard/StoryOverviewPage';
import { CanvasPage } from './canvas/CanvasPage';
import { CharacterCreatorPage } from './character-creator/CharacterCreatorPage';
import { SceneEditorPage } from './scene-editor/SceneEditorPage';
import { EnhancedSceneEditorPage } from './scene-editor/EnhancedSceneEditorPage';
import { WorldBuilderPage } from './world-builder/WorldBuilderPage';
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
import { GamePreviewPage } from './preview/GamePreviewPage';
import { GachaSceneEditorPage } from './scene-editor/GachaSceneEditorPage';
import { CharacterExpressionSystem } from './character/CharacterExpressionSystem';
import { SettingsPage } from './settings/SettingsPage';
import { MainLayout } from './app-shell/MainLayout';

export function AppRoutes() {
  return (
    <Routes>
      {/* Main Routes */}
      <Route path="/" element={<DashboardPage />} />
      <Route path="/story/:id" element={<MainLayout><StoryOverviewPage /></MainLayout>} />
      
      {/* Story Content */}
      <Route path="/story/:id/notes" element={<MainLayout><CanvasPage /></MainLayout>} />
      <Route path="/story/:id/characters" element={<MainLayout><CharacterCreatorPage /></MainLayout>} />
      <Route path="/story/:id/world" element={<MainLayout><WorldBuilderPage /></MainLayout>} />
      <Route path="/story/:id/scenes" element={<MainLayout><SceneEditorPage /></MainLayout>} />
      <Route path="/story/:id/scenes-v2" element={<MainLayout><EnhancedSceneEditorPage /></MainLayout>} />
      <Route path="/story/:id/timeline" element={<MainLayout><TimelineSystemPage /></MainLayout>} />
      <Route path="/story/:id/timeline-canvas" element={<MainLayout><TimelineCanvasPage /></MainLayout>} />
      <Route path="/story/:id/dialogue" element={<MainLayout><DialogueEditorPage /></MainLayout>} />
      <Route path="/story/:id/quests" element={<MainLayout><QuestManagerPage /></MainLayout>} />
      <Route path="/story/:id/stats" element={<MainLayout><StoryStatisticsPage /></MainLayout>} />
      <Route path="/story/:id/export" element={<MainLayout><ExportPublishPage /></MainLayout>} />
      
      {/* Tools */}
      <Route path="/gacha-studio" element={<MainLayout><GachaSceneEditorPage /></MainLayout>} />
      <Route path="/expressions" element={<MainLayout><CharacterExpressionSystem /></MainLayout>} />
      <Route path="/assets" element={<MainLayout><AssetLoader /></MainLayout>} />
      <Route path="/audio" element={<MainLayout><AudioManagerPage /></MainLayout>} />
      <Route path="/effects" element={<MainLayout><EffectsShowcasePage /></MainLayout>} />
      <Route path="/preview" element={<MainLayout><GamePreviewPage /></MainLayout>} />
      <Route path="/ai-assistant" element={<MainLayout><AIWritingAssistantPage /></MainLayout>} />
      <Route path="/settings" element={<MainLayout><SettingsPage /></MainLayout>} />
      
      {/* Redirects */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
