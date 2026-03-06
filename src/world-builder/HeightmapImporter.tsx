import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, Download, Image as ImageIcon, Settings2, 
  FileUp, FileDown, Info, Check, X, Layers,
  Mountain, Grid3X3, Maximize2, Minimize2
} from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { cn } from '../lib/utils';

interface HeightmapConfig {
  minHeight: number;
  maxHeight: number;
  scale: number;
  offset: number;
  invert: boolean;
  smoothing: number;
}

const defaultConfig: HeightmapConfig = {
  minHeight: 0,
  maxHeight: 10,
  scale: 1,
  offset: 0,
  invert: false,
  smoothing: 0,
};

export function HeightmapImporter() {
  const [isOpen, setIsOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [heightmapData, setHeightmapData] = useState<number[][] | null>(null);
  const [config, setConfig] = useState<HeightmapConfig>(defaultConfig);
  const [isProcessing, setIsProcessing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const processImage = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        setPreviewImage(e.target?.result as string);
        
        // Process to heightmap
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Resize to manageable grid (64x64 max)
        const size = 64;
        canvas.width = size;
        canvas.height = size;
        ctx.drawImage(img, 0, 0, size, size);

        const imageData = ctx.getImageData(0, 0, size, size);
        const data = imageData.data;

        // Convert to grayscale heightmap
        const heights: number[][] = [];
        for (let y = 0; y < size; y++) {
          const row: number[] = [];
          for (let x = 0; x < size; x++) {
            const idx = (y * size + x) * 4;
            // Average RGB for grayscale
            const gray = (data[idx] + data[idx + 1] + data[idx + 2]) / 3;
            row.push(gray);
          }
          heights.push(row);
        }

        setHeightmapData(heights);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }, []);

  const applyHeightmap = () => {
    if (!heightmapData) return;
    
    setIsProcessing(true);
    
    // Process with config
    const processed = heightmapData.map(row => 
      row.map(val => {
        let height = val / 255; // Normalize 0-1
        
        if (config.invert) height = 1 - height;
        
        height = height * config.scale + config.offset;
        height = Math.max(0, Math.min(1, height)); // Clamp
        
        return height * (config.maxHeight - config.minHeight) + config.minHeight;
      })
    );

    // Emit event for parent component
    window.dispatchEvent(new CustomEvent('heightmap-imported', { 
      detail: { heights: processed } 
    }));

    setTimeout(() => {
      setIsProcessing(false);
      setIsOpen(false);
    }, 500);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-muted hover:bg-accent rounded-xl transition-colors"
      >
        <Upload className="w-4 h-4" />
        Import Heightmap
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            >
              <GlassCard className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <ImageIcon className="w-5 h-5" />
                    Heightmap Importer
                  </h2>
                  
                  <button 
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-accent rounded-lg"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {!previewImage ? (
                  <div className="border-2 border-dashed border-border rounded-xl p-12 text-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => e.target.files?.[0] && processImage(e.target.files[0])}
                      className="hidden"
                      id="heightmap-upload"
                    />
                    <label 
                      htmlFor="heightmap-upload"
                      className="cursor-pointer flex flex-col items-center"
                    >
                      <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-4">
                        <Upload className="w-8 h-8 text-muted-foreground" />
                      </div>
                      
                      <p className="text-lg font-medium mb-2">Drop heightmap image here</p>
                      <p className="text-sm text-muted-foreground">Grayscale PNG/JPG - white=high, black=low</p>
                      <p className="text-xs text-muted-foreground mt-2">Works with WorldMachine, Gaea, Unity exports</p>
                    </label>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-6">
                    {/* Preview */}
                    <div>
                      <h3 className="font-medium mb-3">Preview</h3>
                      
                      <div className="aspect-square bg-muted rounded-xl overflow-hidden">
                        <img 
                          src={previewImage} 
                          alt="Heightmap preview"
                          className="w-full h-full object-contain"
                        />
                      </div>
                      
                      <button
                        onClick={() => {
                          setPreviewImage(null);
                          setHeightmapData(null);
                        }}
                        className="mt-3 text-sm text-destructive hover:underline"
                      >
                        Choose different image
                      </button>
                    </div>

                    {/* Settings */}
                    <div className="space-y-4">
                      <h3 className="font-medium">Import Settings</h3>
                      
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm text-muted-foreground mb-1 block">Min Height</label>
                          <input
                            type="range"
                            min="0"
                            max="5"
                            step="0.5"
                            value={config.minHeight}
                            onChange={(e) => setConfig({...config, minHeight: Number(e.target.value)})}
                            className="w-full"
                          />
                          <span className="text-xs">{config.minHeight}</span>
                        </div>

                        <div>
                          <label className="text-sm text-muted-foreground mb-1 block">Max Height</label>
                          <input
                            type="range"
                            min="5"
                            max="20"
                            step="1"
                            value={config.maxHeight}
                            onChange={(e) => setConfig({...config, maxHeight: Number(e.target.value)})}
                            className="w-full"
                          />
                          <span className="text-xs">{config.maxHeight}</span>
                        </div>

                        <div>
                          <label className="text-sm text-muted-foreground mb-1 block">Scale Multiplier</label>
                          <input
                            type="range"
                            min="0.5"
                            max="2"
                            step="0.1"
                            value={config.scale}
                            onChange={(e) => setConfig({...config, scale: Number(e.target.value)})}
                            className="w-full"
                          />
                          <span className="text-xs">{config.scale}x</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id="invert"
                            checked={config.invert}
                            onChange={(e) => setConfig({...config, invert: e.target.checked})}
                          />
                          <label htmlFor="invert" className="text-sm">Invert (black = high)</label>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-border">
                        <div className="flex gap-2">
                          <button
                            onClick={() => setIsOpen(false)}
                            className="flex-1 py-2 border border-border rounded-lg hover:bg-accent"
                          >
                            Cancel
                          </button>
                          
                          <button
                            onClick={applyHeightmap}
                            disabled={isProcessing}
                            className="flex-1 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50"
>
                            {isProcessing ? 'Importing...' : 'Apply to Terrain'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </GlassCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
