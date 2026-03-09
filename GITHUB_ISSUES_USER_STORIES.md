# Bibliarch OG MVP Feature Issues with User Stories

This document contains all user stories for the restored OG MVP features, ready to be added as GitHub issues.

---

## Issue 1: World Archive - Hierarchical World Builder
**Priority:** P0

### User Stories

**Story 1.1: Create World Hierarchy**
> As a world builder, I want to create a hierarchical structure of locations (World→Continent→Country→Region→City→Building) so that I can organize my game world in a logical, navigable way.

**Story 1.2: Tree View Navigation**
> As a user viewing my world, I want to see a tree view sidebar with expandable/collapsible nodes so that I can quickly navigate between different locations without getting lost.

**Story 1.3: Breadcrumb Navigation**
> As a user editing a specific location, I want to see a breadcrumb trail showing the full path (e.g., "Aetheria > Norvath > Silverwind City") so that I always know where I am in the hierarchy.

**Story 1.4: Search and Filter**
> As a user with a large world, I want to search and filter locations by name, type, or tags so that I can find specific places quickly.

**Story 1.5: Location Metadata**
> As a world builder, I want to add metadata to each location (population, climate, terrain type, description) so that I can track important details about each area.

**Story 1.6: Create Sub-locations**
> As a user editing a continent, I want to create new countries within it so that I can build my world hierarchy naturally from parent to child.

**Story 1.7: Delete with Descendants**
> As a user cleaning up my world, I want to delete a location and all its descendants at once so that I don't have to manually delete each child location.

---

## Issue 2: Heightmap Importer
**Priority:** P1

### User Stories

**Story 2.1: Import PNG Heightmaps**
> As a world builder, I want to import PNG heightmaps from external tools like WorldMachine or Gaea so that I can use professional terrain generation in my game.

**Story 2.2: Import JPG Heightmaps**
> As a world builder, I want to import JPG heightmaps so that I have flexibility in the file formats I can use.

**Story 2.3: Height Scale Adjustment**
> As a user importing a heightmap, I want to adjust the height scale so that I can control how dramatic the elevation changes are in my terrain.

**Story 2.4: Preview Before Import**
> As a user, I want to preview the heightmap in 3D before finalizing the import so that I can verify it looks correct.

---

## Issue 3: Procedural Terrain Generator
**Priority:** P1

### User Stories

**Story 3.1: Island Preset**
> As a world builder, I want to generate an island terrain preset so that I can quickly create coastal environments.

**Story 3.2: Mountains Preset**
> As a world builder, I want to generate a mountainous terrain preset so that I can create dramatic elevated landscapes.

**Story 3.3: Plains Preset**
> As a world builder, I want to generate a flat plains preset so that I can create open fields and farmland.

**Story 3.4: Mixed Terrain Preset**
> As a world builder, I want to generate a mixed terrain with varied elevations so that I can create diverse natural environments.

**Story 3.5: Perlin Noise Controls**
> As a user generating terrain, I want to adjust the Perlin noise parameters (octaves, persistence, lacunarity) so that I can fine-tune the terrain detail.

**Story 3.6: Seed Value**
> As a user, I want to specify a seed value for procedural generation so that I can recreate the same terrain or share it with others.

---

## Issue 4: Entity Brush System
**Priority:** P1

### User Stories

**Story 4.1: Scatter Trees**
> As a world builder, I want to scatter trees across an area with my brush so that I can quickly populate forests.

**Story 4.2: Scatter Buildings**
> As a world builder, I want to scatter buildings across an area so that I can quickly create towns and villages.

**Story 4.3: Random Scale**
> As a user scattering objects, I want random scale variation within a range so that my forests look natural and not uniform.

**Story 4.4: Random Rotation**
> As a user scattering objects, I want random rotation so that placed objects don't all face the same direction.

**Story 4.5: Density Control**
> As a user, I want to control the density of scattered objects so that I can create sparse forests or dense jungles.

---

## Issue 5: LOD (Level of Detail) System
**Priority:** P1

### User Stories

**Story 5.1: Automatic LOD Switching**
> As a player exploring the world, I want distant objects to use lower detail models so that the game runs smoothly.

**Story 5.2: LOD Distance Configuration**
> As a developer, I want to configure the distances at which LOD levels switch so that I can balance quality and performance.

**Story 5.3: Performance Stats Display**
> As a developer, I want to see real-time performance stats (FPS, draw calls, polygon count) so that I can optimize my world.

**Story 5.4: Frustum Culling**
> As a player, I want objects outside the camera view to be culled so that performance is optimized.

**Story 5.5: Occlusion Culling**
> As a player, I want objects blocked by other objects to be culled so that rendering is efficient in dense environments.

---

## Issue 6: Enhanced 3D Terrain Editor
**Priority:** P1

### User Stories

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

---

## Issue 7: World Events System
**Priority:** P1

### User Stories

**Story 7.1: Create Battle Events**
> As a game designer, I want to create battle events at specific locations so that I can design combat encounters.

**Story 7.2: Create Discovery Events**
> As a game designer, I want to create discovery events so that players can find hidden items or lore.

**Story 7.3: Create Dialogue Events**
> As a game designer, I want to create dialogue events at locations so that NPCs can interact with players.

