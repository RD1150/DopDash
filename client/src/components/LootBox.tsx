import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useStore } from '@/lib/store';
import { soundManager } from '@/lib/sound';
import canvasConfetti from 'canvas-confetti';

interface LootBoxProps {
  onClose: () => void;
}

export default function LootBox({ onClose }: LootBoxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [reward, setReward] = useState<{ type: 'coins' | 'item', value: number | string, name: string } | null>(null);
  const addCoins = useStore(state => state.addCoins);

  const openBox = () => {
    setIsOpen(true);
    soundManager.playSuccess(); // Use success sound for opening
    
    // Determine reward
    const rand = Math.random();
    let rewardData;
    
    if (rand < 0.7) {
      // 70% chance of coins
      const amount = Math.floor(Math.random() * 20) + 10; // 10-30 coins
      rewardData = { type: 'coins', value: amount, name: `${amount} Star Coins` };
      addCoins(amount);
    } else {
      // 30% chance of big coins (simulating item for now since we don't have many items)
      const amount = Math.floor(Math.random() * 50) + 50; // 50-100 coins
      rewardData = { type: 'coins', value: amount, name: `JACKPOT! ${amount} Star Coins` };
      addCoins(amount);
    }
    
    // @ts-ignore
    setReward(rewardData);

    // Confetti explosion
    canvasConfetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.6 },
      colors: ['#FFD700', '#FFA500', '#FF4500']
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-card border-4 border-yellow-400 rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-yellow-300 via-orange-400 to-yellow-300 animate-pulse" />
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
          onClick={onClose}
        >
          <X className="w-5 h-5" />
        </Button>

        {!isOpen ? (
          <div className="py-8 flex flex-col items-center gap-6">
            <motion.div
              animate={{ 
                rotate: [0, -5, 5, -5, 5, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse"
              }}
              className="cursor-pointer"
              onClick={openBox}
            >
              <Gift className="w-32 h-32 text-yellow-500 drop-shadow-lg" />
            </motion.div>
            
            <div>
              <h2 className="text-2xl font-bold text-yellow-600 dark:text-yellow-400 mb-2">Mystery Chest!</h2>
              <p className="text-muted-foreground">You found a secret reward!</p>
            </div>

            <Button 
              size="lg" 
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold text-lg rounded-xl shadow-lg shadow-yellow-500/20"
              onClick={openBox}
            >
              Open It!
            </Button>
          </div>
        ) : (
          <div className="py-8 flex flex-col items-center gap-6">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", bounce: 0.5 }}
            >
              <div className="text-6xl mb-4">
                {reward?.type === 'coins' ? '💰' : '🎁'}
              </div>
            </motion.div>
            
            <div>
              <h2 className="text-3xl font-black text-yellow-600 dark:text-yellow-400 mb-2">{reward?.name}</h2>
              <p className="text-muted-foreground">Added to your stash!</p>
            </div>

            <Button 
              size="lg" 
              className="w-full"
              onClick={onClose}
            >
              Awesome!
            </Button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
