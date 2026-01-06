import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { soundManager } from '@/lib/sound';

const MOOD_EMOJIS = ['😢', '😕', '😐', '🙂', '😄'];
const MOOD_LABELS = ['Terrible', 'Bad', 'Okay', 'Good', 'Great'];

interface MoodCheckProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MoodCheck({ isOpen, onClose }: MoodCheckProps) {
  const recordMoodAfter = useStore((state) => state.recordMoodAfter);
  const moodHistory = useStore((state) => state.moodHistory);

  const handleMoodSelect = (mood: number) => {
    recordMoodAfter(mood);
    soundManager.playSuccess();
    onClose();
  };

  // Get the last mood entry to show improvement
  const lastEntry = moodHistory[moodHistory.length - 1];
  const showImprovement = lastEntry && lastEntry.improvement !== 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-background border border-border rounded-2xl p-8 max-w-sm w-full shadow-xl"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1 hover:bg-muted rounded-lg transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>

            {/* Title */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-2">
                How do you feel now?
              </h2>
              <p className="text-sm text-muted-foreground">
                You just crushed a task. Check in with yourself.
              </p>
            </div>

            {/* Mood Selection */}
            <div className="flex gap-3 justify-center mb-8">
              {MOOD_EMOJIS.map((emoji, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleMoodSelect(index + 1)}
                  className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-muted transition-colors"
                  title={MOOD_LABELS[index]}
                >
                  <span className="text-4xl">{emoji}</span>
                  <span className="text-xs text-muted-foreground font-medium">
                    {MOOD_LABELS[index]}
                  </span>
                </motion.button>
              ))}
            </div>

            {/* Improvement Message (shown after selection) */}
            {showImprovement && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`rounded-lg p-4 text-center text-sm font-medium mb-6 ${
                  lastEntry.improvement > 0
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                    : lastEntry.improvement < 0
                    ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400'
                    : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                }`}
              >
                {lastEntry.improvement > 0 ? (
                  <>
                    <p className="text-lg mb-1">✨ Mood improved!</p>
                    <p>
                      {MOOD_EMOJIS[lastEntry.beforeMood - 1]} → {MOOD_EMOJIS[lastEntry.afterMood - 1]}
                    </p>
                  </>
                ) : lastEntry.improvement < 0 ? (
                  <>
                    <p>Your mood shifted</p>
                    <p>
                      {MOOD_EMOJIS[lastEntry.beforeMood - 1]} → {MOOD_EMOJIS[lastEntry.afterMood - 1]}
                    </p>
                  </>
                ) : (
                  <>
                    <p>You're holding steady</p>
                    <p>{MOOD_EMOJIS[lastEntry.afterMood - 1]}</p>
                  </>
                )}
              </motion.div>
            )}

            {/* Skip Button */}
            <Button
              variant="outline"
              onClick={onClose}
              className="w-full"
            >
              Skip for now
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
