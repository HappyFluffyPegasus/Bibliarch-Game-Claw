# BIBLIARCH PERSONALITY SYSTEM - AI-ONLY ARCHITECTURE

## CRITICAL PRINCIPLE: USER NEVER SEES THIS

The entire personality typing system (presets, Big 5, cognitive functions) is **COMPLETELY HIDDEN FROM THE USER**. This is an AI-only system that operates behind the scenes.

---

## WHAT THE USER SEES vs WHAT THE AI SEES

### USER INTERFACE (Character Creator)

**Personality Tab - Freeform Text Fields:**
```
┌─────────────────────────────────────────┐
│  Personality                            │
│                                         │
│  Traits:    [Freeform text box]         │
│  "Funny, sarcastic, loyal"              │
│                                         │
│  Likes:     [Freeform text box]         │
│  "Coffee, rainy days, old books"        │
│                                         │
│  Dislikes:  [Freeform text box]         │
│  "Loud noises, olives, being late"      │
│                                         │
│  Fears:     [Freeform text box]         │
│  "Heights, abandonment"                 │
│                                         │
│  Dreams:    [Freeform text box]         │
│  "To open a bookstore"                  │
│                                         │
│  Quirks:    [Freeform text box]         │
│  "Taps foot when nervous"               │
│                                         │
└─────────────────────────────────────────┘
```

**What user sees:** Natural language descriptions  
**What user does:** Writes whatever they want  
**No sliders, no types, no numbers, no categories**

---

### AI SYSTEM (Hidden Processing)

**Behind the scenes, the AI analyzes freeform text and generates:**

```typescript
// HIDDEN FROM USER - Stored in database
interface SecretPersonalityProfile {
  characterId: string
  
  // AI-Selected from 100+ presets
  presets: string[]  // ["coffee_lover", "introvert", "bookworm", "sarcastic"]
  
  // Big 5 scores (0-100)
  big5: {
    extraversion: 25      // R (Reserved)
    neuroticism: 40       // c (calm)
    openness: 75          // O (Open)
    agreeableness: 60     // a (agreeable)
    conscientiousness: 80 // O (Organized)
  }
  big5Code: "R/c/O[a]/O"  // Generated code
  
  // Cognitive function stack
  cognitiveStack: {
    dominant: "fi"      // 75% usage
    auxiliary: "ne"     // 18% usage
    tertiary: "si"      // 5% usage
    inferior: "te"      // 2% usage
  }
  stackCode: "fi-ne-si-te"
  
  // Derived behavior weights
  behaviorWeights: {
    socialInitiation: 0.15      // Low (introvert)
    emotionalExpressiveness: 0.6
    creativity: 0.85            // High (artist)
    organization: 0.9           // High (organized)
    riskTaking: 0.3
    // ... 50+ behavior weights
  }
  
  // Confidence score (how sure AI is about analysis)
  analysisConfidence: 0.87
}
```

**AI Analysis Process:**
1. User writes: "Funny, sarcastic, loyal, loves coffee and books, hates crowds"
2. AI NLP parses text
3. AI matches to presets: ["coffee_lover", "bookworm", "introvert", "sarcastic", "loyal"]
4. AI infers Big 5: Low extraversion (introvert), High openness (bookworm)
5. AI infers cognitive stack: Likely Fi-Ne (introverted feeler with intuition)
6. AI stores secret profile
7. AI uses profile for ALL behavior generation

**User NEVER sees:**
- ❌ Preset names
- ❌ Big 5 scores
- ❌ Big 5 code (R/c/O[a]/O)
- ❌ Cognitive functions (fi-ne-si-te)
- ❌ Behavior weights
- ❌ Percentages
- ❌ Analysis confidence

**User ONLY sees:**
- ✅ Their own freeform text
- ✅ Characters acting consistently with their descriptions

---

## AI ANALYSIS PIPELINE

### Step 1: Natural Language Processing
```
User Input: "She's super outgoing, loves parties, always the center of attention, 
            but gets anxious before big events. Creative and artistic, 
            but her room is a complete mess."
```

### Step 2: Keyword Extraction
```javascript
extractedKeywords = {
  social: ["outgoing", "parties", "center of attention"],
  emotional: ["anxious"],
  creative: ["creative", "artistic"],
  organizational: ["mess"],
}
```

### Step 3: Preset Matching (100+ presets)
```javascript
matchedPresets = [
  "extrovert",           // "outgoing", "parties"
  "social_butterfly",    // "center of attention"
  "anxious",             // "anxious"
  "artist",              // "creative", "artistic"
  "messy",               // "mess"
]
```

