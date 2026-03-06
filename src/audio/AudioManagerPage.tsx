import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Volume2, VolumeX, Music, Mic, Play, Pause, SkipForward, SkipBack,
  Repeat, Shuffle, ListMusic, Plus, Trash2, Settings
} from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { cn } from '../lib/utils';

interface AudioTrack {
  id: string;
  name: string;
  type: 'music' | 'sfx' | 'ambient';
  duration: number;
  url: string;
  tags: string[];
}

interface Playlist {
  id: string;
  name: string;
  tracks: string[];
  shuffle: boolean;
  repeat: 'none' | 'one' | 'all';
}

const sampleTracks: AudioTrack[] = [
  { id: '1', name: 'Main Theme', type: 'music', duration: 180, url: '/audio/main-theme.mp3', tags: ['main', 'theme'] },
  { id: '2', name: 'Battle Music', type: 'music', duration: 240, url: '/audio/battle.mp3', tags: ['combat', 'intense'] },
  { id: '3', name: 'Peaceful Village', type: 'ambient', duration: 300, url: '/audio/village.mp3', tags: ['calm', 'town'] },
  { id: '4', name: 'Forest Ambience', type: 'ambient', duration: 360, url: '/audio/forest.mp3', tags: ['nature', 'outdoor'] },
  { id: '5', name: 'Sword Clash', type: 'sfx', duration: 2, url: '/audio/sword.mp3', tags: ['combat', 'weapon'] },
  { id: '6', name: 'Door Open', type: 'sfx', duration: 1, url: '/audio/door.mp3', tags: ['ui', 'interaction'] },
  { id: '7', name: 'Magic Spell', type: 'sfx', duration: 3, url: '/audio/magic.mp3', tags: ['magic', 'ability'] },
  { id: '8', name: 'Footsteps', type: 'sfx', duration: 1, url: '/audio/steps.mp3', tags: ['movement', 'player'] },
];

