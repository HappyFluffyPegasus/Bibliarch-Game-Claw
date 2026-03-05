import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useStoryStore } from '../stores/storyStore';
import { BabylonViewer } from '../components/BabylonViewer';
import { Plus, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';
import type { Character } from '../db/database';

export function CharacterCreatorPage() {
  const { id } = useParams();
  const { currentStory, characters, loadStory, createCharacter, updateCharacter, deleteCharacter } = useStoryStore();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'appearance' | 'profile'>('appearance');

  useEffect(() => {
    if (id) loadStory(id);
  }, [id]);

  const selectedChar = characters.find(c => c.id === selectedId);

  const handleCreate = () => {
    const char = createCharacter('New Character');
    setSelectedId(char.id);
  };

  if (!currentStory) return <div className="p-8">Loading...</div>;

  return (
    <div className="h-screen flex">
      {/* Character List */}
      <div className="w-72 border-r border-border bg-card flex flex-col">
        <div className="p-4 border-b border-border">
          <button
            onClick={handleCreate}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            <Plus className="w-4 h-4" />
            New Character
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {characters.map((char) => (
            <button
              key={char.id}
              onClick={() => setSelectedId(char.id)}
              className={cn(
                "w-full flex items-center gap-3 p-3 text-left hover:bg-accent transition-colors",
                selectedId === char.id && "bg-primary/10 border-r-2 border-primary"
              )}
            >
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                {char.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{char.name || 'Unnamed'}</div>
                <div className="text-xs text-muted-foreground">{char.appearance.visibleAssets.length} assets</div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteCharacter(char.id);
                  if (selectedId === char.id) setSelectedId(null);
                }}
                className="p-1.5 hover:text-destructive opacity-0 group-hover:opacity-100"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </button>
          ))}
        </div>
      </div>

      {/* Main Editor */}
      <div className="flex-1 flex flex-col">
        {selectedChar ? (
          <>
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <input
                type="text"
                value={selectedChar.name}
                onChange={(e) => updateCharacter(selectedChar.id, { name: e.target.value })}
                className="text-2xl font-bold bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-ring rounded px-2"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveTab('appearance')}
                  className={cn(
                    "px-4 py-2 rounded-md transition-colors",
                    activeTab === 'appearance' ? "bg-primary text-primary-foreground" : "hover:bg-accent"
                  )}
                
003e
                  Appearance
                </button>
                <button
                  onClick={() => setActiveTab('profile')}
                  className={cn(
                    "px-4 py-2 rounded-md transition-colors",
                    activeTab === 'profile' ? "bg-primary text-primary-foreground" : "hover:bg-accent"
                  )}
                
003e
                  Profile
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 flex overflow-hidden">
              {activeTab === 'appearance' ? (
                <>
                  {/* 3D Viewer */}
                  <div className="flex-1 relative">
                    <BabylonViewer />
                    
                    <div className="absolute bottom-4 left-4 bg-card/90 backdrop-blur rounded-lg p-3 border border-border">
                      <p className="text-xs text-muted-foreground mb-2">Camera Controls</p>
                      <div className="flex gap-2">
                        <button className="p-2 hover:bg-accent rounded" title="Face"><ChevronLeft className="w-4 h-4" /></button>
                        <button className="p-2 hover:bg-accent rounded" title="Body">Body</button>
                        <button className="p-2 hover:bg-accent rounded" title="Full">Full</button>
                        <button className="p-2 hover:bg-accent rounded" title="Feet"><ChevronRight className="w-4 h-4" /></button>
                      </div>
                    </div>
                  </div>

                  {/* Customization Panel */}
                  <div className="w-80 border-l border-border bg-card p-4 overflow-y-auto">
                    <h3 className="font-semibold mb-4">Assets</h3>
                    <div className="space-y-2">
                      {['Hair', 'Head', 'Top', 'Pants', 'Shoes', 'Accessories'].map((category) => (
                        <div key={category} className="p-3 border border-border rounded-lg">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{category}</span>
                            <label className="flex items-center gap-2">
                              <input type="checkbox" className="rounded" defaultChecked />
                              <span className="text-sm">Visible</span>
                            </label>
                          </div>
                        </div>
                      ))}
                    </div>

                    <h3 className="font-semibold mt-6 mb-4">Colors</h3>
                    <div className="space-y-3">
                      {['Skin', 'Hair', 'Eyes', 'Top', 'Pants', 'Shoes'].map((colorType) => (
                        <div key={colorType} className="flex items-center justify-between">
                          <span className="text-sm">{colorType}</span>
                          <input
                            type="color"
                            defaultValue="#808080"
                            className="w-12 h-8 rounded cursor-pointer"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 p-8 overflow-y-auto">
                  <div className="max-w-2xl space-y-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Backstory</label>
                      <textarea
                        value={selectedChar.backstory}
                        onChange={(e) => updateCharacter(selectedChar.id, { backstory: e.target.value })}
                        placeholder="Character backstory..."
                        rows={6}
                        className="w-full px-3 py-2 bg-background border border-input rounded-md resize-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { key: 'outlookOnLife', label: 'Outlook on Life' },
                        { key: 'favoriteFood', label: 'Favorite Food' },
                        { key: 'favoriteColor', label: 'Favorite Color' },
                      ].map(({ key, label }) => (
                        <div key={key}>
                          <label className="block text-sm font-medium mb-2">{label}</label>
                          <input
                            type="text"
                            value={(selectedChar as any)[key] || ''}
                            onChange={(e) => updateCharacter(selectedChar.id, { [key]: e.target.value })}
                            className="w-full px-3 py-2 bg-background border border-input rounded-md"
                          />
                        </div>
                      ))}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Custom Fields</label>
                      <div className="space-y-2">
                        {Object.entries(selectedChar.customFields).map(([key, value]) => (
                          <div key={key} className="flex gap-2">
                            <input
                              type="text"
                              value={key}
                              placeholder="Field name"
                              className="flex-1 px-3 py-2 bg-background border border-input rounded-md"
                            />
                            <input
                              type="text"
                              value={value}
                              placeholder="Value"
                              className="flex-1 px-3 py-2 bg-background border border-input rounded-md"
                            />
                          </div>
                        ))}
                        <button
                          onClick={() => {
                            const newFields = { ...selectedChar.customFields, ['']: '' };
                            updateCharacter(selectedChar.id, { customFields: newFields });
                          }}
                          className="text-sm text-primary hover:underline"
                        >
                          + Add custom field
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            Select or create a character to begin
          </div>
        )}
      </div>
    </div>
  );
}