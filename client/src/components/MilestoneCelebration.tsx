import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { soundManager } from '@/lib/sound';
import { toast } from 'sonner';

interface MilestoneCelebrationProps {
  percentage: number;
  onComplete?: () => void;
}

const MILESTONE_CONFIG = {
  25: {
    emoji: '🌱',
    message: 'Getting started!',
    color: 'text-green-500',
    soundMethod: 'playPop' as const,
  },
  50: {
    emoji: '🎯',
    message: 'Halfway there!',
    color: 'text-blue-500',
    soundMethod: 'playSuccess' as const,
  },
  75: {
    emoji: '🔥',
    message: 'Almost done!',
    color: 'text-orange-500',
    soundMethod: 'playCombo' as const,
  },
};

export default function MilestoneCelebration({ percentage, onComplete }: MilestoneCelebrationProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [currentMilestone, setCurrentMilestone] = useState<25 | 50 | 75 | null>(null);

  useEffect(() => {
    // Check if we've hit a milestone
    const milestones = [25, 50, 75] as const;
    const hitMilestone = milestones.find(m => percentage >= m && percentage < m + 10);
    
    if (hitMilestone && hitMilestone !== currentMilestone) {
      setCurrentMilestone(hitMilestone);
      setIsVisible(true);
      
      const config = MILESTONE_CONFIG[hitMilestone];
      
      // Play sound
      if (config.soundMethod === 'playCombo') {
        soundManager.playCombo(3); // Play a 3-combo sound
      } else {
        soundManager[config.soundMethod]();
      }
      
      // Show toast
      toast.success(config.message, {
        description: `${percentage}% of your Quick Wins completed!`,
        icon: config.emoji,
      });
      
      // Hide after animation
      const timer = setTimeout(() => {
        setIsVisible(false);
        onComplete?.();
      }, 2500);
      
      return () => clearTimeout(timer);
    }
  }, [percentage, currentMilestone, onComplete]);

  if (!isVisible || !currentMilestone) return null;

  const config = MILESTONE_CONFIG[currentMilestone];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        transition={{
          type: 'spring',
          stiffness: 260,
          damping: 20,
        }}
        className="fixed inset-0 z-[9998] flex items-center justify-center pointer-events-none"
      >
        {/* Background overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black"
        />

        {/* Celebration content */}
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, -5, 5, 0],
          }}
          transition={{
            duration: 0.5,
            repeat: 2,
          }}
          className="relative z-10"
        >
          {/* Main emoji */}
          <div className="text-9xl mb-4 text-center">
            {config.emoji}
          </div>

          {/* Message */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center"
          >
            <h2 className={`text-4xl font-bold ${config.color} drop-shadow-lg mb-2`}>
              {config.message}
            </h2>
            <p className="text-2xl text-white drop-shadow-lg">
              {percentage}% Complete
            </p>
          </motion.div>

          {/* Sparkles */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, x: 0, y: 0 }}
              animate={{
                scale: [0, 1, 0],
                x: Math.cos((i * Math.PI * 2) / 8) * 100,
                y: Math.sin((i * Math.PI * 2) / 8) * 100,
              }}
              transition={{
                duration: 1,
                delay: 0.1 + i * 0.05,
              }}
              className="absolute top-1/2 left-1/2 text-4xl"
            >
              ✨
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
