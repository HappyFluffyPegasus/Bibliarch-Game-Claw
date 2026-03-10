import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { Home, Command, Settings } from 'lucide-react'
import { useAppStore } from '../stores/appStore'

export function Layout() {
  const navigate = useNavigate()
  const location = useLocation()
  const { stories } = useAppStore()
  
  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }
  
  return (
    <div className="flex h-screen bg-slate-950 text-white">
      <aside className="w-64 bg-slate-900 border-r border-white/10 flex flex-col">
        <div className="p-6 border-b border-white/10">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
            Bibliarch
          </h1>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => navigate('/')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              isActive('/') 
                ? 'bg-white/10 text-white' 
                : 'text-white/60 hover:bg-white/5 hover:text-white'
            }`}
          >
            <Home className="w-5 h-5" />
            <span>Dashboard</span>
          </button>
          
          <div className="pt-4 pb-2">
            <p className="px-4 text-xs text-white/40 uppercase tracking-wider">Your Stories</p>
          </div>
          
          {stories.length === 0 ? (
            <p className="px-4 text-sm text-white/30">No stories yet</p>
          ) : (
            stories.map((story: { id: string; title: string; color: string }) => (
              <button
                key={story.id}
                onClick={() => navigate(`/story/${story.id}`)}
                className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors text-left ${
                  location.pathname.includes(story.id)
                    ? 'bg-white/10 text-white'
                    : 'text-white/60 hover:bg-white/5 hover:text-white'
                }`}
              >
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: story.color }}
                />
                <span className="truncate">{story.title}</span>
              </button>
            ))
          )}
        </nav>
        
        <div className="p-4 border-t border-white/10 space-y-2">
          <button
            className="w-full flex items-center gap-3 px-4 py-2 text-white/60 hover:text-white transition-colors"
          >
            <Command className="w-5 h-5" />
            <span>Command Palette</span>
            <span className="ml-auto text-xs text-white/30">⌘K</span>
          </button>
          
          <button
            onClick={() => navigate('/settings')}
            className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
              isActive('/settings')
                ? 'bg-white/10 text-white'
                : 'text-white/60 hover:bg-white/5 hover:text-white'
            }`}
          >
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </button>
        </div>
      </aside>
      
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}
