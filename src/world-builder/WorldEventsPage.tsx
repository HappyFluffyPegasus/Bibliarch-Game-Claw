import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, MapPin, Clock, AlertCircle, CheckCircle2, 
  Plus, Trash2, Edit3, Link2, Filter, Search,
  Skull, Crown, Sword, Heart, Star, Flame, Snowflake, Sun, Moon,
  ChevronDown, ChevronUp, MoreHorizontal
} from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { cn } from '../lib/utils';

type EventType = 'battle' | 'discovery' | 'dialogue' | 'cutscene' | 'weather' | 'quest' | 'milestone';
type EventStatus = 'draft' | 'scheduled' | 'active' | 'completed';

interface WorldEvent {
  id: string;
  title: string;
  description: string;
  type: EventType;
  status: EventStatus;
  locationId: string | null;
  locationName: string | null;
  triggerTime: number; // 0-100 timeline position
  duration: number;
  requirements: string[];
  consequences: string[];
  participants: string[];
  icon: string;
  color: string;
}

const eventTypes: { id: EventType; label: string; icon: string; color: string }[] = [
  { id: 'battle', label: 'Battle', icon: '⚔️', color: '#ef4444' },
  { id: 'discovery', label: 'Discovery', icon: '💎', color: '#3b82f6' },
  { id: 'dialogue', label: 'Dialogue', icon: '💬', color: '#10b981' },
  { id: 'cutscene', label: 'Cutscene', icon: '🎬', color: '#8b5cf6' },
  { id: 'weather', label: 'Weather', icon: '🌦️', color: '#06b6d4' },
  { id: 'quest', label: 'Quest', icon: '📜', color: '#f59e0b' },
  { id: 'milestone', label: 'Milestone', icon: '🏆', color: '#ec4899' },
];

const sampleLocations = [
  { id: 'luminara', name: 'Luminara' },
  { id: 'whisperwood', name: 'Whisperwood' },
  { id: 'dark-cave', name: 'Dark Cave' },
  { id: 'astral-spire', name: 'Astral Spire' },
  { id: 'ironhold', name: 'Ironhold' },
];

const sampleEvents: WorldEvent[] = [
  {
    id: '1',
    title: 'The Hero Arrives',
    description: 'The protagonist enters the gates of Luminara for the first time.',
    type: 'milestone',
    status: 'scheduled',
    locationId: 'luminara',
    locationName: 'Luminara Gates',
    triggerTime: 5,
    duration: 10,
    requirements: ['Intro complete'],
    consequences: ['Access to city', 'Meet merchant'],
    participants: ['Hero', 'Guard'],
    icon: '🏆',
    color: '#ec4899',
  },
  {
    id: '2',
    title: 'Ambush in the Forest',
    description: 'Bandits attack the party as they travel through Whisperwood.',
    type: 'battle',
    status: 'draft',
    locationId: 'whisperwood',
    locationName: 'Whisperwood Path',
    triggerTime: 25,
    duration: 15,
    requirements: ['Leave Luminara', 'Daytime'],
    consequences: ['Gain loot', 'Reputation change'],
    participants: ['Hero', 'Bandits'],
    icon: '⚔️',
    color: '#ef4444',
  },
  {
    id: '3',
    title: 'Ancient Discovery',
    description: 'The party discovers a hidden rune stone with mysterious markings.',
    type: 'discovery',
    status: 'draft',
    locationId: 'dark-cave',
    locationName: 'Deep Cave',
    triggerTime: 45,
    duration: 8,
    requirements: ['Light source', 'Translation skill'],
    consequences: ['Unlock magic', 'New quest'],
    participants: ['Hero', 'Scholar'],
    icon: '💎',
    color: '#3b82f6',
  },
  {
    id: '4',
    title: 'Audience with the Queen',
    description: 'The Elven Queen grants an audience to discuss the artifact.',
    type: 'dialogue',
    status: 'completed',
    locationId: 'astral-spire',
    locationName: 'Throne Room',
    triggerTime: 60,
    duration: 20,
    requirements: ['Artifact found', 'Reputation > 50'],
    consequences: ['Main quest update', 'Royal favor'],
    participants: ['Hero', 'Queen', 'Advisor'],
    icon: '💬',
    color: '#10b981',
  },
  {
    id: '5',
    title: 'The Great Storm',
    description: 'A magical storm sweeps across the region, affecting travel.',
    type: 'weather',
    status: 'active',
    locationId: null,
    locationName: 'Regional',
    triggerTime: 75,
    duration: 30,
    requirements: ['Chapter 3 started'],
    consequences: ['New paths open', 'Flying disabled'],
    participants: ['All'],
    icon: '🌦️',
    color: '#06b6d4',
  },
];

