import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Target, CheckCircle2, Circle, MapPin, User, 
  Plus, Trash2, Edit2, Star,
} from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { cn } from '../lib/utils';

type QuestType = 'main' | 'side' | 'optional';
type QuestStatus = 'active' | 'completed' | 'failed' | 'not_started';

interface QuestObjective {
  id: string;
  description: string;
  completed: boolean;
  optional?: boolean;
}

interface Quest {
  id: string;
  title: string;
  description: string;
  type: QuestType;
  status: QuestStatus;
  objectives: QuestObjective[];
  rewards: string[];
  location?: string;
  giver?: string;
}

const sampleQuests: Quest[] = [
  {
    id: '1',
    title: 'The Lost Artifact',
    description: 'Find the ancient artifact hidden in the ruins.',
    type: 'main',
    status: 'active',
    objectives: [
      { id: 'o1', description: 'Speak to the village elder', completed: true },
      { id: 'o2', description: 'Find the map to the ruins', completed: true },
      { id: 'o3', description: 'Navigate through the ancient maze', completed: false },
      { id: 'o4', description: 'Retrieve the artifact', completed: false },
    ],
    rewards: ['500 XP', 'Ancient Sword', 'Elder\'s Blessing'],
    location: 'Ancient Ruins',
    giver: 'Village Elder',
  },
  {
    id: '2',
    title: 'Bandit Trouble',
    description: 'Drive the bandits away from the trade route.',
    type: 'side',
    status: 'active',
    objectives: [
      { id: 'o1', description: 'Defeat 5 bandits', completed: false, optional: true },
      { id: 'o2', description: 'Find the bandit leader', completed: false },
      { id: 'o3', description: 'Defeat the bandit leader', completed: false },
    ],
    rewards: ['200 XP', '50 Gold'],
    location: 'Trade Route',
    giver: 'Merchant Guild',
  },
];

const typeColors: Record<QuestType, string> = {
  main: 'bg-yellow-500/20 text-yellow-600 border-yellow-500/30',
  side: 'bg-blue-500/20 text-blue-600 border-blue-500/30',
  optional: 'bg-gray-500/20 text-gray-600 border-gray-500/30',
};

const statusIcons: Record<QuestStatus, typeof CheckCircle2> = {
  active: Circle,
  completed: CheckCircle2,
  failed: Circle,
  not_started: Circle,
};

