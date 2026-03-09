import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Globe, Map, Building2, Trees, Mountain, Waves,
  Plus, Trash2, Search, Filter, Grid3X3, List,
  ChevronRight, MoreVertical, Copy, Edit3, Eye,
  Folder, FolderOpen, MapPin, ZoomIn, ZoomOut,
  Maximize2, Layers, Download, Share2
} from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { cn } from '../lib/utils';

// Types for the world hierarchy
type MapScale = 'world' | 'continent' | 'country' | 'region' | 'city' | 'building';

interface WorldArea {
  id: string;
  name: string;
  scale: MapScale;
  parentId: string | null;
  thumbnail?: string;
  description: string;
  tags: string[];
  lastEdited: string;
  children: string[];
  metadata: {
    population?: number;
    climate?: string;
    terrain?: string;
    size?: string;
  };
}

// Mock data for demonstration
const sampleAreas: WorldArea[] = [
  {
    id: 'world-1',
    name: 'Aetheria',
    scale: 'world',
    parentId: null,
    description: 'The main world - a realm of floating islands and ancient magic',
    tags: ['fantasy', 'floating-islands', 'magic'],
    lastEdited: '2024-03-06',
    children: ['continent-1', 'continent-2'],
    metadata: { climate: 'Varied', terrain: 'Floating Islands', size: 'Planet' }
  },
  {
    id: 'continent-1',
    name: 'Eldoria',
    scale: 'continent',
    parentId: 'world-1',
    description: 'The eastern continent, home to ancient forests',
    tags: ['forest', 'elves', 'ancient'],
    lastEdited: '2024-03-05',
    children: ['country-1', 'country-2'],
    metadata: { climate: 'Temperate', terrain: 'Forests & Mountains', size: 'Large' }
  },
  {
    id: 'continent-2',
    name: 'Drakonia',
    scale: 'continent',
    parentId: 'world-1',
    description: 'The western continent of fire and dragons',
    tags: ['volcanic', 'dragons', 'desert'],
    lastEdited: '2024-03-04',
    children: ['country-3'],
    metadata: { climate: 'Hot', terrain: 'Volcanic', size: 'Large' }
  },
  {
    id: 'country-1',
    name: 'Silverwood',
    scale: 'country',
    parentId: 'continent-1',
    description: 'An elven kingdom hidden in the silver forests',
    tags: ['elves', 'forest', 'kingdom'],
    lastEdited: '2024-03-06',
    children: ['city-1', 'city-2', 'city-3'],
    metadata: { population: 500000, climate: 'Temperate', terrain: 'Forest', size: 'Medium' }
  },
  {
    id: 'country-2',
    name: 'Ironhold',
    scale: 'country',
    parentId: 'continent-1',
    description: 'A dwarven mountain kingdom rich in minerals',
    tags: ['dwarves', 'mountain', 'mining'],
    lastEdited: '2024-03-03',
    children: ['city-4'],
    metadata: { population: 300000, climate: 'Cold', terrain: 'Mountain', size: 'Small' }
  },
  {
    id: 'country-3',
    name: 'Emberlands',
    scale: 'country',
    parentId: 'continent-2',
    description: 'A desert kingdom forged in volcanic fire',
    tags: ['desert', 'fire', 'nomads'],
    lastEdited: '2024-03-02',
    children: ['city-5', 'city-6'],
    metadata: { population: 200000, climate: 'Desert', terrain: 'Volcanic', size: 'Medium' }
  },
  {
    id: 'city-1',
    name: 'Luminara',
    scale: 'city',
    parentId: 'country-1',
    description: 'The capital city of Silverwood, built in the trees',
    tags: ['capital', 'tree-city', 'magic'],
    lastEdited: '2024-03-06',
    children: ['building-1'],
    metadata: { population: 50000, climate: 'Temperate', terrain: 'Forest', size: 'Large City' }
  },
  {
    id: 'city-2',
    name: 'Mosshaven',
    scale: 'city',
    parentId: 'country-1',
    description: 'A peaceful village in the mossy lowlands',
    tags: ['village', 'agriculture', 'peaceful'],
    lastEdited: '2024-03-01',
    children: [],
    metadata: { population: 5000, climate: 'Temperate', terrain: 'Plains', size: 'Village' }
  },
  {
    id: 'city-3',
    name: 'Starfall',
    scale: 'city',
    parentId: 'country-1',
    description: 'An observatory city where mages study the stars',
    tags: ['magic', 'observatory', 'academy'],
    lastEdited: '2024-02-28',
    children: [],
    metadata: { population: 15000, climate: 'Mountain', terrain: 'Peak', size: 'Town' }
  },
  {
    id: 'city-4',
    name: 'Deepholm',
    scale: 'city',
    parentId: 'country-2',
    description: 'An underground city beneath the mountains',
    tags: ['underground', 'forge', 'dwarven'],
    lastEdited: '2024-03-05',
    children: [],
    metadata: { population: 80000, climate: 'Underground', terrain: 'Caverns', size: 'Large City' }
  },
  {
    id: 'city-5',
    name: 'Scorchwind',
    scale: 'city',
    parentId: 'country-3',
    description: 'A nomadic tent city that moves with the winds',
    tags: ['nomadic', 'desert', 'trade'],
    lastEdited: '2024-03-04',
    children: [],
    metadata: { population: 25000, climate: 'Desert', terrain: 'Sand', size: 'City' }
  },
  {
    id: 'city-6',
    name: 'Ashford',
    scale: 'city',
    parentId: 'country-3',
    description: 'A fortress city guarding the volcano',
    tags: ['fortress', 'military', 'volcano'],
    lastEdited: '2024-03-03',
    children: [],
    metadata: { population: 40000, climate: 'Hot', terrain: 'Volcanic Rock', size: 'City' }
  },
  {
    id: 'building-1',
    name: 'The Astral Spire',
    scale: 'building',
    parentId: 'city-1',
    description: 'The royal palace and center of magic',
    tags: ['palace', 'magic', 'landmark'],
    lastEdited: '2024-03-06',
    children: [],
    metadata: { population: 500, climate: 'Controlled', terrain: 'Structure', size: 'Palace' }
  },
];

