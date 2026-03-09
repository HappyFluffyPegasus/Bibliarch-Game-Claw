import { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  Brush, Trees, Mountain, Home, Fence, Flower2,
  Settings2, RefreshCw, Dice5, Trash2, Move,
  RotateCw, Maximize2, Grid3X3
} from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { cn } from '../lib/utils';

interface EntityType {
  id: string;
  name: string;
  icon: string;
  category: 'nature' | 'structures' | 'props';
  minScale: number;
  maxScale: number;
}

const entityTypes: EntityType[] = [
  { id: 'tree-oak', name: 'Oak Tree', icon: '🌳', category: 'nature', minScale: 0.8, maxScale: 1.3 },
  { id: 'tree-pine', name: 'Pine Tree', icon: '🌲', category: 'nature', minScale: 0.9, maxScale: 1.4 },
  { id: 'tree-palm', name: 'Palm Tree', icon: '🌴', category: 'nature', minScale: 0.8, maxScale: 1.2 },
  { id: 'bush', name: 'Bush', icon: '🌿', category: 'nature', minScale: 0.7, maxScale: 1.1 },
  { id: 'flower', name: 'Flowers', icon: '🌸', category: 'nature', minScale: 0.8, maxScale: 1.0 },
  { id: 'rock', name: 'Rock', icon: '🪨', category: 'nature', minScale: 0.6, maxScale: 1.5 },
  { id: 'house', name: 'House', icon: '🏠', category: 'structures', minScale: 0.9, maxScale: 1.1 },
  { id: 'tower', name: 'Tower', icon: '🗼', category: 'structures', minScale: 0.8, maxScale: 1.2 },
  { id: 'cabin', name: 'Cabin', icon: '🏡', category: 'structures', minScale: 0.9, maxScale: 1.1 },
  { id: 'chest', name: 'Chest', icon: '📦', category: 'props', minScale: 0.9, maxScale: 1.1 },
  { id: 'sign', name: 'Sign', icon: '🪧', category: 'props', minScale: 0.9, maxScale: 1.1 },
  { id: 'campfire', name: 'Campfire', icon: '🔥', category: 'props', minScale: 0.8, maxScale: 1.0 },
];

interface ScatterConfig {
  density: number; // 0-1
  randomScale: boolean;
  randomRotation: boolean;
  avoidOverlap: boolean;
  snapToGrid: boolean;
  alignToNormal: boolean; // For 3D terrain
}

interface PlacedEntity {
  id: string;
  type: string;
  x: number;
  y: number;
  scale: number;
  rotation: number;
}

