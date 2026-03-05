import { useState, useRef, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, Image, FileText, Music, Video, Box, 
  Folder, Grid, List, Search, Trash2, Download,
  Copy, Check, X, FilePlus, FolderPlus, MoreVertical
} from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { cn } from '../lib/utils';

interface Asset {
  id: string;
  name: string;
  type: 'image' | 'audio' | 'video' | 'model' | 'document';
  size: number;
  url: string;
  thumbnail?: string;
  tags: string[];
  folder: string;
  createdAt: string;
}

interface AssetFolder {
  id: string;
  name: string;
  parentId: string | null;
  color?: string;
}

const defaultFolders: AssetFolder[] = [
  { id: 'root', name: 'All Assets', parentId: null },
  { id: 'characters', name: 'Characters', parentId: 'root', color: '#3b82f6' },
  { id: 'backgrounds', name: 'Backgrounds', parentId: 'root', color: '#22c55e' },
  { id: 'props', name: 'Props', parentId: 'root', color: '#f59e0b' },
  { id: 'audio', name: 'Audio', parentId: 'root', color: '#ec4899' },
  { id: 'music', name: 'Music', parentId: 'audio', color: '#8b5cf6' },
  { id: 'sfx', name: 'Sound Effects', parentId: 'audio', color: '#14b8a6' },
];

const sampleAssets: Asset[] = [
  {
    id: '1',
    name: 'hero_character.png',
    type: 'image',
    size: 2457600,
    url: '/assets/hero.png',
    thumbnail: '👤',
    tags: ['character', 'main', 'hero'],
    folder: 'characters',
    createdAt: '2024-03-01'
  },
  {
    id: '2',
    name: 'forest_background.jpg',
    type: 'image',
    size: 4194304,
    url: '/assets/forest.jpg',
    thumbnail: '🌲',
    tags: ['background', 'forest', 'nature'],
    folder: 'backgrounds',
    createdAt: '2024-03-02'
  },
  {
    id: '3',
    name: 'battle_music.mp3',
    type: 'audio',
    size: 5242880,
    url: '/assets/battle.mp3',
    thumbnail: '🎵',
    tags: ['music', 'battle', 'intense'],
    folder: 'music',
    createdAt: '2024-03-03'
  },
  {
    id: '4',
    name: 'sword_clash.wav',
    type: 'audio',
    size: 102400,
    url: '/assets/sword.wav',
    thumbnail: '⚔️',
    tags: ['sfx', 'combat', 'weapon'],
    folder: 'sfx',
    createdAt: '2024-03-04'
  },
  {
    id: '5',
    name: 'character_model.glb',
    type: 'model',
    size: 10485760,
    url: '/assets/char.glb',
    thumbnail: '🎭',
    tags: ['model', '3d', 'character'],
    folder: 'characters',
    createdAt: '2024-03-05'
  },
];

const typeIcons: Record<string, string> = {
  image: '🖼️',
  audio: '🎵',
  video: '🎬',
  model: '🎭',
  document: '📄',
};

const typeColors: Record<string, string> = {
  image: 'bg-blue-500/20 text-blue-500',
  audio: 'bg-pink-500/20 text-pink-500',
  video: 'bg-red-500/20 text-red-500',
  model: 'bg-purple-500/20 text-purple-500',
  document: 'bg-gray-500/20 text-gray-500',
};

