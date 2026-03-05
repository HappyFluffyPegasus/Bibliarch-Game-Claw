import { useEffect, useRef, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useStoryStore } from '../stores/storyStore';
import { Engine, Scene, ArcRotateCamera, Vector3, HemisphericLight, DirectionalLight, MeshBuilder, StandardMaterial, Color3, DynamicTexture, VertexData, Mesh, Color4 } from '@babylonjs/core';
import { GlassCard } from '../components/GlassCard';
import { cn } from '../lib/utils';
import { 
  Mountain, Droplets, Circle, Square, Eraser, 
  Eye, EyeOff, Sun, CloudRain, Wind,
  ChevronLeft, ChevronRight, ChevronUp, ChevronDown
} from 'lucide-react';

// Terrain brush types
const brushes = [
  { id: 'raise', icon: ChevronUp, label: 'Raise', color: '#22c55e' },
  { id: 'lower', icon: ChevronDown, label: 'Lower', color: '#ef4444' },
  { id: 'flatten', icon: Square, label: 'Flatten', color: '#3b82f6' },
  { id: 'smooth', icon: Circle, label: 'Smooth', color: '#a855f7' },
  { id: 'noise', icon: Wind, label: 'Noise', color: '#f59e0b' },
];

// Material types
const materials = [
  { id: 'grass', name: 'Grass', color: '#22c55e' },
  { id: 'dirt', name: 'Dirt', color: '#8b5a2b' },
  { id: 'rock', name: 'Rock', color: '#6b7280' },
  { id: 'sand', name: 'Sand', color: '#f4a460' },
  { id: 'snow', name: 'Snow', color: '#f8fafc' },
  { id: 'water', name: 'Water', color: '#3b82f6' },
];

