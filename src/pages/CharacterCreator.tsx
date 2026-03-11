import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useAppStore } from '@/stores/appStore'
import { BabylonViewer } from '@/components/BabylonViewer'
import type { Character, CustomPersonalityBox, Memory, Outfit, EvolutionEntry, Relationship } from '@/types'
import { Plus, Trash2, Heart, User, Brain, Shirt, TrendingUp, Users } from 'lucide-react'

const tabs = [
  { id: 'appearance', label: 'Appearance', icon: User },
  { id: 'personality', label: 'Personality', icon: Brain },
  { id: 'memories', label: 'Memories', icon: Heart },
  { id: 'outfits', label: 'Outfits', icon: Shirt },
  { id: 'evolution', label: 'Evolution', icon: TrendingUp },
  { id: 'relationships', label: 'Relationships', icon: Users }
]

export function CharacterCreator() {
  const { id } = useParams()
  const { characters, addCharacter, updateCharacter } = useAppStore()
  const [activeTab, setActiveTab] = useState('appearance')
  const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(null)
  
  const storyCharacters = characters.filter((c) => c.storyId === id)
  const selectedCharacter = storyCharacters.find((c) => c.id === selectedCharacterId)
  
  const handleCreateCharacter = () => {
    const newChar = addCharacter({
      storyId: id!,
      name: 'New Character',
      age: 25,
      gender: 'other',
      appearance: {
        hairColor: '#000000',
        hairStyle: 'short',
        eyeColor: '#4a4a4a',
        skinTone: '#d4a574',
        height: 'average',
        build: 'average',
        features: ''
      },
      personality: {
        traits: '',
        customBoxes: []
      },
      memories: [],
      outfits: [],
      evolution: [],
      relationships: []
    })
    setSelectedCharacterId(newChar.id)
  }
  
  return (
    <div className="flex h-full"
    >
      {/* Character list sidebar */}
      <div className="w-64 bg-slate-900 border-r border-white/10 flex flex-col"
      >
        <div className="p-4 border-b border-white/10"
        >
          <button
            onClick={handleCreateCharacter}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Character
          </button>
        </div>
        
        <div className="flex-1 overflow-auto p-2">
          {storyCharacters.length === 0 ? (
            <p className="text-center text-white/40 py-8">No characters yet</p>
          ) : (
            storyCharacters.map((char) => (
              <button
                key={char.id}
                onClick={() => setSelectedCharacterId(char.id)}
                className={`w-full text-left p-3 rounded-lg mb-1 transition-colors ${
                  selectedCharacterId === char.id
                    ? 'bg-white/10'
                    : 'hover:bg-white/5'
                }`}
              >
                <div className="font-medium">{char.name}</div>
                <div className="text-sm text-white/50">{char.age} years • {char.gender}</div>
              </button>
            ))
          )}
        </div>
      </div>
      
      {/* Main editor */}
      {selectedCharacter ? (
        <div className="flex-1 flex flex-col">
          {/* Header with tabs */}
          <div className="border-b border-white/10"
          >
            <div className="flex items-center justify-between px-6 py-4"
            >
              <input
                type="text"
                value={selectedCharacter.name}
                onChange={(e) => updateCharacter(selectedCharacter.id, { name: e.target.value })}
                className="text-2xl font-bold bg-transparent border-none outline-none focus:border-b focus:border-purple-500"
              />
              
              <div className="flex items-center gap-4"
            >
                <input
                  type="number"
                  value={selectedCharacter.age}
                  onChange={(e) => updateCharacter(selectedCharacter.id, { age: parseInt(e.target.value) || 0 })}
                  className="w-20 px-2 py-1 bg-white/5 rounded text-center"
                />
                <select
                  value={selectedCharacter.gender}
                  onChange={(e) => updateCharacter(selectedCharacter.id, { gender: e.target.value })}
                  className="px-3 py-1 bg-white/5 rounded"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            
            {/* Tabs */}
            <div className="flex px-6">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                      activeTab === tab.id
                        ? 'border-purple-500 text-white'
                        : 'border-transparent text-white/50 hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                )
              })}
            </div>
          </div>
          
          {/* Tab content */}
          <div className="flex-1 overflow-auto p-6">
            {activeTab === 'appearance' && (
              <AppearanceTab 
                character={selectedCharacter} 
                onUpdate={(updates) => updateCharacter(selectedCharacter.id, updates)} 
              />
            )}
            {activeTab === 'personality' && (
              <PersonalityTab 
                character={selectedCharacter}
                onUpdate={(updates) => updateCharacter(selectedCharacter.id, updates)}
              />
            )}
            {activeTab === 'memories' && (
              <MemoriesTab
                character={selectedCharacter}
                onUpdate={(updates) => updateCharacter(selectedCharacter.id, updates)}
              />
            )}
            {activeTab === 'outfits' && (
              <OutfitsTab
                character={selectedCharacter}
                onUpdate={(updates) => updateCharacter(selectedCharacter.id, updates)}
              />
            )}
            {activeTab === 'evolution' && (
              <EvolutionTab
                character={selectedCharacter}
                onUpdate={(updates) => updateCharacter(selectedCharacter.id, updates)}
              />
            )}
            {activeTab === 'relationships' && (
              <RelationshipsTab
                character={selectedCharacter}
                storyId={id!}
                onUpdate={(updates) => updateCharacter(selectedCharacter.id, updates)}
              />
            )}
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center"
        >
          <p className="text-white/40">Select a character or create a new one</p>
        </div>
      )}
    </div>
  )
}

