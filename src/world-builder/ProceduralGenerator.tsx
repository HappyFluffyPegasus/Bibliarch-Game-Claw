import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  Wand2, RefreshCw, Settings2, Mountain, Trees, Waves,
  Dice5, Save, X, Check, ChevronDown, ChevronUp
} from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { cn } from '../lib/utils';

// Simple Perlin-like noise implementation
function noise(x: number, y: number): number {
  const n = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
  return n - Math.floor(n);
}

function smoothNoise(x: number, y: number): number {
  const corners = (noise(x - 1, y - 1) + noise(x + 1, y - 1) + noise(x - 1, y + 1) + noise(x + 1, y + 1)) / 16;
  const sides = (noise(x - 1, y) + noise(x + 1, y) + noise(x, y - 1) + noise(x, y + 1)) / 8;
  const center = noise(x, y) / 4;
  return corners + sides + center;
}

function interpolatedNoise(x: number, y: number): number {
  const integerX = Math.floor(x);
  const fractionalX = x - integerX;
  const integerY = Math.floor(y);
  const fractionalY = y - integerY;

  const v1 = smoothNoise(integerX, integerY);
  const v2 = smoothNoise(integerX + 1, integerY);
  const v3 = smoothNoise(integerX, integerY + 1);
  const v4 = smoothNoise(integerX + 1, integerY + 1);

  const i1 = v1 * (1 - fractionalX) + v2 * fractionalX;
  const i2 = v3 * (1 - fractionalX) + v4 * fractionalX;

  return i1 * (1 - fractionalY) + i2 * fractionalY;
}

function perlinNoise(x: number, y: number, octaves: number, persistence: number): number {
  let total = 0;
  let frequency = 1;
  let amplitude = 1;
  let maxValue = 0;

  for (let i = 0; i < octaves; i++) {
    total += interpolatedNoise(x * frequency, y * frequency) * amplitude;
    maxValue += amplitude;
    amplitude *= persistence;
    frequency *= 2;
  }

  return total / maxValue;
}

interface GenerationConfig {
  seed: number;
  terrainType: 'island' | 'mountains' | 'plains' | 'mixed';
  heightScale: number;
  waterLevel: number;
  treeDensity: number;
  roughness: number;
  octaves: number;
}

const presets: Record<string, GenerationConfig> = {
  island: {
    seed: Math.random() * 10000,
    terrainType: 'island',
    heightScale: 10,
    waterLevel: 0.3,
    treeDensity: 0.5,
    roughness: 0.5,
    octaves: 4,
  },
  mountains: {
    seed: Math.random() * 10000,
    terrainType: 'mountains',
    heightScale: 15,
    waterLevel: 0.2,
    treeDensity: 0.3,
    roughness: 0.7,
    octaves: 6,
  },
  plains: {
    seed: Math.random() * 10000,
    terrainType: 'plains',
    heightScale: 5,
    waterLevel: 0.1,
    treeDensity: 0.7,
    roughness: 0.3,
    octaves: 3,
  },
  mixed: {
    seed: Math.random() * 10000,
    terrainType: 'mixed',
    heightScale: 12,
    waterLevel: 0.25,
    treeDensity: 0.5,
    roughness: 0.6,
    octaves: 5,
  },
};

