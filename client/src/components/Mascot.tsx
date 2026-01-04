import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

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

  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      <motion.img
        src={`/images/mascot/${pose}.png`}
        alt={`Mascot ${pose}`}
        className="w-full h-full object-contain drop-shadow-lg"
        variants={squishVariants}
        animate={animate ? "idle" : undefined}
        initial="pop"
        whileTap={{ scale: 0.9, rotate: -5 }}
      />
    </div>
  );
}
