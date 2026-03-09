import { useState, useRef, useCallback, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mountain, Trees, Flower2, Cloud, Sun, Moon, Wind,
  Paintbrush, Eraser, Circle, Square, Waves, Grid3X3,
  Camera, Video, Play, Pause, SkipForward, SkipBack,
  Maximize2, Minimize2, Plus, Trash2, Copy, MousePointer2,
  Undo2, Redo2, Save, FolderOpen, Settings, Layers
} from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { cn } from '../lib/utils';

// Enhanced terrain brush types
const terrainBrushes = [
  { id: 'raise', name: 'Raise', icon: Mountain, color: '#22c55e', strength: 1 },
  { id: 'lower', name: 'Lower', icon: Minimize2, color: '#ef4444', strength: -1 },
  { id: 'flatten', name: 'Flatten', icon: Square, color: '#3b82f6', strength: 0 },
  { id: 'smooth', name: 'Smooth', icon: Waves, color: '#a855f7', strength: 0.5 },
  { id: 'noise', name: 'Noise', icon: Wind, color: '#f59e0b', strength: 0.3 },
  { id: 'plateau', name: 'Plateau', icon: Grid3X3, color: '#6366f1', strength: 1 },
  { id: 'valley', name: 'Valley', icon: Waves, color: '#14b8a6', strength: -0.8 },
];

// Biome types for painting
const biomes = [
  { id: 'forest', name: 'Forest', color: '#228b22', vegetation: 'trees', density: 0.8 },
  { id: 'desert', name: 'Desert', color: '#f4a460', vegetation: 'cactus', density: 0.1 },
  { id: 'snow', name: 'Snow', color: '#fffafa', vegetation: 'pine', density: 0.3 },
  { id: 'plains', name: 'Plains', color: '#90ee90', vegetation: 'grass', density: 0.5 },
  { id: 'swamp', name: 'Swamp', color: '#556b2f', vegetation: 'willow', density: 0.6 },
  { id: 'ocean', name: 'Ocean', color: '#1e90ff', vegetation: 'coral', density: 0 },
];

// Object catalog
const objectCatalog = {
  nature: [
    { id: 'oak_tree', name: 'Oak Tree', icon: '🌳', scale: [1, 2, 1] },
    { id: 'pine_tree', name: 'Pine Tree', icon: '🌲', scale: [0.8, 3, 0.8] },
    { id: 'palm_tree', name: 'Palm Tree', icon: '🌴', scale: [1, 2.5, 1] },
    { id: 'bush', name: 'Bush', icon: '🌿', scale: [0.5, 0.5, 0.5] },
    { id: 'flower', name: 'Flowers', icon: '🌸', scale: [0.2, 0.3, 0.2] },
    { id: 'rock', name: 'Rock', icon: '🪨', scale: [0.5, 0.4, 0.5] },
    { id: 'crystal', name: 'Crystal', icon: '💎', scale: [0.3, 0.8, 0.3] },
  ],
  structures: [
    { id: 'house', name: 'House', icon: '🏠', scale: [2, 2, 2] },
    { id: 'tower', name: 'Tower', icon: '🏰', scale: [1.5, 4, 1.5] },
    { id: 'bridge', name: 'Bridge', icon: '🌉', scale: [3, 1, 1] },
    { id: 'tent', name: 'Tent', icon: '⛺', scale: [1.5, 1, 1.5] },
    { id: 'lamp', name: 'Street Lamp', icon: '🏮', scale: [0.2, 1.5, 0.2] },
  ],
  water: [
    { id: 'boat', name: 'Boat', icon: '⛵', scale: [1.5, 0.8, 0.8] },
    { id: 'dock', name: 'Dock', icon: '🛟', scale: [2, 0.5, 1] },
    { id: 'lighthouse', name: 'Lighthouse', icon: '🔦', scale: [1, 3, 1] },
  ]
};

interface PlacedObject {
  id: string;
  type: string;
  x: number;
  y: number;
  z: number;
  rotation: number;
  scale: number;
}

interface TerrainChunk {
  id: string;
  x: number;
  z: number;
  heightmap: Float32Array;
  biome: string;
  objects: PlacedObject[];
}

