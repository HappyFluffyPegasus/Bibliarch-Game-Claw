import { useEffect, useRef, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useStoryStore } from '../stores/storyStore';
import { Engine, Scene, ArcRotateCamera, Vector3, HemisphericLight, DirectionalLight, MeshBuilder, StandardMaterial, Color3, Mesh, TransformNode, Animation, AnimationGroup, PointerEventTypes, Axis, Space, Tools } from '@babylonjs/core';
import { GlassCard } from '../components/GlassCard';
import { cn } from '../lib/utils';
import { 
  Video, Play, Pause, SkipBack, SkipForward, 
  Camera, Users, Box, Sun, Moon,
  ChevronLeft, ChevronRight
} from 'lucide-react';

// Lighting presets
const lightingPresets = [
  { id: 'day', name: 'Day', skyColor: '#87CEEB', lightIntensity: 1 },
  { id: 'sunset', name: 'Sunset', skyColor: '#FF6B35', lightIntensity: 0.7 },
  { id: 'night', name: 'Night', skyColor: '#0B1026', lightIntensity: 0.3 },
  { id: 'studio', name: 'Studio', skyColor: '#2D3748', lightIntensity: 0.9 },
];

// Camera presets
const cameraPresets = [
  { id: 'wide', name: 'Wide', alpha: -Math.PI/2, beta: Math.PI/2.5, radius: 20 },
  { id: 'medium', name: 'Medium', alpha: -Math.PI/2, beta: Math.PI/2.8, radius: 12 },
  { id: 'close', name: 'Close-Up', alpha: -Math.PI/2, beta: Math.PI/3, radius: 6 },
  { id: 'overhead', name: 'Overhead', alpha: -Math.PI/2, beta: 0.1, radius: 25 },
];

