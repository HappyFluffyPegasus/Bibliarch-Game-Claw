import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { LoadingScreen } from '@/components/LoadingScreen'
import { Layout } from '@/components/Layout'
import { Dashboard } from '@/pages/Dashboard'
import { StoryDetail } from '@/pages/StoryDetail'
import { CharacterCreator } from '@/pages/CharacterCreator'
import { WorldBuilder } from '@/pages/WorldBuilder'
import { SceneEditor } from '@/pages/SceneEditor'
import { TimelineEditor } from '@/pages/TimelineEditor'
import { Settings } from '@/pages/Settings'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <LoadingScreen />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="story/:id" element={<StoryDetail />} />
          <Route path="story/:id/characters" element={<CharacterCreator />} />
          <Route path="story/:id/world" element={<WorldBuilder />} />
          <Route path="story/:id/scenes" element={<SceneEditor />} />
          <Route path="story/:id/timeline" element={<TimelineEditor />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
