import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChevronRight, Zap, Trophy, Heart } from 'lucide-react';
import { useState } from 'react';

interface DemoOnboardingProps {
  isOpen: boolean;
  onComplete: () => void;
}

const steps = [
  {
    title: 'Pick a Task',
    description: 'Choose from quick tasks or add your own. Start small—even 30 seconds counts!',
    icon: <Zap className="w-12 h-12 text-primary" />,
    tip: '💡 Tip: Smaller tasks = easier wins = more dopamine',
  },
  {
    title: 'Complete & Celebrate',
    description: 'Mark it done when finished. Dashie will celebrate with you every single time.',
    icon: <Trophy className="w-12 h-12 text-primary" />,
    tip: '🎉 Tip: No task is too small. You showed up—that counts!',
  },
  {
    title: 'Build Your Streak',
    description: 'Keep going and watch your streak grow. Earn coins, unlock rewards, level up!',
    icon: <Heart className="w-12 h-12 text-primary" />,
    tip: '✨ Tip: Create an account to save your progress and keep the momentum going.',
  },
];

export default function DemoOnboarding({ isOpen, onComplete }: DemoOnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  const step = steps[currentStep];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-40 bg-background/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={handleSkip}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 200 }}
            onClick={(e) => e.stopPropagation()}
            className="max-w-md w-full bg-card rounded-3xl p-8 shadow-2xl border border-primary/20 space-y-6"
          >
            {/* Progress Indicator */}
            <div className="flex gap-2 justify-center">
              {steps.map((_, index) => (
                <motion.div
                  key={index}
                  className={`h-2 rounded-full transition-all ${
                    index <= currentStep ? 'bg-primary w-6' : 'bg-muted w-2'
                  }`}
                  animate={{ width: index <= currentStep ? 24 : 8 }}
                />
              ))}
            </div>

            {/* Content */}
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4 text-center"
            >
              <div className="flex justify-center">{step.icon}</div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-foreground">{step.title}</h2>
                <p className="text-muted-foreground leading-relaxed">{step.description}</p>
              </div>

              {/* Tip Box */}
              <div className="bg-accent/10 border border-accent/20 rounded-lg p-3">
                <p className="text-sm text-foreground">{step.tip}</p>
              </div>
            </motion.div>

            {/* Actions */}
            <div className="space-y-2">
              <Button
                onClick={handleNext}
                className="w-full py-6 text-base rounded-full font-semibold"
              >
                {currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
              <button
                onClick={handleSkip}
                className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
              >
                Skip Tutorial
              </button>
            </div>

            {/* Step Counter */}
            <div className="text-center text-xs text-muted-foreground">
              Step {currentStep + 1} of {steps.length}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
