import { useState, useRef, useEffect } from 'react'
import { useCharacterStore } from '../stores/characterStore'
import { CharacterViewer } from '../components/CharacterViewer'
import type { CharacterViewerRef } from '../components/CharacterViewer'
import { 
  User, 
  Brain, 
  Heart, 
  Shirt, 
  TrendingUp, 
  Users,
  Plus,
  Save
} from 'lucide-react'
import { AppearanceTab } from './tabs/AppearanceTab'
import { PersonalityTab } from './tabs/PersonalityTab'
import { MemoriesTab } from './tabs/MemoriesTab'
import { OutfitsTab } from './tabs/OutfitsTab'
import { EvolutionTab } from './tabs/EvolutionTab'
import { RelationshipsTab } from './tabs/RelationshipsTab'

const tabs = [
  { id: 'appearance', label: 'Appearance', icon: User, color: '#ec4899' },
  { id: 'personality', label: 'Personality', icon: Brain, color: '#8b5cf6' },
  { id: 'memories', label: 'Memories', icon: Heart, color: '#ef4444' },
  { id: 'outfits', label: 'Outfits', icon: Shirt, color: '#10b981' },
  { id: 'evolution', label: 'Evolution', icon: TrendingUp, color: '#f59e0b' },
  { id: 'relationships', label: 'Relationships', icon: Users, color: '#3b82f6' }
]

