import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Square, Grid3X3, Layers, Box, Plus, Trash2, RotateCcw,
  Maximize2, Move, Paintbrush, Wallpaper, Lightbulb, DoorOpen
} from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { cn } from '../lib/utils';

// Wall types
const wallTypes = [
  { id: 'brick', name: 'Brick', color: '#8b4513', texture: 'brick' },
  { id: 'wood', name: 'Wood', color: '#deb887', texture: 'wood' },
  { id: 'concrete', name: 'Concrete', color: '#808080', texture: 'concrete' },
  { id: 'plaster', name: 'Plaster', color: '#fffdd0', texture: 'plaster' },
  { id: 'stone', name: 'Stone', color: '#696969', texture: 'stone' },
  { id: 'glass', name: 'Glass', color: '#e0ffff', texture: 'glass' },
];

// Floor types
const floorTypes = [
  { id: 'hardwood', name: 'Hardwood', color: '#d2691e' },
  { id: 'tile', name: 'Tile', color: '#f5f5dc' },
  { id: 'carpet', name: 'Carpet', color: '#8b0000' },
  { id: 'concrete', name: 'Concrete', color: '#a9a9a9' },
  { id: 'marble', name: 'Marble', color: '#f0f8ff' },
];

// Furniture catalog
const furnitureCatalog = {
  seating: [
    { id: 'sofa', name: 'Sofa', icon: '🛋️', width: 2, height: 1 },
    { id: 'chair', name: 'Chair', icon: '🪑', width: 1, height: 1 },
    { id: 'armchair', name: 'Armchair', icon: '🛋️', width: 1, height: 1 },
    { id: 'bed', name: 'Bed', icon: '🛏️', width: 2, height: 2 },
  ],
  tables: [
    { id: 'table', name: 'Table', icon: '🪑', width: 2, height: 1 },
    { id: 'desk', name: 'Desk', icon: '🪑', width: 2, height: 1 },
    { id: 'nightstand', name: 'Nightstand', icon: '🪑', width: 1, height: 1 },
  ],
  storage: [
    { id: 'cabinet', name: 'Cabinet', icon: '🗄️', width: 2, height: 1 },
    { id: 'bookshelf', name: 'Bookshelf', icon: '📚', width: 1, height: 2 },
    { id: 'wardrobe', name: 'Wardrobe', icon: '🚪', width: 2, height: 1 },
  ],
  decor: [
    { id: 'plant', name: 'Plant', icon: '🪴', width: 1, height: 1 },
    { id: 'lamp', name: 'Lamp', icon: '🛋️', width: 1, height: 1 },
    { id: 'painting', name: 'Painting', icon: '🖼️', width: 1, height: 1 },
    { id: 'tv', name: 'TV', icon: '📺', width: 2, height: 1 },
  ],
  kitchen: [
    { id: 'fridge', name: 'Fridge', icon: '🧊', width: 1, height: 2 },
    { id: 'stove', name: 'Stove', icon: '🔥', width: 1, height: 1 },
    { id: 'sink', name: 'Sink', icon: '🚰', width: 1, height: 1 },
  ],
  bathroom: [
    { id: 'toilet', name: 'Toilet', icon: '🚽', width: 1, height: 1 },
    { id: 'bathtub', name: 'Bathtub', icon: '🛁', width: 2, height: 1 },
    { id: 'shower', name: 'Shower', icon: '🚿', width: 1, height: 1 },
  ],
};

interface Wall {
  id: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  type: string;
  hasDoor?: boolean;
  hasWindow?: boolean;
}

interface FurnitureItem {
  id: string;
  type: string;
  x: number;
  y: number;
  rotation: number;
  category: string;
}

interface Room {
  id: string;
  name: string;
  floorType: string;
  walls: Wall[];
  furniture: FurnitureItem[];
}

