import { useState, useMemo } from 'react'
import { useStoryStore } from '@/stores/storyStore'
import { GlassCard } from './GlassCard'
import { Search, X, Book, User, MapPin, MessageSquare } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface SearchResult {
  id: string
  type: 'story' | 'character' | 'location' | 'dialogue'
  title: string
  subtitle?: string
  icon: typeof Book
  path: string
}

interface GlobalSearchProps {
  isOpen: boolean
  onClose: () => void
}

export function GlobalSearch({ isOpen, onClose }: GlobalSearchProps) {
  const [query, setQuery] = useState('')
  const { stories, characters, locations } = useStoryStore()
  const navigate = useNavigate()
  
  const results = useMemo(() => {
    if (!query.trim()) return []
    
    const lowerQuery = query.toLowerCase()
    const searchResults: SearchResult[] = []
    
    // Search stories
    stories.forEach(story => {
      if (story.title.toLowerCase().includes(lowerQuery) || 
          story.description?.toLowerCase().includes(lowerQuery)) {
        searchResults.push({
          id: story.id,
          type: 'story',
          title: story.title,
          subtitle: story.description?.slice(0, 50),
          icon: Book,
          path: `/story/${story.id}`
        })
      }
    })
    
    // Search characters
    characters.forEach(char => {
      if (char.name.toLowerCase().includes(lowerQuery) ||
          char.personality.traits.toLowerCase().includes(lowerQuery)) {
        searchResults.push({
          id: char.id,
          type: 'character',
          title: char.name,
          subtitle: char.personality.traits?.slice(0, 50),
          icon: User,
          path: `/characters`
        })
      }
    })
    
    // Search locations
    locations.forEach(loc => {
      if (loc.name.toLowerCase().includes(lowerQuery) ||
          loc.description?.toLowerCase().includes(lowerQuery)) {
        searchResults.push({
          id: loc.id,
          type: 'location',
          title: loc.name,
          subtitle: loc.type,
          icon: MapPin,
          path: `/world`
        })
      }
    })
    
    return searchResults.slice(0, 10) // Limit to 10 results
  }, [query, stories, characters, locations])
  
  if (!isOpen) return null
  
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-32 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <GlassCard className="w-full max-w-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10">
          <Search className="w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search stories, characters, locations..."
            className="flex-1 bg-transparent border-none outline-none text-lg"
            value={query}
            onChange={e => setQuery(e.target.value)}
            autoFocus
          />
          <button onClick={onClose}>
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
        
        <div className="max-h-96 overflow-y-auto">
          {query && results.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              No results found for "{query}"
            </div>
          ) : (
            <div className="py-2">
              {results.map((result, index) => {
                const Icon = result.icon
                return (
                  <button
                    key={result.id}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-left"
                    onClick={() => {
                      navigate(result.path)
                      onClose()
                    }}
                  >
                    <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-muted-foreground" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="font-medium">{result.title}</div>
                      {result.subtitle && (
                        <div className="text-sm text-muted-foreground">{result.subtitle}</div>
                      )}
                    </div>
                    
                    <span className="text-xs text-muted-foreground uppercase">{result.type}</span>
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </GlassCard>
    </div>
  )
}
