# Bibliarch Ultra ✨

**A next-generation storytelling platform where your worlds come alive.**

Built in a 10-hour one-shot sprint with React, TypeScript, Babylon.js, and passion.

---

## 🎮 Live Demo

**Repository:** https://github.com/HappyFluffyPegasus/Bibliarch-Game-Claw

---

## ✨ What Makes It Special

### 🎨 **Nintendo-Level UI/UX**
- **Glassmorphism Design** - Beautiful translucent interfaces with depth
- **Smooth Animations** - Page transitions, hover effects, loading screens
- **Splash Screen** - Animated intro with spring physics
- **Command Palette** - `Cmd+K` for lightning-fast navigation
- **Keyboard Shortcuts** - Power-user friendly

### 🤖 **AI-Powered Creativity**
- **AI Writing Assistant** - Get unstuck with generated backstories, dialogue, plot twists
- **Context-Aware** - AI understands your story context

### 🎭 **3D Character Creator**
- **Real-time 3D Preview** - Babylon.js with toon shaders
- **Asset Toggling** - Hair, clothing, accessories
- **Color Customization** - 20+ presets + custom picker
- **Camera Presets** - Face, Upper, Full, Feet views
- **Morph Targets** - Face shape adjustments
- **Pose Presets** - Idle, Walk, Run, Jump, Sit, Wave

### 🌍 **World Builder**
- **Real-time Terrain Sculpting** - 5 brush types
- **Material Painting** - Grass, Dirt, Rock, Sand, Snow, Water
- **Sea Level Control** - Dynamic water plane
- **Environment Settings** - Time of day, weather
- **60fps Performance** - Optimized mesh updates

### 🎬 **Scene Editor**
- **3D Scene Viewport** - Place characters in real-time
- **Click-to-Place** - Intuitive character positioning
- **Timeline Scrubber** - Visual timeline with tracks
- **Lighting Presets** - Day, Sunset, Night, Studio
- **Camera Presets** - Wide, Medium, Close, Overhead
- **Playback Controls** - Play, pause, scrub

### 📝 **Infinite Canvas (Notes)**
- **Folder Node Hierarchy** - Character/Event/Folder nodes with arrows
- **Breadcrumb Navigation** - Never get lost in nested canvases
- **Multiple Node Types** - Text, Character, Event, Location, Folder, Image, Table
- **Pan & Zoom** - Navigate seamlessly
- **Tool Shortcuts** - V, T, C, E, L, F, I, Tab

### 🏆 **Gamification**
- **Achievements** - 6 unlockable badges
- **Progress Tracking** - Visual progress bars
- **Story Stats** - Character count, activity tracking

---

## 🚀 Quick Start

```bash
# Clone
git clone https://github.com/HappyFluffyPegasus/Bibliarch-Game-Claw.git
cd Bibliarch-Game-Claw

# Install dependencies
npm install --legacy-peer-deps

# Run dev server
npm run dev

# Open http://localhost:1420
```

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Cmd/Ctrl + K` | Command Palette |
| `Cmd/Ctrl + 1` | Go to Notes |
| `Cmd/Ctrl + 2` | Go to Characters |
| `Cmd/Ctrl + 3` | Go to World |
| `Cmd/Ctrl + 4` | Go to Scenes |
| `Cmd/Ctrl + 5` | Go to Timeline |
| `V` | Select Tool |
| `Space + Drag` | Pan Canvas |
| `T` | Text Node |
| `C` | Character Node |
| `E` | Event Node |
| `F` | Folder Node |
| `Esc` | Close/Cancel |
| `Delete` | Remove Selected |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, TypeScript |
| 3D Engine | Babylon.js |
| Animations | Framer Motion |
| Styling | Tailwind CSS |
| State | Zustand |
| Database | Dexie.js (IndexedDB) |
| Desktop | Tauri 2.x (ready) |
| Icons | Lucide React |

---

## 📁 Project Structure

```
src/
  app-shell/         # Sidebar, layout, navigation
  canvas/            # Infinite canvas with folder nodes
  character-creator/ # 3D character customizer
  components/        # Shared UI (GlassCard, AIAssistant, etc.)
  dashboard/         # Story management
  db/                # Database schema & persistence
  scene-editor/      # 3D scene choreography
  stores/            # Zustand state
  theme/             # Colors, HSL utilities
  timeline/          # Story timeline
  world-builder/     # 3D terrain editor
```

---

## 🎯 Architecture Highlights

### Local-First Design
- **Dexie.js** for structured data (IndexedDB)
- **FileSystem API** for large assets (Tauri)
- **No backend required** - works offline

### 3D Engine Strategy
- **One Engine at a time** - dispose when leaving 3D views
- **Write-through persistence** - Zustand → Dexie
- **Lazy loading** - terrain loads on demand

### Folder Node System
```
Canvas (Root)
  ├── Character Node → Click Arrow → Character Canvas
  │                      └── Notes, Hierarchy
  ├── Event Node → Click Arrow → Event Canvas
  │                  └── Timeline, Details
  └── Folder Node → Click Arrow → Sub-Canvas
```

---

## 🎨 Design Philosophy

> **"Nintendo-level quality means: polish, delight, and zero jank."**

- Every interaction has feedback
- Animations are purposeful
- UI is consistent and predictable
- Performance is smooth (60fps)
- Accessible and keyboard-friendly

---

## 🚀 What's Next

- [ ] Cloud sync with Supabase
- [ ] Export to video (MP4/WebM)
- [ ] Mobile app (React Native)
- [ ] Collaboration features
- [ ] AI image generation
- [ ] Steam distribution

---

## 📝 License

MIT - Build amazing stories!

---

*Built with ❤️ by Alpha X in a 10-hour one-shot sprint*