export function SceneEditorPage() {
  const { id } = useParams();
  const { currentStory, characters, scenes, loadStory, createCharacter } = useStoryStore();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<Engine | null>(null);
  const sceneRef = useRef<Scene | null>(null);
  const cameraRef = useRef<ArcRotateCamera | null>(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(10);
  const [activeLight, setActiveLight] = useState('day');
  const [activeCamera, setActiveCamera] = useState('medium');
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null);
  const [placedCharacters, setPlacedCharacters] = useState<Array<{ id: string; name: string; x: number; y: number; z: number }>>([]);

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
    
    // Set sky color based on lighting preset
    const preset = lightingPresets.find(p => p.id === activeLight);
    if (preset) {
      const color = Color3.FromHexString(preset.skyColor);
      scene.clearColor = new Color4(color.r, color.g, color.b, 1);
    }

    // Camera
    const cameraPreset = cameraPresets.find(p => p.id === activeCamera);
    const camera = new ArcRotateCamera(
      'camera',
      cameraPreset?.alpha || -Math.PI/2,
      cameraPreset?.beta || Math.PI/2.8,
      cameraPreset?.radius || 12,
      Vector3.Zero(),
      scene
    );
    camera.attachControl(canvas, true);
    camera.wheelPrecision = 50;
    camera.lowerRadiusLimit = 3;
    camera.upperRadiusLimit = 50;
    cameraRef.current = camera;

    // Lighting
    const hemiLight = new HemisphericLight('hemi', new Vector3(0, 1, 0), scene);
    hemiLight.intensity = preset?.lightIntensity || 1;
    
    const dirLight = new DirectionalLight('dir', new Vector3(-1, -2, -1), scene);
    dirLight.position = new Vector3(10, 20, 10);
    dirLight.intensity = preset?.lightIntensity || 1;

    // Ground
    const ground = MeshBuilder.CreateGround('ground', { width: 50, height: 50 }, scene);
    const groundMat = new StandardMaterial('groundMat', scene);
    groundMat.diffuseColor = new Color3(0.2, 0.3, 0.2);
    ground.material = groundMat;

    // Grid
    const gridMat = new StandardMaterial('gridMat', scene);
    gridMat.wireframe = true;
    gridMat.diffuseColor = new Color3(0.5, 0.5, 0.5);
    gridMat.alpha = 0.3;
    const grid = MeshBuilder.CreateGround('grid', { width: 50, height: 50, subdivisions: 50 }, scene);
    grid.position.y = 0.01;
    grid.material = gridMat;

    // Click to place character
    scene.onPointerObservable.add((pointerInfo) => {
      if (pointerInfo.type === PointerEventTypes.POINTERDOWN && selectedCharacter) {
        const pickResult = scene.pick(scene.pointerX, scene.pointerY);
        if (pickResult.hit && pickResult.pickedPoint) {
          placeCharacterInScene(selectedCharacter, pickResult.pickedPoint);
        }
      }
    });

    // Render loop
    engine.runRenderLoop(() => {
      scene.render();
      
      // Update current time when playing
      if (isPlaying) {
        setCurrentTime(t => {
          const newTime = t + engine.getDeltaTime() / 1000;
          if (newTime >= duration) {
            setIsPlaying(false);
            return duration;
          }
          return newTime;
        });
      }
    });

    const handleResize = () => engine.resize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      scene.dispose();
      engine.dispose();
    };
  }, [activeLight, activeCamera]);

  const placeCharacterInScene = (characterId: string, position: Vector3) => {
    const character = characters.find(c => c.id === characterId);
    if (!character || !sceneRef.current) return;

    // Create placeholder mesh for character
    const mesh = MeshBuilder.CreateCylinder(
      `char-${characterId}`,
      { height: 1.8, diameter: 0.5 },
      sceneRef.current
    );
    mesh.position = position;
    mesh.position.y = 0.9;

    const mat = new StandardMaterial(`mat-${characterId}`, sceneRef.current);
    mat.diffuseColor = new Color3(Math.random(), Math.random(), Math.random());
    mesh.material = mat;

    setPlacedCharacters(prev => [...prev, {
      id: characterId,
      name: character.name,
      x: position.x,
      y: position.y,
      z: position.z
    }]);
    setSelectedCharacter(null);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 100);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
  };

  if (!currentStory) return <div className="p-8">Loading...</div>;

  return (
    <div className="h-screen flex bg-background">
      {/* Character Panel */}
      <div className="w-64 border-r border-border bg-card/50 backdrop-blur flex flex-col">
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-4 h-4 text-violet-500" />
            <span className="font-semibold">Characters</span>
          </div>
          <p className="text-xs text-muted-foreground">Click to place in scene</p>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {characters.map((char) => (
            <button
              key={char.id}
              onClick={() => setSelectedCharacter(selectedCharacter === char.id ? null : char.id)}
              className={cn(
                "w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all mb-1",
                selectedCharacter === char.id
                  ? "bg-violet-500/20 border border-violet-500/50"
                  : "hover:bg-accent"
              )}
            >
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center text-white font-bold">
                {char.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{char.name}</div>
                <div className="text-xs text-muted-foreground">Click to place</div>
              </div>
            </button>
          ))}
        </div>

        {placedCharacters.length > 0 && (
          <>
            <div className="border-t border-border p-4">
              <div className="text-xs font-medium text-muted-foreground uppercase mb-2">In Scene</div>
              <div className="space-y-1">
                {placedCharacters.map((char) => (
                  <div key={char.id} className="flex items-center gap-2 text-sm p-2 bg-accent/50 rounded-lg">
                    <span className="truncate">{char.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Main Viewport */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-card/50 backdrop-blur">
          <div className="flex items-center gap-4">
            {/* Playback Controls */}
            <div className="flex items-center gap-1">
              <button 
                onClick={() => setCurrentTime(0)}
                className="p-2 hover:bg-accent rounded-lg"
              >
                <SkipBack className="w-4 h-4" />
              </button>
              
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-10 h-10 flex items-center justify-center bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
              
              <button 
                onClick={() => setCurrentTime(duration)}
                className="p-2 hover:bg-accent rounded-lg"
              >
                <SkipForward className="w-4 h-4" />
              </button>
            </div>

            <div className="w-px h-6 bg-border" />

            {/* Time Display */}
            <div className="font-mono text-lg">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Lighting Presets */}
            <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
              {lightingPresets.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => setActiveLight(preset.id)}
                  className={cn(
                    "px-3 py-1.5 rounded-md text-sm transition-all",
                    activeLight === preset.id
                      ? "bg-card shadow-sm"
                      : "hover:bg-accent"
                  )}
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 3D Viewport */}
        <div className="flex-1 relative">
          <canvas
            ref={canvasRef}
            className={cn(
              "w-full h-full outline-none",
              selectedCharacter && "cursor-crosshair"
            )}
            style={{ touchAction: 'none' }}
          />

          {/* Camera Presets */}
          <GlassCard className="absolute top-4 left-4 p-2">
            <div className="flex items-center gap-1">
              <Camera className="w-4 h-4 text-muted-foreground mr-2" />
              {cameraPresets.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => setActiveCamera(preset.id)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-sm transition-all",
                    activeCamera === preset.id
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-accent"
                  )}
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </GlassCard>

          {/* Scene Info */}
          <GlassCard className="absolute bottom-4 left-4 p-3">
            <div className="text-sm">
              <div className="text-muted-foreground">Characters: {placedCharacters.length}</div>
              <div className="text-muted-foreground">Light: {activeLight}</div>
            </div>
          </GlassCard>

          {selectedCharacter && (
            <GlassCard className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-4">
              <p className="text-lg font-medium">Click anywhere to place character</p>
              <button
                onClick={() => setSelectedCharacter(null)}
                className="mt-2 px-4 py-2 bg-accent rounded-lg text-sm hover:bg-accent/80"
              >
                Cancel
              </button>
            </GlassCard>
          )}
        </div>

        {/* Timeline */}
        <div className="h-32 border-t border-border bg-card/50 backdrop-blur p-4">
          <div className="text-xs font-medium text-muted-foreground uppercase mb-2">Timeline</div>
          
          <div className="relative h-16 bg-muted rounded-lg overflow-hidden">
            {/* Time ruler */}
            <div className="absolute inset-x-0 top-0 h-6 flex items-end">
              {Array.from({ length: 11 }, (_, i) => (
                <div key={i} className="flex-1 border-l border-border/50 h-2" />
              ))}
            </div>

            {/* Playhead */}
            <div 
              className="absolute top-0 bottom-0 w-0.5 bg-primary z-10"
              style={{ left: `${(currentTime / duration) * 100}%` }}
            >
              <div className="absolute -top-1 -translate-x-1/2 w-3 h-3 bg-primary rotate-45" />
            </div>

            {/* Tracks */}
            <div className="absolute inset-0 top-6">
              <div className="h-6 bg-violet-500/20 border-y border-violet-500/30 flex items-center px-2">
                <Camera className="w-3 h-3 mr-2 text-violet-500" />
                <span className="text-xs">Camera</span>
              </div>
              
              {placedCharacters.map((char, i) => (
                <div 
                  key={char.id}
                  className="h-5 bg-blue-500/20 border-y border-blue-500/30 flex items-center px-2 mt-1"
                  style={{ marginLeft: `${(i * 10) % 30}%`, width: '40%' }}
                >
                  <span className="text-xs truncate">{char.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Properties Panel */}
      <div className="w-72 border-l border-border bg-card/50 backdrop-blur p-4">
        <h2 className="font-semibold mb-4">Scene Properties</h2>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Scene Name</label>
            <input
              type="text"
              defaultValue="Scene 1"
              className="w-full px-3 py-2 bg-background border border-input rounded-lg"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Duration (seconds)</label>
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              min="1"
              max="300"
              className="w-full px-3 py-2 bg-background border border-input rounded-lg"
            />
          </div>

          <div className="pt-4 border-t border-border">
            <div className="text-xs font-medium text-muted-foreground uppercase mb-3">Export</div>
            
            <button className="w-full px-3 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-violet-500/25 transition-all">
              <Video className="w-4 h-4 inline mr-2" />
              Export Video
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}