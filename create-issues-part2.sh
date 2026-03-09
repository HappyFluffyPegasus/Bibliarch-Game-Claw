#!/bin/bash
# Part 2 of GitHub issues creation script

REPO="HappyFluffyPegasus/Bibliarch-Game-Claw"

# Issue 6: Enhanced Terrain Editor
ggh issue create --repo $REPO --title "[P1] Enhanced 3D Terrain Editor" --body "## User Stories

**Story 6.1: Paint Brush**
> As a terrain artist, I want a paint brush to apply different materials (grass, dirt, rock) to specific areas so that I can create varied terrain textures.

**Story 6.2: Erase Brush**
> As a terrain artist, I want an erase brush to remove terrain modifications so that I can undo mistakes quickly.

**Story 6.3: Grid Overlay Toggle**
> As a user, I want to toggle a grid overlay on the terrain so that I can align objects and measure distances.

**Story 6.4: Day Lighting Mode**
> As a user, I want to switch to day lighting mode so that I can see how my terrain looks in bright conditions.

**Story 6.5: Sunset Lighting Mode**
> As a user, I want to switch to sunset lighting mode so that I can preview atmospheric lighting.

**Story 6.6: Night Lighting Mode**
> As a user, I want to switch to night lighting mode so that I can see how my terrain looks in darkness.

**Story 6.7: Height-based Shadows**
> As a user, I want shadows to be cast based on terrain height so that valleys look darker than peaks.

**Story 6.8: Isometric View**
> As a user, I want an isometric camera view option so that I can view my terrain from a strategic angle.

**Story 6.9: Export Terrain JSON**
> As a user, I want to export my terrain as JSON so that I can back it up or share it.

**Story 6.10: Import Terrain JSON**
> As a user, I want to import terrain from JSON so that I can restore backups or load shared terrains.

## Acceptance Criteria
- [ ] Paint brush for materials
- [ ] Erase brush
- [ ] Grid overlay toggle
- [ ] Day/Sunset/Night lighting modes
- [ ] Height-based shadows
- [ ] Isometric camera option
- [ ] Export to JSON
- [ ] Import from JSON
- [ ] Route: /story/:id/terrain

## Related File
- src/world-builder/TerrainEditorPage.tsx" --label "enhancement,P1,world-builder"

# Issue 7: World Events System
ggh issue create --repo $REPO --title "[P1] World Events System - Story Integration" --body "## User Stories

**Story 7.1-7.7: Event Types**
> As a game designer, I want to create 7 types of events (Battle, Discovery, Dialogue, Cutscene, Weather, Quest, Milestone) at specific locations so that I can design diverse gameplay experiences.

**Story 7.8: Timeline View**
> As a user, I want a timeline view of events so that I can see the sequence of story events.

**Story 7.9: Event Status Tracking**
> As a user, I want to track event status (Draft, Scheduled, Active, Completed) so that I know which events are ready.

**Story 7.10: Event Requirements**
> As a game designer, I want to set requirements for events (e.g., must complete quest X) so that events trigger conditionally.

**Story 7.11: Event Consequences**
> As a game designer, I want to define consequences for events so that completing an event changes the world state.

**Story 7.12: Event Participants**
> As a game designer, I want to assign characters as event participants so that I know who is involved.

## Acceptance Criteria
- [ ] 7 event types implemented
- [ ] Timeline view
- [ ] Event status tracking
- [ ] Requirements system
- [ ] Consequences system
- [ ] Participant assignment
- [ ] Route: /story/:id/world-events

## Related File
- src/world-builder/WorldEventsPage.tsx" --label "enhancement,P1,world-builder,story"

# Issue 8: Weather System
ggh issue create --repo $REPO --title "[P1] Weather System - Dynamic Environment" --body "## User Stories

**Story 8.1-8.7: Weather Types**
> As a world builder, I want 7 weather presets (Sunny, Cloudy, Rain, Storm, Snow, Fog, Windy) so that my world has varied atmospheric conditions.

**Story 8.8: Weather Transitions**
> As a user, I want weather to transition smoothly between states so that changes feel natural.

**Story 8.9: Weather Statistics**
> As a user, I want to see weather statistics (temperature, humidity, wind speed, visibility) so that I know exact conditions.

**Story 8.10: Season Selector**
> As a user, I want to select seasons (Spring, Summer, Autumn, Winter) so that weather patterns match the time of year.

**Story 8.11: Time Scrubber**
> As a user, I want a time scrubber to preview weather changes over time so that I can plan weather cycles.

**Story 8.12: Weather Effects on Gameplay**
> As a game designer, I want weather to affect gameplay (e.g., rain makes ground slippery) so that weather matters.

## Acceptance Criteria
- [ ] 7 weather presets
- [ ] Smooth weather transitions
- [ ] Weather statistics display
- [ ] Season selector
- [ ] Time scrubber for preview
- [ ] Gameplay effects integration
- [ ] Route: /story/:id/weather

## Related File
- src/world-builder/WeatherSystemPage.tsx" --label "enhancement,P1,world-builder"

# Issue 9: World Map Editor
ggh issue create --repo $REPO --title "[P1] World Map Editor - Asset Placement" --body "## User Stories

**Story 9.1: Place 3D Assets**
> As a world builder, I want to place 3D assets on the map so that I can populate my world with objects.

**Story 9.2: Move Placed Assets**
> As a user, I want to move already placed assets so that I can adjust their positions.

**Story 9.3: Rotate Assets**
> As a user, I want to rotate placed assets so that they face the right direction.

**Story 9.4: Scale Assets**
> As a user, I want to scale placed assets so that I can have size variation.

**Story 9.5: Asset Categories**
> As a user, I want assets organized into categories (trees, buildings, rocks, etc.) so that I can find what I need quickly.

**Story 9.6: Asset Search**
> As a user with many assets, I want to search for assets by name so that I can find specific models.

## Acceptance Criteria
- [ ] Place 3D assets on map
- [ ] Move existing assets
- [ ] Rotate assets (Gizmo)
- [ ] Scale assets (Gizmo)
- [ ] Asset category organization
- [ ] Asset search functionality
- [ ] Route: /story/:id/world-map

## Related File
- src/world-builder/WorldMapEditorPage.tsx" --label "enhancement,P1,world-builder"

# Issue 10: Prefab Library
ggh issue create --repo $REPO --title "[P2] Prefab Library - Reusable Elements" --body "## User Stories

**Story 10.1: Create Prefabs**
> As a world builder, I want to save groups of objects as prefabs so that I can reuse complex arrangements.

**Story 10.2: Organize Prefabs**
> As a user, I want to organize prefabs into folders/categories so that I can maintain a clean library.

**Story 10.3: Prefab Details Panel**
> As a user, I want to see a details panel when selecting a prefab so that I know what it contains.

**Story 10.4: Drag and Drop Prefabs**
> As a user, I want to drag prefabs from the library into the world so that placement is fast.

**Story 10.5: Edit Prefabs**
> As a user, I want to edit existing prefabs so that I can update them across all instances.

## Acceptance Criteria
- [ ] Create prefab from selection
- [ ] Folder/category organization
- [ ] Details panel with contents
- [ ] Drag and drop placement
- [ ] Edit prefab functionality
- [ ] Route: /story/:id/prefabs

## Related File
- src/world-builder/PrefabLibraryPage.tsx" --label "enhancement,P2,world-builder"

echo "Created issues 6-10. Continuing..."
