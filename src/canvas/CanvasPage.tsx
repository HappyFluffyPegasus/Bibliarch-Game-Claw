import { useEffect, useRef, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useStoryStore } from '../stores/storyStore';
import { cn } from '../lib/utils';
import { 
  MousePointer2, Hand, Type, User, Calendar, MapPin, Folder, 
  Image as ImageIcon, Table, ChevronRight, ArrowRight, Plus
} from 'lucide-react';

interface Viewport {
  x: number;
  y: number;
  zoom: number;
}

interface CanvasNodeExtended {
  id: string;
  storyId: string;
  canvasId: string;
  type: 'text' | 'character' | 'event' | 'location' | 'folder' | 'image' | 'table';
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  text?: string;
  content?: string;
  color?: string;
  linkedCanvasId?: string;
  parentId?: string;
  hasArrow?: boolean;
  createdAt: string;
  updatedAt: string;
}

const tools = [
  { id: 'select', icon: MousePointer2, label: 'Select (V)' },
  { id: 'pan', icon: Hand, label: 'Pan (Space)' },
  { id: 'text', icon: Type, label: 'Text (T)' },
  { id: 'character', icon: User, label: 'Character (C)' },
  { id: 'event', icon: Calendar, label: 'Event (E)' },
  { id: 'location', icon: MapPin, label: 'Location (L)' },
  { id: 'folder', icon: Folder, label: 'Folder (F)' },
  { id: 'image', icon: ImageIcon, label: 'Image (I)' },
  { id: 'table', icon: Table, label: 'Table (Tab)' },
];

// Breadcrumb for navigation
function Breadcrumb({ path, onNavigate }: { path: Array<{ id: string; name: string }>; onNavigate: (id: string) => void }) {
  return (
    <div className="flex items-center gap-1 px-4 py-2 bg-card/80 backdrop-blur border-b border-border">
      {path.map((item, index) => (
        <>
          {index > 0 && (
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          )}
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={cn(
              "px-2 py-1 rounded text-sm hover:bg-accent transition-colors",
              index === path.length - 1 ? "font-medium text-foreground" : "text-muted-foreground"
            )}
          >
            {item.name}
          </button>
        </>
      ))}
    </div>
  );
}

