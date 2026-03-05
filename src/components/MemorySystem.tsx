import { useState } from 'react';
import { Brain, Plus, Clock, Sparkles, Search, Trash2 } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { cn } from '../lib/utils';

interface Memory {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  importance: 'minor' | 'major' | 'crucial';
  tags: string[];
  referencedIn: string[]; // scene IDs where this is mentioned
}

export function MemorySystem({ characterId }: { characterId: string }) {
  const [memories, setMemories] = useState<Memory[]>([
    {
      id: '1',
      title: 'The Storm',
      description: 'Lost their mentor in the great storm of Year 847. This shaped their fear of deep water.',
      timestamp: 'Year 847',
      importance: 'crucial',
      tags: ['trauma', 'mentor', 'storm'],
      referencedIn: ['scene-5', 'scene-12'],
    },
    {
      id: '2',
      title: 'First Flight',
      description: 'Successfully navigated through the Cloudbreaker Pass alone for the first time.',
      timestamp: 'Year 852',
      importance: 'major',
      tags: ['achievement', 'flying'],
      referencedIn: ['scene-3'],
    },
  ]);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filterImportance, setFilterImportance] = useState<string>('all');
  const [isAdding, setIsAdding] = useState(false);
  const [newMemory, setNewMemory] = useState({
    title: '',
    description: '',
    importance: 'minor' as const,
    tags: '',
  });

  const filteredMemories = memories.filter(m => {
    const matchesSearch = m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         m.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         m.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesImportance = filterImportance === 'all' || m.importance === filterImportance;
    return matchesSearch && matchesImportance;
  });

  const addMemory = () => {
    if (!newMemory.title.trim()) return;
    
    const memory: Memory = {
      id: Date.now().toString(),
      title: newMemory.title,
      description: newMemory.description,
      timestamp: new Date().toLocaleDateString(),
      importance: newMemory.importance,
      tags: newMemory.tags.split(',').map(t => t.trim()).filter(Boolean),
      referencedIn: [],
    };
    
    setMemories([memory, ...memories]);
    setNewMemory({ title: '', description: '', importance: 'minor', tags: '' });
    setIsAdding(false);
  };

  const deleteMemory = (id: string) => {
    setMemories(memories.filter(m => m.id !== id));
  };

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case 'crucial': return 'bg-red-500/20 text-red-500 border-red-500/30';
      case 'major': return 'bg-amber-500/20 text-amber-500 border-amber-500/30';
      case 'minor': return 'bg-blue-500/20 text-blue-500 border-blue-500/30';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-violet-500" />
          <h3 className="font-semibold">Memory System</h3>
          <span className="text-xs text-muted-foreground">({memories.length} memories)</span>
        </div>
        
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-sm hover:bg-primary/90"
        >
          <Plus className="w-4 h-4" />
          Add Memory
        </button>
      </div>

      {/* Search & Filter */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search memories..."
            className="w-full pl-9 pr-4 py-2 bg-background border border-input rounded-lg text-sm"
          />
        </div>
        
        <select
          value={filterImportance}
          onChange={(e) => setFilterImportance(e.target.value)}
          className="px-3 py-2 bg-background border border-input rounded-lg text-sm"
        >
          <option value="all">All Importance</option>
          <option value="crucial">Crucial</option>
          <option value="major">Major</option>
          <option value="minor">Minor</option>
        </select>
      </div>

      {/* Add Memory Form */}
       {isAdding && (
        <GlassCard className="p-4">
          <h4 className="font-medium mb-3">New Memory</h4>
          
          <div className="space-y-3">
            <input
              type="text"
              value={newMemory.title}
              onChange={(e) => setNewMemory({ ...newMemory, title: e.target.value })}
              placeholder="Memory title..."
              className="w-full px-3 py-2 bg-background border border-input rounded-lg"
            />
            
            <textarea
              value={newMemory.description}
              onChange={(e) => setNewMemory({ ...newMemory, description: e.target.value })}
              placeholder="What happened..."
              rows={3}
              className="w-full px-3 py-2 bg-background border border-input rounded-lg resize-none"
            />
            
            <div className="flex gap-2">
              <select
                value={newMemory.importance}
                onChange={(e) => setNewMemory({ ...newMemory, importance: e.target.value as any })}
                className="px-3 py-2 bg-background border border-input rounded-lg text-sm"
              >
                <option value="minor">Minor</option>
                <option value="major">Major</option>
                <option value="crucial">Crucial</option>
              </select>
              
              
              <input
                type="text"
                value={newMemory.tags}
                onChange={(e) => setNewMemory({ ...newMemory, tags: e.target.value })}
                placeholder="Tags (comma separated)"
                className="flex-1 px-3 py-2 bg-background border border-input rounded-lg text-sm"
              />
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => setIsAdding(false)}
                className="flex-1 py-2 bg-accent rounded-lg text-sm hover:bg-accent/80"
              >
                Cancel
              </button>
              
              <button
                onClick={addMemory}
                className="flex-1 py-2 bg-primary text-primary-foreground rounded-lg text-sm hover:bg-primary/90"
              >
                Save Memory
              </button>
            </div>
          </div>
        </GlassCard>
      )}

      {/* Memories List */}
      <div className="space-y-2">
        {filteredMemories.map(memory => (
          <GlassCard key={memory.id} className="p-3 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium">{memory.title}</h4>
                  <span className={cn("text-[10px] px-2 py-0.5 rounded-full border", getImportanceColor(memory.importance))}>
                    {memory.importance}
                  </span>
                </div>
                
                <p className="text-sm text-muted-foreground mb-2">{memory.description}</p>
                
                <div className="flex items-center gap-3 text-xs">
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    {memory.timestamp}
                  </span>
                  
                  {memory.tags.map(tag => (
                    <span key={tag} className="text-violet-500">
                      #{tag}
                    </span>
                  ))}
                  
                  {memory.referencedIn.length > 0 && (
                    <span className="text-muted-foreground">
                      Referenced in {memory.referencedIn.length} scenes
                    </span>
                  )}
                </div>
              </div>
              
              <button
                onClick={() => deleteMemory(memory.id)}
                className="p-1.5 hover:text-destructive transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </GlassCard>
        ))}
      </div>

      {filteredMemories.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <Brain className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>No memories found</p>
          <p className="text-sm">Add memories to help AI understand your character</p>
        </div>
      )}
    </div>
  );
}
