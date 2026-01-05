import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore, Flavor, Theme, Context } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Brain, Zap, Battery, Palette, Moon, Sun, Leaf, Cpu, Home, Briefcase, User, Target, Trophy, Heart, Sparkles } from 'lucide-react';
import { useLocation } from 'wouter';

export default function Onboarding() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState<'intro' | 'enemy' | 'context' | 'vibe'>('intro');
  const setFlavor = useStore((state) => state.setFlavor);
  const setTheme = useStore((state) => state.setTheme);
  const setContext = useStore((state) => state.setContext);
  const startApp = useStore((state) => state.startApp);

  const handleEnemySelect = (flavor: Flavor) => {
    setFlavor(flavor);
    setStep('context');
  };

  const handleContextSelect = (context: Context) => {
    setContext(context);
    setStep('vibe');
  };

  const handleVibeSelect = (theme: Theme) => {
    setTheme(theme);
    startApp();
    setLocation('/dash');
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-8">
      <AnimatePresence mode="wait">
        {step === 'intro' && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8 text-center px-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold text-primary">Dopamine Dasher</h1>
              <p className="text-xl text-muted-foreground">Just start. That's enough.</p>
            </div>

            {/* Value Proposition */}
            <div className="space-y-3 py-4">
              <p className="text-base text-muted-foreground leading-relaxed max-w-sm mx-auto">
                The task manager that actually gets ADHD brains. No overwhelming lists. No guilt trips. Just tiny wins that build momentum.
              </p>
            </div>

            {/* Key Features */}
            <div className="grid grid-cols-2 gap-3 py-4">
              <div className="bg-card border border-border rounded-xl p-4 space-y-2">
                <div className="w-10 h-10 mx-auto rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <Zap className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-semibold">Instant Wins</h3>
                <p className="text-xs text-muted-foreground">Quick dopamine hits</p>
              </div>

              <div className="bg-card border border-border rounded-xl p-4 space-y-2">
                <div className="w-10 h-10 mx-auto rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <Trophy className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-semibold">Gamified</h3>
                <p className="text-xs text-muted-foreground">Level up & earn coins</p>
              </div>

              <div className="bg-card border border-border rounded-xl p-4 space-y-2">
                <div className="w-10 h-10 mx-auto rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <Heart className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-semibold">Your Buddy</h3>
                <p className="text-xs text-muted-foreground">Celebrates every win</p>
              </div>

              <div className="bg-card border border-border rounded-xl p-4 space-y-2">
                <div className="w-10 h-10 mx-auto rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-semibold">Boss Battles</h3>
                <p className="text-xs text-muted-foreground">Slay your dragons</p>
              </div>
            </div>
            
            <div className="py-4">
              <Button 
                size="lg"
                onClick={() => setStep('enemy')}
                className="w-full h-14 text-lg rounded-full shadow-lg"
              >
                Start today
              </Button>
            </div>
            
            <p className="text-sm text-muted-foreground/60">
              No login. No signup. No explanation wall.
            </p>
          </motion.div>
        )}

        {step === 'enemy' && (
          <motion.div
            key="enemy"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold">What's the enemy today?</h2>
              <p className="text-muted-foreground">We'll adjust the vibe to match.</p>
            </div>

            <div className="grid gap-4">
              <button
                onClick={() => handleEnemySelect('calm')}
                className="bg-card hover:bg-accent p-6 rounded-2xl border-2 border-transparent hover:border-primary transition-all text-left flex items-center gap-4 group"
              >
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-xl group-hover:scale-110 transition-transform">
                  <Brain className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">The Wall of Awful</h3>
                  <p className="text-sm text-muted-foreground">I can't seem to start anything.</p>
                </div>
              </button>

              <button
                onClick={() => handleEnemySelect('matter-of-fact')}
                className="bg-card hover:bg-accent p-6 rounded-2xl border-2 border-transparent hover:border-primary transition-all text-left flex items-center gap-4 group"
              >
                <div className="p-3 bg-orange-100 dark:bg-orange-900/30 text-orange-600 rounded-xl group-hover:scale-110 transition-transform">
                  <Zap className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Squirrel Brain</h3>
                  <p className="text-sm text-muted-foreground">I'm doing 10 things at once.</p>
                </div>
              </button>

              <button
                onClick={() => handleEnemySelect('playful')}
                className="bg-card hover:bg-accent p-6 rounded-2xl border-2 border-transparent hover:border-primary transition-all text-left flex items-center gap-4 group"
              >
                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-xl group-hover:scale-110 transition-transform">
                  <Battery className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">The Blahs</h3>
                  <p className="text-sm text-muted-foreground">Low energy. Need a boost.</p>
                </div>
              </button>
            </div>
          </motion.div>
        )}

        {step === 'context' && (
          <motion.div
            key="context"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold">What are we tackling?</h2>
              <p className="text-muted-foreground">We'll load the right tools.</p>
            </div>

            <div className="grid gap-4">
              <button
                onClick={() => handleContextSelect('nest')}
                className="bg-card hover:bg-accent p-6 rounded-2xl border-2 border-transparent hover:border-primary transition-all text-left flex items-center gap-4 group"
              >
                <div className="p-3 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-xl group-hover:scale-110 transition-transform">
                  <Home className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">The Nest</h3>
                  <p className="text-sm text-muted-foreground">Chores, cleaning, life admin.</p>
                </div>
              </button>

              <button
                onClick={() => handleContextSelect('grind')}
                className="bg-card hover:bg-accent p-6 rounded-2xl border-2 border-transparent hover:border-primary transition-all text-left flex items-center gap-4 group"
              >
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-xl group-hover:scale-110 transition-transform">
                  <Briefcase className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">The Grind</h3>
                  <p className="text-sm text-muted-foreground">Work, study, emails.</p>
                </div>
              </button>

              <button
                onClick={() => handleContextSelect('self')}
                className="bg-card hover:bg-accent p-6 rounded-2xl border-2 border-transparent hover:border-primary transition-all text-left flex items-center gap-4 group"
              >
                <div className="p-3 bg-pink-100 dark:bg-pink-900/30 text-pink-600 rounded-xl group-hover:scale-110 transition-transform">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">The Self</h3>
                  <p className="text-sm text-muted-foreground">Hygiene, health, routine.</p>
                </div>
              </button>
            </div>
          </motion.div>
        )}

        {step === 'vibe' && (
          <motion.div
            key="vibe"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold">Pick your companion</h2>
              <p className="text-muted-foreground">What feels good to look at?</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleVibeSelect('cottagecore')}
                className="bg-[#F3F4F6] dark:bg-[#2D3748] p-4 rounded-2xl border-2 border-transparent hover:border-[#A8B5A0] transition-all text-center space-y-3 group"
              >
                <div className="w-full aspect-square bg-[#E8EFE6] rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Leaf className="w-8 h-8 text-[#5F6F52]" />
                </div>
                <span className="font-medium block">Cottagecore</span>
              </button>

              <button
                onClick={() => handleVibeSelect('cyberpunk')}
                className="bg-[#1a1a1a] p-4 rounded-2xl border-2 border-transparent hover:border-[#00ff9d] transition-all text-center space-y-3 group"
              >
                <div className="w-full aspect-square bg-black rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform border border-[#00ff9d]/30">
                  <Cpu className="w-8 h-8 text-[#00ff9d]" />
                </div>
                <span className="font-medium block text-white">Cyberpunk</span>
              </button>

              <button
                onClick={() => handleVibeSelect('ocean')}
                className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-2xl border-2 border-transparent hover:border-blue-400 transition-all text-center space-y-3 group"
              >
                <div className="w-full aspect-square bg-blue-100 dark:bg-blue-900/50 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
                  <div className="text-2xl">🌊</div>
                </div>
                <span className="font-medium block">Ocean</span>
              </button>

              <button
                onClick={() => handleVibeSelect('sunset')}
                className="bg-orange-50 dark:bg-orange-950/30 p-4 rounded-2xl border-2 border-transparent hover:border-orange-400 transition-all text-center space-y-3 group"
              >
                <div className="w-full aspect-square bg-orange-100 dark:bg-orange-900/50 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
                  <div className="text-2xl">🌅</div>
                </div>
                <span className="font-medium block">Sunset</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
