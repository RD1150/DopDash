import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CustomAccessory } from '@/components/DesignStudio';

export type Flavor = 'calm' | 'playful' | 'matter-of-fact' | 'celebratory';
export type Theme = 'default' | 'ocean' | 'sunset' | 'lavender' | 'cottagecore' | 'cyberpunk';
export type Context = 'nest' | 'grind' | 'self' | 'family';

export type MoodEntry = {
  date: string;
  beforeMood: number; // 1-5
  afterMood: number; // 1-5
  taskCompleted: boolean;
  improvement: number; // afterMood - beforeMood
};

export type MicroAction = {
  id: string;
  text: string;
  category: 'focus' | 'energy' | 'momentum';
  taskType?: 'grind' | 'housework' | 'self-care'; // Dashie outfit type
  completed: boolean;
  difficulty?: 'easy' | 'medium' | 'hard';
  duration?: 2 | 5 | 10; // Duration in minutes
  subtasks?: SubTask[];
  parentTaskId?: string; // If this is a subtask
};

export type SubTask = {
  id: string;
  text: string;
  completed: boolean;
};

export type Badge = {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedDate?: string;
};

interface AppState {
  hasStarted: boolean;
  flavor: Flavor;
  theme: Theme;
  context: Context;
  zenMode: boolean;
  soundTheme: 'default' | 'arcade' | 'nature';
  todaysActions: MicroAction[];
  streak: number;
  lastCompletedDate: string | null;
  history: string[];
  hasSeenTutorial: boolean;
  badges: Badge[];
  notificationsEnabled: boolean;
  coins: number;
  inventory: string[];
  customAccessories: CustomAccessory[];
  equippedCustomAccessory: string | null;
  equippedItems: Record<string, string | undefined>;
  bodyDoubleActive: boolean;
  bodyDoubleTask: string | null;
  bodyDoubleStartTime: number | null;
  xp: number;
  level: number;
  vacationMode: boolean;
  vacationDaysRemaining: number;
  lastAffirmationDate: string | null;
  savedTasks: Array<{ text: string; category: 'focus' | 'energy' | 'momentum' }>;
  emergencyMode: boolean;
  brainDump: string;
  activeQuest: string | null;
  taskDifficultyRatings: Record<string, 'easy' | 'medium' | 'hard'>;
  questProgress: number;
  showOnboardingChecklist: boolean;
  onboardingChecklist: Record<string, boolean>;
  moodHistory: MoodEntry[];
  currentMoodBefore: number | null;
  moodCheckEnabled: boolean;
  currentEnergyLevel: number | null;
  parallelTasks: string[];
  expandedTaskId: string | null;
  microTryMode: boolean;
  microTryTaskId: string | null;
  momentumMode: boolean;
  bodyDoubleModeEnabled: boolean;
  microWinsJournal: any[];
  referralCode: string;
  referredFriends: string[];
  streakCount: number; // Consecutive tasks completed today
  streakMultiplier: number; // 1x or 2x based on streak
  brainDumpBacklog: Array<{ text: string; category: 'focus' | 'energy' | 'momentum' }>;
  dailyChallenges: Array<{ id: string; title: string; type: 'tasks' | 'coins'; target: number; progress: number; bonus: number; completed: boolean }>;
  dailyChallengesDate: string | null;
  currentEmotionalState: 'anxious' | 'bored' | 'overwhelmed' | 'energized' | null;
  archivedTasks: MicroAction[];
  hyperfocusMode: boolean;
  hyperfocusStartTime: number | null;
  hyperfocusTaskId: string | null;
  accountabilityPartner: string | null;
  lastCheckInDate: string | null;
  todaysEnergyLevel: 'low' | 'medium' | 'high' | null;
  todaysVibe: 'anxious' | 'bored' | 'overwhelmed' | 'energized' | null;
  todaysNeed: 'quick-wins' | 'deep-focus' | 'movement' | 'rest' | null;
  totalTasksCompleted: number; // Track total tasks for milestones
  grindTasksCompleted: number; // Track grind tasks for outfit collector
  houseworkTasksCompleted: number; // Track housework tasks for outfit collector
  selfCareTasksCompleted: number; // Track self-care tasks for outfit collector
  perfectWeekDates: string[]; // Track consecutive days for perfect week badge
  completionSoundEnabled: boolean; // Toggle for subtle completion tone (default OFF)
  demoMode: boolean; // Track if user is in demo mode
  demoTasksCompleted: number; // Track tasks completed in demo (limit 5)
  demoStartTime: number | null; // Track when demo started
  showDemoTutorial: boolean; // Show 3-step tutorial on first demo load

