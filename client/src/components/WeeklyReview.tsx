import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/lib/store';
import { X, Calendar, Trophy, Star, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import canvasConfetti from 'canvas-confetti';
import { soundManager } from '@/lib/sound';

export default function WeeklyReview() {
  const [isOpen, setIsOpen] = useState(false);
  const history = useStore((state) => state.history);
  const streak = useStore((state) => state.streak);
  const coins = useStore((state) => state.coins);

  useEffect(() => {
    // Check if it's Sunday evening (after 6 PM) and we haven't shown it yet
    const now = new Date();
    const isSunday = now.getDay() === 0;
    const isEvening = now.getHours() >= 18;
    const lastReview = localStorage.getItem('last-weekly-review');
    const todayStr = now.toDateString();

    if (isSunday && isEvening && lastReview !== todayStr) {
      // Simple check: do we have any history from the last 7 days?
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      const recentActivity = history.some(date => new Date(date) > oneWeekAgo);

      if (recentActivity) {
        setTimeout(() => setIsOpen(true), 2000);
      }
    }
  }, [history]);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem('last-weekly-review', new Date().toDateString());
  };

  const handleCelebrate = () => {
    soundManager.playSuccess();
    canvasConfetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.6 },
      colors: ['#FFD700', '#FFA500', '#FF69B4']
    });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-background/95 backdrop-blur-md flex flex-col items-center justify-center p-6"
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          className="max-w-md w-full bg-card border border-border rounded-3xl shadow-2xl overflow-hidden"
        >
          <div className="bg-primary/10 p-8 text-center space-y-4">
            <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-3xl font-bold text-primary">Weekly Win!</h2>
            <p className="text-muted-foreground">You showed up this week. That matters.</p>
          </div>

          <div className="p-8 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-secondary/50 p-4 rounded-2xl text-center space-y-1">
                <div className="text-3xl font-bold">{streak}</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider">Day Streak</div>
              </div>
              <div className="bg-secondary/50 p-4 rounded-2xl text-center space-y-1">
                <div className="text-3xl font-bold">{coins}</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider">Total Coins</div>
              </div>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-xl border border-yellow-100 dark:border-yellow-900/30 flex gap-3">
              <Star className="w-5 h-5 text-yellow-600 dark:text-yellow-400 shrink-0" />
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                "Progress isn't a straight line. Every time you opened this app, you beat the paralysis."
              </p>
            </div>

            <Button 
              size="lg" 
              className="w-full rounded-xl gap-2 text-lg h-14"
              onClick={() => {
                handleCelebrate();
                setTimeout(handleClose, 2000);
              }}
            >
              Claim Victory <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
