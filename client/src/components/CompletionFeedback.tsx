import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  getRandomAffirmation,
  COMPLETION_ANIMATION,
} from "@shared/emotionalUX";

interface CompletionFeedbackProps {
  isVisible: boolean;
  onComplete?: () => void;
}

/**
 * CompletionFeedback Component
 * Shows calm, emotionally supportive feedback when a task is completed.
 * 
 * Features:
 * - Subtle visual confirmation (fade, glow, gentle lift)
 * - Random affirmation from approved list
 * - Animation duration < 1 second (calm, not celebratory)
 * - No confetti, no loud animations, no productivity language
 */
export function CompletionFeedback({
  isVisible,
  onComplete,
}: CompletionFeedbackProps) {
  const [affirmation, setAffirmation] = useState<string>("");

  useEffect(() => {
    if (isVisible) {
      setAffirmation(getRandomAffirmation());
      const timer = setTimeout(() => {
        onComplete?.();
      }, COMPLETION_ANIMATION.DURATION_MS);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Gentle glow background */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-accent/20 via-transparent to-accent/20 rounded-full blur-3xl"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1.2, opacity: 0.5 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.6 }}
          />

          {/* Checkmark with gentle lift */}
          <motion.div
            className="relative z-10"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <motion.div
              className="w-16 h-16 rounded-full bg-accent/10 border-2 border-accent flex items-center justify-center"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 0.6 }}
            >
              <svg
                className="w-8 h-8 text-accent"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </motion.div>
          </motion.div>

          {/* Affirmation text */}
          <motion.div
            className="absolute bottom-1/4 text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <p className="text-lg font-medium text-foreground max-w-xs">
              {affirmation}
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