export function AssetLoader() {
  const [assets, setAssets] = useState<Asset[]>(sampleAssets);
  const [folders, setFolders] = useState<AssetFolder[]>(defaultFolders);
  const [currentFolder, setCurrentFolder] = useState('root');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAssets, setSelectedAssets] = useState<Set<string>>(new Set());
  const [isDragging, setIsDragging] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Handle file upload
    acceptedFiles.forEach(file => {
      const newAsset: Asset = {
        id: Date.now().toString() + Math.random(),
        name: file.name,
        type: file.type.startsWith('image/') ? 'image' : 
              file.type.startsWith('audio/') ? 'audio' :
              file.type.startsWith('video/') ? 'video' :
              file.name.endsWith('.glb') || file.name.endsWith('.gltf') ? 'model' : 'document',
        size: file.size,
        url: URL.createObjectURL(file),
        thumbnail: typeIcons['image'],
        tags: [],
        folder: currentFolder,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setAssets(prev => [...prev, newAsset]);
    });
    setShowUploadModal(false);
  }, [currentFolder]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    noClick: true,
    noKeyboard: true
  });

  const filteredAssets = assets.filter(asset => {
    const matchesFolder = currentFolder === 'root' || asset.folder === currentFolder || isChildFolder(asset.folder, currentFolder);
    const matchesSearch = asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         asset.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFolder && matchesSearch;
  });

  function isChildFolder(folderId: string, parentId: string): boolean {
    const folder = folders.find(f => f.id === folderId);
    if (!folder) return false;
    if (folder.parentId === parentId) return true;
    if (folder.parentId) return isChildFolder(folder.parentId, parentId);
    return false;
  }

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const deleteAsset = (id: string) => {
    setAssets(assets.filter(a => a.id !== id));
    setSelectedAssets(prev => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const toggleAssetSelection = (id: string) => {
    setSelectedAssets(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="h-screen flex bg-background">
      {/* Sidebar - Folders */}
      <div className="w-64 border-r border-border bg-card/50 flex flex-col">
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Assets</h2>
            <button 
              onClick={() => setShowUploadModal(true)}
              className="p-2 hover:bg-accent rounded-lg"
            >
              <Upload className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          <div className="space-y-1">
            <{folders.filter(f => f.parentId === 'root' || f.parentId === null).map(folder => (
              <button
                key={folder.id}
                onClick={() => setCurrentFolder(folder.id)}
                className={cn(
                  "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-colors",
                  currentFolder === folder.id
                    ? "bg-primary/10 text-primary"
                    : "hover:bg-accent"
                )}
              >
                <Folder 
                  className="w-4 h-4" 
                  style={{ color: folder.color }}
                />
                <span className="flex-1 truncate">{folder.name}</span>
                <span className="text-xs text-muted-foreground">
                  {assets.filter(a => a.folder === folder.id).length}
                </span>
              </button>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-border">
            <div className="text-xs font-medium text-muted-foreground uppercase mb-2 px-3">Categories</div>
            
            <div className="space-y-1">
              {[
                { type: 'image', label: 'Images', count: assets.filter(a => a.type === 'image').length },
                { type: 'audio', label: 'Audio', count: assets.filter(a => a.type === 'audio').length },
                { type: 'video', label: 'Video', count: assets.filter(a => a.type === 'video').length },
                { type: 'model', label: '3D Models', count: assets.filter(a => a.type === 'model').length },
              ].map(({ type, label, count }) => (
                <button
                  key={type}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left hover:bg-accent transition-colors"
                >
                  <span>{typeIcons[type]}</span>
                  <span className="flex-1">{label}</span>
                  <span className="text-xs text-muted-foreground">{count}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-border">
          <div className="text-xs text-muted-foreground">
            {assets.length} assets • {formatSize(assets.reduce((acc, a) => acc + a.size, 0))}
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
                placeholder="Search assets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 bg-background border border-input rounded-lg w-64"
              />
            </div>

            {selectedAssets.size > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">{selectedAssets.size} selected</span>
                <button 
                  onClick={() => {
                    selectedAssets.forEach(id => deleteAsset(id));
                  }}
                  className="p-2 hover:text-destructive rounded"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={cn(
                "p-2 rounded",
                viewMode === 'grid' ? "bg-primary/20 text-primary" : "hover:bg-accent"
              )}
            >
              <Grid className="w-4 h-4" />
            </button>
            
            <button
              onClick={() => setViewMode('list')}
              className={cn(
                "p-2 rounded",
                viewMode === 'list' ? "bg-primary/20 text-primary" : "hover:bg-accent"
              )}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Asset Grid/List */}
        <div className="flex-1 overflow-y-auto p-4">
          {filteredAssets.length === 0 ? (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <Folder className="w-16 h-16 mx-auto mb-4 opacity-30" />
                <p>No assets found</p>
                <p className="text-sm">Upload files to get started</p>
              </div>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              <{filteredAssets.map(asset => (
                <motion.div
                  key={asset.id}
                  layoutId={asset.id}
                  onClick={() => toggleAssetSelection(asset.id)}
                  className={cn(
                    "group relative p-4 rounded-xl border-2 cursor-pointer transition-all",
                    selectedAssets.has(asset.id)
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/30"
                  )}
                >
                  <div className="aspect-square flex items-center justify-center text-5xl bg-muted rounded-lg mb-3">
                    {asset.thumbnail || typeIcons[asset.type]}
                  </div>
                  
                  <div className="flex items-start justify-between">
                    <div className="min-w-0">
                      <p className="font-medium truncate">{asset.name}</p>
                      <p className="text-xs text-muted-foreground">{formatSize(asset.size)}</p>
                    </div>
                    
                    <span className={cn("text-xs px-2 py-1 rounded", typeColors[asset.type])}>
                      {asset.type}
                    </span>
                  </div>

                  {selectedAssets.has(asset.id) && (
                    <div className="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-primary-foreground" />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              <{filteredAssets.map(asset => (
                <div
                  key={asset.id}
                  onClick={() => toggleAssetSelection(asset.id)}
                  className={cn(
                    "flex items-center gap-4 p-3 rounded-lg border-2 cursor-pointer transition-all",
                    selectedAssets.has(asset.id)
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/30"
                  )}
                >
                  <div className="text-3xl">{asset.thumbnail || typeIcons[asset.type]}</div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{asset.name}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{formatSize(asset.size)}</span>
                      <span>•</span>
                      <span>{asset.createdAt}</span>
                    </div>
                  </div>
                  
                  <span className={cn("text-xs px-2 py-1 rounded", typeColors[asset.type])}>
                    {asset.type}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Upload Modal */}
      <AnimatePresence>
        {showUploadModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="w-full max-w-lg"
            >
              <GlassCard className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold">Upload Assets</h3>
                  <button 
                    onClick={() => setShowUploadModal(false)}
                    className="p-2 hover:bg-accent rounded-full"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div
                  {...getRootProps()}
                  className={cn(
                    "border-2 border-dashed rounded-xl p-12 text-center transition-colors",
                    isDragActive ? "border-primary bg-primary/10" : "border-border hover:border-primary/30"
                  )}
                >
                  <input {...getInputProps()} />
                  
                  <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  
                  <p className="text-lg font-medium mb-2">Drop files here</p>
                  
                  <p className="text-sm text-muted-foreground mb-4">
                    or click to select files
                  </p>
                  
                  <p className="text-xs text-muted-foreground">
                    Supports: Images, Audio, Video, 3D Models (.glb)
                  </p>
                </div>
              </GlassCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
