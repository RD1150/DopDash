import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CustomAccessory } from '@/components/DesignStudio';

export type Flavor = 'calm' | 'playful' | 'matter-of-fact' | 'celebratory';
export type Theme = 'default' | 'ocean' | 'sunset' | 'lavender' | 'cottagecore' | 'cyberpunk';
export type Context = 'nest' | 'grind' | 'self' | 'family';

export type MicroAction = {
  id: string;
  text: string;
  category: 'focus' | 'energy' | 'momentum';
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
  history: string[]; // Array of ISO date strings (YYYY-MM-DD)
  hasSeenTutorial: boolean;
  badges: Badge[];
  notificationsEnabled: boolean;
  coins: number;
  inventory: string[]; // IDs of owned items
  customAccessories: CustomAccessory[];
  equippedCustomAccessory: string | null; // ID of equipped custom accessory
  equippedItems: {
    hat?: string;
    glasses?: string;
    accessory?: string;
  };
  
  bodyDoubleActive: boolean;
  bodyDoubleTask: string | null;
  bodyDoubleStartTime: number | null;
  xp: number;
  level: number;
  vacationMode: boolean;
  vacationDaysRemaining: number;
  lastAffirmationDate: string | null;
  savedTasks: Omit<MicroAction, 'completed' | 'id'>[];
  emergencyMode: boolean;
  brainDump: string;

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
}

const BADGES_LIBRARY: Badge[] = [
  { id: 'first_step', name: 'First Step', description: 'Completed your first dash', icon: '🌱', unlocked: false },
  { id: 'streak_3', name: 'Momentum', description: 'Reached a 3-day streak', icon: '🔥', unlocked: false },
  { id: 'streak_7', name: 'Unstoppable', description: 'Reached a 7-day streak', icon: '🚀', unlocked: false },
  { id: 'early_bird', name: 'Early Bird', description: 'Completed a dash before noon', icon: '☀️', unlocked: false },
  { id: 'night_owl', name: 'Night Owl', description: 'Completed a dash after 8 PM', icon: '🌙', unlocked: false },
  { id: 'weekend_warrior', name: 'Weekend Warrior', description: 'Completed a dash on a weekend', icon: '🎉', unlocked: false },
];

const TASK_PACKS: Record<Context, Omit<MicroAction, 'completed'>[]> = {
  nest: [
    { id: 'n1', text: 'Put away one dish', category: 'momentum' },
    { id: 'n2', text: 'Pick up one item from the floor', category: 'momentum' },
    { id: 'n3', text: 'Wipe one surface', category: 'momentum' },
    { id: 'n4', text: 'Open a window', category: 'energy' },
    { id: 'n5', text: 'Water one plant', category: 'energy' },
    { id: 'n6', text: 'Sort one piece of mail', category: 'focus' },
  ],
  grind: [
    { id: 'g1', text: 'Open the document', category: 'focus' },
    { id: 'g2', text: 'Write one sentence', category: 'focus' },
    { id: 'g3', text: 'Read one email', category: 'focus' },
    { id: 'g4', text: 'Close one tab', category: 'momentum' },
    { id: 'g5', text: 'Rename one file', category: 'momentum' },
    { id: 'g6', text: 'Stand up and stretch', category: 'energy' },
  ],
  self: [
    { id: 's1', text: 'Drink a glass of water', category: 'energy' },
    { id: 's2', text: 'Take three deep breaths', category: 'energy' },
    { id: 's3', text: 'Step outside for a moment', category: 'energy' },
    { id: 's4', text: 'Put on comfortable clothes', category: 'momentum' },
    { id: 's5', text: 'Wash your face', category: 'momentum' },
    { id: 's6', text: 'Listen to one song', category: 'focus' },
  ],
  family: [
    { id: 'f1', text: 'Hug someone', category: 'momentum' },
    { id: 'f2', text: 'Put away one toy', category: 'momentum' },
    { id: 'f3', text: 'Send one text to family', category: 'momentum' },
    { id: 'f4', text: 'Listen for 2 minutes', category: 'focus' },
    { id: 'f5', text: 'Plan one meal', category: 'focus' },
    { id: 'f6', text: 'Take a deep breath before reacting', category: 'energy' },
  ]
};

