#!/bin/bash
# Part 3 of GitHub issues creation script (final)

REPO="HappyFluffyPegasus/Bibliarch-Game-Claw"

# Issue 11: Cartography Editor
ggh issue create --repo $REPO --title "[P2] Cartography Editor - 2D Biome Painting" --body "## User Stories

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

## Acceptance Criteria
- [ ] 2D biome painting canvas
- [ ] Multiple biome types (10+)
- [ ] Smooth biome blending
- [ ] Elevation heat map view
- [ ] Export as PNG/JPG
- [ ] Route: /story/:id/cartography

## Related File
- src/world-builder/CartographyEditorPage.tsx" --label "enhancement,P2,world-builder"

# Issue 12: Building Interior Editor
ggh issue create --repo $REPO --title "[P2] Building Interior Editor" --body "## User Stories

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

## Acceptance Criteria
- [ ] Wall drawing tool
- [ ] Door placement
- [ ] Window placement
- [ ] Furniture library and placement
- [ ] Light source placement
- [ ] 2D top-down view
- [ ] Room metadata panel
- [ ] Route: /story/:id/interior

## Related File
- src/world-builder/BuildingInteriorEditor.tsx" --label "enhancement,P2,world-builder"

# Issue 13: Enhanced World Builder
ggh issue create --repo $REPO --title "[P1] Enhanced World Builder - Chunk System + Biomes" --body "## User Stories

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

## Acceptance Criteria
- [ ] Chunk-based world system
- [ ] Dynamic chunk loading/unloading
- [ ] Biome assignment per chunk
- [ ] Biome-specific terrain generation
- [ ] Individual chunk editing
- [ ] Seamless chunk blending
- [ ] Route: /story/:id/world-enhanced

## Related File
- src/world-builder/EnhancedWorldBuilderPage.tsx

## Related Missing Systems
- SpringBoneSystem (physics)
- ChunkManager (data)
- ObjectManager (pooling)
- SceneViewer3D with Camera Paths (cinematic)" --label "enhancement,P1,world-builder"

# Issue 14: 3D Engine Subsystems (Meta-Issue)
ggh issue create --repo $REPO --title "[P1] 3D Engine Subsystems - SpringBone, ChunkManager, ObjectManager" --body "## Overview
This is a meta-issue tracking the missing 3D engine subsystems needed for the complete OG MVP experience.

## User Stories

**Story A: SpringBone System**
> As a character artist, I want physics-based hair and cloth animation (SpringBone) so that character models have realistic secondary motion.

**Story B: Chunk Manager**
> As a developer, I want a ChunkManager to handle terrain chunk data so that large worlds can be loaded efficiently.

**Story C: Object Manager**
> As a developer, I want an ObjectManager with object pooling so that spawning many objects doesn't cause performance issues.

**Story D: Scene Viewer with Camera Paths**
> As a cinematic designer, I want SceneViewer3D with camera path support so that I can create cinematic flythroughs of my world.

## Acceptance Criteria
- [ ] SpringBoneSystem: Physics simulation for bones
- [ ] SpringBoneSystem: Integration with character models
- [ ] ChunkManager: Chunk data storage and retrieval
- [ ] ChunkManager: Neighbor chunk handling
- [ ] ObjectManager: Object pooling implementation
- [ ] ObjectManager: Spawn/despawn optimization
- [ ] SceneViewer3D: Camera path creation
- [ ] SceneViewer3D: Path playback with easing

## Technical Notes
These are core engine systems that support the higher-level features. They may need to be implemented first or in parallel with dependent features.

## Dependencies
- Depends on: Babylon.js expertise
- Blocks: Enhanced World Builder (full functionality)" --label "enhancement,P1,world-builder,engine"

echo "All 14 issues created successfully!"
echo ""
echo "Summary:"
echo "- 1 P0 issue (World Archive)"
echo "- 9 P1 issues (Core features + Engine)"
echo "- 3 P2 issues (Polish features)"
echo "- 1 Meta-issue (Engine subsystems)"
echo ""
echo "Total: 14 issues with 85+ user stories"
