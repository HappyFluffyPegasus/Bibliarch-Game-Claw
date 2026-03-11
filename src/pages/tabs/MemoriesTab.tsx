import { useState } from 'react'
import { useCharacterStore } from '../../stores/characterStore'
import { Plus, Trash2, Heart } from 'lucide-react'
import type { Memory } from '../../types/character'

const emotions = [
  { value: 'happy', emoji: '😊', label: 'Happy' },
  { value: 'sad', emoji: '😢', label: 'Sad' },
  { value: 'angry', emoji: '😠', label: 'Angry' },
  { value: 'neutral', emoji: '😐', label: 'Neutral' },
  { value: 'scared', emoji: '😨', label: 'Scared' },
  { value: 'surprised', emoji: '😲', label: 'Surprised' }
] as const

export function MemoriesTab() {
  const { character, addMemory, deleteMemory, toggleCoreMemory } = useCharacterStore()
  const [showAdd, setShowAdd] = useState(false)
  const [newMemory, setNewMemory] = useState<Omit<Memory, 'id'>>({
    title: '',
    description: '',
    date: '',
    emotion: 'neutral',
    isCore: false
  })
  
  if (!character) return null
  
  const handleAdd = () => {
    if (newMemory.title.trim()) {
      addMemory(newMemory)
      setNewMemory({ title: '', description: '', date: '', emotion: 'neutral', isCore: false })
      setShowAdd(false)
    }
  }
  
  const sortedMemories = [...character.memories].sort((a, b) => {
    // Core memories first, then by date
    if (a.isCore !== b.isCore) return b.isCore ? 1 : -1
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })
  
  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Heart className="w-5 h-5 text-red-400" />
          Memories ({character.memories.length})
        </h3>
        
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 rounded-xl hover:bg-purple-500 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Memory
        </button>
      </div>
      
      {showAdd && (
        <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
          <h4 className="font-medium mb-4">New Memory</h4>
          
          <div className="space-y-4">
            <input
              type="text"
              value={newMemory.title}
              onChange={(e) => setNewMemory({ ...newMemory, title: e.target.value })}
              placeholder="Memory title..."
              className="w-full px-4 py-2 bg-white/5 rounded-lg border border-white/10 focus:border-purple-500 outline-none"
            />
            
            <textarea
              value={newMemory.description}
              onChange={(e) => setNewMemory({ ...newMemory, description: e.target.value })}
              placeholder="Describe the memory..."
              className="w-full h-24 px-4 py-2 bg-white/5 rounded-lg border border-white/10 focus:border-purple-500 outline-none resize-none"
            />
            
            <div className="flex items-center gap-4">
              <input
                type="date"
                value={newMemory.date}
                onChange={(e) => setNewMemory({ ...newMemory, date: e.target.value })}
                className="px-4 py-2 bg-white/5 rounded-lg border border-white/10"
              />
              
              <div className="flex gap-2">
                {emotions.map((emotion) => (
                  <button
                    key={emotion.value}
                    onClick={() => setNewMemory({ ...newMemory, emotion: emotion.value })}
                    className={`p-2 rounded-lg transition-colors ${
                      newMemory.emotion === emotion.value
                        ? 'bg-purple-600'
                        : 'bg-white/5 hover:bg-white/10'
                    }`}
                    title={emotion.label}
                  >
                    <span className="text-xl">{emotion.emoji}</span>
                  </button>
                ))}
              </div>
            </div>
            
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
                Add Memory
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="space-y-4">
        {sortedMemories.length === 0 ? (
          <div className="text-center py-12 text-white/40">
            <Heart className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p>No memories yet. Add some defining moments!</p>
          </div>
        ) : (
          sortedMemories.map((memory) => {
            const emotion = emotions.find((e) => e.value === memory.emotion)
            
            return (
              <div
                key={memory.id}
                className={`p-5 rounded-2xl border transition-all ${
                  memory.isCore
                    ? 'bg-purple-500/10 border-purple-500/30'
                    : 'bg-white/5 border-white/10'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <span className="text-3xl">{emotion?.emoji}</span>
                    
                    <div>
                      <h4 className="font-semibold text-lg">{memory.title}</h4>
                      {memory.date && (
                        <span className="text-sm text-white/50">{new Date(memory.date).toLocaleDateString()}</span>
                      )}
                      {memory.description && (
                        <p className="text-white/70 mt-2">{memory.description}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleCoreMemory(memory.id)}
                      className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                        memory.isCore
                          ? 'bg-purple-600'
                          : 'bg-white/5 hover:bg-white/10'
                      }`}
                    >
                      {memory.isCore ? 'Core Memory' : 'Make Core'}
                    </button>
                    
                    <button
                      onClick={() => deleteMemory(memory.id)}
                      className="p-2 text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
