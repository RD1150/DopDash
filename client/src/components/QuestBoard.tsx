import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, Target, Zap, CheckCircle2, Lock, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { useStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { Progress } from './ui/progress';
import { soundManager } from '@/lib/sound';
import { haptics } from '@/lib/haptics';
import canvasConfetti from 'canvas-confetti';

interface Quest {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  xpReward: number;
  coinReward: number;
  progress: number;
  maxProgress: number;
  completed: boolean;
  category: 'daily' | 'weekly' | 'milestone';
}

export default function QuestBoard() {
  const streak = useStore(state => state.streak);
  const xp = useStore(state => state.xp);
  const level = useStore(state => state.level);
  const history = useStore(state => state.history);
  const badges = useStore(state => state.badges);
  const addCoins = useStore(state => state.addCoins);

  // Calculate quest progress based on actual user data
  const quests: Quest[] = [
    // Daily Quests
    {
      id: 'daily_complete_3',
      title: 'Daily Dash',
      description: 'Complete 3 tasks today',
      icon: <Zap className="w-5 h-5" />,
      xpReward: 50,
      coinReward: 10,
      progress: 0, // Would track today's completed tasks
      maxProgress: 3,
      completed: false,
      category: 'daily',
    },
    {
      id: 'daily_streak',
      title: 'Keep the Fire Burning',
      description: 'Maintain your streak',
      icon: <Sparkles className="w-5 h-5" />,
      xpReward: 25,
      coinReward: 5,
      progress: streak > 0 ? 1 : 0,
      maxProgress: 1,
      completed: streak > 0,
      category: 'daily',
    },

    // Weekly Quests
    {
      id: 'weekly_7_days',
      title: 'Consistency Champion',
      description: 'Complete tasks 7 days in a row',
      icon: <Target className="w-5 h-5" />,
      xpReward: 200,
      coinReward: 50,
      progress: Math.min(streak, 7),
      maxProgress: 7,
      completed: streak >= 7,
      category: 'weekly',
    },
    {
      id: 'weekly_boss_battles',
      title: 'Monster Slayer',
      description: 'Complete 3 Boss Battles this week',
      icon: <Trophy className="w-5 h-5" />,
      xpReward: 150,
      coinReward: 30,
      progress: 0, // Would track boss battles completed
      maxProgress: 3,
      completed: false,
      category: 'weekly',
    },

    // Milestone Quests
    {
      id: 'milestone_level_5',
      title: 'Rising Star',
      description: 'Reach Level 5',
      icon: <Star className="w-5 h-5" />,
      xpReward: 500,
      coinReward: 100,
      progress: Math.min(level, 5),
      maxProgress: 5,
      completed: level >= 5,
      category: 'milestone',
    },
    {
      id: 'milestone_30_days',
      title: 'Legendary Streak',
      description: 'Achieve a 30-day streak',
      icon: <Trophy className="w-5 h-5" />,
      xpReward: 1000,
      coinReward: 250,
      progress: Math.min(streak, 30),
      maxProgress: 30,
      completed: streak >= 30,
      category: 'milestone',
    },
    {
      id: 'milestone_all_badges',
      title: 'Badge Collector',
      description: 'Unlock all badges',
      icon: <Trophy className="w-5 h-5" />,
      xpReward: 750,
      coinReward: 200,
      progress: badges.filter(b => b.unlocked).length,
      maxProgress: badges.length,
      completed: badges.every(b => b.unlocked),
      category: 'milestone',
    },
  ];

  const handleClaimReward = (quest: Quest) => {
    if (quest.completed) {
      soundManager.playSuccess();
      haptics.celebrate();
      addCoins(quest.coinReward);
      
      canvasConfetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#FFD700', '#FFA500', '#FF6B6B'],
      });
    }
  };

  const dailyQuests = quests.filter(q => q.category === 'daily');
  const weeklyQuests = quests.filter(q => q.category === 'weekly');
  const milestoneQuests = quests.filter(q => q.category === 'milestone');

  const QuestCard = ({ quest }: { quest: Quest }) => {
    const progressPercent = (quest.progress / quest.maxProgress) * 100;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          "bg-card border-2 rounded-xl p-4 space-y-3 transition-all",
          quest.completed 
            ? "border-primary/50 bg-primary/5" 
            : "border-border hover:border-primary/30"
        )}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1">
            <div className={cn(
              "p-2 rounded-lg",
              quest.completed 
                ? "bg-primary/20 text-primary" 
                : "bg-muted text-muted-foreground"
            )}>
              {quest.completed ? <CheckCircle2 className="w-5 h-5" /> : quest.icon}
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className={cn(
                "font-semibold text-sm",
                quest.completed && "text-primary"
              )}>
                {quest.title}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                {quest.description}
              </p>
            </div>
          </div>

          {quest.completed && (
            <Button
              size="sm"
              variant="default"
              className="shrink-0"
              onClick={() => handleClaimReward(quest)}
            >
              Claim
            </Button>
          )}
        </div>

        {/* Progress Bar */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">
              {quest.progress} / {quest.maxProgress}
            </span>
            <span className="font-medium text-primary">
              +{quest.xpReward} XP • {quest.coinReward} 🪙
            </span>
          </div>
          <Progress value={progressPercent} className="h-2" />
        </div>
      </motion.div>
    );
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Daily Quests */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-yellow-500" />
          <h2 className="text-lg font-bold">Daily Quests</h2>
          <span className="text-xs text-muted-foreground">Resets daily</span>
        </div>
        <div className="space-y-2">
          {dailyQuests.map(quest => (
            <QuestCard key={quest.id} quest={quest} />
          ))}
        </div>
      </section>

      {/* Weekly Quests */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-blue-500" />
          <h2 className="text-lg font-bold">Weekly Quests</h2>
          <span className="text-xs text-muted-foreground">Resets weekly</span>
        </div>
        <div className="space-y-2">
          {weeklyQuests.map(quest => (
            <QuestCard key={quest.id} quest={quest} />
          ))}
        </div>
      </section>

      {/* Milestone Quests */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-purple-500" />
          <h2 className="text-lg font-bold">Milestones</h2>
          <span className="text-xs text-muted-foreground">Long-term goals</span>
        </div>
        <div className="space-y-2">
          {milestoneQuests.map(quest => (
            <QuestCard key={quest.id} quest={quest} />
          ))}
        </div>
      </section>
    </div>
  );
}
