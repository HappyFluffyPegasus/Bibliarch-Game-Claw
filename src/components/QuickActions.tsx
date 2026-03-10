import { useState } from 'react'
import { Plus, FileText, User, MapPin, Image, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const actions = [
  { id: 'story', label: 'New Story', icon: FileText, path: '/' },
  { id: 'character', label: 'New Character', icon: User, path: '/characters' },
  { id: 'location', label: 'New Location', icon: MapPin, path: '/world' },
  { id: 'scene', label: 'New Scene', icon: Image, path: '/scenes' }
]

export function QuickActions() {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()
  
  return (
    <div className="fixed bottom-6 right-6 z-40">
      {/* Menu */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 space-y-2">
          {actions.map((action, index) => (
            <button
              key={action.id}
              className="flex items-center gap-3 px-4 py-2 bg-white/10 backdrop-blur-xl rounded-lg border border-white/10 hover:bg-white/20 transition-all"
              style={{
                animation: `slideUp 0.2s ease-out ${index * 0.05}s both`
              }}
              onClick={() => {
                navigate(action.path)
                setIsOpen(false)
              }}
            >
              <action.icon className="w-4 h-4" />
              <span className="text-sm">{action.label}</span>
            </button>
          ))}
        </div>
      )}
      
      {/* FAB */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all ${
          isOpen 
            ? 'bg-destructive rotate-45' 
            : 'bg-primary hover:bg-primary/90'
        }`}
      >
        {isOpen ? <X className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
      </button>
      
      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}
