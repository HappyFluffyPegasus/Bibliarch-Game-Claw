import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useStoryStore } from '../stores/storyStore';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  GitBranch, Plus, Trash2, Play, MessageSquare, 
  MapPin, Users, ChevronRight, ChevronDown, 
  Type, Image as ImageIcon, Music, Settings,
  Split, Merge, ArrowRight
} from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { cn } from '../lib/utils';

// Story node types for narrative flow
type StoryNodeType = 'scene' | 'dialogue' | 'choice' | 'condition' | 'jump' | 'note';

interface StoryNode {
  id: string;
  type: StoryNodeType;
  title: string;
  content?: string;
  characterId?: string;
  position: { x: number; y: number };
  connections: string[]; // IDs of connected nodes
  data?: Record<string, any>;
}

// Visual novel style dialogue preview
function DialoguePreview({ 
  characterName, 
  text, 
  emotion = 'neutral',
  isPlayer = false 
}: { 
  characterName: string; 
  text: string; 
  emotion?: string;
  isPlayer?: boolean;
}) {
  return (
    <div className={cn(
      "flex gap-3 p-4 rounded-xl max-w-lg",
      isPlayer ? "flex-row-reverse bg-primary/10 ml-auto" : "bg-card"
    )}>
      {/* Character Portrait */}
      <div className="flex-shrink-0">
        <div className={cn(
          "w-16 h-16 rounded-xl flex items-center justify-center text-2xl font-bold",
          isPlayer 
            ? "bg-gradient-to-br from-violet-500 to-indigo-500" 
            : "bg-gradient-to-br from-amber-500 to-orange-500"
        )}>
          {characterName.charAt(0).toUpperCase()}
        </div>
        <div className="text-xs text-center mt-1 font-medium">
          {characterName}
        </div>
      </div>
      
      {/* Dialogue Box */}
      <div className={cn(
        "flex-1 p-4 rounded-xl relative",
        isPlayer 
          ? "bg-primary text-primary-foreground rounded-tr-none" 
          : "bg-muted rounded-tl-none"
      )}
>
        <p className="text-sm leading-relaxed">{text}</p>
      </div>
    </div>
  );
}

// Choice branching node
function ChoiceBranch({ choices }: { choices: string[] }) {
  return (
    <div className="flex flex-col gap-2 items-center">
      <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
        Player Choice
      </div>
      {choices.map((choice, i) => (
        <button
          key={i}
          className="w-full max-w-xs p-3 bg-card hover:bg-accent border border-border rounded-lg text-left transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold">
              {String.fromCharCode(65 + i)}
            </div>
            <span className="text-sm">{choice}</span>
          </div>
        </button>
      ))}
    </div>
  );
}

