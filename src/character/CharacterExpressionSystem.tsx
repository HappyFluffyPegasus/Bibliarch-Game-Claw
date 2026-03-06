import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Smile, Frown, Angry, Laugh, Meh,
  Heart, Eye, EyeOff, Zap, Skull, Crown,
  Palette, RotateCw, FlipHorizontal, Download
} from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { cn } from '../lib/utils';

// Expression definitions with 3D transforms
interface Expression {
  id: string;
  name: string;
  icon: string;
  eyeOpenness: number; // 0-1
  mouthCurve: number; // -1 to 1 (frown to smile)
  mouthOpenness: number; // 0-1
  browTilt: number; // -1 to 1 (sad to angry)
  cheekTint: string; // rgba color
  eyeTint?: string;
}

const expressions: Expression[] = [
  {
    id: 'neutral',
    name: 'Neutral',
    icon: '😐',
    eyeOpenness: 1,
    mouthCurve: 0,
    mouthOpenness: 0,
    browTilt: 0,
    cheekTint: 'rgba(255,200,200,0)',
  },
  {
    id: 'happy',
    name: 'Happy',
    icon: '😊',
    eyeOpenness: 0.8,
    mouthCurve: 1,
    mouthOpenness: 0.3,
    browTilt: 0.2,
    cheekTint: 'rgba(255,150,150,0.4)',
  },
  {
    id: 'laughing',
    name: 'Laughing',
    icon: '😂',
    eyeOpenness: 0.2,
    mouthCurve: 1,
    mouthOpenness: 0.8,
    browTilt: 0.3,
    cheekTint: 'rgba(255,150,150,0.5)',
  },
  {
    id: 'sad',
    name: 'Sad',
    icon: '😢',
    eyeOpenness: 0.7,
    mouthCurve: -0.8,
    mouthOpenness: 0.4,
    browTilt: -0.5,
    cheekTint: 'rgba(200,200,255,0.2)',
  },
  {
    id: 'angry',
    name: 'Angry',
    icon: '😠',
    eyeOpenness: 0.9,
    mouthCurve: -0.3,
    mouthOpenness: 0.2,
    browTilt: 0.8,
    cheekTint: 'rgba(255,100,100,0.3)',
    eyeTint: 'rgba(255,0,0,0.2)',
  },
  {
    id: 'surprised',
    name: 'Surprised',
    icon: '😲',
    eyeOpenness: 1.2,
    mouthCurve: 0,
    mouthOpenness: 0.9,
    browTilt: -0.8,
    cheekTint: 'rgba(255,200,200,0.3)',
  },
  {
    id: 'love',
    name: 'In Love',
    icon: '😍',
    eyeOpenness: 0.9,
    mouthCurve: 0.8,
    mouthOpenness: 0.4,
    browTilt: 0.1,
    cheekTint: 'rgba(255,150,150,0.6)',
    eyeTint: 'rgba(255,100,150,0.3)',
  },
  {
    id: 'wink',
    name: 'Wink',
    icon: '😉',
    eyeOpenness: 1,
    mouthCurve: 0.5,
    mouthOpenness: 0.2,
    browTilt: 0.3,
    cheekTint: 'rgba(255,150,150,0.3)',
  },
  {
    id: 'confused',
    name: 'Confused',
    icon: '🤔',
    eyeOpenness: 0.9,
    mouthCurve: -0.2,
    mouthOpenness: 0.3,
    browTilt: -0.3,
    cheekTint: 'rgba(255,255,200,0.2)',
  },
  {
    id: 'cool',
    name: 'Cool',
    icon: '😎',
    eyeOpenness: 0.6,
    mouthCurve: 0.3,
    mouthOpenness: 0.2,
    browTilt: 0.1,
    cheekTint: 'rgba(200,200,200,0.1)',
  },
  {
    id: 'sleepy',
    name: 'Sleepy',
    icon: '😴',
    eyeOpenness: 0.3,
    mouthCurve: 0,
    mouthOpenness: 0.1,
    browTilt: 0,
    cheekTint: 'rgba(200,200,255,0.2)',
  },
  {
    id: 'shocked',
    name: 'Shocked',
    icon: '😱',
    eyeOpenness: 1.3,
    mouthCurve: -0.5,
    mouthOpenness: 1,
    browTilt: -1,
    cheekTint: 'rgba(255,255,255,0.5)',
  },
];

