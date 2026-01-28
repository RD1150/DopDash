import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Heart, Lock, Zap } from 'lucide-react';
import { useStore } from '@/lib/store';
import { getLoginUrl } from '@/const';

interface BetaAccountGateProps {
  tasksCompleted: number;
  onDismiss?: () => void;
}

export default function BetaAccountGate({ tasksCompleted, onDismiss }: BetaAccountGateProps) {
  const completionSoundEnabled = useStore((state) => state.completionSoundEnabled);
  
  // Show gate after 1-2 tasks completed
  const shouldShowGate = tasksCompleted >= 1;

  if (!shouldShowGate) return null;

  const handleCreateAccount = () => {
    // Redirect to OAuth login
    window.location.href = getLoginUrl();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="max-w-md w-full bg-card rounded-2xl p-8 shadow-2xl border border-primary/20 space-y-6"
        >
          {/* Header */}
          <div className="text-center space-y-2">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto"
            >
              <Heart className="w-8 h-8 text-primary fill-primary" />
            </motion.div>
            <h2 className="text-2xl font-bold text-foreground">You're on a roll!</h2>
            <p className="text-sm text-muted-foreground">
              You've completed {tasksCompleted} {tasksCompleted === 1 ? 'task' : 'tasks'}. 
              Create an account to save your progress and keep the momentum going.
            </p>
          </div>

          {/* Benefits */}
          <div className="space-y-3 bg-muted/50 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Zap className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-sm text-foreground">Save Your Progress</p>
                <p className="text-xs text-muted-foreground">Your tasks and streaks stay safe</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Heart className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-sm text-foreground">Track Your Growth</p>
                <p className="text-xs text-muted-foreground">See your stats and celebrate wins</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Lock className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-sm text-foreground">Secure & Private</p>
                <p className="text-xs text-muted-foreground">Your data is encrypted and safe</p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="space-y-2">
            <Button
              onClick={handleCreateAccount}
              className="w-full py-6 text-base rounded-full font-semibold"
            >
              Create Account (Free)
            </Button>
            <p className="text-xs text-center text-muted-foreground">
              Takes 30 seconds with Google or Apple
            </p>
          </div>

          {/* Dismiss option */}
          {onDismiss && (
            <button
              onClick={onDismiss}
              className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Continue without account
            </button>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
