#!/bin/bash
# Script to create GitHub issues for Bibliarch OG MVP features
# Run this after authenticating with: gh auth login

REPO="HappyFluffyPegasus/Bibliarch-Game-Claw"

# Issue 1: World Archive
ggh issue create --repo $REPO --title "[P0] World Archive - Hierarchical World Builder" --body "## User Stories

**Story 1.1: Create World Hierarchy**
> As a world builder, I want to create a hierarchical structure of locations (World→Continent→Country→Region→City→Building) so that I can organize my game world in a logical, navigable way.

**Story 1.2: Tree View Navigation**
> As a user viewing my world, I want to see a tree view sidebar with expandable/collapsible nodes so that I can quickly navigate between different locations without getting lost.

**Story 1.3: Breadcrumb Navigation**
> As a user editing a specific location, I want to see a breadcrumb trail showing the full path (e.g., \"Aetheria > Norvath > Silverwind City\") so that I always know where I am in the hierarchy.

**Story 1.4: Search and Filter**
> As a user with a large world, I want to search and filter locations by name, type, or tags so that I can find specific places quickly.

**Story 1.5: Location Metadata**
> As a world builder, I want to add metadata to each location (population, climate, terrain type, description) so that I can track important details about each area.

**Story 1.6: Create Sub-locations**
> As a user editing a continent, I want to create new countries within it so that I can build my world hierarchy naturally from parent to child.

**Story 1.7: Delete with Descendants**
> As a user cleaning up my world, I want to delete a location and all its descendants at once so that I don't have to manually delete each child location.

## Acceptance Criteria
- [ ] Tree view sidebar with expandable nodes
- [ ] Breadcrumb navigation showing full path
- [ ] Search and filter functionality
- [ ] Metadata fields for each location
- [ ] Create sub-location from parent
- [ ] Delete with descendants option
- [ ] Route: /story/:id/world-archive

## Related File
- src/world-builder/WorldArchivePage.tsx" --label "enhancement,P0,world-builder"

# Issue 2: Heightmap Importer
ggh issue create --repo $REPO --title "[P1] Heightmap Importer - External Tool Integration" --body "## User Stories

**Story 2.1: Import PNG Heightmaps**
> As a world builder, I want to import PNG heightmaps from external tools like WorldMachine or Gaea so that I can use professional terrain generation in my game.

**Story 2.2: Import JPG Heightmaps**
> As a world builder, I want to import JPG heightmaps so that I have flexibility in the file formats I can use.

**Story 2.3: Height Scale Adjustment**
> As a user importing a heightmap, I want to adjust the height scale so that I can control how dramatic the elevation changes are in my terrain.

**Story 2.4: Preview Before Import**
> As a user, I want to preview the heightmap in 3D before finalizing the import so that I can verify it looks correct.

## Acceptance Criteria
- [ ] Support PNG format
- [ ] Support JPG format  
- [ ] Height scale slider
- [ ] 3D preview before import
- [ ] Route: /story/:id/heightmap

## Related File
- src/world-builder/HeightmapImporter.tsx" --label "enhancement,P1,world-builder"

# Issue 3: Procedural Terrain Generator
ggh issue create --repo $REPO --title "[P1] Procedural Terrain Generator - Perlin Noise" --body "## User Stories

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

## Acceptance Criteria
- [ ] 4 terrain presets (Island, Mountains, Plains, Mixed)
- [ ] Perlin noise parameter controls
- [ ] Seed input field
- [ ] 3D preview before generation
- [ ] Route: /story/:id/procedural

## Related File
- src/world-builder/ProceduralGenerator.tsx" --label "enhancement,P1,world-builder"

# Issue 4: Entity Brush System
ggh issue create --repo $REPO --title "[P1] Entity Brush System - Scatter Objects" --body "## User Stories

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

## Acceptance Criteria
- [ ] Tree scattering brush
- [ ] Building scattering brush
- [ ] Random scale range control
- [ ] Random rotation toggle
- [ ] Density slider
- [ ] Route: /story/:id/entity-brush

## Related File
- src/world-builder/EntityBrush.tsx" --label "enhancement,P1,world-builder"

# Issue 5: LOD System
ggh issue create --repo $REPO --title "[P1] LOD System - Performance Optimization" --body "## User Stories

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

## Acceptance Criteria
- [ ] Automatic LOD level switching based on distance
- [ ] Configurable LOD distances
- [ ] Performance stats overlay (FPS, draw calls, polygons)
- [ ] Frustum culling implementation
- [ ] Occlusion culling implementation
- [ ] Route: /story/:id/lod

## Related File
- src/world-builder/LODSystem.tsx" --label "enhancement,P1,world-builder,performance"

echo "Created first 5 issues. Continuing..."
