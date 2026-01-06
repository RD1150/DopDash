import { Button } from '@/components/ui/button';
import { Zap, Clock, Shuffle } from 'lucide-react';
import { useStore } from '@/lib/store';
import { motion } from 'framer-motion';

interface QuickWinSuggestionsProps {
  onTaskSelect: (taskId: string) => void;
}

export default function QuickWinSuggestions({ onTaskSelect }: QuickWinSuggestionsProps) {
  const actions = useStore((state) => state.todaysActions);
  const getRandomTask = useStore((state) => state.getRandomTask);
  const setEnergyLevel = useStore((state) => state.setEnergyLevel);
  const getTasksByEnergyLevel = useStore((state) => state.getTasksByEnergyLevel);

  const incompleteTasks = actions.filter(a => !a.completed);
  const easyTasks = getTasksByEnergyLevel(1).filter(a => !a.completed);
  const randomTask = getRandomTask();

  const handleFiveMinutes = () => {
    // Filter for quick tasks (usually easy category)
    const quickTasks = easyTasks.slice(0, 3);
    if (quickTasks.length > 0) {
      const selected = quickTasks[Math.floor(Math.random() * quickTasks.length)];
      onTaskSelect(selected.id);
    }
  };

  const handleTwoMinutes = () => {
    setEnergyLevel(1);
    const easyOptions = getTasksByEnergyLevel(1).filter(a => !a.completed);
    if (easyOptions.length > 0) {
      const selected = easyOptions[0];
      onTaskSelect(selected.id);
    }
  };

  const handleJustGiveMe = () => {
    if (randomTask) {
      onTaskSelect(randomTask.id);
    }
  };

  if (incompleteTasks.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-3"
    >
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Quick Wins</p>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {/* 5 Minutes */}
        <Button
          onClick={handleFiveMinutes}
          variant="outline"
          size="sm"
          className="gap-2 text-xs"
          disabled={easyTasks.length === 0}
        >
          <Clock className="w-3 h-3" />
          5 min task
        </Button>

        {/* 2 Minutes */}
        <Button
          onClick={handleTwoMinutes}
          variant="outline"
          size="sm"
          className="gap-2 text-xs"
          disabled={easyTasks.length === 0}
        >
          <Zap className="w-3 h-3" />
          I have 2 min
        </Button>

        {/* Random */}
        <Button
          onClick={handleJustGiveMe}
          variant="outline"
          size="sm"
          className="gap-2 text-xs"
          disabled={!randomTask}
        >
          <Shuffle className="w-3 h-3" />
          Just give me one
        </Button>
      </div>

      <p className="text-xs text-muted-foreground">
        Can't decide? Pick one of these quick wins. No thinking required.
      </p>
    </motion.div>
  );
}
