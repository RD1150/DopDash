import Layout from '@/components/Layout';
import Mascot, { MascotPose } from '@/components/Mascot';
import { haptics } from '@/lib/haptics';
import { soundManager } from '@/lib/sound';
import { useStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import canvasConfetti from 'canvas-confetti';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Pencil, Settings, Sparkles, BrainCircuit, Zap, Sword, RefreshCw, Plus } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { useLocation } from 'wouter';
import TutorialOverlay from '@/components/TutorialOverlay';
import LootBox from '@/components/LootBox';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import FocusMode from '@/components/FocusMode';
import BossBattle from '@/components/BossBattle';
import BodyDouble from '@/components/BodyDouble';
import { Timer } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Dash() {
  const [, setLocation] = useLocation();
  const actions = useStore((state) => state.todaysActions);
  const toggleAction = useStore((state) => state.toggleAction);
  const resetDay = useStore((state) => state.resetDay);
  const updateActionText = useStore((state) => state.updateActionText);
  const coins = useStore((state) => state.coins);
  const addCoins = useStore((state) => state.addCoins);
  const zenMode = useStore((state) => state.zenMode);
  const swapAction = useStore((state) => state.swapAction);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [magicMode, setMagicMode] = useState(false);
  const [focusTask, setFocusTask] = useState<{id: string, text: string} | null>(null);
  const [showBrainDump, setShowBrainDump] = useState(false);
  const [challengeMode, setChallengeMode] = useState(false);
  const [challengeTime, setChallengeTime] = useState<number | null>(null);
  const [comboCount, setComboCount] = useState(0);
  const [lastActionTime, setLastActionTime] = useState(0);
  const [showLootBox, setShowLootBox] = useState(false);
  const [showBossBattle, setShowBossBattle] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Ensure we have actions if page is loaded directly
  useEffect(() => {
    if (actions.length === 0) {
      resetDay();
    }
  }, [actions.length, resetDay]);

  // Check for completion to trigger reward
  useEffect(() => {
    if (actions.length > 0 && actions.every(a => a.completed)) {
      soundManager.playSuccess();
      haptics.celebrate();
      canvasConfetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#A7F3D0', '#6EE7B7', '#34D399', '#FCD34D', '#FDBA74'] // Sage/Green/Gold theme
      });
      
      // Challenge Mode Bonus
      if (challengeMode && challengeTime && challengeTime > 0) {
        // Double coins logic would go here if we had a method for it
        // For now just extra confetti
        setTimeout(() => {
          canvasConfetti({
            particleCount: 50,
            spread: 100,
            origin: { y: 0.3 },
            colors: ['#FFD700']
          });
        }, 500);
      }
      
      // 20% chance for Loot Box
      if (Math.random() < 0.2) {
        setTimeout(() => setShowLootBox(true), 1000);
      } else {
        const timer = setTimeout(() => {
          setLocation('/reward');
        }, 1500); // Longer delay to enjoy confetti
        return () => clearTimeout(timer);
      }
    }
  }, [actions, setLocation, challengeMode, challengeTime]);

  // Challenge Timer
  useEffect(() => {
    if (challengeMode && challengeTime !== null && challengeTime > 0 && !actions.every(a => a.completed)) {
      const timer = setInterval(() => {
        setChallengeTime(prev => (prev && prev > 0) ? prev - 1 : 0);
      }, 1000);
      return () => clearInterval(timer);
    } else if (challengeTime === 0) {
      setChallengeMode(false); // Challenge failed
    }
  }, [challengeMode, challengeTime, actions]);

  const startChallenge = () => {
    if (actions.some(a => a.completed)) {
      if (!confirm("Start a Speed Dash? It's best to start with 0 tasks done.")) return;
    }
    setChallengeMode(true);
    setChallengeTime(300); // 5 minutes
    soundManager.playPop();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleToggle = (id: string) => {
    if (editingId === id) return; // Don't toggle while editing
    const action = actions.find(a => a.id === id);
    
    if (action && !action.completed) {
      // Combo Logic
      const now = Date.now();
      const timeDiff = now - lastActionTime;
      let newCombo = 1;
      
      if (timeDiff < 5000) { // 5 second window for combo
        newCombo = comboCount + 1;
        setComboCount(newCombo);
        soundManager.playCombo(newCombo);
        
        // Visual shake effect
        const container = document.getElementById('dash-container');
        if (container) {
          container.animate([
            { transform: 'translateX(0)' },
            { transform: 'translateX(-5px)' },
            { transform: 'translateX(5px)' },
            { transform: 'translateX(0)' }
          ], { duration: 200 });
        }
      } else {
        setComboCount(1);
        soundManager.playPop();
      }
      
      setLastActionTime(now);
      haptics.success();
      addCoins(1); // Earn 1 coin per task
    }
    
    toggleAction(id);
  };

  const startEditing = (e: React.MouseEvent, id: string, currentText: string) => {
    e.stopPropagation();
    setEditingId(id);
    setEditText(currentText);
    // Focus will be handled by useEffect or autoFocus
  };

  const saveEdit = () => {
    if (editingId && editText.trim()) {
      updateActionText(editingId, editText.trim());
    }
    setEditingId(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      saveEdit();
    } else if (e.key === 'Escape') {
      setEditingId(null);
    }
  };

  const handleMagicButton = () => {
    const incomplete = actions.filter(a => !a.completed);
    if (incomplete.length === 0) return;
    
    setMagicMode(true);
    soundManager.playPop();
    
    // Simulate "thinking"
    setTimeout(() => {
      const random = incomplete[Math.floor(Math.random() * incomplete.length)];
      // Hide others visually via CSS class or state
      // For now, we'll just highlight the chosen one
      const el = document.getElementById(`action-${random.id}`);
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el?.focus();
      haptics.success();
      
      // Reset magic mode after a bit
      setTimeout(() => setMagicMode(false), 2000);
    }, 1000);
  };

  const completedCount = actions.filter(a => a.completed).length;
  const progress = Math.round((completedCount / 3) * 100);

  // Determine mascot pose based on progress
  let mascotPose: MascotPose = 'waiting';
  if (completedCount === 1) mascotPose = 'happy';
  if (completedCount === 2) mascotPose = 'proud';
  if (completedCount === 3) mascotPose = 'hero';
  
  // Override with jumping pose if on a combo streak
  if (comboCount > 3) mascotPose = 'jumping';

  const handleMascotInteraction = (type: 'pet' | 'feed') => {
    if (type === 'pet') {
      soundManager.playSquish();
      haptics.medium();
      // Visual feedback handled by Mascot component internal state or we could lift it
    } else if (type === 'feed') {
      soundManager.playPop();
      haptics.success();
      // Could add a feeding animation state here
    }
  };

  return (
    <Layout>
      <TutorialOverlay />
      <AnimatePresence>
        {showLootBox && <LootBox onClose={() => {
          setShowLootBox(false);
          setLocation('/reward');
        }} />}
        {showBossBattle && <BossBattle onClose={() => setShowBossBattle(false)} />}
      </AnimatePresence>
      <BodyDouble />
      <div className="flex flex-col h-full">
        {/* Header */}
        <header className="pt-8 pb-12 space-y-2">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-primary">Today’s Dash</h1>
              <div className="flex items-center gap-3 mt-1">
                <p className="text-muted-foreground">Just start. That’s enough.</p>
                {!zenMode && (
                  <>
                    <div className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 px-3 py-0.5 rounded-full text-sm font-bold flex items-center gap-1">
                      <span>⭐</span> {coins}
                    </div>
                    {comboCount > 1 && (
                      <div className="animate-bounce bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 px-3 py-0.5 rounded-full text-sm font-bold flex items-center gap-1">
                        <span>🔥</span> {comboCount}x COMBO!
                      </div>
                    )}
                  </>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Plus className="w-4 h-4" />
                      New Mission
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-56">
                    <DropdownMenuItem onClick={() => setShowBrainDump(true)} className="gap-2 cursor-pointer">
                      <Sparkles className="w-4 h-4 text-yellow-500" />
                      <span>Quick Win (Minor)</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setShowBossBattle(true)} className="gap-2 cursor-pointer">
                      <Sword className="w-4 h-4 text-red-500" />
                      <span>Slay a Monster (Major)</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => useStore.getState().startBodyDouble("Focus Sprint")} className="gap-2 cursor-pointer">
                      <Timer className="w-4 h-4 text-blue-500" />
                      <span>Body Double (Sprint)</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            
            {/* Mascot & Progress */}
            <div className="flex items-center gap-4" role="status" aria-label={`Progress: ${completedCount} of 3 actions completed`}>
              <div className="w-16 h-16 relative group" aria-hidden="true">
                <Mascot pose={mascotPose} />
                
                {/* Interaction Menu (Hover/Focus) */}
                <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 backdrop-blur-sm p-1 rounded-full shadow-lg border border-border">
                  <button 
                    onClick={() => handleMascotInteraction('pet')}
                    className="p-1.5 hover:bg-primary/10 rounded-full text-xs"
                    title="Pet"
                  >
                    👋
                  </button>
                  <button 
                    onClick={() => handleMascotInteraction('feed')}
                    className="p-1.5 hover:bg-primary/10 rounded-full text-xs"
                    title="Feed"
                  >
                    🍎
                  </button>
                </div>
              </div>
              {/* Progress Ring */}
              <div className="relative w-12 h-12 flex items-center justify-center" aria-hidden="true">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-muted"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <motion.path
                  className="text-primary"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeDasharray={`${progress}, 100`}
                  initial={{ strokeDasharray: "0, 100" }}
                  animate={{ strokeDasharray: `${progress}, 100` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
                </svg>
              </div>
            </div>
          </div>
        </header>

        {/* Actions List */}
        <div className="flex-1 space-y-6">
          <AnimatePresence>
            {actions.map((action, index) => (
              <motion.div
                key={action.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleToggle(action.id)}
                role="checkbox"
                aria-checked={action.completed}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === ' ' || e.key === 'Enter') {
                    e.preventDefault();
                    handleToggle(action.id);
                  }
                }}
                className={cn(
                  "group relative overflow-hidden rounded-2xl p-6 cursor-pointer transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                  "bg-card shadow-sm border border-transparent hover:shadow-md",
                  action.completed ? "bg-primary/5 border-primary/20" : "hover:border-primary/10"
                )}
              >
                <div className="flex items-center gap-4">
                  {/* Checkbox */}
                  <div className={cn(
                    "w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300",
                    action.completed 
                      ? "bg-primary border-primary scale-110" 
                      : "border-muted-foreground/30 group-hover:border-primary/50"
                  )}>
                    <AnimatePresence>
                      {action.completed && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                        >
                          <Check className="w-5 h-5 text-primary-foreground" strokeWidth={3} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Text */}
                  <div className="flex-1">
                    {editingId === action.id ? (
                      <Input
                        ref={inputRef}
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        onBlur={saveEdit}
                        onKeyDown={handleKeyDown}
                        autoFocus
                        className="text-lg font-medium bg-transparent border-none shadow-none focus-visible:ring-0 p-0 h-auto"
                        onClick={(e) => e.stopPropagation()}
                      />
                    ) : (
                      <div className="flex items-center justify-between group/text">
                        <p className={cn(
                          "text-lg font-medium transition-all duration-300",
                          action.completed ? "text-muted-foreground line-through decoration-primary/30" : "text-foreground"
                        )}>
                          {action.text}
                        </p>
                        {!action.completed && (
                          <div className="flex opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setFocusTask({ id: action.id, text: action.text });
                              }}
                              className="p-2 text-muted-foreground hover:text-primary"
                              aria-label="Focus mode"
                              title="Start Focus Mode"
                            >
                              <Timer className="w-4 h-4" />
                            </button>
                            <button
                              onClick={(e) => startEditing(e, action.id, action.text)}
                              className="p-2 text-muted-foreground hover:text-primary"
                              aria-label="Edit action"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                swapAction(action.id);
                                soundManager.playPop();
                              }}
                              className="p-2 text-muted-foreground hover:text-primary"
                              aria-label="Swap task"
                            >
                              <RefreshCw className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Subtle fill animation on click */}
                {action.completed && (
                  <motion.div
                    layoutId={`fill-${action.id}`}
                    className="absolute inset-0 bg-primary/5 z-[-1]"
                    initial={{ scaleX: 0, originX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {focusTask && (
          <FocusMode 
            isOpen={!!focusTask}
            onClose={() => setFocusTask(null)}
            taskName={focusTask.text}
            onComplete={() => {
              handleToggle(focusTask.id);
              setFocusTask(null);
            }}
          />
        )}

        {/* Magic Button & Challenge */}
        <div className="py-8 flex flex-col items-center gap-6">
          <div className="flex gap-4">
            <Button
              onClick={handleMagicButton}
              disabled={actions.every(a => a.completed) || magicMode}
              className={cn(
                "rounded-full px-6 py-6 h-auto text-lg gap-2 shadow-lg transition-all hover:scale-105 active:scale-95",
                magicMode ? "animate-pulse bg-purple-500 hover:bg-purple-600" : "bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
              )}
            >
              <Sparkles className={cn("w-6 h-6", magicMode && "animate-spin")} />
              {magicMode ? "Picking..." : "Pick for me"}
            </Button>

            <Button
              onClick={startChallenge}
              disabled={actions.every(a => a.completed) || challengeMode}
              variant="outline"
              className={cn(
                "rounded-full px-6 py-6 h-auto text-lg gap-2 shadow-lg transition-all hover:scale-105 active:scale-95 border-2",
                challengeMode ? "border-orange-500 text-orange-500 bg-orange-50 dark:bg-orange-950/30" : "border-orange-200 hover:border-orange-400 text-orange-600"
              )}
            >
              <Zap className={cn("w-6 h-6", challengeMode && "animate-pulse")} />
              {challengeMode ? formatTime(challengeTime || 0) : "Speed Dash"}
            </Button>
          </div>
          
          <p className="text-sm text-muted-foreground/40 text-center max-w-xs">
            Use <strong>Pick for me</strong> if you're stuck, or <strong>Speed Dash</strong> to race against the clock (5 min).
          </p>
        </div>
      </div>
    </Layout>
  );
}
