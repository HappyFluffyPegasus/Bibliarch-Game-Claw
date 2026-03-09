import { useState, useEffect } from 'react'
import { GlassCard } from '@/components/GlassCard'
import { Button } from '@/components/Button'
import { Play, Pause, RotateCcw, Zap } from 'lucide-react'

export function LifeModePage() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [gameTime, setGameTime] = useState(0)
  const [speed, setSpeed] = useState(1)
  const [activeCharacters] = useState(0)
  
  useEffect(() => {
    if (!isPlaying) return
    
    const interval = setInterval(() => {
      setGameTime(t => t + 1)
    }, 1000 / speed)
    
    return () => clearInterval(interval)
  }, [isPlaying, speed])
  
  const day = Math.floor(gameTime / 1440) + 1
  const hour = Math.floor((gameTime % 1440) / 60)
  const minute = gameTime % 60
  
  return (
    <div className="h-full flex flex-col">
      <header className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold">Life Mode</h1>
          <p className="text-muted-foreground">Watch your characters live autonomously</p>
        </div>
        
        <div className="flex items-center gap-4">
          <select 
            className="bg-white/5 border border-white/10 rounded px-2 py-1 text-sm"
            value={speed}
            onChange={e => setSpeed(Number(e.target.value))}
          >
            <option value={0.5}>0.5x</option>
            <option value={1}>1x</option>
            <option value={2}>2x</option>
            <option value={5}>5x</option>
          </select>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setGameTime(0)}>
              <RotateCcw className="w-4 h-4" />
            </Button>
            
            <Button onClick={() => setIsPlaying(!isPlaying)}>
              {isPlaying ? <><Pause className="w-4 h-4 mr-2" /> Pause</> : <><Play className="w-4 h-4 mr-2" /> Play</>}
            </Button>
          </div>
        </div>
      </header>
      
      <GlassCard className="flex-1 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 to-purple-900/20">
          <div className="absolute top-4 left-4">
            <GlassCard className="px-4 py-2">
              <div className="text-2xl font-mono">
                Day {day} · {String(hour).padStart(2, '0')}:{String(minute).padStart(2, '0')}
              </div>
            </GlassCard>
          </div>
          
          <div className="absolute top-4 right-4">
            <GlassCard className="px-3 py-2">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-400" />
                <span className="text-sm">{activeCharacters} active</span>
              </div>
            </GlassCard>
          </div>
          
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-4">🏙️</div>
              <p className="text-muted-foreground">Life Mode simulation view</p>
              <p className="text-sm text-muted-foreground mt-2">Characters will appear here when simulation is running</p>
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  )
}
