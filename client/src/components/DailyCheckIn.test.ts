import { describe, it, expect } from 'vitest';
import { useStore } from '@/lib/store';

describe('Daily Check-in System', () => {
  it('should set daily check-in with energy, vibe, and need', () => {
    const store = useStore.getState();
    store.setDailyCheckIn('high', 'energized', 'quick-wins');
    
    expect(store.todaysEnergyLevel).toBe('high');
    expect(store.todaysVibe).toBe('energized');
    expect(store.todaysNeed).toBe('quick-wins');
  });

  it('should generate Dashie greeting based on vibe', () => {
    const store = useStore.getState();
    store.setDailyCheckIn('medium', 'anxious', 'rest');
    
    const greeting = store.getDashieGreeting();
    expect(greeting).toBeTruthy();
    expect(greeting.length > 0).toBe(true);
  });

  it('should generate Dashie encouragement', () => {
    const store = useStore.getState();
    const encouragement = store.getDashieEncouragement();
    
    expect(encouragement).toBeTruthy();
    expect(encouragement.length > 0).toBe(true);
  });

  it('should handle different energy levels', () => {
    const store = useStore.getState();
    
    const energyLevels = ['low', 'medium', 'high'] as const;
    energyLevels.forEach(level => {
      store.setDailyCheckIn(level, 'energized', 'quick-wins');
      expect(store.todaysEnergyLevel).toBe(level);
    });
  });

  it('should handle different vibes', () => {
    const store = useStore.getState();
    
    const vibes = ['anxious', 'bored', 'overwhelmed', 'energized'] as const;
    vibes.forEach(vibe => {
      store.setDailyCheckIn('high', vibe, 'quick-wins');
      expect(store.todaysVibe).toBe(vibe);
    });
  });

  it('should handle different needs', () => {
    const store = useStore.getState();
    
    const needs = ['quick-wins', 'deep-focus', 'movement', 'rest'] as const;
    needs.forEach(need => {
      store.setDailyCheckIn('high', 'energized', need);
      expect(store.todaysNeed).toBe(need);
    });
  });
});
