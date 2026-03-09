import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Map as MapIcon, Building2, Trees, Mountain, Waves, Castle,
  Move, ZoomIn, ZoomOut, Grid3X3, Layers, Eraser, Save,
  Plus, Trash2, Search, Filter, GripVertical
} from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { cn } from '../lib/utils';

// Asset types for the world map
interface MapAsset {
  id: string;
  type: 'city' | 'dungeon' | 'landmark' | 'forest' | 'mountain' | 'water' | 'custom';
  name: string;
  icon: string;
  x: number;
  y: number;
  scale: number;
  rotation: number;
  metadata?: {
    population?: number;
    level?: number;
    description?: string;
  };
}

// Available assets palette
interface AssetTemplate {
  id: string;
  type: MapAsset['type'];
  name: string;
  icon: string;
  defaultScale: number;
  category: string;
}

const assetTemplates: AssetTemplate[] = [
  // Cities
  { id: 'city-small', type: 'city', name: 'Village', icon: '🏘️', defaultScale: 0.8, category: 'Cities' },
  { id: 'city-medium', type: 'city', name: 'Town', icon: '🏙️', defaultScale: 1, category: 'Cities' },
  { id: 'city-large', type: 'city', name: 'City', icon: '🌆', defaultScale: 1.3, category: 'Cities' },
  { id: 'city-capital', type: 'city', name: 'Capital', icon: '👑', defaultScale: 1.5, category: 'Cities' },
  
  // Dungeons
  { id: 'dungeon-cave', type: 'dungeon', name: 'Cave', icon: '🕳️', defaultScale: 1, category: 'Dungeons' },
  { id: 'dungeon-ruins', type: 'dungeon', name: 'Ruins', icon: '🏛️', defaultScale: 1.2, category: 'Dungeons' },
  { id: 'dungeon-castle', type: 'dungeon', name: 'Castle', icon: '🏰', defaultScale: 1.3, category: 'Dungeons' },
  { id: 'dungeon-temple', type: 'dungeon', name: 'Temple', icon: '⛪', defaultScale: 1.2, category: 'Dungeons' },
  
  // Landmarks
  { id: 'landmark-tower', type: 'landmark', name: 'Tower', icon: '🗼', defaultScale: 1, category: 'Landmarks' },
  { id: 'landmark-portal', type: 'landmark', name: 'Portal', icon: '🌀', defaultScale: 1.2, category: 'Landmarks' },
  { id: 'landmark-statue', type: 'landmark', name: 'Statue', icon: '🗿', defaultScale: 0.9, category: 'Landmarks' },
  { id: 'landmark-bridge', type: 'landmark', name: 'Bridge', icon: '🌉', defaultScale: 1.1, category: 'Landmarks' },
  
  // Nature
  { id: 'nature-forest', type: 'forest', name: 'Forest', icon: '🌲', defaultScale: 1.2, category: 'Nature' },
  { id: 'nature-mountain', type: 'mountain', name: 'Mountain', icon: '⛰️', defaultScale: 1.5, category: 'Nature' },
  { id: 'nature-lake', type: 'water', name: 'Lake', icon: '🏞️', defaultScale: 1.3, category: 'Nature' },
  { id: 'nature-volcano', type: 'mountain', name: 'Volcano', icon: '🌋', defaultScale: 1.4, category: 'Nature' },
];

// Sample placed assets
const sampleAssets: MapAsset[] = [
  { id: '1', type: 'city', name: 'Luminara', icon: '👑', x: 400, y: 300, scale: 1.5, rotation: 0, metadata: { population: 50000 } },
  { id: '2', type: 'city', name: 'Mosshaven', icon: '🏘️', x: 250, y: 400, scale: 0.8, rotation: 0 },
  { id: '3', type: 'dungeon', name: 'Dark Spire', icon: '🏰', x: 600, y: 200, scale: 1.3, rotation: 15 },
  { id: '4', type: 'forest', name: 'Whisperwood', icon: '🌲', x: 150, y: 250, scale: 1.2, rotation: 0 },
  { id: '5', type: 'mountain', name: 'Iron Peak', icon: '⛰️', x: 700, y: 350, scale: 1.5, rotation: -10 },
];

