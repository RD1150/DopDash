import { useStore } from '@/lib/store';
import { motion } from 'framer-motion';
import { Flame, Trophy, Users, Target } from 'lucide-react';

export interface Contest {
  id: string;
  type: 'weekly' | 'daily' | 'community' | 'friends';
  title: string;
  description: string;
  progress: number;
  target: number;
  reward: number;
  icon: string;
  endDate: string;
}

const ACTIVE_CONTESTS: Contest[] = [
  {
    id: 'weekly-streak',
    type: 'weekly',
    title: 'Weekly Streak Challenge',
    description: 'Maintain the longest streak this week',
    progress: 0,
    target: 7,
    reward: 500,
    icon: '🔥',
    endDate: 'Sunday',
  },
  {
    id: 'daily-speed',
    type: 'daily',
    title: 'Daily Speed Run',
    description: 'Complete 5 tasks in under 15 minutes',
    progress: 0,
    target: 5,
    reward: 100,
    icon: '⚡',
    endDate: 'Today',
  },
  {
    id: 'community-goal',
    type: 'community',
    title: 'Community Goal',
    description: 'Help the community reach 10,000 tasks',
    progress: 7234,
    target: 10000,
    reward: 250,
    icon: '🌍',
    endDate: 'This Week',
  },
];

export function ContestCard({ contest }: { contest: Contest }) {
  const progressPercent = (contest.progress / contest.target) * 100;

  const getIcon = (type: string) => {
    switch (type) {
      case 'weekly':
        return <Trophy className="w-5 h-5" />;
      case 'daily':
        return <Flame className="w-5 h-5" />;
      case 'community':
        return <Users className="w-5 h-5" />;
      case 'friends':
        return <Users className="w-5 h-5" />;
      default:
        return <Target className="w-5 h-5" />;
    }
  };

  return (
    <motion.div
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-card rounded-2xl p-4 border-2 border-border hover:border-primary/50 transition-all"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="text-2xl">{contest.icon}</div>
          <div>
            <p className="font-semibold text-foreground text-sm">{contest.title}</p>
            <p className="text-xs text-muted-foreground">{contest.description}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">Ends {contest.endDate}</p>
          <p className="text-sm font-bold text-primary">+{contest.reward} coins</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(progressPercent, 100)}%` }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="bg-primary h-full rounded-full"
          />
        </div>
        <div className="flex justify-between items-center">
          <p className="text-xs text-muted-foreground">
            {contest.progress} / {contest.target}
          </p>
          <p className="text-xs font-semibold text-primary">
            {Math.round(progressPercent)}%
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export function ContestList() {
  return (
    <div className="space-y-3">
      <h3 className="font-bold text-foreground px-2">Active Contests</h3>
      {ACTIVE_CONTESTS.map((contest) => (
        <ContestCard key={contest.id} contest={contest} />
      ))}
    </div>
  );
}

export function useContestProgress(contestId: string) {
  const { streak, coins } = useStore();

  // Simulate contest progress based on user stats
  const contest = ACTIVE_CONTESTS.find((c) => c.id === contestId);
  if (!contest) return null;

  if (contestId === 'weekly-streak') {
    return { progress: streak, target: 7 };
  }

  return { progress: 0, target: contest.target };
}
