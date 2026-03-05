import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useStoryStore } from '../stores/storyStore';
import { BabylonViewer } from '../components/BabylonViewer';
import { Plus, Trash2, ChevronLeft, ChevronRight, Camera, Eye, EyeOff } from 'lucide-react';
import { cn } from '../lib/utils';
import { GlassCard } from '../components/GlassCard';

// Asset categories for the 3D model
const assetCategories = [
  { id: 'hair', label: 'Hair', icon: '💇' },
  { id: 'head', label: 'Head', icon: '👤' },
  { id: 'top', label: 'Top', icon: '👕' },
  { id: 'pants', label: 'Pants', icon: '👖' },
  { id: 'shoes', label: 'Shoes', icon: '👟' },
  { id: 'accessories', label: 'Accessories', icon: '💍' },
];

// Color presets
const colorPresets = [
  '#1a1a1a', '#4a3020', '#8b4513', '#d2691e', '#f4a460',
  '#ffe4c4', '#ffdbac', '#f1c27d', '#e0ac69', '#8d5524',
  '#c68642', '#e0ac69', '#ff0000', '#00ff00', '#0000ff',
  '#ffff00', '#ff00ff', '#00ffff', '#800080', '#ffa500'
];

// Camera presets
const cameraPresets = [
  { id: 'face', label: 'Face', position: { alpha: -Math.PI/2, beta: Math.PI/2.2, radius: 1.5 } },
  { id: 'upper', label: 'Upper', position: { alpha: -Math.PI/2, beta: Math.PI/2.5, radius: 2.5 } },
  { id: 'full', label: 'Full', position: { alpha: -Math.PI/2, beta: Math.PI/3, radius: 4 } },
  { id: 'feet', label: 'Feet', position: { alpha: -Math.PI/2, beta: Math.PI/1.8, radius: 2 } },
];

