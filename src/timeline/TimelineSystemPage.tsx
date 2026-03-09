import { useState } from 'react'
import { GlassCard } from '@/components/GlassCard'
import { Button } from '@/components/Button'
import { Plus, Clock } from 'lucide-react'

interface TimelineEvent {
  id: string
  title: string
  trackId: string
  start: number
  duration: number
  color: string
}

const tracks = [
  { id: 'main', label: 'Main Story', color: '#3b82f6' },
  { id: 'side', label: 'Side Quests', color: '#22c55e' },
  { id: 'character', label: 'Character Arcs', color: '#f59e0b' },
]

export function TimelineSystemPage() {
  const [events, setEvents] = useState<TimelineEvent[]>([])
  const [zoom, setZoom] = useState(1)
  
  const addEvent = (trackId: string) => {
    const track = tracks.find(t => t.id === trackId)
    const newEvent: TimelineEvent = {
      id: crypto.randomUUID(),
      title: 'New Event',
      trackId,
      start: Math.random() * 500,
      duration: 100,
      color: track?.color || '#3b82f6'
    }
    setEvents([...events, newEvent])
  }
  
  return (
    <div className="h-full flex flex-col">
      <header className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold">Timeline</h1>
          <p className="text-muted-foreground">Plan your story events</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Zoom:</span>
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={zoom}
            onChange={e => setZoom(Number(e.target.value))}
            className="w-24"
          />
        </div>
      </header>
      
      <GlassCard className="flex-1 overflow-auto">
        <div className="min-w-[800px] p-4">
          <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>Story Timeline</span>
          </div>
          
          {tracks.map(track => (
            <div key={track.id} className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded" style={{ backgroundColor: track.color }} />
                  <span className="font-medium">{track.label}</span>
                </div>
                <Button variant="outline" size="sm" onClick={() => addEvent(track.id)}>
                  <Plus className="w-3 h-3 mr-1" />
                  Add
                </Button>
              </div>
              
              <div 
                className="h-16 bg-white/5 rounded-lg relative"
                style={{ width: `${100 * zoom}%` }}
              >
                {events.filter(e => e.trackId === track.id).map(event => (
                  <div
                    key={event.id}
                    className="absolute h-12 top-2 rounded px-2 py-1 text-xs cursor-pointer hover:brightness-110"
                    style={{
                      left: `${event.start}px`,
                      width: `${event.duration}px`,
                      backgroundColor: event.color
                    }}
                  >
                    {event.title}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  )
}
