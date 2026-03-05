import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useStoryStore } from '../stores/storyStore';
import { cn } from '../lib/utils';
import { Plus, Trash2, GripVertical } from 'lucide-react';

export function CharactersPage() {
  const { id } = useParams();
  const { currentStory, characters, loadStory, createCharacter, updateCharacter, deleteCharacter, reorderCharacters } = useStoryStore();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState('');
  
  useEffect(() => {
    if (id) loadStory(id);
  }, [id]);
  
  const selectedChar = characters.find(c => c.id === selectedId);
  
  const handleCreate = () => {
    if (!newName.trim()) return;
    const char = createCharacter(newName.trim());
    setSelectedId(char.id);
    setIsCreating(false);
    setNewName('');
  };
  
  if (!currentStory) return <div className="p-8">Loading...</div>;
  
  return (
    <div className="h-screen flex">
      {/* Character List */}
      <div className="w-80 border-r border-border bg-card flex flex-col">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h2 className="font-semibold">Characters</h2>
          <button
            onClick={() => setIsCreating(true)}
            className="p-2 hover:bg-accent rounded-md"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {isCreating && (
            <div className="p-3 border-b border-border">
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                placeholder="Character name"
                autoFocus
                className="w-full px-3 py-2 bg-background border border-input rounded-md"
              />
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => setIsCreating(false)}
                  className="flex-1 px-3 py-1 text-sm hover:bg-accent rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreate}
                  className="flex-1 px-3 py-1 text-sm bg-primary text-primary-foreground rounded"
                >
                  Create
                </button>
              </div>
            </div>
          )}
          
          {characters.map((char, index) => (
            <div
              key={char.id}
              onClick={() => setSelectedId(char.id)}
              className={cn(
                "flex items-center gap-2 p-3 cursor-pointer border-b border-border",
                selectedId === char.id ? "bg-primary/10" : "hover:bg-accent"
              )}
            >
              <GripVertical className="w-4 h-4 text-muted-foreground" />
              <span className="flex-1 truncate">{char.name || 'Unnamed'}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteCharacter(char.id);
                  if (selectedId === char.id) setSelectedId(null);
                }}
                className="p-1 hover:text-destructive opacity-0 group-hover:opacity-100"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
      
      {/* Character Editor */}
      <div className="flex-1 p-8 overflow-y-auto">
        {selectedChar ? (
          <div className="max-w-2xl">
            <input
              type="text"
              value={selectedChar.name}
              onChange={(e) => updateCharacter(selectedChar.id, { name: e.target.value })}
              className="text-3xl font-bold bg-transparent border-b border-transparent hover:border-input focus:border-primary focus:outline-none w-full mb-6"
            />
            
            <div className="space-y-6">
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
                <div>
                  <label className="block text-sm font-medium mb-2">Outlook on Life</label>
                  <input
                    type="text"
                    value={selectedChar.outlookOnLife || ''}
                    onChange={(e) => updateCharacter(selectedChar.id, { outlookOnLife: e.target.value })}
                    className="w-full px-3 py-2 bg-background border border-input rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Favorite Food</label>
                  <input
                    type="text"
                    value={selectedChar.favoriteFood || ''}
                    onChange={(e) => updateCharacter(selectedChar.id, { favoriteFood: e.target.value })}
                    className="w-full px-3 py-2 bg-background border border-input rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Favorite Color</label>
                  <input
                    type="text"
                    value={selectedChar.favoriteColor || ''}
                    onChange={(e) => updateCharacter(selectedChar.id, { favoriteColor: e.target.value })}
                    className="w-full px-3 py-2 bg-background border border-input rounded-md"
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center text-muted-foreground mt-20">
            Select a character to edit
          </div>
        )}
      </div>
    </div>
  );
}