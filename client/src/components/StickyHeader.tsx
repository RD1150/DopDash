import { useStore } from '@/lib/store';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface StickyHeaderProps {
  title?: string;
  showStats?: boolean;
  className?: string;
}

export default function StickyHeader({
  title,
  showStats = true,
  className,
}: StickyHeaderProps) {
  const coins = useStore((state) => state.coins);
  const streak = useStore((state) => state.streak);
  const currentEnergyLevel = useStore((state) => state.currentEnergyLevel);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'sticky top-0 z-20 bg-background/95 backdrop-blur-sm border-b border-border',
        className
      )}
    >
      <div className="flex items-center justify-between px-4 py-3">
        {title && <h1 className="text-lg font-bold">{title}</h1>}

        {showStats && (
          <div className="flex items-center gap-4 ml-auto">
            {/* Streak */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-1 px-3 py-1 rounded-full bg-orange-100/50 dark:bg-orange-900/20"
            >
              <span className="text-sm font-bold text-orange-600 dark:text-orange-400">
                🔥 {streak}
              </span>
            </motion.div>

            {/* Energy Level */}
            {currentEnergyLevel && (
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-1 px-3 py-1 rounded-full bg-blue-100/50 dark:bg-blue-900/20"
              >
                <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                  ⚡ {currentEnergyLevel}/5
                </span>
              </motion.div>
            )}

            {/* Coins */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-100/50 dark:bg-yellow-900/20"
            >
              <span className="text-sm font-bold text-yellow-600 dark:text-yellow-400">
                ⭐ {coins}
              </span>
            </motion.div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
