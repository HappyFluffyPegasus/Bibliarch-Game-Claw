import Dexie, { type Table } from 'dexie'

// ==================== TYPES ====================

export interface Story {
  id: string
  title: string
  description: string
  createdAt: Date
  updatedAt: Date
  color: string
  template: string
}

export interface Character {
  id: string
  storyId: string
  name: string
  appearance: {
    modelUrl: string
    colors: Record<string, string>
    morphs: Record<string, number>
  }
  personality: {
    traits: string
    likes: string
    dislikes: string
    fears: string
    dreams: string
  }
  expressions: Record<string, number>
  createdAt: Date
  updatedAt: Date
}

export interface Location {
  id: string
  storyId: string
  parentId: string | null
  name: string
  type: 'world' | 'continent' | 'country' | 'region' | 'city' | 'building' | 'room'
  description: string
  position: { x: number; y: number; z: number }
  createdAt: Date
  updatedAt: Date
}

export interface WorldEvent {
  id: string
  storyId: string
  locationId: string
  title: string
  type: 'discovery' | 'dialogue' | 'cutscene' | 'weather' | 'quest' | 'milestone'
  description: string
  status: 'draft' | 'scheduled' | 'active' | 'completed'
  createdAt: Date
  updatedAt: Date
}

export interface SecretPersonalityProfile {
  id: string
  characterId: string
  presets: string[]
  big5: {
    extraversion: number
    neuroticism: number
    openness: number
    agreeableness: number
    conscientiousness: number
  }
  big5Code: string
  cognitiveStack: {
    dominant: string
    auxiliary: string
    tertiary: string
    inferior: string
  }
  stackCode: string
  behaviorWeights: Record<string, number>
  confidence: number
  lastAnalyzed: Date
}

// ==================== DATABASE ====================

export class BibliarchDatabase extends Dexie {
  stories!: Table<Story>
  characters!: Table<Character>
  locations!: Table<Location>
  worldEvents!: Table<WorldEvent>
  secretProfiles!: Table<SecretPersonalityProfile>

  constructor() {
    super('bibliarch-v2')
    
    this.version(1).stores({
      stories: 'id, createdAt, updatedAt',
      characters: 'id, storyId, createdAt, updatedAt',
      locations: 'id, storyId, parentId, type, createdAt, updatedAt',
      worldEvents: 'id, storyId, locationId, type, status, createdAt',
      secretProfiles: 'id, characterId, lastAnalyzed'
    })
  }
}

export const db = new BibliarchDatabase()