**Story 7.4: Create Cutscene Events**
> As a game designer, I want to create cutscene events so that story moments trigger at specific locations.

**Story 7.5: Create Weather Events**
> As a game designer, I want to create weather events so that storms or special weather affects gameplay.

**Story 7.6: Create Quest Events**
> As a game designer, I want to create quest events so that objectives are tied to locations.

**Story 7.7: Create Milestone Events**
> As a game designer, I want to create milestone events so that achievements are marked at locations.

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

---

## Issue 8: Weather System
**Priority:** P1

### User Stories

**Story 8.1: Sunny Weather**
> As a world builder, I want to set sunny weather so that my world has clear, bright conditions.

**Story 8.2: Cloudy Weather**
> As a world builder, I want to set cloudy weather so that my world has overcast conditions.

**Story 8.3: Rain Weather**
> As a world builder, I want to set rain weather so that my world has precipitation effects.

**Story 8.4: Storm Weather**
> As a world builder, I want to set storm weather with thunder so that my world has dramatic weather.

**Story 8.5: Snow Weather**
> As a world builder, I want to set snow weather so that my world has winter conditions.

**Story 8.6: Fog Weather**
> As a world builder, I want to set fog weather so that my world has reduced visibility.

**Story 8.7: Windy Weather**
> As a world builder, I want to set windy weather so that my world has animated vegetation.

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

---

## Issue 9: World Map Editor
**Priority:** P1

### User Stories

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

---

## Issue 10: Prefab Library
**Priority:** P2

### User Stories

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

---

## Issue 11: Cartography Editor
**Priority:** P2

### User Stories

**Story 11.1: 2D Biome Painting**
> As a world builder, I want to paint biomes on a 2D map so that I can plan world regions.

**Story 11.2: Biome Types**
> As a user, I want different biome types (forest, desert, tundra, ocean, etc.) so that I can create diverse regions.

**Story 11.3: Biome Blending**
> As a user, I want biomes to blend at boundaries so that transitions look natural.

**Story 11.4: Elevation Map**
> As a user, I want to see an elevation heat map so that I can visualize terrain height.

**Story 11.5: Export 2D Map**
> As a user, I want to export my 2D biome map as an image so that I can use it for reference.

---

## Issue 12: Building Interior Editor
**Priority:** P2

### User Stories

**Story 12.1: Create Room Layouts**
> As a level designer, I want to create room layouts by drawing walls so that I can design building interiors.

**Story 12.2: Place Doors**
> As a level designer, I want to place doors between rooms so that I can create navigable spaces.

**Story 12.3: Place Windows**
> As a level designer, I want to place windows in walls so that rooms have natural light sources.

**Story 12.4: Furniture Placement**
> As a level designer, I want to place furniture so that rooms feel lived-in.

**Story 12.5: Lighting Placement**
> As a level designer, I want to place light sources so that I can control interior lighting.

**Story 12.6: 2D Top-Down View**
> As a user, I want a 2D top-down view for editing interiors so that layout is precise.

**Story 12.7: Room Metadata**
> As a user, I want to add metadata to rooms (name, purpose, description) so that I can track room details.

---

## Issue 13: Enhanced World Builder (Chunk System + Biomes)
**Priority:** P1

### User Stories

**Story 13.1: Chunk-based World**
> As a world builder, I want my world divided into chunks so that I can work on large worlds efficiently.

**Story 13.2: Chunk Loading/Unloading**
> As a player, I want chunks to load and unload dynamically so that performance stays smooth in large worlds.

**Story 13.3: Biome Assignment**
> As a world builder, I want to assign biomes to chunks so that world regions have distinct characteristics.

**Story 13.4: Biome Terrain Generation**
> As a user, I want terrain to generate differently per biome so that forests, deserts, and mountains look distinct.

**Story 13.5: Chunk Editing**
> As a world builder, I want to edit individual chunks so that I can make detailed modifications.

**Story 13.6: Chunk Neighbors**
> As a user, I want chunks to blend with their neighbors so that there are no visible seams.

---

## Summary Statistics

| Category | Count |
|----------|-------|
| **Total Issues** | 13 |
| **Total User Stories** | 85 |
| **P0 Priority** | 1 issue (7 stories) |
| **P1 Priority** | 9 issues (60 stories) |
| **P2 Priority** | 3 issues (18 stories) |
| **World Builder Pages** | 13 files restored |
| **Lines of Code Restored** | ~5,860 lines |

---

## New Routes Added

All restored features are accessible via these routes:

- `/story/:id/world-archive` - World Archive
- `/story/:id/world-map` - World Map Editor  
- `/story/:id/world-events` - World Events
- `/story/:id/weather` - Weather System
- `/story/:id/terrain` - Enhanced Terrain Editor
- `/story/:id/heightmap` - Heightmap Importer
- `/story/:id/procedural` - Procedural Generator
- `/story/:id/entity-brush` - Entity Brush
- `/story/:id/lod` - LOD System
- `/story/:id/prefabs` - Prefab Library
- `/story/:id/cartography` - Cartography Editor
- `/story/:id/interior` - Building Interior
- `/story/:id/world-enhanced` - Enhanced World Builder
