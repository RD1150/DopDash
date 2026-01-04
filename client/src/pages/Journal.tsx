import Layout from '@/components/Layout';
import { useStore } from '@/lib/store';
import { ChevronLeft, Calendar as CalendarIcon, Star, Trophy } from 'lucide-react';
import { useLocation } from 'wouter';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export default function JournalPage() {
  const [, setLocation] = useLocation();
  const history = useStore((state) => state.history);
  const streak = useStore((state) => state.streak);
  const badges = useStore((state) => state.badges);
  const level = useStore((state) => state.level);
  const xp = useStore((state) => state.xp);

  // Generate calendar days for current month
  const today = new Date();
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).getDay();
  
  const days = Array.from({ length: daysInMonth }, (_, i) => {
    const date = new Date(today.getFullYear(), today.getMonth(), i + 1);
    const dateString = date.toISOString().split('T')[0];
    return {
      day: i + 1,
      date: dateString,
      completed: history.includes(dateString),
      isToday: dateString === today.toISOString().split('T')[0]
    };
  });

  // Pad empty days at start
  const paddingDays = Array.from({ length: firstDayOfMonth }, () => null);

  return (
    <Layout>
      <div className="flex flex-col h-full">
        <header className="pt-6 pb-8 flex items-center gap-4">
          <button 
            onClick={() => setLocation('/streak')}
            className="p-2 -ml-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold text-foreground">Your Journey</h1>
        </header>

        <div className="space-y-8 pb-20">
          {/* Stats Overview */}
          <section className="grid grid-cols-2 gap-4">
            <div className="bg-card p-4 rounded-2xl border border-border flex flex-col items-center justify-center text-center">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2">
                <Trophy className="w-5 h-5" />
              </div>
              <p className="text-2xl font-bold">{level}</p>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Level</p>
            </div>
            <div className="bg-card p-4 rounded-2xl border border-border flex flex-col items-center justify-center text-center">
              <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500 mb-2">
                <Star className="w-5 h-5" />
              </div>
              <p className="text-2xl font-bold">{xp}</p>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Total XP</p>
            </div>
          </section>

          {/* Calendar View */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-primary" />
                {today.toLocaleString('default', { month: 'long', year: 'numeric' })}
              </h2>
              <span className="text-sm text-muted-foreground">{streak} day streak</span>
            </div>
            
            <div className="bg-card p-4 rounded-2xl border border-border">
              <div className="grid grid-cols-7 gap-2 text-center mb-2">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
                  <div key={d} className="text-xs text-muted-foreground font-medium">{d}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-2">
                {paddingDays.map((_, i) => (
                  <div key={`pad-${i}`} />
                ))}
                {days.map((d) => (
                  <motion.div
                    key={d.date}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className={cn(
                      "aspect-square rounded-lg flex items-center justify-center text-sm font-medium relative",
                      d.isToday && "ring-2 ring-primary ring-offset-2 ring-offset-card",
                      d.completed 
                        ? "bg-primary text-primary-foreground shadow-sm" 
                        : "bg-secondary/30 text-muted-foreground"
                    )}
                  >
                    {d.day}
                    {d.completed && (
                      <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full border-2 border-card"
                      />
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Recent Badges */}
          <section className="space-y-4">
            <h2 className="text-lg font-bold">Recent Badges</h2>
            <div className="grid grid-cols-3 gap-3">
              {badges.filter(b => b.unlocked).slice(0, 3).map(badge => (
                <div key={badge.id} className="bg-card p-3 rounded-xl border border-border flex flex-col items-center text-center gap-2">
                  <span className="text-2xl">{badge.icon}</span>
                  <p className="text-xs font-medium leading-tight">{badge.name}</p>
                </div>
              ))}
              {badges.filter(b => b.unlocked).length === 0 && (
                <div className="col-span-3 text-center py-8 text-muted-foreground text-sm italic">
                  No badges yet. Start dashing!
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
}
