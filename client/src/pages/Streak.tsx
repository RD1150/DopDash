import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { useStore } from '@/lib/store';
import { motion } from 'framer-motion';
import { Settings } from 'lucide-react';
import { useLocation } from 'wouter';

export default function Streak() {
  const [, setLocation] = useLocation();
  const streak = useStore((state) => state.streak);

  return (
    <Layout className="justify-center items-center text-center">
      <div className="absolute top-6 right-6 z-20">
        <button 
          onClick={() => setLocation('/settings')}
          className="p-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <Settings className="w-6 h-6" />
        </button>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="space-y-12 w-full"
      >
        <div className="relative w-48 h-48 mx-auto flex items-center justify-center">
          {/* Circular Progress Background */}
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              className="text-muted"
            />
            <motion.circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              strokeLinecap="round"
              className="text-primary"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }} // Always full circle for "consistency" vibe in prototype
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
          </svg>
          
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-5xl font-bold text-foreground">{streak}</span>
            <span className="text-sm text-muted-foreground uppercase tracking-wider font-medium mt-1">Days</span>
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground">Consistency beats intensity.</h2>
          <p className="text-muted-foreground max-w-xs mx-auto">
            You’re building a habit of starting. That’s the hardest part.
          </p>
        </div>

        <div className="pt-8">
          <Button 
            variant="outline"
            className="rounded-full px-8 border-2 hover:bg-muted"
            onClick={() => setLocation('/dash')}
          >
            Back to Dash
          </Button>
        </div>
      </motion.div>
    </Layout>
  );
}
