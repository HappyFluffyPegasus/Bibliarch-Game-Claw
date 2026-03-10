import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Story, Character, Location, Scene, TimelineEvent, AppSettings } from '@/types'

interface AppState {
  // Data
  stories: Story[]
  characters: Character[]
  locations: Location[]
  scenes: Scene[]
  timelineEvents: TimelineEvent[]
  
  // Settings
  settings: AppSettings
  
  // Loading
  isLoading: boolean
  loadingMessage: string
  
  // Actions - Stories
  addStory: (story: Omit<Story, 'id' | 'createdAt' | 'updatedAt'>) => Story
  updateStory: (id: string, updates: Partial<Story>) => void
  deleteStory: (id: string) => void
  
  // Actions - Characters
  addCharacter: (character: Omit<Character, 'id' | 'createdAt' | 'updatedAt'>) => Character
  updateCharacter: (id: string, updates: Partial<Character>) => void
  deleteCharacter: (id: string) => void
  
  // Actions - Locations
  addLocation: (location: Omit<Location, 'id' | 'createdAt' | 'updatedAt'>) => Location
  updateLocation: (id: string, updates: Partial<Location>) => void
  deleteLocation: (id: string) => void
  
  // Actions - Scenes
  addScene: (scene: Omit<Scene, 'id' | 'createdAt'>) => Scene
  updateScene: (id: string, updates: Partial<Scene>) => void
  deleteScene: (id: string) => void
  
  // Actions - Timeline
  addTimelineEvent: (event: Omit<TimelineEvent, 'id'>) => TimelineEvent
  updateTimelineEvent: (id: string, updates: Partial<TimelineEvent>) => void
  deleteTimelineEvent: (id: string) => void
  moveTimelineEvent: (id: string, newStartTime: number) => void
  
  // Actions - Settings
  updateSettings: (settings: Partial<AppSettings>) => void
  
  // Actions - Loading
  setLoading: (isLoading: boolean, message?: string) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set, _get) => ({
      // Initial state
      stories: [],
      characters: [],
      locations: [],
      scenes: [],
      timelineEvents: [],
      
      settings: {
        theme: 'dark',
        musicVolume: 80,
        sfxVolume: 100,
        masterVolume: 100,
        graphicsQuality: 'high',
        autoSave: true,
        showTutorials: true
      },
      
      isLoading: false,
      loadingMessage: '',
      
      // Story actions
      addStory: (story) => {
        const newStory: Story = {
          ...story,
          id: crypto.randomUUID(),
          createdAt: Date.now(),
          updatedAt: Date.now()
        }
        set((state) => ({ stories: [...state.stories, newStory] }))
        return newStory
      },
      
      updateStory: (id, updates) => {
        set((state) => ({
          stories: state.stories.map((s) =>
            s.id === id ? { ...s, ...updates, updatedAt: Date.now() } : s
          )
        }))
      },
      
      deleteStory: (id) => {
        set((state) => ({
          stories: state.stories.filter((s) => s.id !== id),
          characters: state.characters.filter((c) => c.storyId !== id),
          locations: state.locations.filter((l) => l.storyId !== id),
          scenes: state.scenes.filter((s) => s.storyId !== id),
          timelineEvents: state.timelineEvents.filter((e) => e.storyId !== id)
        }))
      },
      
      // Character actions
      addCharacter: (character) => {
        const newCharacter: Character = {
          ...character,
          id: crypto.randomUUID(),
          createdAt: Date.now(),
          updatedAt: Date.now()
        }
        set((state) => ({ characters: [...state.characters, newCharacter] }))
        return newCharacter
      },
      
      updateCharacter: (id, updates) => {
        set((state) => ({
          characters: state.characters.map((c) =>
            c.id === id ? { ...c, ...updates, updatedAt: Date.now() } : c
          )
        }))
      },
      
      deleteCharacter: (id) => {
        set((state) => ({
          characters: state.characters.filter((c) => c.id !== id)
        }))
      },
      
      // Location actions
      addLocation: (location) => {
        const newLocation: Location = {
          ...location,
          id: crypto.randomUUID(),
          createdAt: Date.now(),
          updatedAt: Date.now()
        }
        set((state) => {
          // If this location has a parent, update parent's children array
          const newLocations = [...state.locations, newLocation]
          if (location.parentId) {
            return {
              locations: newLocations.map((l) =>
                l.id === location.parentId
                  ? { ...l, children: [...l.children, newLocation.id] }
                  : l
              )
            }
          }
          return { locations: newLocations }
        })
        return newLocation
      },
      
      updateLocation: (id, updates) => {
        set((state) => ({
          locations: state.locations.map((l) =>
            l.id === id ? { ...l, ...updates, updatedAt: Date.now() } : l
          )
        }))
      },
      
      deleteLocation: (id) => {
        set((state) => ({
          locations: state.locations.filter((l) => l.id !== id)
        }))
      },
      
      // Scene actions
      addScene: (scene) => {
        const newScene: Scene = {
          ...scene,
          id: crypto.randomUUID(),
          createdAt: Date.now()
        }
        set((state) => ({ scenes: [...state.scenes, newScene] }))
        return newScene
      },
      
      updateScene: (id, updates) => {
        set((state) => ({
          scenes: state.scenes.map((s) =>
            s.id === id ? { ...s, ...updates } : s
          )
        }))
      },
      
      deleteScene: (id) => {
        set((state) => ({
          scenes: state.scenes.filter((s) => s.id !== id)
        }))
      },
      
      // Timeline actions
      addTimelineEvent: (event) => {
        const newEvent: TimelineEvent = {
          ...event,
          id: crypto.randomUUID()
        }
        set((state) => ({ timelineEvents: [...state.timelineEvents, newEvent] }))
        return newEvent
      },
      
      updateTimelineEvent: (id, updates) => {
        set((state) => ({
          timelineEvents: state.timelineEvents.map((e) =>
            e.id === id ? { ...e, ...updates } : e
          )
        }))
      },
      
      deleteTimelineEvent: (id) => {
        set((state) => ({
          timelineEvents: state.timelineEvents.filter((e) => e.id !== id)
        }))
      },
      
      moveTimelineEvent: (id, newStartTime) => {
        set((state) => ({
          timelineEvents: state.timelineEvents.map((e) =>
            e.id === id ? { ...e, startTime: newStartTime } : e
          )
        }))
      },
      
      // Settings
      updateSettings: (settings) => {
        set((state) => ({
          settings: { ...state.settings, ...settings }
        }))
      },
      
      // Loading
      setLoading: (isLoading, message = '') => {
        set({ isLoading, loadingMessage: message })
      }
    }),
    {
      name: 'bibliarch-storage'
    }
  )
)