// Appearance Tab
function AppearanceTab({ character, onUpdate }: { character: Character; onUpdate: (u: Partial<Character>) => void }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6"
    >
      <div className="space-y-4">
        <h3 className="font-semibold">Physical Features</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-white/60 mb-1">Hair Color</label>
            <input
              type="color"
              value={character.appearance.hairColor}
              onChange={(e) => onUpdate({
                appearance: { ...character.appearance, hairColor: e.target.value }
              })}
              className="w-full h-10 rounded cursor-pointer"
            />
          </div>
          
          <div>
            <label className="block text-sm text-white/60 mb-1">Eye Color</label>
            <input
              type="color"
              value={character.appearance.eyeColor}
              onChange={(e) => onUpdate({
                appearance: { ...character.appearance, eyeColor: e.target.value }
              })}
              className="w-full h-10 rounded cursor-pointer"
            />
          </div>
          
          <div>
            <label className="block text-sm text-white/60 mb-1">Skin Tone</label>
            <input
              type="color"
              value={character.appearance.skinTone}
              onChange={(e) => onUpdate({
                appearance: { ...character.appearance, skinTone: e.target.value }
              })}
              className="w-full h-10 rounded cursor-pointer"
            />
          </div>
          
          <div>
            <label className="block text-sm text-white/60 mb-1">Hair Style</label>
            <select
              value={character.appearance.hairStyle}
              onChange={(e) => onUpdate({
                appearance: { ...character.appearance, hairStyle: e.target.value }
              })}
              className="w-full px-3 py-2 bg-white/5 rounded"
            >
              <option value="short">Short</option>
              <option value="medium">Medium</option>
              <option value="long">Long</option>
              <option value="bald">Bald</option>
            </select>
          </div>
        </div>
        
        <div>
          <label className="block text-sm text-white/60 mb-1">Distinguishing Features</label>
          <textarea
            value={character.appearance.features}
            onChange={(e) => onUpdate({
              appearance: { ...character.appearance, features: e.target.value }
            })}
            placeholder="Scars, tattoos, unique traits..."
            className="w-full px-3 py-2 bg-white/5 rounded h-24 resize-none"
          />
        </div>
      </div>
      
      <div>
        <h3 className="font-semibold mb-4">3D Preview</h3>
        <div className="rounded-xl overflow-hidden border border-white/10">
          <BabylonViewer 
            height="400px" 
            hairColor={character.appearance.hairColor}
            eyeColor={character.appearance.eyeColor}
            skinTone={character.appearance.skinTone}
            characterColor="#60a5fa"
            animate={true}
          />
        </div>
        <p className="text-sm text-white/40 mt-2 text-center">3D character preview updates with appearance settings</p>
      </div>
    </div>
  )
}

