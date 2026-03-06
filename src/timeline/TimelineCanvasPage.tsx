import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Clock, GripVertical, Plus, Trash2, Edit3, Eye, EyeOff,
  ChevronRight, ChevronLeft, Play, Pause, Maximize2,
  Type, Image as ImageIcon, Music, Video, MessageSquare,
  MoreHorizontal, Copy, Link2, ArrowRight
} from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { cn } from '../lib/utils';

// Note types for the timeline
type NoteType = 'text' | 'dialogue' | 'scene' | 'event' | 'milestone';

interface TimelineNote {
  id: string;
  type: NoteType;
  title: string;
  content: string;
  timestamp: number; // Position on timeline (0-100% or time in minutes)
  trackId: string;
  duration: number;
  color: string;
  icon: string;
  tags: string[];
  isExpanded: boolean;
}

interface TimelineTrack {
  id: string;
  name: string;
  color: string;
  isVisible: boolean;
  isLocked: boolean;
}

const noteTypeConfig: Record<NoteType, { label: string; icon: React.ReactNode; colors: string[] }> = {
  text: { 
    label: 'Text', 
    icon: <Type className="w-4 h-4" />,
    colors: ['#3b82f6', '#60a5fa', '#93c5fd']
  },
  dialogue: { 
    label: 'Dialogue', 
    icon: <MessageSquare className="w-4 h-4" />,
    colors: ['#10b981', '#34d399', '#6ee7b7']
  },
  scene: { 
    label: 'Scene', 
    icon: <Video className="w-4 h-4" />,
    colors: ['#8b5cf6', '#a78bfa', '#c4b5fd']
  },
  event: { 
    label: 'Event', 
    icon: <Clock className="w-4 h-4" />,
    colors: ['#f59e0b', '#fbbf24', '#fcd34d']
  },
  milestone: { 
    label: 'Milestone', 
    icon: <Maximize2 className="w-4 h-4" />,
    colors: ['#ef4444', '#f87171', '#fca5a5']
  },
};

const sampleTracks: TimelineTrack[] = [
  { id: 'main', name: 'Main Story', color: '#3b82f6', isVisible: true, isLocked: false },
  { id: 'character', name: 'Character Arcs', color: '#10b981', isVisible: true, isLocked: false },
  { id: 'side', name: 'Side Quests', color: '#f59e0b', isVisible: true, isLocked: false },
  { id: 'lore', name: 'World Lore', color: '#8b5cf6', isVisible: true, isLocked: false },
];

const sampleNotes: TimelineNote[] = [
  {
    id: '1',
    type: 'milestone',
    title: 'The Beginning',
    content: 'Our hero discovers the ancient artifact in the ruins of Eldoria...',
    timestamp: 5,
    trackId: 'main',
    duration: 0,
    color: '#ef4444',
    icon: '⚔️',
    tags: ['intro', 'artifact'],
    isExpanded: false,
  },
  {
    id: '2',
    type: 'dialogue',
    title: 'Meeting the Mentor',
    content: '"You must be careful with that power, young one. It has destroyed greater heroes than you."',
    timestamp: 15,
    trackId: 'character',
    duration: 10,
    color: '#10b981',
    icon: '💬',
    tags: ['mentor', 'warning'],
    isExpanded: false,
  },
  {
    id: '3',
    type: 'scene',
    title: 'The Forest Escape',
    content: 'A tense chase scene through the Whisperwood Forest. Use dynamic camera angles.',
    timestamp: 30,
    trackId: 'main',
    duration: 15,
    color: '#8b5cf6',
    icon: '🎬',
    tags: ['action', 'forest'],
    isExpanded: false,
  },
  {
    id: '4',
    type: 'text',
    title: 'Village Description',
    content: 'The village of Mosshaven sits in a peaceful valley, surrounded by ancient oak trees...',
    timestamp: 50,
    trackId: 'lore',
    duration: 5,
    color: '#3b82f6',
    icon: '📝',
    tags: ['setting', 'village'],
    isExpanded: false,
  },
  {
    id: '5',
    type: 'event',
    title: 'The Festival',
    content: 'Annual Harvest Festival - opportunity for character interactions and plot exposition.',
    timestamp: 70,
    trackId: 'side',
    duration: 20,
    color: '#f59e0b',
    icon: '🎪',
    tags: ['festival', 'social'],
    isExpanded: false,
  },
];

