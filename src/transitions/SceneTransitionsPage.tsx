import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wand2, Sparkles, Maximize, Minimize, Move,
  RotateCw, FlipHorizontal, FlipVertical, Grid3X3,
  Play, Pause, Settings, ChevronRight
} from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { cn } from '../lib/utils';

// Transition types for scene changes
type TransitionType = 
  | 'fade' | 'dissolve' | 'wipe-left' | 'wipe-right' 
  | 'wipe-up' | 'wipe-down' | 'slide-left' | 'slide-right'
  | 'zoom-in' | 'zoom-out' | 'rotate' | 'flip-horizontal'
  | 'flip-vertical' | 'pixelate' | 'blur' | 'flash'
  | 'curtain-left' | 'curtain-right' | 'heart' | 'star';

interface Transition {
  id: string;
  name: string;
  type: TransitionType;
  duration: number;
  easing: string;
  direction?: 'in' | 'out' | 'both';
}

const transitionPresets: Transition[] = [
  { id: 'fade', name: 'Fade', type: 'fade', duration: 0.5, easing: 'easeInOut' },
  { id: 'dissolve', name: 'Dissolve', type: 'dissolve', duration: 0.8, easing: 'easeInOut' },
  { id: 'wipe-left', name: 'Wipe Left', type: 'wipe-left', duration: 0.6, easing: 'easeInOut' },
  { id: 'wipe-right', name: 'Wipe Right', type: 'wipe-right', duration: 0.6, easing: 'easeInOut' },
  { id: 'slide-left', name: 'Slide Left', type: 'slide-left', duration: 0.5, easing: 'easeOut' },
  { id: 'slide-right', name: 'Slide Right', type: 'slide-right', duration: 0.5, easing: 'easeOut' },
  { id: 'zoom-in', name: 'Zoom In', type: 'zoom-in', duration: 0.7, easing: 'easeInOut' },
  { id: 'zoom-out', name: 'Zoom Out', type: 'zoom-out', duration: 0.7, easing: 'easeInOut' },
  { id: 'rotate', name: 'Rotate', type: 'rotate', duration: 0.8, easing: 'easeInOut' },
  { id: 'flip-h', name: 'Flip Horizontal', type: 'flip-horizontal', duration: 0.6, easing: 'easeInOut' },
  { id: 'pixelate', name: 'Pixelate', type: 'pixelate', duration: 1.0, easing: 'linear' },
  { id: 'blur', name: 'Blur', type: 'blur', duration: 0.5, easing: 'easeInOut' },
  { id: 'flash', name: 'Flash', type: 'flash', duration: 0.3, easing: 'easeOut' },
  { id: 'curtain-left', name: 'Curtain Left', type: 'curtain-left', duration: 0.8, easing: 'easeInOut' },
  { id: 'heart', name: 'Heart Wipe', type: 'heart', duration: 0.7, easing: 'easeInOut' },
  { id: 'star', name: 'Star Wipe', type: 'star', duration: 0.7, easing: 'easeInOut' },
];

const getTransitionVariants = (type: TransitionType) => {
  const base = {
    initial: {},
    animate: {},
    exit: {}
  };

  switch (type) {
    case 'fade':
      return {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 }
      };
    
    case 'slide-left':
      return {
        initial: { x: '100%', opacity: 0 },
        animate: { x: 0, opacity: 1 },
        exit: { x: '-100%', opacity: 0 }
      };
    
    case 'slide-right':
      return {
        initial: { x: '-100%', opacity: 0 },
        animate: { x: 0, opacity: 1 },
        exit: { x: '100%', opacity: 0 }
      };
    
    case 'zoom-in':
      return {
        initial: { scale: 0.5, opacity: 0 },
        animate: { scale: 1, opacity: 1 },
        exit: { scale: 1.5, opacity: 0 }
      };
    
    case 'zoom-out':
      return {
        initial: { scale: 1.5, opacity: 0 },
        animate: { scale: 1, opacity: 1 },
        exit: { scale: 0.5, opacity: 0 }
      };
    
    case 'rotate':
      return {
        initial: { rotate: -180, opacity: 0 },
        animate: { rotate: 0, opacity: 1 },
        exit: { rotate: 180, opacity: 0 }
      };
    
    case 'flip-horizontal':
      return {
        initial: { rotateY: 90, opacity: 0 },
        animate: { rotateY: 0, opacity: 1 },
        exit: { rotateY: -90, opacity: 0 }
      };
    
    case 'blur':
      return {
        initial: { filter: 'blur(20px)', opacity: 0 },
        animate: { filter: 'blur(0px)', opacity: 1 },
        exit: { filter: 'blur(20px)', opacity: 0 }
      };
    
    default:
      return base;
  }
};

interface SceneTransitionPreviewProps {
  transition: Transition;
  onPlay: () => void;
  isPlaying: boolean;
}

