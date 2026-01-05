import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

interface DashieSlideProps {
  completedCount: number;
  totalCount: number;
}

export default function DashieSlide({ completedCount, totalCount }: DashieSlideProps) {
  const [prevCompleted, setPrevCompleted] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);

  // Calculate progress percentage (0-100)
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
  
  // Calculate Dashie's vertical position based on progress
  // Start at -200px (off screen top), end at 100vh (off screen bottom)
  const dashieY = -200 + (progress / 100) * (window.innerHeight + 200);

  useEffect(() => {
    // Trigger celebration when a new task is completed
    if (completedCount > prevCompleted && completedCount > 0) {
      setShowCelebration(true);
      const timer = setTimeout(() => {
        setShowCelebration(false);
      }, 800);
      
      setPrevCompleted(completedCount);
      
      return () => clearTimeout(timer);
    }
  }, [completedCount, prevCompleted]);

  // Only show Dashie if there's progress
  if (totalCount === 0 || completedCount === 0) return null;

  const isComplete = completedCount === totalCount;

  return (
    <>
      {/* Dashie sliding progressively */}
      <motion.div
        animate={{ 
          y: dashieY,
          x: '-50%',
          rotate: isComplete ? [0, -10, 10, -10, 10, 0] : 0,
          scale: showCelebration ? [1, 1.2, 1] : 1,
        }}
        transition={{
          y: { duration: 0.6, ease: [0.34, 1.56, 0.64, 1] },
          rotate: isComplete ? { duration: 0.5, times: [0, 0.2, 0.4, 0.6, 0.8, 1] } : {},
          scale: { duration: 0.3 },
        }}
        className="fixed left-1/2 z-[9999] pointer-events-none"
        style={{
          top: 0,
          filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.3))',
        }}
      >
        <div className="relative">
          {/* Slide trail effect */}
          {showCelebration && (
            <motion.div
              animate={{
                opacity: [0.5, 0.2, 0],
                scale: [1, 1.5, 2],
              }}
              transition={{
                duration: 0.8,
              }}
              className="absolute inset-0 bg-primary/20 rounded-full blur-xl"
            />
          )}
          
          {/* Dashie character - changes based on completion */}
          <div className="text-7xl relative z-10">
            {isComplete ? '🎉' : '🎯'}
          </div>
          
          {/* Sparkles around Dashie when celebrating */}
          <AnimatePresence>
            {showCelebration && (
              <>
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1, x: 30, y: -20 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="absolute top-0 right-0 text-2xl"
                >
                  ✨
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1, x: -30, y: -20 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  className="absolute top-0 left-0 text-2xl"
                >
                  ⭐
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Progress indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: showCelebration ? 1 : 0.7 }}
          className="absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap"
        >
          <div className={`text-sm font-bold ${isComplete ? 'text-green-500' : 'text-primary'} drop-shadow-lg`}>
            {completedCount}/{totalCount}
          </div>
        </motion.div>

        {/* Completion celebration */}
        <AnimatePresence>
          {isComplete && showCelebration && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5, y: 0 }}
              animate={{ opacity: 1, scale: 1, y: -60 }}
              exit={{ opacity: 0 }}
              className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap"
            >
              <div className="text-2xl font-bold text-green-500 drop-shadow-lg">
                All Done! 🚀
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
}
