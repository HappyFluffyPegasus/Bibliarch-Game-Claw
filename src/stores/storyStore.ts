import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Story, Canvas, CanvasNode, Character, Scene, TimelineTrack, TimelineEvent, WorldNode } from '../db/database';
import { loadStoryData, debouncedSaveStory, debouncedSaveCanvas, debouncedSaveNode, debouncedSaveNodes, debouncedSaveCharacter } from '../db/persistence';

interface StoryState {
  // Current story
  currentStory: Story | null;
  currentStoryId: string | null;
  
  // Current canvas for notes
  currentCanvas: Canvas | null;
  
  // Story data
  canvases: Canvas[];
  nodes: CanvasNode[];
  characters: Character[];
  scenes: Scene[];
  tracks: TimelineTrack[];
  events: TimelineEvent[];
  worldNodes: WorldNode[];
  
  // Loading state
  isLoading: boolean;
  error: string | null;
  
  // Actions
  loadStory: (storyId: string) => Promise<void>;
  unloadStory: () => void;
  createStory: (title: string, description?: string) => Story;
  updateStory: (updates: Partial<Story>) => void;
  deleteStory: (storyId: string) => Promise<void>;
  
  // Canvas actions
  loadCanvas: (canvasId: string) => void;
  setCurrentCanvas: (canvas: Canvas | null) => void;
  createCanvas: (name: string, parentCanvasId?: string) => Canvas;
  updateCanvas: (canvasId: string, updates: Partial<Canvas>) => void;
  
  // Node actions
  createNode: (canvasId: string, type: CanvasNode['type'], x: number, y: number) => CanvasNode;
  updateNode: (nodeId: string, updates: Partial<CanvasNode>) => void;
  updateNodes: (updates: Array<{ id: string } & Partial<CanvasNode>>) => void;
  deleteNode: (nodeId: string) => void;
  
  // Character actions
  createCharacter: (name: string) => Character;
  updateCharacter: (characterId: string, updates: Partial<Character>) => void;
  deleteCharacter: (characterId: string) => void;
  reorderCharacters: (characterIds: string[]) => void;
}

