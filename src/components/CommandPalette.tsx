import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { GlassCard } from './GlassCard'
import { Search, Home, Users, Map, Image, Calendar, MessageSquare, Settings, Zap } from 'lucide-react'

const commands = [
  { id: 'home', name: 'Dashboard', icon: Home, path: '/' },
  { id: 'characters', name: 'Characters', icon: Users, path: '/characters' },
  { id: 'world', name: 'World Builder', icon: Map, path: '/world' },
  { id: 'scenes', name: 'Scenes', icon: Image, path: '/scenes' },
  { id: 'timeline', name: 'Timeline', icon: Calendar, path: '/timeline' },
  { id: 'dialogue', name: 'Dialogue', icon: MessageSquare, path: '/dialogue' },
  { id: 'life', name: 'Life Mode', icon: Zap, path: '/life' },
  { id: 'settings', name: 'Settings', icon: Settings, path: '/settings' },
]

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const navigate = useNavigate()
  
  const filtered = commands.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase())
  )
  
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen(true)
      }
      if (e.key === 'Escape') setIsOpen(false)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])
  
  if (!isOpen) return null
  
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-32 bg-black/50 backdrop-blur-sm"
      onClick={() => setIsOpen(false)}>
      <GlassCard className="w-full max-w-lg overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10">
          <Search className="w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search commands..."
            className="flex-1 bg-transparent border-none outline-none"
            value={search}
            onChange={e => setSearch(e.target.value)}
            autoFocus
          />
          <span className="text-xs text-muted-foreground bg-white/10 px-2 py-1 rounded">ESC</span>
        </div>
        
        <div className="max-h-64 overflow-y-auto py-2">
          {filtered.map(cmd => (
            <button
              key={cmd.id}
              className="w-full flex items-center gap-3 px-4 py-2 hover:bg-white/5 transition-colors text-left"
              onClick={() => {
                navigate(cmd.path)
                setIsOpen(false)
              }}
            >
              <cmd.icon className="w-5 h-5 text-muted-foreground" />
              <span>{cmd.name}</span>
            </button>
          ))}
        </div>
      </GlassCard>
    </div>
  )
}
