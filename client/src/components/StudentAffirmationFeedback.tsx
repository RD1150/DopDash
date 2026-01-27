import { motion } from 'framer-motion';
import canvasConfetti from 'canvas-confetti';
import { useEffect } from 'react';

const STUDENT_AFFIRMATIONS = [
  "You did it!",
  "Awesome!",
  "Great job!",
  "You rock!",
  "Keep going!",
  "Nice work!",
  "Yay!",
  "You're amazing!",
];

interface StudentAffirmationFeedbackProps {
  isVisible: boolean;
  onComplete?: () => void;
}

export default function StudentAffirmationFeedback({
  isVisible,
  onComplete,
}: StudentAffirmationFeedbackProps) {
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

  const randomAffirmation = STUDENT_AFFIRMATIONS[
    Math.floor(Math.random() * STUDENT_AFFIRMATIONS.length)
  ];

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
          ⭐
        </motion.div>
        <h3 className="text-2xl font-bold text-foreground mb-2">
          {randomAffirmation}
        </h3>
        <p className="text-muted-foreground">Task completed!</p>
      </motion.div>
    </motion.div>
  );
}
