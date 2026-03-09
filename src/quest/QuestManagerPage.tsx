import { useState } from 'react'
import { GlassCard } from '@/components/GlassCard'
import { Button } from '@/components/Button'
import { Plus, Target, CheckCircle2, Circle } from 'lucide-react'

interface Quest {
  id: string
  title: string
  description: string
  status: 'active' | 'completed' | 'failed'
  objectives: { text: string; completed: boolean }[]
}

export function QuestManagerPage() {
  const [quests, setQuests] = useState<Quest[]>([])
  const [showNew, setShowNew] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  
  const addQuest = () => {
    if (!newTitle.trim()) return
    const quest: Quest = {
      id: crypto.randomUUID(),
      title: newTitle,
      description: '',
      status: 'active',
      objectives: []
    }
    setQuests([...quests, quest])
    setShowNew(false)
    setNewTitle('')
  }
  
  return (
    <div className="h-full flex flex-col">
      <header className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold">Quests</h1>
          <p className="text-muted-foreground">Manage story objectives</p>
        </div>
        <Button onClick={() => setShowNew(true)}>
          <Plus className="w-4 h-4 mr-2" />
          New Quest
        </Button>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {quests.map(quest => (
          <GlassCard key={quest.id} className="p-4">
            <div className="flex items-start gap-3">
              <div className="mt-1">
                {quest.status === 'completed' ? (
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                ) : quest.status === 'failed' ? (
                  <Circle className="w-5 h-5 text-red-400" />
                ) : (
                  <Target className="w-5 h-5 text-primary" />
                )}
              </div>
              
              <div>
                <h3 className="font-semibold">{quest.title}</h3>
                <p className="text-sm text-muted-foreground">{quest.description || 'No description'}</p>
                
                <div className="mt-2 text-xs text-muted-foreground">
                  {quest.objectives.filter(o => o.completed).length} / {quest.objectives.length} objectives
                </div>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
      
      {showNew && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setShowNew(false)}
        >
          <GlassCard className="w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-bold mb-4">New Quest</h2>
            <input
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 mb-4"
              placeholder="Quest title..."
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowNew(false)}>Cancel</Button>
              <Button onClick={addQuest} disabled={!newTitle.trim()}>Create</Button>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  )
}
