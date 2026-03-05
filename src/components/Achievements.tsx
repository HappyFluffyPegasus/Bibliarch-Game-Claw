import { useEffect, useState } from 'react';
import { Trophy, BookOpen, Users, Video, Map, Sparkles, Target, Zap } from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { cn } from '../lib/utils';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  unlocked: boolean;
  unlockedAt?: Date;
  progress: number;
  maxProgress: number;
  color: string;
}

export function useAchievements() {
  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: 'first-story',
      title: 'Storyteller',
      description: 'Create your first story',
      icon: BookOpen,
      unlocked: false,
      progress: 0,
      maxProgress: 1,
      color: '#8b5cf6'
    },
    {
      id: 'character-creator',
      title: 'Character Creator',
      description: 'Create 5 characters',
      icon: Users,
      unlocked: false,
      progress: 0,
      maxProgress: 5,
      color: '#3b82f6'
    },
    {
      id: 'world-builder',
      title: 'World Builder',
      description: 'Create a world with 3 locations',
      icon: Map,
      unlocked: false,
      progress: 0,
      maxProgress: 3,
      color: '#22c55e'
    },
    {
      id: 'scene-director',
      title: 'Scene Director',
      description: 'Create 3 scenes',
      icon: Video,
      unlocked: false,
      progress: 0,
      maxProgress: 3,
      color: '#f59e0b'
    },
    {
      id: 'ai-collaborator',
      title: 'AI Collaborator',
      description: 'Use AI assistant 10 times',
      icon: Sparkles,
      unlocked: false,
      progress: 0,
      maxProgress: 10,
      color: '#ec4899'
    },
    {
      id: 'master-storyteller',
      title: 'Master Storyteller',
      description: 'Complete a story with all sections filled',
      icon: Trophy,
      unlocked: false,
      progress: 0,
      maxProgress: 1,
      color: '#eab308'
    },
  ]);

  const unlockAchievement = (id: string) => {
    setAchievements(prev => prev.map(a => 
      a.id === id && !a.unlocked 
        ? { ...a, unlocked: true, unlockedAt: new Date() }
        : a
    ));
  };

  const updateProgress = (id: string, progress: number) => {
    setAchievements(prev => prev.map(a => {
      if (a.id === id) {
        const newProgress = Math.min(progress, a.maxProgress);
        const shouldUnlock = newProgress >= a.maxProgress && !a.unlocked;
        return {
          ...a,
          progress: newProgress,
          unlocked: shouldUnlock ? true : a.unlocked,
          unlockedAt: shouldUnlock ? new Date() : a.unlockedAt
        };
      }
      return a;
    }));
  };

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalProgress = Math.round((unlockedCount / achievements.length) * 100);

  return { achievements, unlockAchievement, updateProgress, unlockedCount, totalProgress };
}

export function AchievementsPanel() {
  const { achievements, unlockedCount, totalProgress } = useAchievements();
  const [showAll, setShowAll] = useState(false);

  const displayedAchievements = showAll ? achievements : achievements.slice(0, 3);

  return (
    <GlassCard className="p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-500" />
          <span className="font-semibold">Achievements</span>
        </div>
        <span className="text-sm text-muted-foreground">
          {unlockedCount}/{achievements.length}
        </span>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between text-sm mb-1">
          <span>Progress</span>
          <span className="font-medium">{totalProgress}%</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 transition-all duration-500"
            style={{ width: `${totalProgress}%` }}
          />
        </div>
      </div>

      <div className="space-y-3">
        {displayedAchievements.map(achievement => {
          const Icon = achievement.icon;
          return (
            <div
              key={achievement.id}
              className={cn(
                "flex items-center gap-3 p-3 rounded-lg transition-all",
                achievement.unlocked ? "bg-primary/10" : "bg-muted/50 opacity-70"
              )}
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ 
                  backgroundColor: achievement.unlocked ? achievement.color + '30' : '#374151',
                }}
              >
                <Icon 
                  className="w-5 h-5"
                  style={{ color: achievement.unlocked ? achievement.color : '#9ca3af' }}
                />
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className={cn(
                    "font-medium",
                    achievement.unlocked && "text-primary"
                  )}>
                    {achievement.title}
                  </span>
                  {achievement.unlocked && (
                    <Zap className="w-3 h-3 text-yellow-500" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground">{achievement.description}</p>

                {!achievement.unlocked && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span>{achievement.progress}/{achievement.maxProgress}</span>
                    </div>
                    <div className="h-1 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary/50"
                        style={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {achievements.length > 3 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="w-full mt-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          {showAll ? 'Show Less' : `Show All (${achievements.length})`}
        </button>
      )}
    </GlassCard>
  );
}