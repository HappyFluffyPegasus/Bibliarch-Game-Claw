import { useState, useRef, useCallback, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useStoryStore } from '../stores/storyStore';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ZoomIn, ZoomOut, RotateCcw, Plus, Trash2, 
  ChevronLeft, ChevronRight, Film, BookOpen,
  GripVertical, Clock, Calendar
} from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { cn } from '../lib/utils';

// Timeline event that can link to scenes and story nodes
interface TimelineEvent {
  id: string;
  storyId: string;
  order: number;
  title: string;
  description: string;
  timestamp: string;
  trackId: string;
  
  // Links to other systems
  linkedSceneId?: string;
  linkedStoryNodeId?: string;
  linkedCharacters: string[];
  
  // Visuals
  color: string;
  tags: string[];
  status: 'planned' | 'in-progress' | 'completed' | 'cut';
  
  // Nested events
  subEvents?: TimelineEvent[];
  parentEventId?: string | null;
}

interface TimelineTrack {
  id: string;
  name: string;
  color: string;
  order: number;
}

const MIN_ZOOM = 0.5;
const MAX_ZOOM = 2;
const ZOOM_STEP = 0.25;
const TRACK_HEIGHT = 200;
const TRACK_HEADER_WIDTH = 180;
const EVENT_WIDTH_BASE = 280;

