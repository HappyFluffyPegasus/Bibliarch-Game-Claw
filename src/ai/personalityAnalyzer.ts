import { db, type SecretPersonalityProfile } from '@/db/database'

// 100+ Personality Presets
export const PERSONALITY_PRESETS = {
  // Social types
  social: ['introvert', 'extrovert', 'ambivert', 'social_butterfly', 'loner', 'observer', 'leader', 'follower'],
  // Interest types
  interest: ['foodie', 'tech_nerd', 'history_nerd', 'bookworm', 'artist', 'musician', 'athlete', 'gamer'],
  // Emotional types
  emotional: ['optimist', 'pessimist', 'empath', 'anxious', 'confident', 'dramatic', 'chill'],
  // Behavioral types
  behavioral: ['organized', 'messy', 'punctual', 'late', 'risk_taker', 'cautious', 'workaholic']
}

// Big 5 Trait Analysis
interface Big5Scores {
  extraversion: number
  neuroticism: number
  openness: number
  agreeableness: number
  conscientiousness: number
}

// Cognitive Functions
type CognitiveFunction = 'ti' | 'te' | 'fi' | 'fe' | 'ni' | 'ne' | 'si' | 'se'

export class PersonalityAnalyzer {
  // Extract presets from user text
  extractPresets(text: string): string[] {
    const presets: string[] = []
    const lower = text.toLowerCase()
    
    // Social patterns
    if (lower.includes('shy') || lower.includes('quiet') || lower.includes('alone')) presets.push('introvert')
    if (lower.includes('outgoing') || lower.includes('party') || lower.includes('social')) presets.push('extrovert')
    
    // Interest patterns
    if (lower.includes('food') || lower.includes('cook') || lower.includes('eat')) presets.push('foodie')
    if (lower.includes('tech') || lower.includes('computer') || lower.includes('code')) presets.push('tech_nerd')
    if (lower.includes('book') || lower.includes('read') || lower.includes('story')) presets.push('bookworm')
    if (lower.includes('art') || lower.includes('draw') || lower.includes('paint')) presets.push('artist')
    if (lower.includes('music') || lower.includes('sing') || lower.includes('play')) presets.push('musician')
    if (lower.includes('sport') || lower.includes('run') || lower.includes('gym')) presets.push('athlete')
    if (lower.includes('game') || lower.includes('play')) presets.push('gamer')
    
    // Emotional patterns
    if (lower.includes('happy') || lower.includes('positive')) presets.push('optimist')
    if (lower.includes('anxious') || lower.includes('worry') || lower.includes('nervous')) presets.push('anxious')
    if (lower.includes('confident') || lower.includes('brave')) presets.push('confident')
    
    // Behavioral patterns
    if (lower.includes('organized') || lower.includes('clean') || lower.includes('neat')) presets.push('organized')
    if (lower.includes('messy') || lower.includes('chaos')) presets.push('messy')
    
    return presets.length > 0 ? presets : ['balanced']
  }
  
  // Calculate Big 5 from text and presets
  calculateBig5(text: string, presets: string[]): Big5Scores {
    const lower = text.toLowerCase()
    let scores: Big5Scores = {
      extraversion: 50,
      neuroticism: 50,
      openness: 50,
      agreeableness: 50,
      conscientiousness: 50
    }
    
    // Adjust based on presets
    if (presets.includes('introvert')) scores.extraversion -= 30
    if (presets.includes('extrovert')) scores.extraversion += 30
    if (presets.includes('anxious')) scores.neuroticism += 25
    if (presets.includes('confident')) scores.neuroticism -= 20
    if (presets.includes('bookworm') || presets.includes('artist')) scores.openness += 25
    if (presets.includes('organized')) scores.conscientiousness += 30
    if (presets.includes('messy')) scores.conscientiousness -= 25
    
    // Text analysis adjustments
    if (lower.includes('creative') || lower.includes('imagination')) scores.openness += 15
    if (lower.includes('lazy') || lower.includes('procrastinate')) scores.conscientiousness -= 20
    
    // Clamp to 0-100
    return {
      extraversion: Math.max(0, Math.min(100, scores.extraversion)),
      neuroticism: Math.max(0, Math.min(100, scores.neuroticism)),
      openness: Math.max(0, Math.min(100, scores.openness)),
      agreeableness: Math.max(0, Math.min(100, scores.agreeableness)),
      conscientiousness: Math.max(0, Math.min(100, scores.conscientiousness))
    }
  }
  
