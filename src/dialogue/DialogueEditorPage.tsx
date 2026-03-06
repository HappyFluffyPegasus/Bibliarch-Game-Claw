import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  MessageSquare, Plus, Trash2, GitBranch, Play,
  Settings, ArrowRight, X
} from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { cn } from '../lib/utils';

interface DialogueNode {
  id: string;
  speakerId: string;
  text: string;
  emotion: 'neutral' | 'happy' | 'sad' | 'angry' | 'surprised' | 'thinking';
  position: { x: number; y: number };
  choices: DialogueChoice[];
  isStartNode?: boolean;
}

interface DialogueChoice {
  id: string;
  text: string;
  nextNodeId: string | null;
}

interface Speaker {
  id: string;
  name: string;
  color: string;
}

const sampleSpeakers: Speaker[] = [
  { id: 'hero', name: 'Hero', color: '#3b82f6' },
  { id: 'villain', name: 'Villain', color: '#ef4444' },
  { id: 'npc1', name: 'Merchant', color: '#22c55e' },
];

const emotions = [
  { id: 'neutral', emoji: '😐' },
  { id: 'happy', emoji: '😊' },
  { id: 'sad', emoji: '😢' },
  { id: 'angry', emoji: '😠' },
  { id: 'surprised', emoji: '😲' },
  { id: 'thinking', emoji: '🤔' },
];

