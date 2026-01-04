import Layout from '@/components/Layout';
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

export default function Reward() {
  const [, setLocation] = useLocation();
  const flavor = useStore((state) => state.flavor);
  
  const message = REWARD_MESSAGES[flavor];

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
           <motion.img 
             src="/images/reward-glow.png" 
             alt="Reward" 
             className="relative z-10 w-full h-full object-contain"
             initial={{ y: 10 }}
             animate={{ y: -10 }}
             transition={{ duration: 3, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
           />
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
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
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
