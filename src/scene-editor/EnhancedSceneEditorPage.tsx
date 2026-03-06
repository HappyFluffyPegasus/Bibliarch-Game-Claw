import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Play, Pause, SkipBack, SkipForward,
  Camera, Smile, Type, Sparkles,
  Plus, Trash2, Music
} from 'lucide-react';
import { cn } from '../lib/utils';

const easingTypes = [
  { id: 'linear', name: 'Linear' },
  { id: 'ease-in', name: 'Ease In' },
  { id: 'ease-out', name: 'Ease Out' },
  { id: 'bounce', name: 'Bounce' },
];

const cameraPresets = [
  { id: 'pan-left', name: 'Pan Left' },
  { id: 'pan-right', name: 'Pan Right' },
  { id: 'zoom-in', name: 'Zoom In' },
  { id: 'zoom-out', name: 'Zoom Out' },
];

interface Keyframe {
  id: string;
  time: number;
  duration: number;
  type: 'camera' | 'character' | 'dialogue';
  targetId: string;
  property: string;
}

export function EnhancedSceneEditorPage() {
  const { id } = useParams();
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(60);
  const [isPlaying, setIsPlaying] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [selectedKeyframe, setSelectedKeyframe] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'characters' | 'camera' | 'dialogue'>('characters');
  const [keyframes, setKeyframes] = useState<Keyframe[]>([
    { id: '1', time: 0, duration: 2, type: 'camera', targetId: 'cam1', property: 'position' },
    { id: '2', time: 5, duration: 1, type: 'character', targetId: 'char1', property: 'position' },
    { id: '3', time: 8, duration: 3, type: 'dialogue', targetId: 'char1', property: 'text' },
  ]);

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

  return (
    <div className="h-screen flex bg-gradient-to-br from-gray-900 via-purple-900 to-pink-900">
      <div className="w-16 border-r border-white/10 bg-black/20 flex flex-col items-center py-4 gap-2">
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
        <div className="flex-1" />
        <button className="w-12 h-12 rounded-xl hover:bg-white/10 text-white/70 flex items-center justify-center">
          <Sparkles className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 flex flex-col">
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
            
            <button className="flex items-center gap-1 px-3 py-1.5 bg-pink-500 hover:bg-pink-600 text-white rounded-lg text-sm">
              <Plus className="w-4 h-4" />
              Add Keyframe
            </button>
          </div>
        </div>

        <div className="flex-1 relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-48 bg-gradient-to-b from-violet-400 to-pink-400 rounded-xl flex items-center justify-center shadow-2xl">
              <span className="text-6xl">😊</span>
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute bottom-8 left-1/2 -translate-x-1/2"
            >
              <div className="bg-white/10 backdrop-blur rounded-lg px-6 py-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-pink-400">Hero</span>
                </div>
                <p className="text-white text-lg">Hello! Welcome to the scene.</p>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="h-48 bg-black/40 border-t border-white/10">
          <div className="h-full flex">
            <div className="w-48 border-r border-white/10 bg-black/20">
              <div className="h-8 border-b border-white/10 flex items-center px-3">
                <span className="text-xs font-medium text-white/70">TRACKS</span>
              </div>
              
              <div className="divide-y divide-white/5">
                <div className="h-10 flex items-center px-3 text-sm text-white/80">
                  <Camera className="w-4 h-4 mr-2" /> Camera
                </div>
                <div className="h-10 flex items-center px-3 text-sm text-white/80">
                  <Smile className="w-4 h-4 mr-2" /> Hero
                </div>
                <div className="h-10 flex items-center px-3 text-sm text-white/80">
                  <Type className="w-4 h-4 mr-2" /> Dialogue
                </div>
              </div>
            </div>

            <div className="flex-1 relative overflow-x-auto">
              <div style={{ width: `${duration * 20 * zoom}px` }}>
                <div className="h-8 border-b border-white/10 flex relative">
                  {Array.from({ length: Math.ceil(duration / 5) + 1 }, (_, i) => (
                    <div 
                      key={i}
                      className="absolute border-l border-white/20 pt-1 pl-1"
                      style={{ left: `${i * 5 * 20 * zoom}px` }}
                    >
                      <span className="text-xs text-white/50">{i * 5}s</span>
                    </div>
                  ))}
                </div>

                <div 
                  className="absolute top-0 bottom-0 w-0.5 bg-pink-500 z-20"
                  style={{ left: `${currentTime * 20 * zoom}px` }}
                >
                  <div className="absolute -top-1 -left-1.5 w-3 h-3 bg-pink-500 rotate-45" />
                </div>

                <div className="relative h-full">
                  <div className="h-10 border-b border-white/5 relative">
                    {keyframes
                      .filter(k => k.type === 'camera')
                      .map(kf => (
                        <div
                          key={kf.id}
                          onClick={() => setSelectedKeyframe(kf.id)}
                          className={cn(
                            "absolute top-2 h-6 rounded flex items-center px-2 cursor-pointer text-xs",
                            selectedKeyframe === kf.id
                              ? "bg-pink-500 text-white"
                              : "bg-blue-500/50 text-white/80"
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

                  <div className="h-10 border-b border-white/5 relative">
                    {keyframes
                      .filter(k => k.type === 'character')
                      .map(kf => (
                        <div
                          key={kf.id}
                          onClick={() => setSelectedKeyframe(kf.id)}
                          className={cn(
                            "absolute top-2 h-6 rounded flex items-center px-2 cursor-pointer text-xs",
                            selectedKeyframe === kf.id
                              ? "bg-pink-500 text-white"
                              : "bg-green-500/50 text-white/80"
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

                  <div className="h-10 border-b border-white/5 relative">
                    {keyframes
                      .filter(k => k.type === 'dialogue')
                      .map(kf => (
                        <div
                          key={kf.id}
                          className="absolute top-2 h-6 rounded flex items-center px-2 bg-yellow-500/50 text-white/80 text-xs cursor-pointer"
                          style={{
                            left: `${kf.time * 20 * zoom}px`,
                            width: `${kf.duration * 20 * zoom}px`
                          }}
                        >
                          💬 dialogue
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
