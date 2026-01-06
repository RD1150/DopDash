import { describe, it, expect, beforeEach } from 'vitest';
import { useStore } from './store';

describe('Mood Tracking Feature', () => {
  beforeEach(() => {
    // Reset store state before each test
    const store = useStore.getState();
    store.moodHistory = [];
    store.currentMoodBefore = null;
    store.moodCheckEnabled = true;
  });

  describe('setMoodBefore', () => {
    it('should set the mood before task completion', () => {
      const store = useStore.getState();
      store.setMoodBefore(3);
      
      expect(store.currentMoodBefore).toBe(3);
    });

    it('should clamp mood values between 1 and 5', () => {
      const store = useStore.getState();
      
      store.setMoodBefore(0);
      expect(store.currentMoodBefore).toBe(1);
      
      store.setMoodBefore(6);
      expect(store.currentMoodBefore).toBe(5);
    });

    it('should handle decimal values by clamping', () => {
      const store = useStore.getState();
      store.setMoodBefore(3.7);
      
      expect(store.currentMoodBefore).toBe(3);
    });
  });

  describe('recordMoodAfter', () => {
    it('should record mood after task completion and calculate improvement', () => {
      const store = useStore.getState();
      store.setMoodBefore(2);
      store.recordMoodAfter(4);
      
      expect(store.moodHistory).toHaveLength(1);
      const entry = store.moodHistory[0];
      expect(entry.beforeMood).toBe(2);
      expect(entry.afterMood).toBe(4);
      expect(entry.improvement).toBe(2);
    });

    it('should handle negative mood changes', () => {
      const store = useStore.getState();
      store.setMoodBefore(4);
      store.recordMoodAfter(2);
      
      const entry = store.moodHistory[0];
      expect(entry.improvement).toBe(-2);
    });

    it('should handle zero mood change', () => {
      const store = useStore.getState();
      store.setMoodBefore(3);
      store.recordMoodAfter(3);
      
      const entry = store.moodHistory[0];
      expect(entry.improvement).toBe(0);
    });

    it('should not record if no mood was set before', () => {
      const store = useStore.getState();
      store.recordMoodAfter(4);
      
      expect(store.moodHistory).toHaveLength(0);
    });

    it('should reset currentMoodBefore after recording', () => {
      const store = useStore.getState();
      store.setMoodBefore(2);
      store.recordMoodAfter(4);
      
      expect(store.currentMoodBefore).toBeNull();
    });

    it('should set correct date in mood entry', () => {
      const store = useStore.getState();
      store.setMoodBefore(2);
      store.recordMoodAfter(4);
      
      const today = new Date().toISOString().split('T')[0];
      const entry = store.moodHistory[0];
      expect(entry.date).toBe(today);
    });

    it('should accumulate multiple mood entries', () => {
      const store = useStore.getState();
      
      store.setMoodBefore(2);
      store.recordMoodAfter(4);
      
      store.setMoodBefore(3);
      store.recordMoodAfter(5);
      
      expect(store.moodHistory).toHaveLength(2);
      expect(store.moodHistory[0].improvement).toBe(2);
      expect(store.moodHistory[1].improvement).toBe(2);
    });
  });

  describe('setMoodCheckEnabled', () => {
    it('should enable mood check', () => {
      const store = useStore.getState();
      store.setMoodCheckEnabled(true);
      
      expect(store.moodCheckEnabled).toBe(true);
    });

    it('should disable mood check', () => {
      const store = useStore.getState();
      store.setMoodCheckEnabled(false);
      
      expect(store.moodCheckEnabled).toBe(false);
    });
  });

  describe('Mood history persistence', () => {
    it('should persist mood history across multiple sessions', () => {
      const store = useStore.getState();
      
      store.setMoodBefore(2);
      store.recordMoodAfter(4);
      
      const initialHistory = [...store.moodHistory];
      
      // Simulate getting state again
      const newStore = useStore.getState();
      expect(newStore.moodHistory).toEqual(initialHistory);
    });
  });

  describe('Mood improvement calculation', () => {
    it('should calculate average mood improvement correctly', () => {
      const store = useStore.getState();
      
      // Entry 1: 2 -> 4 (improvement: +2)
      store.setMoodBefore(2);
      store.recordMoodAfter(4);
      
      // Entry 2: 3 -> 5 (improvement: +2)
      store.setMoodBefore(3);
      store.recordMoodAfter(5);
      
      // Entry 3: 4 -> 3 (improvement: -1)
      store.setMoodBefore(4);
      store.recordMoodAfter(3);
      
      const avgImprovement = store.moodHistory.reduce((sum, entry) => sum + entry.improvement, 0) / store.moodHistory.length;
      expect(avgImprovement).toBe(1); // (2 + 2 + (-1)) / 3 = 1
    });
  });
});
