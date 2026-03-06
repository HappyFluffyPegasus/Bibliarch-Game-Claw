import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Square, Grid3X3, Box, Plus, Trash2,
  Layers, Paintbrush
} from 'lucide-react';
import { cn } from '../lib/utils';

const wallTypes = [
  { id: 'brick', name: 'Brick', color: '#8b4513' },
  { id: 'wood', name: 'Wood', color: '#deb887' },
  { id: 'concrete', name: 'Concrete', color: '#808080' },
  { id: 'plaster', name: 'Plaster', color: '#fffdd0' },
  { id: 'stone', name: 'Stone', color: '#696969' },
];

const floorTypes = [
  { id: 'hardwood', name: 'Hardwood', color: '#d2691e' },
  { id: 'tile', name: 'Tile', color: '#f5f5dc' },
  { id: 'carpet', name: 'Carpet', color: '#8b0000' },
  { id: 'concrete', name: 'Concrete', color: '#a9a9a9' },
  { id: 'marble', name: 'Marble', color: '#f0f8ff' },
];

const furnitureItems = [
  { id: 'sofa', name: 'Sofa', icon: '🛋️' },
  { id: 'chair', name: 'Chair', icon: '🪑' },
  { id: 'bed', name: 'Bed', icon: '🛏️' },
  { id: 'table', name: 'Table', icon: '🪑' },
  { id: 'cabinet', name: 'Cabinet', icon: '🗄️' },
  { id: 'plant', name: 'Plant', icon: '🪴' },
  { id: 'lamp', name: 'Lamp', icon: '💡' },
  { id: 'tv', name: 'TV', icon: '📺' },
];

export function BuildingInteriorEditor() {
  const [activeTab, setActiveTab] = useState('walls');
  const [selectedWallType, setSelectedWallType] = useState(wallTypes[0].id);
  const [selectedFloorType, setSelectedFloorType] = useState(floorTypes[0].id);
  const [selectedFurniture, setSelectedFurniture] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [showGrid, setShowGrid] = useState(true);
  const [roomName, setRoomName] = useState('Living Room');

  return (
    <div className="h-screen flex bg-background">
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
        <div className="flex-1" />
        <button onClick={() => setZoom(Math.min(2, zoom + 0.1))} className="p-2 hover:bg-accent rounded">+</button>
        <button onClick={() => setZoom(Math.max(0.5, zoom - 0.1))} className="p-2 hover:bg-accent rounded">−</button>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-card/50">
          <input
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            className="px-3 py-1.5 bg-background border border-input rounded-lg font-medium"
          />
          
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

        <div className="flex-1 relative overflow-hidden bg-muted">
          <div 
            className="absolute inset-0 flex items-center justify-center"
            style={{ transform: `scale(${zoom})` }}
          >
            <div 
              className="relative w-96 h-96 shadow-2xl rounded-lg"
              style={{
                backgroundColor: floorTypes.find(f => f.id === selectedFloorType)?.color,
                backgroundImage: showGrid ? `
                  linear-gradient(to right, rgba(0,0,0,0.1) 1px, transparent 1px),
                  linear-gradient(to bottom, rgba(0,0,0,0.1) 1px, transparent 1px)
                ` : undefined,
                backgroundSize: '32px 32px'
              }}
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                <div className="text-4xl mb-2">🏠</div>
                <p className="text-sm font-medium">{roomName}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-80 border-l border-border bg-card/50 overflow-y-auto">
        {activeTab === 'walls' && (
          <div className="p-4">
            <h3 className="font-semibold mb-4">Wall Types</h3>
            <div className="grid grid-cols-2 gap-2">
              {wallTypes.map(wall => (
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
          </div>
        )}

        {activeTab === 'floors' && (
          <div className="p-4">
            <h3 className="font-semibold mb-4">Floor Types</h3>
            <div className="space-y-2">
              {floorTypes.map(floor => (
                <button
                  key={floor.id}
                  onClick={() => setSelectedFloorType(floor.id)}
                  className={cn(
                    "w-full flex items-center gap-3 p-3 rounded-lg border-2 transition-all",
                    selectedFloorType === floor.id
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
          </div>
        )}

        {activeTab === 'furniture' && (
          <div className="p-4">
            <h3 className="font-semibold mb-4">Furniture Catalog</h3>
            <div className="grid grid-cols-4 gap-2">
              {furnitureItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => setSelectedFurniture(selectedFurniture === item.id ? null : item.id)}
                  className={cn(
                    "aspect-square flex flex-col items-center justify-center p-2 rounded-lg border-2 transition-all text-2xl",
                    selectedFurniture === item.id
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
        )}
      </div>
    </div>
  );
}
