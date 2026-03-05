# Bibliarch Ultra ✨🎮

> **Nintendo-level quality storytelling platform** - Where your worlds come alive in 3D

![Version](https://img.shields.io/badge/version-1.0.0-violet)
![React](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Babylon.js](https://img.shields.io/badge/Babylon.js-7.0-orange)

## 🌟 What Makes It Special

### ✨ Nintendo-Level Polish
- **Animated splash screen** with logo reveal and progress bar
- **Smooth page transitions** - Every navigation feels delightful
- **Glassmorphism UI** - Modern translucent interfaces
- **Micro-interactions** - Hover effects, bounce animations, magnetic buttons
- **Loading states** - Never wonder if something is happening

### 🤖 AI-Powered Creativity
- **AI Writing Assistant** - Get unstuck with generated backstories, dialogue, plot twists
- **Context-aware suggestions** - AI understands your story

### 🎨 3D Character Creator
- **Real-time 3D preview** with Babylon.js
- **Toon shading** - Beautiful cel-shaded rendering
- **Asset customization** - Toggle clothing, hair, accessories
- **Color palette** - 20+ presets + custom picker
- **Camera presets** - Face, Upper body, Full, Feet
- **Morph targets** - Face shape customization
- **Pose presets** - Idle, Walk, Run, Jump, Sit, Wave

### 📝 Infinite Canvas (Notes)
- **Node-based brainstorming** - Freeform canvas for ideas
- **Folder hierarchy** - Character/Event/Folder notes with arrows to navigate
- **Breadcrumb navigation** - Never get lost in nested canvases
- **Multiple node types:**
  - Text nodes with rich editing
  - Character nodes (link to 3D creator)
  - Event nodes
  - Location nodes
  - Folder nodes (with sub-canvases)
  - Image nodes
  - Table nodes
- **Pan & zoom** - Navigate huge canvases
- **Keyboard shortcuts** - Work fast with V/T/C/E/L/F/I keys

### 🌍 World Builder
- **Real-time terrain sculpting** - Raise, Lower, Flatten, Smooth, Noise brushes
- **Material painting** - Grass, Dirt, Rock, Sand, Snow, Water
- **Sea level control** - Adjust water plane
- **Environment settings** - Time of day, weather
- **3D viewport** with orbit camera

### 🎬 Scene Editor
- **Character placement** - Click to place characters in 3D
- **Timeline scrubber** - Frame-by-frame control
- **Playback controls** - Play, Pause, Skip
- **Lighting presets** - Day, Sunset, Night, Studio
- **Camera presets** - Wide, Medium, Close-up, Overhead
- **Export ready** - Video export structure in place

### 🏆 Gamification
- **Achievements system** - Unlock badges as you create
- **Progress tracking** - Visual progress bars
- **Stats dashboard** - Story count, active projects

### ⌨️ Power User Features
- **Command Palette** (Cmd+K) - Access everything instantly
- **Keyboard shortcuts** - Vim-style navigation
- **Glass cards** - Beautiful translucent UI components
- **Relationship graph** - Visualize character connections

## 🚀 Quick Start

```bash
# Clone the repo
git clone https://github.com/HappyFluffyPegasus/Bibliarch-Game-Claw.git
cd Bibliarch-Game-Claw

# Using Docker (recommended)
docker compose up -d --build
docker compose exec dev npm install
docker compose exec dev npm run dev

# Or locally
npm install
npm run dev
```

Open **http://localhost:1420** 🎉

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Cmd/Ctrl + K` | Command Palette |
| `Cmd/Ctrl + 1` | Notes |
| `Cmd/Ctrl + 2` | Characters |
| `Cmd/Ctrl + 3` | World |
| `Cmd/Ctrl + 4` | Scenes |
| `Cmd/Ctrl + 5` | Timeline |
| `V` | Select tool |
| `T` | Text tool |
| `C` | Character tool |
| `E` | Event tool |
| `F` | Folder tool |
| `Space + Drag` | Pan canvas |
| `Scroll` | Zoom canvas |
| `Delete` | Remove selected |
| `Esc` | Cancel / Close |

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, TypeScript |
| 3D Engine | Babylon.js |
| Animations | Framer Motion |
| Styling | Tailwind CSS |
| State | Zustand |
| Database | Dexie.js (IndexedDB) |
| Desktop | Tauri 2.x |
| Icons | Lucide React |

## 📁 Project Structure

```
src/
  app-shell/          # Layout, Sidebar, Navigation
  canvas/             # Infinite canvas with nodes
  character-creator/  # 3D character tools
  components/         # Shared UI + Animations
  dashboard/          # Story management
  db/                 # Database + persistence
  scene-editor/       # 3D scene choreography
  stores/             # Zustand state
  theme/              # Colors, utilities
  timeline/           # Story timeline
  world-builder/      # 3D terrain editor
```

## 🎯 Architecture Decisions

### Why Zustand over Redux?
- Simpler, less boilerplate
- Better TypeScript support
- Built-in persistence
- Perfect for app state

### Why Dexie.js?
- Local-first (works offline)
- IndexedDB is fast
- No backend required
- User owns their data

### Why Babylon.js over Three.js?
- Built-in game engine features
- Better animation system
- Physics ready (Havok)
- More complete tooling

## 🎮 User Flow

1. **Splash Screen** → Animated logo reveal
2. **Dashboard** → Create or select story
3. **Story Overview** → Navigate to sections
4. **Notes** → Brainstorm with canvas
5. **Characters** → Design in 3D
6. **World** → Sculpt terrain
7. **Scenes** → Choreograph moments
8. **Timeline** → Structure narrative

## ✨ Polish Details

- **120fps animations** - Smooth as butter
- **Reduced motion support** - Accessibility first
- **Error boundaries** - Graceful failures
- **Loading skeletons** - Never show blank
- **Optimistic UI** - Feels instant
- **Debounced saves** - Auto-save without jank

## 🚀 Roadmap

### v1.0 (Current)
- ✅ Core features complete
- ✅ 3D Character Creator
- ✅ World Builder
- ✅ Scene Editor
- ✅ Polish + Animations

### v1.1 (Next)
- [ ] Cloud sync
- [ ] Export to video
- [ ] Mobile responsiveness
- [ ] Plugin system

### v2.0 (Future)
- [ ] Multiplayer collaboration
- [ ] AI story generation
- [ ] Marketplace for assets
- [ ] VR support

## 📝 License

MIT - Build amazing stories! 🎉

---

Built with 💜 by **Alpha X** | *Nintendo would be proud*

> "Quality is not an act, it is a habit." - Aristotle

**Star ⭐ the repo if you love it!**