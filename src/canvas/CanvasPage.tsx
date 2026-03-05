import { useEffect, useRef, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useStoryStore } from '../stores/storyStore';
import { cn } from '../lib/utils';
import { 
  MousePointer2, Hand, Type, User, MapPin, Folder, 
  Image as ImageIcon, Table, ChevronRight, ArrowRight, Plus,
  StickyNote, Link, Undo2, Redo2, Trash2, Copy, Scissors, 
  Palette, Maximize2, MoreHorizontal
} from 'lucide-react';

// Command pattern for undo/redo
interface Command {
  execute: () => void;
  undo: () => void;
  description: string;
}

interface Viewport {
  x: number;
  y: number;
  zoom: number;
}

interface Connection {
  id: string;
  fromNodeId: string;
  toNodeId: string;
  type: 'solid' | 'dashed' | 'arrow';
  color: string;
}

interface ContextMenuState {
  visible: boolean;
  x: number;
  y: number;
  nodeId?: string;
}

const tools = [
  { id: 'select', icon: MousePointer2, label: 'Select (V)', shortcut: 'v' },
  { id: 'pan', icon: Hand, label: 'Pan (Space)', shortcut: ' ' },
  { id: 'text', icon: Type, label: 'Text (T)', shortcut: 't' },
  { id: 'character', icon: User, label: 'Character (C)', shortcut: 'c' },
  { id: 'location', icon: MapPin, label: 'Location (L)', shortcut: 'l' },
  { id: 'folder', icon: Folder, label: 'Folder (F)', shortcut: 'f' },
  { id: 'image', icon: ImageIcon, label: 'Image (I)', shortcut: 'i' },
  { id: 'table', icon: Table, label: 'Table (Tab)', shortcut: 'tab' },
  { id: 'note', icon: StickyNote, label: 'Note (N)', shortcut: 'n' },
  { id: 'link', icon: Link, label: 'Link (U)', shortcut: 'u' },
];

// Breadcrumb for navigation
function Breadcrumb({ path, onNavigate }: { path: Array<{ id: string; name: string }>; onNavigate: (id: string) => void }) {
  return (
    <div className="flex items-center gap-1 px-4 py-2 bg-card/80 backdrop-blur border-b border-border">
      {path.map((item, index) => (
        <div key={item.id} className="flex items-center">
          {index > 0 && (
            <ChevronRight className="w-4 h-4 text-muted-foreground mx-1" />
          )}
          <button
            onClick={() => onNavigate(item.id)}
            className={cn(
              "px-2 py-1 rounded text-sm hover:bg-accent transition-colors",
              index === path.length - 1 ? "font-medium text-foreground" : "text-muted-foreground"
            )}
          >
            {item.name}
          </button>
        </div>
      ))}
    </div>
  );
}