  // Actions
  startApp: () => void;
  completeTutorial: () => void;
  setFlavor: (flavor: Flavor) => void;
  setTheme: (theme: Theme) => void;
  setContext: (context: Context) => void;
  setZenMode: (enabled: boolean) => void;
  setSoundTheme: (theme: 'default' | 'arcade' | 'nature') => void;
  toggleAction: (id: string) => void;
  resetDay: () => void;
  checkStreak: () => void;
  updateActionText: (id: string, text: string) => void;
  checkBadges: () => void;
  setNotificationsEnabled: (enabled: boolean) => void;
  purchaseItem: (itemId: string, cost: number) => boolean;
  equipItem: (slot: 'hat' | 'glasses' | 'accessory', itemId: string | undefined) => void;
  addCoins: (amount: number) => void;
  updateStreakCount: (count: number) => void;
  addToBrainDump: (task: { text: string; category: 'focus' | 'energy' | 'momentum' }) => void;
  removeFromBrainDump: (index: number) => void;
  moveBrainDumpToToday: (index: number) => void;
  generateDailyChallenges: () => void;
  updateChallengeProgress: (challengeId: string, progress: number) => void;
  setCustomAccessory: (accessory: CustomAccessory) => void;
  equipCustomAccessory: (id: string | null) => void;
  swapAction: (id: string) => void;
  startBodyDouble: (userTask: string) => void;
  stopBodyDouble: () => void;
  setVacationMode: (days: number) => void;
  cancelVacationMode: () => void;
  setLastAffirmationDate: (date: string) => void;
  addAction: (text: string, category?: 'focus' | 'energy' | 'momentum') => void;
  saveTask: (text: string, category: 'focus' | 'energy' | 'momentum') => void;
  removeSavedTask: (text: string) => void;
  setEmergencyMode: (enabled: boolean) => void;
  setBrainDump: (text: string) => void;
  startQuest: (questId: string) => void;
  advanceQuest: () => void;
  quitQuest: () => void;
  setOnboardingChecklist: (key: string, value: boolean) => void;
  dismissOnboardingChecklist: () => void;
  rateDifficulty: (taskId: string, difficulty: 'easy' | 'medium' | 'hard') => void;
  setMoodBefore: (mood: number) => void;
  recordMoodAfter: (mood: number) => void;
  setMoodCheckEnabled: (enabled: boolean) => void;
  setEnergyLevel: (level: number) => void;
  addParallelTask: (taskId: string) => void;
  removeParallelTask: (taskId: string) => void;
  setExpandedTask: (taskId: string | null) => void;
  addSubtasks: (parentTaskId: string, subtasks: SubTask[]) => void;
  toggleSubtask: (parentTaskId: string, subtaskId: string) => void;
  getTasksByEnergyLevel: (energyLevel: number) => MicroAction[];
  getRandomTask: () => MicroAction | null;
  startMicroTry: (taskId: string) => void;
  endMicroTry: () => void;
  continueMicroTry: () => void;
  setMomentumMode: (enabled: boolean) => void;
  setBodyDoubleModeEnabled: (enabled: boolean) => void;
  addMicroWinJournalEntry: (taskId: string, entry: string) => void;
  generateReferralCode: () => string;
  addReferredFriend: (friendId: string) => void;
  setEmotionalState: (state: 'anxious' | 'bored' | 'overwhelmed' | 'energized' | null) => void;
  archiveTask: (taskId: string) => void;
  restoreArchivedTask: (taskId: string) => void;
  startHyperfocus: (taskId: string) => void;
  stopHyperfocus: () => void;
  setAccountabilityPartner: (partnerId: string | null) => void;
  setDailyCheckIn: (energy: 'low' | 'medium' | 'high', vibe: 'anxious' | 'bored' | 'overwhelmed' | 'energized', need: 'quick-wins' | 'deep-focus' | 'movement' | 'rest') => void;
  getDashieGreeting: () => string;
  getDashieEncouragement: () => string;
  toggleCompletionSound: () => void;
  setDemoMode: (enabled: boolean) => void;
  incrementDemoTasksCompleted: () => void;
  setShowDemoTutorial: (show: boolean) => void;
}

