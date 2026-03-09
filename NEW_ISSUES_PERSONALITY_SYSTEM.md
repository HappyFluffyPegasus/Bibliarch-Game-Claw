# NEW GitHub Issues for Personality System & Life Mode Architecture

## Issue 94: [P0] Secret Personality Preset System - 100+ AI-Selected Presets

### Overview
Behind-the-scenes personality system that the AI uses to determine character behavior. Users don't see these presets directly - they're secret weights that drive autonomous behavior.

### User Stories

**Story 1:**
> As the AI system, I want to select from 100+ personality presets (Foodie, Tech Nerd, History Nerd, Bookworm, Athlete, Artist, etc.) so that characters have diverse behavioral tendencies.

**Story 2:**
> As the AI system, I want to assign multiple presets to a single character so that personalities are complex and multi-dimensional.

**Story 3:**
> As the AI system, I want presets to influence autonomous action selection so that a Foodie character seeks cooking activities.

**Story 4:**
> As the AI system, I want presets to affect social interaction preferences so that an Introvert avoids large gatherings.

### Preset Categories (100+ total)

**Social Types (20+):**
- Introvert, Extrovert, Ambivert
- Social Butterfly, Loner, Observer
- Leader, Follower, Mediator
- Gossiper, Secret Keeper

**Interest Types (40+):**
- Foodie, Chef, Picky Eater
- Tech Nerd, Gamer, Programmer
- History Nerd, Archaeology Buff
- Bookworm, Writer, Poet
- Artist, Painter, Sculptor
- Musician, Singer, Dancer
- Athlete, Gym Rat, Couch Potato
- Fashionista, Trendsetter
- Nature Lover, Gardener, Animal Lover
- Science Nerd, Space Enthusiast
- Philosophy Buff, Deep Thinker
- Politics Nerd, Activist
- Business Minded, Entrepreneur
- Spiritual, Religious, Skeptic

**Emotional Types (20+):**
- Optimist, Pessimist, Realist
- Empath, Cold, Supportive
- Drama Queen, Chill, Intense
- Romantic, Pragmatic, Dreamer
- Anxious, Confident, Insecure

**Behavioral Types (20+):**
- Organized, Messy, Chaotic
- Punctual, Late, Time Blind
- Frugal, Spendthrift, Balanced
- Risk Taker, Cautious, Calculated
- Workaholic, Procrastinator, Balanced
- Clean Freak, Messy, Moderate

### Acceptance Criteria
- [ ] 100+ preset definitions created
- [ ] Preset-to-action mapping system
- [ ] Multiple presets per character allowed
- [ ] Preset conflict resolution (e.g., Introvert + Social Butterfly)
- [ ] Preset influence on need priorities
- [ ] Hidden from user (AI-only)

---

## Issue 95: [P0] Big 5 Typology System - R/C/uE[I] Format

### Overview
Secret Big 5 personality assessment stored as weighted codes. The AI uses this to understand character behavior patterns.

### User Stories

**Story 1:**
> As the AI system, I want to weigh characters on Big 5 traits (Openness, Conscientiousness, Extraversion, Agreeableness, Neuroticism) so that I can predict their behavior.

**Story 2:**
> As the AI system, I want to encode Big 5 as R/C/uE[I] format so that personality can be quickly processed.

**Story 3:**
> As the AI system, I want extreme scores (high/low) to strongly influence behavior so that very Reserved characters almost never initiate social contact.

**Story 4:**
> As the AI system, I want moderate scores to allow flexibility so that balanced characters have varied behavior.

### Big 5 Traits (0-100 scale each)

**R - Reserved vs Social (Extraversion inverse)**
- 0-20: R (Heavily Reserved) - Avoids social, prefers solitude
- 21-40: r (Moderately Reserved) - Selective socializing
- 41-60: Neutral - Balanced
- 61-80: s (Moderately Social) - Enjoys company
- 81-100: S (Heavily Social) - Craves constant interaction

**C - Calm vs Emotional (Neuroticism inverse)**
- 0-20: C (Very Calm) - Unflappable
- 21-40: c (Generally Calm) - Rarely stressed
- 41-60: Neutral
- 61-80: e (Emotional) - Frequently emotional
- 81-100: E (Very Emotional) - Highly reactive

**O - Open vs Traditional (Openness)**
- 0-20: T (Traditional) - Prefers familiar
- 21-40: t (Slightly Traditional)
- 41-60: Neutral
- 61-80: o (Open) - Likes novelty
- 81-100: O (Very Open) - Craves new experiences

