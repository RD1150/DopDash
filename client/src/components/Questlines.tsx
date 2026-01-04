import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/lib/store';
import { X, Map, Shield, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { soundManager } from '@/lib/sound';

interface Quest {
  id: string;
  title: string;
  description: string;
  steps: string[];
  reward: string;
  icon: any;
  color: string;
}

const QUESTS: Quest[] = [
  {
    id: 'declutter',
    title: 'The Clutter Slayer',
    description: 'A 3-step journey to reclaim your space from the chaos monsters.',
    steps: [
      'Clear one flat surface (desk, table, or floor)',
      'Fill one trash bag with obvious garbage',
      'Put away 5 things that have a home'
    ],
    reward: 'The "Tidy Titan" Badge',
    icon: Shield,
    color: 'bg-blue-500'
  },
  {
    id: 'morning_glory',
    title: 'Morning Glory',
    description: 'Build a morning routine that actually sticks.',
    steps: [
      'Drink a glass of water before coffee',
      'Step outside for 2 minutes of sunlight',
      'Make your bed (imperfectly is fine!)'
    ],
    reward: 'The "Sun Chaser" Badge',
    icon: Sparkles,
    color: 'bg-yellow-500'
  }
];

interface QuestlinesProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Questlines({ isOpen, onClose }: QuestlinesProps) {
  const activeQuest = useStore((state) => state.activeQuest);
  const questProgress = useStore((state) => state.questProgress);
  const startQuest = useStore((state) => state.startQuest);
  const advanceQuest = useStore((state) => state.advanceQuest);
  const quitQuest = useStore((state) => state.quitQuest);

  const currentQuest = QUESTS.find(q => q.id === activeQuest);

  const handleStart = (id: string) => {
    startQuest(id);
    soundManager.playSuccess();
  };

  const handleAdvance = () => {
    advanceQuest();
    soundManager.playSuccess();
    if (currentQuest && questProgress + 1 >= currentQuest.steps.length) {
      // Quest Complete!
      setTimeout(() => {
        quitQuest();
        onClose();
      }, 2000);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex flex-col p-6 overflow-y-auto"
      >
        <div className="max-w-2xl w-full mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/10 rounded-xl text-primary">
                <Map className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Questlines</h2>
                <p className="text-muted-foreground">Epic journeys, one step at a time.</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-6 h-6" />
            </Button>
          </div>

          {activeQuest && currentQuest ? (
            <div className="bg-card border border-border rounded-2xl p-6 space-y-6 shadow-lg">
              <div className="flex items-center gap-4">
                <div className={`p-4 rounded-xl ${currentQuest.color} text-white`}>
                  <currentQuest.icon className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">{currentQuest.title}</h3>
                  <p className="text-muted-foreground">{currentQuest.description}</p>
                </div>
              </div>

              <div className="space-y-4">
                {currentQuest.steps.map((step, index) => (
                  <div 
                    key={index}
                    className={`p-4 rounded-xl border transition-all ${
                      index < questProgress 
                        ? 'bg-primary/10 border-primary/20 text-muted-foreground line-through'
                        : index === questProgress
                        ? 'bg-card border-primary shadow-md scale-105'
                        : 'bg-muted/30 border-transparent opacity-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {index < questProgress ? (
                        <CheckCircle2 className="w-5 h-5 text-primary" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-current flex items-center justify-center text-xs font-bold">
                          {index + 1}
                        </div>
                      )}
                      <span className="font-medium">{step}</span>
                    </div>
                    {index === questProgress && (
                      <Button onClick={handleAdvance} className="w-full mt-4 gap-2">
                        Complete Step <ArrowRight className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              <Button variant="ghost" className="w-full text-destructive hover:bg-destructive/10" onClick={quitQuest}>
                Abandon Quest
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {QUESTS.map((quest) => (
                <motion.div
                  key={quest.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-card border border-border rounded-2xl p-6 space-y-4 cursor-pointer hover:border-primary/50 transition-colors"
                  onClick={() => handleStart(quest.id)}
                >
                  <div className={`w-12 h-12 rounded-xl ${quest.color} text-white flex items-center justify-center`}>
                    <quest.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{quest.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{quest.description}</p>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-medium text-primary bg-primary/5 p-2 rounded-lg w-fit">
                    <Sparkles className="w-3 h-3" />
                    Reward: {quest.reward}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