export function CharacterCreator() {
  const { 
    character, 
    savedCharacters, 
    createCharacter, 
    saveCharacter, 
    loadCharacter,
    setAnimation
  } = useCharacterStore()
  
  const [activeTab, setActiveTab] = useState('appearance')
  const [showNewCharacter, setShowNewCharacter] = useState(false)
  const [newName, setNewName] = useState('')
  const [modelLoaded, setModelLoaded] = useState(false)
  const [availableAnimations, setAvailableAnimations] = useState<string[]>([])
  const [availableMorphs, setAvailableMorphs] = useState<string[]>([])
  
  const viewerRef = useRef<CharacterViewerRef>(null)
  
  // Load animation/morph lists once model loads
  const handleModelLoad = () => {
    setModelLoaded(true)
    if (viewerRef.current) {
      setAvailableAnimations(viewerRef.current.getAnimations())
      setAvailableMorphs(viewerRef.current.getMorphTargets())
    }
  }
  
  const handleCreate = () => {
    if (!newName.trim()) return
    createCharacter(newName)
    setNewName('')
    setShowNewCharacter(false)
  }
  
  // Create default character if none exists
  useEffect(() => {
    if (!character && savedCharacters.length === 0) {
      createCharacter('New Character')
    }
  }, [])
  
  return (
    <div className="h-screen flex bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden">
      {/* Left sidebar - Character list */}
      <div className="w-72 bg-slate-900/50 backdrop-blur border-r border-white/10 flex flex-col">
        <div className="p-6 border-b border-white/10">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
            Character Creator
          </h1>
          <p className="text-white/50 text-sm mt-1">Design your story's cast</p>
        </div>
        
        <div className="flex-1 overflow-auto p-4">
          <button
            onClick={() => setShowNewCharacter(true)}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 mb-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl hover:from-purple-500 hover:to-pink-500 transition-all shadow-lg shadow-purple-500/20"
          >
            <Plus className="w-5 h-5" />
            New Character
          </button>
          
          <div className="space-y-2">
            {savedCharacters.map((char) => (
              <button
                key={char.id}
                onClick={() => loadCharacter(char.id)}
                className={`w-full text-left p-4 rounded-xl transition-all ${
                  character?.id === char.id
                    ? 'bg-white/10 border border-white/20'
                    : 'hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-lg">
                    {char.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{char.name}</div>
                    <div className="text-sm text-white/50">{char.age} years • {char.gender}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Main content */}
      {character ? (
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <div className="flex items-center justify-between px-8 py-6 border-b border-white/10">
            <div className="flex items-center gap-6">
              <input
                type="text"
                value={character.name}
                onChange={(e) => useCharacterStore.getState().updateCharacter({ name: e.target.value })}
                className="text-3xl font-bold bg-transparent border-none outline-none focus:border-b-2 focus:border-purple-500 transition-colors w-64"
              />
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <label className="text-white/50 text-sm">Age</label>
                  <input
                    type="number"
                    value={character.age}
                    onChange={(e) => useCharacterStore.getState().updateCharacter({ age: parseInt(e.target.value) || 0 })}
                    className="w-20 px-3 py-1.5 bg-white/5 rounded-lg border border-white/10 focus:border-purple-500 outline-none"
                  />
                </div>
                
                <select
                  value={character.gender}
                  onChange={(e) => useCharacterStore.getState().updateCharacter({ gender: e.target.value as any })}
                  className="px-4 py-1.5 bg-white/5 rounded-lg border border-white/10 focus:border-purple-500 outline-none"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Non-binary</option>
                </select>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {availableAnimations.length > 0 && (
                <select
                  value={character.currentAnimation}
                  onChange={(e) => setAnimation(e.target.value)}
                  className="px-4 py-2 bg-white/5 rounded-lg border border-white/10"
                >
                  {availableAnimations.map((anim) => (
                    <option key={anim} value={anim}>{anim}</option>
                  ))}
                </select>
              )}
              
              <button
                onClick={() => saveCharacter()}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 rounded-lg hover:bg-purple-500 transition-colors"
              >
                <Save className="w-4 h-4" />
                Save
              </button>
            </div>
          </div>
          
          {/* Tab navigation */}
          <div className="flex px-8 border-b border-white/10">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center gap-2 px-6 py-4 transition-all ${
                    isActive ? 'text-white' : 'text-white/50 hover:text-white/80'
                  }`}
                >
                  <Icon className="w-5 h-5" style={{ color: isActive ? tab.color : undefined }} />
                  <span className="font-medium">{tab.label}</span>
                  
                  {isActive && (
                    <div 
                      className="absolute bottom-0 left-0 right-0 h-0.5"
                      style={{ backgroundColor: tab.color }}
                    />
                  )}
                </button>
              )
            })}
          </div>
          
          {/* Content area */}
          <div className="flex-1 flex overflow-hidden">
            {/* Tab content */}
            <div className="flex-1 overflow-auto p-8">
              {activeTab === 'appearance' && <AppearanceTab morphTargets={availableMorphs} />}
              {activeTab === 'personality' && <PersonalityTab />}
              {activeTab === 'memories' && <MemoriesTab />}
              {activeTab === 'outfits' && <OutfitsTab />}
              {activeTab === 'evolution' && <EvolutionTab />}
              {activeTab === 'relationships' && <RelationshipsTab />}
            </div>
            
            {/* 3D Preview panel */}
            <div className="w-[500px] border-l border-white/10 bg-slate-900/30 flex flex-col">
              <div className="flex-1 p-6">
                <div className="h-full rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-b from-slate-800/50 to-slate-900/50">
                  <CharacterViewer
                    ref={viewerRef}
                    character={character}
                    height="100%"
                    onLoad={handleModelLoad}
                    onError={(err) => console.error('Model error:', err)}
                  />
                </div>
              </div>
              
              <div className="px-6 pb-6">
                <div className="p-4 bg-white/5 rounded-xl">
                  <p className="text-sm text-white/60 mb-2">3D Preview</p>
                  <p className="text-xs text-white/40">
                    {modelLoaded 
                      ? `✓ Model loaded • ${availableAnimations.length} animations • ${availableMorphs.length} morph targets`
                      : 'Loading model...'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <User className="w-20 h-20 mx-auto mb-4 text-white/20" />
            <p className="text-white/40">Create a character to get started</p>
          </div>
        </div>
      )}
      
      {/* New character modal */}
      {showNewCharacter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">Create New Character</h3>
            
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Character name..."
              className="w-full px-4 py-3 bg-white/5 rounded-xl border border-white/10 focus:border-purple-500 outline-none mb-6"
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
            />
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowNewCharacter(false)}
                className="flex-1 px-4 py-2 border border-white/10 rounded-xl hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={!newName.trim()}
                className="flex-1 px-4 py-2 bg-purple-600 rounded-xl hover:bg-purple-500 disabled:opacity-50 transition-colors"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