**A - Agreeable vs Challenging (Agreeableness)**
- 0-20: D (Disagreeable) - Argumentative
- 21-40: d (Slightly Challenging)
- 41-60: Neutral
- 61-80: a (Agreeable) - Cooperative
- 81-100: A (Very Agreeable) - Conflict-avoidant

**N - Organized vs Spontaneous (Conscientiousness inverse)**
- 0-20: O (Organized) - Highly structured
- 21-40: o (Generally Organized)
- 41-60: Neutral
- 61-80: s (Spontaneous) - Flexible
- 81-100: S (Very Spontaneous) - Chaotic

### Examples
- "R/C/o[A]" = Reserved, Calm, Open, Very Agreeable, Organized
- "S/e/O/d[N]" = Social, Emotional, Very Open, Disagreeable, Spontaneous

### Acceptance Criteria
- [ ] Big 5 scoring system (0-100 per trait)
- [ ] Code generation (R/C/uE[I] format)
- [ ] Behavior weighting based on extremes
- [ ] Combination with presets for final behavior
- [ ] Stored in character database (hidden field)

---

## Issue 96: [P0] Cognitive Function Stack System - ti-ne-si-fe

### Overview
Secret cognitive function stack (MBTI-based) that determines HOW characters think and process information. Functions are ordered by strength.

### User Stories

**Story 1:**
> As the AI system, I want to determine a character's cognitive function stack so that I know their primary mode of thinking.

**Story 2:**
> As the AI system, I want functions ordered by strength (Dominant > Auxiliary > Tertiary > Inferior) so that decision-making follows realistic patterns.

**Story 3:**
> As the AI system, I want function strength to affect dialogue style so that Ti-dominant characters speak in precise, logical ways.

**Story 4:**
> As the AI system, I want the inferior function to be rarely used but possible under stress so that characters have growth potential.

### Cognitive Functions

**Thinking Functions (Decision Making):**
- **Ti (Introverted Thinking)** - Internal logic, precision, analysis
  - Speaks: "That doesn't make sense because..."
  - Decides based on internal consistency
  
- **Te (Extroverted Thinking)** - External efficiency, organization, results
  - Speaks: "The most effective solution is..."
  - Decides based on objective outcomes

**Feeling Functions (Values):**
- **Fi (Introverted Feeling)** - Internal values, authenticity, individuality
  - Speaks: "I feel strongly that..."
  - Decides based on personal values
  
- **Fe (Extroverted Feeling)** - External harmony, social values, others' feelings
  - Speaks: "How will this affect everyone?"
  - Decides based on group impact

**Intuition Functions (Possibilities):**
- **Ni (Introverted Intuition)** - Internal insights, patterns, future vision
  - Speaks: "I sense that this means..."
  - Focuses on deep meaning and implications
  
- **Ne (Extroverted Intuition)** - External possibilities, brainstorming, connections
  - Speaks: "What if we tried..."
  - Generates multiple options

**Sensing Functions (Reality):**
- **Si (Introverted Sensing)** - Internal memory, tradition, details
  - Speaks: "Based on what happened before..."
  - Relies on past experience
  
- **Se (Extroverted Sensing)** - External experience, action, present moment
  - Speaks: "Let's just do it!"
  - Focuses on immediate reality

### Function Stack Format
Format: DOMINANT-AUXILIARY-TERTIARY-INFERIOR

Examples:
- "ti-ne-si-fe" = Ti-dom, Ne-aux, Si-tert, Fe-inf (INTP-like)
- "fi-se-ni-te" = Fi-dom, Se-aux, Ni-tert, Te-inf (ISFP-like)
- "fe-si-ne-ti" = Fe-dom, Si-aux, Ne-tert, Ti-inf (ESFJ-like)

### Acceptance Criteria
- [ ] 8 cognitive function definitions
- [ ] Stack generation (ordered by strength)
- [ ] Function-to-dialogue-style mapping
- [ ] Function-to-decision-pattern mapping
- [ ] Stress mode (inferior function activation)
- [ ] Stored in character database (hidden)

---

## Issue 97: [P0] Function Probability Engine

### Overview
System that determines which cognitive function a character uses in any given scenario based on their stack.

### User Stories

**Story 1:**
> As the AI system, I want dominant functions to have 70-80% usage probability so that characters have consistent thinking patterns.

**Story 2:**
> As the AI system, I want auxiliary functions to have 15-20% usage probability so that characters can adapt when needed.