export function TimelineCanvasPage() {
  const [tracks, setTracks] = useState<TimelineTrack[]>(sampleTracks);
  const [notes, setNotes] = useState<TimelineNote[]>(sampleNotes);
  const [selectedNote, setSelectedNote] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [activeTool, setActiveTool] = useState<'select' | 'add'>('select');
  const [selectedType, setSelectedType] = useState<NoteType>('text');
  const [isDragging, setIsDragging] = useState(false);

  const timelineRef = useRef<HTMLDivElement>(null);

  // Create new note at timestamp
  const createNote = (trackId: string, timestamp: number) => {
    const config = noteTypeConfig[selectedType];
    const newNote: TimelineNote = {
      id: Date.now().toString(),
      type: selectedType,
      title: `New ${config.label}`,
      content: '',
      timestamp,
      trackId,
      duration: 10,
      color: config.colors[0],
      icon: getIconForType(selectedType),
      tags: [],
      isExpanded: true,
    };
    setNotes([...notes, newNote]);
    setSelectedNote(newNote.id);
  };

  const getIconForType = (type: NoteType): string => {
    const icons: Record<NoteType, string> = {
      text: '📝',
      dialogue: '💬',
      scene: '🎬',
      event: '📅',
      milestone: '🎯',
    };
    return icons[type];
  };

  // Update note
  const updateNote = (id: string, updates: Partial<TimelineNote>) => {
    setNotes(notes.map(n => n.id === id ? { ...n, ...updates } : n));
  };

  // Delete note
  const deleteNote = (id: string) => {
    setNotes(notes.filter(n => n.id !== id));
    if (selectedNote === id) setSelectedNote(null);
  };

  // Handle timeline click to add note
  const handleTimelineClick = (e: React.MouseEvent, trackId: string) => {
    if (activeTool === 'add') {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const timestamp = (x / rect.width) * 100;
      createNote(trackId, Math.max(0, Math.min(95, timestamp)));
      setActiveTool('select');
    }
  };

  // Drag note on timeline
  const handleNoteDrag = (noteId: string, deltaX: number, trackWidth: number) => {
    const note = notes.find(n => n.id === noteId);
    if (!note) return;
    
    const timeDelta = (deltaX / trackWidth) * 100;
    updateNote(noteId, { 
      timestamp: Math.max(0, Math.min(95, note.timestamp + timeDelta)) 
    });
  };

  const selectedNoteData = notes.find(n => n.id === selectedNote);

  return (
    <div className="h-screen flex bg-background">
      {/* Left Sidebar - Tools & Types */}
      <div className="w-64 border-r border-border bg-card/50 flex flex-col">
        <div className="p-4 border-b border-border">
          <h2 className="font-semibold flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Timeline Canvas
          </h2>
        </div>

        {/* Tools */}
        <div className="p-4 border-b border-border">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTool('select')}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 p-2 rounded-lg transition-colors",
                activeTool === 'select' ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-accent"
              )}
            >
              <GripVertical className="w-4 h-4" />
              Select
            </button>
            
            <button
              onClick={() => setActiveTool('add')}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 p-2 rounded-lg transition-colors",
                activeTool === 'add' ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-accent"
              )}
            >
              <Plus className="w-4 h-4" />
              Add
            </button>
          </div>
        </div>

        {/* Note Types */}
        <div className="flex-1 overflow-y-auto p-4">
          <h3 className="text-sm font-medium text-muted-foreground mb-3">Note Type</h3>
          
          <div className="space-y-2">
            {(Object.keys(noteTypeConfig) as NoteType[]).map(type => {
              const config = noteTypeConfig[type];
              return (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={cn(
                    "w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all",
                    selectedType === type
                      ? "border-primary bg-primary/10"
                      : "border-transparent hover:border-primary/30 bg-muted"
                  )}
                >
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: config.colors[0] + '20', color: config.colors[0] }}
                  >
                    {config.icon}
                  </div>
                  
                  <div className="text-left">
                    <p className="font-medium">{config.label}</p>
                    <p className="text-xs text-muted-foreground">Add to timeline</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tracks List */}
        <div className="p-4 border-t border-border">
          <h3 className="text-sm font-medium text-muted-foreground mb-3">Tracks</h3>
          
          <div className="space-y-1">
            {tracks.map(track => (
              <div key={track.id} className="flex items-center gap-2">
                <button
                  onClick={() => setTracks(tracks.map(t => 
                    t.id === track.id ? { ...t, isVisible: !t.isVisible } : t
                  ))}
                  className={cn(
                    "p-1 rounded transition-colors",
                    track.isVisible ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {track.isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
                
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: track.color }}
                />
                
                <span className="text-sm flex-1">{track.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Timeline Area */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-card/50">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-10 h-10 flex items-center justify-center bg-primary text-primary-foreground rounded-full"
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </button>
            
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="0"
                max="100"
                value={currentTime}
                onChange={(e) => setCurrentTime(Number(e.target.value))}
                className="w-48"
              />
              <span className="text-sm font-mono w-12">{currentTime.toFixed(0)}%</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => setZoom(z => Math.max(0.5, z - 0.1))}
              className="p-2 hover:bg-accent rounded-lg"
            >
              −
            </button>
            
            <span className="text-sm w-16 text-center">{Math.round(zoom * 100)}%</span>
            
            <button 
              onClick={() => setZoom(z => Math.min(2, z + 0.1))}
              className="p-2 hover:bg-accent rounded-lg"
            >
              +
            </button>
          </div>
        </div>

        {/* Timeline Tracks */}
        <div className="flex-1 overflow-x-auto overflow-y-hidden bg-muted/30">
          <div 
            className="relative min-w-full h-full p-4"
            style={{ minWidth: `${100 * zoom}%` }}
          >
            {/* Time markers */}
            <div className="flex justify-between text-xs text-muted-foreground mb-2 px-2">
              {[0, 25, 50, 75, 100].map(mark => (
                <span key={mark}>{mark}%</span>
              ))}
            </div>

            {/* Tracks */}
            <div className="space-y-4">
              {tracks.filter(t => t.isVisible).map(track => (
                <div key={track.id} className="relative">
                  {/* Track header */}
                  <div className="flex items-center gap-2 mb-1">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: track.color }}
                    />
                    <span className="text-sm font-medium">{track.name}</span>
                  </div>

                  {/* Track lane */}
                  <div 
                    ref={timelineRef}
                    className={cn(
                      "relative h-32 rounded-xl border-2 border-dashed transition-colors",
                      activeTool === 'add' 
                        ? "border-primary bg-primary/5 cursor-crosshair" 
                        : "border-border bg-card/30"
                    )}
                    style={{ 
                      backgroundImage: 'linear-gradient(to right, rgba(0,0,0,0.03) 1px, transparent 1px)',
                      backgroundSize: '10% 100%'
                    }}
                    onClick={(e) => handleTimelineClick(e, track.id)}
                  >
                    {/* Notes on this track */}
                    {notes.filter(n => n.trackId === track.id).map(note => (
                      <motion.div
                        key={note.id}
                        drag="x"
                        dragConstraints={timelineRef}
                        dragMomentum={false}
                        onDragEnd={(_, info) => {
                          if (timelineRef.current) {
                            handleNoteDrag(note.id, info.offset.x, timelineRef.current.offsetWidth);
                          }
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedNote(note.id);
                        }}
                        className={cn(
                          "absolute top-2 h-28 rounded-xl p-3 cursor-pointer transition-all overflow-hidden",
                          selectedNote === note.id 
                            ? "ring-2 ring-primary ring-offset-2 z-10" 
                            : "hover:scale-[1.02] z-0"
                        )}
                        style={{
                          left: `${note.timestamp}%`,
                          width: `${Math.max(15, note.duration)}%`,
                          backgroundColor: note.color + '20',
                          borderColor: note.color,
                          borderWidth: '2px',
                        }}
                      >
                        <div className="flex items-start gap-2">
                          <span className="text-2xl">{note.icon}</span>
                          
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{note.title}</p>
                            <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                              {note.content || 'No content yet...'}
                            </p>
                            
                            {/* Tags */}
                            {note.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {note.tags.slice(0, 2).map(tag => (
                                  <span key={tag} className="text-[10px] px-1.5 py-0.5 bg-black/10 rounded-full">
                                    #{tag}
                                  </span>
                                ))}
                                {note.tags.length > 2 && (
                                  <span className="text-[10px] px-1.5 py-0.5 bg-black/10 rounded-full">
                                    +{note.tags.length - 2}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Note Editor */}
      {selectedNoteData && (
        <AnimatePresence>
          <motion.div
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            className="w-80 border-l border-border bg-card/50 flex flex-col"
          >
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h3 className="font-semibold">Edit Note</h3>
              
              <button 
                onClick={() => setSelectedNote(null)}
                className="p-2 hover:bg-accent rounded-lg">
                ×
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Type selector */}
              <div>
                <label className="text-sm font-medium mb-2 block">Type</label>
                <div className="grid grid-cols-3 gap-2">
                  {(Object.keys(noteTypeConfig) as NoteType[]).map(type => {
                    const config = noteTypeConfig[type];
                    return (
                      <button
                        key={type}
                        onClick={() => {
                          updateNote(selectedNoteData.id, { 
                            type, 
                            color: config.colors[0],
                            icon: getIconForType(type)
                          });
                        }}
                        className={cn(
                          "p-2 rounded-lg border-2 transition-all text-center",
                          selectedNoteData.type === type
                            ? "border-primary bg-primary/10"
                            : "border-transparent bg-muted hover:border-primary/30"
                        )}
                      >
                        <div 
                          className="w-8 h-8 rounded-lg mx-auto mb-1 flex items-center justify-center"
                          style={{ backgroundColor: config.colors[0] + '20', color: config.colors[0] }}
                        >
                          {config.icon}
                        </div>
                        <span className="text-xs">{config.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="text-sm font-medium mb-1 block">Title</label>
                <input
                  type="text"
                  value={selectedNoteData.title}
                  onChange={(e) => updateNote(selectedNoteData.id, { title: e.target.value })}
                  className="w-full px-3 py-2 bg-background border border-input rounded-lg"
                />
              </div>

              {/* Content */}
              <div>
                <label className="text-sm font-medium mb-1 block">Content</label>
                <textarea
                  value={selectedNoteData.content}
                  onChange={(e) => updateNote(selectedNoteData.id, { content: e.target.value })}
                  className="w-full h-32 px-3 py-2 bg-background border border-input rounded-lg resize-none"
                  placeholder="Write your story content here..."
                />
              </div>

              {/* Timing */}
              <div>
                <label className="text-sm font-medium mb-1 block">Timeline Position</label>
                <input
                  type="range"
                  min="0"
                  max="95"
                  step="1"
                  value={selectedNoteData.timestamp}
                  onChange={(e) => updateNote(selectedNoteData.id, { timestamp: Number(e.target.value) })}
                  className="w-full"
                />
                <span className="text-xs text-muted-foreground">{selectedNoteData.timestamp.toFixed(0)}%</span>
              </div>

              {/* Duration */}
              <div>
                <label className="text-sm font-medium mb-1 block">Duration</label>
                <input
                  type="range"
                  min="5"
                  max="50"
                  step="5"
                  value={selectedNoteData.duration}
                  onChange={(e) => updateNote(selectedNoteData.id, { duration: Number(e.target.value) })}
                  className="w-full"
                />
                <span className="text-xs text-muted-foreground">{selectedNoteData.duration}% width</span>
              </div>

              {/* Tags */}
              <div>
                <label className="text-sm font-medium mb-2 block">Tags</label>
                <div className="flex flex-wrap gap-2">
                  {selectedNoteData.tags.map(tag => (
                    <span 
                      key={tag} 
                      className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                    >
                      #{tag}
                      <button 
                        onClick={() => updateNote(selectedNoteData.id, { 
                          tags: selectedNoteData.tags.filter(t => t !== tag)
                        })}
                        className="hover:text-destructive">
                        ×
                      </button>
                    </span>
                  ))}
                  
                  
                  <button 
                    onClick={() => {
                      const tag = prompt('Add tag:');
                      if (tag) {
                        updateNote(selectedNoteData.id, { 
                          tags: [...selectedNoteData.tags, tag]
                        });
                      }
                    }}
                    className="px-2 py-1 border border-dashed border-border text-muted-foreground text-xs rounded-full hover:border-primary hover:text-primary"
                  >
                    + Add
                  </button>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-border">
              <button
                onClick={() => deleteNote(selectedNoteData.id)}
                className="w-full flex items-center justify-center gap-2 p-3 text-destructive hover:bg-destructive/10 rounded-xl transition-colors">
                <Trash2 className="w-4 h-4" />
                Delete Note
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