export const useStoryStore = create<StoryState>()((set, get) => ({
  currentStory: null,
  currentStoryId: null,
  currentCanvas: null,
  canvases: [],
  nodes: [],
  characters: [],
  scenes: [],
  tracks: [],
  events: [],
  worldNodes: [],
  isLoading: false,
  error: null,
  
  loadStory: async (storyId: string) => {
    set({ isLoading: true, error: null });
    try {
      const data = await loadStoryData(storyId);
      if (!data.story) {
        throw new Error('Story not found');
      }
      set({
        currentStory: data.story,
        currentStoryId: storyId,
        canvases: data.canvases,
        nodes: data.nodes,
        characters: data.characters,
        scenes: data.scenes,
        tracks: data.tracks,
        events: data.events,
        worldNodes: data.worldNodes,
        isLoading: false
      });
    } catch (err) {
      set({ error: String(err), isLoading: false });
    }
  },
  
  unloadStory: () => {
    set({
      currentStory: null,
      currentStoryId: null,
      currentCanvas: null,
      canvases: [],
      nodes: [],
      characters: [],
      scenes: [],
      tracks: [],
      events: [],
      worldNodes: [],
      error: null
    });
  },
  
  loadCanvas: (canvasId: string) => {
    const { canvases } = get();
    const canvas = canvases.find(c => c.id === canvasId);
    if (canvas) {
      set({ currentCanvas: canvas });
    }
  },
  
  setCurrentCanvas: (canvas) => {
    set({ currentCanvas: canvas });
  },
  
  createStory: (title: string, description?: string) => {
    const { generateId } = require('../db/database');
    const story: Story = {
      id: generateId(),
      title,
      description: description || '',
      tags: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      settings: { worldLevels: ['World', 'Country', 'City', 'Building', 'Inside Building'] },
      canvasHue: 220,
      timelineTags: []
    };
    debouncedSaveStory(story);
    return story;
  },
  
  updateStory: (updates) => {
    const { currentStory } = get();
    if (!currentStory) return;
    const updated = { ...currentStory, ...updates, updatedAt: new Date().toISOString() };
    set({ currentStory: updated });
    debouncedSaveStory(updated);
  },
  
  deleteStory: async (storyId: string) => {
    const { deleteStory } = require('../db/persistence');
    await deleteStory(storyId);
    if (get().currentStoryId === storyId) {
      get().unloadStory();
    }
  },
  
  createCanvas: (name: string, parentCanvasId?: string) => {
    const { currentStoryId, canvases } = get();
    if (!currentStoryId) throw new Error('No story loaded');
    const { generateId } = require('../db/database');
    const canvas: Canvas = {
      id: generateId(),
      storyId: currentStoryId,
      name,
      parentCanvasId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    set(state => ({ canvases: [...state.canvases, canvas] }));
    debouncedSaveCanvas(canvas);
    return canvas;
  },
  
  updateCanvas: (canvasId: string, updates: Partial<Canvas>) => {
    set(state => ({
      canvases: state.canvases.map(c => 
        c.id === canvasId ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c
      )
    }));
    const canvas = get().canvases.find(c => c.id === canvasId);
    if (canvas) debouncedSaveCanvas(canvas);
  },
  
  createNode: (canvasId: string, type: CanvasNode['type'], x: number, y: number) => {
    const { currentStoryId } = get();
    if (!currentStoryId) throw new Error('No story loaded');
    const { generateId } = require('../db/database');
    
    // Default sizes based on type
    const sizes = {
      text: { width: 200, height: 100 },
      character: { width: 220, height: 80 },
      event: { width: 220, height: 80 },
      location: { width: 200, height: 80 },
      folder: { width: 220, height: 80 },
      image: { width: 200, height: 150 },
      table: { width: 300, height: 200 }
    };
    
    const size = sizes[type] || sizes.text;
    
    const node: CanvasNode = {
      id: generateId(),
      storyId: currentStoryId,
      canvasId,
      type,
      x,
      y,
      width: size.width,
      height: size.height,
      zIndex: get().nodes.filter(n => n.canvasId === canvasId).length,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    set(state => ({ nodes: [...state.nodes, node] }));
    debouncedSaveNodes([...get().nodes, node]);
    return node;
  },
  
  updateNode: (nodeId: string, updates: Partial<CanvasNode>) => {
    set(state => ({
      nodes: state.nodes.map(n => 
        n.id === nodeId ? { ...n, ...updates, updatedAt: new Date().toISOString() } : n
      )
    }));
    const node = get().nodes.find(n => n.id === nodeId);
    if (node) debouncedSaveNodes(get().nodes);
  },
  
  updateNodes: (updates) => {
    set(state => ({
      nodes: state.nodes.map(n => {
        const update = updates.find(u => u.id === n.id);
        return update ? { ...n, ...update, updatedAt: new Date().toISOString() } : n;
      })
    }));
    debouncedSaveNodes(get().nodes);
  },
  
  deleteNode: (nodeId: string) => {
    set(state => ({ nodes: state.nodes.filter(n => n.id !== nodeId) }));
    debouncedSaveNodes(get().nodes);
  },
  
  createCharacter: (name: string) => {
    const { currentStoryId } = get();
    if (!currentStoryId) throw new Error('No story loaded');
    const { generateId } = require('../db/database');
    const character: Character = {
      id: generateId(),
      storyId: currentStoryId,
      name,
      appearance: { visibleAssets: [], colors: {}, transforms: {} },
      backstory: '',
      customFields: {},
      sortOrder: get().characters.length,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    set(state => ({ characters: [...state.characters, character] }));
    debouncedSaveCharacter(character);
    return character;
  },
  
  updateCharacter: (characterId: string, updates: Partial<Character>) => {
    set(state => ({
      characters: state.characters.map(c => 
        c.id === characterId ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c
      )
    }));
    const char = get().characters.find(c => c.id === characterId);
    if (char) debouncedSaveCharacter(char);
  },
  
  deleteCharacter: (characterId: string) => {
    set(state => ({ characters: state.characters.filter(c => c.id !== characterId) }));
  },
  
  reorderCharacters: (characterIds: string[]) => {
    set(state => ({
      characters: state.characters.map(c => ({
        ...c,
        sortOrder: characterIds.indexOf(c.id)
      }))
    }));
  }
}));

// UI Store (persisted to localStorage)
interface UIState {
  sidebarOpen: boolean;
  sidebarWidth: number;
  theme: 'dark' | 'light';
  lastStoryId: string | null;
  panelLayout: Record<string, { visible: boolean; position: string }>;
  
  setSidebarOpen: (open: boolean) => void;
  setSidebarWidth: (width: number) => void;
  setTheme: (theme: 'dark' | 'light') => void;
  setLastStoryId: (id: string | null) => void;
  setPanelLayout: (layout: Record<string, { visible: boolean; position: string }>) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      sidebarOpen: true,
      sidebarWidth: 280,
      theme: 'dark',
      lastStoryId: null,
      panelLayout: {},
      
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      setSidebarWidth: (width) => set({ sidebarWidth: width }),
      setTheme: (theme) => set({ theme }),
      setLastStoryId: (id) => set({ lastStoryId: id }),
      setPanelLayout: (layout) => set({ panelLayout: layout })
    }),
    { name: 'bibliarch-ui' }
  )
);