export function BuildingInteriorEditor() {
  const [activeTab, setActiveTab] = useState<'walls' | 'floors' | 'furniture' | 'rooms'>('walls');
  const [selectedWallType, setSelectedWallType] = useState(wallTypes[0].id);
  const [selectedFloorType, setSelectedFloorType] = useState(floorTypes[0].id);
  const [selectedFurniture, setSelectedFurniture] = useState<string | null>(null);
  const [rooms, setRooms] = useState<Room[]>([
    {
      id: 'room1',
      name: 'Living Room',
      floorType: 'hardwood',
      walls: [],
      furniture: []
    }
  ]);
  const [activeRoom, setActiveRoom] = useState('room1');
  const [isDrawingWall, setIsDrawingWall] = useState(false);
  const [wallStart, setWallStart] = useState<{ x: number; y: number } | null>(null);
  const [zoom, setZoom] = useState(1);
  const [showGrid, setShowGrid] = useState(true);

  const currentRoom = rooms.find(r => r.id === activeRoom);

  const addWall = (x1: number, y1: number, x2: number, y2: number) => {
    if (!currentRoom) return;
    
    const newWall: Wall = {
      id: Date.now().toString(),
      x1, y1, x2, y2,
      type: selectedWallType
    };
    
    setRooms(rooms.map(r => 
      r.id === activeRoom 
        ? { ...r, walls: [...r.walls, newWall] }
        : r
    ));
  };

  const addFurniture = (type: string, x: number, y: number, category: string) => {
    if (!currentRoom) return;
    
    const newItem: FurnitureItem = {
      id: Date.now().toString(),
      type,
      x,
      y,
      rotation: 0,
      category
    };
    
    setRooms(rooms.map(r => 
      r.id === activeRoom 
        ? { ...r, furniture: [...r.furniture, newItem] }
        : r
    ));
  };

  const updateRoomFloor = (floorType: string) => {
    setRooms(rooms.map(r => 
      r.id === activeRoom ? { ...r, floorType } : r
    ));
  };

  return (
    <div className="h-screen flex bg-background">
      {/* Left Toolbar */}
      <div className="w-16 border-r border-border bg-card/50 flex flex-col items-center py-4 gap-2">
        <button
          onClick={() => setActiveTab('walls')}
          className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center transition-colors",
            activeTab === 'walls' ? "bg-primary text-primary-foreground" : "hover:bg-accent"
          )}
        >
          <Square className="w-5 h-5" />
        </button>
        
        <button
          onClick={() => setActiveTab('floors')}
          className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center transition-colors",
            activeTab === 'floors' ? "bg-primary text-primary-foreground" : "hover:bg-accent"
          )}
        >
          <Grid3X3 className="w-5 h-5" />
        </button>
        
        <button
          onClick={() => setActiveTab('furniture')}
          className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center transition-colors",
            activeTab === 'furniture' ? "bg-primary text-primary-foreground" : "hover:bg-accent"
          )}
        >
          <Box className="w-5 h-5" />
        </button>
        
        <button
          onClick={() => setActiveTab('rooms')}
          className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center transition-colors",
            activeTab === 'rooms' ? "bg-primary text-primary-foreground" : "hover:bg-accent"
          )}
        >
          <Layers className="w-5 h-5" />
        </button>
        
        <div className="flex-1" />
        
        <button onClick={() => setZoom(z => Math.min(2, z + 0.1))} className="p-2 hover:bg-accent rounded">+</button>
        <button onClick={() => setZoom(z => Math.max(0.5, z - 0.1))} className="p-2 hover:bg-accent rounded">−</button>
        <button onClick={() => setZoom(1)} className="p-2 hover:bg-accent rounded text-xs">⌂</button>
      </div>

      {/* Main Editor */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-card/50">
          <div className="flex items-center gap-2">
            <select
              value={activeRoom}
              onChange={(e) => setActiveRoom(e.target.value)}
              className="px-3 py-1.5 bg-background border border-input rounded-lg"
            >
              <{rooms.map(room => (
                <option key={room.id} value={room.id}>{room.name}</option>
              ))}
            </select>
            
            <button className="p-2 hover:bg-accent rounded">
              <Plus className="w-4 h-4" />
            </button>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setShowGrid(!showGrid)}
              className={cn(
                "p-2 rounded",
                showGrid ? "bg-primary/20 text-primary" : "hover:bg-accent"
              )}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            
            <span className="text-sm text-muted-foreground">{Math.round(zoom * 100)}%</span>
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 relative overflow-hidden bg-muted">
          <div 
            className="absolute inset-0 flex items-center justify-center"
            style={{ transform: `scale(${zoom})` }}
          >
            {/* Room floor */}
            <div 
              className="relative w-96 h-96 shadow-2xl"
              style={{
                backgroundColor: floorTypes.find(f => f.id === currentRoom?.floorType)?.color || '#d2691e',
                backgroundImage: showGrid ? `
                  linear-gradient(to right, rgba(0,0,0,0.1) 1px, transparent 1px),
                  linear-gradient(to bottom, rgba(0,0,0,0.1) 1px, transparent 1px)
                ` : undefined,
                backgroundSize: '32px 32px'
              }}
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = Math.floor((e.clientX - rect.left) / zoom / 32);
                const y = Math.floor((e.clientY - rect.top) / zoom / 32);
                
                if (selectedFurniture) {
                  const [category, itemId] = selectedFurniture.split(':');
                  addFurniture(itemId, x * 32, y * 32, category);
                }
              }}
            >
              {/* Walls */}
              <{currentRoom?.walls.map(wall => {
                const wallType = wallTypes.find(w => w.id === wall.type);
                return (
                  <div
                    key={wall.id}
                    className="absolute"
                    style={{
                      left: Math.min(wall.x1, wall.x2),
                      top: Math.min(wall.y1, wall.y2),
                      width: Math.abs(wall.x2 - wall.x1) || 4,
                      height: Math.abs(wall.y2 - wall.y1) || 4,
                      backgroundColor: wallType?.color,
                      border: '1px solid rgba(0,0,0,0.2)'
                    }}
                  />
                );
              })}

              {/* Furniture */}
              <{currentRoom?.furniture.map(item => {
                const catalog = Object.entries(furnitureCatalog)
                  .find(([cat, items]) => items.some(i => i.id === item.type));
                const furnitureDef = catalog?.[1].find(i => i.id === item.type);
                
                return (
                  <div
                    key={item.id}
                    className="absolute flex items-center justify-center text-4xl bg-white/50 rounded cursor-move hover:bg-white/80 transition-colors"
                    style={{
                      left: item.x,
                      top: item.y,
                      width: (furnitureDef?.width || 1) * 32,
                      height: (furnitureDef?.height || 1) * 32,
                      transform: `rotate(${item.rotation}deg)`
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      // Select furniture
                    }}
                  >
                    {furnitureDef?.icon}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-80 border-l border-border bg-card/50 overflow-y-auto">
        <AnimatePresence mode="wait">
          {activeTab === 'walls' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-4"
003e
              <h3 className="font-semibold mb-4">Wall Types</h3>
              
              <div className="grid grid-cols-2 gap-2">
                <{wallTypes.map(wall => (
                  <button
                    key={wall.id}
                    onClick={() => setSelectedWallType(wall.id)}
                    className={cn(
                      "p-3 rounded-lg border-2 transition-all text-left",
                      selectedWallType === wall.id
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/30"
                    )}
                  >
                    <div 
                      className="w-full h-8 rounded mb-2"
                      style={{ backgroundColor: wall.color }}
                    />
                    <span className="text-sm">{wall.name}</span>
                  </button>
                ))}
              </div>

              <div className="mt-6 p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">
                  Click and drag on the canvas to draw walls.
                </p>
              </div>
            </motion.div>
          )}

          {activeTab === 'floors' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-4"
003e
              <h3 className="font-semibold mb-4">Floor Types</h3>
              
              <div className="space-y-2">
                <{floorTypes.map(floor => (
                  <button
                    key={floor.id}
                    onClick={() => updateRoomFloor(floor.id)}
                    className={cn(
                      "w-full flex items-center gap-3 p-3 rounded-lg border-2 transition-all",
                      currentRoom?.floorType === floor.id
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/30"
                    )}
                  >
                    <div 
                      className="w-12 h-12 rounded"
                      style={{ backgroundColor: floor.color }}
                    />
                    <span>{floor.name}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'furniture' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-4"
003e
              <h3 className="font-semibold mb-4">Furniture Catalog</h3>
              
              <{Object.entries(furnitureCatalog).map(([category, items]) => (
                <div key={category} className="mb-4">
                  <div className="text-xs font-medium text-muted-foreground uppercase mb-2">{category}</div>
                  
                  <div className="grid grid-cols-4 gap-2">
                    <{items.map(item => (
                      <button
                        key={item.id}
                        onClick={() => setSelectedFurniture(selectedFurniture === `${category}:${item.id}` ? null : `${category}:${item.id}`)}
                        className={cn(
                          "aspect-square flex flex-col items-center justify-center p-2 rounded-lg border-2 transition-all text-2xl",
                          selectedFurniture === `${category}:${item.id}`
                            ? "border-primary bg-primary/10"
                            : "border-border hover:border-primary/30"
                        )}
                        title={item.name}
                      >
                        {item.icon}
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
