import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Heart, Sun, Sparkles } from 'lucide-react';
import { soundManager } from '@/lib/sound';

const AFFIRMATIONS = [
  "You don't have to do it all. Just one thing is enough.",
  "Your brain is beautiful, even when it's chaotic.",
  "Rest is not a reward. It's a requirement.",
  "Small steps are still steps.",
  "You are capable of more than you think.",
  "It's okay to start over.",
  "Forgive yourself for yesterday.",
  "You are doing your best, and that is enough.",
  "Focus comes and goes. Be gentle with yourself.",
  "Your worth is not measured by your productivity."
];

export default function AffirmationOverlay() {
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState('');
  const lastAffirmationDate = useStore((state) => state.lastAffirmationDate);
  const setLastAffirmationDate = useStore((state) => state.setLastAffirmationDate);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    
    if (lastAffirmationDate !== today) {
      // Pick random message
      const randomMsg = AFFIRMATIONS[Math.floor(Math.random() * AFFIRMATIONS.length)];
      setMessage(randomMsg);
      
      // Delay slightly for dramatic effect
      const timer = setTimeout(() => {
        setShow(true);
        soundManager.playPop();
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [lastAffirmationDate]);

  const handleDismiss = () => {
    const today = new Date().toISOString().split('T')[0];
    setLastAffirmationDate(today);
    setShow(false);
    soundManager.playSuccess();
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex items-center justify-center p-6"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="max-w-md w-full text-center space-y-8"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="w-20 h-20 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mx-auto text-yellow-500"
            >
              <Sun className="w-10 h-10" />
            </motion.div>

            <div className="space-y-4">
              <h2 className="text-3xl font-bold leading-tight text-foreground">
                Good Morning!
              </h2>
              <p className="text-xl text-muted-foreground font-medium italic">
                "{message}"
              </p>
            </div>

            <Button 
              onClick={handleDismiss}
              className="w-full py-6 text-lg rounded-full shadow-lg hover:scale-105 transition-transform"
            >
              <Heart className="w-5 h-5 mr-2 fill-current" />
              I accept this
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
