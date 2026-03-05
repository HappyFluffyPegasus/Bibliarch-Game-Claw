import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useStoryStore } from '../stores/storyStore';
import { motion } from 'framer-motion';
import { 
  Clock, Plus, Trash2, Link as LinkIcon, Film, BookOpen,
  ChevronUp, ChevronDown, Calendar, Clock3, Tag
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
  timestamp: string; // "Day 1", "Chapter 3", "Year 847", etc.
  dateValue?: string; // ISO date for sorting
  
  // Links to other systems
  linkedSceneId?: string; // Links to Scene Editor
  linkedStoryNodeId?: string; // Links to Story Mode
  linkedCharacters: string[]; // Character IDs involved
  
  // Visuals
  color: string;
  icon?: string;
  tags: string[];
  
  // Status
  status: 'planned' | 'in-progress' | 'completed' | 'cut';
}

interface TimelineTrack {
  id: string;
  storyId: string;
  name: string;
  color: string;
  order: number;
  isExpanded: boolean;
}

const colorOptions = [
  '#ef4444', '#f97316', '#f59e0b', '#84cc16', '#22c55e',
  '#10b981', '#06b6d4', '#3b82f6', '#6366f1', '#8b5cf6',
  '#a855f7', '#d946ef', '#ec4899', '#f43f5e',
];

