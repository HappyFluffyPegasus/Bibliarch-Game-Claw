import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useStoryStore } from '../stores/storyStore';
import { GlassCard } from '../components/GlassCard';
import { Network, Users, Heart, Swords, HelpingHand } from 'lucide-react';

interface RelationshipNode {
  id: string;
  name: string;
  x: number;
  y: number;
  color: string;
}

interface RelationshipEdge {
  from: string;
  to: string;
  type: 'friend' | 'enemy' | 'family' | 'love' | 'ally';
  strength: number;
}

export function RelationshipGraphPage() {
  const { id } = useParams();
  const { currentStory, characters, loadStory } = useStoryStore();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (id) loadStory(id);
  }, [id]);

  // Generate mock relationships for visualization
  const nodes: RelationshipNode[] = characters.map((char, index) => {
    const angle = (index / characters.length) * Math.PI * 2;
    const radius = 200;
    return {
      id: char.id,
      name: char.name,
      x: 400 + Math.cos(angle) * radius,
      y: 300 + Math.sin(angle) * radius,
      color: `hsl(${(index * 360) / characters.length}, 70%, 60%)`
    };
  });

  const edges: RelationshipEdge[] = [];
  for (let i = 0; i < characters.length; i++) {
    for (let j = i + 1; j < characters.length; j++) {
      if (Math.random() > 0.5) {
        const types: RelationshipEdge['type'][] = ['friend', 'enemy', 'family', 'love', 'ally'];
        edges.push({
          from: characters[i].id,
          to: characters[j].id,
          type: types[Math.floor(Math.random() * types.length)],
          strength: Math.random()
        });
      }
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Apply transforms
    ctx.save();
    ctx.translate(pan.x, pan.y);
    ctx.scale(zoom, zoom);

    // Draw edges
    edges.forEach(edge => {
      const fromNode = nodes.find(n => n.id === edge.from);
      const toNode = nodes.find(n => n.id === edge.to);
      if (!fromNode || !toNode) return;

      const colors = {
        friend: '#22c55e',
        enemy: '#ef4444',
        family: '#3b82f6',
        love: '#ec4899',
        ally: '#a855f7'
      };

      ctx.beginPath();
      ctx.moveTo(fromNode.x, fromNode.y);
      ctx.lineTo(toNode.x, toNode.y);
      ctx.strokeStyle = colors[edge.type];
      ctx.lineWidth = edge.strength * 4;
      ctx.globalAlpha = 0.6;
      ctx.stroke();
      ctx.globalAlpha = 1;
    });

    // Draw nodes
    nodes.forEach(node => {
      const isSelected = selectedNode === node.id;

      // Glow
      if (isSelected) {
        ctx.beginPath();
        ctx.arc(node.x, node.y, 35, 0, Math.PI * 2);
        ctx.fillStyle = node.color + '40';
        ctx.fill();
      }

      // Circle
      ctx.beginPath();
      ctx.arc(node.x, node.y, 25, 0, Math.PI * 2);
      ctx.fillStyle = node.color;
      ctx.fill();

      // Border
      ctx.beginPath();
      ctx.arc(node.x, node.y, 25, 0, Math.PI * 2);
      ctx.strokeStyle = isSelected ? '#fff' : '#00000040';
      ctx.lineWidth = isSelected ? 3 : 1;
      ctx.stroke();

      // Text
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 12px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(node.name.slice(0, 2).toUpperCase(), node.x, node.y);

      // Name label
      ctx.fillStyle = '#fff';
      ctx.font = '12px sans-serif';
      ctx.fillText(node.name, node.x, node.y + 40);
    });

    ctx.restore();
  }, [nodes, edges, zoom, pan, selectedNode]);

  const handleMouseDown = (e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = (e.clientX - rect.left - pan.x) / zoom;
    const y = (e.clientY - rect.top - pan.y) / zoom;

    // Check if clicked on a node
    const clickedNode = nodes.find(n => {
      const dx = n.x - x;
      const dy = n.y - y;
      return Math.sqrt(dx * dx + dy * dy) < 25;
    });

    if (clickedNode) {
      setSelectedNode(clickedNode.id);
    } else {
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom(z => Math.max(0.5, Math.min(3, z * delta)));
  };

  const relationshipTypes = [
    { type: 'friend', label: 'Friends', color: '#22c55e', icon: Users },
    { type: 'enemy', label: 'Enemies', color: '#ef4444', icon: Swords },
    { type: 'love', label: 'Romance', color: '#ec4899', icon: Heart },
    { type: 'ally', label: 'Allies', color: '#a855f7', icon: HelpingHand },
  ];

  return (
    <div className="h-screen flex">
      <div className="flex-1 relative">
        <canvas
          ref={canvasRef}
          width={1200}
          height={800}
          className="w-full h-full cursor-move"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
        />

        <div className="absolute top-4 left-4">
          <GlassCard className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Network className="w-5 h-5 text-violet-500" />
              <span className="font-semibold">Relationship Graph</span>
            </div>
            
            <div className="text-sm text-muted-foreground">
              {nodes.length} characters • {edges.length} connections
            </div>
          </GlassCard>
        </div>

        <div className="absolute bottom-4 left-4">
          <GlassCard className="p-3">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setZoom(z => Math.max(0.5, z - 0.1))}
                className="w-8 h-8 flex items-center justify-center hover:bg-accent rounded"
              >
                −
              </button>
              <span className="text-sm min-w-[60px] text-center">{Math.round(zoom * 100)}%</span>
              <button
                onClick={() => setZoom(z => Math.min(3, z + 0.1))}
                className="w-8 h-8 flex items-center justify-center hover:bg-accent rounded"
              >
                +
              </button>
            </div>
          </GlassCard>
        </div>
      </div>

      <div className="w-80 border-l border-border bg-card p-4 overflow-y-auto">
        <h2 className="font-semibold mb-4">Legend</h2>
        
        <div className="space-y-3">
          {relationshipTypes.map(({ type, label, color, icon: Icon }) => (
            <div key={type} className="flex items-center gap-3">
              <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: color + '20' }}
              >
                <Icon className="w-4 h-4" style={{ color }} />
              </div>
              <span className="text-sm">{label}</span>
            </div>
          ))}
        </div>

        {selectedNode && (
          <>
            <div className="border-t border-border my-4" />
            <div>
              <h3 className="font-semibold mb-3">Selected Character</h3>
              {(() => {
                const char = characters.find(c => c.id === selectedNode);
                return char ? (
                  <div className="space-y-2">
                    <div className="font-medium">{char.name}</div>
                    <div className="text-sm text-muted-foreground">{char.backstory.slice(0, 100)}...</div>
                    
                    <div className="text-xs">
                      {edges.filter(e => e.from === selectedNode || e.to === selectedNode).length} connections
                    </div>
                  </div>
                ) : null;
              })()}
            </div>
          </>
        )}
      </div>
    </div>
  );
}