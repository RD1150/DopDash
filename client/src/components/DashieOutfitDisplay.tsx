import { motion } from 'framer-motion';
import canvasConfetti from 'canvas-confetti';
import { useEffect, useState } from 'react';

export type TaskType = 'grind' | 'housework' | 'self-care';

interface DashieOutfitDisplayProps {
  taskType: TaskType;
  isCompleted?: boolean;
  onCompletionAnimationEnd?: () => void;
}

const outfitImages: Record<TaskType, string> = {
  grind: '/dashie-grind-mode.png',
  housework: '/dashie-housework-hero.png',
  'self-care': '/dashie-selfcare-spa.png',
};

const outfitLabels: Record<TaskType, string> = {
  grind: '📚💼 Grind Mode',
  housework: '🧹 Housework Hero',
  'self-care': '🛁 Self-Care Spa',
};

export default function DashieOutfitDisplay({
  taskType,
  isCompleted = false,
  onCompletionAnimationEnd,
}: DashieOutfitDisplayProps) {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (isCompleted && !showConfetti) {
      setShowConfetti(true);
      
      // Confetti from Dashie's butt (bottom center)
      setTimeout(() => {
        canvasConfetti({
          particleCount: 150,
          spread: 180,
          origin: { x: 0.5, y: 0.85 }, // Bottom center (Dashie's butt area)
          colors: ['#A7F3D0', '#6EE7B7', '#34D399', '#FCD34D', '#FDBA74', '#FF6B6B'],
          gravity: 0.5,
          scalar: 1.2,
        });
      }, 100);

      // Additional burst
      setTimeout(() => {
        canvasConfetti({
          particleCount: 100,
          spread: 360,
          origin: { x: 0.5, y: 0.8 },
          colors: ['#A7F3D0', '#6EE7B7', '#34D399'],
          gravity: 0.8,
        });
      }, 300);

      setTimeout(() => {
        onCompletionAnimationEnd?.();
      }, 1000);
    }
  }, [isCompleted, showConfetti, onCompletionAnimationEnd]);

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.5, y: -50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 100, damping: 15 }}
        className="relative"
      >
        {/* Dashie with outfit */}
        <motion.img
          src={outfitImages[taskType]}
          alt={`Dashie ${outfitLabels[taskType]}`}
          className="w-32 h-32 object-contain drop-shadow-lg"
          animate={isCompleted ? { y: [0, -20, 0] } : {}}
          transition={
            isCompleted
              ? {
                  duration: 0.6,
                  times: [0, 0.5, 1],
                  repeat: 2,
                  repeatDelay: 0.2,
                }
              : {}
          }
        />

        {/* Outfit label */}
        <motion.div
          className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-sm font-bold text-center whitespace-nowrap bg-white/90 px-3 py-1 rounded-full shadow-md"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {outfitLabels[taskType]}
        </motion.div>
      </motion.div>

      {/* Completion message */}
      {isCompleted && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center mt-8"
        >
          <p className="text-lg font-bold text-green-600">🎉 Task Crushed! 🎉</p>
          <p className="text-sm text-gray-600">Dashie is celebrating with you!</p>
        </motion.div>
      )}
    </div>
  );
}
