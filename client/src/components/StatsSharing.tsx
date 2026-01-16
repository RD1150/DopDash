import { Button } from '@/components/ui/button';
import { Share2, Download } from 'lucide-react';
import { useStore } from '@/lib/store';
import { motion } from 'framer-motion';
import html2canvas from 'html2canvas';
import { useRef } from 'react';
import { toast } from 'sonner';

export default function StatsSharing() {
  const streak = useStore((state) => state.streak);
  const coins = useStore((state) => state.coins);
  const history = useStore((state) => state.history);
  const moodHistory = useStore((state) => state.moodHistory);
  const badges = useStore((state) => state.badges);
  const shareRef = useRef<HTMLDivElement>(null);

  const unlockedBadges = badges.filter(b => b.unlocked).length;
  const avgMoodImprovement = moodHistory.length > 0
    ? (moodHistory.reduce((sum, entry) => sum + entry.improvement, 0) / moodHistory.length).toFixed(1)
    : 0;

  const handleShareStats = async () => {
    if (!shareRef.current) return;

    try {
      const canvas = await html2canvas(shareRef.current, {
        backgroundColor: '#faf8f3',
        scale: 2,
      });

      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = `dopamine-dasher-stats-${new Date().toISOString().split('T')[0]}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success('Stats screenshot saved! 📸');
    } catch (error) {
      toast.error('Failed to generate screenshot');
    }
  };

  return (
    <div className="space-y-4">
      {/* Stats Card for Sharing */}
      <motion.div
        ref={shareRef}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-xl p-6 space-y-4"
      >
        <div className="text-center space-y-1">
          <p className="text-sm font-medium text-muted-foreground">My Dopamine Dasher Progress</p>
          <p className="text-xs text-muted-foreground">{new Date().toLocaleDateString()}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Streak */}
          <div className="bg-background/50 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-primary">🔥 {streak}</p>
            <p className="text-xs text-muted-foreground">Day Streak</p>
          </div>

          {/* Tasks Completed */}
          <div className="bg-background/50 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-primary">✅ {history.length}</p>
            <p className="text-xs text-muted-foreground">Tasks Done</p>
          </div>

          {/* Coins */}
          <div className="bg-background/50 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-primary">⭐ {coins}</p>
            <p className="text-xs text-muted-foreground">Coins Earned</p>
          </div>

          {/* Mood Improvement */}
          <div className="bg-background/50 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-primary">📈 +{avgMoodImprovement}</p>
            <p className="text-xs text-muted-foreground">Avg Mood Lift</p>
          </div>
        </div>

        {/* Badges */}
        {unlockedBadges > 0 && (
          <div className="text-center space-y-2">
            <p className="text-xs font-medium text-muted-foreground">{unlockedBadges} Badges Unlocked</p>
            <div className="flex justify-center gap-2 flex-wrap">
              {badges.filter(b => b.unlocked).map(badge => (
                <span key={badge.id} className="text-lg" title={badge.name}>
                  {badge.icon}
                </span>
              ))}
            </div>
          </div>
        )}

        <p className="text-xs text-center text-muted-foreground">
          Built with Dopamine Dasher 🎯
        </p>
      </motion.div>

      {/* Share Button */}
      <Button
        onClick={handleShareStats}
        className="w-full gap-2"
      >
        <Download className="w-4 h-4" />
        Download Stats Image
      </Button>

      <p className="text-xs text-muted-foreground text-center">
        Share your progress with friends. Show them what's possible. 💪
      </p>

      {/* Weekly Summary */}
      <div className="bg-secondary/50 rounded-lg p-4 space-y-2">
        <p className="text-sm font-medium">This Week</p>
        <div className="space-y-1 text-xs text-muted-foreground">
          <p>✅ {history.length} tasks completed</p>
          <p>🔥 {streak} day streak</p>
          <p>📈 Mood improved by +{avgMoodImprovement} on average</p>
        </div>
      </div>
    </div>
  );
}
