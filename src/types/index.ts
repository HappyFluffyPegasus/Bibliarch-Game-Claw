// Core types for Bibliarch

export interface Story {
  id: string
  title: string
  description: string
  genre: string
  color: string
  coverImage?: string
  createdAt: number
  updatedAt: number
}

export interface Character {
  id: string
  storyId: string
  name: string
  age: number
  gender: string
  // Appearance
  appearance: {
    hairColor: string
    hairStyle: string
    eyeColor: string
    skinTone: string
    height: string
    build: string
    features: string
  }
  // Personality - base + custom boxes
  personality: {
    traits: string
    customBoxes: CustomPersonalityBox[]
  }
  // Memories
  memories: Memory[]
  // Outfits
  outfits: Outfit[]
  currentOutfitId?: string
  // Evolution
  evolution: EvolutionEntry[]
  // Relationships
  relationships: Relationship[]
  createdAt: number
  updatedAt: number
}

export interface CustomPersonalityBox {
  id: string
  name: string
  content: string
}

export interface Memory {
  id: string
  title: string
  description: string
  date: string
  emotion: 'happy' | 'sad' | 'angry' | 'neutral' | 'scared' | 'surprised'
  isCore: boolean
}

export interface Outfit {
  id: string
  name: string
  description: string
  imageUrl?: string
  tags: string[]
}

export interface EvolutionEntry {
  id: string
  stage: string
  description: string
  age: number
  changes: string
  unlockedAt?: number
}

export interface Relationship {
  id: string
  targetCharacterId: string
  type: 'friend' | 'enemy' | 'lover' | 'family' | 'rival' | 'mentor' | 'colleague' | 'neutral'
  strength: number
  description: string
}

export interface Location {
  id: string
  storyId: string
  name: string
  type: 'world' | 'continent' | 'country' | 'region' | 'city' | 'building' | 'room'
  description: string
  parentId?: string
  imageUrl?: string
  position?: { x: number; y: number; z: number }
  children: string[]
  createdAt: number
  updatedAt: number
}

export interface Scene {
  id: string
  storyId: string
  name: string
  description: string
  locationId?: string
  characters: string[]
  backgroundColor: string
  cameraPosition: { x: number; y: number; z: number }
  createdAt: number
}

export interface TimelineEvent {
  id: string
  storyId: string
  title: string
  description: string
  startTime: number
  duration: number
  color: string
  trackId: string
  characters: string[]
  locationId?: string
}

export interface AppSettings {
  theme: 'dark' | 'light'
  musicVolume: number
  sfxVolume: number
  masterVolume: number
  graphicsQuality: 'low' | 'medium' | 'high'
  autoSave: boolean
  showTutorials: boolean
}
