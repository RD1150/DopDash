import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { useStore } from '@/lib/store';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, Settings, Share2, Trophy } from 'lucide-react';
import { useLocation } from 'wouter';
import { cn } from '@/lib/utils';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { toPng } from 'html-to-image';
import { useRef } from 'react';
import { toast } from 'sonner';
import Mascot from '@/components/Mascot';

export default function Streak() {
  const [, setLocation] = useLocation();
  const streak = useStore((state) => state.streak);
  const history = useStore((state) => state.history) || [];
  const badges = useStore((state) => state.badges) || [];
  const shareRef = useRef<HTMLDivElement>(null);

  // Convert history strings to Date objects
  const completedDays = history.map(dateStr => new Date(dateStr));

  const handleShare = async () => {
    if (shareRef.current) {
      try {
        const dataUrl = await toPng(shareRef.current, { cacheBust: true });
        const link = document.createElement('a');
        link.download = 'dopamine-dasher-streak.png';
        link.href = dataUrl;
        link.click();
        toast.success('Image saved! Ready to share.');
      } catch (err) {
        console.error(err);
        toast.error('Could not generate image.');
      }
    }
  };

  return (
    <Layout className="justify-center items-center text-center">
      <div className="absolute top-6 right-6 z-20">
        <button 
          onClick={() => setLocation('/settings')}
          className="p-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <Settings className="w-6 h-6" />
        </button>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="space-y-12 w-full"
      >
        {/* Shareable Card Area */}
        <div ref={shareRef} className="bg-background p-4 rounded-3xl">
          <div className="relative w-48 h-48 mx-auto flex items-center justify-center mb-6">
            {/* Circular Progress Background */}
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                className="text-muted"
              />
              <motion.circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                strokeLinecap="round"
                className="text-primary"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }} // Always full circle for "consistency" vibe in prototype
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
            </svg>
            
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="w-16 h-16 mb-1">
                <Mascot pose="hero" className="w-full h-full" />
              </div>
              <span className="text-3xl font-bold text-foreground">{streak}</span>
              <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Days Streak</span>
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-foreground">Consistency beats intensity.</h2>
            <p className="text-muted-foreground max-w-xs mx-auto">
              I'm building a habit of starting with Dopamine Dasher.
            </p>
          </div>
        </div>

        {/* Share Button */}
        <div className="flex justify-center">
          <Button 
            variant="secondary" 
            className="gap-2 rounded-full"
            onClick={handleShare}
          >
            <Share2 className="w-4 h-4" />
            Share Progress
          </Button>
        </div>

        {/* Calendar */}
        <div className="bg-card rounded-3xl p-4 border border-border shadow-sm max-w-sm mx-auto">
          <div className="flex items-center gap-2 mb-4 px-2">
            <CalendarIcon className="w-5 h-5 text-primary" />
            <h2 className="font-semibold">History</h2>
          </div>
          <div className="flex justify-center">
            <DayPicker
              mode="multiple"
              selected={completedDays}
              modifiers={{
                completed: completedDays
              }}
              modifiersStyles={{
                completed: { 
                  backgroundColor: 'var(--primary)', 
                  color: 'var(--primary-foreground)',
                  borderRadius: '50%'
                }
              }}
              styles={{
                caption: { color: 'var(--foreground)' },
                head_cell: { color: 'var(--muted-foreground)' },
                cell: { color: 'var(--foreground)' },
                nav_button: { color: 'var(--foreground)' },
              }}
            />
          </div>
        </div>

        {/* Badges */}
        <div className="bg-card rounded-3xl p-6 shadow-sm border border-border max-w-sm mx-auto">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-primary" />
            Badges
          </h2>
          <div className="grid grid-cols-3 gap-4">
            {badges.map((badge) => (
              <div 
                key={badge.id} 
                className={cn(
                  "flex flex-col items-center text-center p-3 rounded-xl transition-all",
                  badge.unlocked ? "bg-primary/10" : "bg-muted/20 opacity-50 grayscale"
                )}
              >
                <div className="text-3xl mb-2">{badge.icon}</div>
                <div className="text-xs font-bold leading-tight mb-1">{badge.name}</div>
                {badge.unlocked && (
                  <div className="text-[10px] text-muted-foreground">
                    {new Date(badge.unlockedDate!).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="pt-8">
          <Button 
            variant="outline"
            className="rounded-full px-8 border-2 hover:bg-muted"
            onClick={() => setLocation('/dash')}
          >
            Back to Dash
          </Button>
        </div>
      </motion.div>
    </Layout>
  );
}
