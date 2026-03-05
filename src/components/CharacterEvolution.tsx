import { useState } from 'react';
import { useStoryStore } from '../stores/storyStore';
import { GlassCard } from '../components/GlassCard';
import { cn } from '../lib/utils';
import { 
  Clock, RotateCcw, ChevronLeft, ChevronRight,
  Save, Sparkles, History
} from 'lucide-react';

interface TimelineVersion {
  id: string;
  label: string;
  timestamp: string;
  description: string;
  color: string;
}

export function CharacterEvolutionPanel({ characterId }: { characterId: string }) {
  const { characters, updateCharacter } = useStoryStore();
  const character = characters.find(c => c.id === characterId);
  
  const [versions, setVersions] = useState<TimelineVersion[]>([
    { id: 'start', label: 'Beginning', timestamp: 'Chapter 1', description: 'Initial personality', color: '#22c55e' },
    { id: 'mid', label: 'Growth', timestamp: 'Chapter 5', description: 'After the incident', color: '#3b82f6' },
    { id: 'end', label: 'End', timestamp: 'Chapter 10', description: 'Final form', color: '#a855f7' },
  ]);
  
  const [activeVersion, setActiveVersion] = useState('start');
  const [isComparing, setIsComparing] = useState(false);

  if (!character) return null;

  return (
    <GlassCard className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-violet-500" />
          <h3 className="font-semibold">Character Evolution</h3>
        </div>
        
        <button
          onClick={() => setIsComparing(!isComparing)}
          className={cn(
            "text-xs px-3 py-1.5 rounded-lg transition-colors",
            isComparing ? "bg-primary text-primary-foreground" : "bg-accent"
          )}
        >
          {isComparing ? 'Stop Compare' : 'Compare Versions'}
        </button>
      </div>

      {/* Timeline Track */}
      <div className="relative mb-6">
        {/* Track Line */}
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-muted -translate-y-1/2" />
        
        {/* Version Points */}
        <div className="relative flex justify-between">
          {versions.map((version, index) => (
            <button
              key={version.id}
              onClick={() => setActiveVersion(version.id)}
              className="flex flex-col items-center group"
            >
              <div
                className={cn(
                  "w-4 h-4 rounded-full border-2 transition-all z-10",
                  activeVersion === version.id
                    ? "scale-150 border-primary bg-primary"
                    : "border-muted-foreground bg-background group-hover:border-primary"
                )}
                style={{ 
                  backgroundColor: activeVersion === version.id ? version.color : undefined 
                }}
              />
              <span className={cn(
                "text-xs mt-2 font-medium transition-colors",
                activeVersion === version.id ? "text-primary" : "text-muted-foreground"
              )}>
                {version.label}
              </span>
              <span className="text-[10px] text-muted-foreground">{version.timestamp}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Active Version Details */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Current Version:</span>
          <span className="text-sm text-muted-foreground">
            {versions.find(v => v.id === activeVersion)?.label}
          </span>
        </div>

        <div className="p-3 bg-muted/50 rounded-lg">
          <div className="text-xs text-muted-foreground mb-1">Personality State</div>
          <p className="text-sm">
            {versions.find(v => v.id === activeVersion)?.description}
          </p>
        </div>

        {/* Compare View */}
        {isComparing && (
          <div className="mt-4 space-y-2">
            <div className="text-xs font-medium text-muted-foreground uppercase">
              Changes from Previous
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2 bg-red-500/10 rounded border border-red-500/20">
                <div className="text-[10px] text-red-500 uppercase">Before</div>
                <div className="text-xs">Naive, trusting</div>
              </div>
              <div className="p-2 bg-green-500/10 rounded border border-green-500/20">
                <div className="text-[10px] text-green-500 uppercase">After</div>
                <div className="text-xs">Cautious, wise</div>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-accent rounded-lg text-sm hover:bg-accent/80 transition-colors">
            <Save className="w-4 h-4" />
            Save Version
          </button>
          <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-primary text-primary-foreground rounded-lg text-sm hover:bg-primary/90 transition-colors">
            <Sparkles className="w-4 h-4" />
            AI Evolve
          </button>
        </div>
      </div>
    </GlassCard>
  );
}
