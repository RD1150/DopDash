import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/lib/store';
import { soundManager } from '@/lib/sound';
import { haptics } from '@/lib/haptics';
import { X } from 'lucide-react';
import { useState, useEffect } from 'react';

interface BubblePopProps {
  onClose: () => void;
}

export default function BubblePop({ onClose }: BubblePopProps) {
  const actions = useStore((state) => state.todaysActions);
  const toggleAction = useStore((state) => state.toggleAction);
  const addCoins = useStore((state) => state.addCoins);
  const [bubbles, setBubbles] = useState(actions.filter(a => !a.completed));

  useEffect(() => {
    setBubbles(actions.filter(a => !a.completed));
  }, [actions]);

  const handlePop = (id: string) => {
    soundManager.playPop();
    haptics.medium();
    toggleAction(id);
    addCoins(1);
    
    // Remove locally for instant feedback
    setBubbles(prev => prev.filter(b => b.id !== id));

    if (bubbles.length <= 1) {
      setTimeout(onClose, 1000); // Close when all popped
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex flex-col items-center justify-center overflow-hidden"
    >
      <button 
        onClick={onClose}
        className="absolute top-6 right-6 p-2 bg-muted/20 rounded-full hover:bg-muted/40 transition-colors"
      >
        <X className="w-6 h-6" />
      </button>

      <h2 className="text-2xl font-bold mb-12 text-primary">Pop to Complete!</h2>

      <div className="relative w-full h-[60vh]">
        <AnimatePresence>
          {bubbles.map((action, i) => (
            <motion.div
              key={action.id}
              layoutId={action.id}
              initial={{ scale: 0, y: 100 }}
              animate={{ 
                scale: 1, 
                y: [0, -20, 0],
                x: [0, 10, -10, 0],
              }}
              exit={{ scale: 1.5, opacity: 0 }}
              transition={{ 
                y: { duration: 3 + i, repeat: Infinity, ease: "easeInOut" },
                x: { duration: 4 + i, repeat: Infinity, ease: "easeInOut" }
              }}
              drag
              dragConstraints={{ left: -100, right: 100, top: -100, bottom: 100 }}
              onClick={() => handlePop(action.id)}
              className="absolute cursor-pointer flex items-center justify-center text-center p-4 rounded-full shadow-lg border-4 border-white/20 backdrop-blur-md select-none hover:scale-110 active:scale-95 transition-transform"
              style={{
                width: '140px',
                height: '140px',
                left: `${20 + (i % 3) * 25}%`,
                top: `${10 + Math.floor(i / 3) * 30}%`,
                backgroundColor: action.category === 'energy' ? '#86efac' : 
                               action.category === 'momentum' ? '#fdba74' : '#93c5fd',
                color: '#1f2937'
              }}
            >
              <span className="font-bold text-sm leading-tight">{action.text}</span>
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/40 to-transparent pointer-events-none" />
            </motion.div>
          ))}
        </AnimatePresence>
        
        {bubbles.length === 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="text-6xl">🎉</div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
