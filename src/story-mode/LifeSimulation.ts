import { useStoryStore } from '@/stores/storyStore'
import { personalityAnalyzer } from '@/ai/personalityAnalyzer'

// Needs System (Sims-style)
export interface CharacterNeeds {
  hunger: number        // 0-100, decays over time
  energy: number        // 0-100, decays while awake
  social: number        // 0-100, decays, fulfilled by interaction
  fun: number          // 0-100, decays, fulfilled by entertainment
  bladder: number      // 0-100, decays
  hygiene: number      // 0-100, decays
  comfort: number      // 0-100, decays in uncomfortable situations
}

// Life Mode Event Types
export type LifeEventType = 'action' | 'minor_event' | 'major_event'

export interface LifeEvent {
  id: string
  type: LifeEventType
  characters: string[]
  locationId: string
  description: string
  timestamp: number
  needsImpact: Partial<CharacterNeeds>
}

// Autonomous Action System
export interface AutonomousAction {
  id: string
  name: string
  needFulfilled: keyof CharacterNeeds
  fulfillmentAmount: number
  duration: number      // in game minutes
  location: string
}

const AUTONOMOUS_ACTIONS: AutonomousAction[] = [
  { id: 'eat', name: 'Eat', needFulfilled: 'hunger', fulfillmentAmount: 40, duration: 30, location: 'kitchen' },
  { id: 'sleep', name: 'Sleep', needFulfilled: 'energy', fulfillmentAmount: 50, duration: 480, location: 'bedroom' },
  { id: 'shower', name: 'Shower', needFulfilled: 'hygiene', fulfillmentAmount: 60, duration: 15, location: 'bathroom' },
  { id: 'chat', name: 'Chat with someone', needFulfilled: 'social', fulfillmentAmount: 25, duration: 20, location: 'any' },
  { id: 'watch_tv', name: 'Watch TV', needFulfilled: 'fun', fulfillmentAmount: 20, duration: 60, location: 'living_room' },
  { id: 'read', name: 'Read a book', needFulfilled: 'fun', fulfillmentAmount: 25, duration: 90, location: 'library' },
  { id: 'exercise', name: 'Exercise', needFulfilled: 'fun', fulfillmentAmount: 30, duration: 45, location: 'gym' },
  { id: 'nap', name: 'Take a nap', needFulfilled: 'energy', fulfillmentAmount: 20, duration: 60, location: 'any' },
]

// MAJOR Events (Story-shaping)
const MAJOR_EVENT_TEMPLATES = [
  { id: 'first_meeting', name: 'First Meeting', description: 'Two characters meet for the first time', minRelationship: 0 },
  { id: 'romantic_confession', name: 'Romantic Confession', description: 'A character confesses their feelings', minRelationship: 50 },
  { id: 'argument', name: 'Big Argument', description: 'Characters have a major fight', minRelationship: -30 },
  { id: 'breakup', name: 'Breakup', description: 'A relationship ends', minRelationship: -50 },
  { id: 'discovery', name: 'Major Discovery', description: 'Character finds something important', minRelationship: 0 },
]

// MINOR Events (Immersion)
const MINOR_EVENT_TEMPLATES = [
  { id: 'coffee_chat', name: 'Coffee Chat', description: 'Characters chat over coffee' },
  { id: 'study_together', name: 'Study Together', description: 'Characters study or work together' },
  { id: 'movie_night', name: 'Movie Night', description: 'Characters watch a movie' },
  { id: 'small_argument', name: 'Small Argument', description: 'Minor disagreement about something trivial' },
  { id: 'compliment', name: 'Compliment', description: 'One character compliments another' },
]

export class LifeSimulation {
  private gameTime: number = 0  // in minutes
  private isRunning: boolean = false
  private characters: Map<string, CharacterNeeds> = new Map()
  private intervalId: number | null = null
  
