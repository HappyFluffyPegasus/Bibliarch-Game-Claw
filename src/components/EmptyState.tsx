import { GlassCard } from './GlassCard'
import { Button } from './Button'
import { Plus, BookOpen, Users, Map, Image } from 'lucide-react'

interface EmptyStateProps {
  type: 'stories' | 'characters' | 'locations' | 'scenes'
  onAction?: () => void
}

const configs = {
  stories: {
    icon: BookOpen,
    title: 'No stories yet',
    description: 'Create your first story to start building worlds',
    action: 'Create Story'
  },
  characters: {
    icon: Users,
    title: 'No characters',
    description: 'Add characters to bring your story to life',
    action: 'Add Character'
  },
  locations: {
    icon: Map,
    title: 'No locations',
    description: 'Build your world with unique locations',
    action: 'Add Location'
  },
  scenes: {
    icon: Image,
    title: 'No scenes',
    description: 'Create scenes to visualize your story',
    action: 'Create Scene'
  }
}

export function EmptyState({ type, onAction }: EmptyStateProps) {
  const config = configs[type]
  const Icon = config.icon
  
  return (
    <GlassCard className="p-12 text-center">
      <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-white/5 flex items-center justify-center">
        <Icon className="w-10 h-10 text-muted-foreground" />
      </div>
      
      <h3 className="text-xl font-semibold mb-2">{config.title}</h3>
      <p className="text-muted-foreground mb-6">{config.description}</p>
      
      {onAction && (
        <Button onClick={onAction}>
          <Plus className="w-4 h-4 mr-2" />
          {config.action}
        </Button>
      )}
    </GlassCard>
  )
}
