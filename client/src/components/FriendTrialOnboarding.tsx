import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Mascot from '@/components/Mascot';
import { ChevronRight, CheckCircle2, Zap, Heart } from 'lucide-react';
import { useState } from 'react';
import { useStore } from '@/lib/store';

interface OnboardingStep {
  id: number;
  title: string;
  description: string;
  adhd_validation: string;
  icon: React.ReactNode;
}

const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 1,
    title: 'Welcome to Dopamine Dasher',
    description: 'A task app designed FOR ADHD brains, not against them.',
    adhd_validation: 'Your brain works differently. That\'s not broken—it\'s just different.',
    icon: '🎯',
  },
  {
    id: 2,
    title: 'Micro-Try: Start with just 2 minutes',
    description: 'Can\'t commit to 15 minutes? Try for 2. Most people keep going anyway.',
    adhd_validation: 'Starting is the hardest part. We make it easy.',
    icon: '⏱️',
  },
  {
    id: 3,
    title: 'Mood Check: See what actually works',
    description: 'After each task, check your mood. Watch the pattern: tasks → better mood.',
    adhd_validation: 'Your brain needs PROOF that effort works. We show you the data.',
    icon: '📊',
  },
  {
    id: 4,
    title: 'Momentum Mode: Flow without friction',
    description: 'Once you\'re working, keep working. No decisions, just momentum.',
    adhd_validation: 'Hyperfocus is your superpower. We protect it.',
    icon: '✨',
  },
  {
    id: 5,
    title: 'No judgment. No guilt.',
    description: 'Stop anytime. Pause tasks. Switch contexts. All guilt-free.',
    adhd_validation: 'You\'re not lazy. You\'re not broken. You\'re just working with your brain.',
    icon: '💚',
  },
];

interface FriendTrialOnboardingProps {
  isOpen: boolean;
  onComplete: () => void;
}

export default function FriendTrialOnboarding({ isOpen, onComplete }: FriendTrialOnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const dismissOnboardingChecklist = useStore((state) => state.dismissOnboardingChecklist);

  const handleNext = () => {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      dismissOnboardingChecklist();
      onComplete();
    }
  };

  const handleSkip = () => {
    dismissOnboardingChecklist();
    onComplete();
  };

  const step = ONBOARDING_STEPS[currentStep];
  const progress = ((currentStep + 1) / ONBOARDING_STEPS.length) * 100;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex flex-col items-center justify-center p-6"
        >
          {/* Progress bar */}
          <div className="w-full max-w-md h-1 bg-secondary rounded-full overflow-hidden mb-8">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="h-full bg-primary"
            />
          </div>

          {/* Mascot */}
          <motion.div
            key={currentStep}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="w-32 h-32 mb-8"
          >
            <Mascot pose="hero" className="w-full h-full" />
          </motion.div>

          {/* Content */}
          <motion.div
            key={`content-${currentStep}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-center space-y-6 max-w-md mb-8"
          >
            {/* Icon */}
            <div className="text-5xl">{step.icon}</div>

            {/* Title */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">{step.title}</h2>
              <p className="text-muted-foreground">{step.description}</p>
            </div>

            {/* ADHD Validation */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-primary/10 border border-primary/20 rounded-lg p-4"
            >
              <p className="text-sm font-medium text-primary flex items-center gap-2">
                <Heart className="w-4 h-4" />
                {step.adhd_validation}
              </p>
            </motion.div>
          </motion.div>

          {/* Actions */}
          <div className="flex gap-3 w-full max-w-md flex-col sm:flex-row">
            <Button
              variant="outline"
              onClick={handleSkip}
              className="flex-1"
            >
              Skip
            </Button>
            <Button
              onClick={handleNext}
              className="flex-1 gap-2"
            >
              {currentStep === ONBOARDING_STEPS.length - 1 ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Let's go!
                </>
              ) : (
                <>
                  Next
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </div>

          {/* Step counter */}
          <p className="text-xs text-muted-foreground mt-6">
            {currentStep + 1} of {ONBOARDING_STEPS.length}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
