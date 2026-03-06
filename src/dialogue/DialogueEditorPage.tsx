import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  MessageSquare, Plus, Trash2, Play, Pause, Settings,
  ArrowRight, Volume2, Type, Palette, Sparkles
} from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { cn } from '../lib/utils';

interface DialogueNode {
  id: string;
  text: string;
  speakerId: string;
  emotion: string;
  choices: DialogueChoice[];
  position: { x: number; y: number };
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

const emotions = [
  { id: 'neutral', name: 'Neutral', emoji: '😐' },
  { id: 'happy', name: 'Happy', emoji: '😊' },
  { id: 'sad', name: 'Sad', emoji: '😢' },
  { id: 'angry', name: 'Angry', emoji: '😠' },
  { id: 'surprised', name: 'Surprised', emoji: '😲' },
  { id: 'love', name: 'Love', emoji: '😍' },
  { id: 'thinking', name: 'Thinking', emoji: '🤔' },
  { id: 'laughing', name: 'Laughing', emoji: '😂' },
];

export function DialogueEditorPage() {
  const [nodes, setNodes] = useState<DialogueNode[]>([
    {
      id: 'start',
      text: 'Welcome to the adventure! What would you like to do?',
      speakerId: 'narrator',
      emotion: 'neutral',
      choices: [
        { id: 'c1', text: 'Start the journey', nextNodeId: null },
        { id: 'c2', text: 'Look around', nextNodeId: null },
      ],
      position: { x: 400, y: 100 }
    }
  ]);
  
  const [speakers, setSpeakers] = useState<Speaker[]>([
    { id: 'narrator', name: 'Narrator', color: '#6366f1' },
    { id: 'hero', name: 'Hero', color: '#22c55e' },
    { id: 'villain', name: 'Villain', color: '#ef4444' },
  ]);
  
  const [selectedNode, setSelectedNode] = useState<string | null>('start');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPreviewNode, setCurrentPreviewNode] = useState<string | null>(null);

  const selectedNodeData = nodes.find(n => n.id === selectedNode);
  const previewNodeData = currentPreviewNode ? nodes.find(n => n.id === currentPreviewNode) : null;

  const addNode = () => {
    const newNode: DialogueNode = {
      id: Date.now().toString(),
      text: 'New dialogue node...',
      speakerId: speakers[0]?.id || 'narrator',
      emotion: 'neutral',
      choices: [],
      position: { x: 400 + Math.random() * 200, y: 200 + Math.random() * 200 }
    };
    setNodes([...nodes, newNode]);
    setSelectedNode(newNode.id);
  };

  const updateNode = (id: string, updates: Partial<DialogueNode>) => {
    setNodes(nodes.map(n => n.id === id ? { ...n, ...updates } : n));
  };

