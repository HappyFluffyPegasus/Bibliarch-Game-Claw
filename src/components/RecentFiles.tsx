import { useEffect, useState } from 'react'
import { GlassCard } from './GlassCard'
import { Clock, FileText } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import type { Story } from '@/db/database'

interface RecentFile {
  story: Story
  lastAccessed: number
}

export function RecentFiles() {
  const [recentFiles, setRecentFiles] = useState<RecentFile[]>([])
  const navigate = useNavigate()
  
  useEffect(() => {
    // Load from localStorage
    const saved = localStorage.getItem('bibliarch_recent_files')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setRecentFiles(parsed.slice(0, 5)) // Show last 5
      } catch {
        // Ignore parse errors
      }
    }
  }, [])
  
  if (recentFiles.length === 0) return null
  
  return (
    <GlassCard className="p-4">
      <div className="flex items-center gap-2 mb-3">
        <Clock className="w-4 h-4 text-muted-foreground" />
        <h3 className="font-medium">Recent Files</h3>
      </div>
      
      <div className="space-y-2">
        {recentFiles.map(({ story }) => (
          <button
            key={story.id}
            className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors text-left"
            onClick={() => navigate(`/story/${story.id}`)}
          >
            <div 
              className="w-8 h-8 rounded flex items-center justify-center"
              style={{ backgroundColor: story.color + '20' }}
            >
              <FileText className="w-4 h-4" style={{ color: story.color }} />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm truncate">{story.title}</div>
              <div className="text-xs text-muted-foreground">
                {new Date(story.updatedAt).toLocaleDateString()}
              </div>
            </div>
          </button>
        ))}
      </div>
    </GlassCard>
  )
}

// Helper to add a file to recent
export function addToRecentFiles(story: Story) {
  const saved = localStorage.getItem('bibliarch_recent_files')
  let recent: RecentFile[] = []
  
  if (saved) {
    try {
      recent = JSON.parse(saved)
    } catch {
      recent = []
    }
  }
  
  // Remove if already exists
  recent = recent.filter(r => r.story.id !== story.id)
  
  // Add to front
  recent.unshift({
    story,
    lastAccessed: Date.now()
  })
  
  // Keep only last 10
  recent = recent.slice(0, 10)
  
  localStorage.setItem('bibliarch_recent_files', JSON.stringify(recent))
}
