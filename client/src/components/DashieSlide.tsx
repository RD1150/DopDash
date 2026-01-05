import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

interface DashieSlideProps {
  show: boolean;
  onComplete?: () => void;
}

export default function DashieSlide({ show, onComplete }: DashieSlideProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      // Hide after animation completes
      const timer = setTimeout(() => {
        setIsVisible(false);
        onComplete?.();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: -200, x: '-50%', rotate: -15 }}
          animate={{ 
            y: '100vh',
            x: '-50%',
            rotate: 15,
          }}
          exit={{ opacity: 0 }}
          transition={{
            duration: 1.5,
            ease: [0.34, 1.56, 0.64, 1], // Bouncy easing
          }}
          className="fixed left-1/2 top-0 z-[9999] pointer-events-none"
          style={{
            filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.3))',
          }}
        >
          {/* Dashie sliding down */}
          <div className="relative">
            {/* Slide trail effect */}
            <motion.div
              animate={{
                opacity: [0.5, 0.2, 0],
                scale: [1, 1.2, 1.4],
              }}
              transition={{
                duration: 0.5,
                repeat: Infinity,
                repeatDelay: 0.2,
              }}
              className="absolute inset-0 bg-primary/20 rounded-full blur-xl"
            />
            
            {/* Dashie character */}
            <div className="text-8xl relative z-10">
              🎉
            </div>
            
            {/* Sparkles around Dashie */}
            <motion.div
              animate={{
                rotate: 360,
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: 'linear',
              }}
              className="absolute -top-4 -right-4 text-3xl"
            >
              ✨
            </motion.div>
            <motion.div
              animate={{
                rotate: -360,
              }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                ease: 'linear',
              }}
              className="absolute -bottom-4 -left-4 text-3xl"
            >
              ⭐
            </motion.div>
          </div>

          {/* Celebration text */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="absolute -bottom-12 left-1/2 -translate-x-1/2 whitespace-nowrap"
          >
            <div className="text-2xl font-bold text-primary drop-shadow-lg">
              Woohoo! 🚀
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
