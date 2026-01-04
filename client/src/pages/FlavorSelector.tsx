import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Flavor, useStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useLocation } from 'wouter';

const FLAVORS: { id: Flavor; label: string; desc: string; color: string }[] = [
  { id: 'calm', label: 'Calm encouragement', desc: 'Gentle and soothing', color: 'bg-emerald-100 text-emerald-900' },
  { id: 'playful', label: 'Playful', desc: 'Fun and lighthearted', color: 'bg-blue-100 text-blue-900' },
  { id: 'matter-of-fact', label: 'Matter-of-fact', desc: 'Direct and simple', color: 'bg-stone-100 text-stone-900' },
  { id: 'celebratory', label: 'Celebratory', desc: 'Subtle cheers', color: 'bg-amber-100 text-amber-900' },
];

export default function FlavorSelector() {
  const [, setLocation] = useLocation();
  const setFlavor = useStore((state) => state.setFlavor);
  const resetDay = useStore((state) => state.resetDay);

  const handleSelect = (flavor: Flavor) => {
    setFlavor(flavor);
    resetDay(); // Initialize the first day's actions
    setLocation('/dash');
  };

  return (
    <Layout className="justify-center">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-8"
      >
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-semibold text-foreground">
            Choose how encouragement feels best to you.
          </h2>
          <p className="text-muted-foreground">
            This only affects reward messages.
          </p>
        </div>

        <div className="grid gap-4">
          {FLAVORS.map((flavor, index) => (
            <motion.button
              key={flavor.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => handleSelect(flavor.id)}
              className={cn(
                "w-full p-6 rounded-2xl text-left transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]",
                "border border-transparent hover:border-primary/20 shadow-sm hover:shadow-md",
                "bg-card"
              )}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-lg">{flavor.label}</h3>
                  <p className="text-sm text-muted-foreground">{flavor.desc}</p>
                </div>
                <div className={cn("w-4 h-4 rounded-full", flavor.color.split(' ')[0])} />
              </div>
            </motion.button>
          ))}
        </div>

        <p className="text-center text-xs text-muted-foreground/50 pt-8">
          You can change this later in Settings
        </p>
      </motion.div>
    </Layout>
  );
}
