import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, BookOpen, Sparkles } from 'lucide-react'
import { useAppStore } from '@/stores/appStore'
import type { Story } from '@/types'

const genreColors: Record<string, string> = {
  fantasy: '#8b5cf6',
  scifi: '#06b6d4',
  romance: '#ec4899',
  mystery: '#6366f1',
  horror: '#dc2626',
  adventure: '#f59e0b',
  drama: '#10b981',
  comedy: '#eab308'
}

const templates = [
  { title: 'Fantasy Epic', genre: 'fantasy', description: 'Heroes, magic, and ancient evils' },
  { title: 'Space Opera', genre: 'scifi', description: 'Adventures among the stars' },
  { title: 'Love Story', genre: 'romance', description: 'Matters of the heart' },
  { title: 'Whodunit', genre: 'mystery', description: 'Uncover the truth' }
]

export function Dashboard() {
  const navigate = useNavigate()
  const { stories, addStory } = useAppStore()
  const [showNewStory, setShowNewStory] = useState(false)
  const [newStoryTitle, setNewStoryTitle] = useState('')
  const [newStoryGenre, setNewStoryGenre] = useState('fantasy')
  
  const handleCreateStory = () => {
    if (!newStoryTitle.trim()) return
    
    const story = addStory({
      title: newStoryTitle,
      description: '',
      genre: newStoryGenre,
      color: genreColors[newStoryGenre] || '#6366f1'
    })
    
    setShowNewStory(false)
    setNewStoryTitle('')
    navigate(`/story/${story.id}`)
  }
  
  const handleCreateFromTemplate = (template: typeof templates[0]) => {
    const story = addStory({
      title: template.title,
      description: template.description,
      genre: template.genre,
      color: genreColors[template.genre]
    })
    
    navigate(`/story/${story.id}`)
  }
  
  return (
    <div className="p-8 max-w-7xl mx-auto"
    >
      {/* Header */}
      <div className="mb-8"
      >
        <h1 className="text-4xl font-bold mb-2">Welcome Back</h1>
        <p className="text-white/60">Continue your stories or start something new</p>
      </div>
      
      {/* Create new section */}
      <div className="mb-12"
      >
        <h2 className="text-xl font-semibold mb-4">Create New Story</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {/* Blank story card */}
          <button
            onClick={() => setShowNewStory(true)}
            className="group relative h-48 rounded-xl border-2 border-dashed border-white/20 hover:border-white/40 transition-colors flex flex-col items-center justify-center gap-3"
          >
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors"
            >
              <Plus className="w-6 h-6" />
            </div>
            <span className="font-medium">Blank Story</span>
          </button>
          
          {/* Template cards */}
          {templates.map((template) => (
            <button
              key={template.title}
              onClick={() => handleCreateFromTemplate(template)}
              className="group relative h-48 rounded-xl overflow-hidden"
              style={{ 
                background: `linear-gradient(135deg, ${genreColors[template.genre]}40, ${genreColors[template.genre]}20)` 
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              
              <div className="absolute bottom-0 left-0 right-0 p-4"
              >
                <h3 className="font-semibold text-lg">{template.title}</h3>
                <p className="text-sm text-white/70">{template.description}</p>
              </div>
              
              <Sparkles 
                className="absolute top-4 right-4 w-5 h-5 opacity-50" 
                style={{ color: genreColors[template.genre] }}
              />
            </button>
          ))}
        </div>
      </div>
      
      {/* Your stories section */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Your Stories</h2>
        
        {stories.length === 0 ? (
          <div className="text-center py-16 bg-white/5 rounded-xl"
          >
            <BookOpen className="w-16 h-16 mx-auto mb-4 text-white/20" />
            <p className="text-white/40">No stories yet. Create one above!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {stories.map((story) => (
              <StoryCard key={story.id} story={story} />
            ))}
          </div>
        )}
      </div>
      
      {/* New story modal */}
      {showNewStory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        >
          <div className="bg-slate-900 border border-white/10 rounded-xl p-6 w-full max-w-md"
          >
            <h3 className="text-xl font-semibold mb-4">Create New Story</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-white/60 mb-1">Title</label>
                <input
                  type="text"
                  value={newStoryTitle}
                  onChange={(e) => setNewStoryTitle(e.target.value)}
                  placeholder="Enter story title..."
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:border-purple-500 outline-none"
                  autoFocus
                />
              </div>
              
              <div>
                <label className="block text-sm text-white/60 mb-1">Genre</label>
                <select
                  value={newStoryGenre}
                  onChange={(e) => setNewStoryGenre(e.target.value)}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:border-purple-500 outline-none"
                >
                  <option value="fantasy">Fantasy</option>
                  <option value="scifi">Sci-Fi</option>
                  <option value="romance">Romance</option>
                  <option value="mystery">Mystery</option>
                  <option value="horror">Horror</option>
                  <option value="adventure">Adventure</option>
                  <option value="drama">Drama</option>
                  <option value="comedy">Comedy</option>
                </select>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowNewStory(false)}
                className="flex-1 px-4 py-2 border border-white/10 rounded-lg hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateStory}
                disabled={!newStoryTitle.trim()}
                className="flex-1 px-4 py-2 bg-purple-600 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function StoryCard({ story }: { story: Story }) {
  const navigate = useNavigate()
  
  return (
    <button
      onClick={() => navigate(`/story/${story.id}`)}
      className="group relative aspect-[3/4] rounded-xl overflow-hidden bg-slate-800 border border-white/10 hover:border-white/20 transition-all hover:scale-[1.02]"
    >
      {/* Card background with gradient */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{ 
          background: `linear-gradient(135deg, ${story.color}40, transparent)` 
        }}
      />
      
      {/* Content */}
      <div className="absolute inset-0 p-6 flex flex-col"
      >
        {/* Genre badge */}
        <div className="flex justify-between items-start"
        >
          <span 
            className="px-3 py-1 text-xs rounded-full bg-white/10 capitalize"
            style={{ color: story.color }}
          >
            {story.genre}
          </span>
        </div>
        
        {/* Title and description */}
        <div className="mt-auto"
        >
          <h3 className="text-xl font-semibold mb-1 group-hover:text-purple-300 transition-colors"
          >
            {story.title}
          </h3>
          
          {story.description && (
            <p className="text-sm text-white/60 line-clamp-2">{story.description}</p>
          )}
          
          <p className="text-xs text-white/40 mt-3">
            Updated {new Date(story.updatedAt).toLocaleDateString()}
          </p>
        </div>
      </div>
      
      {/* Hover overlay */}
      <div className="absolute inset-0 bg-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
    </button>
  )
}
