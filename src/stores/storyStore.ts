import { create } from 'zustand'
import { db, type Story, type Character, type Location } from '@/db/database'
import { generateId } from '@/lib/utils'

interface StoryState {
  stories: Story[]
  currentStory: Story | null
  characters: Character[]
  locations: Location[]
  isLoading: boolean
  
  loadStories: () => Promise<void>
  createStory: (title: string, description?: string) => Promise<Story>
  loadStory: (id: string) => Promise<void>
  deleteStory: (id: string) => Promise<void>
  createCharacter: (storyId: string, name: string) => Promise<Character>
  createLocation: (storyId: string, name: string, type: Location['type']) => Promise<Location>
}

export const useStoryStore = create<StoryState>()((set, get) => ({
  stories: [],
  currentStory: null,
  characters: [],
  locations: [],
  isLoading: false,

  loadStories: async () => {
    const stories = await db.stories.orderBy('updatedAt').reverse().toArray()
    set({ stories })
  },

  createStory: async (title, description = '') => {
    const story: Story = {
      id: generateId(),
      title,
      description,
      createdAt: new Date(),
      updatedAt: new Date(),
      color: '#3b82f6',
      template: 'blank'
    }
    await db.stories.add(story)
    set(state => ({ stories: [story, ...state.stories] }))
    return story
  },

  loadStory: async (id) => {
    const story = await db.stories.get(id)
    if (!story) return
    
    const [characters, locations] = await Promise.all([
      db.characters.where('storyId').equals(id).toArray(),
      db.locations.where('storyId').equals(id).toArray()
    ])
    
    set({ currentStory: story, characters, locations })
  },

  deleteStory: async (id) => {
    await db.stories.delete(id)
    set(state => ({
      stories: state.stories.filter(s => s.id !== id),
      currentStory: state.currentStory?.id === id ? null : state.currentStory
    }))
  },

  createCharacter: async (storyId, name) => {
    const character: Character = {
      id: generateId(),
      storyId,
      name,
      appearance: { modelUrl: '', colors: {}, morphs: {} },
      personality: { traits: '', likes: '', dislikes: '', fears: '', dreams: '' },
      expressions: {},
      createdAt: new Date(),
      updatedAt: new Date()
    }
    await db.characters.add(character)
    set(state => ({ characters: [...state.characters, character] }))
    return character
  },

  createLocation: async (storyId, name, type) => {
    const location: Location = {
      id: generateId(),
      storyId,
      parentId: null,
      name,
      type,
      description: '',
      position: { x: 0, y: 0, z: 0 },
      createdAt: new Date(),
      updatedAt: new Date()
    }
    await db.locations.add(location)
    set(state => ({ locations: [...state.locations, location] }))
    return location
  }
}))