export function EntityBrush() {
  const [selectedEntity, setSelectedEntity] = useState<EntityType | null>(null);
  const [config, setConfig] = useState<ScatterConfig>({
    density: 0.5,
    randomScale: true,
    randomRotation: true,
    avoidOverlap: true,
    snapToGrid: false,
    alignToNormal: true,
  });
  const [brushSize, setBrushSize] = useState(5);
  const [placedEntities, setPlacedEntities] = useState<PlacedEntity[]>([]);
  const [activeCategory, setActiveCategory] = useState<'nature' | 'structures' | 'props'>('nature');
  const [isPainting, setIsPainting] = useState(false);

  const categories = [
    { id: 'nature', name: 'Nature', icon: Trees },
    { id: 'structures', name: 'Buildings', icon: Home },
    { id: 'props', name: 'Props', icon: Fence },
  ] as const;

  const scatterEntities = useCallback((centerX: number, centerY: number) => {
    if (!selectedEntity) return;

    const newEntities: PlacedEntity[] = [];
    const count = Math.floor(config.density * 10) + 1;

    for (let i = 0; i < count; i++) {
      // Random position within brush radius
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.random() * brushSize;
      let x = centerX + Math.cos(angle) * dist;
      let y = centerY + Math.sin(angle) * dist;

      // Snap to grid if enabled
      if (config.snapToGrid) {
        x = Math.round(x);
        y = Math.round(y);
      }

      // Check overlap if enabled
      if (config.avoidOverlap) {
        const tooClose = placedEntities.some(e => {
          const dx = e.x - x;
          const dy = e.y - y;
          return Math.sqrt(dx * dx + dy * dy) < 2;
        });
        if (tooClose) continue;
      }

      // Random scale
      const scale = config.randomScale
        ? selectedEntity.minScale + Math.random() * (selectedEntity.maxScale - selectedEntity.minScale)
        : 1;

      // Random rotation
      const rotation = config.randomRotation
        ? Math.random() * 360
        : 0;

      newEntities.push({
        id: `${Date.now()}-${i}`,
        type: selectedEntity.id,
        x,
        y,
        scale,
        rotation,
      });
    }

    setPlacedEntities(prev => [...prev, ...newEntities]);
  }, [selectedEntity, config, brushSize, placedEntities]);

  const clearEntities = () => {
    setPlacedEntities([]);
  };

  const undoLast = () => {
    setPlacedEntities(prev => prev.slice(0, -1));
  };

  return (
    <div className="flex flex-col h-full">
      {/* Category Tabs */}
      <div className="flex gap-1 p-2 border-b border-border">
        {categories.map(cat => {
          const Icon = cat.icon;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={cn(
                "flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm transition-colors",
                activeCategory === cat.id
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-accent"
              )}
            >
              <Icon className="w-4 h-4" />
              {cat.name}
            </button>
          );
        })}
      </div>

      {/* Entity Grid */}
      <div className="flex-1 overflow-y-auto p-3">
        <div className="grid grid-cols-3 gap-2">
          {entityTypes
            .filter(e => e.category === activeCategory)
            .map(entity => (
              <button
                key={entity.id}
                onClick={() => setSelectedEntity(entity)}
                className={cn(
                  "flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all",
                  selectedEntity?.id === entity.id
                    ? "border-primary bg-primary/10"
                    : "border-transparent bg-muted hover:border-primary/30"
                )}
              >
                <span className="text-3xl">{entity.icon}</span>
                <span className="text-xs text-center">{entity.name}</span>
              </button>
            ))}
        </div>
      </div>

      {/* Brush Settings */}
      {selectedEntity && (
        <div className="p-3 border-t border-border space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">{selectedEntity.name} Brush</span>
            <button 
              onClick={() => setSelectedEntity(null)}
              className="text-xs text-muted-foreground hover:text-foreground"
>
              Clear
            </button>
          </div>

          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Brush Size: {brushSize}</label>
            <input
              type="range"
              min="1"
              max="10"
              value={brushSize}
              onChange={(e) => setBrushSize(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Density: {Math.round(config.density * 100)}%</label>
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.1"
              value={config.density}
              onChange={(e) => setConfig({...config, density: Number(e.target.value)})}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={config.randomScale}
                onChange={(e) => setConfig({...config, randomScale: e.target.checked})}
              />
              Random Scale
            </label>

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={config.randomRotation}
                onChange={(e) => setConfig({...config, randomRotation: e.target.checked})}
              />
              Random Rotation
            </label>

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={config.avoidOverlap}
                onChange={(e) => setConfig({...config, avoidOverlap: e.target.checked})}
              />
              Avoid Overlap
            </label>

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={config.snapToGrid}
                onChange={(e) => setConfig({...config, snapToGrid: e.target.checked})}
              />
              Snap to Grid
            </label>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              onClick={undoLast}
              disabled={placedEntities.length === 0}
              className="flex-1 py-2 bg-muted rounded-lg hover:bg-accent disabled:opacity-50 text-sm"
>
              Undo
            </button>
            
            <button
              onClick={clearEntities}
              className="flex-1 py-2 bg-destructive/10 text-destructive rounded-lg hover:bg-destructive/20 text-sm"
            >
              Clear All
            </button>
          </div>
        </div>
      )}

      {!selectedEntity && (
        <div className="p-3 border-t border-border text-center text-sm text-muted-foreground">
          Select an entity type to start painting
        </div>
      )}
    </div>
  );
}
