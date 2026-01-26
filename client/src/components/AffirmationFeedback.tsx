import { motion } from 'framer-motion';
import canvasConfetti from 'canvas-confetti';
import { useEffect } from 'react';

const AFFIRMATIONS = [
  "Nice. That counts.",
  "Momentum unlocked.",
  "You showed up.",
  "This is how progress starts.",
  "One step forward.",
  "You're doing it.",
  "That matters.",
  "Progress, not perfection.",
];

interface AffirmationFeedbackProps {
  isVisible: boolean;
  onComplete?: () => void;
}

export default function AffirmationFeedback({ isVisible, onComplete }: AffirmationFeedbackProps) {
  useEffect(() => {
    if (isVisible) {
      // Trigger confetti
      canvasConfetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10b981', '#3b82f6', '#f59e0b', '#ec4899'],
      });

      // Auto-dismiss after 3 seconds
      const timer = setTimeout(() => {
        onComplete?.();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isVisible, onComplete]);

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
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3, type: 'spring', stiffness: 200 }}
        className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-2xl border-2 border-primary text-center max-w-sm"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="text-5xl mb-4 inline-block"
        >
          ✨
        </motion.div>
        <h3 className="text-2xl font-bold text-foreground mb-2">{randomAffirmation}</h3>
        <p className="text-muted-foreground">Task completed!</p>
      </motion.div>
    </motion.div>
  );
}
