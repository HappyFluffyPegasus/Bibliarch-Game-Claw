import { useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { useAppStore } from '@/stores/appStore'
import { Plus, Trash2, Clock, GripHorizontal } from 'lucide-react'
import type { TimelineEvent } from '@/types'

const TRACKS = [
  { id: 'main', label: 'Main Story', color: '#8b5cf6' },
  { id: 'side', label: 'Side Quests', color: '#10b981' },
  { id: 'character', label: 'Character Arcs', color: '#f59e0b' }
]

export function TimelineEditor() {
  const { id } = useParams()
  const { timelineEvents, addTimelineEvent, deleteTimelineEvent, moveTimelineEvent } = useAppStore()
  const [showNewEvent, setShowNewEvent] = useState(false)
  const [zoom, setZoom] = useState(1)
  const [draggingEvent, setDraggingEvent] = useState<{ id: string; startX: number; initialTime: number } | null>(null)
  
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    trackId: 'main',
    startTime: 0,
    duration: 60,
    color: '#8b5cf6'
  })
  
  const storyEvents = timelineEvents.filter((e) => e.storyId === id)
  
  const timelineRef = useRef<HTMLDivElement>(null)
  
  const handleCreateEvent = () => {
    if (!newEvent.title.trim()) return
    
    addTimelineEvent({
      storyId: id!,
      title: newEvent.title,
      description: newEvent.description,
      startTime: newEvent.startTime,
      duration: newEvent.duration,
      color: TRACKS.find((t) => t.id === newEvent.trackId)?.color || newEvent.color,
      trackId: newEvent.trackId,
      characters: [],
      locationId: undefined
    })
    
    setNewEvent({
      title: '',
      description: '',
      trackId: 'main',
      startTime: 0,
      duration: 60,
      color: '#8b5cf6'
    })
    setShowNewEvent(false)
  }
  
  const handleMouseDown = (e: React.MouseEvent, event: TimelineEvent) => {
    e.preventDefault()
    const rect = timelineRef.current?.getBoundingClientRect()
    if (!rect) return
    
    setDraggingEvent({
      id: event.id,
      startX: e.clientX,
      initialTime: event.startTime
    })
  }
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggingEvent || !timelineRef.current) return
    
    const deltaX = e.clientX - draggingEvent.startX
    const pixelsPerMinute = 2 * zoom
    const deltaMinutes = Math.round(deltaX / pixelsPerMinute / 10) * 10
    const newTime = Math.max(0, draggingEvent.initialTime + deltaMinutes)
    
    moveTimelineEvent(draggingEvent.id, newTime)
  }
  
  const handleMouseUp = () => {
    setDraggingEvent(null)
  }
  
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`
  }
  
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Clock className="w-5 h-5 text-purple-400" />
          <h2 className="text-xl font-semibold">Timeline Editor</h2>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-white/60">Zoom:</span>
            <input
              type="range"
              min="0.5"
              max="3"
              step="0.1"
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="w-32"
            />
          </div>
          
          <button
            onClick={() => setShowNewEvent(true)}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 rounded-lg hover:bg-purple-700"
          >
            <Plus className="w-4 h-4" />
            Add Event
          </button>
        </div>
      </div>
      
      {/* Timeline tracks */}
      <div className="flex-1 overflow-auto p-4">
        <div
          ref={timelineRef}
          className="relative min-h-[400px]"
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* Time markers */}
          <div className="flex border-b border-white/10 mb-4">
            {Array.from({ length: 25 }).map((_, i) => (
              <div
                key={i}
                className="flex-shrink-0 border-l border-white/10 px-2 py-1 text-xs text-white/40"
                style={{ width: `${60 * zoom}px` }}
              >
                {formatTime(i * 60)}
              </div>
            ))}
          </div>
          
          {/* Tracks */}
          <div className="space-y-4">
            {TRACKS.map((track) => (
              <div key={track.id} className="relative">
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: track.color }}
                  />
                  <span className="text-sm font-medium">{track.label}</span>
                </div>
                
                <div className="relative h-16 bg-white/5 rounded-lg overflow-hidden">
                  {storyEvents
                    .filter((e) => e.trackId === track.id)
                    .map((event) => (
                      <div
                        key={event.id}
                        onMouseDown={(e) => handleMouseDown(e, event)}
                        className={`absolute top-2 bottom-2 rounded px-3 py-2 cursor-move select-none overflow-hidden ${
                          draggingEvent?.id === event.id ? 'ring-2 ring-white z-10' : ''
                        }`}
                        style={{
                          left: `${event.startTime * zoom}px`,
                          width: `${Math.max(event.duration * zoom, 80)}px`,
                          backgroundColor: event.color
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <GripHorizontal className="w-4 h-4 opacity-50" />
                          <span className="font-medium text-sm truncate">{event.title}</span>
                        </div>
                        <div className="text-xs opacity-75">
                          {formatTime(event.startTime)} - {formatTime(event.startTime + event.duration)}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Event list */}
      <div className="border-t border-white/10 p-4 max-h-48 overflow-auto">
        <h3 className="font-semibold mb-3">Events</h3>
        
        {storyEvents.length === 0 ? (
          <p className="text-white/40">No events yet. Create one above!</p>
        ) : (
          <div className="space-y-2">
            {storyEvents.map((event) => (
              <div
                key={event.id}
                className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: event.color }}
                  />
                  
                  <div>
                    <div className="font-medium">{event.title}</div>
                    <div className="text-sm text-white/50">
                      {TRACKS.find((t) => t.id === event.trackId)?.label} • {formatTime(event.startTime)}
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => deleteTimelineEvent(event.id)}
                  className="p-2 text-red-400 hover:text-red-300"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* New Event Modal */}
      {showNewEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-slate-900 border border-white/10 rounded-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">Add Timeline Event</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-white/60 mb-1">Title</label>
                <input
                  type="text"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  placeholder="Event title..."
                  className="w-full px-3 py-2 bg-white/5 rounded"
                  autoFocus
                />
              </div>
              
              <div>
                <label className="block text-sm text-white/60 mb-1">Description</label>
                <textarea
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  placeholder="Describe the event..."
                  className="w-full px-3 py-2 bg-white/5 rounded h-20 resize-none"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-white/60 mb-1">Track</label>
                  <select
                    value={newEvent.trackId}
                    onChange={(e) => setNewEvent({ ...newEvent, trackId: e.target.value })}
                    className="w-full px-3 py-2 bg-white/5 rounded"
                  >
                    {TRACKS.map((track) => (
                      <option key={track.id} value={track.id}>{track.label}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm text-white/60 mb-1">Start Time (minutes)</label>
                  <input
                    type="number"
                    value={newEvent.startTime}
                    onChange={(e) => setNewEvent({ ...newEvent, startTime: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-white/5 rounded"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm text-white/60 mb-1">Duration (minutes)</label>
                <input
                  type="number"
                  value={newEvent.duration}
                  onChange={(e) => setNewEvent({ ...newEvent, duration: parseInt(e.target.value) || 30 })}
                  className="w-full px-3 py-2 bg-white/5 rounded"
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowNewEvent(false)}
                className="flex-1 px-4 py-2 border border-white/10 rounded hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateEvent}
                disabled={!newEvent.title.trim()}
                className="flex-1 px-4 py-2 bg-purple-600 rounded hover:bg-purple-700 disabled:opacity-50"
              >
                Add Event
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
