# Bibliarch User Stories - Organized by Epics

## Summary of Changes
- **Removed:** Story 90 (SpringBone - out of scope)
- **Removed:** Story 114 (Auto-dismiss off-screen events)
- **Modified:** Story 133 (Image export → Video export)
- **Total:** 167 user stories (down from 170)
- **Organized into:** 11 Epics

---

## EPIC 1: World Building Foundation
**Issues:** 48, 56, 57, 58, 59
**Theme:** Core world creation and organization systems

### Issue 48: World Archive - 7 stories
1. As a world builder, I want to create a hierarchical structure of locations (World→Continent→Country→Region→City→Building) so that I can organize my game world in a logical, navigable way.

2. As a user viewing my world, I want to see a tree view sidebar with expandable/collapsible nodes so that I can quickly navigate between different locations without getting lost.

3. As a user editing a specific location, I want to see a breadcrumb trail showing the full path (e.g., "Aetheria > Norvath > Silverwind City") so that I always know where I am in the hierarchy.

4. As a user with a large world, I want to search and filter locations by name, type, or tags so that I can find specific places quickly.

5. As a world builder, I want to add metadata to each location (population, climate, terrain type, description) so that I can track important details about each area.

6. As a user editing a continent, I want to create new countries within it so that I can build my world hierarchy naturally from parent to child.

7. As a user cleaning up my world, I want to delete a location and all its descendants at once so that I don't have to manually delete each child location.

### Issue 56: World Map Editor - 6 stories
8. As a world builder, I want to place 3D assets on the map so that I can populate my world with objects.

9. As a user, I want to move already placed assets so that I can adjust their positions.

10. As a user, I want to rotate placed assets so that they face the right direction.

11. As a user, I want to scale placed assets so that I can have size variation.

12. As a user, I want assets organized into categories (trees, buildings, rocks, etc.) so that I can find what I need quickly.

13. As a user with many assets, I want to search for assets by name so that I can find specific models.

### Issue 57: Prefab Library - 5 stories
14. As a world builder, I want to save groups of objects as prefabs so that I can reuse complex arrangements.

15. As a user, I want to organize prefabs into folders/categories so that I can maintain a clean library.

16. As a user, I want to see a details panel when selecting a prefab so that I know what it contains.

17. As a user, I want to drag prefabs from the library into the world so that placement is fast.

18. As a user, I want to edit existing prefabs so that I can update them across all instances.

### Issue 58: Cartography Editor - 5 stories
19. As a world builder, I want to paint biomes on a 2D map so that I can plan world regions.

20. As a user, I want different biome types (forest, desert, tundra, ocean, etc.) so that I can create diverse regions.

21. As a user, I want biomes to blend at boundaries so that transitions look natural.

22. As a user, I want to see an elevation heat map so that I can visualize terrain height.

23. As a user, I want to export my 2D biome map as an image so that I can use it for reference.

### Issue 59: Building Interior Editor - 7 stories
24. As a level designer, I want to create room layouts by drawing walls so that I can design building interiors.

25. As a level designer, I want to place doors between rooms so that I can create navigable spaces.

26. As a level designer, I want to place windows in walls so that rooms have natural light sources.

27. As a level designer, I want to place furniture so that rooms feel lived-in.

28. As a level designer, I want to place light sources so that I can control interior lighting.

29. As a user, I want a 2D top-down view for editing interiors so that layout is precise.

30. As a user, I want to add metadata to rooms (name, purpose, description) so that I can track room details.

**Epic 1 Total: 30 stories**

---

## EPIC 2: Terrain Generation & Import
**Issues:** 49, 50, 53
**Theme:** Creating and modifying terrain

### Issue 49: Heightmap Importer - 4 stories
31. As a world builder, I want to import PNG heightmaps from external tools like WorldMachine or Gaea so that I can use professional terrain generation in my game.

32. As a world builder, I want to import JPG heightmaps so that I have flexibility in the file formats I can use.

33. As a user importing a heightmap, I want to adjust the height scale so that I can control how dramatic the elevation changes are in my terrain.

34. As a user, I want to preview the heightmap in 3D before finalizing the import so that I can verify it looks correct.

### Issue 50: Procedural Generator - 6 stories
35. As a world builder, I want to generate an island terrain preset so that I can quickly create coastal environments.