**Story 3:**
> As the AI system, I want tertiary functions to have 4-8% usage probability so that characters show occasional growth moments.

**Story 4:**
> As the AI system, I want inferior functions to have 1-3% usage probability (but possible) so that characters can have breakthrough/Stress moments.

**Story 5:**
> As the AI system, I want stress to temporarily flip probabilities so that inferior functions emerge under pressure.

### Probability Matrix

**Normal State:**
| Function Position | Probability Range |
|-------------------|-------------------|
| Dominant (1st)    | 70-80%            |
| Auxiliary (2nd)   | 15-20%            |
| Tertiary (3rd)    | 4-8%              |
| Inferior (4th)    | 1-3%              |

**Stress State:**
| Function Position | Probability Range |
|-------------------|-------------------|
| Dominant (1st)    | 40-50%            |
| Auxiliary (2nd)   | 10-15%            |
| Tertiary (3rd)   | 5-10%             |
| Inferior (4th)    | 25-35%            |

### Example Scenario

Character with stack: "ti-ne-si-fe"

**Normal decision about a problem:**
- Ti (75%): "Let me analyze the logic..."
- Ne (18%): "Or we could look at it this way..."
- Si (5%): "Last time something similar..."
- Fe (2%): "But how will people feel?"

**Stressed decision about a problem:**
- Ti (45%): "I can't think clearly..."
- Fe (30%): "Everyone's upset! I need to fix this!"
- Ne (15%): "What if everything falls apart?"
- Si (10%): "Remember when this went wrong before..."

### Acceptance Criteria
- [ ] Probability calculation system
- [ ] Stress detection (low needs, negative events)
- [ ] Dynamic probability adjustment
- [ ] Function selection for dialogue generation
- [ ] Function selection for action decisions
- [ ] Logging for debugging

---

## Issue 98: [P1] Needs System (Sims-Style)

### Overview
Standard needs system that drives autonomous actions. Characters seek to fulfill needs automatically.

### User Stories

**Story 1:**
> As a character, I want to have needs (Hunger, Energy, Social, Fun, etc.) so that my behavior is motivated.

**Story 2:**
> As a character, I want to autonomously seek to fulfill low needs so that I survive and thrive.

**Story 3:**
> As a character, I want personality to affect need decay rates so that athletes lose Energy faster but gain Fun from exercise.

**Story 4:**
> As a player, I want to see character need levels so that I understand their current state.

### Needs (0-100 scale)

**Physical Needs:**
- **Hunger** - Decays over time, fulfilled by eating
- **Energy** - Decays while awake, fulfilled by sleeping
- **Bladder** - Decays, fulfilled by bathroom
- **Hygiene** - Decays, fulfilled by showering

**Social Needs:**
- **Social** - Decays, fulfilled by interaction
- **Romance** - Decays for romantic characters, fulfilled by relationships
- **Family** - Decays, fulfilled by family time

**Mental Needs:**
- **Fun** - Decays, fulfilled by entertainment
- **Creativity** - Decays for artistic characters, fulfilled by creating
- **Knowledge** - Decays for intellectual characters, fulfilled by learning

**Emotional Needs:**
- **Comfort** - Decays, fulfilled by relaxing
- **Safety** - Decays in dangerous situations
- **Esteem** - Decays, fulfilled by achievement

### Need Decay Rates (Modified by Personality)

**Base Decay (per game hour):**
- Hunger: -5
- Energy: -3 (awake), +10 (sleeping)
- Bladder: -4
- Hygiene: -2
- Social: -3
- Fun: -4
- Creativity: -2 (0 for non-artists)
- Knowledge: -2 (0 for non-intellectuals)

**Personality Modifiers:**
- Gym Rat: Energy drains +50% faster, gains more Fun from exercise
- Social Butterfly: Social drains +100% faster
- Introvert: Social drains -50% slower
- Intellectual: Knowledge drains +100% faster
- Artist: Creativity drains +100% faster

### Acceptance Criteria
- [ ] 10+ need types defined
- [ ] Need decay system (time-based)
- [ ] Need fulfillment actions
- [ ] Personality modifiers
- [ ] Visual need meters in UI
- [ ] Critical need alerts (red meters)

---

## Issue 99: [P0] MAJOR Events System - Story-Shaping Cutscenes

### Overview
MAJOR EVENTS are cutscenes that trigger upon important interactions and shape the entire story. These are NOT background actions - they're foreground narrative moments.