const BADGES_LIBRARY: Badge[] = [
  // ADHD-friendly badges: celebrate wins, not perfection
  { id: 'first_step', name: 'First Step', description: 'You did it! Completed your first dash', icon: '🌱', unlocked: false },
  { id: 'momentum', name: 'Momentum', description: 'You\'re on a roll! Keep going when you feel like it', icon: '🔥', unlocked: false },
  { id: 'task_master', name: 'Task Master', description: 'You\'ve completed 50 tasks. Amazing!', icon: '🏆', unlocked: false },
  { id: 'outfit_collector', name: 'Outfit Collector', description: 'You\'ve tried all of Dashie\'s outfits', icon: '🎨', unlocked: false },
];

// REMOVED: Streak-based badges (perfectionism trap)
// REMOVED: Time-based badges (decision fatigue)
// REMOVED: Consecutive day requirements (shame spiral risk)
// KEPT: Celebration-based badges (you did something!)

const TASK_PACKS: Record<Context, Omit<MicroAction, 'completed'>[]> = {
  nest: [
    { id: 'n1', text: 'Put away one dish', category: 'momentum', duration: 2 },
    { id: 'n2', text: 'Pick up one item from the floor', category: 'momentum', duration: 2 },
    { id: 'n3', text: 'Wipe one surface', category: 'momentum', duration: 5 },
    { id: 'n4', text: 'Open a window', category: 'energy', duration: 2 },
    { id: 'n5', text: 'Water one plant', category: 'energy', duration: 5 },
    { id: 'n6', text: 'Sort one piece of mail', category: 'focus', duration: 5 },
  ],
  grind: [
    { id: 'g1', text: 'Open the document', category: 'focus', duration: 2 },
    { id: 'g2', text: 'Write one sentence', category: 'focus', duration: 5 },
    { id: 'g3', text: 'Read one email', category: 'focus', duration: 5 },
    { id: 'g4', text: 'Close one tab', category: 'momentum', duration: 2 },
    { id: 'g5', text: 'Rename one file', category: 'momentum', duration: 2 },
    { id: 'g6', text: 'Stand up and stretch', category: 'energy', duration: 2 },
  ],
  self: [
    { id: 's1', text: 'Drink a glass of water', category: 'energy', duration: 2 },
    { id: 's2', text: 'Take three deep breaths', category: 'energy', duration: 2 },
    { id: 's3', text: 'Step outside for a moment', category: 'energy', duration: 5 },
    { id: 's4', text: 'Put on comfortable clothes', category: 'momentum', duration: 5 },
    { id: 's5', text: 'Wash your face', category: 'momentum', duration: 5 },
    { id: 's6', text: 'Listen to one song', category: 'focus', duration: 5 },
  ],
  family: [
    { id: 'f1', text: 'Hug someone', category: 'momentum', duration: 2 },
    { id: 'f2', text: 'Put away one toy', category: 'momentum', duration: 2 },
    { id: 'f3', text: 'Send one text to family', category: 'momentum', duration: 5 },
    { id: 'f4', text: 'Listen for 2 minutes', category: 'focus', duration: 2 },
    { id: 'f5', text: 'Plan one meal', category: 'focus', duration: 10 },
    { id: 'f6', text: 'Take a deep breath before reacting', category: 'energy', duration: 2 },
  ]
};

const DEFAULT_ACTIONS = TASK_PACKS.self;

const DEFAULT_TASK_SUGGESTIONS = [
  "Stand up and stretch for 30 seconds",
  "Put one item away",
  "Open the document you are avoiding",
  "Pick up 3 items from the floor",
  "Take three deep breaths",
  "Drink a glass of water",
  "Close one tab",
  "Write one sentence",
];

const getRandomDefaultTask = () => {
  return DEFAULT_TASK_SUGGESTIONS[Math.floor(Math.random() * DEFAULT_TASK_SUGGESTIONS.length)];
};

