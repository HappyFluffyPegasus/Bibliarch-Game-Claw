import { GlassCard } from './GlassCard'
import { Trophy, Star, Zap, Heart } from 'lucide-react'

const achievements = [
  { id: 'first_story', name: 'Storyteller', description: 'Create your first story', icon: Star, unlocked: true },
  { id: 'first_character', name: 'Character Creator', description: 'Create your first character', icon: Heart, unlocked: true },
  { id: 'world_builder', name: 'World Builder', description: 'Create 5 locations', icon: Trophy, unlocked: false },
  { id: 'life_mode', name: 'Life Watcher', description: 'Run Life Mode for 1 hour', icon: Zap, unlocked: false },
]

export function Achievements() {
  return (
    <GlassCard className="p-4">
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="w-5 h-5 text-yellow-400" />
        <h3 className="font-semibold">Achievements</h3>
      </div>
      
      <div className="space-y-2">
        {achievements.map(ach => (
          <div
            key={ach.id}
            className={`flex items-center gap-3 p-2 rounded-lg ${
              ach.unlocked ? 'bg-white/5' : 'bg-white/5 opacity-50'
            }`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              ach.unlocked ? 'bg-yellow-400/20' : 'bg-white/10'
            }`}>
              <ach.icon className={`w-4 h-4 ${ach.unlocked ? 'text-yellow-400' : 'text-muted-foreground'}`} />
            </div>
            
            <div>
              <div className="font-medium text-sm">{ach.name}</div>
              <div className="text-xs text-muted-foreground">{ach.description}</div>
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  )
}
