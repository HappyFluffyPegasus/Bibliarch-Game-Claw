import { useState } from 'react'
import { GlassCard } from '@/components/GlassCard'
import { Button } from '@/components/Button'
import { Sparkles, Copy, RefreshCw } from 'lucide-react'

const tools = [
  { id: 'expand', label: 'Expand', description: 'Flesh out a brief idea' },
  { id: 'summarize', label: 'Summarize', description: 'Condense long text' },
  { id: 'dialogue', label: 'Dialogue', description: 'Generate conversation' },
  { id: 'describe', label: 'Describe', description: 'Add vivid descriptions' },
  { id: 'emotion', label: 'Emotion', description: 'Add emotional depth' },
  { id: 'action', label: 'Action', description: 'Write action scenes' },
]

const tones = [
  'Romantic', 'Dramatic', 'Mysterious', 'Humorous', 'Dark', 'Inspirational', 'Casual', 'Formal'
]

export function AIWritingAssistantPage() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [selectedTool, setSelectedTool] = useState('expand')
  const [selectedTone, setSelectedTone] = useState('Casual')
  const [isGenerating, setIsGenerating] = useState(false)
  
  const generate = async () => {
    if (!input.trim()) return
    setIsGenerating(true)
    
    // Simulate AI generation
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setOutput(`Generated ${selectedTool} content in ${selectedTone} tone:\n\n${input}\n\n[AI would expand this here based on the selected tool and tone...]`)
    setIsGenerating(false)
  }
  
  return (
    <div className="h-full flex flex-col">
      <header className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold">AI Writing Assistant</h1>
          <p className="text-muted-foreground">Get help with your writing</p>
        </div>
      </header>
      
      <div className="flex-1 flex gap-4">
        <GlassCard className="w-64 p-4">
          <h3 className="font-medium mb-3">Tools</h3>
          
          <div className="space-y-2 mb-6">
            {tools.map(tool => (
              <button
                key={tool.id}
                className={`w-full p-2 rounded-lg text-left text-sm ${
                  selectedTool === tool.id ? 'bg-primary/20 text-primary' : 'hover:bg-white/5'
                }`}
                onClick={() => setSelectedTool(tool.id)}
              >
                <div className="font-medium">{tool.label}</div>
                <div className="text-xs text-muted-foreground">{tool.description}</div>
              </button>
            ))}
          </div>
          
          <h3 className="font-medium mb-3">Tone</h3>
          
          <div className="flex flex-wrap gap-2">
            {tones.map(tone => (
              <button
                key={tone}
                className={`px-3 py-1 rounded-full text-xs ${
                  selectedTone === tone 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-white/5 hover:bg-white/10'
                }`}
                onClick={() => setSelectedTone(tone)}
              >
                {tone}
              </button>
            ))}
          </div>
        </GlassCard>
        
        <div className="flex-1 flex flex-col gap-4">
          <GlassCard className="flex-1 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Input</span>
            </div>
            
            <textarea
              className="w-full h-full bg-transparent resize-none outline-none"
              placeholder="Enter your text here..."
              value={input}
              onChange={e => setInput(e.target.value)}
            />
          </GlassCard>
          
          <div className="flex justify-center">
            <Button onClick={generate} disabled={isGenerating || !input.trim()}>
              {isGenerating ? (
                <><RefreshCw className="w-4 h-4 mr-2 animate-spin" /> Generating...</>
              ) : (
                <><Sparkles className="w-4 h-4 mr-2" /> Generate</>
              )}
            </Button>
          </div>
          
          {output && (
            <GlassCard className="flex-1 p-4 bg-primary/5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Output</span>
                <Button variant="outline" size="sm">
                  <Copy className="w-4 h-4 mr-1" /> Copy
                </Button>
              </div>
              
              <div className="text-sm whitespace-pre-wrap">{output}</div>
            </GlassCard>
          )}
        </div>
      </div>
    </div>
  )
}