export function DialogueEditorPage() {
  const [nodes, setNodes] = useState<DialogueNode[]>([
    {
      id: 'start',
      speakerId: 'npc1',
      text: 'Welcome, traveler! What brings you to our village?',
      emotion: 'happy',
      position: { x: 400, y: 100 },
      isStartNode: true,
      choices: [
        { id: 'c1', text: 'I\'m looking for work.', nextNodeId: 'node2' },
        { id: 'c2', text: 'Just passing through.', nextNodeId: 'node3' },
      ]
    },
    {
      id: 'node2',
      speakerId: 'npc1',
      text: 'Work, you say? We could use help...',
      emotion: 'thinking',
      position: { x: 200, y: 300 },
      choices: []
    },
  ]);

  const [selectedNode, setSelectedNode] = useState<string | null>('start');
  const [speakers] = useState<Speaker[]>(sampleSpeakers);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPreviewNode, setCurrentPreviewNode] = useState<string | null>(null);

  const addNode = () => {
    const newNode: DialogueNode = {
      id: Date.now().toString(),
      speakerId: speakers[0].id,
      text: 'New dialogue text...',
      emotion: 'neutral',
      position: { x: 400, y: 400 },
      choices: []
    };
    setNodes([...nodes, newNode]);
    setSelectedNode(newNode.id);
  };

  const updateNode = (nodeId: string, updates: Partial<DialogueNode>) => {
    setNodes(nodes.map(n => n.id === nodeId ? { ...n, ...updates } : n));
  };

  const deleteNode = (nodeId: string) => {
    setNodes(nodes.filter(n => n.id !== nodeId));
    if (selectedNode === nodeId) setSelectedNode(null);
  };

  const addChoice = (nodeId: string) => {
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return;
    const newChoice: DialogueChoice = {
      id: Date.now().toString(),
      text: 'New choice...',
      nextNodeId: null,
    };
    updateNode(nodeId, { choices: [...node.choices, newChoice] });
  };

  const updateChoice = (nodeId: string, choiceId: string, updates: Partial<DialogueChoice>) => {
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return;
    updateNode(nodeId, {
      choices: node.choices.map(c => c.id === choiceId ? { ...c, ...updates } : c)
    });
  };

  const deleteChoice = (nodeId: string, choiceId: string) => {
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return;
    updateNode(nodeId, { choices: node.choices.filter(c => c.id !== choiceId) });
  };

  const playDialogue = () => {
    const startNode = nodes.find(n => n.isStartNode) || nodes[0];
    if (!startNode) return;
    setIsPlaying(true);
    setCurrentPreviewNode(startNode.id);
  };

  const selectChoice = (choice: DialogueChoice) => {
    if (choice.nextNodeId) {
      setCurrentPreviewNode(choice.nextNodeId);
    } else {
      setIsPlaying(false);
      setCurrentPreviewNode(null);
    }
  };

  const selectedNodeData = nodes.find(n => n.id === selectedNode);
  const previewNodeData = currentPreviewNode ? nodes.find(n => n.id === currentPreviewNode) : null;

  return (
    <div className="h-screen flex bg-background">
      <div className="w-72 border-r border-border bg-card/50 flex flex-col">
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Dialogue Nodes</h3>
            <button onClick={addNode} className="p-2 bg-primary text-primary-foreground rounded-lg">
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          <div className="space-y-2">
            {nodes.map(node => {
              const speaker = speakers.find(s => s.id === node.speakerId);
              return (
                <button
                  key={node.id}
                  onClick={() => setSelectedNode(node.id)}
                  className={cn(
                    "w-full text-left p-3 rounded-lg border transition-all",
                    selectedNode === node.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"
                  )}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {node.isStartNode && (
                      <span className="text-xs bg-green-500/20 text-green-600 px-1.5 py-0.5 rounded">START</span>
                    )}
                    <span className="text-xs px-1.5 py-0.5 rounded text-white" style={{ backgroundColor: speaker?.color }}>
                      {speaker?.name}
                    </span>
                  </div>
                  
                  <p className="text-sm line-clamp-2">{node.text}</p>
                  
                  <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                    <GitBranch className="w-3 h-3" />
                    {node.choices.length} choices
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-4 border-t border-border">
          <button onClick={playDialogue} className="w-full flex items-center justify-center gap-2 py-2 bg-primary text-primary-foreground rounded-lg">
            <Play className="w-4 h-4" />
            Preview
          </button>
        </div>
      </div>

      <div className="flex-1 relative bg-muted overflow-hidden">
        <div className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px)`,
            backgroundSize: '20px 20px'
          }}
        />

        {nodes.map(node => {
          const speaker = speakers.find(s => s.id === node.speakerId);
          return (
            <div
              key={node.id}
              onClick={() => setSelectedNode(node.id)}
              className={cn(
                "absolute p-4 rounded-xl border-2 cursor-pointer transition-all min-w-[200px]",
                selectedNode === node.id ? "border-primary bg-card shadow-lg" : "border-border bg-card/80 hover:border-primary/50"
              )}
              style={{ left: node.position.x, top: node.position.y }}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs text-white" style={{ backgroundColor: speaker?.color }}>
                  {speaker?.name[0]}
                </div>
                <span className="text-xs text-muted-foreground">{speaker?.name}</span>
                {node.isStartNode && <span className="text-[10px] bg-green-500 text-white px-1 rounded">START</span>}
              </div>
              
              <p className="text-sm line-clamp-3">{node.text}</p>
              
              <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                <span>{emotions.find(e => e.id === node.emotion)?.emoji}</span>
                <span>•</span>
                <span>{node.choices.length} choices</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="w-96 border-l border-border bg-card/50 overflow-y-auto">
        {selectedNodeData ? (
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Edit Node</h3>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => updateNode(selectedNodeData.id, { isStartNode: !selectedNodeData.isStartNode })}
                  className={cn("px-2 py-1 text-xs rounded", selectedNodeData.isStartNode ? "bg-green-500 text-white" : "bg-muted")}
                >
                  Start
                </button>
                <button onClick={() => deleteNode(selectedNodeData.id)} className="p-2 text-destructive hover:bg-destructive/10 rounded">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Speaker</label>
                <select
                  value={selectedNodeData.speakerId}
                  onChange={(e) => updateNode(selectedNodeData.id, { speakerId: e.target.value })}
                  className="w-full px-3 py-2 bg-background border border-input rounded-lg"
                >
                  {speakers.map(speaker => (
                    <option key={speaker.id} value={speaker.id}>{speaker.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Emotion</label>
                <div className="flex gap-2">
                  {emotions.map(emotion => (
                    <button
                      key={emotion.id}
                      onClick={() => updateNode(selectedNodeData.id, { emotion: emotion.id as any })}
                      className={cn(
                        "w-10 h-10 text-xl rounded-lg border-2 transition-all",
                        selectedNodeData.emotion === emotion.id ? "border-primary bg-primary/10" : "border-border hover:border-primary/30"
                      )}
                    >
                      {emotion.emoji}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Text</label>
                <textarea
                  value={selectedNodeData.text}
                  onChange={(e) => updateNode(selectedNodeData.id, { text: e.target.value })}
                  className="w-full px-3 py-2 bg-background border border-input rounded-lg min-h-[100px]"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium">Choices</label>
                  <button onClick={() => addChoice(selectedNodeData.id)} className="flex items-center gap-1 text-xs px-2 py-1 bg-primary text-primary-foreground rounded">
                    <Plus className="w-3 h-3" /> Add
                  </button>
                </div>

                <div className="space-y-2">
                  {selectedNodeData.choices.map((choice, index) => (
                    <div key={choice.id} className="p-3 bg-muted rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs text-muted-foreground">Choice {index + 1}</span>
                        <button onClick={() => deleteChoice(selectedNodeData.id, choice.id)} className="ml-auto text-destructive">
                          <X className="w-3 h-3" />
                        </button>
                      </div>

                      <input
                        type="text"
                        value={choice.text}
                        onChange={(e) => updateChoice(selectedNodeData.id, choice.id, { text: e.target.value })}
                        className="w-full px-2 py-1 text-sm bg-background border border-input rounded mb-2"
                        placeholder="Choice text..."
                      />

                      <select
                        value={choice.nextNodeId || ''}
                        onChange={(e) => updateChoice(selectedNodeData.id, choice.id, { nextNodeId: e.target.value || null })}
                        className="w-full px-2 py-1 text-sm bg-background border border-input rounded"
                      >
                        <option value="">End Conversation</option>
                        {nodes.filter(n => n.id !== selectedNodeData.id).map(node => (
                          <option key={node.id} value={node.id}>{node.text.slice(0, 30)}...</option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-muted-foreground">Select a node to edit</div>
        )}
      </div>

      {isPlaying && previewNodeData && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => { setIsPlaying(false); setCurrentPreviewNode(null); }}
        >
          <GlassCard className="w-full max-w-lg p-6" onClick={(e) => e.stopPropagation()}>
            {(() => {
              const speaker = speakers.find(s => s.id === previewNodeData.speakerId);
              return (
                <>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold text-white" style={{ backgroundColor: speaker?.color }}>
                      {speaker?.name[0]}
                    </div>
                    <div>
                      <p className="font-semibold">{speaker?.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {emotions.find(e => e.id === previewNodeData.emotion)?.emoji} {previewNodeData.emotion}
                      </p>
                    </div>
                  </div>

                  <div className="bg-muted rounded-xl p-6 mb-6">
                    <p className="text-lg leading-relaxed">{previewNodeData.text}</p>
                  </div>

                  {previewNodeData.choices.length > 0 ? (
                    <div className="space-y-2">
                      {previewNodeData.choices.map(choice => (
                        <button
                          key={choice.id}
                          onClick={() => selectChoice(choice)}
                          className="w-full flex items-center gap-2 p-4 bg-primary/10 hover:bg-primary/20 border border-primary/30 rounded-xl transition-colors text-left"
                        >
                          <ArrowRight className="w-4 h-4 text-primary" />
                          {choice.text}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <button
                      onClick={() => { setIsPlaying(false); setCurrentPreviewNode(null); }}
                      className="w-full py-3 bg-muted hover:bg-muted/80 rounded-xl transition-colors"
                    >
                      End
                    </button>
                  )}
                </>
              );
            })}
          </GlassCard>
        </div>
      )}
    </div>
  );
}
