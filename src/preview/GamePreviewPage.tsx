import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, Pause, Square, SkipBack, SkipForward, Volume2, VolumeX,
  Map, Compass, Backpack, Users, MessageSquare, Settings,
  ChevronLeft, ChevronRight, Clock, Save, Camera, Maximize2,
  Eye, EyeOff, Zap, Shield, Heart, Sword
} from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { cn } from '../lib/utils';

interface GameState {
  location: string;
  time: number; // 0-24 hours
  inventory: string[];
  party: PartyMember[];
  quests: Quest[];
  dialogue: DialogueLine | null;
}

interface PartyMember {
  id: string;
  name: string;
  avatar: string;
  health: number;
  maxHealth: number;
  level: number;
}

interface Quest {
  id: string;
  name: string;
  status: 'active' | 'completed' | 'failed';
  progress: number;
}

interface DialogueLine {
  speaker: string;
  avatar: string;
  text: string;
  choices?: { id: string; text: string }[];
}

interface Location {
  id: string;
  name: string;
  description: string;
  icon: string;
  connections: string[];
  objects: WorldObject[];
}

interface WorldObject {
  id: string;
  name: string;
  icon: string;
  interactable: boolean;
}

const sampleLocations: Location[] = [
  {
    id: 'luminara-gates',
    name: 'Gates of Luminara',
    description: 'The grand entrance to the elven capital. Crystal spires rise above ancient trees.',
    icon: '🏰',
    connections: ['whisperwood-entrance', 'luminara-market'],
    objects: [
      { id: 'guard', name: 'City Guard', icon: '👮', interactable: true },
      { id: 'notice-board', name: 'Notice Board', icon: '📋', interactable: true },
    ]
  },
  {
    id: 'luminara-market',
    name: 'Crystal Market',
    description: 'A bustling marketplace filled with magical goods and exotic wares.',
    icon: '🏪',
    connections: ['luminara-gates', 'astral-spire'],
    objects: [
      { id: 'merchant', name: 'Merchant', icon: '👳', interactable: true },
      { id: 'chest', name: 'Mysterious Chest', icon: '📦', interactable: true },
    ]
  },
  {
    id: 'astral-spire',
    name: 'The Astral Spire',
    description: 'The royal palace, pulsing with ancient magic.',
    icon: '🗼',
    connections: ['luminara-market'],
    objects: [
      { id: 'queen', name: 'Elven Queen', icon: '👸', interactable: true },
      { id: 'portal', name: 'Magic Portal', icon: '🌀', interactable: true },
    ]
  },
  {
    id: 'whisperwood-entrance',
    name: 'Whisperwood Edge',
    description: 'The forest seems alive, watching your every move.',
    icon: '🌲',
    connections: ['luminara-gates', 'dark-cave'],
    objects: [
      { id: 'tree', name: 'Ancient Tree', icon: '🌳', interactable: true },
      { id: 'herbs', name: 'Glowing Herbs', icon: '🌿', interactable: true },
    ]
  },
  {
    id: 'dark-cave',
    name: 'Dark Cave',
    description: 'A foreboding cave entrance. You sense danger within.',
    icon: '🕳️',
    connections: ['whisperwood-entrance'],
    objects: [
      { id: 'monster', name: 'Shadow Beast', icon: '👹', interactable: true },
      { id: 'treasure', name: 'Hidden Treasure', icon: '💎', interactable: true },
    ]
  },
];