### Step 4: Big 5 Scoring
```javascript
big5Scores = {
  extraversion: 85,      // High (extrovert + social)
  neuroticism: 65,       // Moderate-high (anxious)
  openness: 80,          // High (creative + artistic)
  agreeableness: 50,     // Neutral (no data)
  conscientiousness: 20, // Low (messy)
}

big5Code = "S/e/O/N"     // Social/Emotional/Open/Neutral/Spontaneous
```

### Step 5: Cognitive Function Inference
```javascript
// Based on pattern matching
// High openness + artistic + anxious = likely Ne-Fi or Fi-Ne
// Extrovert suggests Ne-Fi (ENFP-like)

cognitiveStack = {
  dominant: "ne",    // Extroverted intuition (brainstorming, possibilities)
  auxiliary: "fi",   // Introverted feeling (authenticity, values)
  tertiary: "te",    // Extroverted thinking (efficiency, less developed)
  inferior: "si"     // Introverted sensing (tradition, under stress)
}

stackCode = "ne-fi-te-si"
```

### Step 6: Behavior Weight Generation
```javascript
behaviorWeights = {
  // Social (High extraversion + Ne)
  socialInitiation: 0.85,
  groupParticipation: 0.9,
  socialAnxiety: 0.35,        // But anxiety moderates this
  
  // Emotional (Fi + Neuroticism)
  emotionalExpression: 0.75,
  emotionalStability: 0.4,    // Low due to anxiety
  authenticity: 0.9,          // High Fi
  
  // Creative (High openness + Ne)
  creativity: 0.95,
  artisticExpression: 0.9,
  novelSeeking: 0.85,
  
  // Organizational (Low conscientiousness)
  cleanliness: 0.15,
  punctuality: 0.3,
  planning: 0.4,
  
  // ... 40+ more weights
}
```

### Step 7: Storage (Hidden)
```javascript
// Saved to database, NEVER shown to user
await db.secretPersonalityProfiles.add({
  characterId: "char_123",
  presets: ["extrovert", "social_butterfly", "anxious", "artist", "messy"],
  big5: { extraversion: 85, neuroticism: 65, openness: 80, 
          agreeableness: 50, conscientiousness: 20 },
  big5Code: "S/e/O/N",
  cognitiveStack: { dominant: "ne", auxiliary: "fi", 
                    tertiary: "te", inferior: "si" },
  stackCode: "ne-fi-te-si",
  behaviorWeights: { /* ... */ },
  analysisConfidence: 0.82,
  lastAnalyzed: new Date()
})
```

---

## AI BEHAVIOR GENERATION USING SECRET PROFILE

### Example: Character Decision

**Scenario:** Character is at a party and needs to decide what to do.

**Secret Profile:**
- Presets: ["extrovert", "social_butterfly", "anxious", "artist"]
- Big 5: S/e/O/N (Social, Emotional, Open, Spontaneous)
- Stack: ne-fi-te-si

**AI Decision Process:**

1. **Check Needs:**
   - Social: 85% (high, party helps)
   - Fun: 60% (moderate)
   - Anxiety: Rising (environment trigger)

2. **Check Presets:**
   - "extrovert" → Seek social interaction
   - "social_butterfly" → Be center of attention
   - "anxious" → BUT also feel nervous
   - "artist" → Creative expression opportunity

3. **Check Big 5:**
   - High extraversion (S) → Strong desire to socialize
   - Moderate neuroticism (e) → Some anxiety present
   - High openness (O) → Try new things
   - Low conscientiousness (N) → Go with the flow

4. **Check Cognitive Stack:**
   - Ne (75%): "What interesting people could I meet?"
   - Fi (18%): "Does this feel authentic to me?"
   - Te (5%): "What's the most efficient way to network?"
   - Si (2%): "Remember that awkward party last time..."

5. **Generate Probabilities:**
   ```
   Action Options:
   - Join group conversation: 65% (extrovert + Ne)
   - Start dancing: 20% (social_butterfly + spontaneous)
   - Find quiet corner: 10% (anxiety + Si inferior)
   - Show off art: 5% (artist + Fi authenticity)
   ```

6. **Execute Decision:**
   - Roll: 65% → Join group conversation
   - But anxiety modifier: Slight nervousness in animation
   - Dialogue: "Hey everyone! *nervous laugh* What's going on?"

**User sees:** Character naturally joins conversation with slight nervousness  
**User doesn't see:** The 100+ calculations that led to this behavior

---

## UPDATING SECRET PROFILE

### User Edits Character

**User changes:** "She's become more confident and organized lately"

**AI detects:**
- Keywords: "confident" (low anxiety), "organized" (high conscientiousness)
- Change direction: Less neurotic, more conscientious

