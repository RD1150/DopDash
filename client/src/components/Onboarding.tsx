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
            className="space-y-3 text-center px-4 py-2 max-h-screen overflow-y-auto pb-16"
          >
            {/* Hero Section with Dashie */}
            <motion.div 
              className="space-y-1"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              {/* Dashie Mascot */}
              <motion.div
                className="flex justify-center mb-1"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                <motion.img
                  src="/images/mascot/hero.png"
                  alt="Dashie - Your ADHD task buddy"
                  animate={{ 
                    y: [0, -15, 0],
                    rotate: [0, 3, -3, 0]
                  }}
                  transition={{ 
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="w-20 h-20 md:w-24 md:h-24 object-contain"
                  style={{
                    filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.2))'
                  }}
                />
              </motion.div>
              
              <div className="relative inline-block">
                <h1 className="text-3xl md:text-4xl font-bold relative z-10" style={{
                  color: 'hsl(var(--primary))',
                  filter: 'brightness(1.3)',
                  textShadow: '0 2px 10px hsl(var(--primary) / 0.5), 0 0 20px hsl(var(--primary) / 0.3)'
                }}>Dopamine Dasher</h1>
                {/* Sparkle accents */}
                <motion.span
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute -top-2 -right-6 text-2xl"
                >
                  ✨
                </motion.span>
              </div>
              <p className="text-xl font-medium" style={{ color: 'hsl(var(--foreground) / 0.85)' }}>Finally, a task app that doesn't make you feel broken.</p>
            </motion.div>

            {/* Pain Point + Value Proposition */}
            <motion.div 
              className="space-y-4 py-3"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <div className="space-y-4">
                <p className="text-xl font-semibold text-foreground/90 leading-relaxed max-w-lg mx-auto">
                  Staring at your to-do list for 20 minutes and doing nothing?
                </p>
                <p className="text-base leading-relaxed max-w-lg mx-auto" style={{ color: 'hsl(var(--foreground) / 0.8)' }}>
                  Break free from task paralysis. Dopamine Dasher turns overwhelming projects into 2-5 minute wins. No judgment. No guilt. Just instant dopamine hits that actually get you moving.
                </p>
                <div className="flex flex-wrap gap-2 justify-center pt-2">
                  <span className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">✨ Instant gratification</span>
                  <span className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">🎮 Gamified rewards</span>
                  <span className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">🧠 ADHD-designed</span>
                </div>
              </div>
            </motion.div>
            
            <div className="py-2">
              <Button 
                size="lg"
                onClick={() => {
                  setShowDashie(true);
                  setTimeout(() => {
                    setShowDashie(false);
                    setStep('enemy');
                  }, 1500);
                }}
                className="w-full h-16 text-xl font-bold rounded-full transition-all duration-300 hover:scale-105 animate-pulse"
                style={{
                  background: 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--primary) / 0.8) 100%)',
                  color: 'hsl(var(--primary-foreground))',
                  boxShadow: '0 4px 20px hsl(var(--primary) / 0.4), 0 0 0 3px hsl(var(--background)), 0 0 0 5px hsl(var(--primary) / 0.3)',
                  border: '2px solid hsl(var(--primary))',
                }}
              >
                Start Your First Win (Free) 🚀
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
            
            <p className="text-xs font-medium" style={{ color: 'hsl(var(--foreground) / 0.75)' }}>
              ⚡ Takes 30 seconds to get your first dopamine hit
            </p>
            <p className="text-xs" style={{ color: 'hsl(var(--foreground) / 0.7)' }}>
              No login • No signup • No credit card
            </p>
            
            {/* Social Proof */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="py-2"
            >
              <div className="space-y-1">
                <p className="text-base text-primary font-semibold">
                  🔥 Live now - Start immediately
                </p>
                <p className="text-sm" style={{ color: 'hsl(var(--foreground) / 0.75)' }}>
                  Join ADHD brains who are finally getting stuff done
                </p>
              </div>
            </motion.div>
            
            {/* Email Capture Form */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.75, duration: 0.6 }}
              className="py-2"
            >
              <div className="max-w-md mx-auto space-y-2">
                <p className="text-sm font-semibold" style={{ color: 'hsl(var(--foreground) / 0.8)' }}>
                  📧 Get notified when we add new features
                </p>
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="your@email.com"
                    className="flex-1 px-4 py-2 rounded-lg border-2 border-primary/20 focus:border-primary focus:outline-none text-sm"
                    style={{ backgroundColor: 'hsl(var(--background))', color: 'hsl(var(--foreground))' }}
                  />
                  <Button
                    size="sm"
                    className="px-6 font-semibold"
                    style={{
                      background: 'hsl(var(--primary))',
                      color: 'hsl(var(--primary-foreground))'
                    }}
                  >
                    Notify Me
                  </Button>
                </div>
                <p className="text-xs" style={{ color: 'hsl(var(--foreground) / 0.6)' }}>
                  No spam. Unsubscribe anytime. We respect your inbox.
                </p>
              </div>
            </motion.div>
            
            {/* How It Works Section */}
            <motion.div
              className="space-y-4 py-4"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              <h2 className="text-xl font-bold text-foreground">How It Works</h2>
              <div className="grid gap-3 max-w-2xl mx-auto">
                {/* Step 1 */}
                <div className="flex items-start gap-3 text-left">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-lg">
                    1️⃣
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-0.5">Pick a tiny task</h3>
                    <p className="text-xs text-muted-foreground">Choose from pre-loaded micro-tasks or add your own. Each one takes 2-5 minutes max.</p>
                  </div>
                </div>
                
                {/* Step 2 */}
                <div className="flex items-start gap-3 text-left">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-lg">
                    2️⃣
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-0.5">Just do it</h3>
                    <p className="text-xs text-muted-foreground">No timers. No pressure. Just tap when you're done. That's it.</p>
                  </div>
                </div>
                
                {/* Step 3 */}
                <div className="flex items-start gap-3 text-left">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-lg">
                    3️⃣
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-0.5">Celebrate & level up</h3>
                    <p className="text-xs text-muted-foreground">Get instant rewards, XP, and watch your streak grow. Your brain gets the dopamine it craves.</p>
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* FAQ Section */}
            <motion.div
              className="space-y-3 py-3"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.6 }}
            >
              <h2 className="text-xl font-bold text-foreground">FAQ</h2>
              <div className="space-y-2 max-w-2xl mx-auto text-left">
                {/* FAQ 1 */}
                <div className="bg-card/50 backdrop-blur-sm rounded-lg p-3 border border-border/50">
                  <h3 className="font-semibold text-foreground mb-1 text-sm">Do I need to sign up?</h3>
                  <p className="text-xs text-muted-foreground">Nope! Just click "Let's Go!" and start. No email, no password, no friction. Your data saves locally on your device.</p>
                </div>
                
                {/* FAQ 2 */}
                <div className="bg-card/50 backdrop-blur-sm rounded-lg p-3 border border-border/50">
                  <h3 className="font-semibold text-foreground mb-1 text-sm">Is it really free?</h3>
                  <p className="text-xs text-muted-foreground">Core features are 100% free forever. Premium themes and advanced features are available for a one-time $29.99 payment (no subscription).</p>
                </div>
                
                {/* FAQ 3 */}
                <div className="bg-card/50 backdrop-blur-sm rounded-lg p-3 border border-border/50">
                  <h3 className="font-semibold text-foreground mb-1 text-sm">What makes this different from other task apps?</h3>
                  <p className="text-xs text-muted-foreground">Most apps overwhelm you with features and make you feel guilty. Dopamine Dasher breaks everything into 2-5 minute tasks and celebrates every win. It's designed specifically for ADHD brains that need instant rewards and zero judgment.</p>
                </div>
              </div>
            </motion.div>
            
            {/* Testimonials Section */}
            <motion.div 
              className="space-y-2 py-3"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <div className="grid gap-2 max-w-2xl mx-auto">
                {/* Testimonial 1 */}
                <div className="bg-card/50 backdrop-blur-sm rounded-lg p-3 border border-border/50">
                  <p className="text-xs text-muted-foreground italic mb-1">
                    "I'd stare at my to-do list for 20 minutes and do nothing. This app made it so easy to just... start. The tiny tasks don't feel overwhelming."
                  </p>
                  <p className="text-xs text-muted-foreground/60">— Alex T., Creative Professional</p>
                </div>
                
                {/* Testimonial 2 */}
                <div className="bg-card/50 backdrop-blur-sm rounded-lg p-3 border border-border/50">
                  <p className="text-xs text-muted-foreground italic mb-1">
                    "First app that doesn't make me feel broken. The gamification isn't cheesy - it's genuinely motivating. I actually cleaned my kitchen for the first time in weeks."
                  </p>
                  <p className="text-xs text-muted-foreground/60">— Jordan M., Software Developer</p>
                </div>
                
                {/* Testimonial 3 */}
                <div className="bg-card/50 backdrop-blur-sm rounded-lg p-3 border border-border/50">
                  <p className="text-xs text-muted-foreground italic mb-1">
                    "The quick wins actually feel... achievable? I've tried every productivity app. This is the first one I actually open every day."
                  </p>
                  <p className="text-xs text-muted-foreground/60">— Sam R., Entrepreneur</p>
                </div>
              </div>
            </motion.div>
            
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
