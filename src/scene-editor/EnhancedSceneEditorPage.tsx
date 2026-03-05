import { useState, useRef, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, Pause, SkipBack, SkipForward, Repeat, Repeat1,
  ChevronLeft, ChevronRight, Plus, Trash2, Copy, 
  Video, Camera, Mic, Music, Type, Smile, Move,
  Settings, Layers, Film, Clock, Sparkles, Wand2,
  Split, Merge, ArrowRight
} from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { cn } from '../lib/utils';

// Animation easing types
const easingTypes = [
  { id: 'linear', name: 'Linear', icon: '➡️' },
  { id: 'ease-in', name: 'Ease In', icon: '📈' },
  { id: 'ease-out', name: 'Ease Out', icon: '📉' },
  { id: 'ease-in-out', name: 'Ease In-Out', icon: '📊' },
  { id: 'bounce', name: 'Bounce', icon: '⚡' },
  { id: 'elastic', name: 'Elastic', icon: '🌀' },
];

// Camera movement presets
const cameraPresets = [
  { id: 'pan-left', name: 'Pan Left', movement: { x: -100, y: 0, z: 0 } },
  { id: 'pan-right', name: 'Pan Right', movement: { x: 100, y: 0, z: 0 } },
  { id: 'zoom-in', name: 'Zoom In', movement: { zoom: 0.5 } },
  { id: 'zoom-out', name: 'Zoom Out', movement: { zoom: 2 } },
  { id: 'orbit-left', name: 'Orbit Left', rotation: { y: -45 } },
  { id: 'orbit-right', name: 'Orbit Right', rotation: { y: 45 } },
  { id: 'dutch-left', name: 'Dutch Left', rotation: { z: -15 } },
  { id: 'dutch-right', name: 'Dutch Right', rotation: { z: 15 } },
];

// Scene transition types
const transitions = [
  { id: 'cut', name: 'Cut', duration: 0 },
  { id: 'fade', name: 'Fade', duration: 1 },
  { id: 'dissolve', name: 'Dissolve', duration: 1.5 },
  { id: 'wipe-left', name: 'Wipe Left', duration: 1 },
  { id: 'wipe-right', name: 'Wipe Right', duration: 1 },
  { id: 'zoom-in', name: 'Zoom In', duration: 1.2 },
  { id: 'zoom-out', name: 'Zoom Out', duration: 1.2 },
];

interface Keyframe {
  id: string;
  time: number;
  duration: number;
  type: 'camera' | 'character' | 'dialogue' | 'effect' | 'transition';
  targetId: string;
  property: string;
  value: any;
  easing: string;
}

interface SceneCharacter {
  id: string;
  name: string;
  characterId: string;
  x: number;
  y: number;
  scale: number;
  rotation: number;
  pose: string;
  expression: string;
  outfit: string;
  visible: boolean;
}

interface DialogueLine {
  id: string;
  startTime: number;
  duration: number;
  characterId: string;
  text: string;
  emotion: string;
  style: 'normal' | 'shout' | 'whisper' | 'thought';
}

interface CameraPath {
  id: string;
  name: string;
  points: Array<{
    time: number;
    position: { x: number; y: number; z: number };
    rotation: { x: number; y: number; z: number };
    fov: number;
  }>;
}

