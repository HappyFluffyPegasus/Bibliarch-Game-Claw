import { useParams, useNavigate } from 'react-router-dom'
import { Users, Map, Image, Clock, Play } from 'lucide-react'
import { useAppStore } from '@/stores/appStore'

export function StoryDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { stories, characters, locations, scenes } = useAppStore()
  
  const story = stories.find((s) => s.id === id)
  
  if (!story) {
    return (
      <div className="p-8"
      >
        <p>Story not found</p>
      </div>
    )
  }
  
  const storyCharacters = characters.filter((c) => c.storyId === id)
  const storyLocations = locations.filter((l) => l.storyId === id)
  const storyScenes = scenes.filter((s) => s.storyId === id)
  
  const modules = [
    {
      title: 'Characters',
      description: `${storyCharacters.length} character${storyCharacters.length !== 1 ? 's' : ''}`,
      icon: Users,
      color: '#ec4899',
      path: `/story/${id}/characters`
    },
    {
      title: 'World Builder',
      description: `${storyLocations.length} location${storyLocations.length !== 1 ? 's' : ''}`,
      icon: Map,
      color: '#10b981',
      path: `/story/${id}/world`
    },
    {
      title: 'Scenes',
      description: `${storyScenes.length} scene${storyScenes.length !== 1 ? 's' : ''}`,
      icon: Image,
      color: '#8b5cf6',
      path: `/story/${id}/scenes`
    },
    {
      title: 'Timeline',
      description: 'Story events and pacing',
      icon: Clock,
      color: '#f59e0b',
      path: `/story/${id}/timeline`
    }
  ]
  
  return (
    <div className="p-8 max-w-6xl mx-auto"
    >
      {/* Story header */}
      <div className="mb-8"
      >
        <div className="flex items-start justify-between"
        >
          <div>
            <span 
              className="text-sm uppercase tracking-wider"
              style={{ color: story.color }}
            >
              {story.genre}
            </span>
            <h1 className="text-4xl font-bold mt-1">{story.title}</h1>
            
            {story.description && (
              <p className="text-white/60 mt-2 max-w-2xl">{story.description}</p>
            )}
          </div>
          
          <button
            className="flex items-center gap-2 px-6 py-3 bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Play className="w-5 h-5" />
            Preview Story
          </button>
        </div>
      </div>
      
      {/* Modules grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {modules.map((module) => {
          const Icon = module.icon
          
          return (
            <button
              key={module.title}
              onClick={() => navigate(module.path)}
              className="group relative p-6 rounded-xl bg-slate-900 border border-white/10 hover:border-white/20 transition-all text-left"
            >
              <div className="flex items-start gap-4"
              >
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${module.color}20` }}
                >
                  <Icon className="w-6 h-6" style={{ color: module.color }} />
                </div>
                
                <div className="flex-1"
                >
                  <h3 className="text-xl font-semibold group-hover:text-purple-300 transition-colors"
                  >
                    {module.title}
                  </h3>
                  <p className="text-white/60 mt-1">{module.description}</p>
                </div>
              </div>
              
              <div className="absolute bottom-0 left-0 right-0 h-1 rounded-b-xl opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ backgroundColor: module.color }}
              />
            </button>
          )
        })}
      </div>
    </div>
  )
}