### User Stories

**Story 1:**
> As a story creator, I want MAJOR EVENTS to trigger at pivotal moments so that the story progresses meaningfully.

**Story 2:**
> As a player, I want MAJOR EVENTS to be unskippable (or have consequences for skipping) so that I don't miss critical plot points.

**Story 3:**
> As a player, I want MAJOR EVENTS to be cinematic with full dialogue so that they feel important.

**Story 4:**
> As a story creator, I want MAJOR EVENTS to permanently alter character relationships and world state so that choices matter.

### Major Event Examples

**Relationship Milestones:**
- First Meeting (meaningful encounter between future important characters)
- First Kiss (romantic relationship escalation)
- Proposal (commitment moment)
- Wedding (union ceremony)
- Divorce Event (relationship ending after buildup)
- Betrayal Discovery (finding out about infidelity)
- Reconciliation (forgiveness moment)

**Plot Milestones:**
- The Discovery (finding a key that unlocks secret door)
- The Revelation (learning a truth that changes everything)
- The Confrontation (face-off with antagonist)
- The Sacrifice (character gives up something important)
- The Victory (defeating major obstacle)
- The Loss (character death or major failure)
- The Return (coming back changed)

**Character Arc Milestones:**
- Breaking Point (character snaps under pressure)
- Turning Point (character changes direction)
- Moment of Truth (character must decide who they are)
- Act of Courage (overcoming fear)
- Fall from Grace (losing status/position)
- Redemption (making up for past mistakes)

### Major Event Structure

```typescript
interface MajorEvent {
  id: string
  type: 'relationship' | 'plot' | 'character_arc'
  title: string
  description: string
  
  // Triggers
  triggerConditions: {
    relationshipLevel?: number  // For relationship events
    plotPoint?: string          // For plot events
    characterState?: string     // For character arc events
    location?: string
    timeOfDay?: string
    prerequisites: string[]     // Previous events required
  }
  
  // Participants
  requiredCharacters: string[]
  optionalCharacters: string[]
  
  // Content
  dialogue: DialogueNode[]
  cutscene: CutsceneConfig
  
  // Consequences (PERMANENT)
  consequences: {
    relationshipChanges: Array<{
      characterIds: [string, string]
      change: number  // +20, -30, etc.
      type: 'romance' | 'friendship' | 'rivalry'
    }>
    characterChanges: Array<{
      characterId: string
      traitChanges: Record<string, number>
      memoryAdded?: Memory
    }>
    worldChanges: Array<{
      locationId?: string
      eventFlag?: string
      questStatus?: string
    }>
    newEventsUnlocked: string[]
    branchesCreated: string[]
  }
  
  // One-time only
  canRepeat: false
}
```

### Acceptance Criteria
- [ ] Major event trigger system
- [ ] Cutscene presentation (cinematic mode)
- [ ] Full dialogue trees
- [ ] Permanent consequence system
- [ ] Character relationship alterations
- [ ] World state changes
- [ ] Event prerequisite checking
- [ ] Event unlock system
- [ ] Cannot be easily skipped (or tracks if skipped)

---

## Issue 100: [P1] MINOR Events System - Immersion & Dialogue

### Overview
MINOR EVENTS add immersion and dialogue without significantly altering the plot. They're the "flavor" of daily life.

### User Stories

**Story 1:**
> As a player, I want MINOR EVENTS to happen regularly so that characters feel alive.

**Story 2:**
> As a player, I want MINOR EVENTS to be skippable without consequence so that I can focus on major story beats.

**Story 3:**
> As a player, I want MINOR EVENTS to show character personality so that I learn about them through daily interactions.

**Story 4:**
> As a story creator, I want MINOR EVENTS to be auto-generated based on character traits so that I don't have to write every small interaction.

### Minor Event Examples

**Social Interactions:**
- Characters hanging out at a cafe
- Two friends having lunch together
- Family dinner conversation
- Characters bumping into each other (literally)
- Small talk while waiting in line

**Relationship Development:**
- Casual date (coffee, movie)
- Study session together
- Working out together
- Cooking together
- Shopping trip

**Conflict (Minor):**
- Argument about favorite movie
- Disagreement about where to eat
- Sibling bickering
- Minor jealousy moment
- Parent nagging about chores

**Daily Life:**
- Morning routine interactions
- Commute conversations
- Work/school small talk
- Evening wind-down chats
- Weekend activity planning