const scaleIcons: Record<MapScale, React.ReactNode> = {
  world: <Globe className="w-5 h-5" />,
  continent: <Map className="w-5 h-5" />,
  country: <Folder className="w-5 h-5" />,
  region: <MapPin className="w-5 h-5" />,
  city: <Building2 className="w-5 h-5" />,
  building: <Layers className="w-5 h-5" />,
};

const scaleColors: Record<MapScale, string> = {
  world: 'bg-blue-500',
  continent: 'bg-green-500',
  country: 'bg-yellow-500',
  region: 'bg-orange-500',
  city: 'bg-purple-500',
  building: 'bg-pink-500',
};

export function WorldArchivePage() {
  const [areas, setAreas] = useState<WorldArea[]>(sampleAreas);
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'tree'>('tree');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterScale, setFilterScale] = useState<MapScale | 'all'>('all');
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['world-1']));

  const selectedAreaData = areas.find(a => a.id === selectedArea);

  // Get children of an area
  const getChildren = (parentId: string) => {
    return areas.filter(a => a.parentId === parentId);
  };

  // Get breadcrumb path
  const getBreadcrumb = (areaId: string): WorldArea[] => {
    const path: WorldArea[] = [];
    let current = areas.find(a => a.id === areaId);
    while (current) {
      path.unshift(current);
      current = areas.find(a => a.id === current?.parentId);
    }
    return path;
  };

  // Toggle tree node expansion
  const toggleExpanded = (areaId: string) => {
    setExpandedNodes(prev => {
      const next = new Set(prev);
      if (next.has(areaId)) {
        next.delete(areaId);
      } else {
        next.add(areaId);
      }
      return next;
    });
  };

  // Create new area
  const createArea = (parentId: string | null, scale: MapScale) => {
    const newArea: WorldArea = {
      id: `area-${Date.now()}`,
      name: `New ${scale.charAt(0).toUpperCase() + scale.slice(1)}`,
      scale,
      parentId,
      description: '',
      tags: [],
      lastEdited: new Date().toISOString().split('T')[0],
      children: [],
      metadata: {}
    };
    
    setAreas([...areas, newArea]);
    
    // Update parent's children
    if (parentId) {
      setAreas(prev => prev.map(a => 
        a.id === parentId 
          ? { ...a, children: [...a.children, newArea.id] }
          : a
      ));
    }
    
    setSelectedArea(newArea.id);
  };

  // Delete area
  const deleteArea = (areaId: string) => {
    const area = areas.find(a => a.id === areaId);
    if (!area) return;

    // Remove from parent's children
    if (area.parentId) {
      setAreas(prev => prev.map(a => 
        a.id === area.parentId
          ? { ...a, children: a.children.filter(c => c !== areaId) }
          : a
      ));
    }

    // Delete this area and all descendants
    const toDelete = new Set<string>();
    const collectDescendants = (id: string) => {
      toDelete.add(id);
      const children = areas.filter(a => a.parentId === id);
      children.forEach(c => collectDescendants(c.id));
    };
    collectDescendants(areaId);

    setAreas(prev => prev.filter(a => !toDelete.has(a.id)));
    
    if (selectedArea === areaId) {
      setSelectedArea(null);
    }
  };

  // Filter areas
  const filteredAreas = areas.filter(area => {
    const matchesSearch = area.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         area.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         area.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesScale = filterScale === 'all' || area.scale === filterScale;
    return matchesSearch && matchesScale;
  });

  // Get root areas (worlds)
  const rootAreas = areas.filter(a => a.parentId === null);

  return (
    <div className="h-screen flex bg-background">
      {/* Left Sidebar - Tree View */}
      <div className="w-80 border-r border-border bg-card/50 flex flex-col">
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold flex items-center gap-2">
              <Globe className="w-5 h-5" />
              World Archive
            </h2>
            <button 
              onClick={() => createArea(null, 'world')}
              className="p-2 hover:bg-accent rounded-lg"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search areas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-background border border-input rounded-lg text-sm"
            />
          </div>
        </div>

        {/* Tree View */}
        <div className="flex-1 overflow-y-auto p-2">
          {searchQuery ? (
            // Search results
            <div className="space-y-1">
              {filteredAreas.map(area => (
                <button
                  key={area.id}
                  onClick={() => setSelectedArea(area.id)}
                  className={cn(
                    "w-full flex items-center gap-2 p-2 rounded-lg text-left transition-colors",
                    selectedArea === area.id ? "bg-primary/10 text-primary" : "hover:bg-accent"
                  )}
                >
                  <span className={cn("w-2 h-2 rounded-full", scaleColors[area.scale])} />
                  {scaleIcons[area.scale]}
                  <span className="flex-1 truncate">{area.name}</span>
                  <span className="text-xs text-muted-foreground uppercase">{area.scale}</span>
                </button>
              ))}
            </div>
          ) : (
            // Tree view
            <div className="space-y-1">
              {rootAreas.map(world => (
                <TreeNode
                  key={world.id}
                  area={world}
                  areas={areas}
                  selectedArea={selectedArea}
                  expandedNodes={expandedNodes}
                  onSelect={setSelectedArea}
                  onToggle={toggleExpanded}
                  level={0}
                />
              ))}
            </div>
          )}
        </div>

        {/* Filter by scale */}
        <div className="p-3 border-t border-border">
          <div className="flex flex-wrap gap-1">
            {(['all', 'world', 'continent', 'country', 'city', 'building'] as const).map(scale => (
              <button
                key={scale}
                onClick={() => setFilterScale(scale)}
                className={cn(
                  "px-2 py-1 text-xs rounded-full capitalize transition-colors",
                  filterScale === scale
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted hover:bg-accent"
                )}
              >
                {scale === 'all' ? 'All' : scale}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {selectedAreaData ? (
          <>
            {/* Header */}
            <div className="p-6 border-b border-border">
              {/* Breadcrumb */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                {getBreadcrumb(selectedArea).map((area, index, arr) => (
                  <span key={area.id} className="flex items-center gap-2">
                    <button 
                      onClick={() => setSelectedArea(area.id)}
                      className="hover:text-foreground transition-colors"
                    >
                      {area.name}
                    </button>
                    {index < arr.length - 1 && <ChevronRight className="w-4 h-4" />}
                  </span>
                ))}
              </div>

              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center text-white", scaleColors[selectedAreaData.scale])}>
                    {scaleIcons[selectedAreaData.scale]}
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold">{selectedAreaData.name}</h1>
                    <p className="text-muted-foreground">{selectedAreaData.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-accent rounded-lg">
                    <Edit3 className="w-5 h-5" />
                  </button>
                  <button className="p-2 hover:bg-accent rounded-lg">
                    <Share2 className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => deleteArea(selectedArea)}
                    className="p-2 hover:text-destructive rounded-lg"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Metadata */}
              <div className="flex flex-wrap gap-4 mt-4">
                {Object.entries(selectedAreaData.metadata).map(([key, value]) => (
                  value && (
                    <div key={key} className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-lg text-sm">
                      <span className="text-muted-foreground capitalize">{key}:</span>
                      <span className="font-medium">{value}</span>
                    </div>
                  )
                ))}
                <div className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-lg text-sm">
                  <span className="text-muted-foreground">Last edited:</span>
                  <span>{selectedAreaData.lastEdited}</span>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mt-4">
                {selectedAreaData.tags.map(tag => (
                  <span key={tag} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                    #{tag}
                  </span>
                ))}
                <button className="px-2 py-1 border border-dashed border-border text-muted-foreground text-xs rounded-full hover:border-primary hover:text-primary">
                  + Add tag
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 p-6 overflow-y-auto">
              {/* Quick Actions */}
              <div className="grid grid-cols-4 gap-4 mb-8">
                <button 
                  onClick={() => {
                    const nextScale = getNextScale(selectedAreaData.scale);
                    if (nextScale) createArea(selectedArea, nextScale);
                  }}
                  className="p-4 border-2 border-dashed border-border rounded-xl hover:border-primary hover:bg-primary/5 transition-all text-center"
                >
                  <Plus className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="font-medium">Add {getNextScaleName(selectedAreaData.scale)}</p>
                  <p className="text-xs text-muted-foreground">Create sub-location</p>
                </button>

                <button className="p-4 border-2 border-dashed border-border rounded-xl hover:border-primary hover:bg-primary/5 transition-all text-center">
                  <Map className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="font-medium">Open Map Editor</p>
                  <p className="text-xs text-muted-foreground">Edit terrain & features</p>
                </button>

                <button className="p-4 border-2 border-dashed border-border rounded-xl hover:border-primary hover:bg-primary/5 transition-all text-center">
                  <Building2 className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="font-medium">Place Assets</p>
                  <p className="text-xs text-muted-foreground">Add cities, dungeons, etc.</p>
                </button>

                <button className="p-4 border-2 border-dashed border-border rounded-xl hover:border-primary hover:bg-primary/5 transition-all text-center">
                  <Download className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="font-medium">Export</p>
                  <p className="text-xs text-muted-foreground">Save as image or data</p>
                </button>
              </div>

              {/* Child Areas */}
              {selectedAreaData.children.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-4">
                    Contains {selectedAreaData.children.length} {getNextScaleName(selectedAreaData.scale)?.toLowerCase() || 'areas'}
                  </h3>
                  
                  <div className="grid grid-cols-3 gap-4">
                    {selectedAreaData.children.map(childId => {
                      const child = areas.find(a => a.id === childId);
                      if (!child) return null;
                      
                      return (
                        <GlassCard 
                          key={child.id}
                          className="p-4 cursor-pointer hover:ring-2 hover:ring-primary transition-all"
                          onClick={() => setSelectedArea(child.id)}
                        >
                          <div className="flex items-start gap-3">
                            <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center text-white", scaleColors[child.scale])}>
                              {scaleIcons[child.scale]}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium truncate">{child.name}</h4>
                              <p className="text-sm text-muted-foreground line-clamp-2">{child.description}</p>
                              <div className="flex items-center gap-2 mt-2">
                                {child.children.length > 0 && (
                                  <span className="text-xs text-muted-foreground">
                                    {child.children.length} sub-areas
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </GlassCard>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <Globe className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p className="text-lg font-medium">Select a world to begin</p>
              <p className="text-sm">Choose from the sidebar or create a new world</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Helper components
function TreeNode({ 
  area, 
  areas, 
  selectedArea, 
  expandedNodes, 
  onSelect, 
  onToggle,
  level 
}: { 
  area: WorldArea;
  areas: WorldArea[];
  selectedArea: string | null;
  expandedNodes: Set<string>;
  onSelect: (id: string) => void;
  onToggle: (id: string) => void;
  level: number;
}) {
  const isExpanded = expandedNodes.has(area.id);
  const children = areas.filter(a => a.parentId === area.id);
  const hasChildren = children.length > 0;

  return (
    <div>
      <button
        onClick={() => onSelect(area.id)}
        className={cn(
          "w-full flex items-center gap-2 p-2 rounded-lg text-left transition-colors",
          selectedArea === area.id ? "bg-primary/10 text-primary" : "hover:bg-accent"
        )}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
      >
        {hasChildren ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggle(area.id);
            }}
            className="p-0.5 hover:bg-accent rounded"
          >
            <ChevronRight className={cn("w-4 h-4 transition-transform", isExpanded && "rotate-90")} />
          </button>
        ) : (
          <span className="w-5" />
        )}
        <span className={cn("w-2 h-2 rounded-full", scaleColors[area.scale])} />
        <span className="flex-1 truncate">{area.name}</span>
      </button>

      {isExpanded && hasChildren && (
        <div>
          {children.map(child => (
            <TreeNode
              key={child.id}
              area={child}
              areas={areas}
              selectedArea={selectedArea}
              expandedNodes={expandedNodes}
              onSelect={onSelect}
              onToggle={onToggle}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Helper functions
function getNextScale(current: MapScale): MapScale | null {
  const order: MapScale[] = ['world', 'continent', 'country', 'region', 'city', 'building'];
  const index = order.indexOf(current);
  return index < order.length - 1 ? order[index + 1] : null;
}

function getNextScaleName(current: MapScale): string | null {
  const next = getNextScale(current);
  return next ? next.charAt(0).toUpperCase() + next.slice(1) : null;
}
