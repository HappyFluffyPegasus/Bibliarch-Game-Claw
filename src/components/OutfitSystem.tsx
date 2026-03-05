import { useState } from 'react';
import { Shirt, Plus, Trash2, Eye, EyeOff, Sparkles, Sun, Snowflake, Umbrella } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { cn } from '../lib/utils';

interface Outfit {
  id: string;
  name: string;
  thumbnail: string;
  items: string[]; // Asset IDs
  weather: 'any' | 'sunny' | 'rainy' | 'cold' | 'hot';
  sceneLinked?: string; // Scene ID
}

export function OutfitSystem({ characterId }: { characterId: string }) {
  const [outfits, setOutfits] = useState<Outfit[]>([
    { id: '1', name: 'Default', thumbnail: '👕', items: ['shirt', 'pants'], weather: 'any' },
    { id: '2', name: 'Summer Casual', thumbnail: '☀️', items: ['tank-top', 'shorts'], weather: 'hot' },
    { id: '3', name: 'Winter Coat', thumbnail: '❄️', items: ['coat', 'scarf', 'pants'], weather: 'cold' },
  ]);
  
  const [activeOutfit, setActiveOutfit] = useState('1');
  const [isAdding, setIsAdding] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  const weatherIcons: Record<string, any> = {
    any: null,
    sunny: Sun,
    rainy: Umbrella,
    cold: Snowflake,
    hot: Sun,
  };

  const addOutfit = () => {
    const newOutfit: Outfit = {
      id: Date.now().toString(),
      name: `Outfit ${outfits.length + 1}`,
      thumbnail: '👔',
      items: [],
      weather: 'any',
    };
    setOutfits([...outfits, newOutfit]);
    setIsAdding(false);
  };

  const deleteOutfit = (id: string) => {
    setOutfits(outfits.filter(o => o.id !== id));
    if (activeOutfit === id) setActiveOutfit(outfits[0]?.id || '');
  };

  return (
    <GlassCard className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Shirt className="w-5 h-5 text-pink-500" />
          <h3 className="font-semibold">Outfits</h3>
          <span className="text-xs text-muted-foreground">({outfits.length})</span>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => setPreviewMode(!previewMode)}
            className={cn(
              "p-2 rounded-lg transition-colors",
              previewMode ? "bg-primary text-primary-foreground" : "hover:bg-accent"
            )}
            title="Preview on character"
          >
            {previewMode ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </button>
          
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="p-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Outfit Grid */}
      <div className="grid grid-cols-3 gap-2">
        {outfits.map(outfit => {
          const WeatherIcon = weatherIcons[outfit.weather];
          
          return (
            <button
              key={outfit.id}
              onClick={() => setActiveOutfit(outfit.id)}
              className={cn(
                "relative p-3 rounded-xl border-2 transition-all text-center",
                activeOutfit === outfit.id
                  ? "border-primary bg-primary/10"
                  : "border-border hover:border-primary/50"
              )}
            >
              <div className="text-3xl mb-2">{outfit.thumbnail}</div>
              <div className="text-xs font-medium truncate">{outfit.name}</div>
              
              {WeatherIcon && (
                <div className="absolute top-1 right-1">
                  <WeatherIcon className="w-3 h-3 text-muted-foreground" />
                </div>
              )}
              
              {activeOutfit === outfit.id && outfit.id !== '1' && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteOutfit(outfit.id);
                  }}
                  className="absolute -top-1 -left-1 p-1 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 hover:opacity-100"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              )}
            </button>
          );
        })}
        
        {/* Add Button */}
        <button
          onClick={addOutfit}
          className="p-3 rounded-xl border-2 border-dashed border-border hover:border-primary hover:text-primary transition-all flex flex-col items-center justify-center min-h-[80px]"
        >
          <Plus className="w-5 h-5 mb-1" />
          <span className="text-xs">New</span>
        </button>
      </div>

      {/* Active Outfit Details */}
      <{activeOutfit && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="text-xs font-medium text-muted-foreground uppercase mb-2">
            {outfits.find(o => o.id === activeOutfit)?.name} Details
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">Weather Link</span>
              <select 
                className="text-sm px-2 py-1 bg-background border border-input rounded"
                value={outfits.find(o => o.id === activeOutfit)?.weather}
                onChange={(e) => {
                  setOutfits(outfits.map(o => 
                    o.id === activeOutfit ? { ...o, weather: e.target.value as any } : o
                  ));
                }}
              >
                <option value="any">Any Weather</option>
                <option value="sunny">Sunny</option>
                <option value="rainy">Rainy</option>
                <option value="cold">Cold</option>
                <option value="hot">Hot</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm">Scene Link</span>
              <select className="text-sm px-2 py-1 bg-background border border-input rounded">
                <option>No specific scene</option>
                <option>Beach Episode</option>
                <option>Formal Dinner</option>
                <option>Battle Scene</option>
              </select>
            </div>

            <button className="w-full py-2 bg-violet-500/10 text-violet-500 rounded-lg text-sm hover:bg-violet-500/20 transition-colors flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4" />
              AI Generate Variation
            </button>
          </div>
        </div>
      )}
    </GlassCard>
  );
}
