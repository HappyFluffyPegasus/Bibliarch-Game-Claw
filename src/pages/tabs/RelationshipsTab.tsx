import { useState } from 'react'
import { useCharacterStore } from '../../stores/characterStore'
import { Plus, Trash2, Users, Heart, Sword, Users2, Trophy, GraduationCap, Briefcase, UserCircle } from 'lucide-react'

const relationshipTypes = [
  { value: 'friend', label: 'Friend', icon: Users2, color: '#10b981' },
  { value: 'enemy', label: 'Enemy', icon: Sword, color: '#ef4444' },
  { value: 'lover', label: 'Lover', icon: Heart, color: '#ec4899' },
  { value: 'family', label: 'Family', icon: Users, color: '#8b5cf6' },
  { value: 'rival', label: 'Rival', icon: Trophy, color: '#f59e0b' },
  { value: 'mentor', label: 'Mentor', icon: GraduationCap, color: '#3b82f6' },
  { value: 'colleague', label: 'Colleague', icon: Briefcase, color: '#06b6d4' },
  { value: 'neutral', label: 'Neutral', icon: UserCircle, color: '#9ca3af' }
] as const

export function RelationshipsTab() {
  const { character, addRelationship, updateRelationship, deleteRelationship } = useCharacterStore()
  const [showAdd, setShowAdd] = useState(false)
  const [newRelationship, setNewRelationship] = useState<{
    targetName: string
    type: 'friend' | 'enemy' | 'lover' | 'family' | 'rival' | 'mentor' | 'colleague' | 'neutral'
    description: string
    strength: number
  }>({
    targetName: '',
    type: 'friend',
    description: '',
    strength: 50
  })
  
  if (!character) return null
  
  const handleAdd = () => {
    if (newRelationship.targetName.trim()) {
      addRelationship({
        targetId: crypto.randomUUID(), // Would be actual character ID in real app
        targetName: newRelationship.targetName.trim(),
        type: newRelationship.type,
        description: newRelationship.description,
        strength: newRelationship.strength
      })
      setNewRelationship({ targetName: '', type: 'friend', description: '', strength: 50 })
      setShowAdd(false)
    }
  }
  
  const getRelationshipLabel = (strength: number) => {
    if (strength >= 80) return 'Very Strong'
    if (strength >= 60) return 'Strong'
    if (strength >= 40) return 'Moderate'
    if (strength >= 20) return 'Weak'
    return 'Very Weak'
  }
  
  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-400" />
          Relationships ({character.relationships.length})
        </h3>
        
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 rounded-xl hover:bg-purple-500 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Relationship
        </button>
      </div>
      
      {showAdd && (
        <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
          <h4 className="font-medium mb-4">New Relationship</h4>
          
          <div className="space-y-4">
            <input
              type="text"
              value={newRelationship.targetName}
              onChange={(e) => setNewRelationship({ ...newRelationship, targetName: e.target.value })}
              placeholder="Character name..."
              className="w-full px-4 py-2 bg-white/5 rounded-lg border border-white/10 focus:border-purple-500 outline-none"
            />
            
            <div className="grid grid-cols-4 gap-2">
              {relationshipTypes.map((type) => {
                const Icon = type.icon
                return (
                  <button
                    key={type.value}
                    onClick={() => setNewRelationship({ ...newRelationship, type: type.value })}
                    className={`p-3 rounded-lg flex flex-col items-center gap-1 transition-colors ${
                      newRelationship.type === type.value
                        ? 'bg-purple-600'
                        : 'bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    <Icon className="w-5 h-5" style={{ color: type.color }} />
                    <span className="text-xs">{type.label}</span>
                  </button>
                )
              })}
            </div>
            
            <textarea
              value={newRelationship.description}
              onChange={(e) => setNewRelationship({ ...newRelationship, description: e.target.value })}
              placeholder="Describe the relationship..."
              className="w-full h-20 px-4 py-2 bg-white/5 rounded-lg border border-white/10 focus:border-purple-500 outline-none resize-none"
            />
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowAdd(false)}
                className="flex-1 px-4 py-2 border border-white/10 rounded-lg hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                onClick={handleAdd}
                className="flex-1 px-4 py-2 bg-purple-600 rounded-lg hover:bg-purple-500"
              >
                Add Relationship
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {character.relationships.length === 0 ? (
          <div className="col-span-full text-center py-12 text-white/40">
            <Users className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p>No relationships yet. Connect with other characters!</p>
          </div>
        ) : (
          character.relationships.map((rel) => {
            const typeInfo = relationshipTypes.find((t) => t.value === rel.type)
            const TypeIcon = typeInfo?.icon || UserCircle
            
            return (
              <div
                key={rel.id}
                className="p-5 bg-white/5 rounded-2xl border border-white/10"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: `${typeInfo?.color}20` }}
                    >
                      <TypeIcon className="w-6 h-6" style={{ color: typeInfo?.color }} />
                    </div>
                    
                    <div>
                      <h4 className="font-semibold">{rel.targetName}</h4>
                      <span
                        className="text-sm capitalize"
                        style={{ color: typeInfo?.color }}
                      >
                        {typeInfo?.label}
                      </span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => deleteRelationship(rel.id)}
                    className="p-2 text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-white/50">{getRelationshipLabel(rel.strength)}</span>
                    <span>{rel.strength}%</span>
                  </div>
                  
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={rel.strength}
                    onChange={(e) => updateRelationship(rel.id, { strength: parseInt(e.target.value) })}
                    className="w-full"
                  />
                </div>
                
                {rel.description && (
                  <p className="text-sm text-white/60">{rel.description}</p>
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