export function CharacterCreatorPage() {
  const { id } = useParams();
  const { currentStory, characters, loadStory, createCharacter, updateCharacter, deleteCharacter } = useStoryStore();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState('hair');
  const [activeCamera, setActiveCamera] = useState('full');
  const [visibleAssets, setVisibleAssets] = useState<Record<string, boolean>>({
    hair: true, head: true, top: true, pants: true, shoes: true, accessories: true
  });
  const [assetColors, setAssetColors] = useState<Record<string, string>>({
    hair: '#1a1a1a', skin: '#ffdbac', top: '#3b82f6', pants: '#1f2937', shoes: '#000000'
  });

  useEffect(() => {
    if (id) loadStory(id);
  }, [id]);

  const selectedChar = characters.find(c => c.id === selectedId);

  const handleCreate = () => {
    const char = createCharacter('New Character');
    setSelectedId(char.id);
  };

  const toggleAsset = (category: string) => {
    setVisibleAssets(prev => ({ ...prev, [category]: !prev[category] }));
  };

  const updateColor = (category: string, color: string) => {
    setAssetColors(prev => ({ ...prev, [category]: color }));
  };

  if (!currentStory) return <div className="p-8">Loading...</div>;

  return (
    <div className="h-screen flex bg-background">
      {/* Character List - Slim Sidebar */}
      <div className="w-64 border-r border-border bg-card/50 backdrop-blur flex flex-col">
        <div className="p-4 border-b border-border">
          <button
            onClick={handleCreate}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-violet-500/25 transition-all"
          >
            <Plus className="w-4 h-4" />
            New Character
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {characters.map((char) => (
            <button
              key={char.id}
              onClick={() => setSelectedId(char.id)}
              className={cn(
                "w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all",
                selectedId === char.id 
                  ? "bg-gradient-to-r from-violet-500/20 to-indigo-500/20 border border-violet-500/30" 
                  : "hover:bg-accent/50"
              )}
            >
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center text-white font-bold">
                {char.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{char.name || 'Unnamed'}</div>
                <div className="text-xs text-muted-foreground">{char.appearance.visibleAssets.length} assets</div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteCharacter(char.id);
                  if (selectedId === char.id) setSelectedId(null);
                }}
                className="p-1.5 hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </button>
          ))}
        </div>
      </div>

      {/* Main 3D Viewport */}
      <div className="flex-1 flex flex-col relative">
        {selectedChar ? (
          <>
            {/* 3D Viewer */}
            <div className="flex-1 relative">
              <BabylonViewer 
                modelUrl="/models/Bibliarch Maybe.glb"
              />
              
              {/* Camera Controls Overlay */}
              <GlassCard className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 p-2">
                <Camera className="w-4 h-4 text-muted-foreground ml-2" />
                {cameraPresets.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => setActiveCamera(preset.id)}
                    className={cn(
                      "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                      activeCamera === preset.id
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-accent"
                    )}
                  >
                    {preset.label}
                  </button>
                ))}
              </GlassCard>

              {/* Height Scale */}
              <GlassCard className="absolute right-6 top-6 p-3">
                <div className="text-xs text-muted-foreground mb-2">Height</div>
                <input
                  type="range"
                  min="0.8"
                  max="1.2"
                  step="0.01"
                  defaultValue="1"
                  className="w-32"
                />
              </GlassCard>
            </div>

            {/* Customization Panel */}
            <div className="h-72 border-t border-border bg-card/50 backdrop-blur flex">
              {/* Asset Categories */}
              <div className="w-48 border-r border-border p-4 overflow-y-auto">
                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
                  Assets
                </div>
                <div className="space-y-1">
                  {assetCategories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all",
                        activeCategory === cat.id
                          ? "bg-primary/10 text-primary"
                          : "hover:bg-accent"
                      )}
                    >
                      <span>{cat.icon}</span>
                      <span className="flex-1 text-left">{cat.label}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleAsset(cat.id);
                        }}
                        className="p-1 hover:bg-accent rounded"
                      >
                        {visibleAssets[cat.id] ? (
                          <Eye className="w-3.5 h-3.5" />
                        ) : (
                          <EyeOff className="w-3.5 h-3.5 text-muted-foreground" />
                        )}
                      </button>
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Palette */}
              <div className="flex-1 p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    {assetCategories.find(c => c.id === activeCategory)?.label} Color
                  </div>
                  <input
                    type="color"
                    value={assetColors[activeCategory] || '#808080'}
                    onChange={(e) => updateColor(activeCategory, e.target.value)}
                    className="w-8 h-8 rounded cursor-pointer"
                  />
                </div>
                
                <div className="grid grid-cols-10 gap-2">
                  {colorPresets.map((color) => (
                    <button
                      key={color}
                      onClick={() => updateColor(activeCategory, color)}
                      className={cn(
                        "w-8 h-8 rounded-lg border-2 transition-all",
                        assetColors[activeCategory] === color
                          ? "border-white scale-110 shadow-lg"
                          : "border-transparent hover:scale-105"
                      )}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>

                {/* Pose Presets */}
                <div className="mt-6">
                  <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
                    Pose
                  </div>
                  <div className="flex gap-2">
                    {['Idle', 'Walk', 'Run', 'Jump', 'Sit', 'Wave'].map((pose) => (
                      <button
                        key={pose}
                        className="px-4 py-2 rounded-lg bg-accent/50 hover:bg-accent text-sm transition-colors"
                      >
                        {pose}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Morph Targets / Face */}
              <div className="w-64 border-l border-border p-4">
                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
                  Face Shape
                </div>
                <div className="space-y-3">
                  {[
                    { label: 'Eye Size', defaultValue: 50 },
                    { label: 'Nose Width', defaultValue: 50 },
                    { label: 'Mouth Width', defaultValue: 50 },
                    { label: 'Face Width', defaultValue: 50 },
                  ].map((slider) => (
                    <div key={slider.label}>
                      <div className="flex justify-between text-xs mb-1">
                        <span>{slider.label}</span>
                        <span className="text-muted-foreground">{slider.defaultValue}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        defaultValue={slider.defaultValue}
                        className="w-full"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-violet-500/20 to-indigo-500/20 flex items-center justify-center">
                <Plus className="w-12 h-12 text-violet-500" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Create a Character</h2>
              <p className="text-muted-foreground max-w-md">
                Design unique characters with our 3D customizer. 
                Adjust appearance, colors, and poses.
              </p>
              <button
                onClick={handleCreate}
                className="mt-6 px-6 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-violet-500/25 transition-all"
              >
                Start Creating
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}