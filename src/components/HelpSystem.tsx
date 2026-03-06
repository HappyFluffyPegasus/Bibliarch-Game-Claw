import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HelpCircle, X, ChevronRight, ChevronLeft, BookOpen,
  MousePointer, Keyboard, Sparkles, Zap, CheckCircle2
} from 'lucide-react';
import { GlassCard } from './GlassCard';
import { cn } from '../lib/utils';

interface TutorialStep {
  id: string;
  title: string;
  description: string;
  icon: typeof HelpCircle;
  tips: string[];
}

const tutorialSteps: TutorialStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to Bibliarch',
    description: 'Your all-in-one storytelling platform.',
    icon: Sparkles,
    tips: ['Everything autosaves', 'Use Cmd+K to navigate', 'Access help anytime']
  },
  {
    id: 'canvas',
    title: 'Canvas Notes',
    description: 'Organize ideas visually with nodes.',
    icon: MousePointer,
    tips: ['Drag to rearrange', 'Double-click to edit', 'Use folders']
  },
  {
    id: 'characters',
    title: 'Character Creator',
    description: 'Bring characters to life.',
    icon: Zap,
    tips: ['3D customization', 'Write personalities', 'Track evolution']
  },
];

export function HelpSystem() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const step = tutorialSteps[currentStep];
  const Icon = step.icon;

  const nextStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsOpen(false);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 right-4 z-50 w-12 h-12 bg-card border border-border rounded-full shadow-lg hover:scale-110 transition-transform flex items-center justify-center"
      >
        <HelpCircle className="w-5 h-5" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <GlassCard className="p-0 overflow-hidden">
                <div className="relative h-32 bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center">
                  <button onClick={() => setIsOpen(false)} className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full">
                    <X className="w-5 h-5" />
                  </button>
                  
                  <motion.div
                    key={step.id}
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    className="w-16 h-16 bg-card rounded-2xl flex items-center justify-center shadow-xl"
                  >
                    <Icon className="w-8 h-8 text-primary" />
                  </motion.div>
                </div>

                <div className="p-6">
                  <div className="text-center mb-6">
                    <motion.h3 key={step.title} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-xl font-bold mb-2">
                      {step.title}
                    </motion.h3>
                    
                    <motion.p key={step.description} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-muted-foreground">
                      {step.description}
                    </motion.p>
                  </div>

                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="bg-muted rounded-xl p-4 mb-6">
                    <p className="text-sm font-medium mb-3">Quick Tips:</p>
                    
                    <ul className="space-y-2">
                      {step.tips.map((tip, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <span className="text-primary mt-0.5">•</span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </motion.div>

                  <div className="flex items-center justify-center gap-2 mb-6">
                    {tutorialSteps.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentStep(i)}
                        className={cn("h-2 rounded-full transition-all", i === currentStep ? "w-6 bg-primary" : "w-2 bg-muted-foreground/30")}
                      />
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <button onClick={prevStep} disabled={currentStep === 0} className={cn("flex items-center gap-1 px-4 py-2 rounded-lg", currentStep === 0 ? "opacity-50" : "hover:bg-accent")}>
                      <ChevronLeft className="w-4 h-4" /> Back
                    </button>

                    <span className="text-sm text-muted-foreground">{currentStep + 1} of {tutorialSteps.length}</span>

                    <button onClick={nextStep} className="flex items-center gap-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg">
                      {currentStep === tutorialSteps.length - 1 ? 'Finish' : 'Next'}
                      {currentStep < tutorialSteps.length - 1 && <ChevronRight className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
