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
  const [showDashie, setShowDashie] = useState(false);
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
    <div className="relative w-full max-w-md mx-auto space-y-8">
      {/* Animated Background Elements */}
      {step === 'intro' && (
        <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
          {/* Gradient Orbs */}
          <motion.div
            animate={{
              x: [0, 100, 0],
              y: [0, -100, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-20 left-10 w-64 h-64 bg-primary/20 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              x: [0, -80, 0],
              y: [0, 100, 0],
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
            className="absolute bottom-20 right-10 w-72 h-72 bg-purple-500/15 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              x: [0, 60, 0],
              y: [0, -60, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 4
            }}
            className="absolute top-1/2 left-1/2 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"
          />
          
          {/* Floating Icons */}
          <motion.div
            animate={{
              y: [0, -30, 0],
              rotate: [0, 10, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-32 right-20 text-4xl opacity-30"
          >
            ✨
          </motion.div>
          <motion.div
            animate={{
              y: [0, 25, 0],
              rotate: [0, -15, 0],
            }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
            className="absolute bottom-40 left-16 text-3xl opacity-25"
          >
            🎯
          </motion.div>
          <motion.div
            animate={{
              y: [0, -20, 0],
              x: [0, 15, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
            className="absolute top-1/3 left-12 text-3xl opacity-20"
          >
            🚀
          </motion.div>
          <motion.div
            animate={{
              y: [0, 30, 0],
              rotate: [0, 20, 0],
            }}
            transition={{
              duration: 9,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 3
            }}
            className="absolute bottom-1/3 right-24 text-4xl opacity-25"
          >
            🎉
          </motion.div>
        </div>
      )}
      <AnimatePresence mode="wait">
        {step === 'intro' && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8 text-center px-4 max-h-[90vh] overflow-y-auto"
          >
            <motion.div 
              className="space-y-4"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <div className="relative inline-block">
                <h1 className="text-4xl md:text-5xl font-bold text-primary relative z-10">Dopamine Dasher</h1>
                {/* Sparkle accents */}
                <motion.span
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute -top-2 -right-6 text-2xl"
                >
                  ✨
                </motion.span>
              </div>
              <p className="text-xl text-muted-foreground">Just start. That's enough.</p>
            </motion.div>

            {/* Pain Point + Value Proposition */}
            <motion.div 
              className="space-y-6 py-6"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <div className="space-y-3">
                <p className="text-lg text-muted-foreground/80 leading-relaxed max-w-md mx-auto">
                  Mind like a browser with 47 tabs open?
                </p>
                <p className="text-base text-muted-foreground leading-relaxed max-w-md mx-auto">
                  The task manager that actually gets ADHD brains. No overwhelming lists. No guilt trips. Just well-deserved wins that build momentum.
                </p>
              </div>
            </motion.div>
            
            <div className="py-4">
              <Button 
                size="lg"
                onClick={() => {
                  setShowDashie(true);
                  setTimeout(() => {
                    setShowDashie(false);
                    setStep('enemy');
                  }, 1500);
                }}
                className="w-full h-16 text-xl font-bold rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 animate-pulse"
                style={{
                  background: 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--primary) / 0.8) 100%)',
                  color: 'hsl(var(--primary-foreground))',
                }}
              >
                Let's Go! 🚀
              </Button>
              
              {/* Dashie Celebration Popup */}
              <AnimatePresence>
                {showDashie && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
                  >
                    <motion.div
                      animate={{ 
                        y: [0, -20, 0],
                        rotate: [0, 10, -10, 0]
                      }}
                      transition={{ 
                        duration: 0.5,
                        repeat: 2
                      }}
                      className="text-8xl"
                    >
                      🎉
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <p className="text-sm text-muted-foreground/60">
              No login. No signup. No explanation wall.
            </p>
            
            {/* Skip Setup Link */}
            <button
              onClick={() => {
                // Set smart defaults
                setFlavor('calm'); // Wall of Awful
                setContext('self'); // The Self
                setTheme('cottagecore'); // Cottagecore
                startApp();
                setLocation('/dash');
              }}
              className="text-sm text-muted-foreground/60 hover:text-primary transition-colors underline"
            >
              Just throw me in →
            </button>
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
