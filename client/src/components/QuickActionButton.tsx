import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Zap, Dices } from 'lucide-react';
import { useStore } from '@/lib/store';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';

const QUICK_ACTIONS = [
  {
    id: 'new-task',
    label: 'New Task',
    icon: Plus,
    action: () => {
      // Opens new task dialog
    },
  },
  {
    id: 'micro-try',
    label: 'Try for 2 Min',
    icon: Zap,
    action: () => {
      // Starts micro-try mode with random task
    },
  },
  {
    id: 'random-task',
    label: 'Random Task',
    icon: Dices,
    action: () => {
      // Picks random task and starts
    },
  },
];

export default function QuickActionButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [, setLocation] = useLocation();
  const getRandomTask = useStore((state) => state.getRandomTask);
  const startMicroTry = useStore((state) => state.startMicroTry);

  const handleAction = (actionId: string) => {
    if (actionId === 'random-task') {
      const randomTask = getRandomTask();
      if (randomTask) {
        startMicroTry(randomTask.id);
        setLocation('/dash');
      }
    } else if (actionId === 'micro-try') {
      const randomTask = getRandomTask();
      if (randomTask) {
        startMicroTry(randomTask.id);
        setLocation('/dash');
      }
    }
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-24 right-4 z-30">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute bottom-0 right-0 space-y-3 mb-4"
          >
            {QUICK_ACTIONS.map((action, index) => {
              const Icon = action.icon;
              return (
                <motion.button
                  key={action.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleAction(action.id)}
                  className="flex items-center gap-3 bg-card border border-border rounded-full px-4 py-2 hover:bg-muted transition-colors shadow-lg"
                >
                  <span className="text-sm font-medium">{action.label}</span>
                  <Icon className="w-4 h-4" />
                </motion.button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main FAB Button */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:bg-primary/90 transition-colors"
      >
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <Plus className="w-6 h-6" />
        </motion.div>
      </motion.button>
    </div>
  );
}
