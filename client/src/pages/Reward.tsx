import Layout from '@/components/Layout';
import Mascot from '@/components/Mascot';
import { Button } from '@/components/ui/button';
import { useStore } from '@/lib/store';
import { motion } from 'framer-motion';
import { useLocation } from 'wouter';

const REWARD_MESSAGES = {
  calm: "You showed up. That counts.",
  playful: "Momentum unlocked ✨",
  'matter-of-fact': "Action completed.",
  celebratory: "Nice work — you did it."
};

const MOOD_EMOJIS = ['😢', '😕', '😐', '🙂', '😄'];

export default function Reward() {
  const [, setLocation] = useLocation();
  const flavor = useStore((state) => state.flavor);
  const moodHistory = useStore((state) => state.moodHistory);
  
  const message = REWARD_MESSAGES[flavor];
  const lastMoodEntry = moodHistory[moodHistory.length - 1];

  return (
    <Layout className="justify-center items-center text-center">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="space-y-12 w-full"
      >
        {/* Glowing Orb */}
        <div className="relative w-64 h-64 mx-auto">
           <motion.div 
             animate={{ 
               scale: [1, 1.1, 1], 
               opacity: [0.6, 0.8, 0.6],
               rotate: [0, 5, -5, 0]
             }}
             transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
             className="absolute inset-0 bg-primary/30 rounded-full blur-[60px]"
           />
           <Mascot pose="hero" className="w-full h-full relative z-10" />
        </div>

        <div className="space-y-4">
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-3xl md:text-4xl font-bold text-foreground"
          >
            {message}
          </motion.h2>
          
          {/* Mood Improvement Display */}
          {lastMoodEntry && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
              className={`mt-6 p-4 rounded-xl border-2 ${
                lastMoodEntry.improvement > 0
                  ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                  : lastMoodEntry.improvement < 0
                  ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800'
                  : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
              }`}
            >
              <p className="text-sm font-medium text-muted-foreground mb-2">Your mood:</p>
              <div className="flex items-center justify-center gap-3">
                <span className="text-3xl">{MOOD_EMOJIS[lastMoodEntry.beforeMood - 1]}</span>
                <span className="text-muted-foreground">→</span>
                <span className="text-3xl">{MOOD_EMOJIS[lastMoodEntry.afterMood - 1]}</span>
              </div>
              {lastMoodEntry.improvement > 0 && (
                <p className="text-sm font-semibold text-green-600 dark:text-green-400 mt-2 text-center">
                  ✨ Tasks work! Your mood improved.
                </p>
              )}
              {lastMoodEntry.improvement < 0 && (
                <p className="text-sm text-orange-600 dark:text-orange-400 mt-2 text-center">
                  Your mood shifted. That's okay.
                </p>
              )}
              {lastMoodEntry.improvement === 0 && (
                <p className="text-sm text-blue-600 dark:text-blue-400 mt-2 text-center">
                  You're holding steady. Keep going.
                </p>
              )}
            </motion.div>
          )}
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: lastMoodEntry ? 2 : 1.5, duration: 1 }}
          className="pt-8 space-y-4"
        >
          <Button 
            size="lg" 
            className="w-full h-14 text-lg rounded-full bg-primary text-primary-foreground hover:scale-[1.02] transition-all shadow-lg"
            onClick={() => setLocation('/streak')}
          >
            Done for today
          </Button>
          
          <button 
            className="text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
            onClick={() => setLocation('/dash')} // In a real app, this might add one more task
          >
            Want one more?
          </button>
        </motion.div>
      </motion.div>
    </Layout>
  );
}
