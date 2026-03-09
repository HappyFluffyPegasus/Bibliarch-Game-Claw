import { useState } from 'react'
import { GlassCard } from '@/components/GlassCard'
import { Button } from '@/components/Button'
import { Play, Pause, RotateCcw } from 'lucide-react'

export function GamePreviewPage() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [chapter, setChapter] = useState(1)
  
  return (
    <div className="h-full flex flex-col">
      <header className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold">Game Preview</h1>
          <p className="text-muted-foreground">Test your story as a player would experience it</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <RotateCcw className="w-4 h-4 mr-1" /> Reset
          </Button>
          
          <Button onClick={() => setIsPlaying(!isPlaying)}>
            {isPlaying ? (
              <><Pause className="w-4 h-4 mr-2" /> Pause</>
            ) : (
              <><Play className="w-4 h-4 mr-2" /> Play</>
            )}
          </Button>
        </div>
      </header>
      
      <GlassCard className="flex-1 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">🎮</div>
            <h2 className="text-xl font-bold mb-2">Game Preview Mode</h2>
            <p className="text-muted-foreground mb-4">Click Play to start your story</p>
            
            <div className="flex justify-center gap-2">
              {[1, 2, 3].map(c => (
                <button
                  key={c}
                  className={`px-4 py-2 rounded-lg text-sm ${
                    chapter === c ? 'bg-primary text-primary-foreground' : 'bg-white/10'
                  }`}
                  onClick={() => setChapter(c)}
                >
                  Chapter {c}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-4 left-4 right-4">
          <GlassCard className="p-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Debug Info</span>
              <div className="flex gap-4 text-xs text-muted-foreground">
                <span>Chapter: {chapter}</span>
                <span>Status: {isPlaying ? 'Playing' : 'Paused'}</span>
              </div>
            </div>
          </GlassCard>
        </div>
      </GlassCard>
    </div>
  )
}
