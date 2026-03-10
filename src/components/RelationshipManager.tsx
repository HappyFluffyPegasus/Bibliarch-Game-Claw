import { useState } from 'react'
import { GlassCard } from './GlassCard'
import { Button } from './Button'
import { Plus, Heart, Minus } from 'lucide-react'
import { 
  type Relationship, 
  type RelationshipType, 
  RELATIONSHIP_TYPES,
  getRelationshipLabel,
  getRelationshipColor
} from '@/db/relationships'

interface RelationshipManagerProps {
  characterId: string
  otherCharacters: { id: string; name: string }[]
  relationships: Relationship[]
  onCreateRelationship: (charId1: string, charId2: string, type: RelationshipType) => void
  onUpdateStrength: (relId: string, change: number) => void
}

export function RelationshipManager({ 
  characterId, 
  otherCharacters, 
  relationships,
  onCreateRelationship,
  onUpdateStrength
}: RelationshipManagerProps) {
  const [showNew, setShowNew] = useState(false)
  const [selectedChar, setSelectedChar] = useState('')
  const [selectedType, setSelectedType] = useState<RelationshipType>('friend')
  
  const characterRels = relationships.filter(
    r => r.characterId1 === characterId || r.characterId2 === characterId
  )
  
  const availableChars = otherCharacters.filter(
    c => c.id !== characterId && !characterRels.some(
      r => r.characterId1 === c.id || r.characterId2 === c.id
    )
  )
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold">Relationships</h3>
        <Button size="sm" onClick={() => setShowNew(true)} disabled={availableChars.length === 0}>
          <Plus className="w-4 h-4 mr-1" /> Add
        </Button>
      </div>
      
      {characterRels.length === 0 ? (
        <p className="text-muted-foreground text-sm">No relationships yet. Add one to get started.</p>
      ) : (
        <div className="space-y-2">
          {characterRels.map(rel => {
            const otherId = rel.characterId1 === characterId ? rel.characterId2 : rel.characterId1
            const otherChar = otherCharacters.find(c => c.id === otherId)
            const typeInfo = RELATIONSHIP_TYPES.find(t => t.type === rel.type)
            
            return (
              <GlassCard key={rel.id} className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{typeInfo?.icon}</span>
                    <div>
                      <div className="font-medium">{otherChar?.name}</div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-muted-foreground">{typeInfo?.label}</span>
                        <span style={{ color: getRelationshipColor(rel.strength) }}>
                          • {getRelationshipLabel(rel.strength)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-24 h-2 rounded-full bg-white/10 overflow-hidden"
                    >
                      <div
                        className="h-full transition-all"
                        style={{ 
                          width: `${Math.abs(rel.strength)}%`,
                          backgroundColor: getRelationshipColor(rel.strength),
                          marginLeft: rel.strength < 0 ? 'auto' : 0,
                          marginRight: rel.strength < 0 ? 0 : 'auto'
                        }}
                      />
                    </div>
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onUpdateStrength(rel.id, -10)}
                    >
                      <Minus className="w-3 h-3" />
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onUpdateStrength(rel.id, 10)}
                    >
                      <Heart className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </GlassCard>
            )
          })}
        </div>
      )}
      
      {showNew && (
        <GlassCard className="p-4">
          <h4 className="font-medium mb-3">New Relationship</h4>
          
          <div className="space-y-3">
            <select
              className="w-full bg-white/5 border border-white/10 rounded px-3 py-2"
              value={selectedChar}
              onChange={e => setSelectedChar(e.target.value)}
            >
              <option value="">Select character...</option>
              {availableChars.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            
            <div className="grid grid-cols-4 gap-2">
              {RELATIONSHIP_TYPES.map(type => (
                <button
                  key={type.type}
                  className={`p-2 rounded text-center text-sm border ${
                    selectedType === type.type
                      ? 'border-primary bg-primary/20'
                      : 'border-white/10 hover:border-white/20'
                  }`}
                  onClick={() => setSelectedType(type.type)}
                >
                  <span className="text-lg">{type.icon}</span>
                  <div className="text-xs">{type.label}</div>
                </button>
              ))}
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowNew(false)}>Cancel</Button>
              <Button 
                onClick={() => {
                  if (selectedChar) {
                    onCreateRelationship(characterId, selectedChar, selectedType)
                    setShowNew(false)
                    setSelectedChar('')
                  }
                }}
                disabled={!selectedChar}
              >
                Create
              </Button>
            </div>
          </div>
        </GlassCard>
      )}
    </div>
  )
}