export function CanvasPage() {
  const { id } = useParams();
  const { 
    currentStory, 
    currentCanvas,
    canvases,
    nodes,
    loadStory, 
    loadCanvas,
    createCanvas,
    createNode, 
    updateNode, 
    updateNodes, 
    deleteNode,
    setCurrentCanvas
  } = useStoryStore();
  
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
  const [breadcrumbPath, setBreadcrumbPath] = useState<Array<{ id: string; name: string }>>([]);

  // Load story on mount
  useEffect(() => {
    if (id) {
      loadStory(id).then(() => {
        // Find root canvas or create one
        const rootCanvas = canvases.find(c => !c.parentCanvasId);
        if (rootCanvas) {
          loadCanvas(rootCanvas.id);
        } else {
          // Create root canvas
          const newCanvas = createCanvas('Root Canvas');
          loadCanvas(newCanvas.id);
        }
      });
    }
  }, [id]);

  // Update breadcrumb when canvas changes
  useEffect(() => {
    if (!currentCanvas) return;
    
    const path: Array<{ id: string; name: string }> = [];
    let current: typeof currentCanvas | undefined = currentCanvas;
    
    while (current) {
      path.unshift({ id: current.id, name: current.name });
      current = canvases.find(c => c.id === current?.parentCanvasId);
    }
    
    setBreadcrumbPath(path);
  }, [currentCanvas, canvases]);
  
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

  // Filter nodes for current canvas
  const currentNodes = nodes.filter(n => n.canvasId === currentCanvas?.id);
  
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
  
  const handleMouseDown = (e: React.MouseEvent, nodeId?: string) => {
    // Handle arrow button click
    if ((e.target as HTMLElement).closest('.arrow-button')) {
      const node = currentNodes.find(n => n.id === nodeId);
      if (node?.linkedCanvasId) {
        loadCanvas(node.linkedCanvasId);
      } else if (node && (node.type === 'character' || node.type === 'event' || node.type === 'folder')) {
        // Create sub-canvas for this folder node
        const newCanvas = createCanvas(node.text || `${node.type} Canvas`, currentCanvas?.id);
        updateNode(node.id, { linkedCanvasId: newCanvas.id });
        loadCanvas(newCanvas.id);
      }
      return;
    }

    if (e.button === 1 || (e.button === 0 && activeTool === 'pan')) {
      setIsPanning(true);
      setLastMouse({ x: e.clientX, y: e.clientY });
      return;
    }
    
    if (e.button === 0) {
      if (nodeId) {
        const node = currentNodes.find(n => n.id === nodeId);
        if (!node) return;

        if (e.shiftKey) {
          setSelectedNodes(prev => {
            const next = new Set(prev);
            if (next.has(nodeId)) next.delete(nodeId);
            else next.add(nodeId);
            return next;
          });
        } else {
          setSelectedNodes(new Set([nodeId]));
        }
        
        if (activeTool === 'select') {
          setIsDragging(true);
          setDragStart({ x: 0, y: 0 }); // Will calculate offset in mousemove
        }
      } else if (activeTool !== 'select' && activeTool !== 'pan') {
        // Create new node
        const rect = canvasRef.current?.getBoundingClientRect();
        if (!rect) return;
        
        const canvasPos = screenToCanvas(e.clientX - rect.left, e.clientY - rect.top);
        
        // Folder nodes (character, event, folder) get arrows and linkedCanvas
        const isFolderType = ['character', 'event', 'folder'].includes(activeTool);
        const newNode = createNode(
          currentCanvas!.id,
          activeTool as any,
          canvasPos.x - 100,
          canvasPos.y - 40
        );
        
        if (isFolderType) {
          // Create linked canvas for folder types
          const linkedCanvas = createCanvas(
            activeTool === 'character' ? 'Character Notes' : 
            activeTool === 'event' ? 'Event Notes' : 'Folder',
            currentCanvas?.id
          );
          updateNode(newNode.id, { 
            linkedCanvasId: linkedCanvas.id,
            hasArrow: true 
          });
        }
        
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
        const node = currentNodes.find(n => n.id === nodeId);
        if (!node) return null;
        return {
          id: nodeId,
          x: canvasPos.x - 50,
          y: canvasPos.y - 25
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

  const handleBreadcrumbNavigate = (canvasId: string) => {
    loadCanvas(canvasId);
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
    // Tool shortcuts
    if (!editingNode) {
      switch (e.key.toLowerCase()) {
        case 'v': setActiveTool('select'); break;
        case ' ': setActiveTool('pan'); break;
        case 't': setActiveTool('text'); break;
        case 'c': setActiveTool('character'); break;
        case 'e': setActiveTool('event'); break;
        case 'l': setActiveTool('location'); break;
        case 'f': setActiveTool('folder'); break;
        case 'i': setActiveTool('image'); break;
      }
    }
  };
  
  const handleZoomIn = () => {
    setViewport(prev => ({ ...prev, zoom: Math.min(5, prev.zoom * 1.2) }));
  };
  
  const handleZoomOut = () => {
    setViewport(prev => ({ ...prev, zoom: Math.max(0.1, prev.zoom / 1.2) }));
  };
  
  const handleZoomReset = () => {
    setViewport({ x: 0, y: 0, zoom: 1 });
  };
  
  if (!currentStory) return <div className="p-8">Loading...</div>;
  
  return (
    <div 
      className="h-screen flex flex-col"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {/* Breadcrumb Navigation */}
      <Breadcrumb path={breadcrumbPath} onNavigate={handleBreadcrumbNavigate} />
      
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-card/80 backdrop-blur">
        <div className="flex items-center gap-1">
          {tools.map(tool => {
            const Icon = tool.icon;
            return (
              <button
                key={tool.id}
                onClick={() => setActiveTool(tool.id)}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all",
                  activeTool === tool.id 
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25" 
                    : "hover:bg-accent text-muted-foreground hover:text-foreground"
                )}
                title={tool.label}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tool.label.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
            <button onClick={handleZoomOut} className="w-8 h-8 flex items-center justify-center hover:bg-accent rounded">
              −
            </button>
            <button onClick={handleZoomReset} className="text-xs px-2 min-w-[60px] text-center font-medium">
              {Math.round(viewport.zoom * 100)}%
            </button>
            <button onClick={handleZoomIn} className="w-8 h-8 flex items-center justify-center hover:bg-accent rounded">
              +
            </button>
          </div>
        </div>
      </div>
      
      {/* Canvas Area */}
      <div
        ref={canvasRef}
        className="flex-1 relative overflow-hidden bg-background cursor-crosshair"
        onWheel={handleWheel}
        onMouseDown={(e) => handleMouseDown(e)}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Grid */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(to right, hsl(var(--border) / 0.3) 1px, transparent 1px),
              linear-gradient(to bottom, hsl(var(--border) / 0.3) 1px, transparent 1px)
            `,
            backgroundSize: `${20 * viewport.zoom}px ${20 * viewport.zoom}px`,
            backgroundPosition: `${viewport.x}px ${viewport.y}px`
          }}
        />
        
        {/* Nodes */}
        {currentNodes.map(node => {
          const isSelected = selectedNodes.has(node.id);
          const screenPos = canvasToScreen(node.x, node.y);
          const isFolderType = node.type === 'character' || node.type === 'event' || node.type === 'folder';
          
          return (
            <div
              key={node.id}
              className={cn(
                "absolute rounded-xl border-2 bg-card shadow-lg transition-shadow",
                isSelected ? "border-primary ring-2 ring-primary/30 shadow-primary/20" : "border-border",
                isDragging && isSelected && "cursor-grabbing",
                activeTool === 'select' && "cursor-grab"
              )}
              style={{
                left: screenPos.x,
                top: screenPos.y,
                width: node.width * viewport.zoom,
                minHeight: node.height * viewport.zoom,
                zIndex: isSelected ? 100 : node.zIndex
              }}
              onMouseDown={(e) => handleMouseDown(e, node.id)}
              onDoubleClick={() => handleDoubleClick(node.id, node.text || '')}
            >
              {/* Node Header with Icon */}
              <div className={cn(
                "flex items-center gap-2 px-3 py-2 border-b border-border/50 rounded-t-xl",
                node.type === 'character' && "bg-blue-500/10",
                node.type === 'event' && "bg-amber-500/10",
                node.type === 'folder' && "bg-purple-500/10"
              )}>
                {node.type === 'character' && <User className="w-4 h-4 text-blue-500" />}
                {node.type === 'event' && <Calendar className="w-4 h-4 text-amber-500" />}
                {node.type === 'folder' && <Folder className="w-4 h-4 text-purple-500" />}
                {node.type === 'text' && <Type className="w-4 h-4 text-muted-foreground" />}
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {node.type}
                </span>
                
                {/* Arrow button for folder types */}
                {isFolderType && (
                  <button
                    className="arrow-button ml-auto p-1 rounded hover:bg-accent transition-colors"
                    title="Open folder"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
              
              {/* Node Content */}
              <div className="p-3">
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
                    className="w-full bg-transparent resize-none outline-none text-sm"
                    style={{ fontSize: `${14 * viewport.zoom}px` }}
                    rows={2}
                    placeholder={isFolderType ? "Name this folder..." : "Type here..."}
                  />
                ) : (
                  <div 
                    className="text-sm leading-relaxed"
                    style={{ fontSize: `${14 * viewport.zoom}px` }}
                  >
                    {node.text || (
                      <span className="text-muted-foreground italic">
                        {isFolderType ? `Double-click to name ${node.type}...` : 'Double-click to edit...'}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
        
        {/* Empty State */}
        {currentNodes.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center text-muted-foreground">
              <Plus className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">This canvas is empty</p>
              <p className="text-sm">Select a tool and click anywhere to create nodes</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}