import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Layers, Eye, EyeOff, Settings2, Gauge, Zap,
  ChevronDown, ChevronUp, Info, AlertTriangle
} from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { cn } from '../lib/utils';

interface LODLevel {
  distance: number; // Distance from camera
  detail: 'high' | 'medium' | 'low' | 'ultra-low';
  triangleReduction: number; // Percentage reduction
  textureQuality: number; // 0-1
  shadowQuality: number; // 0-1
}

interface LODSettings {
  enabled: boolean;
  autoAdjust: boolean;
  levels: LODLevel[];
  cullDistance: number;
  fadeTransition: boolean;
  occlusionCulling: boolean;
  frustumCulling: boolean;
}

const defaultLODSettings: LODSettings = {
  enabled: true,
  autoAdjust: true,
  levels: [
    { distance: 0, detail: 'high', triangleReduction: 0, textureQuality: 1, shadowQuality: 1 },
    { distance: 50, detail: 'medium', triangleReduction: 50, textureQuality: 0.75, shadowQuality: 0.75 },
    { distance: 150, detail: 'low', triangleReduction: 75, textureQuality: 0.5, shadowQuality: 0.5 },
    { distance: 300, detail: 'ultra-low', triangleReduction: 90, textureQuality: 0.25, shadowQuality: 0.25 },
  ],
  cullDistance: 500,
  fadeTransition: true,
  occlusionCulling: true,
  frustumCulling: true,
};

interface LODStats {
  totalObjects: number;
  visibleObjects: number;
  culledObjects: number;
  currentLOD: string;
  estimatedFPS: number;
  memoryUsage: number;
}

export function LODSystem() {
  const [settings, setSettings] = useState<LODSettings>(defaultLODSettings);
  const [stats, setStats] = useState<LODStats>({
    totalObjects: 1247,
    visibleObjects: 342,
    culledObjects: 905,
    currentLOD: 'Mixed',
    estimatedFPS: 60,
    memoryUsage: 456,
  });
  const [isExpanded, setIsExpanded] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Simulate LOD stats updates
  useEffect(() => {
    if (!settings.enabled) return;

    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        visibleObjects: Math.floor(prev.totalObjects * (0.2 + Math.random() * 0.1)),
        estimatedFPS: Math.floor(55 + Math.random() * 10),
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, [settings.enabled]);

  const updateLODLevel = (index: number, updates: Partial<LODLevel>) => {
    const newLevels = [...settings.levels];
    newLevels[index] = { ...newLevels[index], ...updates };
    setSettings({ ...settings, levels: newLevels });
  };

  const getPerformanceColor = (fps: number) => {
    if (fps >= 55) return 'text-green-500';
    if (fps >= 30) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <GlassCard className="w-80">
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5" />
            <h3 className="font-semibold">LOD System</h3>
          </div>
          
          <button
            onClick={() => setSettings({ ...settings, enabled: !settings.enabled })}
            className={cn(
              "p-2 rounded-lg transition-colors",
              settings.enabled ? "bg-green-500/20 text-green-500" : "bg-muted text-muted-foreground"
            )}
          >
            {settings.enabled ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </button>
        </div>

        {/* Stats */}
        {settings.enabled && (
          <div className="grid grid-cols-2 gap-2 mb-4">
            <div className="p-2 bg-muted rounded-lg">
              <p className="text-xs text-muted-foreground">Visible</p>
              <p className="font-medium">{stats.visibleObjects} / {stats.totalObjects}</p>
            </div>
            
            <div className="p-2 bg-muted rounded-lg">
              <p className="text-xs text-muted-foreground">Estimated FPS</p>
              <p className={cn("font-medium", getPerformanceColor(stats.estimatedFPS))}>{stats.estimatedFPS}</p>
            </div>
            
            <div className="p-2 bg-muted rounded-lg">
              <p className="text-xs text-muted-foreground">Memory</p>
              <p className="font-medium">{stats.memoryUsage} MB</p>
            </div>
            
            <div className="p-2 bg-muted rounded-lg">
              <p className="text-xs text-muted-foreground">Current LOD</p>
              <p className="font-medium">{stats.currentLOD}</p>
            </div>
          </div>
        )}

        {/* Quick Settings */}
        {settings.enabled && (
          <>
            <div className="space-y-3 mb-4">
              <label className="flex items-center justify-between text-sm">
                <span>Auto-Adjust LOD</span>
                <input
                  type="checkbox"
                  checked={settings.autoAdjust}
                  onChange={(e) => setSettings({ ...settings, autoAdjust: e.target.checked })}
                  className="w-4 h-4"
                />
              </label>

              <label className="flex items-center justify-between text-sm">
                <span>Fade Transitions</span>
                <input
                  type="checkbox"
                  checked={settings.fadeTransition}
                  onChange={(e) => setSettings({ ...settings, fadeTransition: e.target.checked })}
                  className="w-4 h-4"
                />
              </label>

              <label className="flex items-center justify-between text-sm">
                <span>Occlusion Culling</span>
                <input
                  type="checkbox"
                  checked={settings.occlusionCulling}
                  onChange={(e) => setSettings({ ...settings, occlusionCulling: e.target.checked })}
                  className="w-4 h-4"
                />
              </label>

              <div>
                <label className="text-xs text-muted-foreground mb-1 block">
                  Cull Distance: {settings.cullDistance}m
                </label>
                <input
                  type="range"
                  min="100"
                  max="1000"
                  step="50"
                  value={settings.cullDistance}
                  onChange={(e) => setSettings({ ...settings, cullDistance: Number(e.target.value) })}
                  className="w-full"
                />
              </div>
            </div>

            {/* Advanced Settings */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full flex items-center justify-between p-2 bg-muted rounded-lg text-sm"
>
              <span>LOD Levels</span>
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                className="mt-3 space-y-3"
              >
                {settings.levels.map((level, index) => (
                  <div key={index} className="p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium capitalize">{level.detail}</span>
                      <span className="text-xs text-muted-foreground">{level.distance}m</span>
                    </div>
                    
                    <div className="space-y-2">
                      <div>
                        <label className="text-xs text-muted-foreground">Triangle Reduction</label>
                        <input
                          type="range"
                          min="0"
                          max="95"
                          step="5"
                          value={level.triangleReduction}
                          onChange={(e) => updateLODLevel(index, { triangleReduction: Number(e.target.value) })}
                          className="w-full"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-xs text-muted-foreground">Texture</label>
                          <input
                            type="range"
                            min="0.25"
                            max="1"
                            step="0.25"
                            value={level.textureQuality}
                            onChange={(e) => updateLODLevel(index, { textureQuality: Number(e.target.value) })}
                            className="w-full"
                          />
                        </div>
                        
                        <div>
                          <label className="text-xs text-muted-foreground">Shadows</label>
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.25"
                            value={level.shadowQuality}
                            onChange={(e) => updateLODLevel(index, { shadowQuality: Number(e.target.value) })}
                            className="w-full"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {/* Performance Tips */}
            <div className="mt-4 p-3 bg-blue-500/10 rounded-lg">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-blue-500 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-blue-600">Performance Tip</p>
                  <p className="text-blue-600/80">Lowering cull distance and enabling occlusion culling can improve FPS by 20-40%</p>
                </div>
              </div>
            </div>
          </>
        )}

        {!settings.enabled && (
          <div className="p-4 text-center text-muted-foreground">
            <AlertTriangle className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>LOD is disabled</p>
            <p className="text-sm">Enable for better performance in large worlds</p>
          </div>
        )}
      </div>
    </GlassCard>
  );
}