36. As a world builder, I want to generate a mountainous terrain preset so that I can create dramatic elevated landscapes.

37. As a world builder, I want to generate a flat plains preset so that I can create open fields and farmland.

38. As a world builder, I want to generate a mixed terrain with varied elevations so that I can create diverse natural environments.

39. As a user generating terrain, I want to adjust the Perlin noise parameters (octaves, persistence, lacunarity) so that I can fine-tune the terrain detail.

40. As a user, I want to specify a seed value for procedural generation so that I can recreate the same terrain or share it with others.

### Issue 53: Enhanced Terrain Editor - 10 stories
41. As a terrain artist, I want a paint brush to apply different materials (grass, dirt, rock) to specific areas so that I can create varied terrain textures.

42. As a terrain artist, I want an erase brush to remove terrain modifications so that I can undo mistakes quickly.

43. As a user, I want to toggle a grid overlay on the terrain so that I can align objects and measure distances.

44. As a user, I want to switch to day lighting mode so that I can see how my terrain looks in bright conditions.

45. As a user, I want to switch to sunset lighting mode so that I can preview atmospheric lighting.

46. As a user, I want to switch to night lighting mode so that I can see how my terrain looks in darkness.

47. As a user, I want shadows to be cast based on terrain height so that valleys look darker than peaks.

48. As a user, I want an isometric camera view option so that I can view my terrain from a strategic angle.

49. As a user, I want to export my terrain as JSON so that I can back it up or share it.

50. As a user, I want to import terrain from JSON so that I can restore backups or load shared terrains.

**Epic 2 Total: 20 stories**

---

## EPIC 3: World Population & Performance
**Issues:** 51, 52, 68
**Theme:** Adding objects to world and optimization

### Issue 51: Entity Brush - 5 stories
51. As a world builder, I want to scatter trees across an area with my brush so that I can quickly populate forests.

52. As a world builder, I want to scatter buildings across an area so that I can quickly create towns and villages.

53. As a user scattering objects, I want random scale variation within a range so that my forests look natural and not uniform.

54. As a user scattering objects, I want random rotation so that placed objects don't all face the same direction.

55. As a user, I want to control the density of scattered objects so that I can create sparse forests or dense jungles.

### Issue 52: LOD System - 5 stories
56. As a player exploring the world, I want distant objects to use lower detail models so that the game runs smoothly.

57. As a developer, I want to configure the distances at which LOD levels switch so that I can balance quality and performance.

58. As a developer, I want to see real-time performance stats (FPS, draw calls, polygon count) so that I can optimize my world.

59. As a player, I want objects outside the camera view to be culled so that performance is optimized.

60. As a player, I want objects blocked by other objects to be culled so that rendering is efficient in dense environments.

### Issue 68: Entity Brush Customization - 8 stories
61. As a world builder, I want to toggle randomization on/off so that I can choose between natural forests and manicured gardens.

62. As a world builder, I want to control whether scattered trees have random scale or uniform size so that I can create both wild growth and planned orchards.

63. As a world builder, I want to control whether scattered objects have random rotation or align to a grid so that I can create both organic and organized layouts.

64. As a world builder, by default I want scattered objects to have natural randomness (scale + rotation) so that forests look organic without extra configuration.

65. As a world builder, when I turn off randomization, I want objects placed in a uniform grid pattern so that I can create structured environments like farms or cities.

66. As a world builder, I want different randomization settings for different object categories (trees vs buildings) so that trees can be wild while buildings stay aligned.

67. As a world builder, I want to control density separately from randomization so that I can have dense uniform forests or sparse random scatter.

68. As a world builder, I want to see a preview of the scatter pattern before applying so that I know if it matches my vision.

**Epic 3 Total: 18 stories**

---

## EPIC 4: Weather & Environment
**Issue:** 55
**Theme:** Dynamic weather and environmental systems

### Issue 55: Weather System - 12 stories
69. As a world builder, I want to set sunny weather so that my world has clear, bright conditions.

70. As a world builder, I want to set cloudy weather so that my world has overcast conditions.

71. As a world builder, I want to set rain weather so that my world has precipitation effects.

72. As a world builder, I want to set storm weather with thunder so that my world has dramatic weather.

