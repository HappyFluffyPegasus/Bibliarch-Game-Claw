// Character Creator Types

export interface Character {
  id: string
  name: string
  age: number
  gender: 'male' | 'female' | 'other'
  
  // Appearance - these map to shape keys/blend shapes in the model
  appearance: {
    // Body
    height: number // 0-1 scale
    weight: number // 0-1 scale
    muscle: number // 0-1 scale
    
    // Face
    faceShape: number // 0-1
    eyeSize: number // 0-1
    eyeSpacing: number // 0-1
    noseSize: number // 0-1
    mouthSize: number // 0-1
    
    // Colors
    skinTone: string // hex color
    hairColor: string // hex color
    eyeColor: string // hex color
    
    // Hair
    hairStyle: string // references a hair mesh
    hairLength: number // 0-1
  }
  
  // Personality
  personality: {
    traits: string
    customBoxes: CustomPersonalityBox[]
  }
  
  // Memories
  memories: Memory[]
  
  // Outfits
  outfits: Outfit[]
  currentOutfitId?: string
  
  // Evolution/Story arc
  evolution: EvolutionEntry[]
  
  // Relationships
  relationships: Relationship[]
  
  // Animation
  currentAnimation: string
  
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
  tags: string[]
  // Mesh visibility toggles
  visibleMeshes: string[]
  hiddenMeshes: string[]
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
  targetId: string
  targetName: string
  type: 'friend' | 'enemy' | 'lover' | 'family' | 'rival' | 'mentor' | 'colleague' | 'neutral'
  strength: number // -100 to 100
  description: string
}

// Shape Key / Morph Target definitions from your model
export interface ShapeKeySet {
  name: string
  min: number
  max: number
  current: number
  category: 'body' | 'face' | 'expression'
}

// Animation definitions
export interface AnimationClip {
  name: string
  displayName: string
  category: 'idle' | 'emotion' | 'action'
  loop: boolean
}
