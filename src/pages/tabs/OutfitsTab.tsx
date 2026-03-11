import { useState } from 'react'
import { useCharacterStore } from '../../stores/characterStore'
import { Plus, Trash2, Shirt, Check } from 'lucide-react'

export function OutfitsTab() {
  const { character, addOutfit, deleteOutfit, equipOutfit } = useCharacterStore()
  const [showAdd, setShowAdd] = useState(false)
  const [newOutfit, setNewOutfit] = useState({
    name: '',
    description: '',
    tags: ''
  })
  
  if (!character) return null
  
  const handleAdd = () => {
    if (newOutfit.name.trim()) {
      addOutfit({
        name: newOutfit.name.trim(),
        description: newOutfit.description,
        tags: newOutfit.tags.split(',').map((t) => t.trim()).filter(Boolean),
        visibleMeshes: [],
        hiddenMeshes: []
      })
      setNewOutfit({ name: '', description: '', tags: '' })
      setShowAdd(false)
    }
  }
  
  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Shirt className="w-5 h-5 text-green-400" />
          Outfits ({character.outfits.length})
        </h3>
        
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 rounded-xl hover:bg-purple-500 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Outfit
        </button>
      </div>
      
      {showAdd && (
        <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
          <h4 className="font-medium mb-4">New Outfit</h4>
          
          <div className="space-y-4">
            <input
              type="text"
              value={newOutfit.name}
              onChange={(e) => setNewOutfit({ ...newOutfit, name: e.target.value })}
              placeholder="Outfit name..."
              className="w-full px-4 py-2 bg-white/5 rounded-lg border border-white/10 focus:border-purple-500 outline-none"
            />
            
            <textarea
              value={newOutfit.description}
              onChange={(e) => setNewOutfit({ ...newOutfit, description: e.target.value })}
              placeholder="Description..."
              className="w-full h-20 px-4 py-2 bg-white/5 rounded-lg border border-white/10 focus:border-purple-500 outline-none resize-none"
            />
            
            <input
              type="text"
              value={newOutfit.tags}
              onChange={(e) => setNewOutfit({ ...newOutfit, tags: e.target.value })}
              placeholder="Tags (comma separated)..."
              className="w-full px-4 py-2 bg-white/5 rounded-lg border border-white/10 focus:border-purple-500 outline-none"
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
                Add Outfit
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {character.outfits.length === 0 ? (
          <div className="col-span-full text-center py-12 text-white/40">
            <Shirt className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p>No outfits yet. Create some styles!</p>
          </div>
        ) : (
          character.outfits.map((outfit) => {
            const isEquipped = character.currentOutfitId === outfit.id
            
            return (
              <div
                key={outfit.id}
                className={`p-5 rounded-2xl border transition-all ${
                  isEquipped
                    ? 'bg-green-500/10 border-green-500/30'
                    : 'bg-white/5 border-white/10'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <h4 className="font-semibold text-lg">{outfit.name}</h4>
                  
                  <button
                    onClick={() => deleteOutfit(outfit.id)}
                    className="p-2 text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
                {outfit.description && (
                  <p className="text-white/60 text-sm mb-3">{outfit.description}</p>
                )}
                
                {outfit.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {outfit.tags.map((tag) => (
                      <span key={tag} className="px-2 py-1 bg-white/10 rounded text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                
                <button
                  onClick={() => equipOutfit(isEquipped ? undefined : outfit.id)}
                  className={`w-full py-2 rounded-lg flex items-center justify-center gap-2 transition-colors ${
                    isEquipped
                      ? 'bg-green-600 hover:bg-green-500'
                      : 'bg-white/5 hover:bg-white/10'
                  }`}
                >
                  {isEquipped ? (
                    <>
                      <Check className="w-4 h-4" />
                      Equipped
                    </>
                  ) : (
                    'Equip Outfit'
                  )}
                </button>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
