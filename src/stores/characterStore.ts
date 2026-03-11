import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Character, Memory, Outfit, EvolutionEntry, Relationship, CustomPersonalityBox } from '../types/character'

interface CharacterStore {
  // Current character being edited
  character: Character | null
  
  // All saved characters
  savedCharacters: Character[]
  
  // Loading state
  isLoading: boolean
  loadingProgress: number
  
  // Actions
  createCharacter: (name: string) => Character
  loadCharacter: (id: string) => void
  updateCharacter: (updates: Partial<Character>) => void
  saveCharacter: () => void
  deleteCharacter: (id: string) => void
  
  // Appearance
  updateAppearance: (key: string, value: number | string) => void
  
  // Personality
  addCustomBox: (name: string) => void
  updateCustomBox: (id: string, content: string) => void
  removeCustomBox: (id: string) => void
  
  // Memories
  addMemory: (memory: Omit<Memory, 'id'>) => void
  updateMemory: (id: string, updates: Partial<Memory>) => void
  deleteMemory: (id: string) => void
  toggleCoreMemory: (id: string) => void
  
  // Outfits
  addOutfit: (outfit: Omit<Outfit, 'id'>) => void
  updateOutfit: (id: string, updates: Partial<Outfit>) => void
  deleteOutfit: (id: string) => void
  equipOutfit: (id: string | undefined) => void
  
  // Evolution
  addEvolution: (entry: Omit<EvolutionEntry, 'id'>) => void
  updateEvolution: (id: string, updates: Partial<EvolutionEntry>) => void
  deleteEvolution: (id: string) => void
  
  // Relationships
  addRelationship: (relationship: Omit<Relationship, 'id'>) => void
  updateRelationship: (id: string, updates: Partial<Relationship>) => void
  deleteRelationship: (id: string) => void
  
  // Animation
  setAnimation: (animationName: string) => void
  
  // Loading
  setLoading: (loading: boolean, progress?: number) => void
}

const defaultAppearance = {
  height: 0.5,
  weight: 0.5,
  muscle: 0.5,
  faceShape: 0.5,
  eyeSize: 0.5,
  eyeSpacing: 0.5,
  noseSize: 0.5,
  mouthSize: 0.5,
  skinTone: '#d4a574',
  hairColor: '#2a2a2a',
  eyeColor: '#4a6fa5',
  hairStyle: 'default',
  hairLength: 0.5
}

