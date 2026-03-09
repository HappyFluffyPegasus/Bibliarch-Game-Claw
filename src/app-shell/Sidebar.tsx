import { NavLink } from 'react-router-dom'
import { GlassCard } from '@/components/GlassCard'
import { cn } from '@/lib/utils'
import { Home, Users, Map, Image, Calendar, Settings } from 'lucide-react'

const navItems = [
  { to: '/', icon: Home, label: 'Dashboard' },
  { to: '/characters', icon: Users, label: 'Characters' },
  { to: '/world', icon: Map, label: 'World' },
  { to: '/scenes', icon: Image, label: 'Scenes' },
  { to: '/timeline', icon: Calendar, label: 'Timeline' },
  { to: '/settings', icon: Settings, label: 'Settings' },
]

export function Sidebar() {
  return (
    <aside className="w-64 h-screen sticky top-0 flex flex-col p-4 gap-4">
      <GlassCard className="p-4">
        <div className="flex items-center gap-2 text-xl font-bold">
          <span className="text-primary">B</span>
          <span>bibliarch</span>
        </div>
      </GlassCard>
      
      <nav className="flex-1 space-y-1">
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors',
                'hover:bg-white/5',
                isActive && 'bg-primary/20 text-primary'
              )
            }
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
