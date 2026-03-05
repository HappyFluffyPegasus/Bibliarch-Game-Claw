# Bibliarch Ultra ✨

A next-generation storytelling platform where your worlds come alive. Built with React, TypeScript, Babylon.js, and love.

## 🌟 What Makes It Special

### AI-Powered Creativity
- **AI Writing Assistant** - Get unstuck with AI-generated backstories, dialogue, and plot twists
- **Smart Suggestions** - Context-aware help that understands your story

### Stunning Visual Design
- **Glassmorphism UI** - Modern translucent interfaces with beautiful gradients
- **Smooth Animations** - Every interaction feels polished and responsive
- **Dark Theme** - Easy on the eyes for those late-night writing sessions

### 3D Character Creator
- **Real-time 3D Preview** - See your characters come alive with Babylon.js
- **Toon Shading** - Beautiful cel-shaded rendering style
- **Asset Customization** - Toggle clothing, accessories, and colors

### Infinite Canvas
- **Node-based Notes** - Freeform canvas for brainstorming and planning
- **Multiple Node Types** - Text, characters, events, locations, images, tables
- **Pan & Zoom** - Navigate your ideas seamlessly

### Relationship Visualization
- **Interactive Graph** - See how characters connect at a glance
- **Color-coded Relationships** - Friends, enemies, romance, allies
- **Dynamic Layout** - Automatically organized network view

### Gamification
- **Achievements** - Unlock badges as you build your story
- **Progress Tracking** - Visual progress bars keep you motivated
- **Writing Streaks** - Coming soon!

## 🚀 Quick Start

```bash
# Clone and enter
git clone <repo-url>
cd bibliarch

# Copy environment
cp .env.example .env

# Using Docker (recommended)
docker compose up -d --build
docker compose exec dev npm install
docker compose exec dev npm run dev

# Or locally
npm install
npm run dev
```

Open http://localhost:1420

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Cmd/Ctrl + K` | Open Command Palette |
| `Cmd/Ctrl + 1-5` | Navigate to Notes/Characters/World/Scenes/Timeline |
| `Esc` | Close modals/panels |
| `Delete` | Remove selected nodes |
| `Space + Drag` | Pan canvas |
| `Scroll` | Zoom canvas |

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, TypeScript, Vite |
| 3D Engine | Babylon.js |
| Styling | Tailwind CSS |
| State | Zustand |
| Database | Dexie.js (IndexedDB) |
| Desktop | Tauri 2.x |
| Icons | Lucide React |

## 📁 Project Structure

```
src/
  app-shell/       # Layout, Sidebar, Navigation
  canvas/          # Infinite canvas with nodes
  character-creator/ # 3D character tools
  components/      # Shared UI components
  dashboard/       # Story management
  db/              # Database schema & persistence
  stores/          # Zustand state management
  theme/           # Colors, styling utilities
  timeline/        # Story timeline
```

## 🎯 Roadmap

- [x] AI Writing Assistant
- [x] Command Palette
- [x] Glassmorphism UI
- [x] 3D Character Creator
- [x] Infinite Canvas
- [x] Relationship Graph
- [x] Achievements System
- [ ] World Builder (3D Terrain)
- [ ] Scene Editor with Keyframes
- [ ] Cloud Sync
- [ ] Export to PDF/Video
- [ ] Mobile App

## 📝 License

MIT - Build amazing stories!

---

*Built with passion by Alpha X 🤖*