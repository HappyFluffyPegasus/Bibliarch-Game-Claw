import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  CloudRain, Snowflake, Flame, Sparkles, Leaf, Wind,
  Volume2, VolumeX, Play, Pause
} from 'lucide-react';
import { useParticleSystem, particlePresets } from '../effects/ParticleSystem';
import { cn } from '../lib/utils';

const effectTypes = [
  { id: 'rain', name: 'Rain', icon: CloudRain, preset: particlePresets.rain },
  { id: 'snow', name: 'Snow', icon: Snowflake, preset: particlePresets.snow },
  { id: 'fire', name: 'Fire', icon: Flame, preset: particlePresets.fire },
  { id: 'magic', name: 'Magic', icon: Sparkles, preset: particlePresets.magic },
  { id: 'leaves', name: 'Falling Leaves', icon: Leaf, preset: particlePresets.leaves },
  { id: 'dust', name: 'Dust Motes', icon: Wind, preset: particlePresets.dust },
];

export function EffectsShowcasePage() {
  const [activeEffect, setActiveEffect] = useState('rain');
  const [intensity, setIntensity] = useState(100);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const currentPreset = effectTypes.find(e => e.id === activeEffect)?.preset || particlePresets.rain;
  
  useParticleSystem(canvasRef, {
    ...currentPreset,
    count: Math.floor(currentPreset.count * (intensity / 100))
  });

  return (
    <div className="h-screen flex flex-col bg-background">
      <div className="flex items-center justify-between px-6 py-4 border-b border-border">
        <div>
          <h1 className="text-2xl font-bold">Visual Effects</h1>
          <p className="text-muted-foreground">Particle systems for weather, magic, and atmosphere</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Intensity:</span>
            <input
              type="range"
              min="10"
              max="200"
              value={intensity}
              onChange={(e) => setIntensity(Number(e.target.value))}
              className="w-32"
            />
            <span className="text-sm w-10">{intensity}%</span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex">
        <div className="w-64 border-r border-border bg-card/50 p-4">
          <h3 className="font-semibold mb-4">Effect Types</h3>
          
          <div className="space-y-2">
            {effectTypes.map(effect => {
              const Icon = effect.icon;
              return (
                <button
                  key={effect.id}
                  onClick={() => setActiveEffect(effect.id)}
                  className={cn(
                    "w-full flex items-center gap-3 p-3 rounded-lg border-2 transition-all text-left",
                    activeEffect === effect.id
                      ? "border-primary bg-primary/10"
                      : "border-transparent hover:border-border"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span>{effect.name}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-8 p-4 bg-muted rounded-lg">
            <h4 className="font-medium mb-2">Usage</h4>
            <pre className="text-xs text-muted-foreground overflow-x-auto">
              {`import { useParticleSystem } 
  from './effects/ParticleSystem';

const canvasRef = useRef(null);
useParticleSystem(canvasRef, {
  type: 'rain',
  count: 200
});`}
            </pre>
          </div>
        </div>

        <div className="flex-1 relative bg-gradient-to-b from-slate-900 to-slate-800">
          <canvas
            ref={canvasRef}
            width={1024}
            height={768}
            className="absolute inset-0 w-full h-full"
          />
          
          <div className="absolute bottom-4 left-4 text-white/50 text-sm">
            {effectTypes.find(e => e.id === activeEffect)?.name} Effect • {Math.floor(currentPreset.count * (intensity / 100))} particles
          </div>
        </div>
      </div>
    </div>
  );
}
