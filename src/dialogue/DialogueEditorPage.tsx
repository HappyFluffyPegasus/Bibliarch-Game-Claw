import { useState } from 'react'
import { GlassCard } from '@/components/GlassCard'
import { Button } from '@/components/Button'
import { Plus, MessageSquare, GitBranch } from 'lucide-react'

interface DialogueNode {
  id: string
  characterId: string
  text: string
  emotion: string
  choices: DialogueChoice[]
}

interface DialogueChoice {
  id: string
  text: string
  nextId: string | null
}

export function DialogueEditorPage() {
  const [nodes, setNodes] = useState<DialogueNode[]>([])
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  
  const addNode = () => {
    const newNode: DialogueNode = {
      id: crypto.randomUUID(),
      characterId: 'char-1',
      text: 'Enter dialogue here...',
      emotion: 'neutral',
      choices: []
    }
    setNodes([...nodes, newNode])
  }
  
  return (
    <div className="h-full flex flex-col">
      <header className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold">Dialogue Editor</h1>
          <p className="text-muted-foreground">Create branching conversations</p>
        </div>
        <Button onClick={addNode}>
          <Plus className="w-4 h-4 mr-2" />
          Add Node
        </Button>
      </header>
      
      <div className="flex-1 flex gap-4">
        <GlassCard className="w-1/3 p-4 overflow-auto">
          <h3 className="font-medium mb-4">Nodes</h3>
          
          <div className="space-y-2">
            {nodes.map(node => (
              <button
                key={node.id}
                className={`w-full p-3 rounded-lg text-left text-sm ${
                  selectedNode === node.id ? 'bg-primary/20 border border-primary' : 'bg-white/5'
                }`}
                onClick={() => setSelectedNode(node.id)}
              >
                <div className="flex items-center gap-2 mb-1">
                  <MessageSquare className="w-4 h-4" />
                  <span className="font-medium">{node.characterId}</span>
                </div>
                <p className="text-muted-foreground truncate">{node.text}</p>
              </button>
            ))}
          </div>
        </GlassCard>
        
        <GlassCard className="flex-1 p-4">
          {selectedNode ? (
            <div className="space-y-4">
              <h3 className="font-medium">Edit Node</h3>
              
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Dialogue Text</label>
                <textarea
                  className="w-full h-32 bg-white/5 border border-white/10 rounded-lg p-3 resize-none"
                  defaultValue={nodes.find(n => n.id === selectedNode)?.text}
                />
              </div>
              
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Emotion</label>
                <select className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2">
                  <option>neutral</option>
                  <option>happy</option>
                  <option>sad</option>
                  <option>angry</option>
                </select>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-muted-foreground">Select a node to edit</p>
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  )
}
