import Dexie, { Table } from 'dexie';

// TypeScript Interfaces

export interface Story {
  id: string;
  title: string;
  description: string;
  coverImage?: ArrayBuffer;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  settings: StorySettings;
  cloudStoryId?: string;
  cloudBundleVersion?: number;
  lastCloudSaveAt?: string;
  canvasHue?: number;  // #3 review - default 220
  timelineTags?: Array<{name: string; color: string}>;  // #25 review
}

export interface StorySettings {
  worldLevels: string[];
  defaultChapterId?: string;
}

export interface Canvas {
  id: string;
  storyId: string;
  name: string;
  parentCanvasId?: string;
  createdAt: string;
  updatedAt: string;
  canvasHue?: number;  // #3 review
}

export type CanvasNodeType =
  | 'text' | 'character' | 'event' | 'location' | 'folder'
  | 'list' | 'image' | 'table' | 'relationship-canvas'
  | 'line' | 'compact-text' | 'document';  // #1 - added 'document'

export interface CanvasNode {
  id: string;
  storyId: string;
  canvasId: string;
  type: CanvasNodeType;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  text?: string;
  content?: string;
  color?: string;
  imageAssetId?: string;
  profileImageAssetId?: string;
  linkedCanvasId?: string;
  parentId?: string;
  childIds?: string[];
  typeData?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface CanvasConnection {
  id: string;
  storyId: string;
  canvasId: string;
  fromNodeId: string;
  toNodeId: string;
  type: string;
  label?: string;
  color?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Character {
  id: string;
  storyId: string;
  name: string;
  appearance: CharacterAppearance;
  backstory: string;
  customFields: Record<string, string>;
  profileImageAssetId?: string;
  modelAssetId?: string;
  createdAt: string;
  updatedAt: string;
  // #18 review additions
  outlookOnLife?: string;
  favoriteFood?: string;
  favoriteColor?: string;
  sortOrder: number;
}

export interface CharacterAppearance {
  visibleAssets: string[];
  colors: Record<string, string>;
  transforms: Record<string, { target: string; value: number }>;
}

export interface AudioTrack {
  id: string;
  assetId: string;
  volume: number;
  loop: boolean;
}

export interface Scene {
  id: string;
  storyId: string;
  title: string;
  characters: ScenePlacement[];
  dialogueLines: DialogueLine[];
  keyframes: Keyframe[];
  props: SceneProp[];
  locationId?: string;
  duration: number;
  createdAt: string;
  updatedAt: string;
  // #19, #22 review additions
  audioTracks?: AudioTrack[];  // replaces backgroundMusic
  lightingPreset?: string;
  linkedTimelineEventId?: string;
  thumbnailAssetId?: string;
  typewriterCPS?: number;  // #21 review
  // #24 backdrop additions
  lastBackdropName?: string;
  backdropCameraPosition?: { x: number; y: number; z: number };
  backdropCameraRotation?: { x: number; y: number; z: number };
}

export interface ScenePlacement {
  characterId: string;
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
  scale: number;
  visible: boolean;
}

export interface DialogueLine {
  id: string;
  characterId: string;
  text: string;
  startTime: number;
  duration: number;
}

export interface Keyframe {
  id: string;
  time: number;
  target: string;
  property: string;
  value: unknown;
  easing: string;
}

export interface SceneProp {
  id: string;
  modelAssetId: string;
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
  scale: number;
}

export interface TimelineTrack {
  id: string;
  storyId: string;
  name: string;
  order: number;
  color: string;
  createdAt: string;
  updatedAt: string;
}

export interface TimelineEvent {
  id: string;
  storyId: string;
  trackId: string;
  title: string;
  description: string;
  order: number;
  characterStates: Record<string, { mood?: string; location?: string; notes?: string }>;
  relationshipStates: Record<string, { characterA: string; characterB: string; status: string; notes?: string }>;
  subEvents: SubEvent[];
  createdAt: string;
  updatedAt: string;
  tags?: string[];  // #25 review
}

export interface SubEvent {
  id: string;
  title: string;
  description: string;
  order: number;
}

export interface ViewportState {
  cameraPosition: { x: number; y: number; z: number };
  cameraTarget: { x: number; y: number; z: number };
  cameraMode: 'orbit' | 'firstPerson';
}

export interface WorldNode {
  id: string;
  storyId: string;
  parentId?: string;
  level: string;
  order: number;
  name: string;
  heightmapData?: Float32Array;
  materialData?: Uint8Array;
  terrainResolution?: number;
  objects: WorldObject[];
  cartography: unknown;
  locations: WorldLocation[];
  borders?: unknown[];
  lots?: unknown[];
  roads?: unknown[];
  buildings?: BuildingData[];
  environment: unknown;
  createdAt: string;
  updatedAt: string;
  viewportState?: ViewportState;  // #28 review
}

export interface WorldObject {
  id: string;
  assetId: string;
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
  scale: number;
}

export interface WorldLocation {
  id: string;
  name: string;
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
}

export interface BuildingData {
  id: string;
  name: string;
  lotId: string;
  walls: unknown[];
  furniture: unknown[];
}

export interface Asset {
  id: string;
  storyId: string;
  type: 'image' | 'model' | 'audio';
  originalName: string;
  mimeType: string;
  filePath: string;
  thumbnailPath?: string;
  size: number;
  hash: string;
  createdAt: string;
  updatedAt: string;
}

// Database Class

export class BibliarchDB extends Dexie {
  stories!: Table<Story>;
  canvases!: Table<Canvas>;
  canvasNodes!: Table<CanvasNode>;
  connections!: Table<CanvasConnection>;
  characters!: Table<Character>;
  scenes!: Table<Scene>;
  timelineTracks!: Table<TimelineTrack>;
  timelineEvents!: Table<TimelineEvent>;
  worldNodes!: Table<WorldNode>;
  assets!: Table<Asset>;

  constructor() {
    super('BibliarchDB');

    this.version(1).stores({
      stories: '&id, updatedAt',
      canvases: '&id, storyId, parentCanvasId',
      canvasNodes: '&id, storyId, canvasId, type, parentId, [canvasId+type], zIndex',
      connections: '&id, storyId, canvasId, fromNodeId, toNodeId',
      characters: '&id, storyId, name, sortOrder',
      scenes: '&id, storyId, locationId',
      timelineTracks: '&id, storyId, order',
      timelineEvents: '&id, storyId, trackId, order',
      worldNodes: '&id, storyId, parentId, level, [storyId+level]',
      assets: '&id, storyId, type, hash',
    });
  }
}

export const db = new BibliarchDB();

// Utility function to generate UUIDs
export function generateId(): string {
  return crypto.randomUUID();
}