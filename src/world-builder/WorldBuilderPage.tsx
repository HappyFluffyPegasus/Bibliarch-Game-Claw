import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useStoryStore } from '../stores/storyStore';
import { BabylonViewer } from '../components/BabylonViewer';
import { cn } from '../lib/utils';
import { 
  Mountain, Trees, Building2, Video, Sun, Eye, 
  MousePointer2, Paintbrush, Eraser, Save, FolderTree,
  ChevronRight, ChevronDown
} from 'lucide-react';

interface WorldNode {
  id: string;
  name: string;
  level: string;
  children?: WorldNode[];
}

const toolbarTabs = [
  { id: 'home', label: 'Home', icon: MousePointer2 },
  { id: 'terrain', label: 'Terrain', icon: Mountain },
  { id: 'build', label: 'Build', icon: Building2 },
  { id: 'environment', label: 'Environment', icon: Sun },
  { id: 'view', label: 'View', icon: Eye },
];

const terrainTools = [
  { id: 'raise', label: 'Raise', icon: Mountain },
  { id: 'lower', label: 'Lower', icon: Mountain },
  { id: 'smooth', label: 'Smooth', icon: Paintbrush },
  { id: 'flatten', label: 'Flatten', icon: Eraser },
];

export function WorldBuilderPage() {
  const { id } = useParams();
  const { currentStory, worldNodes, loadStory } = useStoryStore();
  const [activeTab, setActiveTab] = useState('terrain');
  const [activeTool, setActiveTool] = useState('raise');
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [brushSize, setBrushSize] = useState(10);
  const [brushStrength, setBrushStrength] = useState(0.5);
  const [panels, setPanels] = useState({
    explorer: true,
    properties: true,
    output: false,
  });

  useEffect(() => {
    if (id) loadStory(id);
  }, [id]);

  // Mock world hierarchy
  const worldHierarchy: WorldNode[] = [
    {
      id: 'world1',
      name: 'My World',
      level: 'World',
      children: [
        {
          id: 'country1',
          name: 'Kingdom of Aldoria',
          level: 'Country',
          children: [
            {
              id: 'city1',
              name: 'Capital City',
              level: 'City',
              children: [
                { id: 'building1', name: 'Castle', level: 'Building' },
                { id: 'building2', name: 'Tavern', level: 'Building' },
              ]
            }
          ]
        }
      ]
    }
  ];

  const renderNode = (node: WorldNode, depth = 0) => (
    <div key={node.id}>
      <button
        onClick={() => setSelectedNode(node.id)}
        className={cn(
          "w-full flex items-center gap-2 px-2 py-1.5 text-sm hover:bg-accent rounded",
          selectedNode === node.id && "bg-primary/10 text-primary",
          depth > 0 && "ml-4"
        )}
      >
        {node.children ? (
          <ChevronDown className="w-4 h-4" />
        ) : (
          <ChevronRight className="w-4 h-4 opacity-0" />
        )}
        <FolderTree className="w-4 h-4" />
        <span>{node.name}</span>
        <span className="text-xs text-muted-foreground ml-auto">{node.level}</span>
      </button>
      {node.children?.map(child => renderNode(child, depth + 1))}
    </div>
  );

  if (!currentStory) return <div className="p-8">Loading...</div>;

  return (
    <div className="h-screen flex flex-col">
      {/* Ribbon Toolbar */}
      <div className="border-b border-border bg-card">
        <div className="flex">
          {toolbarTabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 border-b-2 transition-colors",
                  activeTab === tab.id
                    ? "border-primary text-primary"
                    : "border-transparent hover:bg-accent"
                )}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Toolbar Content */}
        <div className="p-3 flex items-center gap-4">
          {activeTab === 'terrain' && (
            <>
              <div className="flex gap-2">
                {terrainTools.map((tool) => {
                  const Icon = tool.icon;
                  return (
                    <button
                      key={tool.id}
                      onClick={() => setActiveTool(tool.id)}
                      className={cn(
                        "flex flex-col items-center gap-1 p-2 rounded min-w-[60px]",
                        activeTool === tool.id
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-accent"
                      )}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-xs">{tool.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="w-px h-10 bg-border" />

              <div className="flex items-center gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground">Brush Size: {brushSize}</label>
                  <input
                    type="range"
                    min="1"
                    max="20"
                    value={brushSize}
                    onChange={(e) => setBrushSize(Number(e.target.value))}
                    className="w-32"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground">Strength: {Math.round(brushStrength * 100)}%</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={brushStrength * 100}
                    onChange={(e) => setBrushStrength(Number(e.target.value) / 100)}
                    className="w-32"
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Explorer Panel */}
        <div
          className={cn(
            "border-r border-border bg-card transition-all duration-200",
            panels.explorer ? "w-64" : "w-0 overflow-hidden"
          )}
        >
          <div className="p-3 border-b border-border flex items-center justify-between">
            <span className="font-semibold">Explorer</span>
            <button
              onClick={() => setPanels(p => ({ ...p, explorer: false }))}
              className="text-muted-foreground hover:text-foreground"
            >
              ×
            </button>
          </div>
          <div className="p-2">
            {worldHierarchy.map(renderNode)}
          </div>
        </div>

        {/* 3D Viewport */}
        <div className="flex-1 relative">
          <BabylonViewer />

          {/* Minimap */}
          <div className="absolute bottom-4 left-4 w-48 h-48 bg-card/90 backdrop-blur rounded-lg border border-border overflow-hidden">
            <div className="absolute top-2 left-2 text-xs text-muted-foreground">Minimap</div>
            <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
              Terrain Overview
            </div>
          </div>

          {/* Camera Controls */}
          <div className="absolute bottom-4 right-4 bg-card/90 backdrop-blur rounded-lg p-3 border border-border">
            <div className="flex gap-2">
              <button className="px-3 py-1.5 text-sm hover:bg-accent rounded">Orbit</button>
              <button className="px-3 py-1.5 text-sm hover:bg-accent rounded">FPS</button>
              <button className="px-3 py-1.5 text-sm hover:bg-accent rounded">Top</button>
            </div>
          </div>
        </div>

        {/* Properties Panel */}
        <div
          className={cn(
            "border-l border-border bg-card transition-all duration-200",
            panels.properties ? "w-72" : "w-0 overflow-hidden"
          )}
        >
          <div className="p-3 border-b border-border flex items-center justify-between">
            <span className="font-semibold">Properties</span>
            <button
              onClick={() => setPanels(p => ({ ...p, properties: false }))}
              className="text-muted-foreground hover:text-foreground"
            >
              ×
            </button>
          </div>
          
          <div className="p-4 space-y-4">
            {selectedNode ? (
              <>
                <div>
                  <label className="text-sm font-medium">Name</label>
                  <input
                    type="text"
                    defaultValue={worldHierarchy.find(n => n.id === selectedNode)?.name}
                    className="w-full mt-1 px-3 py-2 bg-background border border-input rounded-md"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Level</label>
                  <select className="w-full mt-1 px-3 py-2 bg-background border border-input rounded-md">
                    <option>World</option>
                    <option>Country</option>
                    <option>City</option>
                    <option>Building</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium">Terrain Size</label>
                  <input
                    type="number"
                    defaultValue={1024}
                    className="w-full mt-1 px-3 py-2 bg-background border border-input rounded-md"
                  />
                </div>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">Select a world node to edit properties</p>
            )}
          </div>
        </div>
      </div>

      {/* Output Panel */}
      <div
        className={cn(
          "border-t border-border bg-card transition-all duration-200",
          panels.output ? "h-48" : "h-0 overflow-hidden"
        )}
      >
        <div className="p-2 border-b border-border flex items-center justify-between">
          <span className="font-semibold text-sm">Output</span>
          <button
            onClick={() => setPanels(p => ({ ...p, output: false }))}
            className="text-muted-foreground hover:text-foreground"
          >
            ×
          </button>
        </div>
        <div className="p-2 font-mono text-sm text-muted-foreground">
          <div>[INFO] World Builder initialized</div>
          <div>[INFO] Ready to edit terrain</div>
        </div>
      </div>
    </div>
  );
}