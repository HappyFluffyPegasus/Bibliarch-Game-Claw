import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Camera, Film, Plus, Trash2, Play, Pause, SkipBack, SkipForward,
  Type, Smile, Move, Clock, ChevronLeft, ChevronRight,
  Copy, Scissors, Music, Mic
} from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { cn } from '../lib/utils';

// Gacha Life inspired pose presets
const posePresets = [
  { id: 'idle', name: 'Idle', icon: '👤' },
  { id: 'wave', name: 'Wave', icon: '👋' },
  { id: 'sit', name: 'Sit', icon: '🪑' },
  { id: 'run', name: 'Run', icon: '🏃' },
  { id: 'jump', name: 'Jump', icon: '⬆️' },
  { id: 'dance', name: 'Dance', icon: '💃' },
  { id: 'think', name: 'Think', icon: '🤔' },
  { id: 'laugh', name: 'Laugh', icon: '😄' },
  { id: 'cry', name: 'Cry', icon: '😢' },
  { id: 'angry', name: 'Angry', icon: '😠' },
  { id: 'surprised', name: 'Surprised', icon: '😲' },
  { id: 'sleep', name: 'Sleep', icon: '😴' },
];

// Facial expression presets
const expressionPresets = [
  { id: 'neutral', name: 'Neutral', eyes: '◉ ◉', mouth: '―' },
  { id: 'happy', name: 'Happy', eyes: '◠ ◠', mouth: '◡' },
  { id: 'sad', name: 'Sad', eyes: '◡ ◡', mouth: '◠' },
  { id: 'angry', name: 'Angry', eyes: '◣ ◢', mouth: '◣' },
  { id: 'surprised', name: 'Surprised', eyes: '◎ ◎', mouth: '○' },
  { id: 'wink', name: 'Wink', eyes: '◉ ~', mouth: '◡' },
];

interface SceneCharacter {
  id: string;
  characterId: string;
  name: string;
  x: number;
  y: number;
  scale: number;
  pose: string;
  expression: string;
  outfit: string;
  flip: boolean;
}

interface Keyframe {
  id: string;
  time: number; // seconds
  characterId: string;
  property: 'position' | 'pose' | 'expression' | 'scale' | 'flip';
  value: any;
  easing: 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out';
}

interface DialogueLine {
  id: string;
  startTime: number;
  duration: number;
  characterId: string;
  text: string;
  style: 'subtitle' | 'bubble' | 'thought';
}

