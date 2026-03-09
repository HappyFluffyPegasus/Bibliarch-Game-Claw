import { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  Mountain, Paintbrush, Eraser, Circle, Square, 
  Undo2, Redo2, Save, Download, Upload, Grid3X3,
  Eye, EyeOff, Sun, Moon, Cloud, Wind, Droplets,
  ChevronDown, ChevronUp, RotateCcw, Maximize2
} from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { cn } from '../lib/utils';

// Brush types for terrain editing
type BrushType = 'raise' | 'lower' | 'flatten' | 'smooth' | 'paint' | 'erase';
type MaterialType = 'grass' | 'dirt' | 'rock' | 'sand' | 'snow' | 'water';

interface Brush {
  id: BrushType;
  name: string;
  icon: React.ReactNode;
  color: string;
  strength: number;
}

interface Material {
  id: MaterialType;
  name: string;
  color: string;
  texture: string;
}

const brushes: Brush[] = [
  { id: 'raise', name: 'Raise', icon: <Mountain className="w-5 h-5" />, color: '#22c55e', strength: 1 },
  { id: 'lower', name: 'Lower', icon: <ChevronDown className="w-5 h-5" />, color: '#ef4444', strength: -1 },
  { id: 'flatten', name: 'Flatten', icon: <Square className="w-5 h-5" />, color: '#3b82f6', strength: 0 },
  { id: 'smooth', name: 'Smooth', icon: <Circle className="w-5 h-5" />, color: '#a855f7', strength: 0.5 },
  { id: 'paint', name: 'Paint', icon: <Paintbrush className="w-5 h-5" />, color: '#f59e0b', strength: 1 },
  { id: 'erase', name: 'Erase', icon: <Eraser className="w-5 h-5" />, color: '#6b7280', strength: 0 },
];

const materials: Material[] = [
  { id: 'grass', name: 'Grass', color: '#4ade80', texture: 'grass' },
  { id: 'dirt', name: 'Dirt', color: '#a16207', texture: 'dirt' },
  { id: 'rock', name: 'Rock', color: '#6b7280', texture: 'rock' },
  { id: 'sand', name: 'Sand', color: '#fbbf24', texture: 'sand' },
  { id: 'snow', name: 'Snow', color: '#f8fafc', texture: 'snow' },
  { id: 'water', name: 'Water', color: '#3b82f6', texture: 'water' },
];

interface TerrainChunk {
  x: number;
  y: number;
  height: number;
  material: MaterialType;
}

const GRID_SIZE = 32;
const MAX_HEIGHT = 10;

