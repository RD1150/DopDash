import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/lib/store';

type EnergyLevel = 'low' | 'medium' | 'high';
type Vibe = 'anxious' | 'bored' | 'overwhelmed' | 'energized';
type Need = 'quick-wins' | 'deep-focus' | 'movement' | 'rest';

interface DailyCheckInProps {
  isOpen: boolean;
  onComplete: () => void;
}

export default function DailyCheckIn({ isOpen, onComplete }: DailyCheckInProps) {
  const [step, setStep] = useState<'energy' | 'vibe' | 'need' | 'complete'>('energy');
  const [energy, setEnergy] = useState<EnergyLevel | null>(null);
  const [vibe, setVibe] = useState<Vibe | null>(null);
  const [need, setNeed] = useState<Need | null>(null);
  const setDailyCheckIn = useStore((state) => state.setDailyCheckIn);
  const getDashieGreeting = useStore((state) => state.getDashieGreeting);

  const handleEnergySelect = (level: EnergyLevel) => {
    setEnergy(level);
    setStep('vibe');
  };

  const handleVibeSelect = (v: Vibe) => {
    setVibe(v);
    setStep('need');
  };

  const handleNeedSelect = (n: Need) => {
    setNeed(n);
    if (energy && vibe && need) {
      setDailyCheckIn(energy, vibe, need);
      setStep('complete');
      setTimeout(() => {
        onComplete();
      }, 1500);
    }
  };

  const energyEmojis = {
    low: '🔋',
    medium: '⚡',
    high: '🚀'
  };

  const vibeEmojis = {
    anxious: '😰',
    bored: '😑',
    overwhelmed: '😵',
    energized: '✨'
  };

  const needEmojis = {
    'quick-wins': '⚡',
    'deep-focus': '🎯',
    'movement': '🏃',
    'rest': '😴'
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl"
          >
            {/* Header */}
            <div className="text-center mb-8">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-5xl mb-4"
              >
                🌱
              </motion.div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                {step === 'energy' && "How's your energy today?"}
                {step === 'vibe' && "What's your vibe?"}
                {step === 'need' && "What do you need right now?"}
                {step === 'complete' && "Perfect! Let's get started 🎉"}
              </h2>
              <p className="text-muted-foreground">
                {getDashieGreeting()}
              </p>
            </div>

            {/* Energy Step */}
            {step === 'energy' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-3"
              >
                {(['low', 'medium', 'high'] as EnergyLevel[]).map((level) => (
                  <motion.button
                    key={level}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleEnergySelect(level)}
                    className="w-full p-4 rounded-2xl border-2 border-border hover:border-primary hover:bg-primary/10 transition-all text-left font-semibold"
                  >
                    <span className="text-2xl mr-3">{energyEmojis[level]}</span>
                    {level.charAt(0).toUpperCase() + level.slice(1)} Energy
                  </motion.button>
                ))}
              </motion.div>
            )}

            {/* Vibe Step */}
            {step === 'vibe' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-3"
              >
                {(['anxious', 'bored', 'overwhelmed', 'energized'] as Vibe[]).map((v) => (
                  <motion.button
                    key={v}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleVibeSelect(v)}
                    className="w-full p-4 rounded-2xl border-2 border-border hover:border-primary hover:bg-primary/10 transition-all text-left font-semibold"
                  >
                    <span className="text-2xl mr-3">{vibeEmojis[v]}</span>
                    {v.charAt(0).toUpperCase() + v.slice(1)}
                  </motion.button>
                ))}
              </motion.div>
            )}

            {/* Need Step */}
            {step === 'need' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-3"
              >
                {(['quick-wins', 'deep-focus', 'movement', 'rest'] as Need[]).map((n) => (
                  <motion.button
                    key={n}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleNeedSelect(n)}
                    className="w-full p-4 rounded-2xl border-2 border-border hover:border-primary hover:bg-primary/10 transition-all text-left font-semibold"
                  >
                    <span className="text-2xl mr-3">{needEmojis[n]}</span>
                    {n === 'quick-wins' && 'Quick Wins'}
                    {n === 'deep-focus' && 'Deep Focus'}
                    {n === 'movement' && 'Movement'}
                    {n === 'rest' && 'Rest'}
                  </motion.button>
                ))}
              </motion.div>
            )}

            {/* Complete Step */}
            {step === 'complete' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.6 }}
                  className="text-6xl mb-4"
                >
                  ✨
                </motion.div>
                <p className="text-lg font-semibold text-foreground">
                  You're all set! Let's make today count.
                </p>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