73. As a world builder, I want to set snow weather so that my world has winter conditions.

74. As a world builder, I want to set fog weather so that my world has reduced visibility.

75. As a world builder, I want to set windy weather so that my world has animated vegetation.

76. As a user, I want weather to transition smoothly between states so that changes feel natural.

77. As a user, I want to see weather statistics (temperature, humidity, wind speed, visibility) so that I know exact conditions.

78. As a user, I want to select seasons (Spring, Summer, Autumn, Winter) so that weather patterns match the time of year.

79. As a user, I want a time scrubber to preview weather changes over time so that I can plan weather cycles.

80. As a game designer, I want weather to affect story moments (e.g., rain during a sad scene) so that weather enhances the narrative.

**Epic 4 Total: 12 stories**

---

## EPIC 5: World Events & Timeline
**Issues:** 54, 60
**Theme:** Structured story events in the world

### Issue 54: World Events System - 11 stories
81. As a game designer, I want to create discovery events at specific locations so that players can find hidden items or lore.

82. As a game designer, I want to create dialogue events at locations so that NPCs can interact with players.

83. As a game designer, I want to create cutscene events so that story moments trigger at specific locations.

84. As a game designer, I want to create weather events so that storms or special weather affects the narrative.

85. As a game designer, I want to create quest events so that objectives are tied to locations.

86. As a game designer, I want to create milestone events so that achievements are marked at locations.

87. As a user, I want a timeline view of events so that I can see the sequence of story events.

88. As a user, I want to track event status (Draft, Scheduled, Active, Completed) so that I know which events are ready.

89. As a game designer, I want to set requirements for events (e.g., must complete quest X) so that events trigger conditionally.

90. As a game designer, I want to define consequences for events so that completing an event changes the world state.

91. As a game designer, I want to assign characters as event participants so that I know who is involved.

### Issue 60: Enhanced World Builder - 6 stories
92. As a world builder, I want my world divided into chunks so that I can work on large worlds efficiently.

93. As a player, I want chunks to load and unload dynamically so that performance stays smooth in large worlds.

94. As a world builder, I want to assign biomes to chunks so that world regions have distinct characteristics.

95. As a user, I want terrain to generate differently per biome so that forests, deserts, and mountains look distinct.

96. As a world builder, I want to edit individual chunks so that I can make detailed modifications.

97. As a user, I want chunks to blend with their neighbors so that there are no visible seams.

**Epic 5 Total: 17 stories**

---

## EPIC 6: 3D Engine Systems
**Issue:** 61
**Theme:** Core engine technology

### Issue 61: 3D Engine Subsystems - 3 stories (removed SpringBone)
98. As a developer, I want a ChunkManager to handle terrain chunk data so that large worlds can be loaded efficiently.

99. As a developer, I want an ObjectManager with object pooling so that spawning many objects doesn't cause performance issues.

100. As a cinematic designer, I want SceneViewer3D with camera path support so that I can create cinematic flythroughs of my world.

**Epic 6 Total: 3 stories**

---

## EPIC 7: Life Mode Core
**Issues:** 62, 70
**Theme:** Foundation of autonomous character life

### Issue 62: Life Mode Core - 7 stories
101. As a player, I want characters to perform everyday actions automatically (eat when hungry, sleep when tired, work during hours) so that the world feels alive without constant intervention.

102. As a player, I want special story events to trigger when meaningful moments occur (relationship developments, discoveries, conflicts) so that emergent narratives unfold naturally.

103. As a player, I want clear visual distinction between background actions and foreground events so that I know when something important is happening.

104. As a player, I want to set how often events occur (Rare/Normal/Frequent) so that the experience matches my preferred pace.

105. As a player, I want to toggle event types on/off (Romance, Drama, Comedy, Mystery) so that I can curate the kinds of stories I see.

106. As a player, I want smart notifications that know when I'm AFK and pause events so that I don't miss important moments.

107. As a player, I want events to have cooldowns so that the same character isn't in constant drama and the experience feels balanced.

### Issue 70: Hybrid AI System - 10 stories
108. As a developer, I want character stats (hunger, energy, extroversion) to drive autonomous actions so that everyday behavior requires no AI calls.

109. As a player, I want characters to have personality presets (Romantic, Workaholic, Creative) with pre-written behaviors so that base behavior is fast and predictable.

