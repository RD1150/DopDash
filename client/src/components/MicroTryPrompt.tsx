import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Mascot from '@/components/Mascot';
import { RotateCcw, CheckCircle2 } from 'lucide-react';
import { soundManager } from '@/lib/sound';

interface MicroTryPromptProps {
  isOpen: boolean;
  onContinue: () => void;
  onStop: () => void;
  taskName: string;
}

export default function MicroTryPrompt({
  isOpen,
  onContinue,
  onStop,
  taskName,
}: MicroTryPromptProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex flex-col items-center justify-center p-6"
      >
        {/* Mascot */}
        <motion.div
          initial={{ scale: 0.8, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          className="w-40 h-40 mb-6"
        >
          <Mascot pose="hero" className="w-full h-full" />
        </motion.div>

        {/* Message */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center space-y-4 mb-8 max-w-md"
        >
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-foreground">You did it! 🎉</h2>
            <p className="text-lg text-muted-foreground">2 minutes of focus on</p>
            <p className="text-lg font-semibold text-primary">{taskName}</p>
          </div>

          {/* Decision message */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-primary/10 border border-primary/20 rounded-lg p-4 space-y-2"
          >
            <p className="text-sm text-muted-foreground">Want to keep the momentum going?</p>
            <p className="text-sm font-medium text-foreground">No pressure either way.</p>
          </motion.div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex gap-3 w-full max-w-md flex-col sm:flex-row"
        >
          <Button
            variant="outline"
            onClick={() => {
              soundManager.playPop();
              onStop();
            }}
            className="flex-1"
          >
            That's enough for now
          </Button>
          <Button
            onClick={() => {
              soundManager.playPop();
              onContinue();
            }}
            className="flex-1 gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Keep going
          </Button>
        </motion.div>

        {/* Subtle reminder */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-xs text-muted-foreground mt-6 text-center"
        >
          Either choice is a win. You started. That matters.
        </motion.p>
      </motion.div>
    </AnimatePresence>
  );
}
