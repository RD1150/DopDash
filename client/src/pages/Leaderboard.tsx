import { useStore } from '@/lib/store';
import { motion } from 'framer-motion';
import { Trophy, Flame, Medal } from 'lucide-react';

export default function Leaderboard() {
  const { streak, coins, level } = useStore();
  
  // Mock leaderboard data - in production this would come from backend
  const mockLeaderboard = [
    { rank: 1, name: 'Alex', streak: 47, tasks: 234, avatar: '🔥' },
    { rank: 2, name: 'Jordan', streak: 42, tasks: 198, avatar: '⚡' },
    { rank: 3, name: 'Casey', streak: 38, tasks: 187, avatar: '🌟' },
    { rank: 4, name: 'Morgan', streak: 35, tasks: 165, avatar: '🎯' },
    { rank: 5, name: 'You', streak, tasks: 0, avatar: '🌱', isUser: true },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-gradient-to-b from-primary/20 to-transparent p-6 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mb-4"
        >
          <Trophy className="w-12 h-12 text-primary mx-auto" />
        </motion.div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Global Leaderboard</h1>
        <p className="text-muted-foreground">Compete with ADHD brains worldwide</p>
      </div>

      {/* Your Stats */}
      <div className="px-4 py-6 space-y-4">
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-primary/10 rounded-2xl p-6 border-2 border-primary"
        >
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-3xl font-bold text-primary">🔥</div>
              <p className="text-sm text-muted-foreground mt-2">Streak</p>
              <p className="text-2xl font-bold text-foreground">{streak}</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">💰</div>
              <p className="text-sm text-muted-foreground mt-2">Coins</p>
              <p className="text-2xl font-bold text-foreground">{coins}</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">⭐</div>
              <p className="text-sm text-muted-foreground mt-2">Level</p>
              <p className="text-2xl font-bold text-foreground">{level}</p>
            </div>
          </div>
        </motion.div>

        {/* Leaderboard List */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-foreground px-2">Top 5 This Week</h2>
          {mockLeaderboard.map((player, idx) => (
            <motion.div
              key={player.rank}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: idx * 0.1 }}
              className={`p-4 rounded-2xl border-2 flex items-center justify-between ${
                player.isUser
                  ? 'bg-primary/10 border-primary'
                  : 'bg-card border-border hover:border-primary/50'
              }`}
            >
              <div className="flex items-center gap-4 flex-1">
                <div className="text-2xl font-bold text-primary w-8 text-center">
                  {player.rank === 1 && '🥇'}
                  {player.rank === 2 && '🥈'}
                  {player.rank === 3 && '🥉'}
                  {player.rank > 3 && `#${player.rank}`}
                </div>
                <div className="text-2xl">{player.avatar}</div>
                <div>
                  <p className="font-bold text-foreground">{player.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {player.streak} day streak • {player.tasks} tasks
                  </p>
                </div>
              </div>
              <Flame className="w-5 h-5 text-orange-500" />
            </motion.div>
          ))}
        </div>

        {/* Contests Section */}
        <div className="mt-8">
          <h2 className="text-lg font-bold text-foreground px-2 mb-3">Active Contests</h2>
          <div className="space-y-3">
            {[
              { title: 'Weekly Streak Challenge', progress: 65, reward: 500 },
              { title: 'Daily Speed Run', progress: 42, reward: 100 },
              { title: 'Community Goal', progress: 78, reward: 250 },
            ].map((contest, idx) => (
              <motion.div
                key={idx}
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 + idx * 0.1 }}
                className="bg-card rounded-2xl p-4 border-2 border-border"
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold text-foreground">{contest.title}</p>
                  <span className="text-sm font-bold text-primary">+{contest.reward} coins</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${contest.progress}%` }}
                    transition={{ delay: 0.5, duration: 1 }}
                    className="bg-primary h-full rounded-full"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-2">{contest.progress}% complete</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