  // Initialize character needs
  initializeCharacter(characterId: string) {
    this.characters.set(characterId, {
      hunger: 80,
      energy: 90,
      social: 70,
      fun: 70,
      bladder: 90,
      hygiene: 80,
      comfort: 75
    })
  }
  
  // Start simulation
  start() {
    if (this.isRunning) return
    this.isRunning = true
    
    this.intervalId = window.setInterval(() => {
      this.tick()
    }, 1000) // 1 real second = 1 game minute
  }
  
  // Stop simulation
  stop() {
    this.isRunning = false
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = null
    }
  }
  
  // One game tick
  private tick() {
    this.gameTime++
    
    // Decay needs for all characters
    this.characters.forEach((needs, characterId) => {
      // Apply decay rates
      needs.hunger = Math.max(0, needs.hunger - 0.5)
      needs.energy = Math.max(0, needs.energy - 0.3)
      needs.social = Math.max(0, needs.social - 0.4)
      needs.fun = Math.max(0, needs.fun - 0.4)
      needs.bladder = Math.max(0, needs.bladder - 0.3)
      needs.hygiene = Math.max(0, needs.hygiene - 0.2)
      needs.comfort = Math.max(0, needs.comfort - 0.1)
      
      // Check for critical needs (trigger actions)
      this.checkCriticalNeeds(characterId, needs)
      
      // Random event chance (every 30 minutes)
      if (this.gameTime % 30 === 0) {
        this.rollForEvent(characterId)
      }
    })
  }
  
  // Check if any needs are critical and trigger actions
  private checkCriticalNeeds(characterId: string, needs: CharacterNeeds) {
    // Find lowest need
    const entries = Object.entries(needs) as [keyof CharacterNeeds, number][]
    const lowest = entries.reduce((min, curr) => curr[1] < min[1] ? curr : min)
    
    if (lowest[1] < 30) {
      // Trigger autonomous action to fulfill need
      this.triggerAutonomousAction(characterId, lowest[0])
    }
  }
  
  // Trigger an autonomous action
  private triggerAutonomousAction(characterId: string, need: keyof CharacterNeeds) {
    const action = AUTONOMOUS_ACTIONS.find(a => a.needFulfilled === need)
    if (action) {
      console.log(`[LifeMode] Character ${characterId} performs: ${action.name}`)
      // In real implementation, this would update the character's needs
    }
  }
  
  // Roll for random event
  private rollForEvent(characterId: string) {
    const roll = Math.random()
    
    if (roll < 0.05) {
      // 5% chance for MAJOR event
      this.triggerMajorEvent(characterId)
    } else if (roll < 0.20) {
      // 15% chance for MINOR event
      this.triggerMinorEvent(characterId)
    }
    // Otherwise, just background action (no notification)
  }
  
  // Trigger MAJOR event
  private triggerMajorEvent(characterId: string) {
    const event = MAJOR_EVENT_TEMPLATES[Math.floor(Math.random() * MAJOR_EVENT_TEMPLATES.length)]
    console.log(`[LifeMode] MAJOR EVENT: ${event.name} - ${event.description}`)
    // In real implementation, this would show the event preview modal
  }
  
  // Trigger MINOR event
  private triggerMinorEvent(characterId: string) {
    const event = MINOR_EVENT_TEMPLATES[Math.floor(Math.random() * MINOR_EVENT_TEMPLATES.length)]
    console.log(`[LifeMode] Minor event: ${event.name}`)
    // In real implementation, this would show a subtle notification
  }
  
  // Get current game time
  getGameTime(): { day: number, hour: number, minute: number } {
    return {
      day: Math.floor(this.gameTime / 1440) + 1,
      hour: Math.floor((this.gameTime % 1440) / 60),
      minute: this.gameTime % 60
    }
  }
  
  // Get character needs
  getCharacterNeeds(characterId: string): CharacterNeeds | undefined {
    return this.characters.get(characterId)
  }
}

export const lifeSimulation = new LifeSimulation()
