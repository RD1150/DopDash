import { useStore } from '@/lib/store';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Check, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/button';
import Mascot from './Mascot';

const steps = [
  {
    title: "Meet Your Buddy",
    description: "This little friend is here to cheer you on. No judgment, just good vibes.",
    icon: <Mascot pose="waiting" className="w-24 h-24" />,
  },
  {
    title: "Micro-Actions",
    description: "We don't do big, scary to-do lists here. We just do 3 tiny things to get the ball rolling.",
    icon: <Sparkles className="w-16 h-16 text-primary" />,
  },
  {
    title: "Just Start",
    description: "That's the only goal. Once you start, the dopamine follows. You got this!",
    icon: <Check className="w-16 h-16 text-green-500" />,
  },
];

export default function TutorialOverlay() {
  const hasSeenTutorial = useStore((state) => state.hasSeenTutorial);
  const completeTutorial = useStore((state) => state.completeTutorial);
  const [currentStep, setCurrentStep] = useState(0);

  if (hasSeenTutorial) return null;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeTutorial();
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
      >
        <motion.div
          key={currentStep}
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: -20 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="bg-card border border-border shadow-xl rounded-3xl p-8 max-w-sm w-full text-center space-y-6"
        >
          <div className="flex justify-center py-4">
            {steps[currentStep].icon}
          </div>
          
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-foreground">{steps[currentStep].title}</h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              {steps[currentStep].description}
            </p>
          </div>

          <div className="pt-4 flex flex-col gap-4">
            <Button 
              size="lg" 
              className="w-full rounded-full text-lg h-12" 
              onClick={handleNext}
            >
              {currentStep === steps.length - 1 ? "Let's Go!" : "Next"}
              {currentStep !== steps.length - 1 && <ArrowRight className="ml-2 w-5 h-5" />}
            </Button>
            
            <div className="flex justify-center gap-2">
              {steps.map((_, index) => (
                <div 
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                    index === currentStep ? "bg-primary" : "bg-muted"
                  }`}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
