# AGENTS.md - Claude Code as Primary Developer

## Core Philosophy: "Come in through the front door."

- **Normal methods are best.** Standard practices. Consensus approaches. The way a senior React/TypeScript developer would do it.
- **Do not route around problems with wizardry or clever tricks.** If something doesn't work, fix it properly.
- **Use standard tools the standard way.** `npm`, `cargo`, `vite`, `git` — no exotic wrappers.
- **When in doubt, ask "what would a normal developer do?" and do that.**
- **Do not invent abstractions prematurely.** Three similar lines of code are better than a premature helper function.
- **Do not add features that weren't asked for.** Implement what the issue specifies, nothing more.
- **Fix problems at the source.** Don't suppress warnings, don't skip hooks, don't bypass type checks.

## How to Run Commands

All commands execute inside the Docker container:

```bash
docker compose exec dev npm install
docker compose exec dev npm run dev
docker compose exec dev npx tauri dev
docker compose exec dev npx tauri build
```

Do not install Node.js, Rust, or any tools on the host machine. The container has everything.

## Codebase Conventions

- **TypeScript everywhere** — strict mode, no `any` unless absolutely unavoidable
- **React functional components** — no class components
- **Zustand for state** — one store per domain (stories, canvas, characters, scenes, world, timeline, UI). Write-through to Dexie on every mutation.
- **Dexie.js for persistence** — IndexedDB via Dexie. Schema defined centrally.
- **Tailwind CSS for styling** — utility classes, dark theme. No CSS modules.
- **Radix UI / Shadcn for primitives** — accessible components.
- **Lucide for icons** — import individual icons.
- **Babylon.js for 3D** — direct API usage, no React wrapper. One Engine instance at a time.
- **Feature-based file organization** — code for a feature lives in that feature's directory.

## Issue Map

The spec is defined across 46 GitHub issues. Key navigation:

| Area | Issues |
|------|--------|
| **Foundation** | #38 Tech Stack, #39 Database, #40 Pre-Setup, #41 Epic |
| **App Shell** | #1 Dashboard, #2 Navigation, #3 Theme, #4 Persistence, #42 Epic |
| **Canvas** | #5–#15, #43 Epic |
| **Character Creator** | #16–#18, #44 Epic |
| **Scene Editor** | #19–#24, #45 Epic |
| **World Builder** | #26–#36, #46 Epic |
| **Timeline** | #25 |

Start with the foundation (#38, #39, #40), then the app shell (#1, #2, #3, #4), then build features in order.