**AI updates:**
```javascript
// Incremental update (not full reanalysis)
updates = {
  presets: {
    add: ["confident", "organized"],
    remove: ["anxious", "messy"]
  },
  big5: {
    neuroticism: -20,    // Less anxious
    conscientiousness: +40  // More organized
  },
  behaviorWeights: {
    socialAnxiety: -0.3,
    cleanliness: +0.5,
    planning: +0.4
  }
}
```

**Character now:** Acts more confident and organized in Life Mode  
**User sees:** Character growth matching their description  
**User never sees:** The updated numbers

---

## TECHNICAL IMPLEMENTATION

### Database Schema (Hidden Table)

```typescript
// User NEVER queries this directly
interface SecretPersonalityProfile {
  id: string
  characterId: string
  
  // AI-Generated
  presets: string[]
  big5: {
    extraversion: number      // 0-100
    neuroticism: number       // 0-100
    openness: number          // 0-100
    agreeableness: number     // 0-100
    conscientiousness: number // 0-100
  }
  big5Code: string            // "S/e/O/N" format
  
  cognitiveStack: {
    dominant: CognitiveFunction
    auxiliary: CognitiveFunction
    tertiary: CognitiveFunction
    inferior: CognitiveFunction
  }
  stackCode: string           // "ne-fi-te-si" format
  
  behaviorWeights: Record<string, number>
  
  // Metadata
  analysisVersion: number     // For migration
  confidence: number          // 0-1
  lastAnalyzed: Date
  analysisSource: string      // Which NLP model version
}

type CognitiveFunction = 
  | 'ti' | 'te' | 'fi' | 'fe' 
  | 'ni' | 'ne' | 'si' | 'se'
```

### AI Service (Hidden Module)

```typescript
// src/ai/personalityAnalyzer.ts
// NEVER imported by UI components

export class PersonalityAnalyzer {
  // Analyze user text and generate secret profile
  async analyzeCharacter(characterId: string): Promise<void> {
    const character = await db.characters.get(characterId)
    const userText = `${character.personality.traits} ${character.personality.likes} ${character.personality.dislikes}`
    
    // NLP Analysis (using local model or API)
    const analysis = await this.nlpService.analyze(userText)
    
    // Generate secret profile
    const secretProfile: SecretPersonalityProfile = {
      characterId,
      presets: this.extractPresets(analysis),
      big5: this.calculateBig5(analysis),
      big5Code: this.generateBig5Code(analysis),
      cognitiveStack: this.inferCognitiveStack(analysis),
      stackCode: this.generateStackCode(analysis),
      behaviorWeights: this.calculateWeights(analysis),
      confidence: analysis.confidence,
      lastAnalyzed: new Date()
    }
    
    // Store secretly
    await db.secretPersonalityProfiles.put(secretProfile)
  }
  
  // Used by Life Mode to make decisions
  async getBehaviorWeights(characterId: string): Promise<Record<string, number>> {
    const profile = await db.secretPersonalityProfiles.get({ characterId })
    return profile?.behaviorWeights || {}
  }
  
  // Used by Life Mode for dialogue style
  async getCognitiveStack(characterId: string): Promise<CognitiveStack | null> {
    const profile = await db.secretPersonalityProfiles.get({ characterId })
    return profile?.cognitiveStack || null
  }
}
```

### Security: Prevent User Access

```typescript
// src/db/database.ts

// ❌ NEVER export this to UI
class SecretDatabase extends Dexie {
  secretPersonalityProfiles!: Table<SecretPersonalityProfile>
  
  constructor() {
    super('bibliarch-secret', {
      // Additional security options
    })
  }
}

// Only AI modules can access
export const secretDb = new SecretDatabase()

// UI can only access regular character data
export const publicDb = new BibliarchDatabase()
```

---

## SUMMARY

| What | User Sees | AI Uses |
|------|-----------|---------|
| **Input Method** | Freeform text boxes | NLP analysis |
| **Personality Types** | ❌ Nothing | ✅ 100+ presets |
| **Scores** | ❌ Nothing | ✅ Big 5 (0-100) |
| **Codes** | ❌ Nothing | ✅ R/C/uE[I], ti-ne-si-fe |
| **Functions** | ❌ Nothing | ✅ Cognitive stack |
| **Weights** | ❌ Nothing | ✅ Behavior probabilities |
| **Result** | Natural behavior | Mathematical precision |

**The magic:** Characters feel alive and consistent, but the user never knows about the complex psychology simulation running behind the scenes.

**The user just writes:** "She's funny and likes coffee"  
**The AI secretly calculates:** 847 variables to make her act funny and seek coffee  
**The user experiences:** "Wow, she really acts like someone who likes coffee!"