export function StoryModePage() {
  const { id } = useParams();
  const { currentStory, characters, loadStory } = useStoryStore();
  const [nodes, setNodes] = useState<StoryNode[]>([]);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [currentPreviewIndex, setCurrentPreviewIndex] = useState(0);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (id) {
      loadStory(id);
      // Load demo nodes
      setNodes([
        {
          id: '1',
          type: 'scene',
          title: 'Opening Scene',
          content: 'The adventure begins in a mysterious forest...',
          position: { x: 400, y: 300 },
          connections: ['2'],
        },
        {
          id: '2',
          type: 'dialogue',
          title: 'Meet the Guide',
          content: 'Welcome, traveler. I\'ve been expecting you.',
          characterId: characters[0]?.id,
          position: { x: 600, y: 300 },
          connections: ['3'],
        },
        {
          id: '3',
          type: 'choice',
          title: 'First Decision',
          content: 'What path will you choose?',
          position: { x: 800, y: 300 },
          connections: ['4', '5'],
          data: {
            choices: [
              'Take the safe path through the village',
              'Brave the dangerous mountain pass',
            ],
          },
        },
        {
          id: '4',
          type: 'scene',
          title: 'Village Path',
          content: 'You arrive at a peaceful village...',
          position: { x: 1000, y: 200 },
          connections: [],
        },
        {
          id: '5',
          type: 'scene',
          title: 'Mountain Path',
          content: 'The mountain looms before you...',
          position: { x: 1000, y: 400 },
          connections: [],
        },
      ]);
    }
  }, [id, characters]);

  const handleMouseDown = (e: React.MouseEvent, nodeId?: string) => {
    if (nodeId) {
      setSelectedNode(nodeId);
    } else {
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const addNode = (type: StoryNodeType) => {
    const newNode: StoryNode = {
      id: Date.now().toString(),
      type,
      title: `New ${type}`,
      position: { x: 400 - pan.x, y: 300 - pan.y },
      connections: [],
    };
    setNodes([...nodes, newNode]);
  };

  const deleteNode = (nodeId: string) => {
    setNodes(nodes.filter(n => n.id !== nodeId));
  };

  const selectedNodeData = nodes.find(n => n.id === selectedNode);

  // Preview mode - show story as visual novel
  if (previewMode) {
    const previewNodes = nodes.filter(n => n.type === 'dialogue' || n.type === 'scene');
    const currentNode = previewNodes[currentPreviewIndex];

    return (
      <div className="h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex flex-col">
        {/* Preview Header */}
        <div className="flex items-center justify-between p-4 bg-black/20 backdrop-blur">
          <button
            onClick={() => setPreviewMode(false)}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
          >
            Exit Preview
          </button>
          
          <div className="text-sm text-white/70">
            {currentPreviewIndex + 1} / {previewNodes.length}
          </div>
        </div>

        {/* Preview Content */}
        <div className="flex-1 flex items-end justify-center p-8">
          <AnimatePresence mode="wait">
            {currentNode?.type === 'dialogue' ? (
              <motion.div
                key={currentNode.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="w-full max-w-4xl"
              >
                <DialoguePreview
                  characterName={characters.find(c => c.id === currentNode.characterId)?.name || 'Unknown'}
                  text={currentNode.content || ''}
                />
              </motion.div>
            ) : (
              <motion.div
                key={currentNode?.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full max-w-2xl text-center text-white"
              >
                <h2 className="text-3xl font-bold mb-4">{currentNode?.title}</h2>
                <p className="text-lg text-white/80">{currentNode?.content}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="p-4 flex justify-center gap-4">
          <button
            onClick={() => setCurrentPreviewIndex(i => Math.max(0, i - 1))}
            disabled={currentPreviewIndex === 0}
            className="px-6 py-3 bg-white/10 hover:bg-white/20 disabled:opacity-50 rounded-xl transition-colors"
          >
            Previous
          </button>
          
          <button
            onClick={() => setCurrentPreviewIndex(i => Math.min(previewNodes.length - 1, i + 1))}
            disabled={currentPreviewIndex === previewNodes.length - 1}
            className="px-6 py-3 bg-white text-indigo-900 hover:bg-white/90 disabled:opacity-50 rounded-xl font-semibold transition-colors"
          >
            Continue →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-background">
      {/* Toolbar */}
      <div className="w-16 border-r border-border bg-card/50 backdrop-blur flex flex-col items-center py-4 gap-2">
        <div className="text-xs text-muted-foreground font-medium mb-2">Add</div>
        
        {[
          { type: 'scene', icon: MapPin, color: 'text-blue-500' },
          { type: 'dialogue', icon: MessageSquare, color: 'text-green-500' },
          { type: 'choice', icon: Split, color: 'text-amber-500' },
          { type: 'condition', icon: Settings, color: 'text-purple-500' },
          { type: 'note', icon: Type, color: 'text-gray-500' },
        ].map(({ type, icon: Icon, color }) => (
          <button
            key={type}
            onClick={() => addNode(type as StoryNodeType)}
            className="w-12 h-12 rounded-xl hover:bg-accent flex items-center justify-center transition-colors"
            title={`Add ${type}`}
          >
            <Icon className={cn("w-5 h-5", color)} />
          </button>
        ))}

        <div className="w-8 h-px bg-border my-2" />

        <button
          onClick={() => setPreviewMode(true)}
          className="w-12 h-12 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary flex items-center justify-center transition-colors"
          title="Preview Story"
        >
          <Play className="w-5 h-5" />
        </button>
      </div>

      {/* Canvas */}
      <div 
        ref={canvasRef}
        className="flex-1 relative overflow-hidden bg-muted/30 cursor-grab active:cursor-grabbing"
        onMouseDown={(e) => handleMouseDown(e)}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Grid */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(to right, hsl(var(--border)) 1px, transparent 1px),
              linear-gradient(to bottom, hsl(var(--border)) 1px, transparent 1px)
            `,
            backgroundSize: `${20 * zoom}px ${20 * zoom}px`,
            transform: `translate(${pan.x}px, ${pan.y}px)`,
          }}
        />

        {/* Connection Lines */}
        <svg 
          className="absolute inset-0 pointer-events-none"
          style={{ transform: `translate(${pan.x}px, ${pan.y}px)` }}
        >
          {nodes.map(node => 
            node.connections.map(targetId => {
              const target = nodes.find(n => n.id === targetId);
              if (!target) return null;
              return (
                <line
                  key={`${node.id}-${targetId}`}
                  x1={node.position.x + 100}
                  y1={node.position.y + 40}
                  x2={target.position.x + 100}
                  y2={target.position.y + 40}
                  stroke="hsl(var(--primary))"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                  opacity="0.5"
                />
              );
            })
          )}
        </svg>

        {/* Nodes */}
        {nodes.map(node => (
          <motion.div
            key={node.id}
            drag
            dragMomentum={false}
            onDragEnd={(_, info) => {
              setNodes(nodes.map(n => 
                n.id === node.id 
                  ? { ...n, position: { x: n.position.x + info.offset.x, y: n.position.y + info.offset.y } }
                  : n
              ));
            }}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedNode(node.id);
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: 1, 
              opacity: 1,
              x: node.position.x + pan.x,
              y: node.position.y + pan.y,
            }}
            className={cn(
              "absolute w-48 cursor-pointer",
              selectedNode === node.id && "z-10"
            )}
          >
            <GlassCard 
              className={cn(
                "p-3 transition-all",
                selectedNode === node.id && "ring-2 ring-primary shadow-lg shadow-primary/20"
              )}
            >
              <div className="flex items-center gap-2 mb-2">
                {node.type === 'scene' && <MapPin className="w-4 h-4 text-blue-500" />}
                {node.type === 'dialogue' && <MessageSquare className="w-4 h-4 text-green-500" />}
                {node.type === 'choice' && <Split className="w-4 h-4 text-amber-500" />}
                <span className="text-xs font-medium uppercase text-muted-foreground">
                  {node.type}
                </span>
              </div>

              <h3 className="font-semibold text-sm mb-1 truncate">{node.title}</h3>
              
              {node.content && (
                <p className="text-xs text-muted-foreground line-clamp-2">{node.content}</p>
              )}

              {node.type === 'choice' && node.data?.choices && (
                <div className="mt-2 space-y-1">
                  {node.data.choices.map((choice: string, i: number) => (
                    <div key={i} className="flex items-center gap-1 text-xs">
                      <ArrowRight className="w-3 h-3 text-muted-foreground" />
                      <span className="text-muted-foreground truncate">{choice}</span>
                    </div>
                  ))}
                </div>
              )}
            </GlassCard>
          </motion.div>
        ))}

        {/* Empty state */}
        {nodes.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <Plus className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
              <p className="text-lg font-medium">Start Your Story</p>
              <p className="text-sm text-muted-foreground">Click a node type to begin</p>
            </div>
          </div>
        )}
      </div>

      {/* Properties Panel */}
      <AnimatePresence>
        {selectedNodeData && (
          <motion.div
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            className="w-80 border-l border-border bg-card/50 backdrop-blur p-4 overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold">Node Properties</h2>
              <button
                onClick={() => deleteNode(selectedNode!)}
                className="p-2 hover:text-destructive transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Title</label>
                <input
                  type="text"
                  value={selectedNodeData.title}
                  onChange={(e) => {
                    setNodes(nodes.map(n => 
                      n.id === selectedNode ? { ...n, title: e.target.value } : n
                    ));
                  }}
                  className="w-full px-3 py-2 bg-background border border-input rounded-lg"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Content</label>
                <textarea
                  value={selectedNodeData.content || ''}
                  onChange={(e) => {
                    setNodes(nodes.map(n => 
                      n.id === selectedNode ? { ...n, content: e.target.value } : n
                    ));
                  }}
                  rows={4}
                  className="w-full px-3 py-2 bg-background border border-input rounded-lg resize-none"
                  placeholder="Enter dialogue or description..."
                />
              </div>

              {selectedNodeData.type === 'dialogue' && (
                <div>
                  <label className="text-sm font-medium mb-1 block">Character</label>
                  <select
                    value={selectedNodeData.characterId || ''}
                    onChange={(e) => {
                      setNodes(nodes.map(n => 
                        n.id === selectedNode ? { ...n, characterId: e.target.value } : n
                      ));
                    }}
                    className="w-full px-3 py-2 bg-background border border-input rounded-lg"
                  >
                    <option value="">Select character...</option>
                    {characters.map(char => (
                      <option key={char.id} value={char.id}>{char.name}</option>
                    ))}
                  </select>
                </div>
              )}

              {selectedNodeData.type === 'choice' && (
                <div>
                  <label className="text-sm font-medium mb-2 block">Choices</label>
                  <ChoiceBranch choices={selectedNodeData.data?.choices || ['Option 1', 'Option 2']} />
                </div>
              )}

              <div className="pt-4 border-t border-border">
                <div className="text-xs text-muted-foreground">
                  ID: {selectedNodeData.id}
                </div>
                <div className="text-xs text-muted-foreground">
                  Type: {selectedNodeData.type}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}