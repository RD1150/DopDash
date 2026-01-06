import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { ArrowRight, Heart } from 'lucide-react';

interface ContextSwitchValidatorProps {
  isOpen: boolean;
  onClose: () => void;
  fromTaskId: string;
  toTaskId: string;
  fromTaskText: string;
  toTaskText: string;
}

export default function ContextSwitchValidator({
  isOpen,
  onClose,
  fromTaskId,
  toTaskId,
  fromTaskText,
  toTaskText,
}: ContextSwitchValidatorProps) {
  const addParallelTask = useStore((state) => state.addParallelTask);
  const removeParallelTask = useStore((state) => state.removeParallelTask);

  const handleSwitch = () => {
    // Keep the old task in parallel tracking
    addParallelTask(fromTaskId);
    // Start the new task
    addParallelTask(toTaskId);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-background border border-border rounded-2xl p-8 max-w-md w-full shadow-xl"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Heart className="w-5 h-5 text-red-500" />
              <span className="text-sm font-medium text-muted-foreground">
                Context Switch
              </span>
            </div>
            <h2 className="text-xl font-bold text-foreground">
              Switching tasks is okay
            </h2>
            <p className="text-sm text-muted-foreground mt-2">
              Your brain needs what it needs. This doesn't break your streak.
            </p>
          </div>

          {/* Task Flow */}
          <div className="space-y-3 mb-8">
            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="text-xs font-medium text-muted-foreground mb-1">
                Pausing
              </p>
              <p className="text-sm text-foreground font-medium">{fromTaskText}</p>
            </div>

            <div className="flex justify-center">
              <ArrowRight className="w-5 h-5 text-primary rotate-90" />
            </div>

            <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg">
              <p className="text-xs font-medium text-muted-foreground mb-1">
                Switching to
              </p>
              <p className="text-sm text-foreground font-medium">{toTaskText}</p>
            </div>
          </div>

          {/* Message */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-8">
            <p className="text-sm text-blue-700 dark:text-blue-400">
              <span className="font-bold">You're not failing.</span> You're adapting.
              Both tasks will still count toward your progress.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Keep going
            </Button>
            <Button onClick={handleSwitch} className="flex-1">
              Switch tasks
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