export function EnhancedWorldBuilderPage() {
  const { id } = useParams();
  const [activeTool, setActiveTool] = useState('raise');
  const [activeBiome, setActiveBiome] = useState('forest');
  const [activeObject, setActiveObject] = useState<string | null>(null);
  const [brushSize, setBrushSize] = useState(5);
  const [brushStrength, setBrushStrength] = useState(0.5);
  const [isPainting, setIsPainting] = useState(false);
  const [cameraMode, setCameraMode] = useState<'orbit' | 'firstPerson'>('orbit');
  const [showGrid, setShowGrid] = useState(true);
  const [selectedObjects, setSelectedObjects] = useState<Set<string>>(new Set());
  const [chunks, setChunks] = useState<TerrainChunk[]>([]);
  const [undoStack, setUndoStack] = useState<any[]>([]);
  const [redoStack, setRedoStack] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'terrain' | 'biome' | 'objects' | 'settings'>('terrain');

  // Generate initial chunks
  useEffect(() => {
    const initialChunks: TerrainChunk[] = [];
    for (let x = -2; x <= 2; x++) {
      for (let z = -2; z <= 2; z++) {
        const heightmap = new Float32Array(64 * 64);
        // Generate some initial terrain noise
        for (let i = 0; i < heightmap.length; i++) {
          const hx = i % 64;
          const hz = Math.floor(i / 64);
          heightmap[i] = Math.sin(hx * 0.1) * Math.cos(hz * 0.1) * 2 + Math.random() * 0.5;
        }
        
        initialChunks.push({
          id: `chunk_${x}_${z}`,
          x: x * 64,
          z: z * 64,
          heightmap,
          biome: 'plains',
          objects: []
        });
      }
    }
    setChunks(initialChunks);
  }, []);

  const undo = () => {
    if (undoStack.length === 0) return;
    const action = undoStack[undoStack.length - 1];
    // Undo logic here
    setUndoStack(prev => prev.slice(0, -1));
    setRedoStack(prev => [...prev, action]);
  };

  const redo = () => {
    if (redoStack.length === 0) return;
    const action = redoStack[redoStack.length - 1];
    // Redo logic here
    setRedoStack(prev => prev.slice(0, -1));
    setUndoStack(prev => [...prev, action]);
  };

  const placeObject = (type: string, x: number, z: number) => {
    const newObject: PlacedObject = {
      id: Date.now().toString(),
      type,
      x,
      y: 0,
      z,
      rotation: Math.random() * 360,
      scale: 1 + Math.random() * 0.3
    };
    
    // Find chunk and add object
    const chunkX = Math.floor(x / 64) * 64;
    const chunkZ = Math.floor(z / 64) * 64;
    
    setChunks(prev => prev.map(chunk => {
      if (chunk.x === chunkX && chunk.z === chunkZ) {
        return { ...chunk, objects: [...chunk.objects, newObject] };
      }
      return chunk;
    }));
  };

  return (
    <div className="h-screen flex bg-background">
      {/* Left Toolbar */}
      <div className="w-16 border-r border-border bg-card/50 backdrop-blur flex flex-col items-center py-4 gap-2">
        <button
          onClick={() => setActiveTab('terrain')}
          className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center transition-colors",
            activeTab === 'terrain' ? "bg-primary text-primary-foreground" : "hover:bg-accent"
          )}
          title="Terrain"
        >
          <Mountain className="w-5 h-5" />
        </button>
        
        <button
          onClick={() => setActiveTab('biome')}
          className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center transition-colors",
            activeTab === 'biome' ? "bg-primary text-primary-foreground" : "hover:bg-accent"
          )}
          title="Biomes"
        >
          <Paintbrush className="w-5 h-5" />
        </button>
        
        <button
          onClick={() => setActiveTab('objects')}
          className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center transition-colors",
            activeTab === 'objects' ? "bg-primary text-primary-foreground" : "hover:bg-accent"
          )}
          title="Objects"
        >
          <Trees className="w-5 h-5" />
        </button>
        
        <div className="w-8 h-px bg-border my-2" />
        
        <button
          onClick={() => setCameraMode(cameraMode === 'orbit' ? 'firstPerson' : 'orbit')}
          className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center transition-colors",
            cameraMode === 'firstPerson' ? "bg-primary text-primary-foreground" : "hover:bg-accent"
          )}
          title="Toggle Camera Mode"
        >
          <Camera className="w-5 h-5" />
        </button>
        
        <button
          onClick={() => setShowGrid(!showGrid)}
          className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center transition-colors",
            showGrid ? "bg-primary/20 text-primary" : "hover:bg-accent"
          )}
          title="Toggle Grid"
        >
          <Grid3X3 className="w-5 h-5" />
        </button>
        
        <div className="flex-1" />
        
        <button onClick={undo} className="w-12 h-12 rounded-xl hover:bg-accent flex items-center justify-center">
          <Undo2 className="w-5 h-5" />
        </button>
        
        <button onClick={redo} className="w-12 h-12 rounded-xl hover:bg-accent flex items-center justify-center">
          <Redo2 className="w-5 h-5" />
        </button>
      </div>

      {/* Main Viewport */}
      <div className="flex-1 relative">
        {/* 3D Canvas placeholder */}
        <div className="absolute inset-0 bg-gradient-to-b from-sky-200 to-sky-400">
          {showGrid && (
            <div 
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: `
                  linear-gradient(to right, #000 1px, transparent 1px),
                  linear-gradient(to bottom, #000 1px, transparent 1px)
                `,
                backgroundSize: '64px 64px'
              }}
            />
          )}
          
          {/* Chunk visualization */}
          {chunks.map(chunk => (
            <div
              key={chunk.id}
              className="absolute border border-white/20 bg-green-500/20"
              style={{
                left: `calc(50% + ${chunk.x}px)`,
                top: `calc(50% + ${chunk.z}px)`,
                width: 64,
                height: 64,
              }}
            >
              <span className="absolute top-1 left-1 text-[8px] text-white/50">
                {chunk.x},{chunk.z}
              </span>
              
              {/* Objects in chunk */}
              {chunk.objects.map(obj => {
                const objectDef = Object.values(objectCatalog)
                  .flat()
                  .find(o => o.id === obj.type);
                
                return (
                  <div
                    key={obj.id}
                    className="absolute text-2xl cursor-pointer hover:scale-110 transition-transform"
                    style={{
                      left: obj.x - chunk.x,
                      top: obj.z - chunk.z,
                      transform: `rotate(${obj.rotation}deg) scale(${obj.scale})`
                    }}
                    onClick={() => {
                      setSelectedObjects(prev => {
                        const next = new Set(prev);
                        if (next.has(obj.id)) next.delete(obj.id);
                        else next.add(obj.id);
                        return next;
                      });
                    }}
                  >
                    {objectDef?.icon || '📦'}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Overlay UI */}
        <div className="absolute top-4 left-4">
          <GlassCard className="p-3">
            <div className="text-sm font-medium">World Builder</div>
            <div className="text-xs text-muted-foreground">
              {chunks.length} chunks • {chunks.reduce((acc, c) => acc + c.objects.length, 0)} objects
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-80 border-l border-border bg-card/50 backdrop-blur overflow-y-auto">
        <AnimatePresence mode="wait">
          {activeTab === 'terrain' && (
            <motion.div
              key="terrain"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-4"
>
              <h3 className="font-semibold mb-4">Terrain Tools</h3>
              
              <div className="grid grid-cols-2 gap-2 mb-4">
                {terrainBrushes.map(brush => {
                  const Icon = brush.icon;
                  return (
                    <button
                      key={brush.id}
                      onClick={() => setActiveTool(brush.id)}
                      className={cn(
                        "flex flex-col items-center gap-1 p-3 rounded-lg border-2 transition-all",
                        activeTool === brush.id
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/30"
                      )}
                    >
                      <Icon className="w-5 h-5" style={{ color: brush.color }} />
                      <span className="text-xs">{brush.name}</span>
                    </button>
                  );
                })}
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Brush Size: {brushSize}</label>
                  <input
                    type="range"
                    min="1"
                    max="20"
                    value={brushSize}
                    onChange={(e) => setBrushSize(Number(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">Strength: {Math.round(brushStrength * 100)}%</label>
                  <input
                    type="range"
                    min="0.1"
                    max="2"
                    step="0.1"
                    value={brushStrength}
                    onChange={(e) => setBrushStrength(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'biome' && (
            <motion.div
              key="biome"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-4"
>
              <h3 className="font-semibold mb-4">Biome Painter</h3>
              
              <div className="space-y-2">
                {biomes.map(biome => (
                  <button
                    key={biome.id}
                    onClick={() => setActiveBiome(biome.id)}
                    className={cn(
                      "w-full flex items-center gap-3 p-3 rounded-lg border-2 transition-all",
                      activeBiome === biome.id
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/30"
                    )}
                  >
                    <div 
                      className="w-8 h-8 rounded-lg border border-white/20"
                      style={{ backgroundColor: biome.color }}
                    />
                    <div className="flex-1 text-left">
                      <div className="font-medium">{biome.name}</div>
                      <div className="text-xs text-muted-foreground">{biome.vegetation} • {Math.round(biome.density * 100)}% density</div>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'objects' && (
            <motion.div
              key="objects"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-4"
>
              <h3 className="font-semibold mb-4">Object Catalog</h3>
              
              {Object.entries(objectCatalog).map(([category, objects]) => (
                <div key={category} className="mb-4">
                  <div className="text-xs font-medium text-muted-foreground uppercase mb-2">{category}</div>
                  
                  <div className="grid grid-cols-4 gap-2">
                    {objects.map(obj => (
                      <button
                        key={obj.id}
                        onClick={() => setActiveObject(activeObject === obj.id ? null : obj.id)}
                        className={cn(
                          "aspect-square flex flex-col items-center justify-center p-2 rounded-lg border-2 transition-all text-2xl",
                          activeObject === obj.id
                            ? "border-primary bg-primary/10"
                            : "border-border hover:border-primary/30"
                        )}
                        title={obj.name}
                      >
                        {obj.icon}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