export function WorldMapEditorPage() {
  const [assets, setAssets] = useState<MapAsset[]>(sampleAssets);
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<AssetTemplate | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [activeCategory, setActiveCategory] = useState('Cities');
  const [searchQuery, setSearchQuery] = useState('');
  const [showGrid, setShowGrid] = useState(true);
  const [activeTool, setActiveTool] = useState<'select' | 'place' | 'erase'>('select');
  
  const canvasRef = useRef<HTMLDivElement>(null);

  const categories = [...new Set(assetTemplates.map(t => t.category))];
  
  const filteredTemplates = assetTemplates.filter(t => {
    const matchesCategory = t.category === activeCategory;
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Handle placing an asset on the map
  const handleCanvasClick = (e: React.MouseEvent) => {
    if (activeTool === 'place' && selectedTemplate) {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      
      const x = (e.clientX - rect.left - pan.x) / zoom;
      const y = (e.clientY - rect.top - pan.y) / zoom;
      
      const newAsset: MapAsset = {
        id: Date.now().toString(),
        type: selectedTemplate.type,
        name: selectedTemplate.name,
        icon: selectedTemplate.icon,
        x,
        y,
        scale: selectedTemplate.defaultScale,
        rotation: 0,
      };
      
      setAssets([...assets, newAsset]);
    }
  };

  // Handle dragging assets
  const handleAssetMouseDown = (e: React.MouseEvent, assetId: string) => {
    if (activeTool !== 'select') return;
    
    e.stopPropagation();
    setSelectedAsset(assetId);
    setIsDragging(true);
    
    const asset = assets.find(a => a.id === assetId);
    if (asset) {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        setDragOffset({
          x: (e.clientX - rect.left) / zoom - asset.x,
          y: (e.clientY - rect.top) / zoom - asset.y,
        });
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !selectedAsset) return;
    
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const x = (e.clientX - rect.left) / zoom - dragOffset.x;
    const y = (e.clientY - rect.top) / zoom - dragOffset.y;
    
    setAssets(prev => prev.map(a => 
      a.id === selectedAsset ? { ...a, x, y } : a
    ));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Delete selected asset
  const deleteSelectedAsset = () => {
    if (selectedAsset) {
      setAssets(prev => prev.filter(a => a.id !== selectedAsset));
      setSelectedAsset(null);
    }
  };

  // Update asset properties
  const updateAsset = (id: string, updates: Partial<MapAsset>) => {
    setAssets(prev => prev.map(a => 
      a.id === id ? { ...a, ...updates } : a
    ));
  };

  const selectedAssetData = assets.find(a => a.id === selectedAsset);

  return (
    <div className="h-screen flex bg-background">
      {/* Left Sidebar - Asset Palette */}
      <div className="w-72 border-r border-border bg-card/50 flex flex-col">
        <div className="p-4 border-b border-border">
          <h2 className="font-semibold flex items-center gap-2">
            <MapIcon className="w-5 h-5" />
            Asset Palette
          </h2>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-1 p-2 border-b border-border overflow-x-auto">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors",
                activeCategory === cat
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-accent"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="p-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search assets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-background border border-input rounded-lg text-sm"
            />
          </div>
        </div>

        {/* Asset Grid */}
        <div className="flex-1 overflow-y-auto p-3">
          <div className="grid grid-cols-3 gap-2">
            {filteredTemplates.map(template => (
              <button
                key={template.id}
                onClick={() => {
                  setSelectedTemplate(template);
                  setActiveTool('place');
                }}
                className={cn(
                  "aspect-square flex flex-col items-center justify-center p-2 rounded-xl border-2 transition-all",
                  selectedTemplate?.id === template.id
                    ? "border-primary bg-primary/10"
                    : "border-transparent hover:border-primary/30 bg-muted"
                )}
              >
                <span className="text-3xl mb-1">{template.icon}</span>
                <span className="text-xs text-center truncate w-full">{template.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tool Hints */}
        <div className="p-4 border-t border-border text-xs text-muted-foreground">
          <p>💡 Click an asset, then click on the map to place it</p>
          <p className="mt-1">🖱️ Drag assets to move them</p>
          <p className="mt-1">🗑️ Select + Delete key to remove</p>
        </div>
      </div>

      {/* Main Canvas */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-card/50">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTool('select')}
              className={cn(
                "p-2 rounded-lg transition-colors",
                activeTool === 'select' ? "bg-primary text-primary-foreground" : "hover:bg-accent"
              )}
              title="Select Tool"
            >
              <Move className="w-5 h-5" />
            </button>
            
            <button
              onClick={() => setActiveTool('place')}
              className={cn(
                "p-2 rounded-lg transition-colors",
                activeTool === 'place' ? "bg-primary text-primary-foreground" : "hover:bg-accent"
              )}
              title="Place Tool"
            >
              <Plus className="w-5 h-5" />
            </button>
            
            <button
              onClick={() => setActiveTool('erase')}
              className={cn(
                "p-2 rounded-lg transition-colors",
                activeTool === 'erase' ? "bg-primary text-primary-foreground" : "hover:bg-accent"
              )}
              title="Erase Tool"
            >
              <Eraser className="w-5 h-5" />
            </button>
            
            <div className="w-px h-6 bg-border mx-2" />
            
            <button
              onClick={() => setShowGrid(!showGrid)}
              className={cn(
                "p-2 rounded-lg transition-colors",
                showGrid ? "bg-primary/20 text-primary" : "hover:bg-accent"
              )}
              title="Toggle Grid"
            >
              <Grid3X3 className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => setZoom(z => Math.max(0.5, z - 0.1))}
              className="p-2 hover:bg-accent rounded-lg"
            >
              <ZoomOut className="w-5 h-5" />
            </button>
            
            <span className="text-sm w-16 text-center">{Math.round(zoom * 100)}%</span>
            
            <button 
              onClick={() => setZoom(z => Math.min(2, z + 0.1))}
              className="p-2 hover:bg-accent rounded-lg"
            >
              <ZoomIn className="w-5 h-5" />
            </button>
            
            <div className="w-px h-6 bg-border mx-2" />
            
            <button className="flex items-center gap-2 px-3 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">
              <Save className="w-4 h-4" />
              Save
            </button>
          </div>
        </div>

        {/* Canvas Area */}
        <div 
          ref={canvasRef}
          className="flex-1 relative overflow-hidden bg-muted cursor-crosshair"
          onClick={handleCanvasClick}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* Grid Background */}
          {showGrid && (
            <div 
              className="absolute inset-0 pointer-events-none opacity-20"
              style={{
                backgroundImage: `
                  linear-gradient(to right, #000 1px, transparent 1px),
                  linear-gradient(to bottom, #000 1px, transparent 1px)
                `,
                backgroundSize: `${50 * zoom}px ${50 * zoom}px`,
                transform: `translate(${pan.x}px, ${pan.y}px)`,
              }}
            />
          )}

          {/* Map Background */}
          <div 
            className="absolute w-[1000px] h-[800px] bg-gradient-to-br from-green-100 via-yellow-50 to-blue-100 rounded-lg shadow-lg"
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              transformOrigin: 'top left',
            }}
          >
            {/* Terrain Features (decorative) */}
            <div className="absolute top-20 left-32 w-64 h-48 bg-green-200/50 rounded-full blur-3xl" />
            <div className="absolute bottom-32 right-48 w-96 h-64 bg-blue-200/30 rounded-full blur-3xl" />
            <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-yellow-200/20 rounded-full blur-3xl" />
          </div>

          {/* Placed Assets */}
          {assets.map(asset => (
            <motion.div
              key={asset.id}
              drag={activeTool === 'select'}
              dragMomentum={false}
              onDragEnd={(_, info) => {
                updateAsset(asset.id, {
                  x: asset.x + info.offset.x / zoom,
                  y: asset.y + info.offset.y / zoom,
                });
              }}
              onClick={(e) => {
                e.stopPropagation();
                if (activeTool === 'erase') {
                  setAssets(prev => prev.filter(a => a.id !== asset.id));
                } else {
                  setSelectedAsset(asset.id);
                }
              }}
              className={cn(
                "absolute cursor-pointer transition-shadow",
                selectedAsset === asset.id && "ring-2 ring-primary ring-offset-2"
              )}
              style={{
                left: asset.x * zoom + pan.x,
                top: asset.y * zoom + pan.y,
                transform: `scale(${asset.scale * zoom}) rotate(${asset.rotation}deg)`,
                transformOrigin: 'center bottom',
              }}
            >
              <div className="relative group">
                <span className="text-4xl filter drop-shadow-lg">{asset.icon}</span>
                
                {/* Label */}
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap">
                  <span className="px-2 py-0.5 bg-black/70 text-white text-xs rounded">{asset.name}</span>
                </div>

                {/* Selection indicator */}
                {selectedAsset === asset.id && (
                  <>
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full" />
                    <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex gap-1">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          updateAsset(asset.id, { rotation: asset.rotation - 15 });
                        }}
                        className="w-6 h-6 bg-card border rounded flex items-center justify-center text-xs hover:bg-accent">
                        ↺
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          updateAsset(asset.id, { rotation: asset.rotation + 15 });
                        }}
                        className="w-6 h-6 bg-card border rounded flex items-center justify-center text-xs hover:bg-accent">
                        ↻
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteSelectedAsset();
                        }}
                        className="w-6 h-6 bg-card border rounded flex items-center justify-center text-xs hover:text-destructive">
                        🗑️
                      </button>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Selected Asset Panel */}
        {selectedAssetData && (
          <GlassCard className="absolute bottom-4 right-4 w-64 p-4">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">{selectedAssetData.icon}</span>
              <div className="flex-1">
                <input
                  type="text"
                  value={selectedAssetData.name}
                  onChange={(e) => updateAsset(selectedAssetData.id, { name: e.target.value })}
                  className="font-medium bg-transparent border-b border-transparent hover:border-input focus:border-primary outline-none w-full"
                />
                <span className="text-xs text-muted-foreground capitalize">{selectedAssetData.type}</span>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs text-muted-foreground">Scale</label>
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={selectedAssetData.scale}
                  onChange={(e) => updateAsset(selectedAssetData.id, { scale: Number(e.target.value) })}
                  className="w-full"
                />
              </div>

              <div>
                <label className="text-xs text-muted-foreground">Rotation</label>
                <input
                  type="range"
                  min="-180"
                  max="180"
                  step="15"
                  value={selectedAssetData.rotation}
                  onChange={(e) => updateAsset(selectedAssetData.id, { rotation: Number(e.target.value) })}
                  className="w-full"
                />
              </div>
            </div>

            <button 
              onClick={deleteSelectedAsset}
              className="w-full mt-4 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
            >
              Delete Asset
            </button>
          </GlassCard>
        )}
      </div>
    </div>
  );
}
