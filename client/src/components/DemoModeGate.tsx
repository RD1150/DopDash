import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Zap, Lock, Target } from 'lucide-react';
import { getLoginUrl } from '@/const';

interface DemoModeGateProps {
  tasksCompleted: number;
  onDismiss?: () => void;
}

export default function DemoModeGate({ tasksCompleted, onDismiss }: DemoModeGateProps) {
  // Show gate after 5 tasks completed in demo
  const shouldShowGate = tasksCompleted >= 5;

  if (!shouldShowGate) return null;

  const handleCreateAccount = () => {
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
              <Zap className="w-8 h-8 text-primary fill-primary" />
            </motion.div>
            <h2 className="text-2xl font-bold text-foreground">You're Crushing It!</h2>
            <p className="text-sm text-muted-foreground">
              You've completed {tasksCompleted} tasks in demo mode. 
              That's amazing momentum! Create an account to unlock unlimited tasks and save your progress.
            </p>
          </div>

          {/* Benefits */}
          <div className="space-y-3 bg-muted/50 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Target className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-sm text-foreground">Unlimited Tasks</p>
                <p className="text-xs text-muted-foreground">No more demo limits</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Zap className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-sm text-foreground">Keep Your Streak</p>
                <p className="text-xs text-muted-foreground">Your progress is saved</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Lock className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-sm text-foreground">Access Everywhere</p>
                <p className="text-xs text-muted-foreground">Your data, always safe</p>
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
              Continue with demo
            </button>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