110. As a player, I want traits to combine (High Extroversion + High Romance = Flirty behavior) so that emergent personality emerges from simple stats.

111. As a developer, I want a small local model (~3B params, llama.cpp) to generate event dialogue so that events feel fresh and unique.

112. As a developer, I want to cache character personality descriptions so that the LLM prompt is fast and consistent.

113. As a developer, I want structured prompts for the LLM (character traits + event type + context) so that generated dialogue stays on-topic.

114. As a developer, I want to cache LLM responses for identical situations so that replaying events is consistent unless player chooses variation.

115. As a player, I want Life Mode to work offline so that the local LLM runs without internet.

116. As a player, I want to adjust AI creativity (temperature) so that I can choose between predictable and wild story outcomes.

117. As a developer, if the LLM fails, I want the system to fall back to pre-written dialogue so that the game never breaks.

**Epic 7 Total: 17 stories**

---

## EPIC 8: Life Mode Plot & Story Crafting
**Issues:** 63, 67
**Theme:** Creating and triggering plot events

### Issue 63: Plot Event System - 8 stories
118. As a player, I want characters to discover items that trigger story events (finding a letter, ancient artifact, mysterious key) so that objects in the world have narrative significance.

119. As a player, I want certain locations to trigger story events on first visit (haunted house, childhood home, legendary landmark) so that place has memory and meaning.

120. As a player, I want environmental conditions to trigger events (storm at sea, sunset on cliff, fog in forest) so that atmosphere affects story.

121. As a player, I want events to trigger based on narrative progress (entering Act 2 unlocks darker events, completing quest unlocks celebration) so that story evolves organically.

122. As a player, I want events to lead to follow-up events (finding letter → confronting sender → resolution) so that stories have satisfying arcs.

123. As a player, I want plot events tailored to character backstories (orphan finding family clues, artist discovering masterpiece) so that personal history matters.

124. As a player, I want event preview cards to show cryptic teasers ("Sarah finds something that changes everything...") so that anticipation builds before I commit to watching.

125. As a player, I want plot events categorized (Discovery, Revelation, Confrontation, Mystery) so that I understand what type of story beat is coming.

### Issue 67: Plot Seeding - 10 stories
126. As a player, I want to drag "Plot Point" items from a palette onto the timeline/canvas so that I can schedule story beats.

127. As a player, I want to attach conditions to seeds (specific character + location + time) so that events trigger exactly when I envision.

128. As a player, I want different seed types (Romance, Conflict, Discovery, Mystery) so that I can control the story genre.

129. As a player, I want to set seeds as "On Date" or "When Ready" so that I can choose strict scheduling or loose triggers.

130. As a player, I want to assign specific characters to seeds so that the right people are involved in my story.

131. As a player, I want to see all my planted seeds visualized on the timeline so that I can understand my story structure.

132. As a player, I want a notification when one of my seeds triggers so that I know my planned moment is happening.

133. As a player, I want a library of pre-made seed templates so that I can quickly add common story beats.

134. As a player, I want to chain seeds together (A leads to B leads to C) so that I can craft multi-part story arcs.

135. As a player, I want my planted seeds to take priority over AI-generated events so that my story vision is respected.

**Epic 8 Total: 18 stories**

---

## EPIC 9: Life Mode Player Agency
**Issues:** 64, 65, 69
**Theme:** Player control over events and time

### Issue 64: Event Approval System - 7 stories (removed auto-dismiss)
136. As a player, when an event is about to start, I want to see a preview card showing type, participants, location, and teaser so that I can make an informed decision.

137. As a player, I want to click "Play" to immediately watch the event unfold so that I don't miss story moments I'm interested in.

138. As a player, I want to click "Prevent" to stop the event from happening so that I can avoid story directions I don't like.

139. As a player, I want to click "Save for Later" to queue the event so that I can play it when I'm ready.

140. As a player, I want to see how many events are queued so that I know how much story content is waiting for me.

141. As a player, I want events that happened off-screen to still be logged so that I can read what happened later.

142. As a player, when I click "Prevent," I want a brief confirmation explaining the consequence so that I understand I'm altering the timeline.

### Issue 65: Time Travel System - 8 stories
143. As a player, I want to click "Undo" on a completed event to rewind time 5 minutes before it started so that I can erase story beats I didn't enjoy.