export function ProceduralGenerator() {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState<GenerationConfig>(presets.mixed);
  const [preview, setPreview] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generatePreview = useCallback(() => {
    setIsGenerating(true);
    
    // Generate heightmap using Perlin noise
    const size = 64;
    const heights: number[][] = [];
    
    for (let y = 0; y < size; y++) {
      const row: number[] = [];
      for (let x = 0; x < size; x++) {
        // Normalize coordinates
        const nx = (x / size) * 4 + config.seed;
        const ny = (y / size) * 4 + config.seed;
        
        let height = perlinNoise(nx, ny, config.octaves, 0.5);
        
        // Apply terrain type modifiers
        if (config.terrainType === 'island') {
          // Distance from center for island shape
          const dx = x - size / 2;
          const dy = y - size / 2;
          const dist = Math.sqrt(dx * dx + dy * dy) / (size / 2);
          height *= Math.max(0, 1 - dist * dist);
        } else if (config.terrainType === 'mountains') {
          // Sharpen peaks
          height = Math.pow(height, 0.7);
        } else if (config.terrainType === 'plains') {
          // Flatten
          height = height * 0.3 + 0.35;
        }
        
        height *= config.heightScale;
        row.push(height);
      }
      heights.push(row);
    }

    // Generate preview image
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const imageData = ctx.createImageData(size, size);
    
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const height = heights[y][x];
        const normalized = Math.min(1, Math.max(0, height / config.heightScale));
        
        // Color based on height and water level
        let r, g, b;
        if (normalized < config.waterLevel) {
          // Water
          r = 50; g = 100; b = 200;
        } else if (normalized < config.waterLevel + 0.1) {
          // Sand
          r = 220; g = 200; b = 150;
        } else if (normalized < 0.7) {
          // Grass
          r = 50; g = 150 + normalized * 50; b = 50;
        } else {
          // Rock/Snow
          r = 150 + normalized * 105; g = 150 + normalized * 105; b = 150 + normalized * 105;
        }
        
        const idx = (y * size + x) * 4;
        imageData.data[idx] = r;
        imageData.data[idx + 1] = g;
        imageData.data[idx + 2] = b;
        imageData.data[idx + 3] = 255;
      }
    }
    
    ctx.putImageData(imageData, 0, 0);
    setPreview(canvas.toDataURL());
    setIsGenerating(false);
  }, [config]);

  const applyGeneration = () => {
    if (!preview) return;
    
    // Generate actual terrain data
    const size = 32; // Match your terrain editor grid
    const heights: number[][] = [];
    
    for (let y = 0; y < size; y++) {
      const row: number[] = [];
      for (let x = 0; x < size; x++) {
        const nx = (x / size) * 4 + config.seed;
        const ny = (y / size) * 4 + config.seed;
        
        let height = perlinNoise(nx, ny, config.octaves, 0.5);
        
        if (config.terrainType === 'island') {
          const dx = x - size / 2;
          const dy = y - size / 2;
          const dist = Math.sqrt(dx * dx + dy * dy) / (size / 2);
          height *= Math.max(0, 1 - dist * dist);
        } else if (config.terrainType === 'mountains') {
          height = Math.pow(height, 0.7);
        } else if (config.terrainType === 'plains') {
          height = height * 0.3 + 0.35;
        }
        
        row.push(height * config.heightScale);
      }
      heights.push(row);
    }

    window.dispatchEvent(new CustomEvent('terrain-generated', { 
      detail: { 
        heights,
        config,
      } 
    }));

    setIsOpen(false);
  };

  const randomizeSeed = () => {
    setConfig({...config, seed: Math.random() * 10000});
  };

  return (
    <>
      <button
        onClick={() => {
          setIsOpen(true);
          generatePreview();
        }}
        className="flex items-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-xl transition-colors"
      >
        <Wand2 className="w-4 h-4" />
        Generate Terrain
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <GlassCard className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Wand2 className="w-5 h-5" />
                  Procedural Terrain Generator
                </h2>
                
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-accent rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-6">
                {/* Preview */}
                <div>
                  <h3 className="font-medium mb-3">Preview</h3>
                  
                  <div className="aspect-square bg-muted rounded-xl overflow-hidden">
                    {preview ? (
                      <img 
                        src={preview} 
                        alt="Generated terrain preview"
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        Generating...
                      </div>
                    )}
                  </div>

                  <button
                    onClick={generatePreview}
                    disabled={isGenerating}
                    className="w-full mt-3 flex items-center justify-center gap-2 py-2 bg-muted hover:bg-accent rounded-lg disabled:opacity-50"
>
                    <RefreshCw className={cn("w-4 h-4", isGenerating && "animate-spin")} />
                    Regenerate
                  </button>
                </div>

                {/* Settings */}
                <div className="space-y-4">
                  <h3 className="font-medium">Settings</h3>

                  {/* Terrain Type */}
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">Terrain Type</label>
                    <div className="grid grid-cols-2 gap-2">
                      {(Object.keys(presets) as Array<keyof typeof presets>).map(type => (
                        <button
                          key={type}
                          onClick={() => setConfig(presets[type])}
                          className={cn(
                            "p-2 rounded-lg border-2 text-left capitalize transition-all",
                            config.terrainType === type
                              ? "border-primary bg-primary/10"
                              : "border-transparent bg-muted hover:border-primary/30"
                          )}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Seed */}
                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <label className="text-sm text-muted-foreground">Seed</label>
                      <input
                        type="number"
                        value={Math.floor(config.seed)}
                        onChange={(e) => setConfig({...config, seed: Number(e.target.value)})}
                        className="w-full px-3 py-2 bg-background border border-input rounded-lg"
                      />
                    </div>
                    
                    <button
                      onClick={randomizeSeed}
                      className="p-2 mt-5 bg-muted hover:bg-accent rounded-lg"
                    >
                      <Dice5 className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Sliders */}
                  <div>
                    <label className="text-sm text-muted-foreground">Height Scale</label>
                    <input
                      type="range"
                      min="5"
                      max="20"
                      step="1"
                      value={config.heightScale}
                      onChange={(e) => setConfig({...config, heightScale: Number(e.target.value)})}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-muted-foreground">Water Level</label>
                    <input
                      type="range"
                      min="0"
                      max="0.5"
                      step="0.05"
                      value={config.waterLevel}
                      onChange={(e) => setConfig({...config, waterLevel: Number(e.target.value)})}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-muted-foreground">Roughness</label>
                    <input
                      type="range"
                      min="0.1"
                      max="1"
                      step="0.1"
                      value={config.roughness}
                      onChange={(e) => setConfig({...config, roughness: Number(e.target.value)})}
                      className="w-full"
                    />
                  </div>

                  <div className="pt-4 border-t border-border flex gap-2">
                    <button
                      onClick={() => setIsOpen(false)}
                      className="flex-1 py-2 border border-border rounded-lg hover:bg-accent"
                    >
                      Cancel
                    </button>
                    
                    <button
                      onClick={applyGeneration}
                      className="flex-1 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
>
                      Apply to World
                    </button>
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      )}
    </>
  );
}
