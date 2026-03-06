import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, ChevronRight, Plus, Trash2, Copy, FlipHorizontal,
  Maximize2, Minimize2, Move, Layers, Type, Image as ImageIcon,
  Sparkles, Download, Play, Grid3X3, Settings
} from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { cn } from '../lib/utils';

interface SceneCharacter {
  id: string;
  characterId: string;
  name: string;
  x: number;
  y: number;
  scale: number;
  rotation: number;
  layer: number;
  flipX: boolean;
  emoji: string;
  pose: string;
}

interface SpeechBubble {
  id: string;
  characterId: string;
  text: string;
  x: number;
  y: number;
  style: 'round' | 'square' | 'thought';
  tailPosition: 'left' | 'right' | 'bottom';
  color: string;
}

interface Scene {
  id: string;
  number: number;
  background: string;
  characters: SceneCharacter[];
  bubbles: SpeechBubble[];
  effects: string[];
  transition: string;
}

const samplePoses = [
  { id: 'idle', name: 'Idle', emoji: '🧍' },
  { id: 'happy', name: 'Happy', emoji: '😊' },
  { id: 'sad', name: 'Sad', emoji: '😢' },
  { id: 'angry', name: 'Angry', emoji: '😠' },
  { id: 'surprised', name: 'Surprised', emoji: '😲' },
  { id: 'wave', name: 'Waving', emoji: '👋' },
  { id: 'sit', name: 'Sitting', emoji: '🪑' },
  { id: 'run', name: 'Running', emoji: '🏃' },
  { id: 'fight', name: 'Fighting', emoji: '🥊' },
  { id: 'sleep', name: 'Sleeping', emoji: '😴' },
  { id: 'eat', name: 'Eating', emoji: '🍽️' },
  { id: 'read', name: 'Reading', emoji: '📖' },
];

const backgrounds = [
  { id: 'forest', name: 'Forest', emoji: '🌲' },
  { id: 'city', name: 'City', emoji: '🏙️' },
  { id: 'room', name: 'Room', emoji: '🏠' },
  { id: 'beach', name: 'Beach', emoji: '🏖️' },
  { id: 'castle', name: 'Castle', emoji: '🏰' },
  { id: 'space', name: 'Space', emoji: '🚀' },
];

const sampleCharacters = [
  { id: 'char1', name: 'Hero', emoji: '🧙‍♂️' },
  { id: 'char2', name: 'Villain', emoji: '🦹' },
  { id: 'char3', name: 'Princess', emoji: '👸' },
  { id: 'char4', name: 'Knight', emoji: '⚔️' },
];