export function AudioManagerPage() {
  const [tracks, setTracks] = useState<AudioTrack[]>(sampleTracks);
  const [currentTrack, setCurrentTrack] = useState<AudioTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [muted, setMuted] = useState(false);
  const [activeTab, setActiveTab] = useState<'playlist' | 'library' | 'mixer'>('playlist');
  const [playlists, setPlaylists] = useState<Playlist[]>([
    { id: '1', name: 'Battle Scenes', tracks: ['2', '5', '7'], shuffle: false, repeat: 'all' },
    { id: '2', name: 'Exploration', tracks: ['3', '4', '8'], shuffle: true, repeat: 'all' },
  ]);
  const [activePlaylist, setActivePlaylist] = useState<string>('1');
  const [progress, setProgress] = useState(0);
  
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = muted ? 0 : volume;
    }
  }, [volume, muted]);

  const playTrack = (track: AudioTrack) => {
    setCurrentTrack(track);
    setIsPlaying(true);
    // In real implementation, would actually play audio
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const filteredTracks = (type: AudioTrack['type']) => 
    tracks.filter(t => t.type === type);

  return (
    <div className="h-screen flex bg-background">
      {/* Sidebar */}
      <div className="w-64 border-r border-border bg-card/50 flex flex-col">
        <div className="p-4 border-b border-border">
          <h2 className="font-semibold flex items-center gap-2">
            <Volume2 className="w-5 h-5" />
            Audio Manager
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          <div className="space-y-1">
            <button
              onClick={() => setActiveTab('playlist')}
              className={cn(
                "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-colors",
                activeTab === 'playlist' ? "bg-primary/10 text-primary" : "hover:bg-accent"
              )}
            >
              <ListMusic className="w-4 h-4" />
              Playlists
            </button>
            
            <button
              onClick={() => setActiveTab('library')}
              className={cn(
                "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-colors",
                activeTab === 'library' ? "bg-primary/10 text-primary" : "hover:bg-accent"
              )}
            >
              <Music className="w-4 h-4" />
              Library
            </button>
            
            <button
              onClick={() => setActiveTab('mixer')}
              className={cn(
                "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-colors",
                activeTab === 'mixer' ? "bg-primary/10 text-primary" : "hover:bg-accent"
              )}
            >
              <Settings className="w-4 h-4" />
              Mixer
            </button>
          </div>

          <div className="mt-6 pt-6 border-t border-border">
            <div className="text-xs font-medium text-muted-foreground uppercase mb-2 px-3">Playlists</div>
            
            <div className="space-y-1">
              {playlists.map(playlist => (
                <button
                  key={playlist.id}
                  onClick={() => { setActivePlaylist(playlist.id); setActiveTab('playlist'); }}
                  className={cn(
                    "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-colors",
                    activePlaylist === playlist ? "bg-primary/10 text-primary" : "hover:bg-accent"
                  )}
                >
                  <ListMusic className="w-4 h-4" />
                  <span className="flex-1 truncate">{playlist.name}</span>
                  <span className="text-xs text-muted-foreground">{playlist.tracks.length}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {activeTab === 'playlist' && (
          <>
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <div>
                <h3 className="font-semibold">{playlists.find(p => p.id === activePlaylist)?.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {playlists.find(p => p.id === activePlaylist)?.tracks.length} tracks
                </p>
              </div>
              
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-accent rounded">
                  <Shuffle className="w-4 h-4" />
                </button>
                <button className="p-2 hover:bg-accent rounded">
                  <Repeat className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-2">
                {playlists
                  .find(p => p.id === activePlaylist)
                  ?.tracks.map((trackId, index) => {
                    const track = tracks.find(t => t.id === trackId);
                    if (!track) return null;
                    
                    return (
                      <div
                        key={track.id}
                        onClick={() => playTrack(track)}
                        className={cn(
                          "flex items-center gap-4 p-3 rounded-lg cursor-pointer transition-colors",
                          currentTrack?.id === track.id
                            ? "bg-primary/10 border border-primary/30"
                            : "hover:bg-accent border border-transparent"
                        )}
                      >
                        <span className="text-sm text-muted-foreground w-6">{index + 1}</span>
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (currentTrack?.id === track.id) {
                              togglePlay();
                            } else {
                              playTrack(track);
                            }
                          }}
                          className="w-10 h-10 flex items-center justify-center bg-primary/10 rounded-full hover:bg-primary/20"
                        >
                          {currentTrack?.id === track.id && isPlaying ? (
                            <Pause className="w-4 h-4" />
                          ) : (
                            <Play className="w-4 h-4" />
                          )}
                        </button>
                        
                        <div className="flex-1">
                          <p className="font-medium">{track.name}</p>
                          <p className="text-sm text-muted-foreground">{track.type}</p>
                        </div>
                        
                        <span className="text-sm text-muted-foreground">{formatTime(track.duration)}</span>
                      </div>
                    );
                  })}
              </div>
            </div>
          </>
        )}

        {activeTab === 'library' && (
          <div className="flex-1 overflow-y-auto p-6">
            {(['music', 'ambient', 'sfx'] as const).map(type => (
              <div key={type} className="mb-8">
                <h4 className="font-semibold mb-4 capitalize">{type === 'sfx' ? 'Sound Effects' : type}</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {filteredTracks(type).map(track => (
                    <div
                      key={track.id}
                      onClick={() => playTrack(track)}
                      className={cn(
                        "p-4 rounded-lg border cursor-pointer transition-all",
                        currentTrack?.id === track.id
                          ? "bg-primary/10 border-primary"
                          : "bg-card border-border hover:border-primary/50"
                      )}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                            {type === 'music' && <Music className="w-5 h-5" />}
                            {type === 'ambient' && <Mic className="w-5 h-5" />}
                            {type === 'sfx' && <Volume2 className="w-5 h-5" />}
                          </div>
                          
                          <div>
                            <p className="font-medium">{track.name}</p>
                            <div className="flex gap-1 mt-1">
                              {track.tags.slice(0, 2).map(tag => (
                                <span key={tag} className="text-xs px-2 py-0.5 bg-muted rounded">{tag}</span>
                              ))}
                            </div>
                          </div>
                        </div>
                        
                        <span className="text-sm text-muted-foreground">{formatTime(track.duration)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'mixer' && (
          <div className="flex-1 overflow-y-auto p-6">
            <div className="max-w-2xl">
              <h3 className="font-semibold mb-6">Audio Mixer</h3>
              
              <div className="space-y-6">
                <GlassCard className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Music className="w-5 h-5 text-primary" />
                      <span className="font-medium">Master Volume</span>
                    </div>
                    
                    <button
                      onClick={() => setMuted(!muted)}
                      className={cn(
                        "p-2 rounded-lg transition-colors",
                        muted ? "bg-destructive/20 text-destructive" : "hover:bg-accent"
                      )}
                    >
                      {muted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                    </button>
                  </div>
                  
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={muted ? 0 : volume}
                    onChange={(e) => setVolume(Number(e.target.value))}
                    className="w-full"
                  />
                  
                  <div className="flex justify-between text-sm text-muted-foreground mt-2">
                    <span>0%</span>
                    <span>{Math.round((muted ? 0 : volume) * 100)}%</span>
                    <span>100%</span>
                  </div>
                </GlassCard>

                {[
                  { name: 'Music', icon: Music, value: 0.7 },
                  { name: 'Sound Effects', icon: Volume2, value: 0.8 },
                  { name: 'Ambient', icon: Mic, value: 0.5 },
                  { name: 'UI Sounds', icon: Settings, value: 0.6 },
                ].map(channel => (
                  <GlassCard key={channel.name} className="p-4">
                    <div className="flex items-center gap-4">
                      <channel.icon className="w-5 h-5 text-muted-foreground" />
                      <span className="w-32 font-medium">{channel.name}</span>
                      
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        defaultValue={channel.value}
                        className="flex-1"
                      />
                      
                      <span className="w-12 text-right text-sm text-muted-foreground">{Math.round(channel.value * 100)}%</span>
                    </div>
                  </GlassCard>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Player Bar */}
        {currentTrack && (
          <div className="border-t border-border bg-card/50 backdrop-blur p-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-accent rounded">
                  <SkipBack className="w-5 h-5" />
                </button>
                
                <button 
                  onClick={togglePlay}
                  className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center hover:bg-primary/90"
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                </button>
                
                <button className="p-2 hover:bg-accent rounded">
                  <SkipForward className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium">{currentTrack.name}</span>
                  <span className="text-sm text-muted-foreground">
                    {formatTime(Math.floor(progress * currentTrack.duration))} / {formatTime(currentTrack.duration)}
                  </span>
                </div>
                
                <div className="h-1 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full"
                    style={{ width: `${progress * 100}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setMuted(!muted)}
                  className="p-2 hover:bg-accent rounded"
                >
                  {muted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>
                
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={muted ? 0 : volume}
                  onChange={(e) => setVolume(Number(e.target.value))}
                  className="w-24"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
