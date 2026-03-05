import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Keyboard, Command } from 'lucide-react';
import { GlassCard } from './GlassCard';

interface ShortcutCategory {
  name: string;
  shortcuts: Array<{ key: string; description: string }>;
}

const shortcuts: ShortcutCategory[] = [
  {
    name: 'Navigation',
    shortcuts: [
      { key: 'Cmd/Ctrl + K', description: 'Open Command Palette' },
      { key: 'Cmd/Ctrl + 1', description: 'Go to Notes' },
      { key: 'Cmd/Ctrl + 2', description: 'Go to Characters' },
      { key: 'Cmd/Ctrl + 3', description: 'Go to World' },
      { key: 'Cmd/Ctrl + 4', description: 'Go to Scenes' },
      { key: 'Cmd/Ctrl + 5', description: 'Go to Timeline' },
    ],
  },
  {
    name: 'Canvas Tools',
    shortcuts: [
      { key: 'V', description: 'Select Tool' },
      { key: 'Space + Drag', description: 'Pan Canvas' },
      { key: 'T', description: 'Text Node' },
      { key: 'C', description: 'Character Node' },
      { key: 'E', description: 'Event Node' },
      { key: 'L', description: 'Location Node' },
      { key: 'F', description: 'Folder Node' },
      { key: 'I', description: 'Image Node' },
    ],
  },
  {
    name: 'General',
    shortcuts: [
      { key: 'Esc', description: 'Close/Cancel' },
      { key: 'Delete', description: 'Remove Selected' },
      { key: '?', description: 'Show Keyboard Shortcuts' },
    ],
  },
];

interface KeyboardShortcutsProps {
  isOpen: boolean;
  onClose: () => void;
}

export function KeyboardShortcuts({ isOpen, onClose }: KeyboardShortcutsProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <GlassCard 
            className="w-full max-w-2xl max-h-[80vh] overflow-auto"
            onClick={() => {}}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Keyboard className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Keyboard Shortcuts</h2>
                    <p className="text-sm text-muted-foreground">Work faster with these shortcuts</p>
                  </div>
                </div>
                
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-accent rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {shortcuts.map((category) => (
                  <div key={category.name}>
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                      {category.name}
                    </h3>
                    <div className="space-y-2">
                      {category.shortcuts.map((shortcut) => (
                        <div 
                          key={shortcut.key}
                          className="flex items-center justify-between py-2 border-b border-border/50 last:border-0"
                        >
                          <span className="text-sm">{shortcut.description}</span>
                          <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">
                            {shortcut.key}
                          </kbd>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground text-center">
                  Press <kbd className="px-1.5 py-0.5 bg-muted rounded">?</kbd> anywhere to show this help
                </p>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function useKeyboardShortcuts() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Show shortcuts on '?' key (but not when typing in inputs)
      if (e.key === '?' && !e.shiftKey) {
        const target = e.target as HTMLElement;
        if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
          e.preventDefault();
          setIsOpen(true);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return { isOpen, setIsOpen };
}