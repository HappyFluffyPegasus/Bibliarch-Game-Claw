import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStoryStore } from '../stores/storyStore';
import { BookOpen, Users, Map, Video, Clock } from 'lucide-react';

const sections = [
  { id: 'notes', label: 'Notes', icon: BookOpen, description: 'Canvas-based notes and planning', color: 'from-blue-500 to-cyan-500' },
  { id: 'characters', label: 'Characters', icon: Users, description: 'Character profiles and 3D customizer', color: 'from-purple-500 to-pink-500' },
  { id: 'world', label: 'World', icon: Map, description: 'Terrain, cities, and world building', color: 'from-green-500 to-emerald-500' },
  { id: 'scenes', label: 'Scenes', icon: Video, description: '3D scene choreography', color: 'from-orange-500 to-red-500' },
  { id: 'timeline', label: 'Timeline', icon: Clock, description: 'Story event timeline', color: 'from-yellow-500 to-amber-500' },
];

export function StoryOverviewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentStory, loadStory, isLoading } = useStoryStore();
  
  useEffect(() => {
    if (id) {
      loadStory(id);
    }
  }, [id]);
  
  if (isLoading) {
    return <div className="p-8">Loading...</div>;
  }
  
  if (!currentStory) {
    return <div className="p-8">Story not found</div>;
  }
  
  return (
    <div className="p-8 max-w-5xl mx-auto">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-2">{currentStory.title}</h1>
        {currentStory.description && (
          <p className="text-lg text-muted-foreground">{currentStory.description}</p>
        )}
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <button
              key={section.id}
              onClick={() => navigate(`/story/${id}/${section.id}`)}
              className="p-6 rounded-xl border border-border bg-card hover:border-primary/30 hover:shadow-lg transition-all text-left"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${section.color} flex items-center justify-center mb-4`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl font-semibold mb-1">{section.label}</h2>
              <p className="text-sm text-muted-foreground">{section.description}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}