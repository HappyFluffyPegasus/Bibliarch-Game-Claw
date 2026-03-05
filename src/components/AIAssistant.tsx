import { useState, useCallback } from 'react';
import { Sparkles, Wand2, BookOpen, ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';

interface AIAssistantProps {
  context: 'canvas' | 'character' | 'scene' | 'timeline';
  storyId?: string;
  characterId?: string;
}

export function AIAssistant({ context }: AIAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [suggestion, setSuggestion] = useState('');

  const generateSuggestion = useCallback(async (type: string) => {
    setIsGenerating(true);
    
    // Simulate AI generation (replace with actual AI API)
    await new Promise(r => setTimeout(r, 1500));
    
    const suggestions: Record<string, string[]> = {
      backstory: [
        "Born in the floating city of Aerith, they were raised by a guild of sky-pirates who taught them the art of cloud-navigation and the importance of found family.",
        "A former royal guard who lost everything in the Great Collapse, now wanders the wastelands seeking redemption for a single moment of cowardice.",
        "Grew up in a library that exists between dimensions, learning magic from sentient books that whisper secrets of forgotten worlds."
      ],
      dialogue: [
        '"The stars don\'t care about our plans," they said, sharpening their blade. "But I do. And that\'s why we\'ll win."',
        '"You want to know my secret?" A pause. "I\'m terrified. Every single day. But I do it anyway."',
        '"The difference between a hero and a villain isn\'t power. It\'s just... timing."'
      ],
      plot: [
        "The protagonist discovers that the 'ancient evil' they're fighting is actually a future version of themselves, trying to prevent a worse fate.",
        "What seems like a simple delivery mission becomes a conspiracy involving time loops, memory merchants, and a clock that counts backward.",
        "The love interest is revealed to be an AI, but the question becomes: does that make their feelings any less real?"
      ]
    };
    
    const options = suggestions[type] || suggestions.backstory;
    setSuggestion(options[Math.floor(Math.random() * options.length)]);
    setIsGenerating(false);
  }, []);

  const actions = [
    { id: 'backstory', label: 'Generate Backstory', icon: BookOpen, description: 'AI writes character history' },
    { id: 'dialogue', label: 'Write Dialogue', icon: Sparkles, description: 'Suggests character lines' },
    { id: 'plot', label: 'Plot Twist', icon: Wand2, description: 'Surprising story ideas' },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-full transition-all",
          "bg-gradient-to-r from-violet-600 to-indigo-600",
          "hover:from-violet-500 hover:to-indigo-500",
          "text-white shadow-lg shadow-violet-500/25",
          isOpen && "ring-2 ring-violet-400"
        )}
      >
        <Sparkles className="w-4 h-4" />
        <span>AI Assistant</span>
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-80 bg-card border border-border rounded-xl shadow-xl z-50 overflow-hidden">
          <div className="p-3 bg-gradient-to-r from-violet-600/10 to-indigo-600/10 border-b border-border">
            <p className="text-sm font-medium">AI Writing Assistant</p>
            <p className="text-xs text-muted-foreground">Get unstuck with AI suggestions</p>
          </div>

          {suggestion ? (
            <div className="p-4">
              <div className="bg-muted rounded-lg p-3 text-sm leading-relaxed">
                {suggestion}
              </div>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => setSuggestion('')}
                  className="flex-1 px-3 py-2 text-sm hover:bg-accent rounded-md"
                >
                  Discard
                </button>
                <button
                  onClick={() => {
                    // Copy to clipboard or insert
                    navigator.clipboard.writeText(suggestion);
                    setSuggestion('');
                  }}
                  className="flex-1 px-3 py-2 text-sm bg-primary text-primary-foreground rounded-md"
                >
                  Use This
                </button>
              </div>
            </div>
          ) : (
            <div className="p-2">
              {actions.map((action) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.id}
                    onClick={() => generateSuggestion(action.id)}
                    disabled={isGenerating}
                    className="w-full flex items-center gap-3 p-3 hover:bg-accent rounded-lg transition-colors text-left"
                  >
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500/20 to-indigo-500/20 flex items-center justify-center"
                    >
                      <Icon className="w-5 h-5 text-violet-500" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{action.label}</div>
                      <div className="text-xs text-muted-foreground">{action.description}</div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </button>
                );
              })}
            </div>
          )}

          {isGenerating && (
            <div className="absolute inset-0 bg-card/80 backdrop-blur flex items-center justify-center"
>
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-sm text-muted-foreground">AI is thinking...</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}