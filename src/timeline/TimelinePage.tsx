import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useStoryStore } from '../stores/storyStore';
import { Plus, Trash2 } from 'lucide-react';
import { cn } from '../lib/utils';

export function TimelinePage() {
  const { id } = useParams();
  const { currentStory, tracks, events, loadStory } = useStoryStore();
  const [selectedTrack, setSelectedTrack] = useState<string | null>(null);
  const [zoom, setZoom] = useState(100);
  
  const filteredEvents = selectedTrack 
    ? events.filter(e => e.trackId === selectedTrack)
    : events;
  
  if (!currentStory) return <div className="p-8">Loading...</div>;
  
  return (
    <div className="h-screen flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h1 className="text-xl font-semibold">Story Timeline</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setZoom(z => Math.max(50, z - 10))}
              className="px-2 py-1 hover:bg-accent rounded"
            >-</button>
            <span className="text-sm w-12 text-center">{zoom}%</span>
            <button
              onClick={() => setZoom(z => Math.min(200, z + 10))}
              className="px-2 py-1 hover:bg-accent rounded"
            >+</button>
          </div>
          
          <button className="flex items-center gap-2 px-3 py-1.5 bg-primary text-primary-foreground rounded-md">
            <Plus className="w-4 h-4" />
            Add Event
          </button>
        </div>
      </div>
      
      <div className="flex-1 flex overflow-hidden">
        {/* Tracks Sidebar */}
        <div className="w-64 border-r border-border bg-card">
          <div className="p-3 border-b border-border">
            <button className="flex items-center gap-2 text-sm hover:bg-accent px-2 py-1 rounded">
              <Plus className="w-4 h-4" />
              New Track
            </button>
          </div>
          
          <div className="p-2">
            <button
              onClick={() => setSelectedTrack(null)}
              className={cn(
                "w-full text-left px-3 py-2 rounded text-sm",
                selectedTrack === null ? "bg-primary/10" : "hover:bg-accent"
              )}
            >
              All Events
            </button>
            
            {tracks.map(track => (
              <button
                key={track.id}
                onClick={() => setSelectedTrack(track.id)}
                className={cn(
                  "w-full text-left px-3 py-2 rounded text-sm flex items-center gap-2",
                  selectedTrack === track.id ? "bg-primary/10" : "hover:bg-accent"
                )}
              >
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: track.color }}
                />
                {track.name}
              </button>
            ))}
          </div>
        </div>
        
        {/* Timeline */}
        <div className="flex-1 overflow-auto p-4">
          <div className="space-y-2 min-w-[800px]">
            {filteredEvents.length === 0 ? (
              <div className="text-center text-muted-foreground py-20">
                No events yet. Create your first event to get started.
              </div>
            ) : (
              filteredEvents.map(event => (
                <div
                  key={event.id}
                  className="border border-border rounded-lg p-4 hover:border-primary/30 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium">{event.title}</h3>
                      {event.description && (
                        <p className="text-sm text-muted-foreground mt-1">{event.description}</p>
                      )}
                    </div>
                    <button className="p-1 hover:text-destructive">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}