import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Trophy, Star, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';

interface StreakCounterProps {
  currentStreak: number;
  longestStreak: number;
  lastCompletedDate?: string;
}

interface Milestone {
  days: number;
  icon: React.ReactNode;
  label: string;
  color: string;
  celebration: string;
}

const MILESTONES: Milestone[] = [
  { days: 7, icon: <Flame className="w-6 h-6" />, label: 'Week Warrior', color: 'text-orange-500', celebration: '🔥' },
  { days: 30, icon: <Trophy className="w-6 h-6" />, label: 'Month Master', color: 'text-yellow-500', celebration: '🏆' },
  { days: 100, icon: <Star className="w-6 h-6" />, label: 'Century Champion', color: 'text-purple-500', celebration: '⭐' },
  { days: 365, icon: <Zap className="w-6 h-6" />, label: 'Year Legend', color: 'text-blue-500', celebration: '⚡' }
];

export default function StreakCounter({ currentStreak, longestStreak, lastCompletedDate }: StreakCounterProps) {
  const [celebratingMilestone, setCelebratingMilestone] = useState<Milestone | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);

  // Check if current streak hits a milestone
  useEffect(() => {
    const milestone = MILESTONES.find(m => m.days === currentStreak);
    if (milestone) {
      setCelebratingMilestone(milestone);
      setShowCelebration(true);
      
      // Trigger confetti
      confetti({
        particleCount: 150,
        spread: 60,
        origin: { y: 0.6 }
      });

      // Auto-hide celebration after 3 seconds
      const timer = setTimeout(() => setShowCelebration(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [currentStreak]);

  const nextMilestone = MILESTONES.find(m => m.days > currentStreak);
  const daysUntilNext = nextMilestone ? nextMilestone.days - currentStreak : null;

  return (
    <div className="space-y-4">
      {/* Main Streak Display */}
      <motion.div
        className="bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-200 rounded-lg p-6 text-center"
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200 }}
      >
        <div className="flex items-center justify-center gap-2 mb-2">
          <Flame className="w-8 h-8 text-orange-500 animate-pulse" />
          <h3 className="text-3xl font-bold text-orange-600">{currentStreak}</h3>
          <span className="text-lg text-orange-500">day streak</span>
        </div>
        <p className="text-sm text-gray-600">Keep it going! 🔥</p>
      </motion.div>

      {/* Milestone Progress */}
      {nextMilestone && (
        <motion.div
          className="bg-blue-50 border border-blue-200 rounded-lg p-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              {nextMilestone.icon}
              <span className="font-semibold text-sm">{nextMilestone.label}</span>
            </div>
            <span className="text-xs font-bold text-blue-600">{daysUntilNext} days away</span>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-blue-200 rounded-full h-2 overflow-hidden">
            <motion.div
              className="bg-blue-500 h-full"
              initial={{ width: 0 }}
              animate={{ width: `${(currentStreak / nextMilestone.days) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </motion.div>
      )}

      {/* Longest Streak */}
      <motion.div
        className="bg-purple-50 border border-purple-200 rounded-lg p-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-purple-500" />
            <span className="font-semibold text-sm">Personal Best</span>
          </div>
          <span className="text-lg font-bold text-purple-600">{longestStreak} days</span>
        </div>
      </motion.div>

      {/* Milestone Celebration Modal */}
      <AnimatePresence>
        {showCelebration && celebratingMilestone && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-2xl p-8 text-center max-w-sm"
              animate={{
                y: [0, -10, 0],
                rotate: [0, 2, -2, 0]
              }}
              transition={{ duration: 0.6, repeat: Infinity }}
            >
              <div className="text-6xl mb-4">{celebratingMilestone.celebration}</div>
              <h2 className={`text-3xl font-bold mb-2 ${celebratingMilestone.color}`}>
                {celebratingMilestone.label}
              </h2>
              <p className="text-gray-600">
                You've reached {celebratingMilestone.days} days! 🎉
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Amazing dedication to your goals!
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Milestone Badges */}
      <motion.div
        className="space-y-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <p className="text-xs font-semibold text-gray-600 uppercase">Milestones</p>
        <div className="grid grid-cols-4 gap-2">
          {MILESTONES.map((milestone) => (
            <motion.div
              key={milestone.days}
              className={`p-3 rounded-lg text-center transition-all ${
                currentStreak >= milestone.days
                  ? 'bg-green-100 border-2 border-green-500'
                  : 'bg-gray-100 border-2 border-gray-300 opacity-50'
              }`}
              whileHover={currentStreak >= milestone.days ? { scale: 1.05 } : {}}
            >
              <div className={currentStreak >= milestone.days ? 'text-green-600' : 'text-gray-400'}>
                {milestone.icon}
              </div>
              <p className="text-xs font-bold mt-1">{milestone.days}d</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
