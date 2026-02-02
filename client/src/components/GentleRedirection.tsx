import { motion, AnimatePresence } from "framer-motion";
import { type RedirectionMessage } from "@shared/emotionalUX";

interface GentleRedirectionProps {
  message: RedirectionMessage | null;
  onDismiss: () => void;
}

/**
 * GentleRedirection Component
 * Shows inline, non-intrusive redirection messages when users hesitate or abandon tasks.
 *
 * Rules:
 * - No modal popups
 * - No forced actions
 * - No CTA buttons required
 * - Text appears inline or subtly beneath the task
 * - Purpose: emotional orientation, not instruction
 */
export function GentleRedirection({ message, onDismiss }: GentleRedirectionProps) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          className="w-full px-4 py-3 bg-muted/50 border-l-2 border-accent rounded-sm"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          onAnimationComplete={() => {
            // Auto-dismiss after 5 seconds
            const timer = setTimeout(onDismiss, 5000);
            return () => clearTimeout(timer);
          }}
        >
          <p className="text-sm text-muted-foreground italic">
            {message}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