**Personality Moments:**
- Foodie discovering new restaurant
- Bookworm recommending book
- Gamer inviting to play
- Artist showing latest work
- Athlete suggesting workout

### Minor Event Structure

```typescript
interface MinorEvent {
  id: string
  type: 'social' | 'relationship' | 'conflict' | 'daily' | 'personality'
  
  // Lower stakes than Major
  importance: 'background' | 'foreground'
  
  // Triggers
  triggerConditions: {
    characterTraits?: string[]
    relationshipLevel?: { min: number; max: number }
    location?: string
    timeOfDay?: string
    randomChance: number  // 0.1 = 10% chance when conditions met
  }
  
  // Participants
  characters: string[]
  
  // Content (simpler than Major)
  dialogue: string[]  // Simpler back-and-forth
  duration: number    // In-game minutes
  
  // Consequences (MINOR)
  consequences: {
    relationshipChange?: number  // Small: +1 to +5
    needFulfillment?: Record<string, number>
    memoryCreated?: boolean
  }
  
  // Can repeat
  canRepeat: true
  cooldown: number  // Hours before can trigger again
}
```

### Acceptance Criteria
- [ ] Minor event trigger system (lower threshold than Major)
- [ ] Auto-generation from personality presets
- [ ] Simple dialogue (not full cutscene)
- [ ] Skippable without consequence
- [ ] Frequency controls (player can adjust)
- [ ] Cooldown system (don't spam same event)
- [ ] Background/foreground toggle (some interrupt, some don't)

---

## Issue 101: [P0] Actions vs Events Distinction System

### Overview
Clear technical and UX distinction between:
- **ACTIONS** = Background autonomous behavior (Sims-style)
- **MINOR EVENTS** = Small foreground moments (skippable)
- **MAJOR EVENTS** = Story-shaping cutscenes (unmissable)

### User Stories

**Story 1:**
> As a player, I want to visually distinguish between background actions and foreground events so that I know what's important.

**Story 2:**
> As a player, I want background actions to happen without interrupting me so that the world feels alive.

**Story 3:**
> As a player, I want MINOR EVENTS to be indicated but not forced so that I can choose to engage.

**Story 4:**
> As a player, I want MAJOR EVENTS to clearly demand my attention so that I don't miss critical story moments.

### Visual Language

**BACKGROUND ACTIONS (No Notification):**
- Characters move around
- Characters eat, sleep, work
- Autonomous need fulfillment
- No player input required
- No notification
- Visible in world if watching

**MINOR EVENTS (Subtle Notification):**
- Small toast notification bottom-right
- "Sarah and Mike are having coffee"
- Can click to watch or ignore
- Happens in real-time
- Skippable without consequence
- Soft chime sound

**MAJOR EVENTS (Prominent Alert):**
- Center-screen modal
- "💕 A Major Moment is Unfolding"
- Must actively choose: Watch / Prevent / Later
- Pauses game
- Cannot be ignored without explicit choice
- Distinct sound cue
- Screen edge glow (color-coded)

### Technical Implementation

```typescript
type LifeModeActivity = 
  | { type: 'action'; action: AutonomousAction }      // Background
  | { type: 'minor_event'; event: MinorEvent }         // Subtle notification  
  | { type: 'major_event'; event: MajorEvent }         // Prominent alert

// Notification Levels
enum NotificationLevel {
  NONE = 0,       // Actions
  SUBTLE = 1,     // Minor events
  PROMINENT = 2,  // Major events
  CRITICAL = 3    // Unskippable major events
}
```

### Acceptance Criteria
- [ ] Clear visual distinction between all three types
- [ ] Background actions truly background (no interruption)
- [ ] Minor events subtle but visible
- [ ] Major events prominent and attention-demanding
- [ ] Player controls for minor event frequency
- [ ] Cannot accidentally skip major events
- [ ] Sound design matches importance level
- [ ] UI design matches importance level

---

## Summary of New Issues to Create

| Issue | Title | Priority |
|-------|-------|----------|
| 94 | Secret Personality Preset System | P0 |
| 95 | Big 5 Typology System | P0 |
| 96 | Cognitive Function Stack System | P0 |
| 97 | Function Probability Engine | P0 |
| 98 | Needs System | P1 |
| 99 | MAJOR Events System | P0 |
| 100 | MINOR Events System | P1 |
| 101 | Actions vs Events Distinction | P0 |

**Total: 8 new comprehensive issues**

These need to be created in the GitHub repo when rate limit resets.
