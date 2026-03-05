import { useState } from 'react';
import { Sparkles, Plus, Trash2, GripVertical } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { cn } from '../lib/utils';

interface PersonalityField {
  id: string;
  label: string;
  content: string;
  category: 'core' | 'background' | 'preferences' | 'relationships' | 'custom';
  aiGenerated?: boolean;
}

const defaultFields: PersonalityField[] = [
  { id: 'backstory', label: 'Backstory', content: '', category: 'background' },
  { id: 'outlook', label: 'Outlook on Life', content: '', category: 'core' },
  { id: 'fears', label: 'Fears & Insecurities', content: '', category: 'core' },
  { id: 'desires', label: 'Desires & Goals', content: '', category: 'core' },
  { id: 'speech', label: 'Speech Patterns', content: '', category: 'core' },
  { id: 'childhood', label: 'Childhood', content: '', category: 'background' },
  { id: 'trauma', label: 'Past Trauma', content: '', category: 'background' },
  { id: 'food', label: 'Favorite Food', content: '', category: 'preferences' },
  { id: 'color', label: 'Favorite Color', content: '', category: 'preferences' },
  { id: 'hobbies', label: 'Hobbies', content: '', category: 'preferences' },
];

export function PersonalityCreator() {
  const [fields, setFields] = useState<PersonalityField[]>(defaultFields);
  const [activeCategory, setActiveCategory] = useState<string>('core');
  const [isGenerating, setIsGenerating] = useState(false);

  const categories = [
    { id: 'core', label: 'Core Personality', color: 'text-violet-500' },
    { id: 'background', label: 'Background', color: 'text-blue-500' },
    { id: 'preferences', label: 'Preferences', color: 'text-amber-500' },
    { id: 'relationships', label: 'Relationships', color: 'text-pink-500' },
    { id: 'custom', label: 'Custom Fields', color: 'text-gray-500' },
  ];

  const updateField = (id: string, content: string) => {
    setFields(fields.map(f => f.id === id ? { ...f, content } : f));
  };

  const addCustomField = () => {
    const newField: PersonalityField = {
      id: Date.now().toString(),
      label: 'New Field',
      content: '',
      category: 'custom',
    };
    setFields([...fields, newField]);
  };

  const deleteField = (id: string) => {
    setFields(fields.filter(f => f.id !== id));
  };

  const generateWithAI = async (fieldId: string) => {
    setIsGenerating(true);
    // Simulate AI generation
    await new Promise(r => setTimeout(r, 1500));
    
    const generatedContent: Record<string, string> = {
      backstory: 'Born in the floating city of Aethoria, they were raised by a guild of sky-pirates who taught them the art of cloud-navigation. At age 16, they lost their mentor in a tragic storm, shaping their cautious approach to risk.',
      outlook: 'Life is a series of calculated risks. Trust is earned, not given. Every cloud has a silver lining, but also a storm warning.',
      fears: 'Deep water, abandonment, and the feeling of being truly alone. They mask this with bravado.',
      desires: 'To find the legendary Cloud Compass and prove their worth to the guild that cast them out.',
      speech: 'Speaks in nautical metaphors. Uses "aye" and "yar" when excited. Tends to trail off when nervous.',
    };

    updateField(fieldId, generatedContent[fieldId] || 'AI generated content based on character profile...');
    setIsGenerating(false);
  };

  const filteredFields = fields.filter(f => f.category === activeCategory);

  return (
    <div className="space-y-4">
      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
              activeCategory === cat.id
                ? "bg-primary text-primary-foreground"
                : "bg-accent hover:bg-accent/80"
            )}
          >
            <span className={activeCategory === cat.id ? '' : cat.color}>
              {cat.label}
            </span>
            <span className="ml-2 text-xs opacity-60">
              {fields.filter(f => f.category === cat.id).length}
            </span>
          </button>
        ))}
      </div>

      {/* Fields */}
      <div className="space-y-3">
        {filteredFields.map(field => (
          <GlassCard key={field.id} className="p-4">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab" />
                <input
                  type="text"
                  value={field.label}
                  onChange={(e) => {
                    setFields(fields.map(f => 
                      f.id === field.id ? { ...f, label: e.target.value } : f
                    ));
                  }}
                  className="font-medium bg-transparent border-none focus:outline-none p-0"
                />
              </div>
              
              <div className="flex items-center gap-1">
                <button
                  onClick={() => generateWithAI(field.id)}
                  disabled={isGenerating}
                  className="p-1.5 hover:bg-violet-500/10 text-violet-500 rounded transition-colors"
                  title="Generate with AI"
                >
                  <Sparkles className="w-4 h-4" />
                </button>
                
                {field.category === 'custom' && (
                  <button
                    onClick={() => deleteField(field.id)}
                    className="p-1.5 hover:text-destructive transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
            
            <textarea
              value={field.content}
              onChange={(e) => updateField(field.id, e.target.value)}
              placeholder={`Describe ${field.label.toLowerCase()}...`}
              className="w-full bg-muted/50 rounded-lg p-3 min-h-[100px] resize-y focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            
            <div className="flex justify-between mt-2 text-xs text-muted-foreground">
              <span>{field.content.length} characters</span>
              <span>No limit</span>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Add Custom Field */}
      <button
        onClick={addCustomField}
        className="w-full py-3 border-2 border-dashed border-border rounded-lg hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2"
      >
        <Plus className="w-4 h-4" />
        Add Custom Field
      </button>
    </div>
  );
}
