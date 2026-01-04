import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { useStore } from '@/lib/store';
import { motion } from 'framer-motion';
import { useLocation } from 'wouter';

export default function Welcome() {
  const [, setLocation] = useLocation();
  const startApp = useStore((state) => state.startApp);

  const handleStart = () => {
    startApp();
    setLocation('/flavor');
  };

  return (
    <Layout className="justify-center items-center text-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="space-y-12"
      >
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-primary">
            Dopamine Dasher
          </h1>
          <p className="text-xl text-muted-foreground font-medium">
            Just start. That’s enough.
          </p>
        </div>

        <div className="relative w-48 h-48 mx-auto">
           <motion.div 
             animate={{ scale: [1, 1.05, 1], opacity: [0.8, 1, 0.8] }}
             transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
             className="absolute inset-0 bg-primary/20 rounded-full blur-3xl"
           />
           <img 
             src="/images/icon-focus.png" 
             alt="Focus" 
             className="relative z-10 w-full h-full object-contain drop-shadow-xl"
           />
        </div>

        <div className="space-y-6">
          <Button 
            size="lg" 
            className="w-full h-16 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 bg-primary text-primary-foreground hover:scale-[1.02]"
            onClick={handleStart}
          >
            Start today
          </Button>
          
          <p className="text-sm text-muted-foreground/60">
            No login. No signup. No explanation wall.
          </p>
        </div>
      </motion.div>
    </Layout>
  );
}