  const addChoice = (nodeId: string) => {
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return;
    
    const newChoice: DialogueChoice = {
      id: Date.now().toString(),
      text: 'New choice...',
      nextNodeId: null
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
    
    updateNode(nodeId, {
      choices: node.choices.filter(c => c.id !== choiceId)
    });
  };

  const startPreview = () => {
    setCurrentPreviewNode('start');
    setIsPlaying(true);
  };

  const selectChoice = (choice: DialogueChoice) => {
    if (choice.nextNodeId) {
      setCurrentPreviewNode(choice.nextNodeId);
    } else {
      setIsPlaying(false);
      setCurrentPreviewNode(null);
    }
  };

  const PreviewContent = () => {
    if (!previewNodeData) return null;
    
    const speaker = speakers.find(s => s.id === previewNodeData.speakerId);
    const emotionData = emotions.find(e => e.id === previewNodeData.emotion);
    
    return (
      <>
        <div className="flex items-center gap-3 mb-4">
          <div 
            className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold text-white"
            style={{ backgroundColor: speaker?.color }}
          >
            {speaker?.name[0]}
          </div>
          <div>
            <p className="font-semibold">{speaker?.name}</p>
            <p className="text-sm text-muted-foreground">
              {emotionData?.emoji} {previewNodeData.emotion}
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
  };

  return (
    <div className="h-screen flex bg-background">
      {/* Left Sidebar - Node List */}
      <div className="w-64 border-r border-border bg-card/50 flex flex-col">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h2 className="font-semibold flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Nodes
          </h2>
          <button 
            onClick={addNode}
            className="p-2 hover:bg-accent rounded-lg"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          <div className="space-y-1">
            {nodes.map(node => (
              <button
                key={node.id}
                onClick={() => setSelectedNode(node.id)}
                className={cn(
                  "w-full text-left p-3 rounded-lg border-2 transition-all",
                  selectedNode === node.id
                    ? "border-primary bg-primary/10"
                    : "border-transparent hover:border-border"
                )}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">#{node.id.slice(0, 4)}</span>
                </div>
                <p className="text-sm truncate mt-1">{node.text}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs px-2 py-0.5 bg-accent rounded">
                    {speakers.find(s => s.id === node.speakerId)?.name}
                  </span>
                  <span className="text-xs">{node.choices.length} choices</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 border-t border-border">
          <button 
            onClick={startPreview}
            className="w-full flex items-center justify-center gap-2 p-3 bg-primary text-primary-foreground rounded-xl font-medium"
          >
            <Play className="w-4 h-4" />
            Preview Dialogue
          </button>
        </div>
      </div>

      {/* Main Editor Area */}
      <div className="flex-1 flex">
        <div className="flex-1 p-6">
          <div className="h-full bg-muted/30 rounded-xl border border-border relative overflow-hidden">
            <div className="absolute inset-0"
              style={{
                backgroundImage: `
                  radial-gradient(circle, rgba(0,0,0,0.1) 1px, transparent 1px)
                `,
                backgroundSize: '20px 20px'
              }}
            />
            
            {nodes.map(node => (
              <div
                key={node.id}
                onClick={() => setSelectedNode(node.id)}
                className={cn(
                  "absolute p-4 rounded-xl border-2 cursor-pointer transition-all w-64",
                  selectedNode === node.id
                    ? "border-primary bg-card shadow-lg"
                    : "border-border bg-card/80 hover:border-primary/30"
                )}
                style={{
                  left: node.position.x,
                  top: node.position.y
                }}
              >
                <p className="text-sm line-clamp-3">{node.text}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs px-2 py-0.5 rounded-full text-white"
                    style={{ backgroundColor: speakers.find(s => s.id === node.speakerId)?.color }}
                  >
                    {speakers.find(s => s.id === node.speakerId)?.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel - Node Properties */}
        <div className="w-80 border-l border-border bg-card/50 overflow-y-auto">
          {selectedNodeData ? (
            <div className="p-4">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold">Node Properties</h3>
                <button 
                  onClick={() => {
                    setNodes(nodes.filter(n => n.id !== selectedNode));
                    setSelectedNode(null);
                  }}
                  className="p-2 hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
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
                  <div className="grid grid-cols-4 gap-2">
                    {emotions.map(emotion => (
                      <button
                        key={emotion.id}
                        onClick={() => updateNode(selectedNodeData.id, { emotion: emotion.id })}
                        className={cn(
                          "p-2 rounded-lg border-2 transition-all text-center",
                          selectedNodeData.emotion === emotion.id
                            ? "border-primary bg-primary/10"
                            : "border-border hover:border-primary/30"
                        )}
                        title={emotion.name}
                      >
                        <span className="text-xl">{emotion.emoji}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">Dialogue Text</label>
                  <textarea
                    value={selectedNodeData.text}
                    onChange={(e) => updateNode(selectedNodeData.id, { text: e.target.value })}
                    className="w-full h-32 px-3 py-2 bg-background border border-input rounded-lg resize-none"
                    placeholder="Enter dialogue text..."
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium">Choices</label>
                    <button 
                      onClick={() => addChoice(selectedNodeData.id)}
                      className="p-1 hover:bg-accent rounded"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-2">
                    {selectedNodeData.choices.map((choice, index) => (
                      <div key={choice.id} className="p-3 bg-muted rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs text-muted-foreground">#{index + 1}</span>
                          <button 
                            onClick={() => deleteChoice(selectedNodeData.id, choice.id)}
                            className="ml-auto p-1 hover:text-destructive"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                        <input
                          type="text"
                          value={choice.text}
                          onChange={(e) => updateChoice(selectedNodeData.id, choice.id, { text: e.target.value })}
                          className="w-full px-3 py-1.5 bg-background border border-input rounded text-sm mb-2"
                          placeholder="Choice text..."
                        />
                        <select
                          value={choice.nextNodeId || ''}
                          onChange={(e) => updateChoice(selectedNodeData.id, choice.id, { nextNodeId: e.target.value || null })}
                          className="w-full px-3 py-1.5 bg-background border border-input rounded text-sm"
                        >
                          <option value="">End conversation</option>
                          {nodes.filter(n => n.id !== selectedNodeData.id).map(node => (
                            <option key={node.id} value={node.id}>
                              #{node.id.slice(0, 4)}: {node.text.slice(0, 30)}...
                            </option>
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
      </div>

      {/* Preview Modal */}
      {isPlaying && previewNodeData && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => { setIsPlaying(false); setCurrentPreviewNode(null); }}
        >
          <GlassCard className="w-full max-w-lg p-6">
            <PreviewContent />
          </GlassCard>
        </div>
      )}
    </div>
  );
}
