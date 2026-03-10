import { useState } from 'react'
import { GlassCard } from '@/components/GlassCard'
import { Button } from '@/components/Button'
import { Volume2, Music, VolumeX } from 'lucide-react'

export function AudioManagerPage() {
  const [masterVolume, setMasterVolume] = useState(80)
  const [musicVolume, setMusicVolume] = useState(60)
  const [sfxVolume, setSfxVolume] = useState(80)
  const [isMuted, setIsMuted] = useState(false)
  
  return (
    <div className="max-w-2xl">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Audio Manager</h1>
        <p className="text-muted-foreground">Manage music and sound effects</p>
      </header>
      
      <GlassCard className="p-6 mb-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="font-medium">Master Volume</h3>
              <p className="text-sm text-muted-foreground">{isMuted ? 'Muted' : `${masterVolume}%`}</p>
            </div>
          </div>
          
          <Button variant="outline" size="sm" onClick={() => setIsMuted(!isMuted)}>
            {isMuted ? 'Unmute' : 'Mute'}
          </Button>
        </div>
        
        <input
          type="range"
          min="0"
          max="100"
          value={masterVolume}
          onChange={e => setMasterVolume(Number(e.target.value))}
          className="w-full mb-6"
          disabled={isMuted}
        />
        
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Music className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">Music</span>
              </div>
              <span className="text-sm text-muted-foreground">{musicVolume}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={musicVolume}
              onChange={e => setMusicVolume(Number(e.target.value))}
              className="w-full"
              disabled={isMuted}
            />
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">Sound Effects</span>
              </div>
              <span className="text-sm text-muted-foreground">{sfxVolume}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={sfxVolume}
              onChange={e => setSfxVolume(Number(e.target.value))}
              className="w-full"
              disabled={isMuted}
            />
          </div>
        </div>
      </GlassCard>
    </div>
  )
}