export function WorldBuilderPage() {
  const { id } = useParams();
  const { currentStory, worldNodes, loadStory } = useStoryStore();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<Engine | null>(null);
  const sceneRef = useRef<Scene | null>(null);
  const terrainRef = useRef<Mesh | null>(null);
  
  const [activeBrush, setActiveBrush] = useState('raise');
  const [activeMaterial, setActiveMaterial] = useState('grass');
  const [brushSize, setBrushSize] = useState(5);
  const [brushStrength, setBrushStrength] = useState(0.5);
  const [seaLevel, setSeaLevel] = useState(0);
  const [showWater, setShowWater] = useState(true);
  const [isPainting, setIsPainting] = useState(false);

  useEffect(() => {
    if (id) loadStory(id);
  }, [id]);

  // Initialize Babylon.js scene
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const engine = new Engine(canvas, true, { preserveDrawingBuffer: true });
    engineRef.current = engine;

    const scene = new Scene(engine);
    sceneRef.current = scene;
    scene.clearColor = new Color4(0.05, 0.07, 0.13, 1);

    // Camera
    const camera = new ArcRotateCamera(
      'camera',
      -Math.PI / 2,
      Math.PI / 3,
      50,
      Vector3.Zero(),
      scene
    );
    camera.attachControl(canvas, true);
    camera.wheelPrecision = 30;
    camera.lowerRadiusLimit = 10;
    camera.upperRadiusLimit = 200;

    // Lighting
    const hemiLight = new HemisphericLight('hemi', new Vector3(0, 1, 0), scene);
    hemiLight.intensity = 0.6;
    hemiLight.groundColor = new Color3(0.1, 0.1, 0.15);

    const dirLight = new DirectionalLight('dir', new Vector3(-1, -2, -1), scene);
    dirLight.position = new Vector3(20, 40, 20);
    dirLight.intensity = 0.8;

    // Create terrain
    createTerrain(scene);

    // Create water plane
    createWater(scene);

    // Render loop
    engine.runRenderLoop(() => {
      scene.render();
    });

    const handleResize = () => engine.resize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      scene.dispose();
      engine.dispose();
    };
  }, []);

  const createTerrain = (scene: Scene) => {
    // Create ground mesh
    const ground = MeshBuilder.CreateGround(
      'terrain',
      { width: 100, height: 100, subdivisions: 64, updatable: true },
      scene
    );
    terrainRef.current = ground;

    // Create material
    const material = new StandardMaterial('terrainMat', scene);
    material.diffuseColor = new Color3(0.13, 0.77, 0.37); // Grass green
    material.specularColor = new Color3(0.1, 0.1, 0.1);
    ground.material = material;

    // Add some initial height variation
    const positions = ground.getVerticesData('position');
    if (positions) {
      for (let i = 0; i < positions.length; i += 3) {
        const x = positions[i];
        const z = positions[i + 2];
        // Simple noise function for initial terrain
        const height = Math.sin(x * 0.1) * Math.cos(z * 0.1) * 2 +
                      Math.sin(x * 0.05 + z * 0.05) * 4;
        positions[i + 1] = Math.max(-5, height);
      }
      ground.updateVerticesData('position', positions);
      ground.createNormals(true);
    }
  };

  const createWater = (scene: Scene) => {
    const water = MeshBuilder.CreateGround(
      'water',
      { width: 120, height: 120, subdivisions: 1 },
      scene
    );
    water.position.y = seaLevel;

    const waterMat = new StandardMaterial('waterMat', scene);
    waterMat.diffuseColor = new Color3(0.23, 0.51, 0.96);
    waterMat.alpha = 0.6;
    waterMat.specularColor = new Color3(0.8, 0.8, 0.8);
    water.material = waterMat;
  };

  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    if (!sceneRef.current || !terrainRef.current) return;

    const scene = sceneRef.current;
    const terrain = terrainRef.current;

    // Get pick result
    const pickResult = scene.pick(scene.pointerX, scene.pointerY);
    
    if (pickResult.hit && pickResult.pickedMesh === terrain) {
      const point = pickResult.pickedPoint;
      if (point) {
        modifyTerrain(terrain, point.x, point.z, activeBrush, brushSize, brushStrength);
      }
    }
  }, [activeBrush, brushSize, brushStrength]);

  const modifyTerrain = (
    terrain: Mesh,
    centerX: number,
    centerZ: number,
    brush: string,
    size: number,
    strength: number
  ) => {
    const positions = terrain.getVerticesData('position');
    if (!positions) return;

    for (let i = 0; i < positions.length; i += 3) {
      const x = positions[i];
      const z = positions[i + 2];
      const dist = Math.sqrt((x - centerX) ** 2 + (z - centerZ) ** 2);

      if (dist < size) {
        const falloff = 1 - (dist / size);
        const currentY = positions[i + 1];
        let newY = currentY;

        switch (brush) {
          case 'raise':
            newY = currentY + strength * falloff;
            break;
          case 'lower':
            newY = currentY - strength * falloff;
            break;
          case 'flatten':
            newY = currentY + (seaLevel - currentY) * strength * falloff;
            break;
          case 'smooth':
            // Average with neighbors (simplified)
            newY = currentY + (0 - currentY) * strength * falloff * 0.1;
            break;
          case 'noise':
            newY = currentY + (Math.random() - 0.5) * strength * falloff;
            break;
        }

        positions[i + 1] = newY;
      }
    }

    terrain.updateVerticesData('position', positions);
    terrain.createNormals(true);
  };

  if (!currentStory) return <div className="p-8">Loading...</div>;

  return (
    <div className="h-screen flex bg-background">
      {/* Toolbar */}
      <div className="w-16 border-r border-border bg-card/50 backdrop-blur flex flex-col items-center py-4 gap-2">
        {brushes.map((brush) => {
          const Icon = brush.icon;
          return (
            <button
              key={brush.id}
              onClick={() => setActiveBrush(brush.id)}
              className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center transition-all",
                activeBrush === brush.id
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                  : "hover:bg-accent text-muted-foreground"
              )}
              title={brush.label}
            >
              <Icon className="w-5 h-5" />
            </button>
          );
        })}

        <div className="w-8 h-px bg-border my-2" />

        <button
          onClick={() => setShowWater(!showWater)}
          className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center transition-all",
            showWater ? "text-blue-500 bg-blue-500/10" : "text-muted-foreground hover:bg-accent"
          )}
          title="Toggle Water"
        >
          {showWater ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
        </button>
      </div>

      {/* 3D Viewport */}
      <div className="flex-1 relative"
003e
        <canvas
          ref={canvasRef}
          className="w-full h-full outline-none"
          onClick={handleCanvasClick}
          style={{ touchAction: 'none' }}
        />

        {/* Material Palette */}
        <GlassCard className="absolute top-4 left-4 p-3">
          <div className="text-xs font-medium text-muted-foreground uppercase mb-2">Materials</div>
          <div className="flex gap-2">
            {materials.map((mat) => (
              <button
                key={mat.id}
                onClick={() => setActiveMaterial(mat.id)}
                className={cn(
                  "w-10 h-10 rounded-lg border-2 transition-all",
                  activeMaterial === mat.id
                    ? "border-white scale-110 shadow-lg"
                    : "border-transparent hover:scale-105"
                )}
                style={{ backgroundColor: mat.color }}
                title={mat.name}
              />
            ))}
          </div>
        </GlassCard>

        {/* Brush Settings */}
        <GlassCard className="absolute bottom-4 left-4 p-4 w-64">
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Brush Size</span>
                <span className="text-muted-foreground">{brushSize}</span>
              </div>
              <input
                type="range"
                min="1"
                max="20"
                value={brushSize}
                onChange={(e) => setBrushSize(Number(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Strength</span>
                <span className="text-muted-foreground">{Math.round(brushStrength * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="2"
                step="0.1"
                value={brushStrength}
                onChange={(e) => setBrushStrength(Number(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Sea Level</span>
                <span className="text-muted-foreground">{seaLevel}</span>
              </div>
              <input
                type="range"
                min="-10"
                max="10"
                value={seaLevel}
                onChange={(e) => setSeaLevel(Number(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
        </GlassCard>

        {/* Stats */}
        <GlassCard className="absolute top-4 right-4 p-3">
          <div className="text-xs text-muted-foreground">
            <div>World Nodes: {worldNodes.length}</div>
            <div>Brush: {activeBrush}</div>
            <div>Material: {activeMaterial}</div>
          </div>
        </GlassCard>
      </div>

      {/* Properties Panel */}
      <div className="w-72 border-l border-border bg-card/50 backdrop-blur p-4">
        <h2 className="font-semibold mb-4">World Properties</h2>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1 block">World Name</label>
            <input
              type="text"
              defaultValue="My World"
              className="w-full px-3 py-2 bg-background border border-input rounded-lg"
            />
          </div>

          <div className="pt-4 border-t border-border">
            <div className="text-xs font-medium text-muted-foreground uppercase mb-3">Environment</div>
            
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm">Time of Day</span>
              <select className="bg-background border border-input rounded px-2 py-1 text-sm">
                <option>Morning</option>
                <option>Noon</option>
                <option>Evening</option>
                <option>Night</option>
              </select>
            </div>

            <div className="flex items-center justify-between mb-2">
              <span className="text-sm">Weather</span>
              <select className="bg-background border border-input rounded px-2 py-1 text-sm">
                <option>Clear</option>
                <option>Cloudy</option>
                <option>Rainy</option>
                <option>Stormy</option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-border">
            <div className="text-xs font-medium text-muted-foreground uppercase mb-3">Actions</div>
            
            <div className="space-y-2">
              <button className="w-full px-3 py-2 bg-accent rounded-lg text-sm hover:bg-accent/80 transition-colors">
                Generate Random Terrain
              </button>
              <button className="w-full px-3 py-2 bg-accent rounded-lg text-sm hover:bg-accent/80 transition-colors">
                Flatten All
              </button>
              <button className="w-full px-3 py-2 bg-destructive/10 text-destructive rounded-lg text-sm hover:bg-destructive/20 transition-colors">
                Clear Terrain
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}