import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { useStore } from '@/lib/store';
import { soundManager } from '@/lib/soundManager';

// Approved completion feedback copy (calm, not celebratory)
const AFFIRMATIONS = [
  "Nice. That counts.",
  "Done.",
  "Good job starting.",
  "You showed up.",
];

interface AffirmationFeedbackProps {
  isVisible: boolean;
  onComplete?: () => void;
}

export default function AffirmationFeedback({ isVisible, onComplete }: AffirmationFeedbackProps) {
  const completionSoundEnabled = useStore((state) => state.completionSoundEnabled);

  useEffect(() => {
    if (isVisible) {
      // Play subtle completion sound if enabled
      if (completionSoundEnabled) {
        soundManager.playSuccess();
      }

      // Auto-dismiss after 2.5 seconds (shorter duration for less intrusive feel)
      const timer = setTimeout(() => {
        onComplete?.();
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [isVisible, onComplete, completionSoundEnabled]);

  if (!isVisible) return null;

  const randomAffirmation = AFFIRMATIONS[Math.floor(Math.random() * AFFIRMATIONS.length)];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: -20 }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 flex items-center justify-center z-40 pointer-events-none"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3, type: 'spring', stiffness: 150 }}
        className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-lg border border-primary/20 text-center max-w-sm"
      >
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className="text-4xl mb-3 inline-block"
        >
          ✓
        </motion.div>
        <h3 className="text-xl font-semibold text-foreground">{randomAffirmation}</h3>
      </motion.div>
    </motion.div>
  );
}
