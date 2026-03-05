import { db, generateId, type Story, type Canvas, type CanvasNode, type Character, type Scene } from './database';

// Debounce utility
function debounce<T extends (...args: unknown[]) => void>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<T>) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

// Story persistence
export async function saveStory(story: Story): Promise<void> {
  await db.stories.put(story);
}

export const debouncedSaveStory = debounce(saveStory, 300);

export async function deleteStory(storyId: string): Promise<void> {
  await db.transaction('rw', 
    [db.stories, db.canvases, db.canvasNodes, db.connections, 
     db.characters, db.scenes, db.timelineTracks, db.timelineEvents, 
     db.worldNodes, db.assets], 
    async () => {
    await db.stories.delete(storyId);
    await db.canvases.where('storyId').equals(storyId).delete();
    await db.canvasNodes.where('storyId').equals(storyId).delete();
    await db.connections.where('storyId').equals(storyId).delete();
    await db.characters.where('storyId').equals(storyId).delete();
    await db.scenes.where('storyId').equals(storyId).delete();
    await db.timelineTracks.where('storyId').equals(storyId).delete();
    await db.timelineEvents.where('storyId').equals(storyId).delete();
    await db.worldNodes.where('storyId').equals(storyId).delete();
    await db.assets.where('storyId').equals(storyId).delete();
  });
}

// Canvas persistence
export async function saveCanvas(canvas: Canvas): Promise<void> {
  await db.canvases.put(canvas);
}

export const debouncedSaveCanvas = debounce(saveCanvas, 300);

// Node persistence
export async function saveNode(node: CanvasNode): Promise<void> {
  await db.canvasNodes.put(node);
}

export const debouncedSaveNode = debounce(saveNode, 300);

export async function saveNodes(nodes: CanvasNode[]): Promise<void> {
  await db.canvasNodes.bulkPut(nodes);
}

export const debouncedSaveNodes = debounce(saveNodes, 300);

// Character persistence
export async function saveCharacter(character: Character): Promise<void> {
  await db.characters.put(character);
}

export const debouncedSaveCharacter = debounce(saveCharacter, 300);

// Scene persistence
export async function saveScene(scene: Scene): Promise<void> {
  await db.scenes.put(scene);
}

export const debouncedSaveScene = debounce(saveScene, 300);

// Load all data for a story
export async function loadStoryData(storyId: string) {
  const [
    story,
    canvases,
    nodes,
    connections,
    characters,
    scenes,
    tracks,
    events,
    worldNodes,
    assets
  ] = await Promise.all([
    db.stories.get(storyId),
    db.canvases.where('storyId').equals(storyId).toArray(),
    db.canvasNodes.where('storyId').equals(storyId).toArray(),
    db.connections.where('storyId').equals(storyId).toArray(),
    db.characters.where('storyId').equals(storyId).sortBy('sortOrder'),
    db.scenes.where('storyId').equals(storyId).toArray(),
    db.timelineTracks.where('storyId').equals(storyId).sortBy('order'),
    db.timelineEvents.where('storyId').equals(storyId).sortBy('order'),
    db.worldNodes.where('storyId').equals(storyId).toArray(),
    db.assets.where('storyId').equals(storyId).toArray()
  ]);

  return {
    story,
    canvases,
    nodes,
    connections,
    characters,
    scenes,
    tracks,
    events,
    worldNodes,
    assets
  };
}