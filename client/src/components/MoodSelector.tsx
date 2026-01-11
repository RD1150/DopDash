import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface MoodSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (mood: 'anxious' | 'bored' | 'overwhelmed' | 'energized') => void;
  currentMood: 'anxious' | 'bored' | 'overwhelmed' | 'energized' | null;
}

const MOODS = [
  { id: 'anxious', label: 'Anxious', emoji: '😰', color: 'from-purple-400 to-purple-600' },
  { id: 'bored', label: 'Bored', emoji: '😑', color: 'from-gray-400 to-gray-600' },
  { id: 'overwhelmed', label: 'Overwhelmed', emoji: '😵', color: 'from-red-400 to-red-600' },
  { id: 'energized', label: 'Energized', emoji: '⚡', color: 'from-yellow-400 to-yellow-600' },
] as const;

export default function MoodSelector({ isOpen, onClose, onSelect, currentMood }: MoodSelectorProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-card rounded-2xl p-6 max-w-sm w-full border border-border shadow-xl"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">How are you feeling?</h2>
              <button
                onClick={onClose}
                className="p-1 hover:bg-accent rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {MOODS.map((mood) => (
                <motion.button
                  key={mood.id}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    onSelect(mood.id as any);
                    onClose();
                  }}
                  className={`p-4 rounded-xl transition-all border-2 ${
                    currentMood === mood.id
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="text-3xl mb-2">{mood.emoji}</div>
                  <p className="text-sm font-medium">{mood.label}</p>
                </motion.button>
              ))}
            </div>

            <p className="text-xs text-muted-foreground text-center mt-4">
              This helps us suggest better tasks for you
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
