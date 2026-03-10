import { useState, useRef } from 'react'
import { GlassCard } from '@/components/GlassCard'

interface TimelineEvent {
  id: string
  title: string
  trackId: string
  start: number
  duration: number
  color: string
}

interface DraggableTimelineProps {
  events: TimelineEvent[]
  onEventMove: (eventId: string, newStart: number) => void
  zoom: number
}

export function DraggableTimeline({ events, onEventMove, zoom }: DraggableTimelineProps) {
  const [draggingEvent, setDraggingEvent] = useState<string | null>(null)
  const [dragOffset, setDragOffset] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  
  const handleMouseDown = (e: React.MouseEvent, event: TimelineEvent) => {
    setDraggingEvent(event.id)
    const rect = containerRef.current?.getBoundingClientRect()
    if (rect) {
      setDragOffset(e.clientX - rect.left - event.start * zoom)
    }
  }
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggingEvent || !containerRef.current) return
    
    const rect = containerRef.current.getBoundingClientRect()
    const newStart = (e.clientX - rect.left - dragOffset) / zoom
    
    onEventMove(draggingEvent, Math.max(0, newStart))
  }
  
  const handleMouseUp = () => {
    setDraggingEvent(null)
  }
  
  return (
    <div
      ref={containerRef}
      className="relative h-16 bg-white/5 rounded-lg"
      style={{ width: `${100 * zoom}%` }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Time markers */}
      {Array.from({ length: 25 }).map((_, i) => (
        <div
          key={i}
          className="absolute top-0 bottom-0 border-l border-white/10"
          style={{ left: `${i * 4 * zoom}%` }}
        >
          <span className="text-xs text-muted-foreground absolute -top-5">{i}:00</span>
        </div>
      ))}
      
      {/* Events */}
      {events.map(event => (
        <div
          key={event.id}
          className={`absolute h-12 top-2 rounded px-2 py-1 text-xs cursor-move select-none ${
            draggingEvent === event.id ? 'ring-2 ring-white z-10' : ''
          }`}
          style={{
            left: `${event.start * zoom}px`,
            width: `${Math.max(event.duration * zoom, 60)}px`,
            backgroundColor: event.color
          }}
          onMouseDown={e => handleMouseDown(e, event)}
        >
          <div className="font-medium truncate">{event.title}</div>
          <div className="text-[10px] opacity-75">{Math.round(event.duration)} min</div>
        </div>
      ))}
    </div>
  )
}