export const useCharacterStore = create<CharacterStore>()(
  persist(
    (set, get) => ({
      character: null,
      savedCharacters: [],
      isLoading: false,
      loadingProgress: 0,
      
      createCharacter: (name: string) => {
        const newCharacter: Character = {
          id: crypto.randomUUID(),
          name,
          age: 25,
          gender: 'other',
          appearance: { ...defaultAppearance },
          personality: {
            traits: '',
            customBoxes: []
          },
          memories: [],
          outfits: [],
          evolution: [],
          relationships: [],
          currentAnimation: 'idle',
          createdAt: Date.now(),
          updatedAt: Date.now()
        }
        set({ character: newCharacter })
        return newCharacter
      },
      
      loadCharacter: (id: string) => {
        const char = get().savedCharacters.find(c => c.id === id)
        if (char) {
          set({ character: { ...char } })
        }
      },
      
      updateCharacter: (updates: Partial<Character>) => {
        const current = get().character
        if (!current) return
        
        set({
          character: {
            ...current,
            ...updates,
            updatedAt: Date.now()
          }
        })
      },
      
      saveCharacter: () => {
        const current = get().character
        if (!current) return
        
        const saved = get().savedCharacters.filter(c => c.id !== current.id)
        set({
          savedCharacters: [...saved, { ...current, updatedAt: Date.now() }]
        })
      },
      
      deleteCharacter: (id: string) => {
        set({
          savedCharacters: get().savedCharacters.filter(c => c.id !== id),
          character: get().character?.id === id ? null : get().character
        })
      },
      
      updateAppearance: (key: string, value: number | string) => {
        const current = get().character
        if (!current) return
        
        set({
          character: {
            ...current,
            appearance: {
              ...current.appearance,
              [key]: value
            },
            updatedAt: Date.now()
          }
        })
      },
      
      addCustomBox: (name: string) => {
        const current = get().character
        if (!current) return
        
        const newBox: CustomPersonalityBox = {
          id: crypto.randomUUID(),
          name,
          content: ''
        }
        
        set({
          character: {
            ...current,
            personality: {
              ...current.personality,
              customBoxes: [...current.personality.customBoxes, newBox]
            },
            updatedAt: Date.now()
          }
        })
      },
      
      updateCustomBox: (id: string, content: string) => {
        const current = get().character
        if (!current) return
        
        set({
          character: {
            ...current,
            personality: {
              ...current.personality,
              customBoxes: current.personality.customBoxes.map(box =>
                box.id === id ? { ...box, content } : box
              )
            },
            updatedAt: Date.now()
          }
        })
      },
      
      removeCustomBox: (id: string) => {
        const current = get().character
        if (!current) return
        
        set({
          character: {
            ...current,
            personality: {
              ...current.personality,
              customBoxes: current.personality.customBoxes.filter(box => box.id !== id)
            },
            updatedAt: Date.now()
          }
        })
      },
      
      addMemory: (memory: Omit<Memory, 'id'>) => {
        const current = get().character
        if (!current) return
        
        const newMemory: Memory = {
          ...memory,
          id: crypto.randomUUID()
        }
        
        set({
          character: {
            ...current,
            memories: [...current.memories, newMemory],
            updatedAt: Date.now()
          }
        })
      },
      
      updateMemory: (id: string, updates: Partial<Memory>) => {
        const current = get().character
        if (!current) return
        
        set({
          character: {
            ...current,
            memories: current.memories.map(m =>
              m.id === id ? { ...m, ...updates } : m
            ),
            updatedAt: Date.now()
          }
        })
      },
      
      deleteMemory: (id: string) => {
        const current = get().character
        if (!current) return
        
        set({
          character: {
            ...current,
            memories: current.memories.filter(m => m.id !== id),
            updatedAt: Date.now()
          }
        })
      },
      
      toggleCoreMemory: (id: string) => {
        const current = get().character
        if (!current) return
        
        set({
          character: {
            ...current,
            memories: current.memories.map(m =>
              m.id === id ? { ...m, isCore: !m.isCore } : m
            ),
            updatedAt: Date.now()
          }
        })
      },
      
      addOutfit: (outfit: Omit<Outfit, 'id'>) => {
        const current = get().character
        if (!current) return
        
        const newOutfit: Outfit = {
          ...outfit,
          id: crypto.randomUUID()
        }
        
        set({
          character: {
            ...current,
            outfits: [...current.outfits, newOutfit],
            updatedAt: Date.now()
          }
        })
      },
      
      updateOutfit: (id: string, updates: Partial<Outfit>) => {
        const current = get().character
        if (!current) return
        
        set({
          character: {
            ...current,
            outfits: current.outfits.map(o =>
              o.id === id ? { ...o, ...updates } : o
            ),
            updatedAt: Date.now()
          }
        })
      },
      
      deleteOutfit: (id: string) => {
        const current = get().character
        if (!current) return
        
        set({
          character: {
            ...current,
            outfits: current.outfits.filter(o => o.id !== id),
            currentOutfitId: current.currentOutfitId === id ? undefined : current.currentOutfitId,
            updatedAt: Date.now()
          }
        })
      },
      
      equipOutfit: (id: string | undefined) => {
        const current = get().character
        if (!current) return
        
        set({
          character: {
            ...current,
            currentOutfitId: id,
            updatedAt: Date.now()
          }
        })
      },
      
      addEvolution: (entry: Omit<EvolutionEntry, 'id'>) => {
        const current = get().character
        if (!current) return
        
        const newEntry: EvolutionEntry = {
          ...entry,
          id: crypto.randomUUID()
        }
        
        set({
          character: {
            ...current,
            evolution: [...current.evolution, newEntry],
            updatedAt: Date.now()
          }
        })
      },
      
      updateEvolution: (id: string, updates: Partial<EvolutionEntry>) => {
        const current = get().character
        if (!current) return
        
        set({
          character: {
            ...current,
            evolution: current.evolution.map(e =>
              e.id === id ? { ...e, ...updates } : e
            ),
            updatedAt: Date.now()
          }
        })
      },
      
      deleteEvolution: (id: string) => {
        const current = get().character
        if (!current) return
        
        set({
          character: {
            ...current,
            evolution: current.evolution.filter(e => e.id !== id),
            updatedAt: Date.now()
          }
        })
      },
      
      addRelationship: (relationship: Omit<Relationship, 'id'>) => {
        const current = get().character
        if (!current) return
        
        const newRelationship: Relationship = {
          ...relationship,
          id: crypto.randomUUID()
        }
        
        set({
          character: {
            ...current,
            relationships: [...current.relationships, newRelationship],
            updatedAt: Date.now()
          }
        })
      },
      
      updateRelationship: (id: string, updates: Partial<Relationship>) => {
        const current = get().character
        if (!current) return
        
        set({
          character: {
            ...current,
            relationships: current.relationships.map(r =>
              r.id === id ? { ...r, ...updates } : r
            ),
            updatedAt: Date.now()
          }
        })
      },
      
      deleteRelationship: (id: string) => {
        const current = get().character
        if (!current) return
        
        set({
          character: {
            ...current,
            relationships: current.relationships.filter(r => r.id !== id),
            updatedAt: Date.now()
          }
        })
      },
      
      setAnimation: (animationName: string) => {
        const current = get().character
        if (!current) return
        
        set({
          character: {
            ...current,
            currentAnimation: animationName,
            updatedAt: Date.now()
          }
        })
      },
      
      setLoading: (loading: boolean, progress = 0) => {
        set({ isLoading: loading, loadingProgress: progress })
      }
    }),
    {
      name: 'character-creator-storage'
    }
  )
)
