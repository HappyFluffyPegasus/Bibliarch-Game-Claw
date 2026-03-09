import { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  Map, Paintbrush, Circle, Square, 
  Mountain, Waves, TreePine, Snowflake, Sun,
  ZoomIn, ZoomOut, Download
} from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { cn } from '../lib/utils';

const biomeBrushes = [
  { id: 'ocean', name: 'Ocean', color: '#1e40af', icon: Waves },
  { id: 'beach', name: 'Beach', color: '#fde047', icon: Sun },
  { id: 'plains', name: 'Plains', color: '#4ade80', icon: Square },
  { id: 'forest', name: 'Forest', color: '#166534', icon: TreePine },
  { id: 'mountains', name: 'Mountains', color: '#78716c', icon: Mountain },
  { id: 'snow', name: 'Snow', color: '#f8fafc', icon: Snowflake },
  { id: 'desert', name: 'Desert', color: '#fb923c', icon: Sun },
  { id: 'swamp', name: 'Swamp', color: '#3f6212', icon: Waves },
];

const markerTypes = [
  { id: 'town', name: 'Town', icon: '🏘️', color: '#f59e0b' },
  { id: 'city', name: 'City', icon: '🏙️', color: '#ef4444' },
  { id: 'dungeon', name: 'Dungeon', icon: '⚔️', color: '#7c3aed' },
  { id: 'temple', name: 'Temple', icon: '⛪', color: '#eab308' },
  { id: 'cave', name: 'Cave', icon: '🕳️', color: '#374151' },
  { id: 'tower', name: 'Tower', icon: '🗼', color: '#6366f1' },
  { id: 'portal', name: 'Portal', icon: '🌀', color: '#ec4899' },
  { id: 'camp', name: 'Camp', icon: '⛺', color: '#22c55e' },
];

interface MapMarker {
  id: string;
  type: string;
  x: number;
  y: number;
  label: string;
}

const MAP_SIZE = 64;

