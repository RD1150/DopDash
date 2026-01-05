import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Circle, X, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { useStore } from '@/lib/store';
import { cn } from '@/lib/utils';

interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

export default function OnboardingChecklist() {
  const { 
    onboardingChecklist, 
    setOnboardingChecklist,
    dismissOnboardingChecklist,
    showOnboardingChecklist 
  } = useStore();

  if (!showOnboardingChecklist) return null;

  const checklistItems: ChecklistItem[] = [
    {
      id: 'first_task',
      title: 'Complete your first Quick Win',
      description: 'Tap any micro-task to get started',
      completed: onboardingChecklist?.first_task || false,
    },
    {
      id: 'pet_mascot',
      title: 'Pet your mascot',
      description: 'Give your buddy some love',
      completed: onboardingChecklist?.pet_mascot || false,
    },
    {
      id: 'check_streak',
      title: 'Check your streak',
      description: 'Visit the Streak page',
      completed: onboardingChecklist?.check_streak || false,
    },
    {
      id: 'customize_theme',
      title: 'Customize your vibe',
      description: 'Try a different theme in Settings',
      completed: onboardingChecklist?.customize_theme || false,
    },
    {
      id: 'boss_battle',
      title: 'Start a Boss Battle',
      description: 'Break down a big task',
      completed: onboardingChecklist?.boss_battle || false,
    },
  ];

  const completedCount = checklistItems.filter(item => item.completed).length;
  const totalCount = checklistItems.length;
  const progress = (completedCount / totalCount) * 100;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="fixed bottom-4 right-4 z-50 w-80 bg-card border-2 border-border rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-primary/20 to-primary/10 p-4 relative">
          <button
            onClick={dismissOnboardingChecklist}
            className="absolute top-2 right-2 p-1 hover:bg-background/20 rounded-full transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <h3 className="font-bold text-lg">Welcome Checklist</h3>
          </div>
          
          <p className="text-sm text-muted-foreground mb-3">
            Get started with Dopamine Dasher
          </p>

          {/* Progress Bar */}
          <div className="w-full bg-background/30 rounded-full h-2 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="h-full bg-primary rounded-full"
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {completedCount} of {totalCount} completed
          </p>
        </div>

        {/* Checklist Items */}
        <div className="p-4 space-y-3 max-h-80 overflow-y-auto">
          {checklistItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                "flex items-start gap-3 p-3 rounded-lg transition-all",
                item.completed 
                  ? "bg-primary/10 border border-primary/20" 
                  : "bg-muted/50 hover:bg-muted"
              )}
            >
              {item.completed ? (
                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              ) : (
                <Circle className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
              )}
              
              <div className="flex-1 min-w-0">
                <p className={cn(
                  "font-medium text-sm",
                  item.completed && "line-through text-muted-foreground"
                )}>
                  {item.title}
                </p>
                <p className="text-xs text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer */}
        {completedCount === totalCount && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-primary/10 border-t border-border"
          >
            <p className="text-sm font-medium text-center mb-2">
              🎉 You're all set! Keep going!
            </p>
            <Button
              onClick={dismissOnboardingChecklist}
              className="w-full"
              size="sm"
            >
              Got it!
            </Button>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