// Personality Tab with custom boxes
function PersonalityTab({ character, onUpdate }: { character: Character; onUpdate: (u: Partial<Character>) => void }) {
  const [newBoxName, setNewBoxName] = useState('')
  
  const addCustomBox = () => {
    if (!newBoxName.trim()) return
    
    const newBox: CustomPersonalityBox = {
      id: crypto.randomUUID(),
      name: newBoxName,
      content: ''
    }
    
    onUpdate({
      personality: {
        ...character.personality,
        customBoxes: [...character.personality.customBoxes, newBox]
      }
    })
    
    setNewBoxName('')
  }
  
  const updateCustomBox = (boxId: string, content: string) => {
    onUpdate({
      personality: {
        ...character.personality,
        customBoxes: character.personality.customBoxes.map((box) =>
          box.id === boxId ? { ...box, content } : box
        )
      }
    })
  }
  
  const deleteCustomBox = (boxId: string) => {
    onUpdate({
      personality: {
        ...character.personality,
        customBoxes: character.personality.customBoxes.filter((box) => box.id !== boxId)
      }
    })
  }
  
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm text-white/60 mb-1">Core Personality Traits</label>
        <textarea
          value={character.personality.traits}
          onChange={(e) => onUpdate({
            personality: { ...character.personality, traits: e.target.value }
          })}
          placeholder="Describe this character's personality..."
          className="w-full px-3 py-2 bg-white/5 rounded h-32 resize-none"
        />
      </div>
      
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Custom Personality Fields</h3>
          
          <div className="flex gap-2">
            <input
              type="text"
              value={newBoxName}
              onChange={(e) => setNewBoxName(e.target.value)}
              placeholder="New field name..."
              className="px-3 py-1 bg-white/5 rounded text-sm"
              onKeyDown={(e) => e.key === 'Enter' && addCustomBox()}
            />
            <button
              onClick={addCustomBox}
              className="px-3 py-1 bg-purple-600 rounded text-sm hover:bg-purple-700"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {character.personality.customBoxes.map((box) => (
            <div key={box.id} className="p-4 bg-white/5 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">{box.name}</span>
                <button
                  onClick={() => deleteCustomBox(box.id)}
                  className="text-red-400 hover:text-red-300"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              
              <textarea
                value={box.content}
                onChange={(e) => updateCustomBox(box.id, e.target.value)}
                placeholder={`Enter ${box.name}...`}
                className="w-full px-3 py-2 bg-white/5 rounded h-24 resize-none text-sm"
              />
            </div>
          ))}
        </div>
        
        {character.personality.customBoxes.length === 0 && (
          <p className="text-center text-white/40 py-8">No custom fields yet. Add one above!</p>
        )}
      </div>
    </div>
  )
}