  // Generate Big 5 code (R/C/uE[I] format)
  generateBig5Code(scores: Big5Scores): string {
    const r = scores.extraversion < 30 ? 'R' : scores.extraversion < 50 ? 'r' : scores.extraversion > 80 ? 'S' : 's'
    const c = scores.neuroticism < 30 ? 'C' : scores.neuroticism < 50 ? 'c' : scores.neuroticism > 80 ? 'E' : 'e'
    const o = scores.openness > 70 ? 'O' : scores.openness > 50 ? 'o' : 't'
    const a = scores.agreeableness > 70 ? 'A' : scores.agreeableness > 50 ? 'a' : 'd'
    const n = scores.conscientiousness < 30 ? 'N' : scores.conscientiousness < 50 ? 's' : 'O'
    
    return `${r}/${c}/${o}[${a}]/${n}`
  }
  
  // Infer cognitive function stack
  inferCognitiveStack(scores: Big5Scores, presets: string[]): { dominant: CognitiveFunction, auxiliary: CognitiveFunction, tertiary: CognitiveFunction, inferior: CognitiveFunction } {
    // Simplified inference based on Big 5
    let dominant: CognitiveFunction = 'ne'
    let auxiliary: CognitiveFunction = 'fi'
    
    if (scores.extraversion > 60) {
      // Extroverted types
      if (scores.openness > 60) {
        dominant = 'ne'
        auxiliary = 'fi'
      } else {
        dominant = 'te'
        auxiliary = 'si'
      }
    } else {
      // Introverted types
      if (scores.openness > 60) {
        dominant = 'ni'
        auxiliary = 'fe'
      } else {
        dominant = 'ti'
        auxiliary = 'ne'
      }
    }
    
    // Infer tertiary and inferior (simplified)
    const allFunctions: CognitiveFunction[] = ['ti', 'te', 'fi', 'fe', 'ni', 'ne', 'si', 'se']
    const remaining = allFunctions.filter(f => f !== dominant && f !== auxiliary)
    
    return {
      dominant,
      auxiliary,
      tertiary: remaining[0],
      inferior: remaining[1]
    }
  }
  
  // Generate behavior weights
  calculateBehaviorWeights(scores: Big5Scores, presets: string[]): Record<string, number> {
    return {
      socialInitiation: scores.extraversion / 100,
      emotionalStability: (100 - scores.neuroticism) / 100,
      creativity: scores.openness / 100,
      cooperation: scores.agreeableness / 100,
      organization: scores.conscientiousness / 100,
      riskTaking: (scores.openness * 0.5 + (100 - scores.conscientiousness) * 0.5) / 100,
      spontaneity: (100 - scores.conscientiousness) / 100,
      empathy: scores.agreeableness / 100,
      assertiveness: scores.extraversion / 100,
      attentionToDetail: scores.conscientiousness / 100
    }
  }
  
  // Main analysis function
  async analyzeCharacter(characterId: string): Promise<void> {
    const character = await db.characters.get(characterId)
    if (!character) return
    
    const text = `${character.personality.traits} ${character.personality.likes} ${character.personality.dislikes} ${character.personality.fears} ${character.personality.dreams}`
    
    const presets = this.extractPresets(text)
    const big5 = this.calculateBig5(text, presets)
    const big5Code = this.generateBig5Code(big5)
    const cognitiveStack = this.inferCognitiveStack(big5, presets)
    const behaviorWeights = this.calculateBehaviorWeights(big5, presets)
    
    const profile: SecretPersonalityProfile = {
      id: crypto.randomUUID(),
      characterId,
      presets,
      big5,
      big5Code,
      cognitiveStack,
      stackCode: `${cognitiveStack.dominant}-${cognitiveStack.auxiliary}-${cognitiveStack.tertiary}-${cognitiveStack.inferior}`,
      behaviorWeights,
      confidence: 0.75,
      lastAnalyzed: new Date()
    }
    
    await db.secretProfiles.put(profile)
  }
  
  // Get behavior weights for Life Mode
  async getBehaviorWeights(characterId: string): Promise<Record<string, number>> {
    const profile = await db.secretProfiles.where('characterId').equals(characterId).first()
    return profile?.behaviorWeights || {}
  }
}

export const personalityAnalyzer = new PersonalityAnalyzer()
