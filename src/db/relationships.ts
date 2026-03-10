// Character Relationship System

export type RelationshipType = 'friend' | 'enemy' | 'lover' | 'family' | 'rival' | 'mentor' | 'colleague' | 'neutral'

export interface Relationship {
  id: string
  characterId1: string
  characterId2: string
  type: RelationshipType
  strength: number  // -100 to 100, where negative is hate, positive is love
  history: RelationshipEvent[]
  createdAt: Date
  updatedAt: Date
}

export interface RelationshipEvent {
  id: string
  timestamp: number
  description: string
  strengthChange: number
  type: 'positive' | 'negative' | 'neutral'
}

export const RELATIONSHIP_TYPES: { type: RelationshipType; label: string; icon: string }[] = [
  { type: 'friend', label: 'Friend', icon: '🤝' },
  { type: 'enemy', label: 'Enemy', icon: '⚔️' },
  { type: 'lover', label: 'Lover', icon: '❤️' },
  { type: 'family', label: 'Family', icon: '👨‍👩‍👧‍👦' },
  { type: 'rival', label: 'Rival', icon: '🏆' },
  { type: 'mentor', label: 'Mentor', icon: '🎓' },
  { type: 'colleague', label: 'Colleague', icon: '💼' },
  { type: 'neutral', label: 'Neutral', icon: '😐' }
]

export function getRelationshipLabel(strength: number): string {
  if (strength >= 80) return 'Soulmates'
  if (strength >= 60) return 'Close'
  if (strength >= 40) return 'Friendly'
  if (strength >= 20) return 'Acquaintances'
  if (strength > -20) return 'Neutral'
  if (strength > -40) return 'Dislike'
  if (strength > -60) return 'Hostile'
  if (strength > -80) return 'Enemies'
  return 'Nemesis'
}

export function getRelationshipColor(strength: number): string {
  if (strength >= 60) return '#22c55e'  // green
  if (strength >= 20) return '#84cc16'  // lime
  if (strength > -20) return '#9ca3af' // gray
  if (strength > -60) return '#f59e0b' // orange
  return '#ef4444'  // red
}