export function CartographyEditorPage() {
  const [activeBrush, setActiveBrush] = useState('plains');
  const [activeMarker, setActiveMarker] = useState<string | null>(null);
  const [brushSize, setBrushSize] = useState(3);
  const [zoom, setZoom] = useState(1);
  const [isPainting, setIsPainting] = useState(false);
  const [markers, setMarkers] = useState<MapMarker[]>([]);
  const [showGrid, setShowGrid] = useState(true);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const paintTile = (x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const tileSize = 16;
    const brush = biomeBrushes.find(b => b.id === activeBrush);
    if (!brush) return;

    for (let dy = -Math.floor(brushSize / 2); dy <= Math.floor(brushSize / 2); dy++) {
      for (let dx = -Math.floor(brushSize / 2); dx <= Math.floor(brushSize / 2); dx++) {
        const px = x + dx;
        const py = y + dy;
        
        if (px >= 0 && px < MAP_SIZE && py >= 0 && py < MAP_SIZE) {
          ctx.fillStyle = brush.color;
          ctx.fillRect(px * tileSize, py * tileSize, tileSize, tileSize);
        }
      }
    }
  };

  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (activeMarker) {
      const rect = e.currentTarget.getBoundingClientRect();
      const scaleX = e.currentTarget.width / rect.width;
      const scaleY = e.currentTarget.height / rect.height;
      const x = Math.floor((e.clientX - rect.left) * scaleX / 16);
      const y = Math.floor((e.clientY - rect.top) * scaleY / 16);
      
      const newMarker: MapMarker = {
        id: Date.now().toString(),
        type: activeMarker,
        x,
        y,
        label: markerTypes.find(m => m.id === activeMarker)?.name || 'Marker'
      };
      setMarkers([...markers, newMarker]);
      return;
    }

    setIsPainting(true);
    const rect = e.currentTarget.getBoundingClientRect();
    const scaleX = e.currentTarget.width / rect.width;
    const scaleY = e.currentTarget.height / rect.height;
    const x = Math.floor((e.clientX - rect.left) * scaleX / 16);
    const y = Math.floor((e.clientY - rect.top) * scaleY / 16);
    paintTile(x, y);
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isPainting) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const scaleX = e.currentTarget.width / rect.width;
    const scaleY = e.currentTarget.height / rect.height;
    const x = Math.floor((e.clientX - rect.left) * scaleX / 16);
    const y = Math.floor((e.clientY - rect.top) * scaleY / 16);
    paintTile(x, y);
  };

  const handleCanvasMouseUp = () => {
    setIsPainting(false);
  };

  const exportMap = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const link = document.createElement('a');
    link.download = 'map.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className="h-screen flex bg-background">
      <div className="w-16 border-r border-border bg-card/50 flex flex-col items-center py-4 gap-2">
        <div className="text-xs text-muted-foreground font-medium">Biomes</div>
        
        {biomeBrushes.slice(0, 4).map(brush => {
          const Icon = brush.icon;
          return (
            <button
              key={brush.id}
              onClick={() => { setActiveBrush(brush.id); setActiveMarker(null); }}
              className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center transition-all",
                activeBrush === brush.id && !activeMarker
                  ? "ring-2 ring-primary ring-offset-2" 
                  : "hover:bg-accent"
              )}
              style={{ backgroundColor: brush.color }}
              title={brush.name}
            >
              <Icon className="w-5 h-5 text-white drop-shadow-md" />
            </button>
          );
        })}

        <div className="w-8 h-px bg-border my-2" />
        
        <div className="text-xs text-muted-foreground font-medium">Markers</div>
        
        {markerTypes.slice(0, 4).map(marker => (
          <button
            key={marker.id}
            onClick={() => setActiveMarker(activeMarker === marker.id ? null : marker.id)}
            className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-all",
              activeMarker === marker.id
                ? "ring-2 ring-primary ring-offset-2 bg-primary/10" 
                : "hover:bg-accent"
            )}
            title={marker.name}
          >
            {marker.icon}
          </button>
        ))}

        <div className="flex-1" />

        <button onClick={() => setZoom(z => Math.min(3, z + 0.2))} className="p-2 hover:bg-accent rounded">
          <ZoomIn className="w-5 h-5" />
        </button>
        <button onClick={() => setZoom(z => Math.max(0.5, z - 0.2))} className="p-2 hover:bg-accent rounded">
          <ZoomOut className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-card/50">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Brush Size:</span>
              <input
                type="range"
                min="1"
                max="10"
                value={brushSize}
                onChange={(e) => setBrushSize(Number(e.target.value))}
                className="w-24"
              />
              <span className="text-sm w-6">{brushSize}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => setShowGrid(!showGrid)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-sm transition-colors",
                showGrid ? "bg-primary/20 text-primary" : "hover:bg-accent"
              )}
            >
              Grid
            </button>
            
            <button 
              onClick={exportMap}
              className="flex items-center gap-2 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-sm"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        <div className="flex-1 relative overflow-auto bg-muted p-8">
          <div 
            className="relative inline-block shadow-2xl"
            style={{ 
              transform: `scale(${zoom})`,
              transformOrigin: 'top left'
            }}
          >
            <canvas
              ref={canvasRef}
              width={MAP_SIZE * 16}
              height={MAP_SIZE * 16}
              onMouseDown={handleCanvasMouseDown}
              onMouseMove={handleCanvasMouseMove}
              onMouseUp={handleCanvasMouseUp}
              onMouseLeave={handleCanvasMouseUp}
              className="cursor-crosshair bg-white"
              style={{ imageRendering: 'pixelated' }}
            />

            {showGrid && (
              <div 
                className="absolute inset-0 pointer-events-none"
                style={{
                  backgroundImage: `
                    linear-gradient(to right, rgba(0,0,0,0.1) 1px, transparent 1px),
                    linear-gradient(to bottom, rgba(0,0,0,0.1) 1px, transparent 1px)
                  `,
                  backgroundSize: '16px 16px'
                }}
              />
            )}

            {markers.map(marker => {
              const markerType = markerTypes.find(m => m.id === marker.type);
              return (
                <div
                  key={marker.id}
                  className="absolute flex flex-col items-center cursor-pointer hover:scale-110 transition-transform"
                  style={{
                    left: marker.x * 16,
                    top: marker.y * 16,
                    transform: 'translate(-50%, -100%)'
                  }}
                >
                  <div className="text-2xl drop-shadow-lg">{markerType?.icon}</div>
                  <div 
                    className="text-xs font-bold text-white px-2 py-0.5 rounded whitespace-nowrap"
                    style={{ backgroundColor: markerType?.color }}
                  >
                    {marker.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="w-72 border-l border-border bg-card/50 overflow-y-auto">
        <div className="p-4 border-b border-border">
          <h3 className="font-semibold mb-4">Biome Palette</h3>
          <div className="grid grid-cols-2 gap-2">
            {biomeBrushes.map(brush => {
              const Icon = brush.icon;
              return (
                <button
                  key={brush.id}
                  onClick={() => { setActiveBrush(brush.id); setActiveMarker(null); }}
                  className={cn(
                    "flex items-center gap-2 p-2 rounded-lg border-2 transition-all text-left",
                    activeBrush === brush.id && !activeMarker
                      ? "border-primary" 
                      : "border-transparent hover:border-border"
                  )}
                >
                  <div 
                    className="w-8 h-8 rounded flex items-center justify-center"
                    style={{ backgroundColor: brush.color }}
                  >
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm">{brush.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-4 border-b border-border">
          <h3 className="font-semibold mb-4">Map Markers</h3>
          <div className="grid grid-cols-4 gap-2">
            {markerTypes.map(marker => (
              <button
                key={marker.id}
                onClick={() => setActiveMarker(activeMarker === marker.id ? null : marker.id)}
                className={cn(
                  "aspect-square flex flex-col items-center justify-center p-2 rounded-lg border-2 transition-all",
                  activeMarker === marker.id
                    ? "border-primary bg-primary/10" 
                    : "border-transparent hover:border-border"
                )}
                title={marker.name}
              >
                <span className="text-2xl">{marker.icon}</span>
                <span className="text-[10px] mt-1 truncate w-full text-center">{marker.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="p-4">
          <h3 className="font-semibold mb-2">Markers List</h3>
          <div className="space-y-1">
            {markers.length === 0 ? (
              <p className="text-sm text-muted-foreground">No markers placed</p>
            ) : (
              markers.map(marker => {
                const type = markerTypes.find(m => m.id === marker.type);
                return (
                  <div key={marker.id} className="flex items-center gap-2 p-2 rounded hover:bg-accent">
                    <span>{type?.icon}</span>
                    <span className="flex-1 text-sm">{marker.label}</span>
                    <button 
                      onClick={() => setMarkers(markers.filter(m => m.id !== marker.id))}
                      className="text-destructive hover:text-destructive/80"
                    >
                      ×
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
