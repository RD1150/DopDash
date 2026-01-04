import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/lib/store';
import { soundManager } from '@/lib/sound';
import { haptics } from '@/lib/haptics';
import Mascot from './Mascot';
import { Button } from '@/components/ui/button';
import { X, Timer, Coffee, MessageCircle } from 'lucide-react';

const CHECK_IN_INTERVAL = 5 * 60 * 1000; // 5 minutes
const SPRINT_DURATION = 20 * 60 * 1000; // 20 minutes

const ENCOURAGEMENTS = [
  "Still with you!",
  "You're doing great!",
  "Keep going!",
  "Focus power!",
  "We got this!",
  "Stay in the zone!",
];

const BREAK_SUGGESTIONS = [
  "Drink some water?",
  "Stretch your shoulders?",
  "Take a deep breath.",
  "Look away from the screen.",
];

export default function BodyDouble() {
  const bodyDoubleActive = useStore((state) => state.bodyDoubleActive);
  const bodyDoubleTask = useStore((state) => state.bodyDoubleTask);
  const bodyDoubleStartTime = useStore((state) => state.bodyDoubleStartTime);
  const stopBodyDouble = useStore((state) => state.stopBodyDouble);
  
  const [timeLeft, setTimeLeft] = useState(SPRINT_DURATION);
  const [showBubble, setShowBubble] = useState(false);
  const [bubbleText, setBubbleText] = useState("");
  
  useEffect(() => {
    if (!bodyDoubleActive || !bodyDoubleStartTime) return;

    const interval = setInterval(() => {
      const elapsed = Date.now() - bodyDoubleStartTime;
      const remaining = Math.max(0, SPRINT_DURATION - elapsed);
      
      setTimeLeft(remaining);
      
      if (remaining === 0) {
        soundManager.playSuccess();
        haptics.celebrate();
        stopBodyDouble();
      }
      
      // Random check-ins every ~5 mins
      if (elapsed > 0 && elapsed % CHECK_IN_INTERVAL < 1000) {
        triggerCheckIn();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [bodyDoubleActive, bodyDoubleStartTime, stopBodyDouble]);

  const triggerCheckIn = () => {
    const isBreak = Math.random() > 0.7;
    const text = isBreak 
      ? BREAK_SUGGESTIONS[Math.floor(Math.random() * BREAK_SUGGESTIONS.length)]
      : ENCOURAGEMENTS[Math.floor(Math.random() * ENCOURAGEMENTS.length)];
      
    setBubbleText(text);
    setShowBubble(true);
    soundManager.playPop();
    
    setTimeout(() => setShowBubble(false), 5000);
  };

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  if (!bodyDoubleActive) return null;

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4 shadow-lg z-40 pb-8"
    >
      <div className="max-w-md mx-auto flex items-center gap-4">
        {/* Mascot */}
        <div className="relative w-16 h-16 flex-shrink-0">
          <Mascot pose="working" className="w-full h-full" />
          
          <AnimatePresence>
            {showBubble && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="absolute -top-12 -right-4 bg-white dark:bg-zinc-800 px-3 py-1.5 rounded-xl shadow-sm border border-border text-xs font-medium whitespace-nowrap z-50"
              >
                {bubbleText}
                <div className="absolute bottom-0 left-4 translate-y-1/2 rotate-45 w-2 h-2 bg-white dark:bg-zinc-800 border-r border-b border-border"></div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-1">
            <span className="flex items-center gap-1">
              <Timer className="w-3 h-3" />
              {formatTime(timeLeft)}
            </span>
            <span>•</span>
            <span className="truncate">I'm {bodyDoubleTask?.toLowerCase()}...</span>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-primary"
              initial={{ width: "100%" }}
              animate={{ width: `${(timeLeft / SPRINT_DURATION) * 100}%` }}
              transition={{ duration: 1, ease: "linear" }}
            />
          </div>
        </div>

        {/* Controls */}
        <Button
          variant="ghost"
          size="icon"
          onClick={stopBodyDouble}
          className="text-muted-foreground hover:text-destructive"
        >
          <X className="w-5 h-5" />
        </Button>
      </div>
    </motion.div>
  );
}
