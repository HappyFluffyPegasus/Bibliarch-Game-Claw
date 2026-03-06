import { useState, useRef, useCallback, createContext, useContext, ReactNode } from 'react';
import { Volume2, VolumeX, Music, AudioWaveform } from 'lucide-react';

// Sound effect categories
export type SoundCategory = 'music' | 'sfx' | 'ui' | 'ambient';

interface Sound {
  id: string;
  url: string;
  category: SoundCategory;
  volume: number;
  loop: boolean;
}

interface AudioState {
  masterVolume: number;
  musicVolume: number;
  sfxVolume: number;
  uiVolume: number;
  ambientVolume: number;
  muted: boolean;
}

interface AudioContextType extends AudioState {
  play: (soundId: string) => void;
  stop: (soundId: string) => void;
  stopAll: () => void;
  setVolume: (category: SoundCategory, volume: number) => void;
  setMasterVolume: (volume: number) => void;
  toggleMute: () => void;
  isPlaying: (soundId: string) => boolean;
}

const AudioContext = createContext<AudioContextType | null>(null);

// Predefined sound library
const soundLibrary: Record<string, { url: string; category: SoundCategory }> = {
  'click': { url: '/sounds/click.mp3', category: 'ui' },
  'hover': { url: '/sounds/hover.mp3', category: 'ui' },
  'success': { url: '/sounds/success.mp3', category: 'ui' },
  'error': { url: '/sounds/error.mp3', category: 'ui' },
  'save': { url: '/sounds/save.mp3', category: 'ui' },
  'delete': { url: '/sounds/delete.mp3', category: 'ui' },
  'rain': { url: '/sounds/rain.mp3', category: 'ambient' },
  'wind': { url: '/sounds/wind.mp3', category: 'ambient' },
  'fire': { url: '/sounds/fire.mp3', category: 'ambient' },
  'birds': { url: '/sounds/birds.mp3', category: 'ambient' },
  'battle': { url: '/sounds/battle.mp3', category: 'music' },
  'exploration': { url: '/sounds/exploration.mp3', category: 'music' },
  'menu': { url: '/sounds/menu.mp3', category: 'music' },
  'sword': { url: '/sounds/sword.mp3', category: 'sfx' },
  'magic': { url: '/sounds/magic.mp3', category: 'sfx' },
  'footstep': { url: '/sounds/footstep.mp3', category: 'sfx' },
  'door': { url: '/sounds/door.mp3', category: 'sfx' },
};

export function AudioProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AudioState>({
    masterVolume: 1,
    musicVolume: 0.7,
    sfxVolume: 0.8,
    uiVolume: 0.5,
    ambientVolume: 0.4,
    muted: false
  });

  const audioRefs = useRef<Map<string, HTMLAudioElement>>(new Map());

  const getVolumeForCategory = useCallback((category: SoundCategory) => {
    if (state.muted) return 0;
    const categoryVolumes = {
      music: state.musicVolume,
      sfx: state.sfxVolume,
      ui: state.uiVolume,
      ambient: state.ambientVolume
    };
    return state.masterVolume * categoryVolumes[category];
  }, [state]);

  const play = useCallback((soundId: string) => {
    const soundDef = soundLibrary[soundId];
    if (!soundDef) {
      console.warn(`Sound "${soundId}" not found in library`);
      return;
    }

    // Stop existing instance if playing
    const existing = audioRefs.current.get(soundId);
    if (existing) {
      existing.currentTime = 0;
      existing.play().catch(() => {});
      return;
    }

    // Create new audio element
    const audio = new Audio(soundDef.url);
    audio.volume = getVolumeForCategory(soundDef.category);
    audio.loop = soundDef.category === 'music' || soundDef.category === 'ambient';
    
    audio.addEventListener('ended', () => {
      if (!audio.loop) {
        audioRefs.current.delete(soundId);
      }
    });

    audioRefs.current.set(soundId, audio);
    audio.play().catch(err => console.log('Audio play failed:', err));
  }, [getVolumeForCategory]);

  const stop = useCallback((soundId: string) => {
    const audio = audioRefs.current.get(soundId);
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
      audioRefs.current.delete(soundId);
    }
  }, []);

  const stopAll = useCallback(() => {
    audioRefs.current.forEach(audio => {
      audio.pause();
      audio.currentTime = 0;
    });
    audioRefs.current.clear();
  }, []);

  const setVolume = useCallback((category: SoundCategory, volume: number) => {
    setState(prev => ({
      ...prev,
      [`${category}Volume`]: volume
    }));

    // Update playing audio
    audioRefs.current.forEach((audio, soundId) => {
      const soundDef = soundLibrary[soundId];
      if (soundDef?.category === category) {
        audio.volume = state.masterVolume * volume;
      }
    });
  }, [state.masterVolume]);

  const setMasterVolume = useCallback((volume: number) => {
    setState(prev => ({ ...prev, masterVolume: volume }));
    
    audioRefs.current.forEach((audio, soundId) => {
      const soundDef = soundLibrary[soundId];
      if (soundDef) {
        audio.volume = getVolumeForCategory(soundDef.category);
      }
    });
  }, [getVolumeForCategory]);

  const toggleMute = useCallback(() => {
    setState(prev => ({ ...prev, muted: !prev.muted }));
  }, []);

  const isPlaying = useCallback((soundId: string) => {
    const audio = audioRefs.current.get(soundId);
    return audio ? !audio.paused : false;
  }, []);

  return (
    <AudioContext.Provider value={{
      ...state,
      play,
      stop,
      stopAll,
      setVolume,
      setMasterVolume,
      toggleMute,
      isPlaying
    }}>
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within AudioProvider');
  }
  return context;
}

// UI Component for audio controls
export function AudioControls() {
  const audio = useAudio();

  return (
    <div className="p-4 bg-card rounded-xl border border-border space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {audio.muted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          <span className="font-medium">Audio</span>
        </div>
        
        <button
          onClick={audio.toggleMute}
          className="px-3 py-1 text-sm bg-accent rounded-lg hover:bg-accent/80"
        >
          {audio.muted ? 'Unmute' : 'Mute'}
        </button>
      </div>

      <div className="space-y-3">
        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Master</span>
            <span>{Math.round(audio.masterVolume * 100)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={audio.masterVolume}
            onChange={(e) => audio.setMasterVolume(Number(e.target.value))}
            className="w-full"
          />
        </div>

        {[
          { label: 'Music', key: 'musicVolume', icon: Music, value: audio.musicVolume },
          { label: 'SFX', key: 'sfxVolume', icon: AudioWaveform, value: audio.sfxVolume },
          { label: 'UI', key: 'uiVolume', icon: Volume2, value: audio.uiVolume },
        ].map(({ label, key, icon: Icon, value }) => (
          <div key={key} className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="flex items-center gap-1 text-muted-foreground">
                <Icon className="w-3 h-3" /> {label}
              </span>
              <span>{Math.round(value * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={value}
              onChange={(e) => audio.setVolume(
                label.toLowerCase() as SoundCategory, 
                Number(e.target.value)
              )}
              className="w-full"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
