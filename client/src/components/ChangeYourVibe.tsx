import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useStore, Flavor, Theme, Context } from '@/lib/store';
import { cn } from '@/lib/utils';
import { Brain, Zap, Battery, Palette, Moon, Sun, Leaf, Cpu, Home, Briefcase, User, Target, Trophy, Heart, Sparkles, X } from 'lucide-react';
import { toast } from 'sonner';

interface ChangeYourVibeProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChangeYourVibe({ isOpen, onClose }: ChangeYourVibeProps) {
  const [step, setStep] = useState<'enemy' | 'context' | 'vibe'>('enemy');
  
  const flavor = useStore((state) => state.flavor);
  const context = useStore((state) => state.context);
  const theme = useStore((state) => state.theme);
  const setFlavor = useStore((state) => state.setFlavor);
  const setContext = useStore((state) => state.setContext);
  const setTheme = useStore((state) => state.setTheme);

  const handleEnemySelect = (newFlavor: Flavor) => {
    setFlavor(newFlavor);
    setStep('context');
  };

  const handleContextSelect = (newContext: Context) => {
    setContext(newContext);
    setStep('vibe');
  };

  const handleVibeSelect = (newTheme: Theme) => {
    setTheme(newTheme);
    toast.success('Vibe updated! 🎨', {
      description: 'Your new settings are active.',
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-card border-2 border-border rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-xl">
                <Palette className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Change Your Vibe</h2>
                <p className="text-sm text-muted-foreground">Adjust anytime, no judgment</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Progress Indicator */}
          <div className="flex gap-2">
            <div className={cn("flex-1 h-1 rounded-full", step === 'enemy' ? 'bg-primary' : 'bg-muted')} />
            <div className={cn("flex-1 h-1 rounded-full", step === 'context' ? 'bg-primary' : 'bg-muted')} />
            <div className={cn("flex-1 h-1 rounded-full", step === 'vibe' ? 'bg-primary' : 'bg-muted')} />
          </div>

          <AnimatePresence mode="wait">
            {step === 'enemy' && (
              <motion.div
                key="enemy"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-bold">What's the enemy today?</h3>
                  <p className="text-sm text-muted-foreground">Current: {flavor.replace(/-/g, ' ')}</p>
                </div>

                <div className="grid gap-4">
                  <button
                    onClick={() => handleEnemySelect('calm')}
                    className={cn(
                      "bg-card hover:bg-accent p-6 rounded-2xl border-2 transition-all text-left flex items-center gap-4 group",
                      flavor === 'calm' ? 'border-primary' : 'border-transparent hover:border-primary'
                    )}
                  >
                    <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-xl group-hover:scale-110 transition-transform">
                      <Brain className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">The Wall of Awful</h4>
                      <p className="text-sm text-muted-foreground">I can't seem to start anything.</p>
                    </div>
                  </button>

                  <button
                    onClick={() => handleEnemySelect('matter-of-fact')}
                    className={cn(
                      "bg-card hover:bg-accent p-6 rounded-2xl border-2 transition-all text-left flex items-center gap-4 group",
                      flavor === 'matter-of-fact' ? 'border-primary' : 'border-transparent hover:border-primary'
                    )}
                  >
                    <div className="p-3 bg-orange-100 dark:bg-orange-900/30 text-orange-600 rounded-xl group-hover:scale-110 transition-transform">
                      <Zap className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">Squirrel Brain</h4>
                      <p className="text-sm text-muted-foreground">I'm doing 10 things at once.</p>
                    </div>
                  </button>

                  <button
                    onClick={() => handleEnemySelect('celebratory')}
                    className={cn(
                      "bg-card hover:bg-accent p-6 rounded-2xl border-2 transition-all text-left flex items-center gap-4 group",
                      flavor === 'celebratory' ? 'border-primary' : 'border-transparent hover:border-primary'
                    )}
                  >
                    <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-xl group-hover:scale-110 transition-transform">
                      <Battery className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">Running on Empty</h4>
                      <p className="text-sm text-muted-foreground">I'm exhausted and overwhelmed.</p>
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
                  <h3 className="text-xl font-bold">Where are you?</h3>
                  <p className="text-sm text-muted-foreground">Current: {context === 'self' ? 'The Self' : context === 'grind' ? 'The Grind' : context === 'nest' ? 'The Nest' : 'The Family'}</p>
                </div>

                <div className="grid gap-4">
                  <button
                    onClick={() => handleContextSelect('self')}
                    className={cn(
                      "bg-card hover:bg-accent p-6 rounded-2xl border-2 transition-all text-left flex items-center gap-4 group",
                      context === 'self' ? 'border-primary' : 'border-transparent hover:border-primary'
                    )}
                  >
                    <div className="p-3 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-xl group-hover:scale-110 transition-transform">
                      <User className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">The Self</h4>
                      <p className="text-sm text-muted-foreground">Personal growth & self-care</p>
                    </div>
                  </button>

                  <button
                    onClick={() => handleContextSelect('grind')}
                    className={cn(
                      "bg-card hover:bg-accent p-6 rounded-2xl border-2 transition-all text-left flex items-center gap-4 group",
                      context === 'grind' ? 'border-primary' : 'border-transparent hover:border-primary'
                    )}
                  >
                    <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-xl group-hover:scale-110 transition-transform">
                      <Briefcase className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">The Grind</h4>
                      <p className="text-sm text-muted-foreground">Work & professional tasks</p>
                    </div>
                  </button>

                  <button
                    onClick={() => handleContextSelect('nest')}
                    className={cn(
                      "bg-card hover:bg-accent p-6 rounded-2xl border-2 transition-all text-left flex items-center gap-4 group",
                      context === 'nest' ? 'border-primary' : 'border-transparent hover:border-primary'
                    )}
                  >
                    <div className="p-3 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-xl group-hover:scale-110 transition-transform">
                      <Home className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">The Nest</h4>
                      <p className="text-sm text-muted-foreground">Home & household tasks</p>
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
                  <h3 className="text-xl font-bold">Pick your vibe</h3>
                  <p className="text-sm text-muted-foreground">Current: {theme}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {(['default', 'ocean', 'sunset', 'lavender', 'cottagecore', 'cyberpunk'] as Theme[]).map((t) => (
                    <button
                      key={t}
                      onClick={() => handleVibeSelect(t)}
                      className={cn(
                        "p-6 rounded-2xl border-2 transition-all text-center",
                        theme === t ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                      )}
                    >
                      <div className="text-4xl mb-2">
                        {t === 'default' && '🎯'}
                        {t === 'ocean' && '🌊'}
                        {t === 'sunset' && '🌅'}
                        {t === 'lavender' && '💜'}
                        {t === 'cottagecore' && '🌿'}
                        {t === 'cyberpunk' && '🤖'}
                      </div>
                      <p className="font-medium capitalize">{t}</p>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Back Button */}
          {step !== 'enemy' && (
            <Button
              variant="outline"
              onClick={() => {
                if (step === 'context') setStep('enemy');
                if (step === 'vibe') setStep('context');
              }}
              className="w-full"
            >
              ← Back
            </Button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