export function QuestManagerPage() {
  const [quests, setQuests] = useState<Quest[]>(sampleQuests);
  const [selectedQuest, setSelectedQuest] = useState<string | null>('1');
  const [filter, setFilter] = useState<'all' | QuestType>('all');

  const filteredQuests = quests.filter(q => {
    if (filter !== 'all' && q.type !== filter) return false;
    return true;
  });

  const toggleObjective = (questId: string, objectiveId: string) => {
    setQuests(quests.map(q => {
      if (q.id !== questId) return q;
      return {
        ...q,
        objectives: q.objectives.map(o => 
          o.id === objectiveId ? { ...o, completed: !o.completed } : o
        )
      };
    }));
  };

  const updateQuestStatus = (questId: string, status: QuestStatus) => {
    setQuests(quests.map(q => q.id === questId ? { ...q, status } : q));
  };

  const deleteQuest = (questId: string) => {
    setQuests(quests.filter(q => q.id !== questId));
    if (selectedQuest === questId) setSelectedQuest(null);
  };

  const selectedQuestData = quests.find(q => q.id === selectedQuest);
  const completionPercentage = selectedQuestData
    ? Math.round((selectedQuestData.objectives.filter(o => o.completed).length / selectedQuestData.objectives.length) * 100)
    : 0;

  return (
    <div className="h-screen flex bg-background">
      <div className="w-80 border-r border-border bg-card/50 flex flex-col">
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold flex items-center gap-2">
              <Target className="w-5 h-5" />
              Quests
            </h2>
            <button className="p-2 bg-primary text-primary-foreground rounded-lg">
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="flex gap-1">
            {(['all', 'main', 'side', 'optional'] as const).map(type => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={cn(
                  "px-3 py-1 text-xs rounded-full capitalize transition-colors",
                  filter === type ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"
                )}
              >
                {type === 'all' ? 'All' : type}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          <div className="space-y-2">
            {filteredQuests.map(quest => {
              const StatusIcon = statusIcons[quest.status];
              const progress = Math.round((quest.objectives.filter(o => o.completed).length / quest.objectives.length) * 100);
              
              return (
                <button
                  key={quest.id}
                  onClick={() => setSelectedQuest(quest.id)}
                  className={cn(
                    "w-full text-left p-3 rounded-lg border transition-all",
                    selectedQuest === quest.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <StatusIcon className={cn(
                      "w-5 h-5 shrink-0 mt-0.5",
                      quest.status === 'completed' && "text-green-500",
                      quest.status === 'active' && "text-blue-500"
                    )} />
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium truncate">{quest.title}</p>
                        <span className={cn("text-[10px] px-1.5 py-0.5 rounded border capitalize", typeColors[quest.type])}>
                          {quest.type}
                        </span>
                      </div>
                      
                      <p className="text-sm text-muted-foreground line-clamp-1">{quest.description}</p>
                      
                      <div className="mt-2">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-muted-foreground">{progress}% complete</span>
                          <span className="text-muted-foreground">{quest.objectives.filter(o => o.completed).length}/{quest.objectives.length}</span>
                        </div>
                        
                        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                          <div 
                            className={cn("h-full rounded-full transition-all", quest.status === 'completed' ? "bg-green-500" : "bg-primary")}
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {selectedQuestData ? (
          <div className="max-w-3xl mx-auto">
            <GlassCard className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className={cn("text-xs px-2 py-1 rounded border capitalize", typeColors[selectedQuestData.type])}>
                      {selectedQuestData.type} Quest
                    </span>
                    
                    <select
                      value={selectedQuestData.status}
                      onChange={(e) => updateQuestStatus(selectedQuestData.id, e.target.value as QuestStatus)}
                      className="text-xs px-2 py-1 bg-muted rounded border-0"
                    >
                      <option value="not_started">Not Started</option>
                      <option value="active">Active</option>
                      <option value="completed">Completed</option>
                      <option value="failed">Failed</option>
                    </select>
                  </div>
                  
                  <h1 className="text-2xl font-bold">{selectedQuestData.title}</h1>
                  <p className="text-muted-foreground mt-1">{selectedQuestData.description}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-accent rounded">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => deleteQuest(selectedQuestData.id)} className="p-2 hover:text-destructive rounded">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {selectedQuestData.location && (
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span>{selectedQuestData.location}</span>
                  </div>
                )}
                
                {selectedQuestData.giver && (
                  <div className="flex items-center gap-2 text-sm">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span>{selectedQuestData.giver}</span>
                  </div>
                )}
              </div>

              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Objectives</h3>
                  <span className="text-sm text-muted-foreground">
                    {selectedQuestData.objectives.filter(o => o.completed).length} of {selectedQuestData.objectives.length} complete
                  </span>
                </div>
                
                <div className="h-2 bg-muted rounded-full overflow-hidden mb-4">
                  <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${completionPercentage}%` }} />
                </div>

                <div className="space-y-2">
                  {selectedQuestData.objectives.map(objective => (
                    <div
                      key={objective.id}
                      onClick={() => toggleObjective(selectedQuestData.id, objective.id)}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all",
                        objective.completed ? "bg-green-500/5 border-green-500/30" : "bg-card border-border hover:border-primary/30",
                        objective.optional && "border-dashed"
                      )}
                    >
                      <div className={cn("w-5 h-5 rounded border-2 flex items-center justify-center transition-colors", objective.completed ? "bg-green-500 border-green-500" : "border-muted-foreground")}>
                        {objective.completed && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                      </div>
                      
                      <span className={cn("flex-1", objective.completed && "line-through text-muted-foreground")}>
                        {objective.description}
                      </span>
                      
                      {objective.optional && <span className="text-xs text-muted-foreground">Optional</span>}
                    </div>
                  ))}
                </div>

                <button className="w-full mt-3 py-2 border-2 border-dashed border-border rounded-lg hover:border-primary hover:text-primary transition-colors text-sm">
                  + Add Objective
                </button>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Rewards</h3>
                
                <div className="flex flex-wrap gap-2">
                  {selectedQuestData.rewards.map((reward, index) => (
                    <span key={index} className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-500/10 text-yellow-600 rounded-full text-sm">
                      <Star className="w-3.5 h-3.5" />
                      {reward}
                    </span>
                  ))}
                </div>
              </div>
            </GlassCard>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-muted-foreground">Select a quest to view details</div>
        )}
      </div>
    </div>
  );
}
