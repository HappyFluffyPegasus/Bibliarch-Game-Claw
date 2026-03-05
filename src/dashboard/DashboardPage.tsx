import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, generateId, type Story } from '../db/database';
import { Plus, BookOpen, Trash2, Sparkles, Search, Clock, Users, Map } from 'lucide-react';
import { cn } from '../lib/utils';
import { GlassCard, AnimatedContainer, GradientText, Badge } from '../components/GlassCard';
import { AIAssistant } from '../components/AIAssistant';

export function DashboardPage() {
  const navigate = useNavigate();
  const [stories, setStories] = useState<Story[]>([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [storyToDelete, setStoryToDelete] = useState<Story | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    const loadStories = async () => {
      const allStories = await db.stories.orderBy('updatedAt').reverse().toArray();
      setStories(allStories);
    };
    loadStories();
    
    // Refresh every 5 seconds
    const interval = setInterval(loadStories, 5000);
    return () => clearInterval(interval);
  }, []);
  
  const filteredStories = stories.filter(s => 
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate stats
  const totalStories = stories.length;
  const totalCharacters = stories.reduce((sum, s) => sum + (s.settings?.worldLevels?.length || 0), 0);

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

  const getTimeAgo = (date: string) => {
    const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Hero Header */}
        <AnimatedContainer>
          <header className="mb-12">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-600 flex items-center justify-center shadow-2xl shadow-violet-500/25">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold">
                    <GradientText>Bibliarch</GradientText>
                  </h1>
                  <p className="text-muted-foreground">Where stories come to life</p>
                </div>
              </div>

              <AIAssistant context="canvas" />
            </div>

            {/* Stats Bar */}
            <div className="flex gap-6 mt-8">
              <GlassCard className="flex items-center gap-3 px-4 py-3">
                <BookOpen className="w-5 h-5 text-violet-500" />
                <div>
                  <div className="text-2xl font-bold">{totalStories}</div>
                  <div className="text-xs text-muted-foreground">Stories</div>
                </div>
              </GlassCard>

              <GlassCard className="flex items-center gap-3 px-4 py-3">
                <Clock className="w-5 h-5 text-blue-500" />
                <div>
                  <div className="text-2xl font-bold">{stories.filter(s => {
                    const daysSince = (Date.now() - new Date(s.updatedAt).getTime()) / (1000 * 60 * 60 * 24);
                    return daysSince < 7;
                  }).length}</div>
                  <div className="text-xs text-muted-foreground">Active this week</div>
                </div>
              </GlassCard>
            </div>
          </header>
        </AnimatedContainer>

        {/* Search and Filter */}
        <AnimatedContainer delay={100}>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search stories..."
                className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>
        </AnimatedContainer>
        
        {/* Story Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {/* New Story Card */}
          <AnimatedContainer delay={200}>
            <button
              onClick={() => setIsCreateOpen(true)}
              className={cn(
                "aspect-[4/5] rounded-2xl border-2 border-dashed border-border",
                "hover:border-primary/50 hover:bg-primary/5 transition-all duration-300",
                "flex flex-col items-center justify-center gap-4 group"
              )}
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500/20 to-indigo-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Plus className="w-8 h-8 text-violet-500" />
              </div>
              <div className="text-center">
                <span className="font-semibold text-lg">New Story</span>
                <p className="text-sm text-muted-foreground">Start creating</p>
              </div>
            </button>
          </AnimatedContainer>
          
          {/* Story Cards */}
          {filteredStories.map((story, index) => (
            <AnimatedContainer key={story.id} delay={300 + index * 50}>
              <GlassCard 
                hover 
                className="aspect-[4/5] cursor-pointer group relative overflow-hidden"
                onClick={() => navigate(`/story/${story.id}`)}
>
                {story.coverImage ? (
                  <img
                    src={URL.createObjectURL(new Blob([story.coverImage]))}
                    alt={story.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 via-indigo-600/20 to-blue-600/20" />
                )}
                
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                
                {/* Content */}
                <div className="absolute inset-0 p-5 flex flex-col justify-end">
                  <Badge variant="primary" className="self-start mb-2">
                    {getTimeAgo(story.updatedAt)}
                  </Badge>
                  
                  <h3 className="font-bold text-xl text-white mb-1 line-clamp-2">{story.title}</h3>
                  
                  {story.description && (
                    <p className="text-sm text-white/70 line-clamp-2 mb-3">{story.description}</p>
                  )}
                  
                  <div className="flex items-center gap-3 text-xs text-white/50">
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      Characters
                    </span>
                    <span className="flex items-center gap-1">
                      <Map className="w-3 h-3" />
                      World
                    </span>
                  </div>
                </div>
                
                {/* Delete button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setStoryToDelete(story);
                  }}
                  className="absolute top-3 right-3 p-2 rounded-lg bg-black/50 text-white/70 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </GlassCard>
            </AnimatedContainer>
          ))}
        </div>
        
        {/* Empty State */}
        {filteredStories.length === 0 && searchQuery && (
          <div className="text-center py-20">
            <Search className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No stories found</h3>
            <p className="text-muted-foreground">Try a different search term</p>
          </div>
        )}

        {stories.length === 0 && !searchQuery && (
          <AnimatedContainer delay={200}>
            <div className="text-center py-24">
              <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-violet-500/20 to-indigo-500/20 flex items-center justify-center">
                <Sparkles className="w-12 h-12 text-violet-500" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Begin your journey</h3>
              <p className="text-muted-foreground max-w-md mx-auto mb-6">
                Create your first story and bring your world to life with characters, 
                scenes, and epic adventures.
              </p>
              <button
                onClick={() => setIsCreateOpen(true)}
                className="px-6 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-violet-500/25 transition-all"
              >
                Create Your First Story
              </button>
            </div>
          </AnimatedContainer>
        )}
      </div>
      
      {/* Create Dialog */}
      {isCreateOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <AnimatedContainer className="w-full max-w-md mx-4">
            <GlassCard className="p-6">
              <h2 className="text-2xl font-bold mb-1">Create New Story</h2>
              <p className="text-muted-foreground mb-6">Give your story a title to begin</p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Title *</label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                    placeholder="The Epic Adventure"
                    autoFocus
                    className="w-full px-4 py-3 bg-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-lg"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1.5">Description</label>
                  <textarea
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    placeholder="What's this story about?"
                    rows={3}
                    className="w-full px-4 py-3 bg-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setIsCreateOpen(false)}
                  className="px-5 py-2.5 rounded-xl hover:bg-accent transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreate}
                  disabled={!newTitle.trim()}
                  className="px-5 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-violet-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Create Story
                </button>
              </div>
            </GlassCard>
          </AnimatedContainer>
        </div>
      )}
      
      {/* Delete Dialog */}
      {storyToDelete && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <GlassCard className="p-6 w-full max-w-sm mx-4">
            <h2 className="text-xl font-bold mb-2">Delete Story</h2>
            <p className="text-muted-foreground mb-6">
              Are you sure? This will permanently delete "{storyToDelete.title}" and all its data.
            </p>
            
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setStoryToDelete(null)}
                className="px-4 py-2 rounded-lg hover:bg-accent"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90"
              >
                Delete
              </button>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
}