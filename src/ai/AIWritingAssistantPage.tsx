import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Wand2, RefreshCw, Copy, Check, ChevronDown,
  MessageSquare, BookOpen, Lightbulb, PenTool, Zap
} from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { cn } from '../lib/utils';

interface AIWritingPrompt {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  category: 'plot' | 'character' | 'dialogue' | 'world' | 'editing';
}

const writingPrompts: AIWritingPrompt[] = [
  {
    id: 'continue-story',
    title: 'Continue Story',
    description: 'Generate the next scene based on context',
    icon: <BookOpen className="w-5 h-5" />,
    category: 'plot'
  },
  {
    id: 'writer-block',
    title: 'Beat Writer\'s Block',
    description: 'Get ideas when you\'re stuck',
    icon: <Lightbulb className="w-5 h-5" />,
    category: 'plot'
  },
  {
    id: 'dialogue-polish',
    title: 'Polish Dialogue',
    description: 'Make conversations more natural',
    icon: <MessageSquare className="w-5 h-5" />,
    category: 'dialogue'
  },
  {
    id: 'character-depth',
    title: 'Deepen Character',
    description: 'Add backstory and motivation',
    icon: <PenTool className="w-5 h-5" />,
    category: 'character'
  },
  {
    id: 'world-details',
    title: 'World Details',
    description: 'Flesh out locations and cultures',
    icon: <Sparkles className="w-5 h-5" />,
    category: 'world'
  },
  {
    id: 'pacing',
    title: 'Fix Pacing',
    description: 'Adjust story flow and tension',
    icon: <Zap className="w-5 h-5" />,
    category: 'editing'
  },
];

const toneOptions = [
  { id: 'professional', name: 'Professional', emoji: '👔' },
  { id: 'casual', name: 'Casual', emoji: '👕' },
  { id: 'dramatic', name: 'Dramatic', emoji: '🎭' },
  { id: 'humorous', name: 'Humorous', emoji: '😄' },
  { id: 'dark', name: 'Dark', emoji: '🌑' },
  { id: 'whimsical', name: 'Whimsical', emoji: '✨' },
  { id: 'romantic', name: 'Romantic', emoji: '💕' },
  { id: 'action', name: 'Action-Packed', emoji: '💥' },
];

