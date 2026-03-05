import { useState, useEffect, useCallback } from 'react';
import { Search, FileText, User, Map, Video, Clock, Settings, Command } from 'lucide-react';
import { cn } from '../lib/utils';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  storyId?: string;
}

interface CommandItem {
  id: string;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  shortcut?: string;
  action: () => void;
}

export function CommandPalette({ isOpen, onClose, storyId }: CommandPaletteProps) {
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const commands: CommandItem[] = [
    {
      id: 'new-story',
      label: 'New Story',
      description: 'Create a new story project',
      icon: FileText,
      shortcut: '⌘N',
      action: () => {
        // Navigate to dashboard and trigger new story
        window.location.href = '/';
      }
    },
    {
      id: 'goto-notes',
      label: 'Go to Notes',
      description: 'Open the canvas notes editor',
      icon: FileText,
      shortcut: '⌘1',
      action: () => {
        if (storyId) window.location.href = `/story/${storyId}/notes`;
      }
    },
    {
      id: 'goto-characters',
      label: 'Go to Characters',
      description: 'Open the character creator',
      icon: User,
      shortcut: '⌘2',
      action: () => {
        if (storyId) window.location.href = `/story/${storyId}/characters`;
      }
    },
    {
      id: 'goto-world',
      label: 'Go to World',
      description: 'Open the world builder',
      icon: Map,
      shortcut: '⌘3',
      action: () => {
        if (storyId) window.location.href = `/story/${storyId}/world`;
      }
    },
    {
      id: 'goto-scenes',
      label: 'Go to Scenes',
      description: 'Open the scene editor',
      icon: Video,
      shortcut: '⌘4',
      action: () => {
        if (storyId) window.location.href = `/story/${storyId}/scenes`;
      }
    },
    {
      id: 'goto-timeline',
      label: 'Go to Timeline',
      description: 'Open the story timeline',
      icon: Clock,
      shortcut: '⌘5',
      action: () => {
        if (storyId) window.location.href = `/story/${storyId}/timeline`;
      }
    },
    {
      id: 'settings',
      label: 'Settings',
      description: 'Open application settings',
      icon: Settings,
      shortcut: '⌘,',
      action: () => {
        // Open settings modal
      }
    },
  ];

  const filteredCommands = commands.filter(
    cmd => 
      cmd.label.toLowerCase().includes(search.toLowerCase()) ||
      cmd.description.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    setSelectedIndex(0);
  }, [search]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(i => (i + 1) % filteredCommands.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(i => (i - 1 + filteredCommands.length) % filteredCommands.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const cmd = filteredCommands[selectedIndex];
        if (cmd) {
          cmd.action();
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredCommands, selectedIndex, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]">
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-2xl bg-card border border-border rounded-xl shadow-2xl overflow-hidden">
        <div className="flex items-center gap-3 p-4 border-b border-border">
          <Search className="w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Type a command or search..."
            className="flex-1 bg-transparent outline-none text-lg"
            autoFocus
          />
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <kbd className="px-1.5 py-0.5 bg-muted rounded">↑↓</kbd>
            <span>to navigate</span>
            <kbd className="px-1.5 py-0.5 bg-muted rounded ml-2">↵</kbd>
            <span>to select</span>
          </div>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-2">
          {filteredCommands.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              No commands found
            </div>
          ) : (
            <div className="space-y-1">
              {filteredCommands.map((cmd, index) => {
                const Icon = cmd.icon;
                const isSelected = index === selectedIndex;
                
                return (
                  <button
                    key={cmd.id}
                    onClick={() => {
                      cmd.action();
                      onClose();
                    }}
                    className={cn(
                      "w-full flex items-center gap-3 p-3 rounded-lg transition-colors text-left",
                      isSelected ? "bg-primary text-primary-foreground" : "hover:bg-accent"
                    )}
                    onMouseEnter={() => setSelectedIndex(index)}
                  >
                    <Icon className={cn("w-5 h-5", isSelected ? "text-primary-foreground" : "text-muted-foreground")} />
                    
                    <div className="flex-1">
                      <div className="font-medium">{cmd.label}</div>
                      <div className={cn("text-sm", isSelected ? "text-primary-foreground/70" : "text-muted-foreground")}>
                        {cmd.description}
                      </div>
                    </div>
                    
                    {cmd.shortcut && (
                      <kbd className={cn(
                        "px-2 py-1 rounded text-xs",
                        isSelected ? "bg-primary-foreground/20" : "bg-muted"
                      )}>
                        {cmd.shortcut}
                      </kbd>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function useCommandPalette() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(open => !open);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return { isOpen, setIsOpen };
}