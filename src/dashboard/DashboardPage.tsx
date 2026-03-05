import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, generateId, type Story } from '../db/database';
import { useLiveQuery } from 'dexie-react-hooks';
import { Plus, BookOpen, Trash2, Upload } from 'lucide-react';
import { cn } from '../lib/utils';

export function DashboardPage() {
  const navigate = useNavigate();
  const stories = useLiveQuery(() => 
    db.stories.orderBy('updatedAt').reverse().toArray()
  ) || [];
  
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [storyToDelete, setStoryToDelete] = useState<Story | null>(null);
  
  const handleCreate = async () => {
    if (!newTitle.trim()) return;
    
    const story: Story = {
      id: generateId(),
      title: newTitle.trim(),
      description: newDescription.trim(),
      tags: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      settings: { worldLevels: ['World', 'Country', 'City', 'Building', 'Inside Building'] },
      canvasHue: 220,
      timelineTags: []
    };
    
    await db.stories.add(story);
    setIsCreateOpen(false);
    setNewTitle('');
    setNewDescription('');
    navigate(`/story/${story.id}`);
  };
  
  const handleDelete = async () => {
    if (!storyToDelete) return;
    await db.stories.delete(storyToDelete.id);
    setStoryToDelete(null);
  };
  
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Bibliarch</h1>
              <p className="text-muted-foreground">{stories.length} {stories.length === 1 ? 'project' : 'projects'}</p>
            </div>
          </div>
        </header>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {/* New Story Card */}
          <button
            onClick={() => setIsCreateOpen(true)}
            className={cn(
              "aspect-[2/3] rounded-xl border-2 border-dashed border-border",
              "hover:border-primary/50 hover:bg-accent/50 transition-all",
              "flex flex-col items-center justify-center gap-3"
            )}
          >
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Plus className="w-6 h-6 text-primary" />
            </div>
            <span className="font-medium text-muted-foreground">New Story</span>
          </button>
          
          {/* Story Cards */}
          {stories.map((story) => (
            <div
              key={story.id}
              onClick={() => navigate(`/story/${story.id}`)}
              className={cn(
                "group aspect-[2/3] rounded-xl overflow-hidden cursor-pointer",
                "border border-border hover:border-primary/30 transition-all",
                "hover:shadow-lg hover:scale-[1.02]"
              )}
            >
              {story.coverImage ? (
                <img
                  src={URL.createObjectURL(new Blob([story.coverImage]))}
                  alt={story.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-b from-muted/50 to-background flex items-center justify-center">
                  <BookOpen className="w-12 h-12 text-muted-foreground/30" />
                </div>
              )}
              
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                <h3 className="font-semibold text-white truncate">{story.title}</h3>
                {story.description && (
                  <p className="text-xs text-white/70 line-clamp-2">{story.description}</p>
                )}
              </div>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setStoryToDelete(story);
                }}
                className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/50 text-white/70 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
        
        {/* Empty State */}
        {stories.length === 0 && (
          <div className="text-center py-24">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-muted flex items-center justify-center">
              <BookOpen className="w-9 h-9 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No stories yet</h3>
            <p className="text-muted-foreground max-w-xs mx-auto">Create your first story to start building characters, worlds, and scenes.</p>
          </div>
        )}
      </div>
      
      {/* Create Dialog */}
      {isCreateOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card border border-border rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Create New Story</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                  placeholder="My Amazing Story"
                  autoFocus
                  className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Description (optional)</label>
                <textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="A brief description..."
                  rows={3}
                  className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setIsCreateOpen(false)}
                className="px-4 py-2 rounded-md hover:bg-accent"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={!newTitle.trim()}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Delete Dialog */}
      {storyToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card border border-border rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-2">Delete Story</h2>
            <p className="text-muted-foreground mb-6">
              Are you sure? This will permanently delete "{storyToDelete.title}" and all its data.
            </p>
            
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setStoryToDelete(null)}
                className="px-4 py-2 rounded-md hover:bg-accent"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}