// Initialize state from onboarding selections
const getInitialState = () => {
  // Try to read from the new persist storage first
  const persistedState = JSON.parse(localStorage.getItem('dopamine-dasher-storage') || '{}').state;
  const savedContext = persistedState?.context ? (Object.entries({ 'nest': 'The Nest', 'grind': 'The Grind', 'self': 'The Self' }).find(([k]) => k === persistedState.context)?.[1]) : localStorage.getItem('dashie_context');
  const savedTheme = persistedState?.theme ? (Object.entries({ 'cottagecore': 'Cottagecore', 'cyberpunk': 'Cyberpunk', 'ocean': 'Ocean' }).find(([k]) => k === persistedState.theme)?.[1]) : localStorage.getItem('dashie_theme');
  
  const contextMap: Record<string, Context> = {
    'The Nest': 'nest',
    'The Grind': 'grind',
    'The Self': 'self',
  };
  
  const themeMap: Record<string, Theme> = {
    'Cottagecore': 'cottagecore',
    'Cyberpunk': 'cyberpunk',
    'Ocean': 'ocean',
  };
  
  const context = (savedContext && contextMap[savedContext]) ? contextMap[savedContext] : 'self';
  const theme = (savedTheme && themeMap[savedTheme]) ? themeMap[savedTheme] : 'default';
  
  const pack = TASK_PACKS[context];
  const shuffled = [...pack].sort(() => 0.5 - Math.random());
  const todaysActions = shuffled.slice(0, 3).map(a => ({ ...a, completed: false }));
  
  return {
    context,
    theme,
    todaysActions,
  };
};

const initialState = getInitialState();

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      hasStarted: false,
      flavor: 'calm',
      theme: initialState.theme,
      context: initialState.context,
      zenMode: false,
      soundTheme: 'default',
      todaysActions: initialState.todaysActions,
      streak: 0,
      lastCompletedDate: null,
      history: [],
      hasSeenTutorial: false,
      badges: BADGES_LIBRARY,
      notificationsEnabled: false,
      coins: 0,
      inventory: [],
      customAccessories: [],
      equippedCustomAccessory: null,
      equippedItems: {},
      bodyDoubleActive: false,
      bodyDoubleTask: null,
      bodyDoubleStartTime: null,
      xp: 0,
      level: 1,
      vacationMode: false,
      vacationDaysRemaining: 0,
      lastAffirmationDate: null,
      savedTasks: [],
      emergencyMode: false,
      brainDump: '',
      activeQuest: null,
      taskDifficultyRatings: {},
      questProgress: 0,
      showOnboardingChecklist: true,
      onboardingChecklist: {
        first_task: false,
        pet_mascot: false,
        check_streak: false,
        customize_theme: false,
        boss_battle: false,
      },
      moodHistory: [],
      currentMoodBefore: null,
      moodCheckEnabled: true,
      currentEnergyLevel: null,
      parallelTasks: [],
      expandedTaskId: null,
      microTryMode: false,
      microTryTaskId: null,
      momentumMode: false,
      bodyDoubleModeEnabled: false,
      microWinsJournal: [],
      referralCode: Math.random().toString(36).substring(2, 10).toUpperCase(),
      referredFriends: [],
      streakCount: 0,
      streakMultiplier: 1,
      brainDumpBacklog: [],
      dailyChallenges: [],
      dailyChallengesDate: null,
      currentEmotionalState: null,
      archivedTasks: [],
      hyperfocusMode: false,
      hyperfocusStartTime: null,
      hyperfocusTaskId: null,
      accountabilityPartner: null,
      lastCheckInDate: null,
      todaysEnergyLevel: null,
      todaysVibe: null,
      todaysNeed: null,
      totalTasksCompleted: 0,
      grindTasksCompleted: 0,
      houseworkTasksCompleted: 0,
      selfCareTasksCompleted: 0,
      perfectWeekDates: [],
      completionSoundEnabled: false, // OFF by default
      demoMode: false, // Track if user is in demo mode
      demoTasksCompleted: 0, // Track tasks completed in demo (limit 5)
      demoStartTime: null, // Track when demo started
      showDemoTutorial: false, // Show 3-step tutorial on first demo load

      startApp: () => set({ hasStarted: true }),
      completeTutorial: () => set({ hasSeenTutorial: true }),

      setFlavor: (flavor: Flavor) => set({ flavor }),
      setTheme: (theme: Theme) => set({ theme }),
      setContext: (context: Context) => {
        const pack = TASK_PACKS[context];
        const shuffled = [...pack].sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 3).map(a => ({ ...a, completed: false }));
        
        const defaultTask: MicroAction = {
          id: 'default-' + Date.now(),
          text: getRandomDefaultTask(),
          category: 'momentum',
          completed: false,
        };
        
        set({ context, todaysActions: [defaultTask, ...selected] });
      },
      setZenMode: (zenMode: boolean) => set({ zenMode }),
      setSoundTheme: (soundTheme: 'default' | 'arcade' | 'nature') => set({ soundTheme }),

      toggleAction: (id: string) => {
        const { todaysActions, lastCompletedDate, streak, coins, totalTasksCompleted, grindTasksCompleted, houseworkTasksCompleted, selfCareTasksCompleted, perfectWeekDates } = get();
        const action = todaysActions.find((a) => a.id === id);
        const isCompleting = action && !action.completed;

        const newActions = todaysActions.map((a: MicroAction) =>
          a.id === id ? { ...a, completed: !a.completed } : a
        );
        
        const allCompleted = newActions.every((a: MicroAction) => a.completed);
        const today = new Date().toDateString();
        
        let newStreak = streak;
        let newLastCompletedDate = lastCompletedDate;
        let newTotalTasks = totalTasksCompleted;
        let newGrindTasks = grindTasksCompleted;
        let newHouseworkTasks = houseworkTasksCompleted;
        let newSelfCareTasks = selfCareTasksCompleted;
        let newPerfectWeekDates = perfectWeekDates;

        let newHistory = get().history || [];

        if (allCompleted && lastCompletedDate !== today) {
          newStreak += 1;
          newLastCompletedDate = today;
          const todayISO = new Date().toISOString().split('T')[0];
          if (!newHistory.includes(todayISO)) {
            newHistory = [...newHistory, todayISO];
            newPerfectWeekDates = [...newPerfectWeekDates, todayISO];
            if (newPerfectWeekDates.length > 7) {
              newPerfectWeekDates = newPerfectWeekDates.slice(-7);
            }
          }
        }

        if (isCompleting) {
          // Track task type
          const taskType = action?.taskType;
          if (taskType === 'grind') newGrindTasks += 1;
          if (taskType === 'housework') newHouseworkTasks += 1;
          if (taskType === 'self-care') newSelfCareTasks += 1;
          
          newTotalTasks += 1;
          
          set({
            todaysActions: newActions,
            streak: newStreak,
            lastCompletedDate: newLastCompletedDate,
            coins: coins + 1,
            history: newHistory,
            totalTasksCompleted: newTotalTasks,
            grindTasksCompleted: newGrindTasks,
            houseworkTasksCompleted: newHouseworkTasks,
            selfCareTasksCompleted: newSelfCareTasks,
            perfectWeekDates: newPerfectWeekDates,
          });
          
          // Check for badge unlocks
          get().checkBadges();
        } else {
          set({ todaysActions: newActions });
        }
      },

      resetDay: () => {
        const { context } = get();
        const pack = TASK_PACKS[context];
        const shuffled = [...pack].sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 3).map(a => ({ ...a, completed: false }));
        set({ todaysActions: selected });
      },

      checkStreak: () => {
        const { lastCompletedDate, streak } = get();
        const today = new Date().toDateString();
        const yesterday = new Date(Date.now() - 86400000).toDateString();

        if (lastCompletedDate !== today && lastCompletedDate !== yesterday) {
          set({ streak: 0 });
        }
      },

      updateActionText: (id: string, text: string) => {
        const { todaysActions } = get();
        const updated = todaysActions.map((a) =>
          a.id === id ? { ...a, text } : a
        );
        set({ todaysActions: updated });
      },