function SceneTransitionPreview({ transition, onPlay, isPlaying }: SceneTransitionPreviewProps) {
  const [showScene, setShowScene] = useState(true);
  const variants = getTransitionVariants(transition.type);

  useEffect(() => {
    if (isPlaying) {
      setShowScene(false);
      const timer = setTimeout(() => {
        setShowScene(true);
      }, transition.duration * 500);
      return () => clearTimeout(timer);
    }
  }, [isPlaying, transition.duration]);

  return (
    <div 
      className="relative w-full h-48 bg-muted rounded-xl overflow-hidden cursor-pointer"
      onClick={onPlay}
    >
      <AnimatePresence mode="wait">
        {showScene ? (
          <motion.div
            key="scene1"
            initial={variants.initial}
            animate={variants.animate}
            exit={variants.exit}
            transition={{ duration: transition.duration, ease: transition.easing }}
            className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center"
          >
            <span className="text-4xl">🎬</span>
          </motion.div>
        ) : (
          <motion.div
            key="scene2"
            initial={variants.initial}
            animate={variants.animate}
            exit={variants.exit}
            transition={{ duration: transition.duration, ease: transition.easing }}
            className="absolute inset-0 bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center"
          >
            <span className="text-4xl">🎭</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute bottom-2 right-2">
        <div className="w-8 h-8 bg-black/50 rounded-full flex items-center justify-center">
          {isPlaying ? <Pause className="w-4 h-4 text-white" /> : <Play className="w-4 h-4 text-white" />}
        </div>
      </div>
    </div>
  );
}

export function SceneTransitionsPage() {
  const [selectedTransition, setSelectedTransition] = useState<string>('fade');
  const [playingTransition, setPlayingTransition] = useState<string | null>(null);
  const [customDuration, setCustomDuration] = useState(0.5);

  const currentTransition = transitionPresets.find(t => t.id === selectedTransition);

  const handlePlay = (id: string) => {
    setPlayingTransition(id);
    const transition = transitionPresets.find(t => t.id === id);
    if (transition) {
      setTimeout(() => {
        setPlayingTransition(null);
      }, transition.duration * 1000 + 500);
    }
  };

  return (
    <div className="h-screen flex bg-background">
      <div className="w-64 border-r border-border bg-card/50 flex flex-col">
        <div className="p-4 border-b border-border">
          <h2 className="font-semibold">Transitions</h2>
          <p className="text-sm text-muted-foreground">{transitionPresets.length} presets</p>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          <div className="space-y-1">
            {transitionPresets.map(transition => (
              <button
                key={transition.id}
                onClick={() => setSelectedTransition(transition.id)}
                className={cn(
                  "w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all",
                  selectedTransition === transition.id
                    ? "bg-primary/10 text-primary"
                    : "hover:bg-accent"
                )}
              >
                <Wand2 className="w-4 h-4" />
                <span className="flex-1 text-sm">{transition.name}</span>
                <span className="text-xs text-muted-foreground">{transition.duration}s</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Scene Transitions</h1>
          <p className="text-muted-foreground mb-8">Cinematic transitions between scenes</p>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {transitionPresets.map(transition => (
              <GlassCard 
                key={transition.id}
                className={cn(
                  "p-4 cursor-pointer transition-all",
                  selectedTransition === transition.id && "ring-2 ring-primary"
                )}
                onClick={() => setSelectedTransition(transition.id)}
              >
                <SceneTransitionPreview
                  transition={transition}
                  onPlay={() => handlePlay(transition.id)}
                  isPlaying={playingTransition === transition.id}
                />
                
                <div className="mt-3 flex items-center justify-between">
                  <span className="font-medium">{transition.name}</span>
                  <span className="text-xs text-muted-foreground">{transition.duration}s</span>
                </div>
              </GlassCard>
            ))}
          </div>

          {currentTransition && (
            <GlassCard className="mt-8 p-6">
              <h3 className="font-semibold mb-4">Customize Transition</h3>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">Duration</label>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min="0.1"
                      max="2"
                      step="0.1"
                      value={customDuration}
                      onChange={(e) => setCustomDuration(Number(e.target.value))}
                      className="flex-1"
                    />
                    <span className="text-sm w-12">{customDuration}s</span>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Easing</label>
                  <select className="w-full px-3 py-2 bg-background border border-input rounded-lg">
                    <option>easeInOut</option>
                    <option>easeIn</option>
                    <option>easeOut</option>
                    <option>linear</option>
                  </select>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button className="flex-1 flex items-center justify-center gap-2 p-3 bg-primary text-primary-foreground rounded-xl font-medium">
                  <Sparkles className="w-4 h-4" />
                  Apply to Project
                </button>
                
                <button className="flex items-center justify-center gap-2 p-3 border border-border rounded-xl hover:bg-accent">
                  <Settings className="w-4 h-4" />
                </button>
              </div>
            </GlassCard>
          )}
        </div>
      </div>
    </div>
  );
}
