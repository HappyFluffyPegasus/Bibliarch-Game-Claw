import { useState } from 'react'
import { GlassCard } from '@/components/GlassCard'
import { Sun, Cloud, CloudRain, CloudLightning, Snowflake, Wind } from 'lucide-react'

const weatherTypes = [
  { id: 'sunny', name: 'Sunny', icon: Sun, color: '#fbbf24' },
  { id: 'cloudy', name: 'Cloudy', icon: Cloud, color: '#9ca3af' },
  { id: 'rainy', name: 'Rain', icon: CloudRain, color: '#60a5fa' },
  { id: 'stormy', name: 'Storm', icon: CloudLightning, color: '#a855f7' },
  { id: 'snowy', name: 'Snow', icon: Snowflake, color: '#e5e7eb' },
  { id: 'windy', name: 'Wind', icon: Wind, color: '#22c55e' },
]

const seasons = ['Spring', 'Summer', 'Autumn', 'Winter']

export function WeatherSystemPage() {
  const [activeWeather, setActiveWeather] = useState('sunny')
  const [season, setSeason] = useState('Spring')
  const [time, setTime] = useState(12)
  
  return (
    <div className="h-full flex flex-col">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Weather System</h1>
        <p className="text-muted-foreground">Control weather, seasons, and time of day</p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GlassCard className="p-6">
          <h3 className="font-medium mb-4">Weather Presets</h3>
          
          <div className="grid grid-cols-2 gap-3">
            {weatherTypes.map(w => (
              <button
                key={w.id}
                className={`p-4 rounded-lg border-2 transition-all ${
                  activeWeather === w.id
                    ? 'border-primary bg-primary/10'
                    : 'border-white/10 hover:border-white/20'
                }`}
                onClick={() => setActiveWeather(w.id)}
              >
                <w.icon className="w-8 h-8 mx-auto mb-2" style={{ color: w.color }} />
                <div className="text-sm font-medium">{w.name}</div>
              </button>
            ))}
          </div>
        </GlassCard>
        
        <GlassCard className="p-6">
          <h3 className="font-medium mb-4">Season & Time</h3>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Season</label>
              <div className="flex gap-2">
                {seasons.map(s => (
                  <button
                    key={s}
                    className={`flex-1 py-2 rounded-lg text-sm ${
                      season === s
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-white/5 hover:bg-white/10'
                    }`}
                    onClick={() => setSeason(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Time: {time}:00</label>
              <input
                type="range"
                min="0"
                max="23"
                value={time}
                onChange={e => setTime(Number(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  )
}