export function GamePreviewPage() {
  const [currentLocation, setCurrentLocation] = useState<string>('luminara-gates');
  const [gameTime, setGameTime] = useState(12);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showUI, setShowUI] = useState(true);
  const [activePanel, setActivePanel] = useState<'map' | 'inventory' | 'party' | 'quests' | null>(null);
  const [dialogue, setDialogue] = useState<DialogueLine | null>(null);
  const [notifications, setNotifications] = useState<string[]>([]);

  const location = sampleLocations.find(l => l.id === currentLocation);
  const connectedLocations = location?.connections.map(id => 
    sampleLocations.find(l => l.id === id)
  ).filter(Boolean) || [];

  // Simulate time passing
  useEffect(() => {
    if (!isPlaying) return;
    
    const interval = setInterval(() => {
      setGameTime(t => (t + 0.1) % 24);
    }, 1000);
    
    return () => clearInterval(interval);
  }, [isPlaying]);

  const travelTo = (locationId: string) => {
    setCurrentLocation(locationId);
    addNotification(`Traveled to ${sampleLocations.find(l => l.id === locationId)?.name}`);
  };

  const interact = (object: WorldObject) => {
    // Show dialogue based on object
    const dialogues: Record<string, DialogueLine> = {
      'guard': {
        speaker: 'City Guard',
        avatar: '👮',
        text: 'Halt! State your business in Luminara.',
        choices: [
          { id: 'peaceful', text: 'I come in peace, seeking knowledge.' },
          { id: 'bluff', text: 'I\'m an important merchant.' },
        ]
      },
      'merchant': {
        speaker: 'Merchant',
        avatar: '👳',
        text: 'Welcome, traveler! Care to see my wares?',
        choices: [
          { id: 'buy', text: 'Show me what you have.' },
          { id: 'sell', text: 'I have items to sell.' },
          { id: 'leave', text: 'Maybe later.' },
        ]
      },
      'queen': {
        speaker: 'Elven Queen',
        avatar: '👸',
        text: 'You have done well to reach my court. What brings you before me?',
        choices: [
          { id: 'quest', text: 'I seek the ancient artifact.' },
          { id: 'peace', text: 'I come to forge an alliance.' },
        ]
      },
      'chest': {
        speaker: 'System',
        avatar: '📦',
        text: 'You found a health potion and 50 gold coins!',
      },
      'monster': {
        speaker: 'Shadow Beast',
        avatar: '👹',
        text: 'Grrrr... (The beast prepares to attack!)',
        choices: [
          { id: 'fight', text: 'Draw your weapon!' },
          { id: 'flee', text: 'Run away!' },
        ]
      },
    };

    setDialogue(dialogues[object.id] || {
      speaker: object.name,
      avatar: object.icon,
      text: `You examine the ${object.name.toLowerCase()}. Nothing special happens.`,
    });
  };

  const addNotification = (message: string) => {
    setNotifications(prev => [...prev.slice(-4), message]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(m => m !== message));
    }, 3000);
  };

  const formatTime = (time: number) => {
    const hours = Math.floor(time);
    const minutes = Math.floor((time % 1) * 60);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  const getTimeOfDay = () => {
    if (gameTime >= 6 && gameTime < 12) return 'Morning';
    if (gameTime >= 12 && gameTime < 18) return 'Afternoon';
    if (gameTime >= 18 && gameTime < 21) return 'Evening';
    return 'Night';
  };

  return (
    <div className="h-screen bg-black relative overflow-hidden">
      {/* Game World View */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div 
          className="w-full h-full bg-cover bg-center transition-all duration-1000"
          style={{
            background: getLocationBackground(currentLocation, gameTime),
          }}
>
          {/* Location Content */}
          <div className="h-full flex flex-col items-center justify-center p-8">
            {/* Location Header */}
            <motion.div
              key={currentLocation}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center text-white mb-8"
            >
              <div className="text-8xl mb-4">{location?.icon}</div>
              <h1 className="text-4xl font-bold mb-2 drop-shadow-lg">{location?.name}</h1>
              <p className="text-lg text-white/80 max-w-xl drop-shadow">{location?.description}</p>
            </motion.div>

            {/* Interactive Objects */}
            <div className="flex gap-4 mb-8">
              {location?.objects.map(obj => (
                <motion.button
                  key={obj.id}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => interact(obj)}
                  className="flex flex-col items-center gap-2 p-4 bg-black/40 backdrop-blur rounded-xl border border-white/20 hover:border-white/40 transition-colors"
                >
                  <span className="text-4xl">{obj.icon}</span>
                  <span className="text-sm text-white">{obj.name}</span>
                </motion.button>
              ))}
            </div>

            {/* Travel Options */}
            <div className="flex gap-3">
              {connectedLocations.map(conn => (
                <motion.button
                  key={conn?.id}
                  whileHover={{ scale: 1.05, x: 5 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => conn && travelTo(conn.id)}
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur rounded-lg text-white border border-white/20 hover:bg-white/20 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                  <span>To {conn?.name}</span>
                  <span className="text-xl">{conn?.icon}</span>
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Top HUD */}
      {showUI && (
        <>
          <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between bg-gradient-to-b from-black/60 to-transparent">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-10 h-10 flex items-center justify-center bg-white/10 backdrop-blur rounded-full text-white hover:bg-white/20"
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </button>

              <GlassCard className="px-4 py-2 text-white">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span className="font-mono">{formatTime(gameTime)}</span>
                  <span className="text-white/60">• {getTimeOfDay()}</span>
                </div>
              </GlassCard>

              <GlassCard className="px-4 py-2 text-white">
                <div className="flex items-center gap-2">
                  <Map className="w-4 h-4" />
                  <span>{location?.name}</span>
                </div>
              </GlassCard>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setActivePanel(activePanel === 'map' ? null : 'map')}
                className={cn(
                  "p-2 rounded-lg text-white transition-colors",
                  activePanel === 'map' ? "bg-white/20" : "hover:bg-white/10"
                )}
              >
                <Map className="w-5 h-5" />
              </button>

              <button
                onClick={() => setActivePanel(activePanel === 'inventory' ? null : 'inventory')}
                className={cn(
                  "p-2 rounded-lg text-white transition-colors",
                  activePanel === 'inventory' ? "bg-white/20" : "hover:bg-white/10"
                )}
              >
                <Backpack className="w-5 h-5" />
              </button>

              <button
                onClick={() => setActivePanel(activePanel === 'party' ? null : 'party')}
                className={cn(
                  "p-2 rounded-lg text-white transition-colors",
                  activePanel === 'party' ? "bg-white/20" : "hover:bg-white/10"
                )}
              >
                <Users className="w-5 h-5" />
              </button>

              <button
                onClick={() => setActivePanel(activePanel === 'quests' ? null : 'quests')}
                className={cn(
                  "p-2 rounded-lg text-white transition-colors",
                  activePanel === 'quests' ? "bg-white/20" : "hover:bg-white/10"
                )}
              >
                <Compass className="w-5 h-5" />
              </button>

              <button
                onClick={() => setShowUI(false)}
                className="p-2 rounded-lg text-white hover:bg-white/10"
              >
                <EyeOff className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Notifications */}
          <div className="absolute top-20 right-4 space-y-2">
            {notifications.map((note, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                className="px-4 py-2 bg-black/60 backdrop-blur text-white rounded-lg text-sm"
              >
                {note}
              </motion.div>
            ))}
          </div>
        </>
      )}

      {/* Show UI Button (when hidden) */}
      {!showUI && (
        <button
          onClick={() => setShowUI(true)}
          className="absolute top-4 left-4 p-2 bg-black/40 backdrop-blur rounded-lg text-white hover:bg-black/60"
        >
          <Eye className="w-5 h-5" />
        </button>
      )}

      {/* Active Panel */}
      {activePanel && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="absolute bottom-4 left-4 right-4"
        >
          <GlassCard className="p-4 max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold capitalize">{activePanel}</h3>
              
              <button onClick={() => setActivePanel(null)} className="p-1 hover:bg-accent rounded">×</button>
            </div>

            {activePanel === 'map' && (
              <div className="grid grid-cols-3 gap-4">
                {sampleLocations.map(loc => (
                  <button
                    key={loc.id}
                    onClick={() => travelTo(loc.id)}
                    className={cn(
                      "p-4 rounded-xl border-2 transition-all text-left",
                      currentLocation === loc.id
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/30"
                    )}
                  >
                    <div className="text-3xl mb-2">{loc.icon}</div>
                    <p className="font-medium">{loc.name}</p>
                    <p className="text-xs text-muted-foreground">{loc.connections.length} connections</p>
                  </button>
                ))}
              </div>
            )}

            {activePanel === 'inventory' && (
              <div className="text-center text-muted-foreground py-8">
                🎒 Your inventory is empty
              </div>
            )}

            {activePanel === 'party' && (
              <div className="flex gap-4">
                <div className="flex-1 p-4 bg-muted rounded-xl">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl">🧙‍♂️</span>
                    <div>
                      <p className="font-bold">Hero</p>
                      <p className="text-sm text-muted-foreground">Level 5 Wizard</p>
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="h-2 bg-muted-foreground/20 rounded-full overflow-hidden">
                      <div className="h-full w-3/4 bg-green-500" />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">75/100 HP</p>
                  </div>
                </div>
              </div>
            )}

            {activePanel === 'quests' && (
              <div className="space-y-2">
                <div className="p-3 bg-muted rounded-xl flex items-center gap-3">
                  <Compass className="w-5 h-5 text-primary" />
                  <div className="flex-1">
                    <p className="font-medium">Find the Ancient Artifact</p>
                    <div className="h-1.5 bg-muted-foreground/20 rounded-full overflow-hidden mt-1">
                      <div className="h-full w-1/3 bg-primary" />
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">33%</span>
                </div>
              </div>
            )}
          </GlassCard>
        </motion.div>
      )}

      {/* Dialogue Box */}
      {dialogue && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-4 left-4 right-4"
        >
          <GlassCard className="p-6 max-w-3xl mx-auto"
>
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center text-3xl">
                {dialogue.avatar}
              </div>
              
              <div className="flex-1">
                <p className="font-bold mb-2">{dialogue.speaker}</p>
                <p className="text-lg leading-relaxed">{dialogue.text}</p>
                
                {dialogue.choices && (
                  <div className="flex gap-3 mt-4">
                    {dialogue.choices.map(choice => (
                      <button
                        key={choice.id}
                        onClick={() => {
                          addNotification(`Selected: ${choice.text}`);
                          setDialogue(null);
                        }}
                        className="px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-colors"
                      >
                        {choice.text}
                      </button>
                    ))}
                  </div>
                )}
                
                {!dialogue.choices && (
                  <button
                    onClick={() => setDialogue(null)}
                    className="mt-4 px-4 py-2 bg-muted hover:bg-accent rounded-lg transition-colors"
                  >
                    Continue
                  </button>
                )}
              </div>
            </div>
          </GlassCard>
        </motion.div>
      )}
    </div>
  );
}

