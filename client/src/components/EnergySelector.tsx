import { motion } from 'framer-motion';
import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';

const ENERGY_LEVELS = [
  { level: 1, emoji: '😴', label: 'Exhausted', color: 'text-red-500' },
  { level: 2, emoji: '😕', label: 'Low', color: 'text-orange-500' },
  { level: 3, emoji: '😐', label: 'Okay', color: 'text-yellow-500' },
  { level: 4, emoji: '🙂', label: 'Good', color: 'text-blue-500' },
  { level: 5, emoji: '⚡', label: 'Energized', color: 'text-green-500' },
];

interface EnergySelectorProps {
  onSelect?: () => void;
}

export default function EnergySelector({ onSelect }: EnergySelectorProps) {
  const currentEnergyLevel = useStore((state) => state.currentEnergyLevel);
  const setEnergyLevel = useStore((state) => state.setEnergyLevel);
  const getTasksByEnergyLevel = useStore((state) => state.getTasksByEnergyLevel);

  const handleEnergySelect = (level: number) => {
    setEnergyLevel(level);
    onSelect?.();
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-2">
          How's your energy?
        </h3>
        <p className="text-xs text-muted-foreground">
          We'll suggest tasks that match your vibe
        </p>
      </div>

      <div className="flex gap-2 justify-center">
        {ENERGY_LEVELS.map(({ level, emoji, label, color }) => {
          const isSelected = currentEnergyLevel === level;
          const suggestedTasks = getTasksByEnergyLevel(level);

          return (
            <motion.button
              key={level}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleEnergySelect(level)}
              className={`flex flex-col items-center gap-1 p-3 rounded-lg transition-all ${
                isSelected
                  ? 'bg-primary/20 border-2 border-primary'
                  : 'bg-muted/50 border-2 border-transparent hover:bg-muted'
              }`}
              title={`${label} - ${suggestedTasks.length} tasks available`}
            >
              <span className={`text-2xl ${color}`}>{emoji}</span>
              <span className="text-xs font-medium text-foreground">{label}</span>
              <span className="text-xs text-muted-foreground">{suggestedTasks.length}</span>
            </motion.button>
          );
        })}
      </div>

      {currentEnergyLevel && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-xs text-muted-foreground bg-muted/30 p-2 rounded-lg"
        >
          {getTasksByEnergyLevel(currentEnergyLevel).length} tasks match your energy level
        </motion.div>
      )}
    </div>
  );
}
