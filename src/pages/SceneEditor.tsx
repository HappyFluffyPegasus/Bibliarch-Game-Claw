import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useAppStore } from '@/stores/appStore'
import { BabylonViewer } from '@/components/BabylonViewer'
import { Plus, Trash2, Image, Users } from 'lucide-react'

export function SceneEditor() {
  const { id } = useParams()
  const { scenes, characters, locations, addScene, deleteScene, updateScene } = useAppStore()
  const [selectedSceneId, setSelectedSceneId] = useState<string | null>(null)
  const [showNewScene, setShowNewScene] = useState(false)
  const [newScene, setNewScene] = useState({
    name: '',
    description: '',
    locationId: '',
    backgroundColor: '#0f172a'
  })
  
  const storyScenes = scenes.filter((s) => s.storyId === id)
  const storyCharacters = characters.filter((c) => c.storyId === id)
  const storyLocations = locations.filter((l) => l.storyId === id)
  const selectedScene = storyScenes.find((s) => s.id === selectedSceneId)
  
  const handleCreateScene = () => {
    if (!newScene.name.trim()) return
    
    const scene = addScene({
      storyId: id!,
      name: newScene.name,
      description: newScene.description,
      locationId: newScene.locationId || undefined,
      characters: [],
      backgroundColor: newScene.backgroundColor,
      cameraPosition: { x: 0, y: 5, z: -10 }
    })
    
    setNewScene({ name: '', description: '', locationId: '', backgroundColor: '#0f172a' })
    setShowNewScene(false)
    setSelectedSceneId(scene.id)
  }
  
  const toggleCharacterInScene = (characterId: string) => {
    if (!selectedScene) return
    
    const isInScene = selectedScene.characters.includes(characterId)
    const updatedCharacters = isInScene
      ? selectedScene.characters.filter((cid) => cid !== characterId)
      : [...selectedScene.characters, characterId]
    
    updateScene(selectedScene.id, { characters: updatedCharacters })
  }
  
  return (
    <div className="flex h-full">
      <div className="w-64 bg-slate-900 border-r border-white/10 flex flex-col">
        <div className="p-4 border-b border-white/10">
          <button
            onClick={() => setShowNewScene(true)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 rounded-lg hover:bg-purple-700"
          >
            <Plus className="w-4 h-4" />
            New Scene
          </button>
        </div>
        
        <div className="flex-1 overflow-auto p-2">
          {storyScenes.length === 0 ? (
            <p className="text-center text-white/40 py-8">No scenes yet</p>
          ) : (
            storyScenes.map((scene) => (
              <button
                key={scene.id}
                onClick={() => setSelectedSceneId(scene.id)}
                className={`w-full text-left p-3 rounded-lg mb-2 transition-colors ${
                  selectedSceneId === scene.id
                    ? 'bg-purple-600/30 border border-purple-500/30'
                    : 'bg-white/5 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded"
                    style={{ backgroundColor: scene.backgroundColor }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{scene.name}</div>
                    <div className="text-xs text-white/50">
                      {scene.characters.length} characters
                    </div>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
      
      {selectedScene ? (
        <div className="flex-1 flex flex-col">
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <input
                type="text"
                value={selectedScene.name}
                onChange={(e) => updateScene(selectedScene.id, { name: e.target.value })}
                className="text-xl font-bold bg-transparent border-none outline-none"
              />
              
              <select
                value={selectedScene.locationId || ''}
                onChange={(e) => updateScene(selectedScene.id, { locationId: e.target.value || undefined })}
                className="px-3 py-1 bg-white/5 rounded text-sm"
              >
                <option value="">No location</option>
                {storyLocations.map((loc) => (
                  <option key={loc.id} value={loc.id}>{loc.name}</option>
                ))}
              </select>
            </div>
            
            <button
              onClick={() => {
                deleteScene(selectedScene.id)
                setSelectedSceneId(null)
              }}
              className="p-2 text-red-400 hover:text-red-300"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex-1 p-4">
            <div className="h-full rounded-xl overflow-hidden border border-white/10">
              <BabylonViewer
                height="100%"
                backgroundColor={selectedScene.backgroundColor}
              />
            </div>
          </div>
          
          <div className="p-4 border-t border-white/10">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Characters in Scene
            </h3>
            
            <div className="flex flex-wrap gap-2">
              {storyCharacters.length === 0 ? (
                <p className="text-white/40">No characters available</p>
              ) : (
                storyCharacters.map((char) => {
                  const isInScene = selectedScene.characters.includes(char.id)
                  return (
                    <button
                      key={char.id}
                      onClick={() => toggleCharacterInScene(char.id)}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        isInScene
                          ? 'bg-purple-600'
                          : 'bg-white/5 hover:bg-white/10'
                      }`}
                    >
                      {char.name}
                    </button>
                  )
                })
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Image className="w-16 h-16 mx-auto mb-4 text-white/20" />
            <p className="text-white/40">Select a scene or create a new one</p>
          </div>
        </div>
      )}
      
      {showNewScene && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-slate-900 border border-white/10 rounded-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">Create New Scene</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-white/60 mb-1">Name</label>
                <input
                  type="text"
                  value={newScene.name}
                  onChange={(e) => setNewScene({ ...newScene, name: e.target.value })}
                  placeholder="Scene name..."
                  className="w-full px-3 py-2 bg-white/5 rounded"
                  autoFocus
                />
              </div>
              
              <div>
                <label className="block text-sm text-white/60 mb-1">Description</label>
                <textarea
                  value={newScene.description}
                  onChange={(e) => setNewScene({ ...newScene, description: e.target.value })}
                  placeholder="Describe the scene..."
                  className="w-full px-3 py-2 bg-white/5 rounded h-20 resize-none"
                />
              </div>
              
              <div>
                <label className="block text-sm text-white/60 mb-1">Background Color</label>
                <input
                  type="color"
                  value={newScene.backgroundColor}
                  onChange={(e) => setNewScene({ ...newScene, backgroundColor: e.target.value })}
                  className="w-full h-10 rounded cursor-pointer"
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowNewScene(false)
                  setNewScene({ name: '', description: '', locationId: '', backgroundColor: '#0f172a' })
                }}
                className="flex-1 px-4 py-2 border border-white/10 rounded hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateScene}
                disabled={!newScene.name.trim()}
                className="flex-1 px-4 py-2 bg-purple-600 rounded hover:bg-purple-700 disabled:opacity-50"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
