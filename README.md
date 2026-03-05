# Bibliarch

A local-first desktop application for interactive story creation and world-building. Users create story projects, build characters with a 3D customizer, arrange narrative elements on a node-based canvas, choreograph 3D scenes, sculpt terrain and build worlds, and manage story timelines.

Ships on Steam as a native desktop app via Tauri. All data lives on the user's machine — cloud features (backup, sharing, gallery) are player-initiated, never automatic.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Language | TypeScript |
| 3D Engine | Babylon.js |
| UI | React + Tailwind CSS + Radix/Shadcn + Lucide |
| State | Zustand → Dexie.js (IndexedDB) |
| Cloud | Supabase (player-initiated only) |
| Desktop | Tauri 2.x |
| Assets | GLB/GLTF via Blender |

## Prerequisites

- Docker Desktop (Windows, macOS, or Linux)
- Git (with Git LFS)

That's it. Everything else runs inside the container.

## Quick Start

```bash
git clone <repo-url>
cd bibliarch
cp .env.example .env
docker compose up -d --build
docker compose exec dev npm install
docker compose exec dev npm run dev
# Open http://localhost:1420
```

## Development Workflow

All commands run via `docker compose exec dev <command>`:

- `npm run dev` — start Vite dev server with Tauri
- `npm run build` — production build
- `npm run lint` / `npm run typecheck` — code quality
- `npx tauri dev` — full Tauri development mode
- `npx tauri build` — create distributable binary (Linux only in container)

## Platform-Specific Notes

**Windows 11:**
- Install Docker Desktop for Windows (uses WSL2 backend automatically)
- Clone the repo with standard Windows Git
- All development happens through the container
- The Vite dev server is accessible at `http://localhost:1420`
- Native Windows builds require CI/CD

**macOS:**
- Install Docker Desktop for Mac
- Same workflow as above
- Native macOS builds require CI/CD or running Tauri natively

**Linux:**
- Docker or Podman
- Same workflow as above
- Container builds are native Linux

## Project Structure

```
src/
  dashboard/        # Story dashboard feature
  canvas/           # Node-based canvas system
  character-creator/# 3D character customization
  scene-editor/     # 3D scene choreography
  world-builder/    # Terrain and world building
  timeline/         # Story timeline management
  components/       # Shared UI components
  hooks/            # Shared React hooks
  stores/           # Zustand stores
  db/               # Dexie/IndexedDB
  types/            # Shared TypeScript types
  utils/            # Utility functions
assets/             # Static assets, GLB models
src-tauri/          # Tauri Rust backend
```

## Building for Desktop

- **Linux builds**: `docker compose exec dev npx tauri build`
- **Windows/macOS builds**: CI/CD via GitHub Actions using `tauri-apps/tauri-action`
- **Steam distribution**: Built executables uploaded to Steamworks

## Environment Variables

See `.env.example`. Only two values needed:

```
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...
```

## Common Tasks

| Task | Command |
|------|---------|
| Install dependencies | `docker compose exec dev npm install` |
| Start dev server | `docker compose exec dev npm run dev` |
| Run type checking | `docker compose exec dev npm run typecheck` |
| Run linting | `docker compose exec dev npm run lint` |
| Build for production | `docker compose exec dev npm run build` |
| Build Tauri app | `docker compose exec dev npx tauri build` |
| Add npm package | `docker compose exec dev npm install <package>` |
| Run Tauri CLI | `docker compose exec dev npx tauri <command>` |
| Enter container shell | `docker compose exec dev bash` |
| Rebuild container | `docker compose up -d --build` |