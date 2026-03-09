import { useState } from 'react'
import { useStoryStore } from '@/stores/storyStore'
import { GlassCard } from '@/components/GlassCard'
import { Button } from '@/components/Button'
import { Plus, Camera, Brain, History, Shirt, Users, Heart } from 'lucide-react'
import { cn } from '@/lib/utils'

const tabs = [
  { id: 'appearance', label: 'Appearance', icon: Camera },
  { id: 'personality', label: 'Personality', icon: Brain },
  { id: 'memories', label: 'Memories', icon: History },
  { id: 'outfits', label: 'Outfits', icon: Shirt },
  { id: 'evolution', label: 'Evolution', icon: Users },
  { id: 'relationships', label: 'Relationships', icon: Heart },
]

export function CharacterCreatorPage() {
  const { characters, createCharacter } = useStoryStore()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('appearance')
  const [newName, setNewName] = useState('')
  const [showNew, setShowNew] = useState(false)
  
  const selectedChar = characters.find(c => c.id === selectedId)
  
  const handleCreate = async () => {
    if (!newName.trim()) return
    const char = await createCharacter('temp-story-id', newName)
    setSelectedId(char.id)
    setShowNew(false)
    setNewName('')
  }
  
  return (
    <div className="h-full flex flex-col">
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Character Creator</h1>
          <p className="text-muted-foreground">Design characters with depth and personality</p>
        </div>
        <Button onClick={() => setShowNew(true)}>
          <Plus className="w-4 h-4 mr-2" />
          New Character
        </Button>
      </header>
      
      {characters.length === 0 ? (
        <GlassCard className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">No characters yet</p>
            <Button onClick={() => setShowNew(true)}>Create Character</Button>
          </div>
        </GlassCard>
      ) : !selectedChar ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {characters.map(char => (
            <GlassCard 
              key={char.id}
              className="p-4 cursor-pointer hover:border-primary/50"
              onClick={() => setSelectedId(char.id)}
            >
              <div className="aspect-square bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg mb-3 flex items-center justify-center">
                <span className="text-4xl">👤</span>
              </div>
              <h3 className="font-medium">{char.name}</h3>
            </GlassCard>
          ))}
        </div>
      ) : (
        <div className="flex-1 flex gap-6">
          <GlassCard className="w-64 p-4">
            <button 
              className="text-sm text-muted-foreground mb-4 hover:text-foreground"
              onClick={() => setSelectedId(null)}
            >
              ← Back to list
            </button>
            
            <div className="aspect-square bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg mb-3 flex items-center justify-center">
              <span className="text-6xl">👤</span>
            </div>
            
            <input 
              className="w-full bg-transparent border-none text-lg font-semibold text-center mb-4 outline-none"
              value={selectedChar.name}
              readOnly
            />
            
            <nav className="space-y-1">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-left',
                    activeTab === tab.id ? 'bg-primary/20 text-primary' : 'hover:bg-white/5'
                  )}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <tab.icon className="w-4 h-4" />
                  <span className="text-sm">{tab.label}</span>
                </button>
              ))}
            </nav>
          </GlassCard>
          
          <GlassCard className="flex-1 p-6">
            {activeTab === 'personality' && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold mb-4">Personality</h2>
                <p className="text-muted-foreground mb-4">Describe your character's personality in freeform text. The AI will use this to determine their behavior.</p>
                
                {['traits', 'likes', 'dislikes', 'fears', 'dreams'].map(field => (
                  <div key={field}>
                    <label className="text-sm font-medium capitalize mb-2 block">{field}</label>
                    <textarea
                      className="w-full h-20 bg-white/5 border border-white/10 rounded-lg p-3 text-sm resize-none focus:outline-none focus:border-primary"
                      placeholder={`What does your character ${field}?`}
                      defaultValue={selectedChar.personality[field as keyof typeof selectedChar.personality]}
                    />
                  </div>
                ))}
              </div>
            )}
            
            {activeTab !== 'personality' && (
              <div className="h-full flex items-center justify-center">
                <p className="text-muted-foreground">{tabs.find(t => t.id === activeTab)?.label} tab content coming soon...</p>
              </div>
            )}
          </GlassCard>
        </div>
      )}
      
      {showNew && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setShowNew(false)}
        >
          <GlassCard className="w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-bold mb-4">Create Character</h2>
            <input
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 mb-4"
              placeholder="Character name..."
              value={newName}
              onChange={e => setNewName(e.target.value)}
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowNew(false)}>Cancel</Button>
              <Button onClick={handleCreate} disabled={!newName.trim()}>Create</Button>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  )
}