export function TerrainEditorPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [terrain, setTerrain] = useState<TerrainChunk[][]>(() => {
    // Generate initial flat terrain
    return Array(GRID_SIZE).fill(null).map((_, x) => 
      Array(GRID_SIZE).fill(null).map((_, y) => ({
        x,
        y,
        height: 0,
        material: 'grass' as MaterialType,
      }))
    );
  });

  const [activeBrush, setActiveBrush] = useState<BrushType>('raise');
  const [activeMaterial, setActiveMaterial] = useState<MaterialType>('grass');
  const [brushSize, setBrushSize] = useState(2);
  const [brushStrength, setBrushStrength] = useState(0.5);
  const [isPainting, setIsPainting] = useState(false);
  const [showGrid, setShowGrid] = useState(true);
  const [showShadows, setShowShadows] = useState(true);
  const [cameraAngle, setCameraAngle] = useState(45);
  const [zoom, setZoom] = useState(1);
  const [history, setHistory] = useState<TerrainChunk[][][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [timeOfDay, setTimeOfDay] = useState<'day' | 'sunset' | 'night'>('day');

  // Save to history for undo/redo
  const saveToHistory = useCallback((newTerrain: TerrainChunk[][]) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(JSON.parse(JSON.stringify(newTerrain)));
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [history, historyIndex]);

  // Undo/Redo
  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setTerrain(JSON.parse(JSON.stringify(history[historyIndex - 1])));
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setTerrain(JSON.parse(JSON.stringify(history[historyIndex + 1])));
    }
  };

  // Apply brush to terrain
  const applyBrush = (centerX: number, centerY: number) => {
    setTerrain(prev => {
      const newTerrain = prev.map(row => row.map(cell => ({ ...cell })));
      
      for (let dy = -brushSize; dy <= brushSize; dy++) {
        for (let dx = -brushSize; dx <= brushSize; dx++) {
          const x = centerX + dx;
          const y = centerY + dy;
          
          if (x >= 0 && x < GRID_SIZE && y >= 0 && y < GRID_SIZE) {
            const distance = Math.sqrt(dx * dx + dy * dy);
            const falloff = Math.max(0, 1 - distance / brushSize);
            
            switch (activeBrush) {
              case 'raise':
                newTerrain[x][y].height = Math.min(
                  MAX_HEIGHT,
                  newTerrain[x][y].height + brushStrength * falloff
                );
                break;
              case 'lower':
                newTerrain[x][y].height = Math.max(
                  0,
                  newTerrain[x][y].height - brushStrength * falloff
                );
                break;
              case 'flatten':
                const avgHeight = getAverageHeight(newTerrain, x, y, brushSize);
                newTerrain[x][y].height += (avgHeight - newTerrain[x][y].height) * brushStrength * falloff;
                break;
              case 'smooth':
                const smoothHeight = getSmoothHeight(newTerrain, x, y);
                newTerrain[x][y].height += (smoothHeight - newTerrain[x][y].height) * brushStrength * falloff;
                break;
              case 'paint':
                if (falloff > 0.5) {
                  newTerrain[x][y].material = activeMaterial;
                }
                break;
              case 'erase':
                newTerrain[x][y].height = 0;
                newTerrain[x][y].material = 'grass';
                break;
            }
          }
        }
      }
      
      return newTerrain;
    });
  };

  const getAverageHeight = (terrain: TerrainChunk[][], cx: number, cy: number, radius: number): number => {
    let total = 0;
    let count = 0;
    for (let dy = -radius; dy <= radius; dy++) {
      for (let dx = -radius; dx <= radius; dx++) {
        const x = cx + dx;
        const y = cy + dy;
        if (x >= 0 && x < GRID_SIZE && y >= 0 && y < GRID_SIZE) {
          total += terrain[x][y].height;
          count++;
        }
      }
    }
    return count > 0 ? total / count : 0;
  };

  const getSmoothHeight = (terrain: TerrainChunk[][], cx: number, cy: number): number => {
    let total = terrain[cx][cy].height;
    let count = 1;
    const neighbors = [[-1,0], [1,0], [0,-1], [0,1]];
    neighbors.forEach(([dx, dy]) => {
      const x = cx + dx;
      const y = cy + dy;
      if (x >= 0 && x < GRID_SIZE && y >= 0 && y < GRID_SIZE) {
        total += terrain[x][y].height;
        count++;
      }
    });
    return total / count;
  };

  // Handle mouse events
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsPainting(true);
    handlePaint(e);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isPainting) {
      handlePaint(e);
    }
  };

  const handleMouseUp = () => {
    if (isPainting) {
      saveToHistory(terrain);
    }
    setIsPainting(false);
  };

  const handlePaint = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const x = Math.floor((e.clientX - rect.left) * scaleX / (20 * zoom));
    const y = Math.floor((e.clientY - rect.top) * scaleY / (20 * zoom));
    
    if (x >= 0 && x < GRID_SIZE && y >= 0 && y < GRID_SIZE) {
      applyBrush(x, y);
    }
  };

  // Render terrain to canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const tileSize = 20 * zoom;
    canvas.width = GRID_SIZE * tileSize;
    canvas.height = GRID_SIZE * tileSize;

    // Clear
    ctx.fillStyle = timeOfDay === 'night' ? '#0f172a' : timeOfDay === 'sunset' ? '#7c2d12' : '#87ceeb';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw terrain
    for (let x = 0; x < GRID_SIZE; x++) {
      for (let y = 0; y < GRID_SIZE; y++) {
        const cell = terrain[x][y];
        const material = materials.find(m => m.id === cell.material);
        
        const screenX = x * tileSize;
        const screenY = y * tileSize;
        
        // Isometric-ish offset based on height
        const heightOffset = cell.height * 3;
        
        // Draw base
        ctx.fillStyle = material?.color || '#4ade80';
        
        // Add shadow based on height
        if (showShadows) {
          const shadowIntensity = Math.min(0.5, cell.height / MAX_HEIGHT * 0.3);
          ctx.fillStyle = adjustColor(ctx.fillStyle, -shadowIntensity * 100);
        }
        
        ctx.fillRect(screenX, screenY - heightOffset, tileSize, tileSize + heightOffset);
        
        // Draw height side
        if (cell.height > 0) {
          ctx.fillStyle = adjustColor(material?.color || '#4ade80', -30);
          ctx.fillRect(screenX, screenY, tileSize, heightOffset);
        }
        
        // Draw grid
        if (showGrid) {
          ctx.strokeStyle = 'rgba(0,0,0,0.1)';
          ctx.strokeRect(screenX, screenY - heightOffset, tileSize, tileSize + heightOffset);
        }
      }
    }
  }, [terrain, zoom, showGrid, showShadows, timeOfDay]);

  // Helper to darken/lighten colors
  const adjustColor = (color: string, amount: number): string => {
    const num = parseInt(color.replace('#', ''), 16);
    const r = Math.min(255, Math.max(0, (num >> 16) + amount));
    const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + amount));
    const b = Math.min(255, Math.max(0, (num & 0x00FF) + amount));
    return `#${(0x1000000 + r * 0x10000 + g * 0x100 + b).toString(16).slice(1)}`;
  };

  // Export terrain as JSON
  const exportTerrain = () => {
    const dataStr = JSON.stringify(terrain, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = 'terrain.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  // Import terrain
  const importTerrain = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target?.result as string);
        setTerrain(imported);
        saveToHistory(imported);
      } catch (err) {
        console.error('Failed to import terrain:', err);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="h-screen flex bg-background">
      {/* Left Toolbar */}
      <div className="w-72 border-r border-border bg-card/50 flex flex-col">
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Mountain className="w-5 h-5" />
            <h2 className="font-semibold">Terrain Editor</h2>
          </div>
        </div>

        {/* Brushes */}
        <div className="p-4 border-b border-border">
          <h3 className="text-sm font-medium text-muted-foreground mb-3">Brushes</h3>
          
          <div className="grid grid-cols-3 gap-2">
            {brushes.map(brush => (
              <button
                key={brush.id}
                onClick={() => setActiveBrush(brush.id)}
                className={cn(
                  "flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all",
                  activeBrush === brush.id
                    ? "border-primary bg-primary/10"
                    : "border-transparent hover:border-primary/30 bg-muted"
                )}
              >
                <div 
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: brush.color + '20', color: brush.color }}
                >
                  {brush.icon}
                </div>
                <span className="text-xs">{brush.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Materials */}
        {activeBrush === 'paint' && (
          <div className="p-4 border-b border-border">
            <h3 className="text-sm font-medium text-muted-foreground mb-3">Materials</h3>
            
            <div className="grid grid-cols-3 gap-2">
              {materials.map(material => (
                <button
                  key={material.id}
                  onClick={() => setActiveMaterial(material.id)}
                  className={cn(
                    "flex flex-col items-center gap-1 p-2 rounded-xl border-2 transition-all",
                    activeMaterial === material.id
                      ? "border-primary bg-primary/10"
                      : "border-transparent hover:border-primary/30"
                  )}
                >
                  <div 
                    className="w-8 h-8 rounded-lg"
                    style={{ backgroundColor: material.color }}
                  />
                  <span className="text-xs">{material.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Brush Settings */}
        <div className="p-4 border-b border-border">
          <h3 className="text-sm font-medium text-muted-foreground mb-3">Brush Settings</h3>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Size</span>
                <span>{brushSize}</span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                value={brushSize}
                onChange={(e) => setBrushSize(Number(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Strength</span>
                <span>{Math.round(brushStrength * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.1"
                value={brushStrength}
                onChange={(e) => setBrushStrength(Number(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-4">
          <div className="flex gap-2 mb-3">
            <button
              onClick={undo}
              disabled={historyIndex <= 0}
              className="flex-1 flex items-center justify-center gap-1 p-2 bg-muted rounded-lg hover:bg-accent disabled:opacity-50"
            >
              <Undo2 className="w-4 h-4" />
              Undo
            </button>
            
            <button
              onClick={redo}
              disabled={historyIndex >= history.length - 1}
              className="flex-1 flex items-center justify-center gap-1 p-2 bg-muted rounded-lg hover:bg-accent disabled:opacity-50"
            >
              <Redo2 className="w-4 h-4" />
              Redo
            </button>
          </div>

          <div className="space-y-2">
            <button
              onClick={exportTerrain}
              className="w-full flex items-center justify-center gap-2 p-2 bg-muted rounded-lg hover:bg-accent"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
            
            <label className="w-full flex items-center justify-center gap-2 p-2 bg-muted rounded-lg hover:bg-accent cursor-pointer">
              <Upload className="w-4 h-4" />
              Import
              <input
                type="file"
                accept=".json"
                onChange={importTerrain}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>

      {/* Main Canvas */}
      <div className="flex-1 flex flex-col">
        {/* Top Toolbar */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-card/50">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowGrid(!showGrid)}
              className={cn(
                "p-2 rounded-lg transition-colors",
                showGrid ? "bg-primary/20 text-primary" : "hover:bg-accent"
              )}
            >
              <Grid3X3 className="w-5 h-5" />
            </button>
            
            <button
              onClick={() => setShowShadows(!showShadows)}
              className={cn(
                "p-2 rounded-lg transition-colors",
                showShadows ? "bg-primary/20 text-primary" : "hover:bg-accent"
              )}
            >
              <Eye className="w-5 h-5" />
            </button>
            
            <div className="w-px h-6 bg-border mx-2" />
            
            <button
              onClick={() => setTimeOfDay('day')}
              className={cn(
                "p-2 rounded-lg transition-colors",
                timeOfDay === 'day' ? "bg-yellow-500/20 text-yellow-600" : "hover:bg-accent"
              )}
            >
              <Sun className="w-5 h-5" />
            </button>
            
            <button
              onClick={() => setTimeOfDay('sunset')}
              className={cn(
                "p-2 rounded-lg transition-colors",
                timeOfDay === 'sunset' ? "bg-orange-500/20 text-orange-600" : "hover:bg-accent"
              )}
            >
              <Cloud className="w-5 h-5" />
            </button>
            
            <button
              onClick={() => setTimeOfDay('night')}
              className={cn(
                "p-2 rounded-lg transition-colors",
                timeOfDay === 'night' ? "bg-indigo-500/20 text-indigo-600" : "hover:bg-accent"
              )}
            >
              <Moon className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setZoom(z => Math.max(0.5, z - 0.1))}
              className="p-2 hover:bg-accent rounded-lg"
            >
              −
            </button>
            
            <span className="text-sm w-12 text-center">{Math.round(zoom * 100)}%</span>
            
            <button
              onClick={() => setZoom(z => Math.min(2, z + 0.1))}
              className="p-2 hover:bg-accent rounded-lg"
            >
              +
            </button>
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 overflow-auto bg-muted p-8 flex items-center justify-center">
          <canvas
            ref={canvasRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            className="shadow-2xl cursor-crosshair"
            style={{ 
              imageRendering: 'pixelated',
              cursor: isPainting ? 'grabbing' : 'crosshair'
            }}
          />
        </div>
      </div>
    </div>
  );
}
