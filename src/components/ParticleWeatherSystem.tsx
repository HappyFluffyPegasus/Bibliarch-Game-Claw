import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Cloud, CloudRain, CloudSnow, Sun, Wind, Zap,
  Sparkles, Flame, Droplets, Snowflake, X
} from 'lucide-react';
import { GlassCard } from './GlassCard';
import { cn } from '../lib/utils';

type WeatherType = 'clear' | 'rain' | 'snow' | 'storm' | 'fog' | 'wind' | 'magic' | 'fire';

interface ParticleConfig {
  count: number;
  speed: number;
  size: number;
  opacity: number;
  color: string;
}

const weatherConfigs: Record<WeatherType, ParticleConfig> = {
  clear: { count: 0, speed: 0, size: 0, opacity: 0, color: '' },
  rain: { count: 200, speed: 15, size: 2, opacity: 0.6, color: '#60a5fa' },
  snow: { count: 150, speed: 2, size: 4, opacity: 0.8, color: '#f8fafc' },
  storm: { count: 300, speed: 20, size: 3, opacity: 0.7, color: '#94a3b8' },
  fog: { count: 50, speed: 0.5, size: 100, opacity: 0.3, color: '#cbd5e1' },
  wind: { count: 100, speed: 8, size: 2, opacity: 0.4, color: '#e2e8f0' },
  magic: { count: 80, speed: 3, size: 6, opacity: 0.9, color: '#c084fc' },
  fire: { count: 120, speed: 4, size: 5, opacity: 0.8, color: '#f97316' },
};

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  life: number;
  maxLife: number;
}

export function ParticleWeatherSystem({ 
  activeWeather = 'clear',
  intensity = 1,
  onWeatherChange
}: { 
  activeWeather?: WeatherType;
  intensity?: number;
  onWeatherChange?: (weather: WeatherType) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const config = weatherConfigs[activeWeather];
    
    // Initialize particles
    const initParticles = () => {
      particlesRef.current = [];
      for (let i = 0; i < config.count * intensity; i++) {
        particlesRef.current.push(createParticle(config));
      }
    };

    const createParticle = (cfg: ParticleConfig): Particle => {
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * cfg.speed,
        vy: cfg.speed * (0.5 + Math.random() * 0.5),
        size: cfg.size * (0.5 + Math.random()),
        opacity: cfg.opacity * (0.5 + Math.random() * 0.5),
        life: 0,
        maxLife: 100 + Math.random() * 100,
      };
    };

    initParticles();

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((particle, index) => {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life++;

        // Reset particle if out of bounds or dead
        if (particle.y > canvas.height || particle.life > particle.maxLife) {
          if (activeWeather === 'rain' || activeWeather === 'storm') {
            particle.y = -particle.size;
            particle.x = Math.random() * canvas.width;
          } else if (activeWeather === 'snow') {
            particle.y = -particle.size;
            particle.x = Math.random() * canvas.width;
            particle.vx = (Math.random() - 0.5) * 2; // Drift
          } else if (activeWeather === 'magic' || activeWeather === 'fire') {
            particle.y = canvas.height + particle.size;
            particle.x = Math.random() * canvas.width;
            particle.vy = -Math.abs(particle.vy); // Rise up
          } else {
            particle.x = Math.random() * canvas.width;
            particle.y = Math.random() * canvas.height;
          }
          particle.life = 0;
        }

        // Draw particle
        ctx.beginPath();
        ctx.fillStyle = config.color;
        ctx.globalAlpha = particle.opacity * (1 - particle.life / particle.maxLife);
        
        if (activeWeather === 'rain' || activeWeather === 'storm') {
          // Draw rain streak
          ctx.strokeStyle = config.color;
          ctx.lineWidth = particle.size / 2;
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(particle.x - particle.vx * 2, particle.y - particle.vy * 2);
          ctx.stroke();
        } else {
          // Draw circle
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      ctx.globalAlpha = 1;
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [activeWeather, intensity]);

  const weatherOptions: { type: WeatherType; icon: any; label: string }[] = [
    { type: 'clear', icon: Sun, label: 'Clear' },
    { type: 'rain', icon: CloudRain, label: 'Rain' },
    { type: 'snow', icon: CloudSnow, label: 'Snow' },
    { type: 'storm', icon: Zap, label: 'Storm' },
    { type: 'fog', icon: Cloud, label: 'Fog' },
    { type: 'wind', icon: Wind, label: 'Wind' },
    { type: 'magic', icon: Sparkles, label: 'Magic' },
    { type: 'fire', icon: Flame, label: 'Fire' },
  ];

  return (
    <>
      {/* Weather Canvas Overlay */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-40"
        style={{ width: '100%', height: '100%' }}
      />

      {/* Weather Control Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-50 w-12 h-12 bg-primary text-primary-foreground rounded-full shadow-lg hover:scale-110 transition-transform flex items-center justify-center"
      >
        {activeWeather === 'clear' && <Sun className="w-5 h-5" />}
        {activeWeather === 'rain' && <CloudRain className="w-5 h-5" />}
        {activeWeather === 'snow' && <CloudSnow className="w-5 h-5" />}
        {activeWeather === 'storm' && <Zap className="w-5 h-5" />}
        {activeWeather === 'fog' && <Cloud className="w-5 h-5" />}
        {activeWeather === 'wind' && <Wind className="w-5 h-5" />}
        {activeWeather === 'magic' && <Sparkles className="w-5 h-5" />}
        {activeWeather === 'fire' && <Flame className="w-5 h-5" />}
      </button>

      {/* Weather Selector Modal */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setIsOpen(false)}
        >
          <GlassCard 
            className="w-full max-w-md p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold">Weather Effects</h3>
                <p className="text-sm text-muted-foreground">Set the atmosphere for your scene</p>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-accent rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-4 gap-3">
              {weatherOptions.map(({ type, icon: Icon, label }) => (
                <button
                  key={type}
                  onClick={() => {
                    onWeatherChange?.(type);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all",
                    activeWeather === type
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/30"
                  )}
                >
                  <Icon className={cn(
                    "w-8 h-8",
                    activeWeather === type && "text-primary"
                  )} />
                  <span className="text-sm">{label}</span>
                </button>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-border">
              <label className="text-sm font-medium mb-2 block">Intensity</label>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={intensity}
                onChange={(e) => {}}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>Light</span>
                <span>Heavy</span>
              </div>
            </div>
          </GlassCard>
        </div>
      )}
    </>
  );
}
