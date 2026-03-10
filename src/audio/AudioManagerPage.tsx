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
      </header>
      
      <GlassCard className="p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="font-medium">Master Volume</span>
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
            <label className="text-sm mb-2 block">Music: {musicVolume}%</label>
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
            <label className="text-sm mb-2 block">Sound Effects: {sfxVolume}%</label>
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
