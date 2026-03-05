import { useState } from 'react';
import { Palette, Plus, Trash2, RefreshCw, Check } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { cn } from '../lib/utils';

interface ColorPalette {
  id: string;
  name: string;
  colors: Array<{
    name: string;
    hex: string;
    usage: 'primary' | 'secondary' | 'accent' | 'background' | 'text';
  }>;
  isDefault?: boolean;
}

const defaultPalettes: ColorPalette[] = [
  {
    id: 'ocean',
    name: 'Ocean Dreams',
    colors: [
      { name: 'Deep Blue', hex: '#1e3a5f', usage: 'primary' },
      { name: 'Sea Foam', hex: '#4ecdc4', usage: 'secondary' },
      { name: 'Coral', hex: '#ff6b6b', usage: 'accent' },
      { name: 'Sandy', hex: '#f7f1e3', usage: 'background' },
      { name: 'Midnight', hex: '#2c3e50', usage: 'text' },
    ]
  },
  {
    id: 'sunset',
    name: 'Sunset Boulevard',
    colors: [
      { name: 'Warm Orange', hex: '#e85d04', usage: 'primary' },
      { name: 'Golden', hex: '#f4a261', usage: 'secondary' },
      { name: 'Pink', hex: '#e76f51', usage: 'accent' },
      { name: 'Cream', hex: '#fefae0', usage: 'background' },
      { name: 'Dark', hex: '#3d1f00', usage: 'text' },
    ]
  },
  {
    id: 'forest',
    name: 'Mystic Forest',
    colors: [
      { name: 'Pine', hex: '#2d6a4f', usage: 'primary' },
      { name: 'Sage', hex: '#74c69d', usage: 'secondary' },
      { name: 'Moss', hex: '#95d5b2', usage: 'accent' },
      { name: 'Mist', hex: '#d8f3dc', usage: 'background' },
      { name: 'Earth', hex: '#1b4332', usage: 'text' },
    ]
  },
  {
    id: 'neon',
    name: 'Cyberpunk Neon',
    colors: [
      { name: 'Electric', hex: '#ff00ff', usage: 'primary' },
      { name: 'Cyan', hex: '#00ffff', usage: 'secondary' },
      { name: 'Lime', hex: '#39ff14', usage: 'accent' },
      { name: 'Void', hex: '#0a0a0a', usage: 'background' },
      { name: 'White', hex: '#ffffff', usage: 'text' },
    ]
  },
  {
    id: 'royal',
    name: 'Royal Decree',
    colors: [
      { name: 'Purple', hex: '#7209b7', usage: 'primary' },
      { name: 'Gold', hex: '#ffd700', usage: 'secondary' },
      { name: 'Ruby', hex: '#e63946', usage: 'accent' },
      { name: 'Ivory', hex: '#f8f9fa', usage: 'background' },
      { name: 'Onyx', hex: '#212529', usage: 'text' },
    ]
  }
];

interface ColorPalettePickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (palette: ColorPalette) => void;
  currentPaletteId?: string;
}

export function ColorPalettePicker({ isOpen, onClose, onSelect, currentPaletteId }: ColorPalettePickerProps) {
  const [palettes, setPalettes] = useState(defaultPalettes);
  const [selectedPalette, setSelectedPalette] = useState(currentPaletteId || 'ocean');
  const [isCreating, setIsCreating] = useState(false);
  const [newPaletteName, setNewPaletteName] = useState('');

  if (!isOpen) return null;

  const handleSelect = (paletteId: string) => {
    setSelectedPalette(paletteId);
    const palette = palettes.find(p => p.id === paletteId);
    if (palette) {
      onSelect(palette);
    }
  };

  const generateRandomPalette = () => {
    const randomColor = () => '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
    
    const newPalette: ColorPalette = {
      id: Date.now().toString(),
      name: newPaletteName || `Custom ${palettes.length + 1}`,
      colors: [
        { name: 'Primary', hex: randomColor(), usage: 'primary' },
        { name: 'Secondary', hex: randomColor(), usage: 'secondary' },
        { name: 'Accent', hex: randomColor(), usage: 'accent' },
        { name: 'Background', hex: randomColor(), usage: 'background' },
        { name: 'Text', hex: randomColor(), usage: 'text' },
      ]
    };
    
    setPalettes([...palettes, newPalette]);
    setIsCreating(false);
    setNewPaletteName('');
    handleSelect(newPalette.id);
  };

  const deletePalette = (id: string) => {
    setPalettes(palettes.filter(p => p.id !== id));
    if (selectedPalette === id) {
      handleSelect('ocean');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <GlassCard className="w-full max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <Palette className="w-6 h-6 text-violet-500" />
            <div>
              <h2 className="text-xl font-bold">Color Palette</h2>
              <p className="text-sm text-muted-foreground">Choose a color theme for your story</p>
            </div>
          </div>
          
          <button onClick={onClose} className="p-2 hover:bg-accent rounded-full">✕</button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          <div className="grid gap-4">
            {palettes.map((palette) => {
              const isSelected = selectedPalette === palette.id;
              
              return (
                <button
                  key={palette.id}
                  onClick={() => handleSelect(palette.id)}
                  className={cn(
                    "relative text-left p-4 rounded-xl border-2 transition-all",
                    isSelected 
                      ? "border-primary bg-primary/5" 
                      : "border-border hover:border-primary/30"
                  )}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold">{palette.name}</h3>
                    <div className="flex items-center gap-2">
                      {isSelected && (
                        <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                          <Check className="w-4 h-4 text-primary-foreground" />
                        </div>
                      )}
                      
                      {!palette.isDefault && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deletePalette(palette.id);
                          }}
                          className="p-1.5 hover:text-destructive rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                  
                  {/* Color swatches */}
                  <div className="flex gap-2">
                    {palette.colors.map((color, i) => (
                      <div key={i} className="flex-1">
                        <div 
                          className="h-12 rounded-lg mb-1"
                          style={{ backgroundColor: color.hex }}
                        />
                        <div className="text-[10px] text-muted-foreground text-center truncate">
                          {color.name}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-3 flex gap-2 text-xs">
                    {palette.colors.map((color, i) => (
                      <span 
                        key={i}
                        className="px-2 py-1 bg-muted rounded capitalize"
                      >
                        {color.usage}
                      </span>
                    ))}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Create new */}
          <{isCreating ? (
            <GlassCard className="mt-4 p-4">
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={newPaletteName}
                  onChange={(e) => setNewPaletteName(e.target.value)}
                  placeholder="Palette name"
                  className="flex-1 px-3 py-2 bg-background border border-input rounded-lg"
                  autoFocus
                />
                <button
                  onClick={generateRandomPalette}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Generate
                </button>
                <button
                  onClick={() => setIsCreating(false)}
                  className="px-4 py-2 bg-accent rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </GlassCard>
          ) : (
            <button
              onClick={() => setIsCreating(true)}
              className="mt-4 w-full py-3 border-2 border-dashed border-border rounded-xl hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Create Custom Palette
            </button>
          )}
        </div>
      </GlassCard>
    </div>
  );
}
