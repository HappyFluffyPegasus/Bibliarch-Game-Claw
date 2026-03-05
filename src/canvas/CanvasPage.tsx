import { useEffect, useRef, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useStoryStore } from '../stores/storyStore';
import { cn } from '../lib/utils';
import { MousePointer2, Hand, Type, User, Calendar, MapPin, Folder, Image as ImageIcon, Table, Minus, Plus, Trash2, Copy } from 'lucide-react';

interface Viewport {
  x: number;
  y: number;
  zoom: number;
}

const tools = [
  { id: 'select', icon: MousePointer2, label: 'Select' },
  { id: 'pan', icon: Hand, label: 'Pan' },
  { id: 'text', icon: Type, label: 'Text' },
  { id: 'character', icon: User, label: 'Character' },
  { id: 'event', icon: Calendar, label: 'Event' },
  { id: 'location', icon: MapPin, label: 'Location' },
  { id: 'folder', icon: Folder, label: 'Folder' },
  { id: 'image', icon: ImageIcon, label: 'Image' },
  { id: 'table', icon: Table, label: 'Table' },
];

export function CanvasPage() {
  const { id } = useParams();
  const { currentStory, nodes, loadStory, createNode, updateNode, updateNodes, deleteNode } = useStoryStore();
  const canvasRef = useRef<HTMLDivElement>(null);
  const [viewport, setViewport] = useState<Viewport>({ x: 0, y: 0, zoom: 1 });
  const [activeTool, setActiveTool] = useState('select');
  const [selectedNodes, setSelectedNodes] = useState<Set<string>>(new Set());
  const [isDragging, setIsDragging] = useState(false);
  const [isPanning, setIsPanning] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [lastMouse, setLastMouse] = useState({ x: 0, y: 0 });
  const [editingNode, setEditingNode] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  
  useEffect(() => {
    if (id) loadStory(id);
  }, [id]);
  
  // Screen to canvas coordinates
  const screenToCanvas = useCallback((screenX: number, screenY: number) => {
    return {
      x: (screenX - viewport.x) / viewport.zoom,
      y: (screenY - viewport.y) / viewport.zoom
    };
  }, [viewport]);
  
  // Canvas to screen coordinates
  const canvasToScreen = useCallback((canvasX: number, canvasY: number) => {
    return {
      x: canvasX * viewport.zoom + viewport.x,
      y: canvasY * viewport.zoom + viewport.y
    };
  }, [viewport]);
  
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    setViewport(prev => {
      const newZoom = Math.max(0.1, Math.min(5, prev.zoom * delta));
      const zoomRatio = newZoom / prev.zoom;
      return {
        zoom: newZoom,
        x: mouseX - (mouseX - prev.x) * zoomRatio,
        y: mouseY - (mouseY - prev.y) * zoomRatio
      };
    });
  };
  
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 1 || (e.button === 0 && activeTool === 'pan')) {
      setIsPanning(true);
      setLastMouse({ x: e.clientX, y: e.clientY });
      return;
    }
    
    if (e.button === 0) {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      
      const canvasPos = screenToCanvas(e.clientX - rect.left, e.clientY - rect.top);
      
      // Check if clicking on a node
      const clickedNode = nodes.find(n => 
        canvasPos.x >= n.x && canvasPos.x <= n.x + n.width &&
        canvasPos.y >= n.y && canvasPos.y <= n.y + n.height
      );
      
      if (clickedNode) {
        if (e.shiftKey) {
          setSelectedNodes(prev => {
            const next = new Set(prev);
            if (next.has(clickedNode.id)) next.delete(clickedNode.id);
            else next.add(clickedNode.id);
            return next;
          });
        } else {
          setSelectedNodes(new Set([clickedNode.id]));
        }
        
        if (activeTool === 'select') {
          setIsDragging(true);
          setDragStart({ x: canvasPos.x - clickedNode.x, y: canvasPos.y - clickedNode.y });
        }
      } else if (activeTool !== 'select' && activeTool !== 'pan') {
        // Create new node
        const newNode = createNode(id!, activeTool as any, canvasPos.x - 50, canvasPos.y - 25);
        setSelectedNodes(new Set([newNode.id]));
        setActiveTool('select');
      } else {
        setSelectedNodes(new Set());
      }
    }
  };
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      const dx = e.clientX - lastMouse.x;
      const dy = e.clientY - lastMouse.y;
      setViewport(prev => ({ ...prev, x: prev.x + dx, y: prev.y + dy }));
      setLastMouse({ x: e.clientX, y: e.clientY });
    } else if (isDragging && selectedNodes.size > 0) {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      
      const canvasPos = screenToCanvas(e.clientX - rect.left, e.clientY - rect.top);
      
      const updates = Array.from(selectedNodes).map(nodeId => {
        const node = nodes.find(n => n.id === nodeId);
        if (!node) return null;
        return {
          id: nodeId,
          x: canvasPos.x - dragStart.x,
          y: canvasPos.y - dragStart.y
        };
      }).filter(Boolean) as Array<{ id: string; x: number; y: number }>;
      
      updateNodes(updates);
    }
  };
  
  const handleMouseUp = () => {
    setIsDragging(false);
    setIsPanning(false);
  };
  
  const handleDoubleClick = (nodeId: string, text: string) => {
    setEditingNode(nodeId);
    setEditText(text || '');
  };
  
  const handleEditSubmit = () => {
    if (editingNode) {
      updateNode(editingNode, { text: editText });
      setEditingNode(null);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Delete' || e.key === 'Backspace') {
      selectedNodes.forEach(nodeId => deleteNode(nodeId));
      setSelectedNodes(new Set());
    }
    if (e.key === 'Escape') {
      setSelectedNodes(new Set());
      setEditingNode(null);
    }
  };
  
  const handleZoomIn = () => {
    setViewport(prev => ({ ...prev, zoom: Math.min(5, prev.zoom * 1.2) }));
  };
  
  const handleZoomOut = () => {
    setViewport(prev => ({ ...prev, zoom: Math.max(0.1, prev.zoom / 1.2) }));
  };
  
  if (!currentStory) return <div className="p-8">Loading...</div>;
  
  return (
    <div 
      className="h-screen flex flex-col"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {/* Toolbar */}
      <div className="flex items-center gap-1 p-2 border-b border-border bg-card">
        {tools.map(tool => {
          const Icon = tool.icon;
          return (
            <button
              key={tool.id}
              onClick={() => setActiveTool(tool.id)}
              className={cn(
                "p-2 rounded-md transition-colors",
                activeTool === tool.id 
                  ? "bg-primary text-primary-foreground" 
                  : "hover:bg-accent"
              )}
              title={tool.label}
            >
              <Icon className="w-5 h-5" />
            </button>
          );
        })}
        
        <div className="w-px h-6 bg-border mx-2" />
        
        <button
          onClick={handleZoomOut}
          className="p-2 hover:bg-accent rounded-md"
        >
          <Minus className="w-5 h-5" />
        </button>
        <span className="text-sm px-2 min-w-[60px] text-center">{Math.round(viewport.zoom * 100)}%</span>
        
        <button
          onClick={handleZoomIn}
          className="p-2 hover:bg-accent rounded-md"
        >
          <Plus className="w-5 h-5" />
        </button>
        
        {selectedNodes.size > 0 && (
          <>
            <div className="w-px h-6 bg-border mx-2" />
            <button
              onClick={() => {
                selectedNodes.forEach(nodeId => deleteNode(nodeId));
                setSelectedNodes(new Set());
              }}
              className="p-2 hover:bg-destructive/20 text-destructive rounded-md"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </>
        )}
      </div>
      
      {/* Canvas Area */}
      <div
        ref={canvasRef}
        className="flex-1 relative overflow-hidden bg-background cursor-crosshair"
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
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
            backgroundSize: `${20 * viewport.zoom}px ${20 * viewport.zoom}px`,
            backgroundPosition: `${viewport.x}px ${viewport.y}px`
          }}
        />
        
        {/* Nodes */}
        {nodes.map(node => {
          const isSelected = selectedNodes.has(node.id);
          const screenPos = canvasToScreen(node.x, node.y);
          
          return (
            <div
              key={node.id}
              className={cn(
                "absolute rounded-md border-2 bg-card p-3 shadow-sm",
                isSelected ? "border-primary ring-2 ring-primary/20" : "border-border"
              )}
              style={{
                left: screenPos.x,
                top: screenPos.y,
                width: node.width * viewport.zoom,
                minHeight: node.height * viewport.zoom,
                transform: 'translate(0, 0)',
                cursor: activeTool === 'select' ? 'move' : 'default'
              }}
              onDoubleClick={() => handleDoubleClick(node.id, node.text || '')}
            >
              {editingNode === node.id ? (
                <textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  onBlur={handleEditSubmit}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleEditSubmit();
                    }
                  }}
                  autoFocus
                  className="w-full bg-transparent resize-none outline-none"
                  style={{ fontSize: `${14 * viewport.zoom}px` }}
                  rows={2}
                />
              ) : (
                <div 
                  className="text-sm overflow-hidden"
                  style={{ fontSize: `${14 * viewport.zoom}px` }}
                >
                  {node.text || node.type}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}