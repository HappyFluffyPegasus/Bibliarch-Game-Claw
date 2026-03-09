import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Package, Plus, Search, Grid3X3, List, Star, Folder,
  MoreVertical, Copy, Trash2, Edit3, Download, Upload,
  Eye, Heart, Clock, Tag, ChevronDown, Filter
} from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { cn } from '../lib/utils';

type PrefabCategory = 'structures' | 'nature' | 'decor' | 'lighting' | 'fx' | 'custom';

interface Prefab {
  id: string;
  name: string;
  description: string;
  category: PrefabCategory;
  thumbnail: string;
  tags: string[];
  isFavorite: boolean;
  createdAt: string;
  usageCount: number;
  size: { x: number; y: number; z: number };
  complexity: 'simple' | 'medium' | 'complex';
}

const prefabCategories: { id: PrefabCategory; name: string; icon: string }[] = [
  { id: 'structures', name: 'Structures', icon: '🏗️' },
  { id: 'nature', name: 'Nature', icon: '🌲' },
  { id: 'decor', name: 'Decor', icon: '🎨' },
  { id: 'lighting', name: 'Lighting', icon: '💡' },
  { id: 'fx', name: 'Effects', icon: '✨' },
  { id: 'custom', name: 'Custom', icon: '📦' },
];

const samplePrefabs: Prefab[] = [
  {
    id: '1',
    name: 'Elven Tower',
    description: 'A mystical tower with glowing crystals',
    category: 'structures',
    thumbnail: '🏰',
    tags: ['fantasy', 'elven', 'tower', 'magic'],
    isFavorite: true,
    createdAt: '2024-03-01',
    usageCount: 42,
    size: { x: 10, y: 25, z: 10 },
    complexity: 'complex',
  },
  {
    id: '2',
    name: 'Pine Forest',
    description: 'Dense pine trees with undergrowth',
    category: 'nature',
    thumbnail: '🌲',
    tags: ['forest', 'trees', 'nature'],
    isFavorite: false,
    createdAt: '2024-03-02',
    usageCount: 128,
    size: { x: 50, y: 15, z: 50 },
    complexity: 'medium',
  },
  {
    id: '3',
    name: 'Campfire',
    description: 'Cozy campfire with seating',
    category: 'decor',
    thumbnail: '🔥',
    tags: ['camping', 'fire', 'cozy'],
    isFavorite: true,
    createdAt: '2024-03-03',
    usageCount: 89,
    size: { x: 5, y: 3, z: 5 },
    complexity: 'simple',
  },
  {
    id: '4',
    name: 'Street Lamps',
    description: 'Victorian-style street lighting',
    category: 'lighting',
    thumbnail: '🏮',
    tags: ['lighting', 'street', 'victorian'],
    isFavorite: false,
    createdAt: '2024-03-04',
    usageCount: 256,
    size: { x: 1, y: 4, z: 1 },
    complexity: 'simple',
  },
  {
    id: '5',
    name: 'Magic Portal',
    description: 'Swirling portal with particle effects',
    category: 'fx',
    thumbnail: '🌀',
    tags: ['magic', 'portal', 'effects'],
    isFavorite: true,
    createdAt: '2024-03-05',
    usageCount: 34,
    size: { x: 8, y: 12, z: 3 },
    complexity: 'complex',
  },
  {
    id: '6',
    name: 'Market Stall',
    description: 'Medieval market stall with goods',
    category: 'structures',
    thumbnail: '🏪',
    tags: ['market', 'medieval', 'shop'],
    isFavorite: false,
    createdAt: '2024-03-06',
    usageCount: 67,
    size: { x: 6, y: 4, z: 4 },
    complexity: 'medium',
  },
  {
    id: '7',
    name: 'Waterfall',
    description: 'Cascading waterfall with mist',
    category: 'nature',
    thumbnail: '🌊',
    tags: ['water', 'nature', 'waterfall'],
    isFavorite: false,
    createdAt: '2024-03-07',
    usageCount: 23,
    size: { x: 20, y: 30, z: 10 },
    complexity: 'complex',
  },
  {
    id: '8',
    name: 'Treasure Chest',
    description: 'Glowing treasure chest with coins',
    category: 'decor',
    thumbnail: '💎',
    tags: ['treasure', 'loot', 'rewards'],
    isFavorite: true,
    createdAt: '2024-03-08',
    usageCount: 445,
    size: { x: 2, y: 1.5, z: 1.5 },
    complexity: 'simple',
  },
];