144. As a player, after undoing, I want to take control of characters to move them away from triggers so that the event doesn't reoccur immediately.

145. As a player, I want to create an alternate timeline where I make different choices so that I can explore "what if" scenarios without losing my original story.

146. As a player, I want to view multiple timelines side-by-side so that I can compare how different choices led to different outcomes.

147. As a player, I want to choose which timeline becomes my "real" story so that I can commit to the path I prefer.

148. As a player, while watching an event, I want "Influence Points" where I can nudge the outcome so that I have agency even after starting.

149. As a player, after undoing, I want the event to regenerate with different dialogue if it triggers again so that replaying feels fresh.

150. As a player, I want to see a visual tree of all my timeline branches so that I can understand my story's evolution.

### Issue 69: Missing Context System - 8 stories
151. As a player joining an event late, I want a "Catch Up" button that shows me a 2-sentence summary of what happened so far so that I understand the context.

152. As a player joining late, I want to see character emotion icons (angry, sad, happy) even if I missed dialogue so that I immediately understand the tone.

153. As a player joining late, I want characters to have expressive body language (crossed arms, excited jumping) so that I can read the situation without words.

154. As a player who missed the start, I want to rewind 30 seconds and watch at 2x speed so that I can catch up quickly.

155. As a player joining late, I want characters to occasionally do natural recap lines ("So what you're saying is...") so that exposition feels organic.

156. As a player, I want to see a mini-timeline of the event so far ("Introduction → Rising Tension → Climax") so that I know where we are in the arc.

157. As a player switching to an event in progress, I want the camera to smoothly transition and focus on whoever is speaking so that I'm oriented immediately.

158. As a player, I want the option to pause the event and read the full transcript so far so that I can catch up at my own pace.

**Epic 9 Total: 23 stories**

---

## EPIC 10: Life Mode Persistence & Export
**Issue:** 66
**Theme:** Saving, replaying, and exporting story content

### Issue 66: Event Saving & Replay - 10 stories (modified video export)
159. As a player, I want every event automatically saved to a log so that I never lose a story moment.

160. As a player, I want to browse all past events in chronological order so that I can review my story's history.

161. As a player, I want to search events by character, location, type, or date so that I can find specific moments quickly.

162. As a player, I want to star/favorite special events so that I can build a collection of my favorite story beats.

163. As a player, I want to add notes to saved events so that I can remember why a moment mattered to me.

164. As a player, I want to rewatch events exactly as they happened so that I can relive perfect moments.

165. As a player, I want to replay events with AI-generated variation so that I can see alternative dialogue with the same outcome.

166. As a player, I want to export events as readable text/PDF so that I can share my story outside the game.

167. **MODIFIED:** As a player, I want to export events as video so that I can share cinematic story moments with others.

168. As a player, I want the system to automatically capture screenshots during events so that I have visual memories.

**Epic 10 Total: 10 stories**

---

# EPIC SUMMARY

| Epic | Name | Stories | Issues |
|------|------|---------|--------|
| 1 | World Building Foundation | 30 | 48, 56, 57, 58, 59 |
| 2 | Terrain Generation & Import | 20 | 49, 50, 53 |
| 3 | World Population & Performance | 18 | 51, 52, 68 |
| 4 | Weather & Environment | 12 | 55 |
| 5 | World Events & Timeline | 17 | 54, 60 |
| 6 | 3D Engine Systems | 3 | 61 |
| 7 | Life Mode Core | 17 | 62, 70 |
| 8 | Life Mode Plot & Story Crafting | 18 | 63, 67 |
| 9 | Life Mode Player Agency | 23 | 64, 65, 69 |
| 10 | Life Mode Persistence & Export | 10 | 66 |
| **TOTAL** | | **168** | **23 issues** |

---

# CHANGES MADE

## Removed Stories:
- **Story 90** (SpringBone physics) - Out of scope
- **Story 114** (Auto-dismiss off-screen events) - Removed per request

## Modified Stories:
- **Story 133** (was image export) → Now **video export**
  - Old: "As a player, I want to export events as image panels so that I can create visual stories to share."
  - New: "As a player, I want to export events as video so that I can share cinematic story moments with others."

## Final Count: 168 user stories
