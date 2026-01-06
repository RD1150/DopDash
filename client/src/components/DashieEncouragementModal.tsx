import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Mascot from '@/components/Mascot';
import { Heart, RotateCcw } from 'lucide-react';
import { soundManager } from '@/lib/sound';

interface DashieEncouragementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResume: () => void;
  elapsedTime: number;
  taskName: string;
}

const ENCOURAGEMENT_MESSAGES = [
  {
    title: "You did good.",
    subtitle: "Seriously. You showed up.",
    emoji: "💚"
  },
  {
    title: "That counts.",
    subtitle: "Every second of effort is a win.",
    emoji: "⭐"
  },
  {
    title: "No shame here.",
    subtitle: "Your brain needed what it needed.",
    emoji: "🫂"
  },
  {
    title: "You're not broken.",
    subtitle: "You're just being human.",
    emoji: "✨"
  },
  {
    title: "Come back when ready.",
    subtitle: "No pressure. No judgment.",
    emoji: "🌱"
  },
];

export default function DashieEncouragementModal({
  isOpen,
  onClose,
  onResume,
  elapsedTime,
  taskName,
}: DashieEncouragementModalProps) {
  const message = ENCOURAGEMENT_MESSAGES[Math.floor(Math.random() * ENCOURAGEMENT_MESSAGES.length)];
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleResume = () => {
    soundManager.playPop();
    onResume();
  };

  const handleClose = () => {
    soundManager.playPop();
    onClose();
  };

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
            <div className="text-4xl mb-2">{message.emoji}</div>
            <h2 className="text-2xl font-bold text-foreground">{message.title}</h2>
            <p className="text-lg text-muted-foreground">{message.subtitle}</p>
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-primary/10 border border-primary/20 rounded-lg p-4 space-y-2"
          >
            <p className="text-sm text-muted-foreground">You focused on</p>
            <p className="text-lg font-bold text-foreground">{taskName}</p>
            <p className="text-sm text-primary font-medium">{formatTime(elapsedTime)} of effort</p>
          </motion.div>

          {/* Heart note */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex items-center justify-center gap-2 text-sm text-muted-foreground"
          >
            <Heart className="w-4 h-4 text-red-500 fill-red-500" />
            <span>That's real progress</span>
          </motion.div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex gap-3 w-full max-w-md"
        >
          <Button
            variant="outline"
            onClick={handleClose}
            className="flex-1"
          >
            Take a break
          </Button>
          <Button
            onClick={handleResume}
            className="flex-1 gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Resume
          </Button>
        </motion.div>

        {/* Subtle reminder */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-xs text-muted-foreground mt-6 text-center"
        >
          You can come back anytime. No judgment. Just progress.
        </motion.p>
      </motion.div>
    </AnimatePresence>
  );
}