export function WorldEventsPage() {
  const [events, setEvents] = useState<WorldEvent[]>(sampleEvents);
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<EventType | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<EventStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'timeline' | 'list' | 'map'>('timeline');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const filteredEvents = events.filter(event => {
    const matchesType = filterType === 'all' || event.type === filterType;
    const matchesStatus = filterStatus === 'all' || event.status === filterStatus;
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesStatus && matchesSearch;
  });

  const sortedEvents = [...filteredEvents].sort((a, b) => a.triggerTime - b.triggerTime);

  const createEvent = (type: EventType) => {
    const config = eventTypes.find(t => t.id === type);
    const newEvent: WorldEvent = {
      id: Date.now().toString(),
      title: `New ${config?.label}`,
      description: '',
      type,
      status: 'draft',
      locationId: null,
      locationName: null,
      triggerTime: 50,
      duration: 10,
      requirements: [],
      consequences: [],
      participants: [],
      icon: config?.icon || '📅',
      color: config?.color || '#666',
    };
    setEvents([...events, newEvent]);
    setSelectedEvent(newEvent.id);
    setShowCreateModal(false);
  };

  const updateEvent = (id: string, updates: Partial<WorldEvent>) => {
    setEvents(events.map(e => e.id === id ? { ...e, ...updates } : e));
  };

  const deleteEvent = (id: string) => {
    setEvents(events.filter(e => e.id !== id));
    if (selectedEvent === id) setSelectedEvent(null);
  };

  const selectedEventData = events.find(e => e.id === selectedEvent);

  return (
    <div className="h-screen flex bg-background">
      {/* Left Sidebar - Event Types & Filters */}
      <div className="w-72 border-r border-border bg-card/50 flex flex-col">
        <div className="p-4 border-b border-border">
          <h2 className="font-semibold flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            World Events
          </h2>
        </div>

        {/* Create Button */}
        <div className="p-3">
          <button
            onClick={() => setShowCreateModal(true)}
            className="w-full flex items-center justify-center gap-2 p-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90"
          >
            <Plus className="w-4 h-4" />
            Create Event
          </button>
        </div>

        {/* Event Types */}
        <div className="flex-1 overflow-y-auto p-3">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Event Types</h3>
          <div className="space-y-1">
            <button
              onClick={() => setFilterType('all')}
              className={cn(
                "w-full flex items-center gap-3 p-2 rounded-lg text-left transition-colors",
                filterType === 'all' ? "bg-primary/10 text-primary" : "hover:bg-accent"
              )}
            >
              <span className="text-xl">📅</span>
              <span className="flex-1">All Events</span>
              <span className="text-xs text-muted-foreground">{events.length}</span>
            </button>
            
            {eventTypes.map(type => (
              <button
                key={type.id}
                onClick={() => setFilterType(type.id)}
                className={cn(
                  "w-full flex items-center gap-3 p-2 rounded-lg text-left transition-colors",
                  filterType === type.id ? "bg-primary/10 text-primary" : "hover:bg-accent"
                )}
              >
                <span className="text-xl">{type.icon}</span>
                <span className="flex-1">{type.label}</span>
                <span className="text-xs text-muted-foreground">
                  {events.filter(e => e.type === type.id).length}
                </span>
              </button>
            ))}
          </div>

          {/* Status Filter */}
          <h3 className="text-sm font-medium text-muted-foreground mb-2 mt-6">Status</h3>
          <div className="flex flex-wrap gap-2">
            {(['all', 'draft', 'scheduled', 'active', 'completed'] as const).map(status => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={cn(
                  "px-3 py-1 rounded-full text-xs capitalize transition-colors",
                  filterStatus === status
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted hover:bg-accent"
                )}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card/50">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 bg-background border border-input rounded-lg w-64"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            {(['timeline', 'list', 'map'] as const).map(mode => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-sm capitalize transition-colors",
                  viewMode === mode ? "bg-primary text-primary-foreground" : "hover:bg-accent"
                )}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        {/* Timeline View */}
        {viewMode === 'timeline' && (
          <div className="flex-1 overflow-y-auto p-6">
            <div className="relative max-w-4xl mx-auto">
              {/* Timeline Line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border" />
              
              {/* Events */}
              <div className="space-y-6">
                {sortedEvents.map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => setSelectedEvent(event.id)}
                    className={cn(
                      "relative pl-16 cursor-pointer",
                      selectedEvent === event.id && "z-10"
                    )}
                  >
                    {/* Timeline Dot */}
                    <div 
                      className="absolute left-6 w-5 h-5 rounded-full border-2 border-background"
                      style={{ backgroundColor: event.color }}
                    />
                    
                    {/* Event Card */}
                    <GlassCard className={cn(
                      "p-4 hover:shadow-lg transition-all",
                      selectedEvent === event.id && "ring-2 ring-primary"
                    )}>
                      <div className="flex items-start gap-4">
                        <span className="text-3xl">{event.icon}</span>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{event.title}</h3>
                            <span className={cn(
                              "px-2 py-0.5 text-xs rounded-full",
                              event.status === 'completed' ? "bg-green-500/20 text-green-600" :
                              event.status === 'active' ? "bg-blue-500/20 text-blue-600" :
                              event.status === 'scheduled' ? "bg-yellow-500/20 text-yellow-600" :
                              "bg-gray-500/20 text-gray-600"
                            )}>
                              {event.status}
                            </span>
                          </div>
                          
                          <p className="text-sm text-muted-foreground mb-2">{event.description}</p>
                          
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            {event.locationName && (
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {event.locationName}
                              </span>
                            )}
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {event.triggerTime}%
                            </span>
                            <span>{event.duration}% duration</span>
                          </div>
                        </div>
                      </div>
                    </GlassCard>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* List View */}
        {viewMode === 'list' && (
          <div className="flex-1 overflow-y-auto p-6">
            <div className="max-w-4xl mx-auto space-y-2">
              {sortedEvents.map(event => (
                <div
                  key={event.id}
                  onClick={() => setSelectedEvent(event.id)}
                  className={cn(
                    "flex items-center gap-4 p-4 bg-card rounded-xl border-2 cursor-pointer transition-all",
                    selectedEvent === event.id ? "border-primary" : "border-transparent hover:border-border"
                  )}
                >
                  <span className="text-2xl">{event.icon}</span>
                  
                  <div className="flex-1">
                    <h3 className="font-medium">{event.title}</h3>
                    <p className="text-sm text-muted-foreground">{event.description}</p>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    {event.locationName && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {event.locationName}
                      </span>
                    )}
                    <span>{event.triggerTime}%</span>
                    <span className={cn(
                      "px-2 py-0.5 rounded text-xs",
                      event.status === 'completed' ? "bg-green-500/20 text-green-600" :
                      event.status === 'active' ? "bg-blue-500/20 text-blue-600" :
                      event.status === 'scheduled' ? "bg-yellow-500/20 text-yellow-600" :
                      "bg-gray-500/20 text-gray-600"
                    )}>
                      {event.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Map View */}
        {viewMode === 'map' && (
          <div className="flex-1 overflow-y-auto p-6">
            <div className="max-w-4xl mx-auto">
              <div className="aspect-video bg-muted rounded-xl relative overflow-hidden">
                {/* Simple map representation */}
                <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-blue-100" />
                
                {/* Location markers */}
                {sampleLocations.map((loc, i) => {
                  const x = 20 + (i % 3) * 30;
                  const y = 20 + Math.floor(i / 3) * 40;
                  const locEvents = events.filter(e => e.locationId === loc.id);
                  
                  return (
                    <div
                      key={loc.id}
                      className="absolute transform -translate-x-1/2 -translate-y-1/2"
                      style={{ left: `${x}%`, top: `${y}%` }}
                    >
                      <div className="relative">
                        <div className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-2xl">
                          📍
                        </div>
                        
                        {locEvents.length > 0 && (
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">
                            {locEvents.length}
                          </div>
                        )}
                        
                        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 whitespace-nowrap bg-black/70 text-white text-xs px-2 py-1 rounded">
                          {loc.name}
                        </div>
                      </div>
                    </div>
                  );
                })}
                
                {/* Events without location */}
                <div className="absolute bottom-4 left-4 bg-white/90 rounded-lg p-2 text-sm">
                  <p className="font-medium">Regional Events</p>
                  <p className="text-muted-foreground">{events.filter(e => !e.locationId).length} events</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Right Panel - Event Details */}
      <AnimatePresence>
        {selectedEventData && (
          <motion.div
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            className="w-80 border-l border-border bg-card/50 flex flex-col"
          >
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h3 className="font-semibold">Event Details</h3>
              <button 
                onClick={() => setSelectedEvent(null)}
                className="p-2 hover:bg-accent rounded-lg"
              >
                ×
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Header */}
              <div className="text-center">
                <div className="text-5xl mb-2">{selectedEventData.icon}</div>
                
                <input
                  type="text"
                  value={selectedEventData.title}
                  onChange={(e) => updateEvent(selectedEventData.id, { title: e.target.value })}
                  className="font-bold text-lg bg-transparent border-b border-transparent hover:border-input focus:border-primary outline-none w-full text-center"
                />
                
                <select
                  value={selectedEventData.status}
                  onChange={(e) => updateEvent(selectedEventData.id, { status: e.target.value as EventStatus })}
                  className="mt-2 text-sm bg-muted rounded-lg px-3 py-1"
                >
                  <option value="draft">Draft</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Description</label>
                <textarea
                  value={selectedEventData.description}
                  onChange={(e) => updateEvent(selectedEventData.id, { description: e.target.value })}
                  className="w-full h-24 p-3 bg-muted rounded-lg resize-none"
                />
              </div>

              {/* Location */}
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Location</label>
                <select
                  value={selectedEventData.locationId || ''}
                  onChange={(e) => {
                    const loc = sampleLocations.find(l => l.id === e.target.value);
                    updateEvent(selectedEventData.id, { 
                      locationId: e.target.value || null,
                      locationName: loc?.name || null
                    });
                  }}
                  className="w-full p-2 bg-muted rounded-lg"
                >
                  <option value="">Regional (No specific location)</option>
                  {sampleLocations.map(loc => (
                    <option key={loc.id} value={loc.id}>{loc.name}</option>
                  ))}
                </select>
              </div>

              {/* Timing */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Trigger (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={selectedEventData.triggerTime}
                    onChange={(e) => updateEvent(selectedEventData.id, { triggerTime: Number(e.target.value) })}
                    className="w-full p-2 bg-muted rounded-lg"
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Duration (%)</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={selectedEventData.duration}
                    onChange={(e) => updateEvent(selectedEventData.id, { duration: Number(e.target.value) })}
                    className="w-full p-2 bg-muted rounded-lg"
                  />
                </div>
              </div>

              {/* Requirements */}
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Requirements</label>
                <div className="space-y-2">
                  {selectedEventData.requirements.map((req, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      <span className="text-sm">{req}</span>
                      <button 
                        onClick={() => updateEvent(selectedEventData.id, {
                          requirements: selectedEventData.requirements.filter((_, idx) => idx !== i)
                        })}
                        className="ml-auto text-destructive"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <button 
                    onClick={() => {
                      const req = prompt('Add requirement:');
                      if (req) updateEvent(selectedEventData.id, {
                        requirements: [...selectedEventData.requirements, req]
                      });
                    }}
                    className="text-sm text-primary hover:underline"
                  >
                    + Add requirement
                  </button>
                </div>
              </div>

              {/* Consequences */}
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Consequences</label>
                <div className="space-y-2">
                  {selectedEventData.consequences.map((con, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-blue-500" />
                      <span className="text-sm">{con}</span>
                      <button 
                        onClick={() => updateEvent(selectedEventData.id, {
                          consequences: selectedEventData.consequences.filter((_, idx) => idx !== i)
                        })}
                        className="ml-auto text-destructive"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <button 
                    onClick={() => {
                      const con = prompt('Add consequence:');
                      if (con) updateEvent(selectedEventData.id, {
                        consequences: [...selectedEventData.consequences, con]
                      });
                    }}
                    className="text-sm text-primary hover:underline"
                  >
                    + Add consequence
                  </button>
                </div>
              </div>

              {/* Participants */}
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Participants</label>
                <div className="flex flex-wrap gap-2">
                  {selectedEventData.participants.map((p, i) => (
                    <span key={i} className="px-2 py-1 bg-muted rounded-full text-sm flex items-center gap-1">
                      {p}
                      <button 
                        onClick={() => updateEvent(selectedEventData.id, {
                          participants: selectedEventData.participants.filter((_, idx) => idx !== i)
                        })}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  <button 
                    onClick={() => {
                      const p = prompt('Add participant:');
                      if (p) updateEvent(selectedEventData.id, {
                        participants: [...selectedEventData.participants, p]
                      });
                    }}
                    className="px-2 py-1 border border-dashed border-border rounded-full text-sm hover:border-primary"
                  >
                    + Add
                  </button>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-border">
              <button
                onClick={() => deleteEvent(selectedEventData.id)}
                className="w-full flex items-center justify-center gap-2 p-3 text-destructive hover:bg-destructive/10 rounded-xl"
              >
                <Trash2 className="w-4 h-4" />
                Delete Event
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create Event Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-2xl"
          >
            <GlassCard className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Create New Event</h2>
                <button 
                  onClick={() => setShowCreateModal(false)}
                  className="p-2 hover:bg-accent rounded-lg"
                >
                  ×
                </button>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {eventTypes.map(type => (
                  <button
                    key={type.id}
                    onClick={() => createEvent(type.id)}
                    className="p-4 bg-muted rounded-xl hover:bg-accent transition-colors text-left"
                  >
                    <div className="text-3xl mb-2">{type.icon}</div>
                    <div className="font-medium">{type.label}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {events.filter(e => e.type === type.id).length} existing
                    </div>
                  </button>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        </div>
      )}
    </div>
  );
}
