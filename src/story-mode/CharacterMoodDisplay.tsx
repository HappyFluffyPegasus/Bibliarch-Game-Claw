import { GlassCard } from '@/components/GlassCard'

interface CharacterMood {
  happiness: number
  energy: number
  stress: number
  social: number
}

interface CharacterMoodDisplayProps {
  name: string
  mood: CharacterMood
}

const getMoodEmoji = (mood: CharacterMood): string => {
  if (mood.happiness > 70 && mood.energy > 50) return '😊'
  if (mood.happiness < 30) return '😢'
  if (mood.stress > 70) return '😰'
  if (mood.energy < 30) return '😴'
  if (mood.social > 70) return '🥳'
  return '😐'
}

const getMoodLabel = (mood: CharacterMood): string => {
  if (mood.happiness > 70 && mood.energy > 50) return 'Happy'
  if (mood.happiness < 30) return 'Sad'
  if (mood.stress > 70) return 'Stressed'
  if (mood.energy < 30) return 'Tired'
  if (mood.social > 70) return 'Sociable'
  return 'Neutral'
}

export function CharacterMoodDisplay({ name, mood }: CharacterMoodDisplayProps) {
  const stats = [
    { label: 'Happiness', value: mood.happiness, color: '#22c55e' },
    { label: 'Energy', value: mood.energy, color: '#3b82f6' },
    { label: 'Stress', value: mood.stress, color: '#ef4444' },
    { label: 'Social', value: mood.social, color: '#a855f7' }
  ]
  
  return (
    <GlassCard className="p-3">
      <div className="flex items-center gap-3 mb-3">
        <span className="text-3xl">{getMoodEmoji(mood)}</span>
        
        <div>
          <div className="font-medium">{name}</div>
          <div className="text-sm text-muted-foreground">{getMoodLabel(mood)}</div>
        </div>
      </div>
      
      <div className="space-y-2">
        {stats.map(stat => (
          <div key={stat.label}>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-muted-foreground">{stat.label}</span>
              <span>{stat.value}%</span>
            </div>
            
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${stat.value}%`, backgroundColor: stat.color }}
              />
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  )
}
