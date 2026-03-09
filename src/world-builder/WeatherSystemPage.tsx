import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sun, Cloud, CloudRain, CloudSnow, Wind, Zap, CloudFog,
  Thermometer, Droplets, Eye, Navigation, Calendar,
  Plus, Trash2, Edit3, Copy, Play, Pause, Settings
} from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { cn } from '../lib/utils';

type WeatherType = 'clear' | 'cloudy' | 'rain' | 'storm' | 'snow' | 'fog' | 'windy';
type Season = 'spring' | 'summer' | 'autumn' | 'winter';

interface WeatherPreset {
  id: string;
  name: string;
  type: WeatherType;
  temperature: number; // Celsius
  humidity: number; // 0-100%
  windSpeed: number; // km/h
  visibility: number; // 0-100%
  effects: string[];
  icon: string;
  color: string;
}

interface WeatherSchedule {
  id: string;
  locationId: string;
  locationName: string;
  season: Season;
  weatherPattern: {
    hour: number;
    weatherId: string;
  }[];
  transitionDuration: number; // minutes
}

const weatherPresets: WeatherPreset[] = [
  {
    id: 'sunny',
    name: 'Sunny',
    type: 'clear',
    temperature: 25,
    humidity: 40,
    windSpeed: 10,
    visibility: 100,
    effects: ['improved_mood', 'crop_growth', 'clear_vision'],
    icon: '☀️',
    color: '#f59e0b',
  },
  {
    id: 'cloudy',
    name: 'Cloudy',
    type: 'cloudy',
    temperature: 20,
    humidity: 60,
    windSpeed: 15,
    visibility: 80,
    effects: ['reduced_light', 'temperature_drop'],
    icon: '☁️',
    color: '#6b7280',
  },
  {
    id: 'rain',
    name: 'Rain',
    type: 'rain',
    temperature: 15,
    humidity: 85,
    windSpeed: 20,
    visibility: 60,
    effects: ['wet_terrain', 'reduced_movement', 'crop_watered', 'hidden_tracks'],
    icon: '🌧️',
    color: '#3b82f6',
  },
  {
    id: 'storm',
    name: 'Thunderstorm',
    type: 'storm',
    temperature: 18,
    humidity: 90,
    windSpeed: 50,
    visibility: 40,
    effects: ['danger_lightning', 'flying_disabled', 'fear_effect', 'power_surge'],
    icon: '⛈️',
    color: '#6366f1',
  },
  {
    id: 'snow',
    name: 'Snow',
    type: 'snow',
    temperature: -5,
    humidity: 70,
    windSpeed: 25,
    visibility: 50,
    effects: ['slow_movement', 'cold_damage', 'trail_hidden', 'frozen_water'],
    icon: '🌨️',
    color: '#e5e7eb',
  },
  {
    id: 'fog',
    name: 'Heavy Fog',
    type: 'fog',
    temperature: 10,
    humidity: 95,
    windSpeed: 5,
    visibility: 20,
    effects: ['stealth_bonus', 'navigation_hard', 'ambush_risk', 'mystery_atmosphere'],
    icon: '🌫️',
    color: '#9ca3af',
  },
  {
    id: 'windy',
    name: 'Strong Winds',
    type: 'windy',
    temperature: 22,
    humidity: 45,
    windSpeed: 40,
    visibility: 70,
    effects: ['ranged_accuracy_down', 'wind_boost', 'debris_hazard'],
    icon: '💨',
    color: '#10b981',
  },
];

const sampleLocations = [
  { id: 'luminara', name: 'Luminara', climate: 'temperate' },
  { id: 'whisperwood', name: 'Whisperwood', climate: 'forest' },
  { id: 'dark-cave', name: 'Dark Cave', climate: 'underground' },
  { id: 'ironhold', name: 'Ironhold', climate: 'mountain' },
];

