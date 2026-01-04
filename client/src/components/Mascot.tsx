import { haptics } from '@/lib/haptics';
import { soundManager } from '@/lib/sound';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

export type MascotPose = 
  | 'hero' 
  | 'angry' 
  | 'zen' 
  | 'happy' 
  | 'proud' 
  | 'breathe' 
  | 'waiting' 
  | 'sparkle' 
  | 'angel' 
  | 'shy' 
  | 'stars' 
  | 'down';

interface MascotProps {
  pose: MascotPose;
  className?: string;
  animate?: boolean;
}

export default function Mascot({ pose, className, animate = true }: MascotProps) {
  const [dialogue, setDialogue] = useState<string | null>(null);
  const [showDialogue, setShowDialogue] = useState(false);

  const DIALOGUES = [
    "You're doing great!",
    "I believe in you!",
    "One step at a time.",
    "Squish me again!",
    "You are a wizard!",
    "Nice hair today.",
    "Let's get this bread.",
    "Focus power: 100%",
    "I'm proud of you.",
    "Keep going!",
    "You got this!",
    "Drink some water?",
    "Take a deep breath.",
    "You are enough.",
    "Small steps count."
  ];

  const handleInteraction = () => {
    if (!showDialogue) {
      const randomMsg = DIALOGUES[Math.floor(Math.random() * DIALOGUES.length)];
      setDialogue(randomMsg);
      setShowDialogue(true);
      setTimeout(() => setShowDialogue(false), 3000);
    }
  };

  // Squishy animation variants
  const squishVariants = {
    idle: {
      scaleY: [1, 0.95, 1],
      scaleX: [1, 1.05, 1],
      y: [0, 2, 0],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut" as const
      }
    },
    bounce: {
      y: [0, -20, 0],
      scaleY: [1, 0.9, 1.1, 1],
      transition: {
        duration: 0.5,
        repeat: Infinity,
        repeatType: "reverse" as const
      }
    },
    pop: {
      scale: [0, 1.2, 0.9, 1],
      transition: {
        duration: 0.5,
        ease: "backOut" as const
      }
    }
  };

  const handleTap = () => {
    soundManager.playSquish();
    haptics.medium();
    handleInteraction();
  };

  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      <AnimatePresence>
        {showDialogue && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: -20, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute -top-16 left-1/2 -translate-x-1/2 bg-white dark:bg-zinc-800 px-4 py-2 rounded-2xl shadow-lg border-2 border-primary/20 whitespace-nowrap z-20"
          >
            <div className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-3 h-3 bg-white dark:bg-zinc-800 border-b-2 border-r-2 border-primary/20 rotate-45" />
            <p className="text-sm font-bold text-primary">{dialogue}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.img
        src={`/images/mascot/${pose}.png`}
        alt={`Mascot ${pose}`}
        className="w-full h-full object-contain drop-shadow-lg cursor-pointer"
        variants={squishVariants}
        animate={animate ? "idle" : undefined}
        initial="pop"
        whileTap={{ scale: 0.9, rotate: -5 }}
        onMouseDown={handleTap}
        onMouseEnter={handleInteraction}
      />
    </div>
  );
}
