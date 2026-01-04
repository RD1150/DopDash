import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Flavor = 'calm' | 'playful' | 'matter-of-fact' | 'celebratory';
export type Theme = 'default' | 'ocean' | 'sunset' | 'lavender';

export type MicroAction = {
  id: string;
  text: string;
  category: 'focus' | 'energy' | 'momentum';
  completed: boolean;
};

interface AppState {
  hasStarted: boolean;
  flavor: Flavor;
  theme: Theme;
  todaysActions: MicroAction[];
  streak: number;
  lastCompletedDate: string | null;
  history: string[]; // Array of ISO date strings (YYYY-MM-DD)
  
  // Actions
  startApp: () => void;
  setFlavor: (flavor: Flavor) => void;
  setTheme: (theme: Theme) => void;
  toggleAction: (id: string) => void;
  resetDay: () => void;
  checkStreak: () => void;
}

const ACTION_LIBRARY: Omit<MicroAction, 'completed'>[] = [
  // Focus
  { id: 'f1', text: 'Open the thing you’ve been avoiding', category: 'focus' },
  { id: 'f2', text: 'Read one paragraph', category: 'focus' },
  { id: 'f3', text: 'Write one sentence', category: 'focus' },
  // Energy
  { id: 'e1', text: 'Drink a glass of water', category: 'energy' },
  { id: 'e2', text: 'Stand up and stretch', category: 'energy' },
  { id: 'e3', text: 'Take three slow breaths', category: 'energy' },
  // Momentum
  { id: 'm1', text: 'Send one message', category: 'momentum' },
  { id: 'm2', text: 'Clear one small surface', category: 'momentum' },
  { id: 'm3', text: 'Rename one file', category: 'momentum' },
];

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      hasStarted: false,
      flavor: 'calm',
      theme: 'default',
      todaysActions: [],
      streak: 0,
      lastCompletedDate: null,
      history: [],

      startApp: () => set({ hasStarted: true }),

      setFlavor: (flavor: Flavor) => set({ flavor }),
      setTheme: (theme: Theme) => set({ theme }),

      toggleAction: (id: string) => {
        const { todaysActions, lastCompletedDate, streak } = get();
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

        set({ 
          todaysActions: newActions,
          streak: newStreak,
          lastCompletedDate: newLastCompletedDate,
          history: newHistory
        });
      },

      resetDay: () => {
        // Pick 3 random actions, one from each category if possible, or just random
        const shuffled = [...ACTION_LIBRARY].sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 3).map(a => ({ ...a, completed: false }));
        set({ todaysActions: selected });
      },

      checkStreak: () => {
        const { lastCompletedDate, streak } = get();
        if (!lastCompletedDate) return;

        const last = new Date(lastCompletedDate);
        const today = new Date();
        const diffTime = Math.abs(today.getTime() - last.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

        // If more than 2 days passed (yesterday is fine), reset streak? 
        // Spec says: "Missing days do NOT scold or reset aggressively"
        // So maybe we just keep it or handle it very gently. 
        // For now, let's just leave it as is to be supportive.
      }
    }),
    {
      name: 'dopamine-dasher-storage',
    }
  )
);
