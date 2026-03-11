import { useState } from 'react'
import { useCharacterStore } from '../../stores/characterStore'
import { Plus, Trash2, Sparkles } from 'lucide-react'

export function PersonalityTab() {
  const { character, updateCharacter, addCustomBox, updateCustomBox, removeCustomBox } = useCharacterStore()
  const [newBoxName, setNewBoxName] = useState('')
  
  if (!character) return null
  
  const handleAddBox = () => {
    if (newBoxName.trim()) {
      addCustomBox(newBoxName.trim())
      setNewBoxName('')
    }
  }
  
  return (
    <div className="space-y-8 max-w-2xl">
      {/* Core Personality */}
      <section className="p-6 bg-white/5 rounded-2xl border border-white/10">
        <div className="flex items-center gap-3 mb-6">
          <Sparkles className="w-6 h-6 text-purple-400" />
          <h3 className="text-lg font-semibold">Core Personality</h3>
        </div>
        
        <textarea
          value={character.personality.traits}
          onChange={(e) => updateCharacter({ 
            personality: { ...character.personality, traits: e.target.value }
          })}
          placeholder="Describe this character's core personality traits, behaviors, and quirks..."
          className="w-full h-40 px-4 py-3 bg-white/5 rounded-xl border border-white/10 focus:border-purple-500 outline-none resize-none"
        />
      </section>
      
      {/* Custom Personality Fields */}
      <section className="p-6 bg-white/5 rounded-2xl border border-white/10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Plus className="w-6 h-6 text-pink-400" />
            <h3 className="text-lg font-semibold">Custom Fields</h3>
          </div>
          
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newBoxName}
              onChange={(e) => setNewBoxName(e.target.value)}
              placeholder="New field name..."
              className="px-3 py-2 bg-white/5 rounded-lg border border-white/10 text-sm"
              onKeyDown={(e) => e.key === 'Enter' && handleAddBox()}
            />
            
            <button
              onClick={handleAddBox}
              className="p-2 bg-purple-600 rounded-lg hover:bg-purple-500 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <div className="space-y-4">
          {character.personality.customBoxes.length === 0 ? (
            <p className="text-center text-white/40 py-8">
              No custom fields yet. Add personality traits, backstory elements, or any custom attributes.
            </p>
          ) : (
            character.personality.customBoxes.map((box) => (
              <div key={box.id} className="p-4 bg-white/5 rounded-xl border border-white/10">
                <div className="flex items-center justify-between mb-3">
                  <input
                    type="text"
                    value={box.name}
                    readOnly
                    className="font-medium bg-transparent border-none outline-none"
                  />
                  
                  <button
                    onClick={() => removeCustomBox(box.id)}
                    className="p-2 text-red-400 hover:text-red-300 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
                <textarea
                  value={box.content}
                  onChange={(e) => updateCustomBox(box.id, e.target.value)}
                  placeholder={`Enter ${box.name.toLowerCase()}...`}
                  className="w-full h-24 px-3 py-2 bg-white/5 rounded-lg border border-white/10 focus:border-purple-500 outline-none resize-none text-sm"
                />
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  )
}