export function WeatherSystemPage() {
  const [presets] = useState<WeatherPreset[]>(weatherPresets);
  const [schedules, setSchedules] = useState<WeatherSchedule[]>([]);
  const [selectedPreset, setSelectedPreset] = useState<string>('sunny');
  const [currentTime, setCurrentTime] = useState(12);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSeason, setCurrentSeason] = useState<Season>('spring');
  const [showEffects, setShowEffects] = useState(true);

  const currentPreset = presets.find(p => p.id === selectedPreset);

  // Simulate time passing
  useEffect(() => {
    if (!isPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentTime(t => (t + 0.5) % 24);
    }, 500);
    
    return () => clearInterval(interval);
  }, [isPlaying]);

  const createSchedule = (locationId: string) => {
    const location = sampleLocations.find(l => l.id === locationId);
    if (!location) return;

    const newSchedule: WeatherSchedule = {
      id: Date.now().toString(),
      locationId,
      locationName: location.name,
      season: currentSeason,
      weatherPattern: [
        { hour: 6, weatherId: 'sunny' },
        { hour: 12, weatherId: 'cloudy' },
        { hour: 15, weatherId: 'rain' },
        { hour: 20, weatherId: 'clear' },
      ],
      transitionDuration: 30,
    };
    setSchedules([...schedules, newSchedule]);
  };

  const getCurrentWeather = (hour: number) => {
    // Simple weather selection based on time
    if (hour >= 6 && hour < 10) return presets.find(p => p.id === 'sunny');
    if (hour >= 10 && hour < 14) return presets.find(p => p.id === 'cloudy');
    if (hour >= 14 && hour < 18) return presets.find(p => p.id === 'rain');
    if (hour >= 18 && hour < 22) return presets.find(p => p.id === 'storm');
    return presets.find(p => p.id === 'fog');
  };

  const formatTime = (hour: number) => {
    const h = Math.floor(hour);
    const m = Math.floor((hour % 1) * 60);
    const period = h >= 12 ? 'PM' : 'AM';
    const displayH = h % 12 || 12;
    return `${displayH}:${m.toString().padStart(2, '0')} ${period}`;
  };

  return (
    <div className="h-screen flex bg-background">
      {/* Left Sidebar - Weather Presets */}
      <div className="w-72 border-r border-border bg-card/50 flex flex-col">
        <div className="p-4 border-b border-border">
          <h2 className="font-semibold flex items-center gap-2">
            <Cloud className="w-5 h-5" />
            Weather System
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto p-3">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Weather Presets</h3>
          
          <div className="space-y-2">
            {presets.map(preset => (
              <button
                key={preset.id}
                onClick={() => setSelectedPreset(preset.id)}
                className={cn(
                  "w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all",
                  selectedPreset === preset.id
                    ? "border-primary bg-primary/10"
                    : "border-transparent hover:border-primary/30 bg-muted"
                )}
              >
                <span className="text-3xl">{preset.icon}</span>
                
                <div className="text-left">
                  <p className="font-medium">{preset.name}</p>
                  <p className="text-xs text-muted-foreground">{preset.temperature}°C • {preset.humidity}% humidity</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Current Weather Display */}
        <div 
          className="relative h-80 overflow-hidden transition-colors duration-1000"
          style={{ 
            background: currentPreset 
              ? `linear-gradient(to bottom, ${currentPreset.color}40, ${currentPreset.color}10)`
              : 'linear-gradient(to bottom, #3b82f6, #1e40af)'
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div 
              key={currentPreset?.id}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center"
            >
              <div className="text-9xl mb-4">{currentPreset?.icon}</div>
              <h1 className="text-4xl font-bold text-white mb-2">{currentPreset?.name}</h1>
              <p className="text-white/80 text-lg">{formatTime(currentTime)}</p>
            </motion.div>
          </div>

          {/* Weather Stats */}
          <div className="absolute bottom-4 left-4 right-4">
            <GlassCard className="p-4">
              <div className="grid grid-cols-4 gap-4">
                <div className="flex items-center gap-2">
                  <Thermometer className="w-5 h-5 text-red-500" />
                  <div>
                    <p className="text-xs text-muted-foreground">Temperature</p>
                    <p className="font-medium">{currentPreset?.temperature}°C</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Droplets className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="text-xs text-muted-foreground">Humidity</p>
                    <p className="font-medium">{currentPreset?.humidity}%</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Wind className="w-5 h-5 text-green-500" />
                  <div>
                    <p className="text-xs text-muted-foreground">Wind Speed</p>
                    <p className="font-medium">{currentPreset?.windSpeed} km/h</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Eye className="w-5 h-5 text-purple-500" />
                  <div>
                    <p className="text-xs text-muted-foreground">Visibility</p>
                    <p className="font-medium">{currentPreset?.visibility}%</p>
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>

        {/* Controls */}
        <div className="p-4 border-b border-border bg-card/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-12 h-12 flex items-center justify-center bg-primary text-primary-foreground rounded-full"
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </button>

              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="0"
                  max="24"
                  step="0.5"
                  value={currentTime}
                  onChange={(e) => setCurrentTime(Number(e.target.value))}
                  className="w-48"
                />
                <span className="text-sm font-mono w-20">{formatTime(currentTime)}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={currentSeason}
                onChange={(e) => setCurrentSeason(e.target.value as Season)}
                className="px-3 py-2 bg-background border border-input rounded-lg">
                <option value="spring">🌸 Spring</option>
                <option value="summer">☀️ Summer</option>
                <option value="autumn">🍂 Autumn</option>
                <option value="winter">❄️ Winter</option>
              </select>

              <button
                onClick={() => setShowEffects(!showEffects)}
                className={cn(
                  "p-2 rounded-lg",
                  showEffects ? "bg-primary/20 text-primary" : "hover:bg-accent"
                )}
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Effects */}
        {showEffects && currentPreset && (
          <div className="p-6">
            <h3 className="font-semibold mb-4">Weather Effects</h3>
            
            <div className="grid grid-cols-2 gap-4">
              {currentPreset.effects.map((effect, i) => (
                <GlassCard key={i} className="p-4">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: currentPreset.color + '20' }}
                    >
                      <Zap className="w-5 h-5" style={{ color: currentPreset.color }} />
                    </div>
                    <div>
                      <p className="font-medium capitalize">{effect.replace(/_/g, ' ')}</p>
                      <p className="text-sm text-muted-foreground">Active in this weather</p>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