interface Character3DPreviewProps {
  characterEmoji?: string;
  expression?: Expression;
  rotation?: number;
  scale?: number;
}

export function CharacterExpressionSystem() {
  const [selectedExpression, setSelectedExpression] = useState<Expression>(expressions[0]);
  const [characterEmoji, setCharacterEmoji] = useState('🧙‍♂️');
  const [rotation, setRotation] = useState(0);
  const [scale, setScale] = useState(1);
  const [autoRotate, setAutoRotate] = useState(false);

  // Auto-rotation
  useEffect(() => {
    if (!autoRotate) return;
    const interval = setInterval(() => {
      setRotation(r => (r + 1) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, [autoRotate]);

  const characterPresets = [
    { emoji: '🧙‍♂️', name: 'Wizard' },
    { emoji: '👸', name: 'Princess' },
    { emoji: '🦸', name: 'Hero' },
    { emoji: '🦹', name: 'Villain' },
    { emoji: '🧝‍♀️', name: 'Elf' },
    { emoji: '🧛', name: 'Vampire' },
    { emoji: '🧟‍♂️', name: 'Zombie' },
    { emoji: '👽', name: 'Alien' },
    { emoji: '🤖', name: 'Robot' },
    { emoji: '🐉', name: 'Dragon' },
  ];

  return (
    <div className="h-screen flex bg-background">
      {/* Left Sidebar - Expressions */}
      <div className="w-80 border-r border-border bg-card/50 flex flex-col">
        <div className="p-4 border-b border-border">
          <h2 className="font-semibold flex items-center gap-2">
            <Smile className="w-5 h-5" />
            Expression System
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <h3 className="text-sm font-medium text-muted-foreground mb-3">Expressions</h3>
          
          <div className="grid grid-cols-3 gap-2">
            {expressions.map(expr => (
              <button
                key={expr.id}
                onClick={() => setSelectedExpression(expr)}
                className={cn(
                  "p-3 rounded-xl border-2 transition-all text-center",
                  selectedExpression.id === expr.id
                    ? "border-primary bg-primary/10"
                    : "border-transparent bg-muted hover:border-primary/30"
                )}
              >
                <span className="text-3xl">{expr.icon}</span>
                <p className="text-xs mt-1">{expr.name}</p>
              </button>
            ))}
          </div>

          <h3 className="text-sm font-medium text-muted-foreground mb-3 mt-6">Characters</h3>
          
          <div className="grid grid-cols-5 gap-2">
            {characterPresets.map(char => (
              <button
                key={char.emoji}
                onClick={() => setCharacterEmoji(char.emoji)}
                className={cn(
                  "p-2 rounded-lg text-center transition-colors",
                  characterEmoji === char.emoji ? "bg-primary/20" : "bg-muted hover:bg-accent"
                )}
              >
                <span className="text-2xl">{char.emoji}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Preview Area */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-card/50">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setAutoRotate(!autoRotate)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg",
                autoRotate ? "bg-primary/20 text-primary" : "bg-muted hover:bg-accent"
              )}
            >
              <RotateCw className={cn("w-4 h-4", autoRotate && "animate-spin")} />
              {autoRotate ? 'Stop' : 'Auto Rotate'}
            </button>

            <div className="flex items-center gap-2">
              <span className="text-sm">Rotation:</span>
              <input
                type="range"
                min="0"
                max="360"
                value={rotation}
                onChange={(e) => setRotation(Number(e.target.value))}
                className="w-32"
              />
              <span className="text-sm w-10">{rotation}°</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <span className="text-sm">Scale:</span>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={scale}
                onChange={(e) => setScale(Number(e.target.value))}
                className="w-24"
              />
            </div>

            <button className="p-2 bg-primary text-primary-foreground rounded-lg">
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 3D Preview Canvas */}
        <div className="flex-1 flex items-center justify-center bg-gradient-to-b from-sky-100 to-sky-200 p-8">
          <div 
            className="relative w-96 h-96"
            style={{
              perspective: '1000px',
            }}
          >
            {/* 3D Character Container */}
            <motion.div
              className="w-full h-full flex items-center justify-center"
              style={{
                transform: `rotateY(${rotation}deg) scale(${scale})`,
                transformStyle: 'preserve-3d',
              }}
              transition={{ type: 'spring', stiffness: 100 }}
            >
              {/* Character Shadow */}
              <div 
                className="absolute bottom-0 w-32 h-8 bg-black/20 rounded-full blur-xl"
                style={{
                  transform: 'rotateX(90deg) translateZ(-150px)',
                }}
              />

              {/* Character Body */}
              <div className="relative">
                {/* Main Character Emoji */}
                <div 
                  className="text-[200px] filter drop-shadow-2xl transition-all duration-300"
                  style={{
                    transform: `translateZ(50px)`,
                  }}
                >
                  {characterEmoji}
                </div>

                {/* Expression Overlay */}
                <div 
                  className="absolute inset-0 flex items-center justify-center pointer-events-none"
                  style={{
                    transform: `translateZ(60px)`,
                  }}
                >
                  {/* Cheek tint */}
                  <div 
                    className="absolute w-full h-full rounded-full"
                    style={{
                      background: `radial-gradient(circle at 30% 60%, ${selectedExpression.cheekTint} 0%, transparent 50%),
                                   radial-gradient(circle at 70% 60%, ${selectedExpression.cheekTint} 0%, transparent 50%)`,
                    }}
                  />
                </div>

                {/* Expression Label */}
                <div 
                  className="absolute -bottom-16 left-1/2 -translate-x-1/2 whitespace-nowrap"
                >
                  <GlassCard className="px-4 py-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{selectedExpression.icon}</span>
                      <div>
                        <p className="font-medium">{selectedExpression.name}</p>
                        <p className="text-xs text-muted-foreground">Click to apply</p>
                      </div>
                    </div>
                  </GlassCard>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Expression Details */}
        <div className="p-6 border-t border-border bg-card/50">
          <div className="max-w-4xl mx-auto">
            <h3 className="font-semibold mb-4">Expression Parameters</h3>
            
            <div className="grid grid-cols-4 gap-4">
              <GlassCard className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Eye className="w-4 h-4" />
                  <span className="text-sm font-medium">Eye Openness</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all"
                    style={{ width: `${(selectedExpression.eyeOpenness / 1.5) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground">{Math.round(selectedExpression.eyeOpenness * 100)}%</span>
              </GlassCard>

              <GlassCard className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Smile className="w-4 h-4" />
                  <span className="text-sm font-medium">Mouth Curve</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all"
                    style={{ 
                      width: `${Math.abs(selectedExpression.mouthCurve) * 100}%`,
                      marginLeft: selectedExpression.mouthCurve < 0 ? 'auto' : 0,
                      marginRight: selectedExpression.mouthCurve >= 0 ? 'auto' : 0,
                      backgroundColor: selectedExpression.mouthCurve > 0 ? '#22c55e' : '#ef4444'
                    }}
                  />
                </div>
                <span className="text-xs text-muted-foreground">{selectedExpression.mouthCurve > 0 ? 'Smile' : 'Frown'} {Math.round(Math.abs(selectedExpression.mouthCurve) * 100)}%</span>
              </GlassCard>

              <GlassCard className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-4 h-4" />
                  <span className="text-sm font-medium">Mouth Openness</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all"
                    style={{ width: `${selectedExpression.mouthOpenness * 100}%` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground">{Math.round(selectedExpression.mouthOpenness * 100)}%</span>
              </GlassCard>

              <GlassCard className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Angry className="w-4 h-4" />
                  <span className="text-sm font-medium">Brow Tilt</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all"
                    style={{ 
                      width: `${Math.abs(selectedExpression.browTilt) * 100}%`,
                      marginLeft: selectedExpression.browTilt < 0 ? 'auto' : 0,
                      backgroundColor: selectedExpression.browTilt > 0 ? '#ef4444' : '#3b82f6'
                    }}
                  />
                </div>
                <span className="text-xs text-muted-foreground">{selectedExpression.browTilt > 0 ? 'Angry' : 'Sad'} {Math.round(Math.abs(selectedExpression.browTilt) * 100)}%</span>
              </GlassCard>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