export function AIWritingAssistantPage() {
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedTone, setSelectedTone] = useState('dramatic');
  const [copied, setCopied] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [history, setHistory] = useState<Array<{ prompt: string; output: string }>>([]);

  const generateResponse = async () => {
    if (!input.trim() || !selectedPrompt) return;
    
    setIsGenerating(true);
    
    // Simulate AI generation with realistic delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const prompt = writingPrompts.find(p => p.id === selectedPrompt);
    const tone = toneOptions.find(t => t.id === selectedTone);
    
    // Mock AI responses based on prompt type
    const responses: Record<string, string[]> = {
      'continue-story': [
        `The ${tone?.name.toLowerCase()} atmosphere hung heavy as the protagonist stepped forward, each footfall echoing through the chamber. What awaited them was beyond anything they had imagined...`,
        `With a ${tone?.name.toLowerCase()} resolve, they made their choice. The consequences would ripple through every aspect of their journey from this moment on.`,
        `The scene unfolded with ${tone?.name.toLowerCase()} intensity, revealing layers of complexity that would challenge everything they believed.`,
      ],
      'writer-block': [
        `Consider: What if your character discovered a hidden truth that changes their motivation? Or introduce an unexpected ally with questionable loyalties?`,
        `Try shifting perspectives - show this scene from the antagonist's viewpoint. What are they hoping won't happen?`,
        `What object in the scene could carry symbolic weight? A broken watch, a faded photograph, a mysterious key?`,
      ],
      'dialogue-polish': [
        `"I can't do this anymore," she said, her voice barely a whisper. The silence that followed spoke volumes more than any words could.`,
        `"You really think it'll be that simple?" He laughed, but there was no humor in it. "Nothing's ever simple. Not with us."`,
        `Instead of answering, they turned away. Sometimes silence was the only honest response.`,
      ],
      'character-depth': [
        `Your character carries a locket they never open. Inside is a photograph and a date - the reason they can't bring themselves to trust anyone completely.`,
        `They have a ritual: every morning, they arrange three objects on their windowsill. No one knows why, but it centers them before facing the world.`,
        `Their greatest fear isn't failure - it's being seen as ordinary. Everything they do is calculated to prove they're special.`,
      ],
      'world-details': [
        `The city is built in tiers, with the wealthy literally looking down on the poor. Rain flows downhill, carrying secrets from the heights to the depths.`,
        `Magic here isn't cast - it's negotiated. Every spell requires a conversation with something ancient and inhuman.`,
        `Time is measured not in hours but in the blooming of the ghost-flowers that only appear during moments of strong emotion.`,
      ],
      'pacing': [
        `Consider cutting this scene in half. Start later, end earlier. Trust your reader to fill in the gaps.`,
        `Add a moment of stillness here - let the characters (and readers) breathe before the next escalation.`,
        `This revelation might hit harder if we learn about it the same time the protagonist does. Consider rearranging.`,
      ],
    };
    
    const promptResponses = responses[selectedPrompt] || responses['continue-story'];
    const generatedText = promptResponses[Math.floor(Math.random() * promptResponses.length)];
    
    setOutput(generatedText);
    setHistory(prev => [{ prompt: input, output: generatedText }, ...prev.slice(0, 9)]);
    setIsGenerating(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const categories = ['all', 'plot', 'character', 'dialogue', 'world', 'editing'];

  const filteredPrompts = activeCategory === 'all' 
    ? writingPrompts 
    : writingPrompts.filter(p => p.category === activeCategory);

  return (
    <div className="h-screen flex bg-background">
      {/* Left Sidebar */}
      <div className="w-72 border-r border-border bg-card/50 flex flex-col">
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-5 h-5 text-violet-500" />
            <h2 className="font-semibold">AI Writing Assistant</h2>
          </div>
          <p className="text-xs text-muted-foreground">Get help with your story</p>
        </div>

        {/* Categories */}
        <div className="p-3 border-b border-border">
          <div className="flex flex-wrap gap-1">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "px-2 py-1 text-xs rounded-full capitalize transition-colors",
                  activeCategory === cat
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted hover:bg-accent"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Prompts */}
        <div className="flex-1 overflow-y-auto p-3">
          <div className="space-y-2">
            {filteredPrompts.map(prompt => (
              <button
                key={prompt.id}
                onClick={() => setSelectedPrompt(prompt.id)}
                className={cn(
                  "w-full p-3 rounded-xl border-2 text-left transition-all",
                  selectedPrompt === prompt.id
                    ? "border-violet-500 bg-violet-500/10"
                    : "border-transparent hover:border-violet-500/30 hover:bg-violet-500/5"
                )}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-violet-500">{prompt.icon}</span>
                  <span className="font-medium text-sm">{prompt.title}</span>
                </div>
                <p className="text-xs text-muted-foreground">{prompt.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* History */}
        {history.length > 0 && (
          <div className="p-3 border-t border-border max-h-48 overflow-y-auto">
            <h4 className="text-xs font-medium text-muted-foreground mb-2">Recent</h4>
            <div className="space-y-2">
              {history.map((item, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setInput(item.prompt);
                    setOutput(item.output);
                  }}
                  className="w-full text-left p-2 text-xs bg-muted rounded hover:bg-accent transition-colors truncate"
                >
                  {item.prompt.slice(0, 40)}...
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-3xl mx-auto">
            <AnimatePresence mode="wait">
              {selectedPrompt ? (
                <motion.div
                  key="assistant"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  {/* Tone Selection */}
                  <GlassCard className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Wand2 className="w-4 h-4 text-violet-500" />
                      <span className="text-sm font-medium">Select Tone</span>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {toneOptions.map(tone => (
                        <button
                          key={tone.id}
                          onClick={() => setSelectedTone(tone.id)}
                          className={cn(
                            "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-all",
                            selectedTone === tone.id
                              ? "bg-violet-500 text-white"
                              : "bg-muted hover:bg-accent"
                          )}
                        >
                          <span>{tone.emoji}</span>
                          <span>{tone.name}</span>
                        </button>
                      ))}
                    </div>
                  </GlassCard>

                  {/* Input Area */}
                  <GlassCard className="p-4">
                    <label className="text-sm font-medium mb-2 block">What do you need help with?</label>
                    <textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Describe your scene, character, or problem..."
                      className="w-full h-32 p-4 bg-muted rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-violet-500"
                    />
                    
                    <div className="flex justify-between items-center mt-3">
                      <span className="text-xs text-muted-foreground">{input.length} characters</span>
                      
                      <button
                        onClick={generateResponse}
                        disabled={!input.trim() || isGenerating}
                        className={cn(
                          "flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all",
                          !input.trim() || isGenerating
                            ? "bg-muted text-muted-foreground cursor-not-allowed"
                            : "bg-violet-500 text-white hover:bg-violet-600"
                        )}
                      >
                        {isGenerating ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            Thinking...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4" />
                            Generate
                          </>
                        )}
                      </button>
                    </div>
                  </GlassCard>

                  {/* Output */}
                  {output && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <GlassCard className="p-4 bg-gradient-to-br from-violet-500/5 to-purple-500/5">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm font-medium flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-violet-500" />
                            AI Suggestion
                          </span>
                          
                          <button
                            onClick={copyToClipboard}
                            className="p-2 hover:bg-accent rounded-lg transition-colors"
                          >
                            {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                          </button>
                        </div>
                        
                        <div className="p-4 bg-card rounded-xl border border-border">
                          <p className="leading-relaxed">{output}</p>
                        </div>
                        
                        <div className="flex gap-2 mt-4">
                          <button className="flex-1 py-2 text-sm bg-muted hover:bg-accent rounded-lg transition-colors">
                            👍 Helpful
                          </button>
                          <button className="flex-1 py-2 text-sm bg-muted hover:bg-accent rounded-lg transition-colors">
                            🔄 Try Again
                          </button>
                          <button className="flex-1 py-2 text-sm bg-muted hover:bg-accent rounded-lg transition-colors">
                            ✏️ Edit
                          </button>
                        </div>
                      </GlassCard>
                    </motion.div>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="h-full flex flex-col items-center justify-center text-muted-foreground"
                >
                  <div className="w-24 h-24 bg-violet-500/10 rounded-full flex items-center justify-center mb-4">
                    <Sparkles className="w-12 h-12 text-violet-500" />
                  </div>
                  <p className="text-lg font-medium">Select a writing tool from the sidebar</p>
                  <p className="text-sm">Choose what you need help with to get started</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
