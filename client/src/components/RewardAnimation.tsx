import { motion, AnimatePresence } from 'framer-motion';
import canvasConfetti from 'canvas-confetti';
import { useEffect, useState } from 'react';

interface RewardAnimationProps {
  isVisible: boolean;
  coinsEarned?: number;
  xpEarned?: number;
  streakCount?: number;
  onComplete?: () => void;
}

export default function RewardAnimation({
  isVisible,
  coinsEarned = 10,
  xpEarned = 25,
  streakCount = 1,
  onComplete
}: RewardAnimationProps) {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (isVisible) {
      // Trigger confetti after a small delay
      setTimeout(() => {
        setShowConfetti(true);
        // Fire confetti
        canvasConfetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }, 300);

      // Auto-complete after animation
      const timer = setTimeout(() => {
        onComplete?.();
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [isVisible, onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center pointer-events-none z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Dashie celebration */}
          <motion.div
            className="flex flex-col items-center gap-4"
            initial={{ scale: 0, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0, y: -50 }}
            transition={{ type: 'spring', stiffness: 200 }}
          >
            {/* Dashie Image */}
            <motion.img
              src="/images/mascot/hero.png"
              alt="Dashie celebrating"
              className="w-32 h-32 md:w-40 md:h-40"
              animate={{
                y: [0, -20, 0],
                rotate: [0, 5, -5, 0]
              }}
              transition={{
                duration: 0.6,
                repeat: 2,
                ease: 'easeInOut'
              }}
            />

            {/* Reward badges */}
            <div className="flex gap-4 flex-wrap justify-center">
              {/* Coins */}
              {coinsEarned > 0 && (
                <motion.div
                  className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full font-bold flex items-center gap-2"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.2, type: 'spring' }}
                >
                  <span className="text-2xl">🪙</span>
                  <span>+{coinsEarned}</span>
                </motion.div>
              )}

              {/* XP */}
              {xpEarned > 0 && (
                <motion.div
                  className="bg-purple-100 text-purple-700 px-4 py-2 rounded-full font-bold flex items-center gap-2"
                  initial={{ scale: 0, rotate: 180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.3, type: 'spring' }}
                >
                  <span className="text-2xl">⚡</span>
                  <span>+{xpEarned} XP</span>
                </motion.div>
              )}

              {/* Streak */}
              {streakCount > 1 && (
                <motion.div
                  className="bg-red-100 text-red-700 px-4 py-2 rounded-full font-bold flex items-center gap-2"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4, type: 'spring' }}
                >
                  <span className="text-2xl">🔥</span>
                  <span>{streakCount} streak!</span>
                </motion.div>
              )}
            </div>

            {/* Floating particles */}
            {Array.from({ length: 8 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-3xl"
                initial={{
                  x: 0,
                  y: 0,
                  opacity: 1
                }}
                animate={{
                  x: Math.cos((i / 8) * Math.PI * 2) * 100,
                  y: Math.sin((i / 8) * Math.PI * 2) * 100 - 50,
                  opacity: 0
                }}
                transition={{
                  duration: 1.5,
                  delay: 0.2 + i * 0.05,
                  ease: 'easeOut'
                }}
              >
                {['✨', '⭐', '🌟', '💫', '🎉', '🎊', '🏆', '👑'][i % 8]}
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
