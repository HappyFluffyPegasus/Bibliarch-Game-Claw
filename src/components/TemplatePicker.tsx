import { useState } from 'react';
import { Plus, FileText, BookOpen, Users, Map, Sparkles, X, Check } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { cn } from '../lib/utils';

interface Template {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  category: string;
  nodes: Array<{
    type: string;
    x: number;
    y: number;
    text?: string;
    children?: Array<{ type: string; text?: string }>;
  }>;
}

const templates: Template[] = [
  {
    id: 'blank',
    name: 'Blank Canvas',
    description: 'Start with an empty canvas',
    icon: FileText,
    category: 'Basic',
    nodes: []
  },
  {
    id: 'story-planner',
    name: 'Story Planner',
    description: 'Pre-built structure for planning your story',
    icon: BookOpen,
    category: 'Planning',
    nodes: [
      { type: 'folder', x: 400, y: 200, text: 'Characters', children: [
        { type: 'character', text: 'Protagonist' },
        { type: 'character', text: 'Antagonist' },
        { type: 'character', text: 'Supporting' }
      ]},
      { type: 'folder', x: 800, y: 200, text: 'Plot Points', children: [
        { type: 'text', text: 'Inciting Incident' },
        { type: 'text', text: 'Rising Action' },
        { type: 'text', text: 'Climax' },
        { type: 'text', text: 'Resolution' }
      ]},
      { type: 'folder', x: 600, y: 400, text: 'World Building', children: [
        { type: 'location', text: 'Main Setting' },
        { type: 'text', text: 'Lore & History' },
        { type: 'text', text: 'Magic System / Rules' }
      ]}
    ]
  },
  {
    id: 'character-study',
    name: 'Character Study',
    description: 'Deep dive into a single character',
    icon: Users,
    category: 'Character',
    nodes: [
      { type: 'character', x: 400, y: 200, text: 'Main Character' },
      { type: 'text', x: 200, y: 400, text: 'Backstory' },
      { type: 'text', x: 400, y: 400, text: 'Motivations' },
      { type: 'text', x: 600, y: 400, text: 'Fears & Flaws' },
      { type: 'text', x: 200, y: 550, text: 'Relationships' },
      { type: 'text', x: 400, y: 550, text: 'Character Arc' },
      { type: 'text', x: 600, y: 550, text: 'Voice & Speech' }
    ]
  },
  {
    id: 'world-building',
    name: 'World Building',
    description: 'Build your story world from scratch',
    icon: Map,
    category: 'World',
    nodes: [
      { type: 'folder', x: 400, y: 150, text: 'Geography', children: [
        { type: 'location', text: 'Main Continent' },
        { type: 'location', text: 'Key Locations' }
      ]},
      { type: 'folder', x: 200, y: 350, text: 'History', children: [
        { type: 'text', text: 'Ancient Times' },
        { type: 'text', text: 'Recent Events' }
      ]},
      { type: 'folder', x: 600, y: 350, text: 'Culture', children: [
        { type: 'text', text: 'Religions' },
        { type: 'text', text: 'Politics' },
        { type: 'text', text: 'Daily Life' }
      ]},
      { type: 'folder', x: 400, y: 550, text: 'Magic/Technology', children: [
        { type: 'text', text: 'System Rules' },
        { type: 'text', text: 'Limitations' }
      ]}
    ]
  },
  {
    id: 'three-act',
    name: 'Three-Act Structure',
    description: 'Classic three-act story structure',
    icon: BookOpen,
    category: 'Structure',
    nodes: [
      { type: 'text', x: 200, y: 200, text: 'Act 1: Setup\n- Hook\n- Inciting Incident' },
      { type: 'text', x: 500, y: 200, text: 'Act 2: Confrontation\n- Rising Action\n- Midpoint' },
      { type: 'text', x: 800, y: 200, text: 'Act 3: Resolution\n- Climax\n- Denouement' },
      { type: 'folder', x: 500, y: 400, text: 'Key Scenes', children: [
        { type: 'text', text: 'Opening Scene' },
        { type: 'text', text: 'Plot Point 1' },
        { type: 'text', text: 'Plot Point 2' },
        { type: 'text', text: 'Final Scene' }
      ]}
    ]
  }
];

interface TemplatePickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (template: Template) => void;
}

export function TemplatePicker({ isOpen, onClose, onSelect }: TemplatePickerProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [hoveredTemplate, setHoveredTemplate] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSelect = (template: Template) => {
    onSelect(template);
    onClose();
  };

  const categories = Array.from(new Set(templates.map(t => t.category)));

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <GlassCard className="w-full max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-2xl font-bold">Choose a Template</h2>
            <p className="text-muted-foreground">Start with a pre-built structure or blank canvas</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-accent rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          <div className="grid md:grid-cols-2 gap-6">
            {templates.map((template) => {
              const Icon = template.icon;
              const isHovered = hoveredTemplate === template.id;
              const isSelected = selectedTemplate === template.id;
              
              return (
                <button
                  key={template.id}
                  onClick={() => handleSelect(template)}
                  onMouseEnter={() => setHoveredTemplate(template.id)}
                  onMouseLeave={() => setHoveredTemplate(null)}
                  className={cn(
                    "relative text-left p-6 rounded-xl border-2 transition-all duration-200",
                    isSelected 
                      ? "border-primary bg-primary/5" 
                      : "border-border hover:border-primary/50 hover:shadow-lg"
                  )}
                >
                  <div className="flex items-start gap-4">
                    <div className={cn(
                      "w-14 h-14 rounded-xl flex items-center justify-center transition-colors",
                      isHovered ? "bg-primary/20" : "bg-accent"
                    )}>
                      <Icon className={cn(
                        "w-7 h-7 transition-colors",
                        isHovered ? "text-primary" : "text-muted-foreground"
                      )} />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-lg">{template.name}</h3>
                        <span className="text-xs text-muted-foreground bg-accent px-2 py-1 rounded">
                          {template.category}
                        </span>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-3">{template.description}</p>
                      
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{template.nodes.length} nodes</span>
                        {template.nodes.some(n => n.children) && (
                          <span>Includes folders</span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {isSelected && (
                    <div className="absolute top-4 right-4 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-primary-foreground" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border bg-muted/30">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              <Sparkles className="w-4 h-4 inline mr-1" />
              Templates create pre-placed nodes you can customize
            </p>
            
            <button
              onClick={() => handleSelect(templates[0])}
              className="px-6 py-2 bg-accent hover:bg-accent/80 rounded-lg font-medium transition-colors"
            >
              Start Blank
            </button>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
