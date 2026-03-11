import { useState } from 'react'
import { useCharacterStore } from '../../stores/characterStore'
import { Plus, Trash2, TrendingUp } from 'lucide-react'

export function EvolutionTab() {
  const { character, addEvolution, deleteEvolution } = useCharacterStore()
  const [showAdd, setShowAdd] = useState(false)
  const [newEntry, setNewEntry] = useState({
    stage: '',
    description: '',
    age: character?.age || 25,
    changes: ''
  })
  
  if (!character) return null
  
  const handleAdd = () => {
    if (newEntry.stage.trim()) {
      addEvolution({
        stage: newEntry.stage.trim(),
        description: newEntry.description,
        age: newEntry.age,
        changes: newEntry.changes
      })
      setNewEntry({ stage: '', description: '', age: character.age, changes: '' })
      setShowAdd(false)
    }
  }
  
  const sortedEvolution = [...character.evolution].sort((a, b) => a.age - b.age)
  
  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-yellow-400" />
          Character Evolution ({character.evolution.length})
        </h3>
        
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 rounded-xl hover:bg-purple-500 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Stage
        </button>
      </div>
      
      {showAdd && (
        <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
          <h4 className="font-medium mb-4">New Evolution Stage</h4>
          
          <div className="space-y-4">
            <input
              type="text"
              value={newEntry.stage}
              onChange={(e) => setNewEntry({ ...newEntry, stage: e.target.value })}
              placeholder="Stage name (e.g., 'The Fall', 'Redemption')..."
              className="w-full px-4 py-2 bg-white/5 rounded-lg border border-white/10 focus:border-purple-500 outline-none"
            />
            
            <div className="grid grid-cols-2 gap-4">
              <input
                type="number"
                value={newEntry.age}
                onChange={(e) => setNewEntry({ ...newEntry, age: parseInt(e.target.value) || 0 })}
                placeholder="Age..."
                className="px-4 py-2 bg-white/5 rounded-lg border border-white/10"
              />
            </div>
            
            <textarea
              value={newEntry.description}
              onChange={(e) => setNewEntry({ ...newEntry, description: e.target.value })}
              placeholder="Describe this stage of the character's journey..."
              className="w-full h-20 px-4 py-2 bg-white/5 rounded-lg border border-white/10 focus:border-purple-500 outline-none resize-none"
            />
            
            <textarea
              value={newEntry.changes}
              onChange={(e) => setNewEntry({ ...newEntry, changes: e.target.value })}
              placeholder="What changes? (personality, appearance, beliefs...)"
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
                Add Stage
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="space-y-4">
        {sortedEvolution.length === 0 ? (
          <div className="text-center py-12 text-white/40">
            <TrendingUp className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p>No evolution stages yet. Map the character's journey!</p>
          </div>
        ) : (
          sortedEvolution.map((entry, index) => (
            <div key={entry.id} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center font-bold">
                  {index + 1}
                </div>
                {index < sortedEvolution.length - 1 && (
                  <div className="w-0.5 flex-1 bg-gradient-to-b from-purple-500/50 to-transparent my-2" />
                )}
              </div>
              
              <div className="flex-1 p-5 bg-white/5 rounded-2xl border border-white/10">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold text-lg">{entry.stage}</h4>
                    <span className="text-sm text-white/50">Age {entry.age}</span>
                  </div>
                  
                  <button
                    onClick={() => deleteEvolution(entry.id)}
                    className="p-2 text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
                {entry.description && (
                  <p className="text-white/70 mt-3">{entry.description}</p>
                )}
                
                {entry.changes && (
                  <div className="mt-4 p-3 bg-white/5 rounded-lg">
                    <span className="text-xs text-white/40 uppercase">Changes:</span>
                    <p className="text-white/70 text-sm mt-1">{entry.changes}</p>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