// Memories Tab
function MemoriesTab({ character, onUpdate }: { character: Character; onUpdate: (u: Partial<Character>) => void }) {
  const [newMemory, setNewMemory] = useState<{ title: string; description: string; date: string; emotion: 'happy' | 'sad' | 'angry' | 'neutral' | 'scared' | 'surprised' }>({ 
    title: '', 
    description: '', 
    date: '', 
    emotion: 'neutral' 
  })
  
  const addMemory = () => {
    if (!newMemory.title.trim()) return
    
    const memory: Memory = {
      id: crypto.randomUUID(),
      title: newMemory.title,
      description: newMemory.description,
      date: newMemory.date,
      emotion: newMemory.emotion,
      isCore: false
    }
    
    onUpdate({ memories: [...character.memories, memory] })
    setNewMemory({ title: '', description: '', date: '', emotion: 'neutral' })
  }
  
  const deleteMemory = (id: string) => {
    onUpdate({ memories: character.memories.filter((m) => m.id !== id) })
  }
  
  const toggleCoreMemory = (id: string) => {
    onUpdate({
      memories: character.memories.map((m) =>
        m.id === id ? { ...m, isCore: !m.isCore } : m
      )
    })
  }
  
  const emotions = ['happy', 'sad', 'angry', 'neutral', 'scared', 'surprised'] as const
  
  return (
    <div className="space-y-6">
      <div className="p-4 bg-white/5 rounded-lg">
        <h3 className="font-semibold mb-4">Add New Memory</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            value={newMemory.title}
            onChange={(e) => setNewMemory({ ...newMemory, title: e.target.value })}
            placeholder="Memory title..."
            className="px-3 py-2 bg-white/5 rounded"
          />
          
          <input
            type="date"
            value={newMemory.date}
            onChange={(e) => setNewMemory({ ...newMemory, date: e.target.value })}
            className="px-3 py-2 bg-white/5 rounded"
          />
        </div>
        
        <textarea
          value={newMemory.description}
          onChange={(e) => setNewMemory({ ...newMemory, description: e.target.value })}
          placeholder="Describe the memory..."
          className="w-full mt-4 px-3 py-2 bg-white/5 rounded h-24 resize-none"
        />
        
        <div className="flex items-center gap-4 mt-4">
          <div className="flex gap-2">
            {emotions.map((emotion) => (
              <button
                key={emotion}
                onClick={() => setNewMemory({ ...newMemory, emotion })}
                className={`px-3 py-1 rounded capitalize text-sm ${
                  newMemory.emotion === emotion
                    ? 'bg-purple-600'
                    : 'bg-white/5 hover:bg-white/10'
                }`}
              >
                {emotion}
              </button>
            ))}
          </div>
          
          <button
            onClick={addMemory}
            className="ml-auto px-4 py-2 bg-purple-600 rounded hover:bg-purple-700"
          >
            Add Memory
          </button>
        </div>
      </div>
      
      <div className="space-y-3">
        {character.memories.length === 0 ? (
          <p className="text-center text-white/40 py-8">No memories yet</p>
        ) : (
          character.memories.map((memory) => (
            <div
              key={memory.id}
              className={`p-4 rounded-lg border ${
                memory.isCore ? 'bg-purple-500/10 border-purple-500/30' : 'bg-white/5 border-white/10'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">
                      {memory.emotion === 'happy' && '😊'}
                      {memory.emotion === 'sad' && '😢'}
                      {memory.emotion === 'angry' && '😠'}
                      {memory.emotion === 'neutral' && '😐'}
                      {memory.emotion === 'scared' && '😨'}
                      {memory.emotion === 'surprised' && '😲'}
                    </span>
                    <div>
                      <h4 className="font-medium">{memory.title}</h4>
                      {memory.date && (
                        <span className="text-sm text-white/50">{memory.date}</span>
                      )}
                    </div>
                  </div>
                  
                  {memory.description && (
                    <p className="mt-2 text-white/70">{memory.description}</p>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleCoreMemory(memory.id)}
                    className={`px-3 py-1 rounded text-sm ${
                      memory.isCore ? 'bg-purple-600' : 'bg-white/5 hover:bg-white/10'
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
          ))
        )}
      </div>
    </div>
  )
}

// Outfits Tab
function OutfitsTab({ character, onUpdate }: { character: Character; onUpdate: (u: Partial<Character>) => void }) {
  const [newOutfit, setNewOutfit] = useState({ name: '', description: '', tags: '' })
  
  const addOutfit = () => {
    if (!newOutfit.name.trim()) return
    
    const outfit: Outfit = {
      id: crypto.randomUUID(),
      name: newOutfit.name,
      description: newOutfit.description,
      tags: newOutfit.tags.split(',').map((t) => t.trim()).filter(Boolean)
    }
    
    onUpdate({ outfits: [...character.outfits, outfit] })
    setNewOutfit({ name: '', description: '', tags: '' })
  }
  
  const deleteOutfit = (id: string) => {
    onUpdate({ outfits: character.outfits.filter((o) => o.id !== id) })
  }
  
  const setCurrentOutfit = (id: string) => {
    onUpdate({ currentOutfitId: id })
  }
  
  return (
    <div className="space-y-6">
      <div className="p-4 bg-white/5 rounded-lg">
        <h3 className="font-semibold mb-4">Add New Outfit</h3>
        
        <input
          type="text"
          value={newOutfit.name}
          onChange={(e) => setNewOutfit({ ...newOutfit, name: e.target.value })}
          placeholder="Outfit name..."
          className="w-full px-3 py-2 bg-white/5 rounded mb-3"
        />
        
        <textarea
          value={newOutfit.description}
          onChange={(e) => setNewOutfit({ ...newOutfit, description: e.target.value })}
          placeholder="Describe the outfit..."
          className="w-full px-3 py-2 bg-white/5 rounded h-20 resize-none mb-3"
        />
        
        <input
          type="text"
          value={newOutfit.tags}
          onChange={(e) => setNewOutfit({ ...newOutfit, tags: e.target.value })}
          placeholder="Tags (comma separated)..."
          className="w-full px-3 py-2 bg-white/5 rounded mb-4"
        />
        
        <button
          onClick={addOutfit}
          className="px-4 py-2 bg-purple-600 rounded hover:bg-purple-700"
        >
          Add Outfit
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {character.outfits.length === 0 ? (
          <p className="text-center text-white/40 py-8 col-span-full">No outfits yet</p>
        ) : (
          character.outfits.map((outfit) => (
            <div
              key={outfit.id}
              className={`p-4 rounded-lg border ${
                character.currentOutfitId === outfit.id
                  ? 'bg-purple-500/10 border-purple-500'
                  : 'bg-white/5 border-white/10'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-medium">{outfit.name}</h4>
                <button
                  onClick={() => deleteOutfit(outfit.id)}
                  className="text-red-400 hover:text-red-300"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              
              {outfit.description && (
                <p className="text-sm text-white/70 mb-3">{outfit.description}</p>
              )}
              
              {outfit.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {outfit.tags.map((tag) => (
                    <span key={tag} className="px-2 py-0.5 bg-white/10 rounded text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              
              <button
                onClick={() => setCurrentOutfit(outfit.id)}
                className={`w-full py-2 rounded text-sm ${
                  character.currentOutfitId === outfit.id
                    ? 'bg-purple-600'
                    : 'bg-white/5 hover:bg-white/10'
                }`}
              >
                {character.currentOutfitId === outfit.id ? 'Currently Wearing' : 'Equip'}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

// Evolution Tab
function EvolutionTab({ character, onUpdate }: { character: Character; onUpdate: (u: Partial<Character>) => void }) {
  const [newStage, setNewStage] = useState({ stage: '', description: '', age: character.age, changes: '' })
  
  const addStage = () => {
    if (!newStage.stage.trim()) return
    
    const entry: EvolutionEntry = {
      id: crypto.randomUUID(),
      stage: newStage.stage,
      description: newStage.description,
      age: newStage.age,
      changes: newStage.changes,
      unlockedAt: Date.now()
    }
    
    onUpdate({ evolution: [...character.evolution, entry] })
    setNewStage({ stage: '', description: '', age: character.age, changes: '' })
  }
  
  const deleteStage = (id: string) => {
    onUpdate({ evolution: character.evolution.filter((e) => e.id !== id) })
  }
  
  const sortedEvolution = [...character.evolution].sort((a, b) => a.age - b.age)
  
  return (
    <div className="space-y-6">
      <div className="p-4 bg-white/5 rounded-lg">
        <h3 className="font-semibold mb-4">Add Character Stage</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            value={newStage.stage}
            onChange={(e) => setNewStage({ ...newStage, stage: e.target.value })}
            placeholder="Stage name (e.g., 'The Fall', 'Redemption')..."
            className="px-3 py-2 bg-white/5 rounded"
          />
          
          <input
            type="number"
            value={newStage.age}
            onChange={(e) => setNewStage({ ...newStage, age: parseInt(e.target.value) || 0 })}
            placeholder="Age..."
            className="px-3 py-2 bg-white/5 rounded"
          />
        </div>
        
        <textarea
          value={newStage.description}
          onChange={(e) => setNewStage({ ...newStage, description: e.target.value })}
          placeholder="Describe this stage of the character's journey..."
          className="w-full mt-3 px-3 py-2 bg-white/5 rounded h-20 resize-none"
        />
        
        <textarea
          value={newStage.changes}
          onChange={(e) => setNewStage({ ...newStage, changes: e.target.value })}
          placeholder="What changes in this stage? (personality, appearance, etc.)..."
          className="w-full mt-3 px-3 py-2 bg-white/5 rounded h-20 resize-none"
        />
        
        <button
          onClick={addStage}
          className="mt-4 px-4 py-2 bg-purple-600 rounded hover:bg-purple-700"
        >
          Add Stage
        </button>
      </div>
      
      <div className="space-y-4">
        {sortedEvolution.length === 0 ? (
          <p className="text-center text-white/40 py-8">No evolution stages yet</p>
        ) : (
          sortedEvolution.map((entry, index) => (
            <div key={entry.id} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>
                {index < sortedEvolution.length - 1 && (
                  <div className="w-0.5 flex-1 bg-white/10 my-2" />
                )}
              </div>
              
              <div className="flex-1 p-4 bg-white/5 rounded-lg">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold">{entry.stage}</h4>
                    <span className="text-sm text-white/50">Age {entry.age}</span>
                  </div>
                  
                  <button
                    onClick={() => deleteStage(entry.id)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
                {entry.description && (
                  <p className="mt-2 text-white/70">{entry.description}</p>
                )}
                
                {entry.changes && (
                  <div className="mt-3 p-2 bg-white/5 rounded">
                    <span className="text-xs text-white/50">Changes:</span>
                    <p className="text-sm text-white/70">{entry.changes}</p>
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

// Relationships Tab
function RelationshipsTab({ 
  character, 
  storyId,
  onUpdate 
}: { 
  character: Character
  storyId: string
  onUpdate: (u: Partial<Character>) => void 
}) {
  const { characters } = useAppStore()
  const [newRelationship, setNewRelationship] = useState({
    targetId: '',
    type: 'friend' as const,
    description: ''
  })
  
  const otherCharacters = characters.filter(
    (c) => c.storyId === storyId && c.id !== character.id
  )
  
  const existingRelationships = character.relationships || []
  
  const addRelationship = () => {
    if (!newRelationship.targetId) return
    
    // Check if relationship already exists
    if (existingRelationships.some((r) => r.targetCharacterId === newRelationship.targetId)) {
      return
    }
    
    const relationship: Relationship = {
      id: crypto.randomUUID(),
      targetCharacterId: newRelationship.targetId,
      type: newRelationship.type,
      strength: 50,
      description: newRelationship.description
    }
    
    onUpdate({ relationships: [...existingRelationships, relationship] })
    setNewRelationship({ targetId: '', type: 'friend', description: '' })
  }
  
  const updateRelationshipStrength = (id: string, strength: number) => {
    onUpdate({
      relationships: existingRelationships.map((r) =>
        r.id === id ? { ...r, strength: Math.max(0, Math.min(100, strength)) } : r
      )
    })
  }
  
  const deleteRelationship = (id: string) => {
    onUpdate({
      relationships: existingRelationships.filter((r) => r.id !== id)
    })
  }
  
  const getRelationshipLabel = (strength: number) => {
    if (strength >= 80) return 'Very Strong'
    if (strength >= 60) return 'Strong'
    if (strength >= 40) return 'Moderate'
    if (strength >= 20) return 'Weak'
    return 'Very Weak'
  }
  
  const relationshipTypes = ['friend', 'enemy', 'lover', 'family', 'rival', 'mentor', 'colleague', 'neutral'] as const
  
  return (
    <div className="space-y-6">
      <div className="p-4 bg-white/5 rounded-lg">
        <h3 className="font-semibold mb-4">Add Relationship</h3>
        
        {otherCharacters.length === 0 ? (
          <p className="text-white/40">No other characters to relate to. Create more characters first!</p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select
                value={newRelationship.targetId}
                onChange={(e) => setNewRelationship({ ...newRelationship, targetId: e.target.value })}
                className="px-3 py-2 bg-white/5 rounded"
              >
                <option value="">Select character...</option>
                {otherCharacters
                  .filter((c) => !existingRelationships.some((r) => r.targetCharacterId === c.id))
                  .map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
              </select>
              
              <select
                value={newRelationship.type}
                onChange={(e) => setNewRelationship({ ...newRelationship, type: e.target.value as any })}
                className="px-3 py-2 bg-white/5 rounded"
              >
                {relationshipTypes.map((type) => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            
            <textarea
              value={newRelationship.description}
              onChange={(e) => setNewRelationship({ ...newRelationship, description: e.target.value })}
              placeholder="Describe the relationship..."
              className="w-full mt-3 px-3 py-2 bg-white/5 rounded h-20 resize-none"
            />
            
            <button
              onClick={addRelationship}
              disabled={!newRelationship.targetId}
              className="mt-4 px-4 py-2 bg-purple-600 rounded hover:bg-purple-700 disabled:opacity-50"
            >
              Add Relationship
            </button>
          </>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {existingRelationships.length === 0 ? (
          <p className="text-center text-white/40 py-8 col-span-full">No relationships yet</p>
        ) : (
          existingRelationships.map((rel) => {
            const targetChar = otherCharacters.find((c) => c.id === rel.targetCharacterId)
            if (!targetChar) return null
            
            return (
              <div key={rel.id} className="p-4 bg-white/5 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-purple-600/30 flex items-center justify-center">
                      <span className="text-lg">{targetChar.name.charAt(0)}</span>
                    </div>
                    
                    <div>
                      <h4 className="font-medium">{targetChar.name}</h4>
                      <span className="text-sm text-purple-400 capitalize">{rel.type}</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => deleteRelationship(rel.id)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="mb-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-white/60">{getRelationshipLabel(rel.strength)}</span>
                    <span>{rel.strength}%</span>
                  </div>
                  
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={rel.strength}
                    onChange={(e) => updateRelationshipStrength(rel.id, parseInt(e.target.value))}
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
