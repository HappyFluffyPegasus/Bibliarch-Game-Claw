import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, PieChart, TrendingUp, Users, BookOpen, 
  Clock, Target, Award, Calendar, FileText, MessageSquare
} from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { cn } from '../lib/utils';

interface StoryStats {
  wordCount: number;
  sceneCount: number;
  characterCount: number;
  locationCount: number;
  dialogueLines: number;
  daysActive: number;
  lastEdited: string;
  completionPercentage: number;
}

interface CharacterArc {
  name: string;
  appearances: number;
  dialogueShare: number;
  growth: number;
}

interface TimelineEvent {
  date: string;
  type: 'writing' | 'character' | 'scene' | 'milestone';
  description: string;
}

export function StoryStatisticsPage() {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'all'>('month');

  const stats: StoryStats = {
    wordCount: 45230,
    sceneCount: 24,
    characterCount: 12,
    locationCount: 8,
    dialogueLines: 384,
    daysActive: 45,
    lastEdited: '2024-03-05',
    completionPercentage: 35,
  };

  const characterArcs: CharacterArc[] = [
    { name: 'Hero', appearances: 18, dialogueShare: 35, growth: 75 },
    { name: 'Villain', appearances: 12, dialogueShare: 25, growth: 60 },
    { name: 'Mentor', appearances: 8, dialogueShare: 15, growth: 40 },
    { name: 'Sidekick', appearances: 15, dialogueShare: 20, growth: 55 },
    { name: 'Love Interest', appearances: 10, dialogueShare: 12, growth: 50 },
  ];

  const recentEvents: TimelineEvent[] = [
    { date: '2024-03-05', type: 'writing', description: 'Wrote 1,240 words in Chapter 3' },
    { date: '2024-03-04', type: 'character', description: 'Added new character: "The Merchant"' },
    { date: '2024-03-03', type: 'scene', description: 'Created scene: "The Marketplace"' },
    { date: '2024-03-02', type: 'milestone', description: 'Reached 45,000 words!' },
    { date: '2024-03-01', type: 'writing', description: 'Wrote 890 words in Chapter 3' },
  ];

  const writingVelocity = useMemo(() => {
    return Math.round(stats.wordCount / stats.daysActive);
  }, [stats]);

  const estimatedCompletion = useMemo(() => {
    const remaining = 100 - stats.completionPercentage;
    const daysToComplete = remaining / (stats.completionPercentage / stats.daysActive);
    return Math.round(daysToComplete);
  }, [stats]);

  const getEventIcon = (type: TimelineEvent['type']) => {
    switch (type) {
      case 'writing': return <FileText className="w-4 h-4" />;
      case 'character': return <Users className="w-4 h-4" />;
      case 'scene': return <BookOpen className="w-4 h-4" />;
      case 'milestone': return <Award className="w-4 h-4" />;
    }
  };

  const getEventColor = (type: TimelineEvent['type']) => {
    switch (type) {
      case 'writing': return 'bg-blue-500/20 text-blue-500';
      case 'character': return 'bg-green-500/20 text-green-500';
      case 'scene': return 'bg-purple-500/20 text-purple-500';
      case 'milestone': return 'bg-yellow-500/20 text-yellow-500';
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Story Statistics</h1>
          <p className="text-muted-foreground">Track your writing progress and story metrics</p>
        </div>

        <div className="flex items-center gap-2 bg-card rounded-lg p-1">
          {(['week', 'month', 'all'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={cn(
                "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                timeRange === range
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-accent"
              )}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <GlassCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Words</p>
              <p className="text-3xl font-bold">{stats.wordCount.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <FileText className="w-6 h-6 text-primary" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span className="text-green-500">+12%</span>
            <span className="text-muted-foreground">from last month</span>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Scenes</p>
              <p className="text-3xl font-bold">{stats.sceneCount}</p>
            </div>
            <div className="w-12 h-12 bg-purple-500/10 rounded-full flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-purple-500" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Avg </span>
            <span className="font-medium">{Math.round(stats.wordCount / stats.sceneCount)}</span>
            <span className="text-muted-foreground">words per scene</span>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Characters</p>
              <p className="text-3xl font-bold">{stats.characterCount}</p>
            </div>
            <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center">
              <Users className="w-6 h-6 text-green-500" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm">
            <span className="text-muted-foreground"></span>
            <span className="font-medium">{stats.dialogueLines}</span>
            <span className="text-muted-foreground">dialogue lines</span>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Progress</p>
              <p className="text-3xl font-bold">{stats.completionPercentage}%</p>
            </div>
            <div className="w-12 h-12 bg-yellow-500/10 rounded-full flex items-center justify-center">
              <Target className="w-6 h-6 text-yellow-500" />
            </div>
          </div>
          <div className="mt-4">
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-yellow-500 rounded-full transition-all"
                style={{ width: `${stats.completionPercentage}%` }}
              />
            </div>
          </div>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GlassCard className="lg:col-span-2 p-6">
          <h3 className="text-lg font-semibold mb-6">Character Analytics</h3>
          
          <div className="space-y-4">
            {characterArcs.map((char) => (
              <div key={char.name} className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                  {char.name[0]}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium">{char.name}</span>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{char.appearances} scenes</span>
                      <span>{char.dialogueShare}% dialogue</span>
                    </div>
                  </div>
                  
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: `${char.growth}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <h3 className="text-lg font-semibold mb-6">Writing Stats</h3>
          
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Writing Velocity</p>
                <p className="text-xl font-bold">{writingVelocity} words/day</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Days Active</p>
                <p className="text-xl font-bold">{stats.daysActive} days</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Est. Completion</p>
                <p className="text-xl font-bold">~{estimatedCompletion} days</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-yellow-500/10 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-yellow-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Dialogue Ratio</p>
                <p className="text-xl font-bold">{Math.round((stats.dialogueLines * 10 / stats.wordCount) * 100)}%</p>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>

      <GlassCard className="mt-6 p-6">
        <h3 className="text-lg font-semibold mb-6">Recent Activity</h3>
        
        <div className="space-y-4">
          {recentEvents.map((event, index) => (
            <div key={index} className="flex items-start gap-4">
              <div className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                getEventColor(event.type)
              )}>
                {getEventIcon(event.type)}
              </div>
              
              <div className="flex-1">
                <p className="font-medium">{event.description}</p>
                <p className="text-sm text-muted-foreground">{event.date}</p>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
