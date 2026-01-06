import { motion } from 'framer-motion';
import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import { soundManager } from '@/lib/sound';

interface SurpriseMeProps {
  onTaskSelected?: (taskId: string) => void;
}

export default function SurpriseMe({ onTaskSelected }: SurpriseMeProps) {
  const getRandomTask = useStore((state) => state.getRandomTask);
  const currentEnergyLevel = useStore((state) => state.currentEnergyLevel);
  const getTasksByEnergyLevel = useStore((state) => state.getTasksByEnergyLevel);

  const handleSurpriseMe = () => {
    soundManager.playPop();
    
    let selectedTask;
    if (currentEnergyLevel) {
      // Pick random from energy-filtered tasks
      const energyTasks = getTasksByEnergyLevel(currentEnergyLevel);
      if (energyTasks.length > 0) {
        selectedTask = energyTasks[Math.floor(Math.random() * energyTasks.length)];
      }
    }
    
    // Fallback to any random task
    if (!selectedTask) {
      selectedTask = getRandomTask();
    }

    if (selectedTask) {
      onTaskSelected?.(selectedTask.id);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex gap-2"
    >
      <Button
        onClick={handleSurpriseMe}
        variant="outline"
        className="flex-1 gap-2 border-2 border-primary/30 hover:border-primary hover:bg-primary/5"
      >
        <Sparkles className="w-4 h-4" />
        Surprise Me
      </Button>
    </motion.div>
  );
}