export function PrefabLibraryPage() {
  const [prefabs, setPrefabs] = useState<Prefab[]>(samplePrefabs);
  const [selectedCategory, setSelectedCategory] = useState<PrefabCategory>('structures');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterFavorites, setFilterFavorites] = useState(false);
  const [selectedPrefab, setSelectedPrefab] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const filteredPrefabs = prefabs.filter(prefab => {
    const matchesCategory = prefab.category === selectedCategory;
    const matchesSearch = prefab.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         prefab.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesFavorite = !filterFavorites || prefab.isFavorite;
    return matchesCategory && matchesSearch && matchesFavorite;
  });

  const toggleFavorite = (id: string) => {
    setPrefabs(prefabs.map(p => 
      p.id === id ? { ...p, isFavorite: !p.isFavorite } : p
    ));
  };

  const deletePrefab = (id: string) => {
    setPrefabs(prefabs.filter(p => p.id !== id));
    if (selectedPrefab === id) setSelectedPrefab(null);
  };

  const selectedPrefabData = prefabs.find(p => p.id === selectedPrefab);

  return (
    <div className="h-screen flex bg-background">
      {/* Left Sidebar - Categories */}
      <div className="w-64 border-r border-border bg-card/50 flex flex-col">
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            <h2 className="font-semibold">Prefab Library</h2>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          <div className="space-y-1">
            {prefabCategories.map(cat => {
              const count = prefabs.filter(p => p.category === cat.id).length;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={cn(
                    "w-full flex items-center gap-3 p-3 rounded-xl transition-all",
                    selectedCategory === cat.id
                      ? "bg-primary/10 text-primary"
                      : "hover:bg-accent"
                  )}
                >
                  <span className="text-2xl">{cat.icon}</span>
                  <span className="flex-1 text-left font-medium">{cat.name}</span>
                  <span className="text-sm text-muted-foreground">{count}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-6 px-2">
            <button
              onClick={() => setShowCreateModal(true)}
              className="w-full flex items-center justify-center gap-2 p-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Create Prefab
            </button>
          </div>
        </div>

        <div className="p-4 border-t border-border">
          <div className="text-xs text-muted-foreground">
            <p>{prefabs.length} total prefabs</p>
            <p>{prefabs.filter(p => p.isFavorite).length} favorites</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card/50">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search prefabs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 bg-background border border-input rounded-lg w-64"
              />
            </div>

            <button
              onClick={() => setFilterFavorites(!filterFavorites)}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-lg transition-colors",
                filterFavorites ? "bg-primary/20 text-primary" : "hover:bg-accent"
              )}
            >
              <Heart className={cn("w-4 h-4", filterFavorites && "fill-current")} />
              Favorites
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={cn(
                "p-2 rounded-lg",
                viewMode === 'grid' ? "bg-primary/20 text-primary" : "hover:bg-accent"
              )}
            >
              <Grid3X3 className="w-5 h-5" />
            </button>
            
            <button
              onClick={() => setViewMode('list')}
              className={cn(
                "p-2 rounded-lg",
                viewMode === 'list' ? "bg-primary/20 text-primary" : "hover:bg-accent"
              )}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Prefab Grid/List */}
        <div className="flex-1 overflow-y-auto p-6">
          <AnimatePresence mode="wait">
            {filteredPrefabs.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full flex flex-col items-center justify-center text-muted-foreground"
              >
                <Package className="w-16 h-16 mb-4 opacity-30" />
                <p className="text-lg">No prefabs found</p>
                <p className="text-sm">Try adjusting your search or filters</p>
              </motion.div>
            ) : viewMode === 'grid' ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
              >
                {filteredPrefabs.map(prefab => (
                  <PrefabCard
                    key={prefab.id}
                    prefab={prefab}
                    isSelected={selectedPrefab === prefab.id}
                    onSelect={() => setSelectedPrefab(prefab.id)}
                    onToggleFavorite={() => toggleFavorite(prefab.id)}
                  />
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-2"
              >
                {filteredPrefabs.map(prefab => (
                  <PrefabListItem
                    key={prefab.id}
                    prefab={prefab}
                    isSelected={selectedPrefab === prefab.id}
                    onSelect={() => setSelectedPrefab(prefab.id)}
                    onToggleFavorite={() => toggleFavorite(prefab.id)}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Right Panel - Prefab Details */}
      {selectedPrefabData && (
        <AnimatePresence>
          <motion.div
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            className="w-80 border-l border-border bg-card/50 flex flex-col"
          >
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h3 className="font-semibold">Prefab Details</h3>
              <button 
                onClick={() => setSelectedPrefab(null)}
                className="p-2 hover:bg-accent rounded-lg"
              >
                ×
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <div className="text-center mb-6">
                <div className="text-8xl mb-2">{selectedPrefabData.thumbnail}</div>
                <h2 className="text-xl font-bold">{selectedPrefabData.name}</h2>
                <p className="text-muted-foreground">{selectedPrefabData.description}</p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-xs text-muted-foreground">Size</p>
                    <p className="font-medium">
                      {selectedPrefabData.size.x} × {selectedPrefabData.size.y} × {selectedPrefabData.size.z}
                    </p>
                  </div>

                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-xs text-muted-foreground">Complexity</p>
                    <p className="font-medium capitalize">{selectedPrefabData.complexity}</p>
                  </div>

                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-xs text-muted-foreground">Used</p>
                    <p className="font-medium">{selectedPrefabData.usageCount} times</p>
                  </div>

                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-xs text-muted-foreground">Created</p>
                    <p className="font-medium">{selectedPrefabData.createdAt}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium mb-2">Tags</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedPrefabData.tags.map(tag => (
                      <span key={tag} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <button className="flex-1 flex items-center justify-center gap-2 p-3 bg-primary text-primary-foreground rounded-xl">
                    <Copy className="w-4 h-4" />
                    Place in World
                  </button>
                </div>

                <div className="flex gap-2">
                  <button 
                    onClick={() => toggleFavorite(selectedPrefabData.id)}
                    className={cn(
                      "flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-colors",
                      selectedPrefabData.isFavorite 
                        ? "border-primary text-primary" 
                        : "border-border hover:border-primary"
                    )}
                  >
                    <Heart className={cn("w-4 h-4", selectedPrefabData.isFavorite && "fill-current")} />
                    {selectedPrefabData.isFavorite ? 'Favorited' : 'Add to Favorites'}
                  </button>
                </div>

                <div className="flex gap-2">
                  <button className="flex-1 p-3 text-muted-foreground hover:bg-accent rounded-xl">
                    <Edit3 className="w-4 h-4 mx-auto" />
                  </button>
                  
                  <button className="flex-1 p-3 text-muted-foreground hover:bg-accent rounded-xl">
                    <Download className="w-4 h-4 mx-auto" />
                  </button>
                  
                  <button 
                    onClick={() => deletePrefab(selectedPrefabData.id)}
                    className="flex-1 p-3 text-destructive hover:bg-destructive/10 rounded-xl">
                    <Trash2 className="w-4 h-4 mx-auto" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}

// Prefab Card Component
function PrefabCard({ 
  prefab, 
  isSelected, 
  onSelect, 
  onToggleFavorite 
}: { 
  prefab: Prefab; 
  isSelected: boolean; 
  onSelect: () => void; 
  onToggleFavorite: () => void;
}) {
  return (
    <GlassCard
      onClick={onSelect}
      className={cn(
        "p-4 cursor-pointer transition-all hover:scale-[1.02]",
        isSelected && "ring-2 ring-primary"
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <span className="text-5xl">{prefab.thumbnail}</span>
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite();
          }}
          className={cn(
            "p-1.5 rounded-lg transition-colors",
            prefab.isFavorite ? "text-red-500" : "text-muted-foreground hover:text-red-500"
          )}
        >
          <Heart className={cn("w-4 h-4", prefab.isFavorite && "fill-current")} />
        </button>
      </div>

      <h4 className="font-medium truncate">{prefab.name}</h4>
      
      <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{prefab.description}</p>

      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <span className={cn(
          "px-2 py-0.5 rounded-full",
          prefab.complexity === 'simple' ? 'bg-green-500/20 text-green-600' :
          prefab.complexity === 'medium' ? 'bg-yellow-500/20 text-yellow-600' :
          'bg-red-500/20 text-red-600'
        )}>
          {prefab.complexity}
        </span>
        
        <span>{prefab.usageCount} uses</span>
      </div>
    </GlassCard>
  );
}

// Prefab List Item Component
function PrefabListItem({ 
  prefab, 
  isSelected, 
  onSelect, 
  onToggleFavorite 
}: { 
  prefab: Prefab; 
  isSelected: boolean; 
  onSelect: () => void; 
  onToggleFavorite: () => void;
}) {
  return (
    <div
      onClick={onSelect}
      className={cn(
        "flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-colors",
        isSelected ? "bg-primary/10" : "hover:bg-accent"
      )}
    >
      <span className="text-4xl">{prefab.thumbnail}</span>
      
      <div className="flex-1 min-w-0">
        <h4 className="font-medium truncate">{prefab.name}</h4>
        <p className="text-sm text-muted-foreground truncate">{prefab.description}</p>
        
        <div className="flex items-center gap-2 mt-1">
          {prefab.tags.slice(0, 3).map(tag => (
            <span key={tag} className="text-xs text-muted-foreground">#{tag}</span>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span className={cn(
          "px-2 py-0.5 text-xs rounded-full",
          prefab.complexity === 'simple' ? 'bg-green-500/20 text-green-600' :
          prefab.complexity === 'medium' ? 'bg-yellow-500/20 text-yellow-600' :
          'bg-red-500/20 text-red-600'
        )}>
          {prefab.complexity}
        </span>
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite();
          }}
          className={cn(
            "p-2 rounded-lg transition-colors",
            prefab.isFavorite ? "text-red-500" : "text-muted-foreground hover:text-red-500"
          )}
        >
          <Heart className={cn("w-4 h-4", prefab.isFavorite && "fill-current")} />
        </button>
      </div>
    </div>
  );
}
