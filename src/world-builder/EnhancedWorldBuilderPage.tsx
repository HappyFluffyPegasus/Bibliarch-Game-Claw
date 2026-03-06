import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Mountain, Trees, Paintbrush, Circle, Square, Waves, Grid3X3,
  Camera, Undo2, Redo2
} from 'lucide-react';
import { cn } from '../lib/utils';

const terrainBrushes = [
  { id: 'raise', name: 'Raise', icon: Mountain, color: '#22c55e' },
  { id: 'lower', name: 'Lower', icon: Square, color: '#ef4444' },
  { id: 'flatten', name: 'Flatten', icon: Grid3X3, color: '#3b82f6' },
  { id: 'smooth', name: 'Smooth', icon: Waves, color: '#a855f7' },
];

const biomes = [
  { id: 'forest', name: 'Forest', color: '#228b22' },
  { id: 'desert', name: 'Desert', color: '#f4a460' },
  { id: 'snow', name: 'Snow', color: '#fffafa' },
  { id: 'plains', name: 'Plains', color: '#90ee90' },
];

const objectCatalog = [
  { id: 'oak_tree', name: 'Oak Tree', icon: '🌳' },
  { id: 'pine_tree', name: 'Pine Tree', icon: '🌲' },
  { id: 'bush', name: 'Bush', icon: '🌿' },
  { id: 'rock', name: 'Rock', icon: '🪨' },
  { id: 'house', name: 'House', icon: '🏠' },
  { id: 'tower', name: 'Tower', icon: '🏰' },
];

export function EnhancedWorldBuilderPage() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('terrain');
  const [activeTool, setActiveTool] = useState('raise');
  const [activeBiome, setActiveBiome] = useState('forest');
  const [activeObject, setActiveObject] = useState<string | null>(null);
  const [brushSize, setBrushSize] = useState(5);
  const [cameraMode, setCameraMode] = useState('orbit');
  const [showGrid, setShowGrid] = useState(true);

  return (
    <div className="h-screen flex bg-background">
      <div className="w-16 border-r border-border bg-card/50 flex flex-col items-center py-4 gap-2">
        <button
          onClick={() => setActiveTab('terrain')}
          className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center transition-colors",
            activeTab === 'terrain' ? "bg-primary text-primary-foreground" : "hover:bg-accent"
          )}
        >
          <Mountain className="w-5 h-5" />
        </button>
        <button
          onClick={() => setActiveTab('biome')}
          className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center transition-colors",
            activeTab === 'biome' ? "bg-primary text-primary-foreground" : "hover:bg-accent"
          )}
        >
          <Paintbrush className="w-5 h-5" />
        </button>
        <button
          onClick={() => setActiveTab('objects')}
          className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center transition-colors",
            activeTab === 'objects' ? "bg-primary text-primary-foreground" : "hover:bg-accent"
          )}
        >
          <Trees className="w-5 h-5" />
        </button>
        <div className="flex-1" />
        <button
          onClick={() => setCameraMode(cameraMode === 'orbit' ? 'firstPerson' : 'orbit')}
          className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center transition-colors",
            cameraMode === 'firstPerson' ? "bg-primary text-primary-foreground" : "hover:bg-accent"
          )}
        >
          <Camera className="w-5 h-5" />
        </button>
        <button onClick={() => {}} className="w-12 h-12 rounded-xl hover:bg-accent flex items-center justify-center">
          <Undo2 className="w-5 h-5" />
        </button>
        <button onClick={() => {}} className="w-12 h-12 rounded-xl hover:bg-accent flex items-center justify-center">
          <Redo2 className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 relative">
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
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
            <div className="text-6xl mb-4">🏔️</div>
            <p className="text-lg font-medium">World Builder V2</p>
            <p className="text-sm text-muted-foreground">Terrain sculpting with chunk streaming</p>
          </div>
        </div>
      </div>

      <div className="w-80 border-l border-border bg-card/50 overflow-y-auto p-4">
        {activeTab === 'terrain' && (
          <div>
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
          </div>
        )}

        {activeTab === 'biome' && (
          <div>
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
                  <span>{biome.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'objects' && (
          <div>
            <h3 className="font-semibold mb-4">Object Catalog</h3>
            <div className="grid grid-cols-3 gap-2">
              {objectCatalog.map(obj => (
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
        )}
      </div>
    </div>
  );
}
