import { useState } from 'react'
import { useStoryStore } from '@/stores/storyStore'
import { GlassCard } from '@/components/GlassCard'
import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { Plus, Map, Mountain, TreePine, Building2, Home } from 'lucide-react'

const locationTypes = [
  { type: 'world', icon: Map, label: 'World' },
  { type: 'continent', icon: Mountain, label: 'Continent' },
  { type: 'country', icon: Map, label: 'Country' },
  { type: 'region', icon: TreePine, label: 'Region' },
  { type: 'city', icon: Building2, label: 'City' },
  { type: 'building', icon: Home, label: 'Building' },
]

export function WorldBuilderPage() {
  const { currentStory, locations, createLocation } = useStoryStore()
  const [showNewModal, setShowNewModal] = useState(false)
  const [newName, setNewName] = useState('')
  const [selectedType, setSelectedType] = useState<typeof locationTypes[0]>(locationTypes[0])
  
  const handleCreate = async () => {
    if (!newName.trim() || !currentStory) return
    await createLocation(currentStory.id, newName, selectedType.type as any)
    setShowNewModal(false)
    setNewName('')
  }
  
  return (
    <div className="h-full flex flex-col">
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">World Builder</h1>
          <p className="text-muted-foreground">Create and manage your world locations</p>
        </div>
        <Button onClick={() => setShowNewModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Location
        </Button>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {locations.map(location => {
          const typeInfo = locationTypes.find(t => t.type === location.type) || locationTypes[0]
          return (
            <GlassCard key={location.id} className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                  <typeInfo.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">{location.name}</h3>
                  <p className="text-sm text-muted-foreground capitalize">{typeInfo.label}</p>
                </div>
              </div>
            </GlassCard>
          )
        })}
      </div>
      
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setShowNewModal(false)}
        >
          <GlassCard className="w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-bold mb-4">Add New Location</h2>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Location Name</label>
                <Input
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  placeholder="Enter location name..."
                  autoFocus
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Location Type</label>
                <div className="grid grid-cols-3 gap-2">
                  {locationTypes.map(type => (
                    <button
                      key={type.type}
                      className={`p-3 rounded-lg border text-center transition-colors ${
                        selectedType.type === type.type
                          ? 'border-primary bg-primary/10'
                          : 'border-white/10 hover:border-white/20'
                      }`}
                      onClick={() => setSelectedType(type)}
                    >
                      <type.icon className="w-5 h-5 mx-auto mb-1" />
                      <span className="text-xs">{type.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowNewModal(false)}>Cancel</Button>
                <Button onClick={handleCreate} disabled={!newName.trim()}>Create</Button>
              </div>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  )
}