export function GachaSceneEditor() {
  const [characters, setCharacters] = useState<SceneCharacter[]>([
    { id: '1', characterId: 'char1', name: 'Alex', x: 30, y: 50, scale: 1, pose: 'idle', expression: 'neutral', outfit: 'default', flip: false },
  ]);
  
  const [keyframes, setKeyframes] = useState<Keyframe[]>([]);
  const [dialogues, setDialogues] = useState<DialogueLine[]>([]);
  const [selectedChar, setSelectedChar] = useState<string | null>('1');
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(30);
  const [isPlaying, setIsPlaying] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [showSubtitles, setShowSubtitles] = useState(true);

  // Animation loop
  useEffect(() => {
    if (!isPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentTime(t => {
        if (t >= duration) {
          setIsPlaying(false);
          return duration;
        }
        return t + 0.1;
      });
    }, 100);
    
    return () => clearInterval(interval);
  }, [isPlaying, duration]);

  const addCharacter = () => {
    const newChar: SceneCharacter = {
      id: Date.now().toString(),
      characterId: `char${characters.length + 1}`,
      name: `Character ${characters.length + 1}`,
      x: 50,
      y: 50,
      scale: 1,
      pose: 'idle',
      expression: 'neutral',
      outfit: 'default',
      flip: false,
    };
    setCharacters([...characters, newChar]);
  };

  const updateCharacter = (id: string, updates: Partial<SceneCharacter>) => {
    setCharacters(chars => chars.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const selectedCharacter = characters.find(c => c.id === selectedChar);

  return (
    <div className="h-screen flex bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      {/* Left Panel - Character List */}
      <div className="w-64 bg-black/20 backdrop-blur border-r border-white/10 flex flex-col">
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center gap-2 mb-3">
            <Film className="w-5 h-5 text-pink-400" />
            <span className="font-semibold text-white">Scene Editor</span>
          </div>
          
          <button
            onClick={addCharacter}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-xl font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Character
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {characters.map((char) => (
            <button
              key={char.id}
              onClick={() => setSelectedChar(char.id)}
              className={cn(
                "w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all",
                selectedChar === char.id
                  ? "bg-white/20 ring-2 ring-pink-400"
                  : "bg-white/5 hover:bg-white/10"
              )}
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-white font-bold"
>
                {char.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-white truncate">{char.name}</div>
                <div className="text-xs text-white/50">
                  {posePresets.find(p => p.id === char.pose)?.name} • {char.expression}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Center - Stage/Canvas */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-4 py-3 bg-black/20 backdrop-blur border-b border-white/10">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-10 h-10 flex items-center justify-center bg-pink-500 hover:bg-pink-600 text-white rounded-full transition-colors"
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </button>
            
            <div className="flex items-center gap-1 bg-black/30 rounded-lg p-1">
              <button 
                onClick={() => setCurrentTime(0)}
                className="p-2 hover:bg-white/10 rounded"
              >
                <SkipBack className="w-4 h-4 text-white" />
              </button>
              
              <span className="text-white font-mono px-3">
                {Math.floor(currentTime / 60)}:{String(Math.floor(currentTime % 60)).padStart(2, '0')}
              </span>
              <button 
                onClick={() => setCurrentTime(duration)}
                className="p-2 hover:bg-white/10 rounded"
              >
                <SkipForward className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowSubtitles(!showSubtitles)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors",
                showSubtitles ? "bg-pink-500 text-white" : "bg-white/10 text-white/70"
              )}
            >
              <Type className="w-4 h-4" />
              Subtitles
            </button>
            
            <div className="flex items-center gap-1 bg-black/30 rounded-lg px-3 py-1.5">
              <span className="text-white/70 text-sm">Zoom:</span>
              <input
                type="range"
                min="50"
                max="150"
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-20"
              />
              <span className="text-white text-sm w-10">{zoom}%</span>
            </div>
          </div>
        </div>

        {/* Stage */}
        <div className="flex-1 relative overflow-hidden"
        
          style={{ 
            backgroundImage: 'url(/backgrounds/stage-default.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          {/* Characters on Stage */}
          <AnimatePresence>
            {characters.map((char) => (
              <motion.div
                key={char.id}
                drag
                dragMomentum={false}
                onDragEnd={(_, info) => {
                  updateCharacter(char.id, {
                    x: char.x + (info.offset.x / zoom * 100),
                    y: char.y + (info.offset.y / zoom * 100),
                  });
                }}
                onClick={() => setSelectedChar(char.id)}
                initial={{ scale: 0 }}
                animate={{ 
                  scale: char.scale * (zoom / 100),
                  x: `${char.x}%`,
                  y: `${char.y}%`,
                  rotateY: char.flip ? 180 : 0,
                }}
                className={cn(
                  "absolute cursor-move",
                  selectedChar === char.id && "z-10"
                )}
                style={{
                  transform: `translate(-50%, -50%)`,
                }}
              >
                <div className="relative">
                  {/* Selection ring */}
                  {selectedChar === char.id && (
                    <div className="absolute -inset-4 border-2 border-pink-400 rounded-xl" />
                  )}
                  
                  {/* Character placeholder */}
                  <div className="w-32 h-48 bg-gradient-to-b from-violet-400 to-pink-400 rounded-xl flex items-center justify-center shadow-2xl">
                    <span className="text-6xl">{posePresets.find(p => p.id === char.pose)?.icon}</span>
                  </div>
                  
                  {/* Name tag */}
                  <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-3 py-1 bg-black/70 text-white text-xs rounded-full whitespace-nowrap">
                    {char.name}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Subtitles */}
           {showSubtitles && dialogues.map((dialogue) => (
            currentTime >= dialogue.startTime && currentTime <= dialogue.startTime + dialogue.duration && (
              <motion.div
                key={dialogue.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 max-w-2xl"
              >
                <GlassCard className="px-6 py-3 text-center">
                  <p className="text-lg">{dialogue.text}</p>
                </GlassCard>
              </motion.div>
            )
          ))}
        </div>

        {/* Timeline - CapCut style */}
        <div className="h-40 bg-black/40 backdrop-blur border-t border-white/10">
          <div className="h-full flex">
            {/* Timeline ruler */}
            <div className="flex-1 relative overflow-x-auto">
              <div className="absolute top-0 left-0 right-0 h-6 flex">
                {Array.from({ length: Math.ceil(duration / 5) + 1 }, (_, i) => (
                  <div key={i} className="flex-shrink-0 w-20 border-l border-white/20 pt-1">
                    <span className="text-xs text-white/50">{i * 5}s</span>
                  </div>
                ))}
              </div>

              {/* Playhead */}
              <div 
                className="absolute top-0 bottom-0 w-0.5 bg-pink-500 z-20"
                style={{ left: `${(currentTime / duration) * 100}%` }}
              >
                <div className="absolute -top-1 -left-1.5 w-3 h-3 bg-pink-500 rotate-45" />
              </div>

              {/* Tracks */}
              <div className="absolute top-8 bottom-0 left-0 right-0">
                {/* Character tracks */}
                 {characters.map((char, index) => (
                  <div 
                    key={char.id}
                    className="h-8 bg-white/5 border-b border-white/10 flex items-center px-2"
                  >
                    <span className="text-xs text-white/70 w-20 truncate">{char.name}</span>
                    
                    <div className="flex-1 relative h-6 bg-black/30 rounded">
                      {/* Keyframe markers would go here */}
                    </div>
                  </div>
                ))}

                {/* Dialogue track */}
                <div className="h-8 bg-pink-500/10 border-b border-white/10 flex items-center px-2">
                  <span className="text-xs text-pink-400 w-20">Dialogue</span>
                  
                  <div className="flex-1 relative h-6">
                     {dialogues.map((d) => (
                      <div
                        key={d.id}
                        className="absolute top-0 h-full bg-pink-500 rounded px-2 flex items-center"
                        style={{
                          left: `${(d.startTime / duration) * 100}%`,
                          width: `${(d.duration / duration) * 100}%`,
                        }}
                      >
                        <span className="text-xs text-white truncate">{d.text.slice(0, 20)}...</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Properties */}
       {selectedCharacter && (
        <motion.div
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="w-80 bg-black/20 backdrop-blur border-l border-white/10 p-4 overflow-y-auto"
        >
          <h3 className="font-semibold text-white mb-4">{selectedCharacter.name}</h3>

          {/* Pose Selection */}
          <div className="mb-6">
            <div className="text-xs text-white/50 uppercase tracking-wider mb-2">Pose</div>
            <div className="grid grid-cols-4 gap-2">
               {posePresets.map((pose) => (
                <button
                  key={pose.id}
                  onClick={() => updateCharacter(selectedCharacter.id, { pose: pose.id })}
                  className={cn(
                    "p-2 rounded-lg text-center transition-colors",
                    selectedCharacter.pose === pose.id
                      ? "bg-pink-500 text-white"
                      : "bg-white/10 hover:bg-white/20"
                  )}
                >
                  <div className="text-2xl mb-1">{pose.icon}</div>
                  <div className="text-[10px]">{pose.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Expression */}
          <div className="mb-6">
            <div className="text-xs text-white/50 uppercase tracking-wider mb-2">Expression</div>
            <div className="grid grid-cols-3 gap-2">
               {expressionPresets.map((expr) => (
                <button
                  key={expr.id}
                  onClick={() => updateCharacter(selectedCharacter.id, { expression: expr.id })}
                  className={cn(
                    "p-3 rounded-lg text-center transition-colors",
                    selectedCharacter.expression === expr.id
                      ? "bg-pink-500 text-white"
                      : "bg-white/10 hover:bg-white/20"
                  )}
                >
                  <div className="text-lg mb-1 font-mono">{expr.eyes}</div>
                  <div className="text-[10px]">{expr.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Position */}
          <div className="mb-6">
            <div className="text-xs text-white/50 uppercase tracking-wider mb-2">Position</div>
            
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-white/50">X</label>
                <input
                  type="number"
                  value={Math.round(selectedCharacter.x)}
                  onChange={(e) => updateCharacter(selectedCharacter.id, { x: Number(e.target.value) })}
                  className="w-full px-2 py-1 bg-white/10 rounded text-white"
                />
              </div>
              
              <div>
                <label className="text-xs text-white/50">Y</label>
                <input
                  type="number"
                  value={Math.round(selectedCharacter.y)}
                  onChange={(e) => updateCharacter(selectedCharacter.id, { y: Number(e.target.value) })}
                  className="w-full px-2 py-1 bg-white/10 rounded text-white"
                />
              </div>
            </div>
          </div>

          {/* Scale */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-white/50 uppercase tracking-wider">Scale</span>
              <span className="text-xs text-white">{selectedCharacter.scale.toFixed(1)}x</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={selectedCharacter.scale}
              onChange={(e) => updateCharacter(selectedCharacter.id, { scale: Number(e.target.value) })}
              className="w-full"
            />
          </div>

          {/* Flip */}
          <button
            onClick={() => updateCharacter(selectedCharacter.id, { flip: !selectedCharacter.flip })}
            className={cn(
              "w-full py-2 rounded-lg transition-colors",
              selectedCharacter.flip
                ? "bg-pink-500 text-white"
                : "bg-white/10 text-white hover:bg-white/20"
            )}
          >
            Flip Horizontal
          </button>
        </motion.div>
      )}
    </div>
  );
}