export function TimelineSystemPage() {
  const { id } = useParams();
  const { currentStory, characters, loadStory } = useStoryStore();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  const [tracks, setTracks] = useState<TimelineTrack[]>([
    { id: 'main', name: 'Main Story', color: '#3b82f6', order: 0 },
    { id: 'side', name: 'Side Quests', color: '#22c55e', order: 1 },
    { id: 'char', name: 'Character Arcs', color: '#ec4899', order: 2 },
  ]);
  
  const [events, setEvents] = useState<TimelineEvent[]>([
    {
      id: '1',
      storyId: id!,
      order: 0,
      title: 'The Beginning',
      description: 'Adventure starts in the mysterious forest',
      timestamp: 'Day 1',
      trackId: 'main',
      linkedCharacters: [],
      color: '#3b82f6',
      tags: ['intro', 'forest'],
      status: 'completed',
      parentEventId: null,
    },
    {
      id: '2',
      storyId: id!,
      order: 1,
      title: 'Meet the Guide',
      description: 'Character introduction scene',
      timestamp: 'Day 1',
      trackId: 'main',
      linkedCharacters: [],
      color: '#3b82f6',
      tags: ['character-intro'],
      status: 'completed',
      parentEventId: null,
    },
    {
      id: '3',
      storyId: id!,
      order: 2,
      title: 'The Storm',
      description: 'Major plot point - mentor dies',
      timestamp: 'Day 3',
      trackId: 'main',
      linkedCharacters: [],
      color: '#ef4444',
      tags: ['major-event', 'death'],
      status: 'in-progress',
      parentEventId: null,
    },
  ]);
  
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    timestamp: '',
    trackId: 'main',
  });

  // Calculate timeline width
  const timelineWidth = useMemo(() => {
    if (events.length === 0) return 800;
    const maxOrder = Math.max(...events.map(e => e.order));
    return Math.max(800, (maxOrder + 3) * EVENT_WIDTH_BASE * zoom);
  }, [events, zoom]);

  const handleZoomIn = () => setZoom(z => Math.min(MAX_ZOOM, z + ZOOM_STEP));
  const handleZoomOut = () => setZoom(z => Math.max(MIN_ZOOM, z - ZOOM_STEP));
  const handleZoomReset = () => setZoom(1);

  const addEvent = () => {
    if (!newEvent.title.trim()) return;
    
    const track = tracks.find(t => t.id === newEvent.trackId);
    const maxOrder = Math.max(...events.map(e => e.order), -1);
    
    const event: TimelineEvent = {
      id: Date.now().toString(),
      storyId: id!,
      order: maxOrder + 1,
      title: newEvent.title,
      description: newEvent.description,
      timestamp: newEvent.timestamp || `Event ${events.length + 1}`,
      trackId: newEvent.trackId,
      linkedCharacters: [],
      color: track?.color || '#3b82f6',
      tags: [],
      status: 'planned',
      parentEventId: null,
    };
    
    setEvents([...events, event]);
    setNewEvent({ title: '', description: '', timestamp: '', trackId: 'main' });
    setIsAdding(false);
  };

  const moveEvent = (eventId: string, direction: 'left' | 'right') => {
    const eventIndex = events.findIndex(e => e.id === eventId);
    if (eventIndex === -1) return;
    
    const newEvents = [...events];
    const event = newEvents[eventIndex];
    
    if (direction === 'left' && event.order > 0) {
      const prevEvent = newEvents.find(e => e.order === event.order - 1);
      if (prevEvent) {
        prevEvent.order += 1;
        event.order -= 1;
      }
    } else if (direction === 'right') {
      const maxOrder = Math.max(...events.map(e => e.order));
      if (event.order < maxOrder) {
        const nextEvent = newEvents.find(e => e.order === event.order + 1);
        if (nextEvent) {
          nextEvent.order -= 1;
          event.order += 1;
        }
      }
    }
    
    setEvents(newEvents.sort((a, b) => a.order - b.order));
  };

  const deleteEvent = (eventId: string) => {
    setEvents(events.filter(e => e.id !== eventId));
    if (selectedEvent === eventId) setSelectedEvent(null);
  };

  const selectedEventData = events.find(e => e.id === selectedEvent);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'in-progress': return 'bg-blue-500';
      case 'planned': return 'bg-gray-400';
      case 'cut': return 'bg-red-500';
      default: return 'bg-gray-400';
    }
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-card/50">
        <div className="flex items-center gap-3">
          <Clock className="w-6 h-6 text-violet-500" />
          <div>
            <h1 className="text-xl font-bold">Timeline</h1>
            <p className="text-sm text-muted-foreground">Organize your story events</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Zoom Controls */}
          <div className="flex items-center gap-1 bg-muted rounded-lg p-1 mr-4">
            <button onClick={handleZoomOut} className="p-2 hover:bg-accent rounded">
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-sm w-12 text-center">{Math.round(zoom * 100)}%</span>
            <button onClick={handleZoomIn} className="p-2 hover:bg-accent rounded">
              <ZoomIn className="w-4 h-4" />
            </button>
            <button onClick={handleZoomReset} className="p-2 hover:bg-accent rounded">
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
          
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90"
          >
            <Plus className="w-4 h-4" />
            Add Event
          </button>
        </div>
      </div>

      {/* Timeline Canvas */}
      <div className="flex-1 overflow-auto" ref={scrollContainerRef}>
        <div className="relative min-h-full" style={{ width: timelineWidth + TRACK_HEADER_WIDTH }}>
          {/* Ruler */}
          <div className="sticky top-0 z-20 h-10 bg-card/80 backdrop-blur border-b border-border flex items-center" style={{ marginLeft: TRACK_HEADER_WIDTH }}>
            {Array.from({ length: Math.ceil(timelineWidth / (EVENT_WIDTH_BASE * zoom)) + 1 }, (_, i) => (
              <div 
                key={i} 
                className="absolute border-l border-border flex items-end pb-1 pl-1"
                style={{ left: i * EVENT_WIDTH_BASE * zoom }}
              >
                <span className="text-xs text-muted-foreground">{i + 1}</span>
              </div>
            ))}
          </div>

          {/* Tracks */}
          <div className="relative">
            {tracks.map((track, trackIndex) => {
              const trackEvents = events.filter(e => e.trackId === track.id && !e.parentEventId);
              
              return (
                <div 
                  key={track.id}
                  className="flex border-b border-border"
                  style={{ height: TRACK_HEIGHT }}
                >
                  {/* Track Header */}
                  <div 
                    className="sticky left-0 z-10 w-[180px] bg-card/90 backdrop-blur p-4 border-r border-border flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: track.color }}
                        />
                        <span className="font-semibold text-sm">{track.name}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{trackEvents.length} events</span>
                    </div>
                  </div>

                  {/* Track Content */}
                  <div className="flex-1 relative">
                    {/* Grid lines */}
                    {Array.from({ length: Math.ceil(timelineWidth / (EVENT_WIDTH_BASE * zoom)) }, (_, i) => (
                      <div 
                        key={i}
                        className="absolute top-0 bottom-0 border-l border-border/30"
                        style={{ left: i * EVENT_WIDTH_BASE * zoom }}
                      />
                    ))}

                    {/* Events */}
                    {trackEvents.map((event) => (
                      <motion.div
                        key={event.id}
                        layoutId={event.id}
                        className={cn(
                          "absolute top-4 bottom-4 rounded-xl border-2 cursor-pointer transition-all overflow-hidden",
                          selectedEvent === event.id 
                            ? "border-primary ring-2 ring-primary/20 shadow-lg" 
                            : "border-border hover:border-primary/50"
                        )}
                        style={{ 
                          left: event.order * EVENT_WIDTH_BASE * zoom + 16,
                          width: EVENT_WIDTH_BASE * zoom - 32,
                          backgroundColor: event.color + '20',
                        }}
                        onClick={() => setSelectedEvent(event.id)}
                      >
                        {/* Status bar */}
                        <div className={cn("h-1 w-full", getStatusColor(event.status))} />
                        
                        <div className="p-3 h-full flex flex-col">
                          <div className="flex items-start justify-between mb-1">
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {event.timestamp}
                            </span>
                            <GripVertical className="w-3 h-3 text-muted-foreground" />
                          </div>
                          
                          <h3 className="font-semibold text-sm mb-1 line-clamp-1">{event.title}</h3>
                          <p className="text-xs text-muted-foreground line-clamp-2 flex-1">{event.description}</p>
                          
                          {/* Links */}
                          <div className="flex items-center gap-2 mt-2">
                            {event.linkedSceneId && (
                              <span title="Linked to Scene">
                                <Film className="w-3 h-3 text-violet-500" />
                              </span>
                            )}
                            {event.linkedStoryNodeId && (
                              <span title="Linked to Story">
                                <BookOpen className="w-3 h-3 text-pink-500" />
                              </span>
                            )}
                            {event.linkedCharacters.length > 0 && (
                              <span className="text-[10px] bg-accent px-1.5 py-0.5 rounded">
                                {event.linkedCharacters.length} chars
                              </span>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}

                    {/* Empty state */}
                    {trackEvents.length === 0 && (
                      <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-sm">
                        No events in this track
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Selected Event Panel */}
      <AnimatePresence>
        {selectedEventData && (
          <motion.div
            initial={{ y: 300 }}
            animate={{ y: 0 }}
            exit={{ y: 300 }}
            className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-2xl z-50"
          >
            <div className="p-6 max-w-6xl mx-auto">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={selectedEventData.title}
                    onChange={(e) => {
                      setEvents(events.map(ev => 
                        ev.id === selectedEvent ? { ...ev, title: e.target.value } : ev
                      ));
                    }}
                    className="text-xl font-bold bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-ring rounded px-2"
                  />
                  <select
                    value={selectedEventData.status}
                    onChange={(e) => {
                      setEvents(events.map(ev => 
                        ev.id === selectedEvent ? { ...ev, status: e.target.value as any } : ev
                      ));
                    }}
                    className="px-2 py-1 bg-accent rounded text-sm"
                  >
                    <option value="planned">Planned</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="cut">Cut</option>
                  </select>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => moveEvent(selectedEvent!, 'left')}
                    className="p-2 hover:bg-accent rounded"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-sm text-muted-foreground">Order: {selectedEventData.order + 1}</span>
                  <button
                    onClick={() => moveEvent(selectedEvent!, 'right')}
                    className="p-2 hover:bg-accent rounded"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteEvent(selectedEvent!)}
                    className="p-2 hover:text-destructive rounded ml-4"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setSelectedEvent(null)}
                    className="px-4 py-2 hover:bg-accent rounded"
                  >
                    Close
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6">
                <div className="col-span-2 space-y-4">
                  <textarea
                    value={selectedEventData.description}
                    onChange={(e) => {
                      setEvents(events.map(ev => 
                        ev.id === selectedEvent ? { ...ev, description: e.target.value } : ev
                      ));
                    }}
                    placeholder="Event description..."
                    rows={4}
                    className="w-full px-3 py-2 bg-muted rounded-lg resize-none"
                  />
                  
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <input
                        type="text"
                        value={selectedEventData.timestamp}
                        onChange={(e) => {
                          setEvents(events.map(ev => 
                            ev.id === selectedEvent ? { ...ev, timestamp: e.target.value } : ev
                          ));
                        }}
                        placeholder="When (e.g., Day 1)"
                        className="px-2 py-1 bg-muted rounded text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Links</label>
                    <div className="space-y-2">
                      <button className="w-full flex items-center gap-2 p-2 bg-accent rounded-lg text-sm hover:bg-accent/80">
                        <Film className="w-4 h-4" />
                        {selectedEventData.linkedSceneId ? 'Linked to Scene' : 'Link to Scene'}
                      </button>
                      <button className="w-full flex items-center gap-2 p-2 bg-accent rounded-lg text-sm hover:bg-accent/80">
                        <BookOpen className="w-4 h-4" />
                        {selectedEventData.linkedStoryNodeId ? 'Linked to Story' : 'Link to Story'}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Characters</label>
                    <div className="flex flex-wrap gap-1">
                      {characters.map(char => (
                        <button
                          key={char.id}
                          onClick={() => {
                            const isLinked = selectedEventData.linkedCharacters.includes(char.id);
                            setEvents(events.map(ev => 
                              ev.id === selectedEvent 
                                ? { 
                                    ...ev, 
                                    linkedCharacters: isLinked
                                      ? ev.linkedCharacters.filter(id => id !== char.id)
                                      : [...ev.linkedCharacters, char.id]
                                  }
                                : ev
                            ));
                          }}
                          className={cn(
                            "px-2 py-1 rounded text-xs transition-colors",
                            selectedEventData.linkedCharacters.includes(char.id)
                              ? "bg-primary text-primary-foreground"
                              : "bg-accent hover:bg-accent/80"
                          )}
                        >
                          {char.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Event Modal */}
      {isAdding && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <GlassCard className="w-full max-w-md p-6">
            <h3 className="text-xl font-bold mb-4">Add New Event</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Event title"
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                className="w-full px-4 py-2 bg-background border border-input rounded-lg"
              />
              <textarea
                placeholder="Description"
                value={newEvent.description}
                onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 bg-background border border-input rounded-lg resize-none"
              />
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="When (e.g., Day 1)"
                  value={newEvent.timestamp}
                  onChange={(e) => setNewEvent({ ...newEvent, timestamp: e.target.value })}
                  className="flex-1 px-4 py-2 bg-background border border-input rounded-lg"
                />
                <select
                  value={newEvent.trackId}
                  onChange={(e) => setNewEvent({ ...newEvent, trackId: e.target.value })}
                  className="px-4 py-2 bg-background border border-input rounded-lg"
                >
                  {tracks.map(track => (
                    <option key={track.id} value={track.id}>{track.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsAdding(false)}
                  className="flex-1 py-2 bg-accent rounded-lg hover:bg-accent/80"
                >
                  Cancel
                </button>
                <button
                  onClick={addEvent}
                  className="flex-1 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
                >
                  Add Event
                </button>
              </div>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
}
