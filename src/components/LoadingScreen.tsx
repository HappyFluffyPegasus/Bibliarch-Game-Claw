import { useEffect, useState } from 'react'
import { GlassCard } from './GlassCard'
import { BookOpen, Sparkles } from 'lucide-react'

const tips = [
  "Use Cmd+K to quickly access any feature",
  "Press ? to see keyboard shortcuts",
  "Create characters first, then build your world",
  "Use the timeline to plan your story arc",
  "Life Mode brings your characters to life",
]

export function LoadingScreen({ progress }: { progress?: number }) {
  const [tip, setTip] = useState('')
  
  useEffect(() => {
    setTip(tips[Math.floor(Math.random() * tips.length)])
  }, [])
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
      <div className="text-center space-y-8">
        <GlassCard className="px-12 py-8">
          <div className="flex items-center justify-center gap-3 mb-6">
            <BookOpen className="w-8 h-8 text-primary" />
            <span className="text-2xl font-bold">Bibliarch</span>
            <Sparkles className="w-6 h-6 text-yellow-400" />
          </div>
          
          <div className="space-y-4">
            {progress !== undefined && (
              <div className="w-64 h-2 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-primary transition-all" style={{ width: `${progress}%` }} />
              </div>
            )}
            <p className="text-sm text-muted-foreground">{tip}</p>
          </div>
        </GlassCard>
      </div>
    </div>
  )
}
