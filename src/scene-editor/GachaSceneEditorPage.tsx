import { useState } from 'react'
import { GlassCard } from '@/components/GlassCard'
import { Button } from '@/components/Button'
import { Plus, Image, Move, Trash2 } from 'lucide-react'

interface SceneCharacter {
  id: string
  characterId: string
  x: number
  y: number
  scale: number
  layer: number
  flipped: boolean
  expression: string
}

interface Scene {
  id: string
  characters: SceneCharacter[]
  background: string
}

export function GachaSceneEditorPage() {
  const [scenes, setScenes] = useState<Scene[]>([{ id: '1', characters: [], background: '' }])
  const [activeScene, setActiveScene] = useState(0)
  const [selectedChar, setSelectedChar] = useState<string | null>(null)
  
  const addCharacter = () => {
    const newChar: SceneCharacter = {
      id: crypto.randomUUID(),
      characterId: 'char-1',
      x: 50,
      y: 50,
      scale: 1,
      layer: 0,
      flipped: false,
      expression: 'neutral'
    }
    
    setScenes(prev => {
      const updated = [...prev]
      updated[activeScene].characters.push(newChar)
      return updated
    })
  }
  
  return (
    <div className="h-full flex flex-col">
      <header className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold">Scene Editor</h1>
          <p className="text-muted-foreground">Create scenes with character placement</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setScenes([...scenes, { id: crypto.randomUUID(), characters: [], background: '' }])}>
            <Plus className="w-4 h-4 mr-2" />
            New Scene
          </Button>
          <Button onClick={addCharacter}>
            <Image className="w-4 h-4 mr-2" />
            Add Character
          </Button>
        </div>
      </header>
      
      <div className="flex gap-4 mb-4">
        {scenes.map((scene, idx) => (
          <button
            key={scene.id}
            className={`px-4 py-2 rounded-lg text-sm ${
              activeScene === idx ? 'bg-primary text-primary-foreground' : 'bg-white/5'
            }`}
            onClick={() => setActiveScene(idx)}
          >
            Scene {idx + 1}
          </button>
        ))}
      </div>
      
      <GlassCard className="flex-1 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-purple-900/20">
          {scenes[activeScene]?.characters.map(char => (
            <div
              key={char.id}
              className={`absolute w-16 h-16 rounded-full flex items-center justify-center cursor-pointer transition-all ${
                selectedChar === char.id ? 'ring-2 ring-primary bg-primary/20' : 'bg-white/10'
              }`}
              style={{
                left: `${char.x}%`,
                top: `${char.y}%`,
                transform: `scale(${char.scale}) ${char.flipped ? 'scaleX(-1)' : ''}`
              }}
              onClick={() => setSelectedChar(char.id)}
            >
              <span className="text-2xl">👤</span>
            </div>
          ))}
        </div>
      </GlassCard>
      
      {selectedChar && (
        <GlassCard className="mt-4 p-4">
          <div className="flex items-center justify-between">
            <span className="font-medium">Selected Character</span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Move className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" className="text-destructive"
                onClick={() => {
                  setScenes(prev => {
                    const updated = [...prev]
                    updated[activeScene].characters = updated[activeScene].characters.filter(c => c.id !== selectedChar)
                    return updated
                  })
                  setSelectedChar(null)
                }}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </GlassCard>
      )}
    </div>
  )
}
