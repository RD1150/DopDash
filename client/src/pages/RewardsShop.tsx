import { useState } from 'react';
import { useStore } from '@/lib/store';
import { motion } from 'framer-motion';
import { ShoppingBag, Zap } from 'lucide-react';

interface Reward {
  id: string;
  name: string;
  description: string;
  emoji: string;
  cost: number;
  category: 'sticker' | 'gif' | 'badge';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

const REWARDS: Reward[] = [
  {
    id: 'dashie-celebrate',
    name: 'Dashie Celebration',
    description: 'Animated Dashie doing a happy dance',
    emoji: '🎉',
    cost: 50,
    category: 'gif',
    rarity: 'common',
  },
  {
    id: 'fire-streak',
    name: 'Fire Streak',
    description: 'Animated flames for your streak counter',
    emoji: '🔥',
    cost: 100,
    category: 'gif',
    rarity: 'rare',
  },
  {
    id: 'rainbow-confetti',
    name: 'Rainbow Confetti',
    description: 'Colorful confetti animation pack',
    emoji: '🌈',
    cost: 150,
    category: 'gif',
    rarity: 'epic',
  },
  {
    id: 'brain-power',
    name: 'Brain Power Badge',
    description: 'Unlock the Brain Power achievement badge',
    emoji: '🧠',
    cost: 200,
    category: 'badge',
    rarity: 'epic',
  },
  {
    id: 'unstoppable',
    name: 'Unstoppable Sticker',
    description: 'Exclusive sticker pack for your profile',
    emoji: '⚡',
    cost: 75,
    category: 'sticker',
    rarity: 'rare',
  },
  {
    id: 'legendary-dashie',
    name: 'Legendary Dashie',
    description: 'Ultra-rare golden Dashie variant',
    emoji: '✨',
    cost: 500,
    category: 'gif',
    rarity: 'legendary',
  },
];

export default function RewardsShop() {
  const { coins, addCoins } = useStore();
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
  const [purchased, setPurchased] = useState<string[]>([]);

  const handlePurchase = (reward: Reward) => {
    if (coins >= reward.cost && !purchased.includes(reward.id)) {
      addCoins(-reward.cost);
      setPurchased([...purchased, reward.id]);
      setSelectedReward(null);
      
      // Show success toast
      setTimeout(() => {
        alert(`🎉 You got ${reward.name}!`);
      }, 300);
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common':
        return 'from-gray-400 to-gray-500';
      case 'rare':
        return 'from-blue-400 to-blue-600';
      case 'epic':
        return 'from-purple-400 to-purple-600';
      case 'legendary':
        return 'from-yellow-400 to-orange-600';
      default:
        return 'from-gray-400 to-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-gradient-to-b from-primary/20 to-transparent p-6 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mb-4"
        >
          <ShoppingBag className="w-12 h-12 text-primary mx-auto" />
        </motion.div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Rewards Shop</h1>
        <p className="text-muted-foreground">Spend your coins on exclusive rewards</p>
      </div>

      {/* Coin Balance */}
      <div className="px-4 py-6">
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-primary/10 rounded-2xl p-6 border-2 border-primary mb-8 text-center"
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <Zap className="w-6 h-6 text-primary" />
            <p className="text-muted-foreground">Your Coins</p>
          </div>
          <p className="text-4xl font-bold text-primary">{coins}</p>
        </motion.div>

        {/* Rewards Grid */}
        <div className="grid grid-cols-2 gap-4">
          {REWARDS.map((reward, idx) => (
            <motion.div
              key={reward.id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => setSelectedReward(reward)}
              className={`rounded-2xl p-4 border-2 cursor-pointer transition-all ${
                purchased.includes(reward.id)
                  ? 'bg-muted border-border opacity-60'
                  : 'bg-card border-border hover:border-primary'
              }`}
            >
              <div
                className={`text-4xl mb-2 text-center bg-gradient-to-br ${getRarityColor(
                  reward.rarity
                )} bg-clip-text text-transparent`}
              >
                {reward.emoji}
              </div>
              <p className="font-semibold text-foreground text-sm text-center line-clamp-2">
                {reward.name}
              </p>
              <div className="flex items-center justify-center gap-1 mt-2">
                <Zap className="w-4 h-4 text-primary" />
                <p className="text-sm font-bold text-primary">{reward.cost}</p>
              </div>
              {purchased.includes(reward.id) && (
                <p className="text-xs text-center text-muted-foreground mt-2">Owned ✓</p>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedReward && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSelectedReward(null)}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl"
          >
            <div className="text-6xl text-center mb-4">{selectedReward.emoji}</div>
            <h2 className="text-2xl font-bold text-foreground text-center mb-2">
              {selectedReward.name}
            </h2>
            <p className="text-muted-foreground text-center mb-4">
              {selectedReward.description}
            </p>

            {/* Rarity Badge */}
            <div className="flex justify-center mb-6">
              <span
                className={`px-4 py-2 rounded-full text-white font-semibold text-sm bg-gradient-to-r ${getRarityColor(
                  selectedReward.rarity
                )}`}
              >
                {selectedReward.rarity.toUpperCase()}
              </span>
            </div>

            {/* Cost */}
            <div className="bg-primary/10 rounded-2xl p-4 text-center mb-6">
              <p className="text-muted-foreground mb-1">Cost</p>
              <div className="flex items-center justify-center gap-2">
                <Zap className="w-6 h-6 text-primary" />
                <p className="text-3xl font-bold text-primary">{selectedReward.cost}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setSelectedReward(null)}
                className="flex-1 px-4 py-3 rounded-2xl border-2 border-border text-foreground font-semibold hover:bg-muted transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => handlePurchase(selectedReward)}
                disabled={coins < selectedReward.cost || purchased.includes(selectedReward.id)}
                className={`flex-1 px-4 py-3 rounded-2xl font-semibold text-white transition-all ${
                  coins >= selectedReward.cost && !purchased.includes(selectedReward.id)
                    ? 'bg-primary hover:bg-primary/90 cursor-pointer'
                    : 'bg-muted text-muted-foreground cursor-not-allowed'
                }`}
              >
                {purchased.includes(selectedReward.id)
                  ? 'Already Owned'
                  : coins >= selectedReward.cost
                  ? 'Buy Now'
                  : `Need ${selectedReward.cost - coins} more`}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