export function TimelineSystemPage() {
  const { id } = useParams();
  const { currentStory, characters, scenes, loadStory } = useStoryStore();
  
  const [tracks, setTracks] = useState<TimelineTrack[]>([
    { id: 'main', storyId: id!, name: 'Main Story', color: '#3b82f6', order: 0, isExpanded: true },
    { id: 'side', storyId: id!, name: 'Side Quests', color: '#22c55e', order: 1, isExpanded: true },
    { id: 'char', storyId: id!, name: 'Character Arcs', color: '#ec4899', order: 2, isExpanded: false },
  ]);
  
  const [events, setEvents] = useState<TimelineEvent[]>([
    {
      id: '1',
      storyId: id!,
      order: 0,
      title: 'The Beginning',
      description: 'Adventure starts in the mysterious forest',
      timestamp: 'Day 1',
      linkedCharacters: [],
      color: '#3b82f6',
      tags: ['intro', 'forest'],
      status: 'completed',
    },
    {
      id: '2',
      storyId: id!,
      order: 1,
      title: 'Meet the Guide',
      description: 'Character introduction scene',
      timestamp: 'Day 1',
      linkedCharacters: [],
      color: '#3b82f6',
      tags: ['character-intro'],
      status: 'completed',
    },
    {
      id: '3',
      storyId: id!,
      order: 2,
      title: 'The Storm',
      description: 'Major plot point - mentor dies',
      timestamp: 'Day 3',
      linkedCharacters: [],
      color: '#ef4444',
      tags: ['major-event', 'death'],
      status: 'in-progress',
    },
  ]);
  
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    timestamp: '',
    trackId: 'main',
  });

  useEffect(() => {
    if (id) loadStory(id);
  }, [id]);

  const addEvent = () => {
    if (!newEvent.title.trim()) return;
    
    const event: TimelineEvent = {
      id: Date.now().toString(),
      storyId: id!,
      order: events.length,
      title: newEvent.title,
      description: newEvent.description,
      timestamp: newEvent.timestamp || `Event ${events.length + 1}`,
      linkedCharacters: [],
      color: tracks.find(t => t.id === newEvent.trackId)?.color || '#3b82f6',
      tags: [],
      status: 'planned',
    };
    
    setEvents([...events, event]);
    setNewEvent({ title: '', description: '', timestamp: '', trackId: 'main' });
    setIsAddingEvent(false);
  };

  const moveEvent = (eventId: string, direction: 'up' | 'down') => {
    const index = events.findIndex(e => e.id === eventId);
    if (index === -1) return;
    
    const newEvents = [...events];
    if (direction === 'up' && index > 0) {
      [newEvents[index], newEvents[index - 1]] = [newEvents[index - 1], newEvents[index]];
    } else if (direction === 'down' && index < newEvents.length - 1) {
      [newEvents[index], newEvents[index + 1]] = [newEvents[index + 1], newEvents[index]];
    }
    
    // Update order
    newEvents.forEach((e, i) => e.order = i);
    setEvents(newEvents);
  };

  const deleteEvent = (eventId: string) => {
    setEvents(events.filter(e => e.id !== eventId));
  };

  const selectedEventData = events.find(e => e.id === selectedEvent);

  return (
    <div className="h-screen flex bg-background">
      {/* Main Timeline View */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-3">
            <Clock className="w-6 h-6 text-violet-500" />
            <div>
              <h1 className="text-xl font-bold">Timeline</h1>
              <p className="text-sm text-muted-foreground">Link events to scenes and story nodes</p>
            </div>
          </div>
          
          <button
            onClick={() => setIsAddingEvent(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90"
          >
            <Plus className="w-4 h-4" />
            Add Event
          </button>
        </div>

        {/* Tracks */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {tracks.map((track) => {
              const trackEvents = events.filter(e => {
                // For now, color matching determines track
                // In real app, events would have trackId
                return trackEvents.length >= 0; // Placeholder
              }) || events; // Show all events for now
              
              return (
                <GlassCard key={track.id} className="overflow-hidden">
                  {/* Track Header */}
                  <div 
                    className="flex items-center justify-between px-4 py-3 border-b border-border cursor-pointer"
                    style={{ backgroundColor: track.color + '10' }}
                    onClick={() => {
                      setTracks(tracks.map(t => 
                        t.id === track.id ? { ...t, isExpanded: !t.isExpanded } : t
                      ));
                    }}
003e
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: track.color }}
                      />
                      <span className="font-semibold">{track.name}</span>
                      <span className="text-sm text-muted-foreground">
                        ({events.filter((_, i) => i % tracks.length === track.order).length} events)
                      </span>
                    </div>
                    
                    <{track.isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                  
                  {/* Track Events */}
                  <{track.isExpanded && (
                    <div className="divide-y divide-border">
                      {events
                        .filter((_, i) => i % tracks.length === track.order)
                        .map((event, index) => (
                        <div
                          key={event.id}
                          onClick={() => setSelectedEvent(event.id)}
                          className={cn(
                            "flex items-center gap-4 px-4 py-3 cursor-pointer transition-colors",
                            selectedEvent === event.id ? "bg-primary/5" : "hover:bg-accent/50"
                          )}
                        >
                          {/* Order Number */}
                          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-medium">
                            {event.order + 1}
                          </div>
                          
                          {/* Color Indicator */}
                          <div 
                            className="w-1 h-12 rounded-full" 
                            style={{ backgroundColor: event.color }}
                          />
                          
                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-medium truncate">{event.title}</span>
                              
                              <span className={cn(
                                "text-xs px-2 py-0.5 rounded-full",
                                event.status === 'completed' && "bg-green-500/20 text-green-600",
                                event.status === 'in-progress' && "bg-blue-500/20 text-blue-600",
                                event.status === 'planned' && "bg-gray-500/20 text-gray-600",
                                event.status === 'cut' && "bg-red-500/20 text-red-600",
                              )}>
                                {event.status}
                              </span>
                            </div>
                            
                            <p className="text-sm text-muted-foreground truncate">{event.description}</p>
                            
                            <div className="flex items-center gap-3 mt-1">
                              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Calendar className="w-3 h-3" />
                                {event.timestamp}
                              </span>
                              
                              <{event.linkedSceneId && (
                                <span className="flex items-center gap-1 text-xs text-violet-500">
                                  <Film className="w-3 h-3" />
                                  Linked Scene
                                </span>
                              )}
                              
                              <{event.linkedStoryNodeId && (
                                <span className="flex items-center gap-1 text-xs text-pink-500">
                                  <BookOpen className="w-3 h-3" />
                                  Linked Story
                                </span>
                              )}
                              
                              <{event.tags.map(tag => (
                                <span key={tag} className="text-xs text-muted-foreground">
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          </div>
                          
                          {/* Actions */}
                          <div className="flex items-center gap-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                moveEvent(event.id, 'up');
                              }}
                              disabled={index === 0}
                              className="p-1.5 hover:bg-accent rounded disabled:opacity-50"
                            >
                              <ChevronUp className="w-4 h-4" />
                            </button>
                            
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                moveEvent(event.id, 'down');
                              }}
                              disabled={index === events.length - 1}
                              className="p-1.5 hover:bg-accent rounded disabled:opacity-50"
                            >
                              <ChevronDown className="w-4 h-4" />
                            </button>
                            
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteEvent(event.id);
                              }}
                              className="p-1.5 hover:text-destructive rounded"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </GlassCard>
              );
            })}
          </div>
        </div>
      </div>

      {/* Event Details Panel */}
      <{selectedEventData && (
        <motion.div
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="w-96 border-l border-border bg-card/50 backdrop-blur p-6 overflow-y-auto"
        >
          <h2 className="text-xl font-bold mb-6">Event Details</h2>
          
          <div className="space-y-6">
            {/* Title */}
            <div>
              <label className="text-sm font-medium mb-1 block">Title</label>
              <input
                type="text"
                value={selectedEventData.title}
                onChange={(e) => {
                  setEvents(events.map(ev => 
                    ev.id === selectedEvent ? { ...ev, title: e.target.value } : ev
                  ));
                }}
                className="w-full px-3 py-2 bg-background border border-input rounded-lg"
              />
            </div>

            {/* Description */}
            <div>
              <label className="text-sm font-medium mb-1 block">Description</label>
              <textarea
                value={selectedEventData.description}
                onChange={(e) => {
                  setEvents(events.map(ev => 
                    ev.id === selectedEvent ? { ...ev, description: e.target.value } : ev
                  ));
                }}
                rows={4}
                className="w-full px-3 py-2 bg-background border border-input rounded-lg resize-none"
              />
            </div>

            {/* Timestamp */}
            <div>
              <label className="text-sm font-medium mb-1 block">When</label>
              <input
                type="text"
                value={selectedEventData.timestamp}
                onChange={(e) => {
                  setEvents(events.map(ev => 
                    ev.id === selectedEvent ? { ...ev, timestamp: e.target.value } : ev
                  ));
                }}
                placeholder="e.g., Day 1, Chapter 3, Year 847"
                className="w-full px-3 py-2 bg-background border border-input rounded-lg"
              />
            </div>

            {/* Color */}
            <div>
              <label className="text-sm font-medium mb-2 block">Color</label>
              <div className="flex flex-wrap gap-2">
                <{colorOptions.map((color) => (
                  <button
                    key={color}
                    onClick={() => {
                      setEvents(events.map(ev => 
                        ev.id === selectedEvent ? { ...ev, color } : ev
                      ));
                    }}
                    className={cn(
                      "w-8 h-8 rounded-lg transition-all",
                      selectedEventData.color === color && "ring-2 ring-white scale-110"
                    )}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="text-sm font-medium mb-1 block">Status</label>
              <select
                value={selectedEventData.status}
                onChange={(e) => {
                  setEvents(events.map(ev => 
                    ev.id === selectedEvent ? { ...ev, status: e.target.value as any } : ev
                  ));
                }}
                className="w-full px-3 py-2 bg-background border border-input rounded-lg"
              >
                <option value="planned">Planned</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cut">Cut</option>
              </select>
            </div>

            {/* Links */}
            <div className="pt-4 border-t border-border">
              <div className="text-sm font-medium mb-3">Links</div>
              
              <div className="space-y-3">
                <button className="w-full flex items-center gap-3 p-3 bg-accent/50 rounded-lg hover:bg-accent transition-colors"
003e
                  <Film className="w-5 h-5 text-violet-500" />
                  <div className="text-left">
                    <div className="font-medium">Link to Scene</div>
                    <div className="text-xs text-muted-foreground">{selectedEventData.linkedSceneId ? 'Linked' : 'Not linked'}</div>
                  </div>
                </button>
                
                <button className="w-full flex items-center gap-3 p-3 bg-accent/50 rounded-lg hover:bg-accent transition-colors"
003e
                  <BookOpen className="w-5 h-5 text-pink-500" />
                  <div className="text-left">
                    <div className="font-medium">Link to Story Node</div>
                    <div className="text-xs text-muted-foreground">{selectedEventData.linkedStoryNodeId ? 'Linked' : 'Not linked'}</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Characters */}
            <div className="pt-4 border-t border-border"
003e
              <div className="text-sm font-medium mb-3">Involved Characters</div>
              
              <div className="flex flex-wrap gap-2">
                <{characters.map((char) => (
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
                      "px-3 py-1.5 rounded-lg text-sm transition-colors",
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
        </motion.div>
      )}

      {/* Add Event Modal */}
      <{isAddingEvent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
003e
          <GlassCard className="w-full max-w-md p-6">
            <h3 className="text-xl font-bold mb-4">Add New Event</h3>
            
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Event title"
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                className="w-full px-4 py-3 bg-background border border-input rounded-lg"
              />
              
              <textarea
                placeholder="Description"
                value={newEvent.description}
                onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 bg-background border border-input rounded-lg resize-none"
              />
              
              <input
                type="text"
                placeholder="When (e.g., Day 1, Chapter 3)"
                value={newEvent.timestamp}
                onChange={(e) => setNewEvent({ ...newEvent, timestamp: e.target.value })}
                className="w-full px-4 py-3 bg-background border border-input rounded-lg"
              />
              
              <div className="flex gap-2">
                <button
                  onClick={() => setIsAddingEvent(false)}
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