// Context Menu Component
function ContextMenu({ 
  visible, 
  x, 
  y, 
  nodeId,
  onClose,
  onDelete,
  onCopy,
  onCut,
  onChangeColor,
  onBringToFront,
  onSendToBack
}: ContextMenuState & { 
  onClose: () => void;
  onDelete: () => void;
  onCopy: () => void;
  onCut: () => void;
  onChangeColor: () => void;
  onBringToFront: () => void;
  onSendToBack: () => void;
}) {
  if (!visible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        style={{ left: x, top: y }}
        className="fixed z-50 min-w-[160px] bg-card border border-border rounded-lg shadow-lg py-1"
      >
        {nodeId ? (
          // Node context menu
          <>
            <button onClick={onCopy} className="w-full px-3 py-2 text-left text-sm hover:bg-accent flex items-center gap-2">
              <Copy className="w-4 h-4" /> Copy
            </button>
            <button onClick={onCut} className="w-full px-3 py-2 text-left text-sm hover:bg-accent flex items-center gap-2">
              <Scissors className="w-4 h-4" /> Cut
            </button>
            <div className="h-px bg-border my-1" />
            <button onClick={onChangeColor} className="w-full px-3 py-2 text-left text-sm hover:bg-accent flex items-center gap-2">
              <Palette className="w-4 h-4" /> Change Color
            </button>
            <button onClick={onBringToFront} className="w-full px-3 py-2 text-left text-sm hover:bg-accent flex items-center gap-2">
              <Maximize2 className="w-4 h-4" /> Bring to Front
            </button>
            <button onClick={onSendToBack} className="w-full px-3 py-2 text-left text-sm hover:bg-accent flex items-center gap-2">
              <Maximize2 className="w-4 h-4 rotate-180" /> Send to Back
            </button>
            <div className="h-px bg-border my-1" />
            <button onClick={onDelete} className="w-full px-3 py-2 text-left text-sm hover:bg-accent text-destructive flex items-center gap-2">
              <Trash2 className="w-4 h-4" /> Delete
            </button>
          </>
        ) : (
          // Canvas context menu
          <>
            <button onClick={onClose} className="w-full px-3 py-2 text-left text-sm hover:bg-accent">
              Paste
            </button>
          </>
        )}
      </motion.div>
    </AnimatePresence>
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
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [lastMouse, setLastMouse] = useState({ x: 0, y: 0 });
  const [editingNode, setEditingNode] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  
  // Undo/Redo stacks
  const [undoStack, setUndoStack] = useState<Command[]>([]);
  const [redoStack, setRedoStack] = useState<Command[]>([]);
  
  // Connections
  const [connections, setConnections] = useState<Connection[]>([]);
  const [isDrawingConnection, setIsDrawingConnection] = useState(false);
  const [connectionStart, setConnectionStart] = useState<string | null>(null);
  
  // Context menu
  const [contextMenu, setContextMenu] = useState<ContextMenuState>({ visible: false, x: 0, y: 0 });
  
  // Clipboard
  const [clipboard, setClipboard] = useState<typeof nodes>([]);

  // Load story on mount
  useEffect(() => {
    if (id) {
      loadStory(id).then(() => {
        const rootCanvas = canvases.find(c => !c.parentCanvasId);
        if (rootCanvas) {
          loadCanvas(rootCanvas.id);
        } else {
          const newCanvas = createCanvas('Root Canvas');
          loadCanvas(newCanvas.id);
        }
      });
    }
  }, [id]);

  // Close context menu on click outside
  useEffect(() => {
    const handleClick = () => setContextMenu({ visible: false, x: 0, y: 0 });
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  // Undo/Redo functions
  const executeCommand = useCallback((command: Command) => {
    command.execute();
    setUndoStack(prev => [...prev, command]);
    setRedoStack([]);
  }, []);

  const undo = useCallback(() => {
    if (undoStack.length === 0) return;
    const command = undoStack[undoStack.length - 1];
    command.undo();
    setUndoStack(prev => prev.slice(0, -1));
    setRedoStack(prev => [...prev, command]);
  }, [undoStack]);

  const redo = useCallback(() => {
    if (redoStack.length === 0) return;
    const command = redoStack[redoStack.length - 1];
    command.execute();
    setRedoStack(prev => prev.slice(0, -1));
    setUndoStack(prev => [...prev, command]);
  }, [redoStack]);

  // Coordinate conversions
  const screenToCanvas = useCallback((screenX: number, screenY: number) => ({
    x: (screenX - viewport.x) / viewport.zoom,
    y: (screenY - viewport.y) / viewport.zoom
  }), [viewport]);

  const canvasToScreen = useCallback((canvasX: number, canvasY: number) => ({
    x: canvasX * viewport.zoom + viewport.x,
    y: canvasY * viewport.zoom + viewport.y
  }), [viewport]);

  // Filter nodes for current canvas
  const currentNodes = nodes.filter(n => n.canvasId === currentCanvas?.id);

  // Mouse handlers
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
      } else if (node && (node.type === 'character' || node.type === 'location' || node.type === 'folder')) {
        const newCanvas = createCanvas(
          node.type === 'character' ? 'Character Notes' : 
          node.type === 'location' ? 'Location Notes' : 'Folder',
          currentCanvas?.id
        );
        updateNode(node.id, { linkedCanvasId: newCanvas.id });
        loadCanvas(newCanvas.id);
      }
      return;
    }

    if (e.button === 2) {
      // Right click - show context menu
      e.preventDefault();
      setContextMenu({
        visible: true,
        x: e.clientX,
        y: e.clientY,
        nodeId
      });
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
          const canvasPos = screenToCanvas(e.clientX, e.clientY);
          setDragOffset({
            x: canvasPos.x - node.x,
            y: canvasPos.y - node.y
          });
        }
      } else if (activeTool !== 'select' && activeTool !== 'pan') {
        // Create new node
        const rect = canvasRef.current?.getBoundingClientRect();
        if (!rect) return;
        
        const canvasPos = screenToCanvas(e.clientX - rect.left, e.clientY - rect.top);
        
        const isFolderType = ['character', 'location', 'folder'].includes(activeTool);
        const newNode = createNode(
          currentCanvas!.id,
          activeTool as any,
          canvasPos.x - 100,
          canvasPos.y - 40
        );
        
        if (isFolderType) {
          const linkedCanvas = createCanvas(
            activeTool === 'character' ? 'Character Notes' : 
            activeTool === 'location' ? 'Location Notes' : 'Folder',
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
      const canvasPos = screenToCanvas(e.clientX, e.clientY);
      
      selectedNodes.forEach(nodeId => {
        const node = currentNodes.find(n => n.id === nodeId);
        if (node) {
          updateNode(nodeId, {
            x: canvasPos.x - dragOffset.x,
            y: canvasPos.y - dragOffset.y
          });
        }
      });
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
    // Undo/Redo
    if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
      e.preventDefault();
      if (e.shiftKey) redo();
      else undo();
      return;
    }
    
    if ((e.metaKey || e.ctrlKey) && e.key === 'y') {
      e.preventDefault();
      redo();
      return;
    }

    // Copy/Paste
    if ((e.metaKey || e.ctrlKey) && e.key === 'c') {
      const selectedData = currentNodes.filter(n => selectedNodes.has(n.id));
      setClipboard(selectedData);
      return;
    }

    if ((e.metaKey || e.ctrlKey) && e.key === 'v') {
      // Paste logic would go here
      return;
    }

    // Delete
    if (e.key === 'Delete' || e.key === 'Backspace') {
      selectedNodes.forEach(nodeId => deleteNode(nodeId));
      setSelectedNodes(new Set());
    }
    
    if (e.key === 'Escape') {
      setSelectedNodes(new Set());
      setEditingNode(null);
      setContextMenu({ visible: false, x: 0, y: 0 });
    }

    // Tool shortcuts
    if (!editingNode) {
      switch (e.key.toLowerCase()) {
        case 'v': setActiveTool('select'); break;
        case ' ': setActiveTool('pan'); break;
        case 't': setActiveTool('text'); break;
        case 'c': setActiveTool('character'); break;
        case 'l': setActiveTool('location'); break;
        case 'f': setActiveTool('folder'); break;
        case 'i': setActiveTool('image'); break;
        case 'n': setActiveTool('note'); break;
        case 'u': setActiveTool('link'); break;
      }
    }
  };

  const handleZoomIn = () => setViewport(prev => ({ ...prev, zoom: Math.min(5, prev.zoom * 1.2) }));
  const handleZoomOut = () => setViewport(prev => ({ ...prev, zoom: Math.max(0.1, prev.zoom / 1.2) }));
  const handleZoomReset = () => setViewport({ x: 0, y: 0, zoom: 1 });

  // Breadcrumb navigation
  const [breadcrumbPath, setBreadcrumbPath] = useState<Array<{ id: string; name: string }>>([]);
  
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

  const handleBreadcrumbNavigate = (canvasId: string) => {
    loadCanvas(canvasId);
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
          {/* Undo/Redo */}
          <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
            <button 
              onClick={undo} 
              disabled={undoStack.length === 0}
              className="p-2 hover:bg-accent rounded disabled:opacity-30"
              title="Undo (Ctrl+Z)"
            >
              <Undo2 className="w-4 h-4" />
            </button>
            <button 
              onClick={redo} 
              disabled={redoStack.length === 0}
              className="p-2 hover:bg-accent rounded disabled:opacity-30"
              title="Redo (Ctrl+Y)"
            >
              <Redo2 className="w-4 h-4" />
            </button>
          </div>

          <div className="w-px h-6 bg-border" />

          {/* Zoom */}
          <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
            <button onClick={handleZoomOut} className="p-2 hover:bg-accent rounded">−</button>
            <span className="text-sm min-w-[60px] text-center">{Math.round(viewport.zoom * 100)}%</span>
            <button onClick={handleZoomIn} className="p-2 hover:bg-accent rounded">+</button>
            <button onClick={handleZoomReset} className="p-2 hover:bg-accent rounded text-xs" title="Reset zoom">⌂</button>
          </div>

          {selectedNodes.size > 0 && (
            <>
              <div className="w-px h-6 bg-border" />
              <button
                onClick={() => {
                  selectedNodes.forEach(nodeId => deleteNode(nodeId));
                  setSelectedNodes(new Set());
                }}
                className="p-2 hover:text-destructive transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Canvas Area */}
      <div
        ref={canvasRef}
        className={cn(
          "flex-1 relative overflow-hidden bg-background",
          activeTool === 'pan' && "cursor-grab",
          isPanning && "cursor-grabbing",
          activeTool !== 'pan' && activeTool !== 'select' && "cursor-crosshair"
        )}
        onWheel={handleWheel}
        onMouseDown={(e) => handleMouseDown(e)}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onContextMenu={(e) => e.preventDefault()}
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

        {/* Connection Lines */}
        <svg className="absolute inset-0 pointer-events-none" style={{ transform: `translate(${viewport.x}px, ${viewport.y}px)` }}>
          {connections.map(conn => {
            const fromNode = currentNodes.find(n => n.id === conn.fromNodeId);
            const toNode = currentNodes.find(n => n.id === conn.toNodeId);
            if (!fromNode || !toNode) return null;
            
            const fromX = fromNode.x + fromNode.width / 2;
            const fromY = fromNode.y + fromNode.height / 2;
            const toX = toNode.x + toNode.width / 2;
            const toY = toNode.y + toNode.height / 2;
            
            return (
              <line
                key={conn.id}
                x1={fromX}
                y1={fromY}
                x2={toX}
                y2={toY}
                stroke={conn.color}
                strokeWidth="2"
                strokeDasharray={conn.type === 'dashed' ? '5,5' : undefined}
                markerEnd={conn.type === 'arrow' ? 'url(#arrowhead)' : undefined}
              />
            );
          })}
          <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="hsl(var(--primary))" />
            </marker>
          </defs>
        </svg>

        {/* Nodes */}
        {currentNodes.map(node => {
          const isSelected = selectedNodes.has(node.id);
          const screenPos = canvasToScreen(node.x, node.y);
          const isFolderType = node.type === 'character' || node.type === 'location' || node.type === 'folder';
          
          return (
            <motion.div
              key={node.id}
              layoutId={node.id}
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
              {/* Node Header */}
              <div className={cn(
                "flex items-center gap-2 px-3 py-2 border-b border-border/50 rounded-t-xl",
                node.type === 'character' && "bg-blue-500/10",
                node.type === 'location' && "bg-amber-500/10",
                node.type === 'folder' && "bg-purple-500/10"
              )}>
                {node.type === 'character' && <User className="w-4 h-4 text-blue-500" />}
                {node.type === 'location' && <MapPin className="w-4 h-4 text-amber-500" />}
                {node.type === 'folder' && <Folder className="w-4 h-4 text-purple-500" />}
                {node.type === 'text' && <Type className="w-4 h-4 text-muted-foreground" />}
                {node.type === 'note' && <StickyNote className="w-4 h-4 text-yellow-500" />}
                {node.type === 'link' && <Link className="w-4 h-4 text-green-500" />}
                
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {node.type}
                </span>
                
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
            </motion.div>
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

        {/* Context Menu */}
        <ContextMenu
          {...contextMenu}
          onClose={() => setContextMenu({ visible: false, x: 0, y: 0 })}
          onDelete={() => {
            if (contextMenu.nodeId) {
              deleteNode(contextMenu.nodeId);
              setSelectedNodes(prev => {
                const next = new Set(prev);
                next.delete(contextMenu.nodeId!);
                return next;
              });
            }
          }}
          onCopy={() => {
            // Copy logic
          }}
          onCut={() => {
            // Cut logic
          }}
          onChangeColor={() => {
            // Color picker logic
          }}
          onBringToFront={() => {
            // Bring to front logic
          }}
          onSendToBack={() => {
            // Send to back logic
          }}
        />
      </div>
    </div>
  );
}
