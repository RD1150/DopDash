import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/lib/store';
import Mascot from '@/components/Mascot';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Sword, Shield, X, Plus, Trash2, Trophy } from 'lucide-react';
import { soundManager } from '@/lib/sound';
import { haptics } from '@/lib/haptics';
import canvasConfetti from 'canvas-confetti';
import { cn } from '@/lib/utils';

interface BossBattleProps {
  onClose: () => void;
}

type SubTask = {
  id: string;
  text: string;
  completed: boolean;
};

export default function BossBattle({ onClose }: BossBattleProps) {
  const [step, setStep] = useState<'setup' | 'battle' | 'victory'>('setup');
  const [bossName, setBossName] = useState('');
  const [subTasks, setSubTasks] = useState<SubTask[]>([]);
  const [newTask, setNewTask] = useState('');
  const [bossHealth, setBossHealth] = useState(100);
  const [isAttacking, setIsAttacking] = useState(false);
  const [damageDealt, setDamageDealt] = useState<number | null>(null);
  const addCoins = useStore(state => state.addCoins);

  const handleAddTask = () => {
    if (newTask.trim()) {
      setSubTasks([...subTasks, { id: Date.now().toString(), text: newTask.trim(), completed: false }]);
      setNewTask('');
    }
  };

  const startBattle = () => {
    if (bossName && subTasks.length > 0) {
      setStep('battle');
      soundManager.playPop();
    }
  };

  const handleAttack = (taskId: string) => {
    const task = subTasks.find(t => t.id === taskId);
    if (task && !task.completed) {
      // Mark complete
      setSubTasks(subTasks.map(t => t.id === taskId ? { ...t, completed: true } : t));
      
      // Calculate damage
      const damagePerTask = 100 / subTasks.length;
      const newHealth = Math.max(0, bossHealth - damagePerTask);
      
      // Trigger attack animation
      setIsAttacking(true);
      setDamageDealt(Math.round(damagePerTask));
      soundManager.playSquish(); // Use squish as hit sound for now
      haptics.medium();

      // Update health after delay
      setTimeout(() => {
        setBossHealth(newHealth);
        setIsAttacking(false);
        setDamageDealt(null);
        
        if (newHealth <= 0.1) { // Floating point safety
          setTimeout(handleVictory, 1000);
        }
      }, 500);
    }
  };

  const handleVictory = () => {
    setStep('victory');
    soundManager.playSuccess();
    haptics.celebrate();
    addCoins(subTasks.length * 5); // Bonus coins!
    canvasConfetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.6 },
      colors: ['#FFD700', '#FFA500', '#FF4500']
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-card w-full max-w-lg h-[80vh] rounded-3xl shadow-2xl border-2 border-primary/20 flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center bg-muted/30">
          <h2 className="font-bold text-lg flex items-center gap-2">
            <Sword className="w-5 h-5 text-red-500" />
            Boss Battle
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {step === 'setup' && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h3 className="text-2xl font-bold">Name Your Enemy</h3>
                <p className="text-muted-foreground">What big task are you slaying today?</p>
              </div>
              
              <Input 
                placeholder="e.g. The Tax Dragon, Laundry Mountain" 
                value={bossName}
                onChange={(e) => setBossName(e.target.value)}
                className="text-lg p-6"
                autoFocus
              />

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Battle Plan (Sub-tasks)</h4>
                  <span className="text-xs text-muted-foreground">Break it down to deal damage!</span>
                </div>
                
                <div className="flex gap-2">
                  <Input 
                    placeholder="Add a step..." 
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
                  />
                  <Button onClick={handleAddTask} size="icon">
                    <Plus className="w-5 h-5" />
                  </Button>
                </div>

                <div className="space-y-2">
                  {subTasks.map(task => (
                    <div key={task.id} className="flex items-center justify-between bg-muted/50 p-3 rounded-xl">
                      <span>{task.text}</span>
                      <button 
                        onClick={() => setSubTasks(subTasks.filter(t => t.id !== task.id))}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {subTasks.length === 0 && (
                    <div className="text-center p-4 text-muted-foreground text-sm italic border-2 border-dashed rounded-xl">
                      No attacks planned yet. Add sub-tasks!
                    </div>
                  )}
                </div>
              </div>

              <Button 
                className="w-full text-lg py-6 font-bold" 
                disabled={!bossName || subTasks.length === 0}
                onClick={startBattle}
              >
                Enter the Arena
              </Button>
            </div>
          )}

          {step === 'battle' && (
            <div className="h-full flex flex-col">
              {/* Arena */}
              <div className="flex-1 relative flex items-center justify-center mb-6 bg-zinc-900 rounded-2xl overflow-hidden border-4 border-zinc-800">
                {/* Background Grid */}
                <div className="absolute inset-0 opacity-20" 
                  style={{ backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)', backgroundSize: '20px 20px' }} 
                />

                {/* Boss */}
                <motion.div 
                  className="absolute top-10"
                  animate={isAttacking ? { x: [0, 10, -10, 5, -5, 0], color: '#ef4444' } : { y: [0, -10, 0] }}
                  transition={isAttacking ? { duration: 0.4 } : { duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  <div className="text-8xl filter drop-shadow-2xl grayscale brightness-50 contrast-125">
                    👾
                  </div>
                  <div className="text-center font-bold text-white mt-2 bg-black/50 px-3 py-1 rounded-full backdrop-blur-sm">
                    {bossName}
                  </div>
                </motion.div>

                {/* Damage Number */}
                <AnimatePresence>
                  {damageDealt && (
                    <motion.div
                      initial={{ opacity: 0, y: 0, scale: 0.5 }}
                      animate={{ opacity: 1, y: -50, scale: 1.5 }}
                      exit={{ opacity: 0 }}
                      className="absolute top-20 text-4xl font-black text-red-500 stroke-white stroke-2"
                      style={{ textShadow: '2px 2px 0 #fff' }}
                    >
                      -{damageDealt}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Hero */}
                <motion.div 
                  className="absolute bottom-[-20px]"
                  animate={isAttacking ? { y: [0, -50, 0], scale: [1, 1.2, 1] } : {}}
                >
                  <div className="w-32 h-32">
                    <Mascot pose={isAttacking ? "jumping" : "hero"} className="w-full h-full" />
                  </div>
                </motion.div>
              </div>

              {/* Boss Health */}
              <div className="mb-6 space-y-2">
                <div className="flex justify-between text-sm font-bold">
                  <span>Boss Health</span>
                  <span>{Math.round(bossHealth)}%</span>
                </div>
                <Progress value={bossHealth} className="h-4 bg-zinc-200 dark:bg-zinc-800 [&>div]:bg-red-500" />
              </div>

              {/* Attack Controls */}
              <div className="space-y-2 overflow-y-auto max-h-[200px]">
                {subTasks.map(task => (
                  <button
                    key={task.id}
                    disabled={task.completed}
                    onClick={() => handleAttack(task.id)}
                    className={cn(
                      "w-full p-4 rounded-xl border-2 text-left transition-all flex items-center justify-between group",
                      task.completed 
                        ? "bg-muted border-transparent opacity-50" 
                        : "bg-card border-muted hover:border-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                    )}
                  >
                    <span className={cn("font-medium", task.completed && "line-through")}>{task.text}</span>
                    {!task.completed && (
                      <span className="text-xs font-bold bg-red-100 text-red-600 px-2 py-1 rounded uppercase group-hover:bg-red-500 group-hover:text-white transition-colors">
                        Attack!
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 'victory' && (
            <div className="text-center space-y-6 py-10">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1, rotate: 360 }}
                transition={{ type: "spring" }}
                className="text-8xl"
              >
                🏆
              </motion.div>
              <div className="space-y-2">
                <h3 className="text-3xl font-black text-primary">VICTORY!</h3>
                <p className="text-xl text-muted-foreground">You defeated {bossName}!</p>
              </div>
              <div className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 p-4 rounded-2xl inline-block font-bold text-xl">
                +{subTasks.length * 5} Coins Earned
              </div>
              <Button onClick={onClose} className="w-full text-lg py-6 mt-8">
                Return to Dash
              </Button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
