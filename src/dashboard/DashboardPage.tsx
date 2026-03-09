import { useEffect, useState } from 'react'
import { useStoryStore } from '@/stores/storyStore'
import { GlassCard } from '@/components/GlassCard'
import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { Plus, BookOpen, Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export function DashboardPage() {
  const navigate = useNavigate()
  const { stories, loadStories, createStory, deleteStory } = useStoryStore()
  const [showNewModal, setShowNewModal] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  
  useEffect(() => {
    loadStories()
  }, [loadStories])
  
  const handleCreate = async () => {
    if (!newTitle.trim()) return
    await createStory(newTitle)
    setShowNewModal(false)
    setNewTitle('')
  }
  
  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Create and manage your stories</p>
        </div>
        <Button onClick={() => setShowNewModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          New Story
        </Button>
      </header>
      
      {stories.length === 0 ? (
        <GlassCard className="p-12 text-center">
          <BookOpen className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-xl font-semibold mb-2">No stories yet</h2>
          <p className="text-muted-foreground mb-6">Create your first story to get started</p>
          <Button onClick={() => setShowNewModal(true)}>Create Story</Button>
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stories.map(story => (
            <GlassCard 
              key={story.id} 
              className="p-4 cursor-pointer hover:border-primary/50 transition-colors"
              onClick={() => navigate(`/story/${story.id}`)}
            >
              <div className="flex items-start justify-between mb-4">
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: story.color + '20' }}
                >
                  <BookOpen className="w-5 h-5" style={{ color: story.color }} />
                </div>
                
                <button 
                  className="p-1 hover:bg-white/10 rounded"
                  onClick={e => {
                    e.stopPropagation()
                    deleteStory(story.id)
                  }}
                >
                  <Trash2 className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
              
              <h3 className="font-semibold mb-1">{story.title}</h3>
              <p className="text-sm text-muted-foreground">{story.description || 'No description'}</p>
            </GlassCard>
          ))}
        </div>
      )}
      
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setShowNewModal(false)}
        >
          <GlassCard className="w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-bold mb-4">Create New Story</h2>
            <Input
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              placeholder="Enter story title..."
              autoFocus
            />
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setShowNewModal(false)}>Cancel</Button>
              <Button onClick={handleCreate} disabled={!newTitle.trim()}>Create</Button>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  )
}