// Helper function to get location background
function getLocationBackground(locationId: string, time: number): string {
  const isNight = time < 6 || time >= 21;
  const isEvening = time >= 18 && time < 21;
  
  const backgrounds: Record<string, Record<string, string>> = {
    'luminara-gates': {
      day: 'linear-gradient(to bottom, #87CEEB, #90EE90)',
      evening: 'linear-gradient(to bottom, #FF6B35, #F7C59F)',
      night: 'linear-gradient(to bottom, #0f172a, #1e293b)',
    },
    'luminara-market': {
      day: 'linear-gradient(to bottom, #F4E4C1, #D4A373)',
      evening: 'linear-gradient(to bottom, #E07A5F, #3D405B)',
      night: 'linear-gradient(to bottom, #2D3047, #1B1F3B)',
    },
    'astral-spire': {
      day: 'linear-gradient(to bottom, #E0AAFF, #C77DFF)',
      evening: 'linear-gradient(to bottom, #9D4EDD, #3C096C)',
      night: 'linear-gradient(to bottom, #240046, #10002B)',
    },
    'whisperwood-entrance': {
      day: 'linear-gradient(to bottom, #D8F3DC, #B7E4C7)',
      evening: 'linear-gradient(to bottom, #95D5B2, #40916C)',
      night: 'linear-gradient(to bottom, #1B4332, #081C15)',
    },
    'dark-cave': {
      day: 'linear-gradient(to bottom, #4A4E69, #22223B)',
      evening: 'linear-gradient(to bottom, #2D3142, #1B1B1E)',
      night: 'linear-gradient(to bottom, #0D0D0D, #000000)',
    },
  };
  
  const timeOfDay = isNight ? 'night' : isEvening ? 'evening' : 'day';
  return backgrounds[locationId]?.[timeOfDay] || backgrounds['luminara-gates'][timeOfDay];
}