export function EnhancedSceneEditorPage() {
  const { id } = useParams();
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(60);
  const [isPlaying, setIsPlaying] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [selectedTrack, setSelectedTrack] = useState<string | null>(null);
  const [selectedKeyframe, setSelectedKeyframe] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  
  const [keyframes, setKeyframes] = useState<Keyframe[]>([
    {
      id: '1',
      time: 0,
      duration: 2,
      type: 'camera',
      targetId: 'camera1',
      property: 'position',
      value: { x: 0, y: 0, z: -10 },
      easing: 'ease-in-out'
    },
    {
      id: '2',
      time: 5,
      duration: 1,
      type: 'character',
      targetId: 'char1',
      property: 'position',
      value: { x: 5, y: 0 },
      easing: 'ease-out'
    },
    {
      id: '3',
      time: 8,
      duration: 3,
      type: 'dialogue',
      targetId: 'char1',
      property: 'text',
      value: 'Hello! Welcome to the scene.',
      easing: 'linear'
    }
  ]);

  const [characters, setCharacters] = useState<SceneCharacter[]>([
    { id: 'char1', name: 'Hero', characterId: 'hero', x: 0, y: 0, scale: 1, rotation: 0, pose: 'idle', expression: 'happy', outfit: 'default', visible: true },
    { id: 'char2', name: 'Villain', characterId: 'villain', x: 5, y: 0, scale: 1, rotation: 180, pose: 'idle', expression: 'angry', outfit: 'evil', visible: true },
  ]);

  const [dialogues, setDialogues] = useState<DialogueLine[]>([
    { id: 'd1', startTime: 2, duration: 3, characterId: 'char1', text: 'This is the beginning of our story...', emotion: 'neutral', style: 'normal' },
    { id: 'd2', startTime: 6, duration: 2, characterId: 'char2', text: 'I will stop you!', emotion: 'angry', style: 'shout' },
  ]);

  const [cameraPaths, setCameraPaths] = useState<CameraPath[]>([
    { id: 'path1', name: 'Opening Shot', points: [
      { time: 0, position: { x: 0, y: 5, z: -15 }, rotation: { x: -20, y: 0, z: 0 }, fov: 60 },
      { time: 5, position: { x: 0, y: 2, z: -8 }, rotation: { x: -10, y: 0, z: 0 }, fov: 50 },
    ]},
  ]);

  const [activeTab, setActiveTab] = useState<'characters' | 'camera' | 'dialogue' | 'effects'>('characters');

  // Playback loop
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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 100);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
  };

  const addKeyframe = () => {
    const newKeyframe: Keyframe = {
      id: Date.now().toString(),
      time: currentTime,
      duration: 2,
      type: 'character',
      targetId: characters[0]?.id || '',
      property: 'position',
      value: { x: 0, y: 0 },
      easing: 'ease-in-out'
    };
    setKeyframes([...keyframes, newKeyframe]);
  };

  const deleteKeyframe = (id: string) => {
    setKeyframes(keyframes.filter(k => k.id !== id));
  };

  return (
    <div className="h-screen flex bg-gradient-to-br from-gray-900 via-purple-900 to-pink-900">
      {/* Left Panel - Tools */}
      <div className="w-16 border-r border-white/10 bg-black/20 backdrop-blur flex flex-col items-center py-4 gap-2">
        <button
          onClick={() => setActiveTab('characters')}
          className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center transition-colors",
            activeTab === 'characters' ? "bg-pink-500 text-white" : "hover:bg-white/10 text-white/70"
          )}
        >
          <Smile className="w-5 h-5" />
        </button>
        
        <button
          onClick={() => setActiveTab('camera')}
          className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center transition-colors",
            activeTab === 'camera' ? "bg-pink-500 text-white" : "hover:bg-white/10 text-white/70"
          )}
        >
          <Camera className="w-5 h-5" />
        </button>
        
        <button
          onClick={() => setActiveTab('dialogue')}
          className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center transition-colors",
            activeTab === 'dialogue' ? "bg-pink-500 text-white" : "hover:bg-white/10 text-white/70"
          )}
        >
          <Type className="w-5 h-5" />
        </button>
        
        <button
          onClick={() => setActiveTab('effects')}
          className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center transition-colors",
            activeTab === 'effects' ? "bg-pink-500 text-white" : "hover:bg-white/10 text-white/70"
          )}
        >
          <Sparkles className="w-5 h-5" />
        </button>
        
        <div className="flex-1" />
        
        <button
          onClick={() => setIsRecording(!isRecording)}
          className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center transition-colors",
            isRecording ? "bg-red-500 animate-pulse" : "hover:bg-white/10 text-white/70"
          )}
        >
          <Video className="w-5 h-5" />
        </button>
      </div>

      {/* Main Content */}
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
            
            <button onClick={() => setCurrentTime(0)} className="p-2 hover:bg-white/10 rounded text-white">
              <SkipBack className="w-4 h-4" />
            </button>
            
            <span className="text-white font-mono px-3">{formatTime(currentTime)} / {formatTime(duration)}</span>
            
            <button onClick={() => setCurrentTime(duration)} className="p-2 hover:bg-white/10 rounded text-white">
              <SkipForward className="w-4 h-4" />
            </button>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-black/30 rounded-lg px-2">
              <span className="text-white/70 text-sm">Zoom:</span>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-20"
              />
              <span className="text-white text-sm w-10">{Math.round(zoom * 100)}%</span>
            </div>
            
            <button onClick={addKeyframe} className="flex items-center gap-1 px-3 py-1.5 bg-pink-500 hover:bg-pink-600 text-white rounded-lg text-sm">
              <Plus className="w-4 h-4" />
              Add Keyframe
            </button>
          </div>
        </div>

        {/* Stage */}
        <div className="flex-1 relative overflow-hidden">
          {/* Character Stage */}
          <div className="absolute inset-0 flex items-center justify-center">
            <AnimatePresence>
              <{characters.map(char => (
                char.visible && (
                  <motion.div
                    key={char.id}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ 
                      opacity: 1, 
                      scale: char.scale,
                      x: char.x * 50,
                      y: char.y * 50,
                      rotate: char.rotation
                    }}
                    className="absolute"
                  >
                    <div className="w-32 h-48 bg-gradient-to-b from-violet-400 to-pink-400 rounded-xl flex items-center justify-center shadow-2xl">
                      <span className="text-6xl">{char.expression === 'happy' ? '😊' : char.expression === 'angry' ? '😠' : '😐'}</span>
                    </div>
                    <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-white text-sm font-medium whitespace-nowrap">
                      {char.name}
                    </div>
                  </motion.div>
                )
              ))}
            </AnimatePresence>
            
            {/* Dialogue Display */}
            <{dialogues.map(dial => {
              if (currentTime < dial.startTime || currentTime > dial.startTime + dial.duration) return null;
              const char = characters.find(c => c.id === dial.characterId);
              if (!char) return null;
              
              return (
                <motion.div
                  key={dial.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="absolute bottom-8 left-1/2 -translate-x-1/2 max-w-2xl"
                >
                  <GlassCard className="px-6 py-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-pink-400">{char.name}</span>
                      <span className="text-xs text-muted-foreground">({dial.style})</span>
                    </div>
                    <p className="text-lg">{dial.text}</p>
                  </GlassCard>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Timeline */}
        <div className="h-48 bg-black/40 backdrop-blur border-t border-white/10">
          <div className="h-full flex">
            {/* Track Headers */}
            <div className="w-48 border-r border-white/10 bg-black/20">
              <div className="h-8 border-b border-white/10 flex items-center px-3">
                <span className="text-xs font-medium text-white/70">TRACKS</span>
              </div>
              
              <div className="divide-y divide-white/5">
                <div className="h-10 flex items-center px-3 text-sm text-white/80">
                  <Camera className="w-4 h-4 mr-2" /> Camera
                </div>
                <{characters.map(char => (
                  <div key={char.id} className="h-10 flex items-center px-3 text-sm text-white/80">
                    <Smile className="w-4 h-4 mr-2" /> {char.name}
                  </div>
                ))}
                <div className="h-10 flex items-center px-3 text-sm text-white/80">
                  <Type className="w-4 h-4 mr-2" /> Dialogue
                </div>
              </div>
            </div>

            {/* Timeline Content */}
            <div className="flex-1 relative overflow-x-auto">
              <div style={{ width: `${duration * 20 * zoom}px` }}>
                {/* Ruler */}
                <div className="h-8 border-b border-white/10 flex">
                  <{Array.from({ length: Math.ceil(duration / 5) + 1 }, (_, i) => (
                    <div 
                      key={i}
                      className="absolute border-l border-white/20 pt-1 pl-1"
                      style={{ left: `${i * 5 * 20 * zoom}px` }}
                    >
                      <span className="text-xs text-white/50">{i * 5}s</span>
                    </div>
                  ))}
                </div>

                {/* Playhead */}
                <div 
                  className="absolute top-0 bottom-0 w-0.5 bg-pink-500 z-20"
                  style={{ left: `${currentTime * 20 * zoom}px` }}
                >
                  <div className="absolute -top-1 -left-1.5 w-3 h-3 bg-pink-500 rotate-45" />
                </div>

                {/* Keyframes */}
                <div className="relative h-full">
                  {/* Camera track */}
                  <div className="h-10 border-b border-white/5 relative">
                    <{keyframes
                      .filter(k => k.type === 'camera')
                      .map(kf => (
                        <div
                          key={kf.id}
                          onClick={() => setSelectedKeyframe(kf.id)}
                          className={cn(
                            "absolute top-2 h-6 rounded flex items-center px-2 cursor-pointer text-xs",
                            selectedKeyframe === kf.id
                              ? "bg-pink-500 text-white"
                              : "bg-blue-500/50 text-white/80 hover:bg-blue-500"
                          )}
                          style={{
                            left: `${kf.time * 20 * zoom}px`,
                            width: `${kf.duration * 20 * zoom}px`
                          }}
                        >
                          🎥 {kf.property}
                        </div>
                      ))}
                  </div>

                  {/* Character tracks */}
                  <{characters.map(char => (
                    <div key={char.id} className="h-10 border-b border-white/5 relative">
                      <{keyframes
                        .filter(k => k.type === 'character' && k.targetId === char.id)
                        .map(kf => (
                          <div
                            key={kf.id}
                            onClick={() => setSelectedKeyframe(kf.id)}
                            className={cn(
                              "absolute top-2 h-6 rounded flex items-center px-2 cursor-pointer text-xs",
                              selectedKeyframe === kf.id
                                ? "bg-pink-500 text-white"
                                : "bg-green-500/50 text-white/80 hover:bg-green-500"
                            )}
                            style={{
                              left: `${kf.time * 20 * zoom}px`,
                              width: `${kf.duration * 20 * zoom}px`
                            }}
                          >
                            👤 {kf.property}
                          </div>
                        ))}
                    </div>
                  ))}

                  {/* Dialogue track */}
                  <div className="h-10 border-b border-white/5 relative">
                    <{dialogues.map(dial => (
                      <div
                        key={dial.id}
                        className="absolute top-2 h-6 rounded flex items-center px-2 bg-yellow-500/50 text-white/80 text-xs cursor-pointer hover:bg-yellow-500"
                        style={{
                          left: `${dial.startTime * 20 * zoom}px`,
                          width: `${dial.duration * 20 * zoom}px`
                        }}
                      >
                        💬 {dial.text.slice(0, 20)}...
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
