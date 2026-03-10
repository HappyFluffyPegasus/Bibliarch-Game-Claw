import { Routes, Route, Navigate } from 'react-router-dom'
import { MainLayout } from './app-shell/MainLayout'
import { DashboardPage } from './dashboard/DashboardPage'
import { CharacterCreatorPage } from './character-creator/CharacterCreatorPage'
import { WorldBuilderPage } from './world-builder/WorldBuilderPage'
import { WeatherSystemPage } from './world-builder/WeatherSystemPage'
import { GachaSceneEditorPage } from './scene-editor/GachaSceneEditorPage'
import { TimelineSystemPage } from './timeline/TimelineSystemPage'
import { DialogueEditorPage } from './dialogue/DialogueEditorPage'
import { QuestManagerPage } from './quest/QuestManagerPage'
import { LifeModePage } from './story-mode/LifeModePage'
import { GamePreviewPage } from './preview/GamePreviewPage'
import { AIWritingAssistantPage } from './ai/AIWritingAssistantPage'
import { AudioManagerPage } from './audio/AudioManagerPage'
import { ExportPublishPage } from './export/ExportPublishPage'
import { SettingsPage } from './settings/SettingsPage'

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="characters/*" element={<CharacterCreatorPage />} />
        <Route path="world/*" element={<WorldBuilderPage />} />
        <Route path="weather/*" element={<WeatherSystemPage />} />
        <Route path="scenes/*" element={<GachaSceneEditorPage />} />
        <Route path="timeline/*" element={<TimelineSystemPage />} />
        <Route path="dialogue/*" element={<DialogueEditorPage />} />
        <Route path="quests/*" element={<QuestManagerPage />} />
        <Route path="life/*" element={<LifeModePage />} />
        <Route path="preview/*" element={<GamePreviewPage />} />
        <Route path="ai/*" element={<AIWritingAssistantPage />} />
        <Route path="audio/*" element={<AudioManagerPage />} />
        <Route path="export/*" element={<ExportPublishPage />} />
        <Route path="settings/*" element={<SettingsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
