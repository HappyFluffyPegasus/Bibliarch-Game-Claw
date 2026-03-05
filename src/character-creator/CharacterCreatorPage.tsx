import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useStoryStore } from '../stores/storyStore';
import { BabylonViewer } from '../components/BabylonViewer';
import { PersonalityCreator } from '../components/PersonalityCreator';
import { MemorySystem } from '../components/MemorySystem';
import { CharacterEvolutionPanel } from '../components/CharacterEvolution';
import { OutfitSystem } from '../components/OutfitSystem';
import { RelationshipGraphPage } from './RelationshipGraphPage';
import { Plus, Trash2, Camera, Users, Brain, Heart, Shirt, History } from 'lucide-react';
import { cn } from '../lib/utils';
import { GlassCard } from '../components/GlassCard';

const tabs = [
  { id: 'appearance', label: '3D Appearance', icon: Camera },
  { id: 'personality', label: 'Personality', icon: Brain },
  { id: 'memories', label: 'Memories', icon: History },
  { id: 'outfits', label: 'Outfits', icon: Shirt },
  { id: 'evolution', label: 'Evolution', icon: Users },
  { id: 'relationships', label: 'Relationships', icon: Heart },
];

export function CharacterCreatorPage() {
  const { id } = useParams();
  const { currentStory, characters, loadStory, createCharacter, deleteCharacter } = useStoryStore();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('appearance');

  useEffect(() => {
    if (id) loadStory(id);
  }, [id]);

  const selectedChar = characters.find(c => c.id === selectedId);

  const handleCreate = () => {
    const char = createCharacter('New Character');
    setSelectedId(char.id);
  };

  // Render tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'appearance':
        return (
          <div className="h-full flex">
            {/* 3D Viewport */}
            <div className="flex-1 relative">
              <BabylonViewer modelUrl="/models/Bibliarch Maybe.glb" />
              
              <GlassCard className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 p-2">
                <Camera className="w-4 h-4 text-muted-foreground ml-2" />
                {['Face', 'Upper', 'Full', 'Feet'].map((preset) => (
                  <button
                    key={preset}
                    className="px-4 py-2 rounded-lg text-sm font-medium hover:bg-accent transition-colors"
                  >
                    {preset}
                  </button>
                ))}
              </GlassCard>
            </div>

            {/* Asset Panel */}
            <div className="w-80 border-l border-border bg-card/50 backdrop-blur p-4 overflow-y-auto">
              <h3 className="font-semibold mb-4">3D Customization</h3>
              
              <div className="space-y-4">
                {['Hair', 'Top', 'Pants', 'Shoes', 'Accessories'].map((cat) => (
                  <div key={cat} className="p-3 border border-border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{cat}</span>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" defaultChecked className="rounded" />
                        <span className="text-sm">Visible</span>
                      </label>
                    </div>
                    <div className="flex gap-2">
                      {['#1a1a1a', '#3b82f6', '#ef4444', '#22c55e'].map((color) => (
                        <button
                          key={color}
                          className="w-8 h-8 rounded-lg border border-border"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      
      case 'personality':
        return <PersonalityCreator />;
      
      case 'memories':
        return selectedChar ? <MemorySystem characterId={selectedChar.id} /> : null;
      
      case 'outfits':
        return selectedChar ? <OutfitSystem characterId={selectedChar.id} /> : null;
      
      case 'evolution':
        return selectedChar ? <CharacterEvolutionPanel characterId={selectedChar.id} /> : null;
      
      case 'relationships':
        return <RelationshipGraphPage />;
      
      default:
        return null;
    }
  };

  if (!currentStory) return <div className="p-8">Loading...</div>;

  return (
    <div className="h-screen flex bg-background">
      {/* Character List */}
      <div className="w-64 border-r border-border bg-card/50 backdrop-blur flex flex-col">
        <div className="p-4 border-b border-border">
          <button
            onClick={handleCreate}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-violet-500/25 transition-all"
          >
            <Plus className="w-4 h-4" />
            New Character
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {characters.map((char) => (
            <button
              key={char.id}
              onClick={() => setSelectedId(char.id)}
              className={cn(
                "w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all",
                selectedId === char.id 
                  ? "bg-gradient-to-r from-violet-500/20 to-indigo-500/20 border border-violet-500/30" 
                  : "hover:bg-accent/50"
              )}
            >
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center text-white font-bold">
                {char.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{char.name || 'Unnamed'}</div>
                <div className="text-xs text-muted-foreground">Tap to edit</div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteCharacter(char.id);
                  if (selectedId === char.id) setSelectedId(null);
                }}
                className="p-1.5 hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {selectedChar ? (
          <>
            {/* Header with Tabs */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <input
                type="text"
                value={selectedChar.name}
                onChange={(e) => {
                  // Update character name
                }}
                className="text-2xl font-bold bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-ring rounded px-2"
              />
              
              <div className="flex gap-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                        activeTab === tab.id
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-accent text-muted-foreground"
                      )}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="hidden lg:inline">{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-hidden p-6">
              {renderTabContent()}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-violet-500/20 to-indigo-500/20 flex items-center justify-center">
                <Plus className="w-12 h-12 text-violet-500" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Create a Character</h2>
              <p className="text-muted-foreground max-w-md">
                Design unique characters with personality, memories, outfits, and evolution over time.
              </p>
              <button
                onClick={handleCreate}
                className="mt-6 px-6 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-violet-500/25 transition-all"
              >
                Start Creating
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