const DEFAULT_ACTIONS = TASK_PACKS.self;

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      hasStarted: false,
      flavor: 'calm',
      theme: 'default',
      context: 'self',
      zenMode: false,
      soundTheme: 'default',
      todaysActions: [],
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

      startApp: () => set({ hasStarted: true }),
      completeTutorial: () => set({ hasSeenTutorial: true }),

      setFlavor: (flavor: Flavor) => set({ flavor }),
      setTheme: (theme: Theme) => set({ theme }),
      setContext: (context: Context) => {
        // When context changes, refresh actions immediately
        const pack = TASK_PACKS[context];
        const shuffled = [...pack].sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 3).map(a => ({ ...a, completed: false }));
        set({ context, todaysActions: selected });
      },
      setZenMode: (zenMode: boolean) => set({ zenMode }),
      setSoundTheme: (soundTheme: 'default' | 'arcade' | 'nature') => set({ soundTheme }),

      toggleAction: (id: string) => {
        const { todaysActions, lastCompletedDate, streak, coins } = get();
        const action = todaysActions.find((a) => a.id === id);
        const isCompleting = action && !action.completed;

        const newActions = todaysActions.map((a: MicroAction) =>
          a.id === id ? { ...a, completed: !a.completed } : a
        );
        
        const allCompleted = newActions.every((a: MicroAction) => a.completed);
        const today = new Date().toDateString();
        
        let newStreak = streak;
        let newLastCompletedDate = lastCompletedDate;

        let newHistory = get().history || [];

        if (allCompleted && lastCompletedDate !== today) {
          newStreak += 1;
          newLastCompletedDate = today;
          // Add today to history if not already there
          const todayISO = new Date().toISOString().split('T')[0];
          if (!newHistory.includes(todayISO)) {
            newHistory = [...newHistory, todayISO];
          }
        }

          // XP Logic: 10 XP per task
          const currentXp = get().xp;
          const currentLevel = get().level;
          const newXp = isCompleting ? currentXp + 10 : currentXp;
          
          // Level up every 100 XP
          const newLevel = Math.floor(newXp / 100) + 1;

          set({ 
            todaysActions: newActions,
            streak: newStreak,
            lastCompletedDate: newLastCompletedDate,
            history: newHistory,
            coins: isCompleting ? coins + 1 : coins,
            xp: newXp,
            level: newLevel
          });
        
        // Check badges after state update
        get().checkBadges();
      },

      resetDay: () => {
        const { context } = get();
        const pack = TASK_PACKS[context] || TASK_PACKS.self;
        const shuffled = [...pack].sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 3).map(a => ({ ...a, completed: false }));
        set({ todaysActions: selected });
      },

      updateActionText: (id, text) => {
        set((state) => ({
          todaysActions: state.todaysActions.map((a) =>
            a.id === id ? { ...a, text } : a
          ),
        }));
      },

      setNotificationsEnabled: (enabled: boolean) => set({ notificationsEnabled: enabled }),

      addCoins: (amount: number) => set((state) => ({ coins: state.coins + amount })),

      purchaseItem: (itemId: string, cost: number) => {
        const { coins, inventory } = get();
        if (coins >= cost && !inventory.includes(itemId)) {
          set({
            coins: coins - cost,
            inventory: [...inventory, itemId]
          });
          return true;
        }
        return false;
      },

      equipItem: (slot, itemId) => {
        set((state) => ({
          equippedItems: {
            ...state.equippedItems,
            [slot]: itemId
          }
        }));
      },

      setCustomAccessory: (accessory) => {
        set((state) => ({
          customAccessories: [...state.customAccessories, accessory],
          equippedCustomAccessory: accessory.id // Auto-equip new creation
        }));
      },

      equipCustomAccessory: (id) => {
        set({ equippedCustomAccessory: id });
      },

      swapAction: (id) => {
        const { todaysActions, context } = get();
        const pack = TASK_PACKS[context] || TASK_PACKS.self;
        
        // Find a new random action that isn't currently in the list
        const currentIds = todaysActions.map(a => a.id);
        const available = pack.filter(a => !currentIds.includes(a.id));
        
        if (available.length === 0) return; // No more unique actions
        
        const randomNew = available[Math.floor(Math.random() * available.length)];
        
        set({
          todaysActions: todaysActions.map(a => 
            a.id === id ? { ...randomNew, completed: false } : a
          )
        });
      },

      startBodyDouble: (userTask) => {
        const mascotTasks = [
          "Polishing my shell",
          "Organizing pixels",
          "Sharpening sword",
          "Sorting inventory",
          "Practicing jumps",
          "Updating map"
        ];
        const randomMascotTask = mascotTasks[Math.floor(Math.random() * mascotTasks.length)];
        
        set({
          bodyDoubleActive: true,
          bodyDoubleTask: randomMascotTask,
          bodyDoubleStartTime: Date.now()
        });
      },

      stopBodyDouble: () => {
        set({
          bodyDoubleActive: false,
          bodyDoubleTask: null,
          bodyDoubleStartTime: null
        });
      },

      checkBadges: () => {
        const { badges, history, streak, todaysActions } = get();
        const now = new Date();
        const hour = now.getHours();
        const day = now.getDay(); // 0 = Sunday, 6 = Saturday
        const allCompleted = todaysActions.every(a => a.completed) && todaysActions.length > 0;
        
        let newBadges = [...badges];
        let badgeEarned = false;

        const unlock = (id: string) => {
          const badgeIndex = newBadges.findIndex(b => b.id === id);
          if (badgeIndex !== -1 && !newBadges[badgeIndex].unlocked) {
            newBadges[badgeIndex] = { ...newBadges[badgeIndex], unlocked: true, unlockedDate: new Date().toISOString() };
            badgeEarned = true;
          }
        };

        if (history.length >= 1) unlock('first_step');
        if (streak >= 3) unlock('streak_3');
        if (streak >= 7) unlock('streak_7');
        
        if (allCompleted) {
          if (hour < 12) unlock('early_bird');
          if (hour >= 20) unlock('night_owl');
          if (day === 0 || day === 6) unlock('weekend_warrior');
        }

        if (badgeEarned) {
          set({ badges: newBadges });
          // Could trigger a toast or sound here if we had access to those functions, 
          // but store is pure logic. Components can listen to changes.
        }
      },

      checkStreak: () => {
        const { lastCompletedDate, streak, vacationMode, vacationDaysRemaining } = get();
        if (!lastCompletedDate) return;

        const last = new Date(lastCompletedDate);
        const today = new Date();
        const diffTime = Math.abs(today.getTime() - last.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

        // If vacation mode is active, decrement days and don't reset streak
        if (vacationMode && vacationDaysRemaining > 0) {
          // Check if a day has actually passed since last check/decrement
          // For simplicity in this prototype, we'll just trust the user toggled it on
          // In a real app, we'd track "lastVacationCheck"
          return;
        }

        // If vacation mode expired
        if (vacationMode && vacationDaysRemaining <= 0) {
          set({ vacationMode: false });
        }

        // If more than 2 days passed (yesterday is fine), reset streak? 
        // Spec says: "Missing days do NOT scold or reset aggressively"
        // So maybe we just keep it or handle it very gently. 
        // For now, let's just leave it as is to be supportive.
      },

      setVacationMode: (days: number) => set({ vacationMode: true, vacationDaysRemaining: days }),
      cancelVacationMode: () => set({ vacationMode: false, vacationDaysRemaining: 0 }),
      setLastAffirmationDate: (date: string) => set({ lastAffirmationDate: date }),
      addAction: (text: string, category = 'focus') => {
        const { todaysActions } = get();
        const newAction: MicroAction = {
          id: `custom-${Date.now()}`,
          text,
          category,
          completed: false
        };
        set({ todaysActions: [...todaysActions, newAction] });
      },
      saveTask: (text, category) => {
        const { savedTasks } = get();
        if (!savedTasks.some(t => t.text === text)) {
          set({ savedTasks: [...savedTasks, { text, category }] });
        }
      },
      removeSavedTask: (text) => {
        const { savedTasks } = get();
        set({ savedTasks: savedTasks.filter(t => t.text !== text) });
      },
      setEmergencyMode: (enabled) => {
        if (enabled) {
          // Clear everything and set one tiny task
          set({ 
            emergencyMode: true,
            todaysActions: [{ id: 'emergency-1', text: 'Just breathe', category: 'energy', completed: false }]
          });
        } else {
          // Restore normal flow (reset day to current context)
          const { context } = get();
          const pack = TASK_PACKS[context] || TASK_PACKS.self;
          const shuffled = [...pack].sort(() => 0.5 - Math.random());
          const selected = shuffled.slice(0, 3).map(a => ({ ...a, completed: false }));
          set({ emergencyMode: false, todaysActions: selected });
        }
      },
      setBrainDump: (text) => set({ brainDump: text })
    }),
    {
      name: 'dopamine-dasher-storage',
    }
  )
);
