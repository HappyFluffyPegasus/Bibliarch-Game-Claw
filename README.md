# Bibliarch v2.0 - Complete Rebuild

A comprehensive story creation platform with Life Mode simulation, rebuilt from the ground up.

## 🌟 Features

### Core Systems
- **Dashboard** - Story management with templates
- **World Builder** - Hierarchical location system (World → Continent → Country → City → Building)
- **Character Creator** - 6-tab system (Appearance, Personality, Memories, Outfits, Evolution, Relationships)
- **Scene Editor** - Gacha Studio-style character placement
- **Timeline** - Multi-track story planning
- **Dialogue Editor** - Branching conversation trees
- **Quest Manager** - Objective tracking
- **AI Writing Assistant** - 6 tools with 8 tones
- **Game Preview** - Test your story
- **Life Mode** - Real-time character simulation

### Technical Stack
- **Frontend**: React 18 + TypeScript
- **Build**: Vite
- **Styling**: Tailwind CSS with glassmorphism
- **Database**: Dexie.js (IndexedDB)
- **State**: Zustand
- **3D**: Babylon.js (ready for integration)

## 🚀 Getting Started

```bash
npm install
npm run dev
```

## 📁 Project Structure

```
src/
├── app-shell/          # Layout, Sidebar, Navigation
├── components/         # Shared UI (GlassCard, Button, Input)
├── db/                # Database schema & types
├── stores/            # Zustand state management
├── dashboard/         # Story management
├── world-builder/     # Location management
├── character-creator/ # Character system
├── scene-editor/      # Scene placement
├── timeline/          # Story planning
├── dialogue/          # Conversation editor
├── quest/             # Quest management
├── story-mode/        # Life Mode simulation
├── preview/           # Game preview
├── ai/                # Writing assistant
└── settings/          # App settings
```

## 🎮 Life Mode Architecture

### Secret Personality System (AI-Only)
- **100+ Personality Presets** - Foodie, Tech Nerd, Introvert, etc.
- **Big 5 Typology** - R/C/uE[I] format (0-100 scales)
- **Cognitive Functions** - ti-ne-si-fe stack with probability weights
- **Behavior Weights** - Derived from personality analysis

*Note: Users see only freeform text fields. All personality typing is hidden and used by AI.*

### Events System
- **MAJOR Events** - Story-shaping cutscenes (divorce, discoveries, betrayals)
- **MINOR Events** - Immersion/dialogue (dates, hangouts)
- **ACTIONS** - Background autonomous behavior (Sims-style)

### Needs System
Hunger, Energy, Social, Fun, Creativity, Knowledge, etc.

## 🛠️ Development

### Build
```bash
npm run build
```

### Current Status
✅ Foundation complete  
✅ All major pages implemented  
✅ Database schema  
✅ State management  
🔄 3D integration in progress  
🔄 AI personality analysis in progress  

## 📝 License

MIT

---

Built overnight March 9-10, 2026