checkBadges: () => {
        // ADHD-friendly badge system: celebrate wins, not perfection
        const { badges, totalTasksCompleted, grindTasksCompleted, houseworkTasksCompleted, selfCareTasksCompleted } = get();
        let coinBonus = 0;
        
        const updated = badges.map((badge) => {
          // First Step - celebrate first completion
          if (badge.id === 'first_step' && totalTasksCompleted >= 1 && !badge.unlocked) {
            return { ...badge, unlocked: true, unlockedDate: new Date().toISOString() };
          }
          
          // Momentum - celebrate 3 tasks (optional milestone, no pressure)
          if (badge.id === 'momentum' && totalTasksCompleted >= 3 && !badge.unlocked) {
            return { ...badge, unlocked: true, unlockedDate: new Date().toISOString() };
          }
          
          // Task Master - 50 tasks (aspirational, not required)
          if (badge.id === 'task_master' && totalTasksCompleted >= 50 && !badge.unlocked) {
            coinBonus += 50; // Modest coin bonus, not overwhelming
            return { ...badge, unlocked: true, unlockedDate: new Date().toISOString() };
          }
          
          // Outfit Collector - tried all Dashie outfits (fun exploration)
          if (badge.id === 'outfit_collector' && grindTasksCompleted >= 10 && houseworkTasksCompleted >= 10 && selfCareTasksCompleted >= 10 && !badge.unlocked) {
            return { ...badge, unlocked: true, unlockedDate: new Date().toISOString() };
          }
          
          return badge;
        });
        
        if (coinBonus > 0) {
          const { coins } = get();
          set({ coins: coins + coinBonus });
        }
        
        set({ badges: updated });
      },

      setNotificationsEnabled: (enabled: boolean) => set({ notificationsEnabled: enabled }),

      purchaseItem: (itemId: string, cost: number) => {
        const { coins, inventory } = get();
        if (coins >= cost) {
          set({
            coins: coins - cost,
            inventory: [...inventory, itemId],
          });
          return true;
        }
        return false;
      },

      equipItem: (slot: 'hat' | 'glasses' | 'accessory', itemId: string | undefined) => {
        const { equippedItems } = get();
        set({
          equippedItems: {
            ...equippedItems,
            [slot]: itemId,
          },
        });
      },

      addCoins: (amount: number) => {
        const { coins, streakMultiplier } = get();
        const finalAmount = amount * streakMultiplier;
        set({ coins: coins + finalAmount });
      },

      updateStreakCount: (count: number) => {
        const multiplier = count >= 3 ? 2 : 1;
        set({ streakCount: count, streakMultiplier: multiplier });
      },

      addToBrainDump: (task: { text: string; category: 'focus' | 'energy' | 'momentum' }) => {
        const { brainDumpBacklog } = get();
        set({ brainDumpBacklog: [...brainDumpBacklog, task] });
      },

      removeFromBrainDump: (index: number) => {
        const { brainDumpBacklog } = get();
        set({ brainDumpBacklog: brainDumpBacklog.filter((_, i) => i !== index) });
      },

      moveBrainDumpToToday: (index: number) => {
        const { brainDumpBacklog, todaysActions } = get();
        const task = brainDumpBacklog[index];
        if (task) {
          const newAction: MicroAction = {
            id: `brain-${Date.now()}`,
            text: task.text,
            category: task.category,
            completed: false,
          };
          set({
            todaysActions: [...todaysActions, newAction],
            brainDumpBacklog: brainDumpBacklog.filter((_, i) => i !== index),
          });
        }
      },

      generateDailyChallenges: () => {
        const today = new Date().toDateString();
        const { dailyChallengesDate } = get();
        if (dailyChallengesDate === today) return;

        const challenges = [
          { id: 'focus-2', title: 'Focus Master', type: 'tasks' as const, target: 2, progress: 0, bonus: 50, completed: false },
          { id: 'energy-1', title: 'Energy Boost', type: 'tasks' as const, target: 1, progress: 0, bonus: 30, completed: false },
          { id: 'coins-10', title: 'Coin Collector', type: 'coins' as const, target: 10, progress: 0, bonus: 100, completed: false },
        ];
        set({ dailyChallenges: challenges, dailyChallengesDate: today });
      },

      updateChallengeProgress: (challengeId: string, progress: number) => {
        const { dailyChallenges, coins } = get();
        const updated = dailyChallenges.map((c) => {
          if (c.id === challengeId) {
            const completed = progress >= c.target;
            return { ...c, progress, completed };
          }
          return c;
        });
        set({ dailyChallenges: updated });
      },

      setCustomAccessory: (accessory: CustomAccessory) => {
        const { customAccessories } = get();
        set({ customAccessories: [...customAccessories, accessory] });
      },

      equipCustomAccessory: (id: string | null) => {
        set({ equippedCustomAccessory: id });
      },

      swapAction: (id: string) => {
        const { todaysActions, context } = get();
        const pack = TASK_PACKS[context];
        const available = pack.filter(
          (p) => !todaysActions.find((a) => a.id === p.id)
        );
        if (available.length === 0) return;

        const random = available[Math.floor(Math.random() * available.length)];
        const updated = todaysActions.map((a) =>
          a.id === id ? { ...random, completed: false } : a
        );
        set({ todaysActions: updated });
      },

      startBodyDouble: (userTask: string) => {
        set({
          bodyDoubleActive: true,
          bodyDoubleTask: userTask,
          bodyDoubleStartTime: Date.now(),
        });
      },

      stopBodyDouble: () => {
        set({
          bodyDoubleActive: false,
          bodyDoubleTask: null,
          bodyDoubleStartTime: null,
        });
      },

      setVacationMode: (days: number) => {
        set({
          vacationMode: true,
          vacationDaysRemaining: days,
        });
      },

      cancelVacationMode: () => {
        set({
          vacationMode: false,
          vacationDaysRemaining: 0,
        });
      },

      setLastAffirmationDate: (date: string) => {
        set({ lastAffirmationDate: date });
      },

      addAction: (text: string, category: 'focus' | 'energy' | 'momentum' = 'momentum') => {
        const newAction: MicroAction = {
          id: Math.random().toString(36).substring(7),
          text,
          category,
          completed: false,
        };
        const { todaysActions } = get();
        set({ todaysActions: [...todaysActions, newAction] });
      },

      saveTask: (text: string, category: 'focus' | 'energy' | 'momentum') => {
        const { savedTasks } = get();
        set({ savedTasks: [...savedTasks, { text, category }] });
      },

      removeSavedTask: (text: string) => {
        const { savedTasks } = get();
        set({ savedTasks: savedTasks.filter((t) => t.text !== text) });
      },

      setEmergencyMode: (enabled: boolean) => {
        set({ emergencyMode: enabled });
      },

      setBrainDump: (text: string) => {
        set({ brainDump: text });
      },

      startQuest: (questId: string) => {
        set({ activeQuest: questId, questProgress: 0 });
      },

      advanceQuest: () => {
        const { questProgress } = get();
        set({ questProgress: questProgress + 1 });
      },

      quitQuest: () => {
        set({ activeQuest: null, questProgress: 0 });
      },

      setOnboardingChecklist: (key: string, value: boolean) => {
        const { onboardingChecklist } = get();
        set({
          onboardingChecklist: {
            ...onboardingChecklist,
            [key]: value,
          },
        });
      },

      dismissOnboardingChecklist: () => {
        set({ showOnboardingChecklist: false });
      },

      rateDifficulty: (taskId: string, difficulty: 'easy' | 'medium' | 'hard') => {
        const { taskDifficultyRatings } = get();
        set({
          taskDifficultyRatings: {
            ...taskDifficultyRatings,
            [taskId]: difficulty,
          },
        });
      },

      setMoodBefore: (mood: number) => {
        set({ currentMoodBefore: mood });
      },

      recordMoodAfter: (mood: number) => {
        const { moodHistory, currentMoodBefore } = get();
        if (currentMoodBefore === null) return;

        const entry: MoodEntry = {
          date: new Date().toISOString(),
          beforeMood: currentMoodBefore,
          afterMood: mood,
          taskCompleted: true,
          improvement: mood - currentMoodBefore,
        };

        set({
          moodHistory: [...moodHistory, entry],
          currentMoodBefore: null,
        });
      },

      setMoodCheckEnabled: (enabled: boolean) => {
        set({ moodCheckEnabled: enabled });
      },

      setEnergyLevel: (level: number) => {
        set({ currentEnergyLevel: level });
      },

      addParallelTask: (taskId: string) => {
        const { parallelTasks } = get();
        if (!parallelTasks.includes(taskId)) {
          set({ parallelTasks: [...parallelTasks, taskId] });
        }
      },

      removeParallelTask: (taskId: string) => {
        const { parallelTasks } = get();
        set({ parallelTasks: parallelTasks.filter((id) => id !== taskId) });
      },

      setExpandedTask: (taskId: string | null) => {
        set({ expandedTaskId: taskId });
      },

      addSubtasks: (parentTaskId: string, subtasks: SubTask[]) => {
        const { todaysActions } = get();
        const updated = todaysActions.map((action) =>
          action.id === parentTaskId ? { ...action, subtasks } : action
        );
        set({ todaysActions: updated });
      },

      toggleSubtask: (parentTaskId: string, subtaskId: string) => {
        const newActions = get().todaysActions.map(action => {
          if (action.id === parentTaskId && action.subtasks) {
            return {
              ...action,
              subtasks: action.subtasks.map(st =>
                st.id === subtaskId ? { ...st, completed: !st.completed } : st
              )
            };
          }
          return action;
        });
        set({ todaysActions: newActions });
      },

      getTasksByEnergyLevel: (energyLevel: number) => {
        const { todaysActions, taskDifficultyRatings } = get();
        const difficultyMap: Record<number, Array<'easy' | 'medium' | 'hard'>> = {
          1: ['easy'],
          2: ['easy', 'medium'],
          3: ['easy', 'medium', 'hard'],
          4: ['medium', 'hard'],
          5: ['hard']
        };
        const targetDifficulties = difficultyMap[Math.max(1, Math.min(5, energyLevel))] || ['easy'];
        return todaysActions.filter(action => {
          const difficulty = action.difficulty || taskDifficultyRatings[action.id] || 'medium';
          return targetDifficulties.includes(difficulty);
        });
      },

      getRandomTask: () => {
        const { todaysActions } = get();
        const incompleteTasks = todaysActions.filter(a => !a.completed);
        if (incompleteTasks.length === 0) return null;
        return incompleteTasks[Math.floor(Math.random() * incompleteTasks.length)];
      },

      startMicroTry: (taskId: string) => {
        set({ microTryMode: true, microTryTaskId: taskId });
      },

      endMicroTry: () => {
        set({ microTryMode: false, microTryTaskId: null });
      },

      continueMicroTry: () => {
        set({ microTryMode: false });
      },

      setMomentumMode: (enabled: boolean) => {
        set({ momentumMode: enabled });
      },

      setBodyDoubleModeEnabled: (enabled: boolean) => {
        set({ bodyDoubleModeEnabled: enabled });
      },

      addMicroWinJournalEntry: (taskId: string, entry: string) => {
        const newEntry = {
          id: Math.random().toString(36).substring(7),
          taskId,
          entry,
          timestamp: new Date().toISOString(),
        };
        set((state) => ({ microWinsJournal: [...state.microWinsJournal, newEntry] }));
      },

      generateReferralCode: () => {
        const code = Math.random().toString(36).substring(2, 10).toUpperCase();
        set({ referralCode: code });
        return code;
      },

      addReferredFriend: (friendId: string) => {
        set((state) => {
          if (!state.referredFriends.includes(friendId)) {
            return { referredFriends: [...state.referredFriends, friendId] };
          }
          return state;
        });
      }
      ,

      setEmotionalState: (state: 'anxious' | 'bored' | 'overwhelmed' | 'energized' | null) => set({ currentEmotionalState: state }),

      archiveTask: (taskId: string) => {
        set((state) => {
          const taskToArchive = state.todaysActions.find(a => a.id === taskId);
          if (taskToArchive) {
            return {
              todaysActions: state.todaysActions.filter(a => a.id !== taskId),
              archivedTasks: [...state.archivedTasks, taskToArchive]
            };
          }
          return state;
        });
      },

      restoreArchivedTask: (taskId: string) => {
        set((state) => {
          const taskToRestore = state.archivedTasks.find(a => a.id === taskId);
          if (taskToRestore) {
            return {
              archivedTasks: state.archivedTasks.filter(a => a.id !== taskId),
              todaysActions: [...state.todaysActions, { ...taskToRestore, completed: false }]
            };
          }
          return state;
        });
      },

      startHyperfocus: (taskId: string) => set({ hyperfocusMode: true, hyperfocusStartTime: Date.now(), hyperfocusTaskId: taskId }),

      stopHyperfocus: () => set({ hyperfocusMode: false, hyperfocusStartTime: null, hyperfocusTaskId: null }),

      setAccountabilityPartner: (partnerId: string | null) => set({ accountabilityPartner: partnerId }),

      setDailyCheckIn: (energy, vibe, need) => {
        const today = new Date().toISOString().split('T')[0];
        set({ 
          lastCheckInDate: today,
          todaysEnergyLevel: energy,
          todaysVibe: vibe,
          todaysNeed: need
        });
      },

      getDashieGreeting: () => {
        return "Hey! Ready to get some wins today?";
      },

      getDashieEncouragement: () => {
        return "You're doing great!";
      },

      toggleCompletionSound: () => {
        const { completionSoundEnabled } = get();
        set({ completionSoundEnabled: !completionSoundEnabled });
      },
      setDemoMode: (enabled: boolean) => {
        set({ 
          demoMode: enabled,
          demoStartTime: enabled ? Date.now() : null,
          demoTasksCompleted: 0,
          showDemoTutorial: enabled,
        });
      },
      incrementDemoTasksCompleted: () => {
        const { demoTasksCompleted } = get();
        set({ demoTasksCompleted: demoTasksCompleted + 1 });
      },
      setShowDemoTutorial: (show: boolean) => {
        set({ showDemoTutorial: show });
      }
    }),
    {
      name: 'dopamine-dasher-storage',
    }
  )
);