export function GachaSceneEditorPage() {
  const [scenes, setScenes] = useState<Scene[]>([
    {
      id: '1',
      number: 1,
      background: 'forest',
      characters: [
        { id: 'c1', characterId: 'char1', name: 'Hero', x: 30, y: 60, scale: 1, rotation: 0, layer: 0, flipX: false, emoji: '🧙‍♂️', pose: 'idle' },
      ],
      bubbles: [],
      effects: [],
      transition: 'fade',
    },
  ]);
  
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null);
  const [selectedBubble, setSelectedBubble] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showGrid, setShowGrid] = useState(true);
  const [activeTool, setActiveTool] = useState<'move' | 'bubble' | 'scale'>('move');
  
  const canvasRef = useRef<HTMLDivElement>(null);

  const currentScene = scenes[currentSceneIndex];

  const addScene = () => {
    const newScene: Scene = {
      id: Date.now().toString(),
      number: scenes.length + 1,
      background: 'room',
      characters: [],
      bubbles: [],
      effects: [],
      transition: 'fade',
    };
    setScenes([...scenes, newScene]);
    setCurrentSceneIndex(scenes.length);
  };

  const addCharacter = (characterId: string) => {
    const char = sampleCharacters.find(c => c.id === characterId);
    if (!char) return;
    
    const newChar: SceneCharacter = {
      id: Date.now().toString(),
      characterId,
      name: char.name,
      x: 50,
      y: 60,
      scale: 1,
      rotation: 0,
      layer: currentScene.characters.length,
      flipX: false,
      emoji: char.emoji,
      pose: 'idle',
    };
    
    const updatedScenes = [...scenes];
    updatedScenes[currentSceneIndex].characters.push(newChar);
    setScenes(updatedScenes);
    setSelectedCharacter(newChar.id);
  };

  const addBubble = (characterId: string) => {
    const char = currentScene.characters.find(c => c.id === characterId);
    if (!char) return;
    
    const newBubble: SpeechBubble = {
      id: Date.now().toString(),
      characterId,
      text: 'Hello!',
      x: char.x + 10,
      y: char.y - 20,
      style: 'round',
      tailPosition: 'bottom',
      color: '#ffffff',
    };
    
    const updatedScenes = [...scenes];
    updatedScenes[currentSceneIndex].bubbles.push(newBubble);
    setScenes(updatedScenes);
    setSelectedBubble(newBubble.id);
  };

  const updateCharacter = (charId: string, updates: Partial<SceneCharacter>) => {
    const updatedScenes = [...scenes];
    const charIndex = updatedScenes[currentSceneIndex].characters.findIndex(c => c.id === charId);
    if (charIndex >= 0) {
      updatedScenes[currentSceneIndex].characters[charIndex] = {
        ...updatedScenes[currentSceneIndex].characters[charIndex],
        ...updates,
      };
      setScenes(updatedScenes);
    }
  };

  const updateBubble = (bubbleId: string, updates: Partial<SpeechBubble>) => {
    const updatedScenes = [...scenes];
    const bubbleIndex = updatedScenes[currentSceneIndex].bubbles.findIndex(b => b.id === bubbleId);
    if (bubbleIndex >= 0) {
      updatedScenes[currentSceneIndex].bubbles[bubbleIndex] = {
        ...updatedScenes[currentSceneIndex].bubbles[bubbleIndex],
        ...updates,
      };
      setScenes(updatedScenes);
    }
  };

  const deleteCharacter = (charId: string) => {
    const updatedScenes = [...scenes];
    updatedScenes[currentSceneIndex].characters = updatedScenes[currentSceneIndex].characters.filter(c => c.id !== charId);
    updatedScenes[currentSceneIndex].bubbles = updatedScenes[currentSceneIndex].bubbles.filter(b => b.characterId !== charId);
    setScenes(updatedScenes);
    setSelectedCharacter(null);
  };

  const moveLayer = (charId: string, direction: 'up' | 'down') => {
    const updatedScenes = [...scenes];
    const chars = updatedScenes[currentSceneIndex].characters;
    const charIndex = chars.findIndex(c => c.id === charId);
    
    if (charIndex < 0) return;
    
    if (direction === 'up' && charIndex < chars.length - 1) {
      [chars[charIndex], chars[charIndex + 1]] = [chars[charIndex + 1], chars[charIndex]];
    } else if (direction === 'down' && charIndex > 0) {
      [chars[charIndex], chars[charIndex - 1]] = [chars[charIndex - 1], chars[charIndex]];
    }
    
    // Update layer numbers
    chars.forEach((c, i) => c.layer = i);
    setScenes(updatedScenes);
  };

  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    if (activeTool !== 'move') return;
    
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    // Check if clicked on character
    const clickedChar = currentScene.characters.find(c => {
      const dx = c.x - x;
      const dy = c.y - y;
      return Math.sqrt(dx * dx + dy * dy) < 10;
    });
    
    if (clickedChar) {
      setSelectedCharacter(clickedChar.id);
      setIsDragging(true);
    } else {
      setSelectedCharacter(null);
    }
  };

  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !selectedCharacter) return;
    
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    updateCharacter(selectedCharacter, { x, y });
  };

  const handleCanvasMouseUp = () => {
    setIsDragging(false);
  };

  const selectedCharData = currentScene.characters.find(c => c.id === selectedCharacter);
  const selectedBubbleData = currentScene.bubbles.find(b => b.id === selectedBubble);

  return (
    <div className="h-screen flex bg-background">
      {/* Left Sidebar - Characters & Poses */}
      <div className="w-72 border-r border-border bg-card/50 flex flex-col">
        <div className="p-4 border-b border-border">
          <h2 className="font-semibold flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Characters
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto p-3">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Add Character</h3>
          
          <div className="grid grid-cols-2 gap-2 mb-4">
            {sampleCharacters.map(char => (
              <button
                key={char.id}
                onClick={() => addCharacter(char.id)}
                className="p-3 bg-muted rounded-xl hover:bg-accent transition-colors"
              >
                <span className="text-3xl">{char.emoji}</span>
                <p className="text-xs mt-1">{char.name}</p>
              </button>
            ))}
          </div>

          <h3 className="text-sm font-medium text-muted-foreground mb-2">Poses</h3>
          
          <div className="grid grid-cols-3 gap-2">
            {samplePoses.map(pose => (
              <button
                key={pose.id}
                onClick={() => selectedCharData && updateCharacter(selectedCharacter!, { pose: pose.id })}
                disabled={!selectedCharData}
                className={cn(
                  "p-2 rounded-lg text-center transition-colors",
                  selectedCharData?.pose === pose.id
                    ? "bg-primary/20 text-primary"
                    : "bg-muted hover:bg-accent",
                  !selectedCharData && "opacity-50 cursor-not-allowed"
                )}
              >
                <span className="text-xl">{pose.emoji}</span>
                <p className="text-[10px] mt-1">{pose.name}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-card/50">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentSceneIndex(Math.max(0, currentSceneIndex - 1))}
              disabled={currentSceneIndex === 0}
              className="p-2 hover:bg-accent rounded-lg disabled:opacity-50"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <div className="px-4 py-2 bg-muted rounded-lg">
              <span className="font-medium">Scene {currentSceneIndex + 1} / {scenes.length}</span>
            </div>
            
            <button
              onClick={() => setCurrentSceneIndex(Math.min(scenes.length - 1, currentSceneIndex + 1))}
              disabled={currentSceneIndex === scenes.length - 1}
              className="p-2 hover:bg-accent rounded-lg disabled:opacity-50"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            <button
              onClick={addScene}
              className="ml-2 flex items-center gap-1 px-3 py-2 bg-primary text-primary-foreground rounded-lg"
            >
              <Plus className="w-4 h-4" />
              New Scene
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowGrid(!showGrid)}
              className={cn(
                "p-2 rounded-lg",
                showGrid ? "bg-primary/20 text-primary" : "hover:bg-accent"
              )}
            >
              <Grid3X3 className="w-5 h-5" />
            </button>
            
            <select
              value={currentScene.background}
              onChange={(e) => {
                const updated = [...scenes];
                updated[currentSceneIndex].background = e.target.value;
                setScenes(updated);
              }}
              className="px-3 py-2 bg-background border border-input rounded-lg"
            >
              {backgrounds.map(bg => (
                <option key={bg.id} value={bg.id}>{bg.emoji} {bg.name}</option>
              ))}
            </select>

            <button
              onClick={() => selectedCharData && addBubble(selectedCharacter!)}
              disabled={!selectedCharData}
              className="flex items-center gap-1 px-3 py-2 bg-muted rounded-lg hover:bg-accent disabled:opacity-50"
            >
              <Type className="w-4 h-4" />
              Add Speech
            </button>
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 p-6 bg-muted overflow-hidden">
          <div 
            ref={canvasRef}
            className="relative w-full h-full bg-gradient-to-b from-sky-200 to-sky-400 rounded-xl overflow-hidden cursor-move"
            onMouseDown={handleCanvasMouseDown}
            onMouseMove={handleCanvasMouseMove}
            onMouseUp={handleCanvasMouseUp}
            onMouseLeave={handleCanvasMouseUp}
          >
            {/* Grid */}
            {showGrid && (
              <div 
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: `
                    linear-gradient(to right, #000 1px, transparent 1px),
                    linear-gradient(to bottom, #000 1px, transparent 1px)
                  `,
                  backgroundSize: '10% 10%'
                }}
              />
            )}

            {/* Characters (sorted by layer) */}
            {[...currentScene.characters].sort((a, b) => a.layer - b.layer).map(char => (
              <motion.div
                key={char.id}
                drag
                dragMomentum={false}
                onDragEnd={(_, info) => {
                  const rect = canvasRef.current?.getBoundingClientRect();
                  if (rect) {
                    const x = ((info.point.x - rect.left) / rect.width) * 100;
                    const y = ((info.point.y - rect.top) / rect.height) * 100;
                    updateCharacter(char.id, { x, y });
                  }
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedCharacter(char.id);
                }}
                className={cn(
                  "absolute cursor-pointer transition-shadow",
                  selectedCharacter === char.id && "z-50"
                )}
                style={{
                  left: `${char.x}%`,
                  top: `${char.y}%`,
                  transform: `translate(-50%, -50%) scale(${char.scale}) ${char.flipX ? 'scaleX(-1)' : ''} rotate(${char.rotation}deg)`,
                  zIndex: char.layer,
                }}
              >
                <div className={cn(
                  "relative",
                  selectedCharacter === char.id && "ring-2 ring-primary ring-offset-2 rounded-full"
                )}>
                  <span className="text-6xl filter drop-shadow-lg">{char.emoji}</span>
                  
                  <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap">
                    <span className="px-2 py-1 bg-black/50 text-white text-xs rounded">{char.name}</span>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Speech Bubbles */}
            {currentScene.bubbles.map(bubble => (
              <motion.div
                key={bubble.id}
                drag
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedBubble(bubble.id);
                }}
                className={cn(
                  "absolute cursor-pointer",
                  selectedBubble === bubble.id && "z-50"
                )}
                style={{
                  left: `${bubble.x}%`,
                  top: `${bubble.y}%`,
                }}
              >
                <div className={cn(
                  "relative px-4 py-2 rounded-xl shadow-lg max-w-xs",
                  bubble.style === 'round' && "rounded-3xl",
                  bubble.style === 'thought' && "rounded-full",
                  selectedBubble === bubble.id && "ring-2 ring-primary"
                )}
                style={{ backgroundColor: bubble.color }}
>
                  <p className="text-sm">{bubble.text}</p>
                  
                  {/* Tail */}
                  <div 
                    className={cn(
                      "absolute w-4 h-4 rotate-45",
                      bubble.tailPosition === 'bottom' && "-bottom-2 left-1/2 -translate-x-1/2",
                      bubble.tailPosition === 'left' && "-left-2 top-1/2 -translate-y-1/2",
                      bubble.tailPosition === 'right' && "-right-2 top-1/2 -translate-y-1/2"
                    )}
                    style={{ backgroundColor: bubble.color }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Properties */}
      {(selectedCharData || selectedBubbleData) && (
        <motion.div
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 300, opacity: 0 }}
          className="w-72 border-l border-border bg-card/50 flex flex-col"
        >
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h3 className="font-semibold">Properties</h3>
            <button 
              onClick={() => {
                setSelectedCharacter(null);
                setSelectedBubble(null);
              }}
              className="p-2 hover:bg-accent rounded-lg"
            >
              ×
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {selectedCharData && (
              <>
                <div className="text-center">
                  <span className="text-6xl">{selectedCharData.emoji}</span>
                  <p className="font-medium mt-2">{selectedCharData.name}</p>
                </div>

                <div>
                  <label className="text-sm text-muted-foreground">Scale</label>
                  <input
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={selectedCharData.scale}
                    onChange={(e) => updateCharacter(selectedCharData.id, { scale: Number(e.target.value) })}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="text-sm text-muted-foreground">Rotation</label>
                  <input
                    type="range"
                    min="-180"
                    max="180"
                    step="15"
                    value={selectedCharData.rotation}
                    onChange={(e) => updateCharacter(selectedCharData.id, { rotation: Number(e.target.value) })}
                    className="w-full"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => updateCharacter(selectedCharData.id, { flipX: !selectedCharData.flipX })}
                    className={cn(
                      "flex-1 py-2 rounded-lg border-2",
                      selectedCharData.flipX ? "border-primary bg-primary/10" : "border-border"
                    )}
>
                    <FlipHorizontal className="w-4 h-4 mx-auto" />
                    Flip
                  </button>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => moveLayer(selectedCharData.id, 'down')}
                    disabled={selectedCharData.layer === 0}
                    className="flex-1 py-2 bg-muted rounded-lg disabled:opacity-50"
                  >
                    Back
                  </button>
                  
                  <button
                    onClick={() => moveLayer(selectedCharData.id, 'up')}
                    disabled={selectedCharData.layer === currentScene.characters.length - 1}
                    className="flex-1 py-2 bg-muted rounded-lg disabled:opacity-50"
                  >
                    Front
                  </button>
                </div>

                <button
                  onClick={() => deleteCharacter(selectedCharData.id)}
                  className="w-full py-2 text-destructive hover:bg-destructive/10 rounded-lg"
>
                  Delete Character
                </button>
              </>
            )}

            {selectedBubbleData && (
              <>
                <div>
                  <label className="text-sm text-muted-foreground">Text</label>
                  <textarea
                    value={selectedBubbleData.text}
                    onChange={(e) => updateBubble(selectedBubbleData.id, { text: e.target.value })}
                    className="w-full h-24 p-2 bg-muted rounded-lg resize-none"
                  />
                </div>

                <div>
                  <label className="text-sm text-muted-foreground">Style</label>
                  <select
                    value={selectedBubbleData.style}
                    onChange={(e) => updateBubble(selectedBubbleData.id, { style: e.target.value as any })}
                    className="w-full p-2 bg-muted rounded-lg"
>
                    <option value="round">Round</option>
                    <option value="square">Square</option>
                    <option value="thought">Thought</option>
                  </select>
                </div>
              </>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
