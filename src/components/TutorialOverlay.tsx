import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, ChevronRight, ChevronLeft, Sparkles, BookOpen, 
  MousePointer, Keyboard, Zap, CheckCircle2
} from 'lucide-react';
import { GlassCard } from './GlassCard';
import { cn } from '../lib/utils';

interface TutorialStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  target?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

const tutorialSteps: TutorialStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to Bibliarch!',
    description: 'Your all-in-one storytelling platform. Let\'s take a quick tour to get you started.',
    icon: <Sparkles className="w-6 h-6 text-violet-500" />,
  },
  {
    id: 'canvas',
    title: 'The Canvas',
    description: 'Organize your ideas with drag-and-drop nodes. Create folders, connect thoughts, and build your story visually.',
    icon: <MousePointer className="w-6 h-6 text-blue-500" />,
    target: '.canvas-area',
    position: 'right',
  },
  {
    id: 'characters',
    title: 'Character Creator',
    description: 'Build deep characters with 3D previews, personality traits, memories, and relationship tracking.',
    icon: <BookOpen className="w-6 h-6 text-green-500" />,
    target: '.character-creator',
    position: 'left',
  },
  {
    id: 'timeline',
    title: 'Timeline System',
    description: 'Map out your story\'s events, plot points, and character arcs on an interactive timeline.',
    icon: <Zap className="w-6 h-6 text-yellow-500" />,
    target: '.timeline-area',
    position: 'top',
  },
  {
    id: 'ai',
    title: 'AI Assistant',
    description: 'Stuck? Our AI can help continue your story, polish dialogue, or beat writer\'s block.',
    icon: <Sparkles className="w-6 h-6 text-pink-500" />,
    target: '.ai-button',
    position: 'bottom',
  },
  {
    id: 'complete',
    title: 'You\'re Ready!',
    description: 'Start creating your masterpiece. Remember, you can always access help from the settings menu.',
    icon: <CheckCircle2 className="w-6 h-6 text-green-500" />,
  },
];

interface TutorialOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete?: () => void;
}

export function TutorialOverlay({ isOpen, onClose, onComplete }: TutorialOverlayProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [hasSeenTutorial, setHasSeenTutorial] = useState(false);

  useEffect(() => {
    // Check if user has seen tutorial before
    const seen = localStorage.getItem('bibliarch-tutorial-seen');
    if (seen) {
      setHasSeenTutorial(true);
    }
  }, []);

  useEffect(() => {
    if (!hasSeenTutorial && isOpen) {
      // Auto-show tutorial for first-time users
    }
  }, [hasSeenTutorial, isOpen]);

  const step = tutorialSteps[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === tutorialSteps.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      handleComplete();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(0, prev - 1));
  };

  const handleComplete = () => {
    localStorage.setItem('bibliarch-tutorial-seen', 'true');
    setHasSeenTutorial(true);
    onComplete?.();
    onClose();
  };

  const handleSkip = () => {
    localStorage.setItem('bibliarch-tutorial-seen', 'true');
    setHasSeenTutorial(true);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      >
        {/* Spotlight effect for targeted elements */}
        {step.target && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 bg-black/40" />
          </div>
        )}

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-lg"
        >
          <GlassCard className="overflow-hidden">
            {/* Header with progress */}
            <div className="px-6 pt-6 pb-4 border-b border-border">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-muted-foreground">
                    Step {currentStep + 1} of {tutorialSteps.length}
                  </span>
                </div>
                
                <button
                  onClick={handleSkip}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Skip tour
                </button>
              </div>
              
              {/* Progress bar */}
              <div className="h-1 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-violet-500 to-pink-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentStep + 1) / tutorialSteps.length) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>

            {/* Content */}
            <div className="px-6 py-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="text-center"
                >
                  {/* Icon */}
                  <div className="w-20 h-20 bg-gradient-to-br from-violet-500/20 to-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    {step.icon}
                  </div>

                  {/* Title */}
                  <h2 className="text-2xl font-bold mb-3">{step.title}</h2>

                  {/* Description */}
                  <p className="text-muted-foreground leading-relaxed max-w-sm mx-auto">
                    {step.description}
                  </p>

                  {/* Keyboard shortcut hint */}
                  {step.id === 'canvas' && (
                    <div className="mt-6 flex items-center justify-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Keyboard className="w-4 h-4" />
                        <span>Space to preview</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MousePointer className="w-4 h-4" />
                        <span>Drag to move</span>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Footer with navigation */}
            <div className="px-6 pb-6">
              <div className="flex items-center justify-between">
                <button
                  onClick={handlePrevious}
                  disabled={isFirstStep}
                  className={cn(
                    "flex items-center gap-1 px-4 py-2 rounded-lg transition-colors",
                    isFirstStep
                      ? "text-muted-foreground cursor-not-allowed"
                      : "hover:bg-accent"
                  )}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>

                <div className="flex gap-1">
                  {tutorialSteps.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentStep(index)}
                      className={cn(
                        "w-2 h-2 rounded-full transition-colors",
                        index === currentStep
                          ? "bg-primary"
                          : "bg-muted hover:bg-accent"
                      )}
                    />
                  ))}
                </div>

                <button
                  onClick={handleNext}
                  className={cn(
                    "flex items-center gap-1 px-4 py-2 rounded-lg font-medium transition-colors",
                    isLastStep
                      ? "bg-green-500 text-white hover:bg-green-600"
                      : "bg-primary text-primary-foreground hover:bg-primary/90"
                  )}
                >
                  {isLastStep ? (
                    <>Get Started</>
                  ) : (
                    <>
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// Hook to manage tutorial state
export function useTutorial() {
  const [showTutorial, setShowTutorial] = useState(false);
  const [hasSeenTutorial, setHasSeenTutorial] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem('bibliarch-tutorial-seen');
    if (!seen) {
      setShowTutorial(true);
    } else {
      setHasSeenTutorial(true);
    }
  }, []);

  const startTutorial = () => {
    setShowTutorial(true);
  };

  const closeTutorial = () => {
    setShowTutorial(false);
  };

  const resetTutorial = () => {
    localStorage.removeItem('bibliarch-tutorial-seen');
    setHasSeenTutorial(false);
    setShowTutorial(true);
  };

  return {
    showTutorial,
    hasSeenTutorial,
    startTutorial,
    closeTutorial,
    resetTutorial,
  };
}
