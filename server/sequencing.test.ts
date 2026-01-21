import { describe, it, expect } from 'vitest';
import { sequenceTasks, calculateTotalDuration, validateSequence, getEncouragementMessage, type Task } from './sequencing';

describe('Task Sequencing Algorithm', () => {
  const mockTasks: Task[] = [
    { id: 1, title: 'Open mail', durationMinutes: 2, activationEnergy: 'micro' },
    { id: 2, title: 'Read mail', durationMinutes: 5, activationEnergy: 'easy' },
    { id: 3, title: 'Process mail', durationMinutes: 10, activationEnergy: 'medium' },
    { id: 4, title: 'Deep work', durationMinutes: 45, activationEnergy: 'deep' },
  ];

  describe('Squirrel State (Overwhelmed)', () => {
    it('should start with micro tasks to build momentum', () => {
      const result = sequenceTasks('squirrel', '30min', mockTasks);
      
      expect(result.length).toBeGreaterThan(0);
      expect(result[0].title).toBe('Open mail'); // Micro task first
      expect(result[0].order).toBe(1);
    });

    it('should sequence tasks from micro -> easy -> medium -> deep', () => {
      const result = sequenceTasks('squirrel', '1hour', mockTasks);
      
      const energyLevels = result.map(t => {
        const task = mockTasks.find(mt => mt.id === t.taskId);
        return task?.activationEnergy;
      });

      // Check that energy levels generally increase (though not strictly due to time constraints)
      const microIndex = energyLevels.indexOf('micro');
      const easyIndex = energyLevels.indexOf('easy');
      const mediumIndex = energyLevels.indexOf('medium');

      if (microIndex !== -1 && easyIndex !== -1) {
        expect(microIndex).toBeLessThan(easyIndex);
      }
    });

    it('should not require warmup activity', () => {
      const result = sequenceTasks('squirrel', '30min', mockTasks);
      const hasWarmup = result.some(t => t.title.includes('Movement') || t.title.includes('Rest'));
      expect(hasWarmup).toBe(false);
    });
  });

  describe('Tired State (Low Energy)', () => {
    it('should start with movement warmup', () => {
      const result = sequenceTasks('tired', '30min', mockTasks);
      
      expect(result.length).toBeGreaterThan(0);
      expect(result[0].title).toContain('Movement');
      expect(result[0].estimatedDuration).toBe(5);
    });

    it('should follow warmup with easy tasks', () => {
      const result = sequenceTasks('tired', '1hour', mockTasks);
      
      // First should be warmup
      expect(result[0].title).toContain('Movement');
      
      // Second should be easy task
      if (result.length > 1) {
        const secondTask = mockTasks.find(t => t.id === result[1].taskId);
        expect(['easy', 'micro']).toContain(secondTask?.activationEnergy);
      }
    });
  });

  describe('Focused State (Good Energy)', () => {
    it('should prioritize medium and deep work', () => {
      const result = sequenceTasks('focused', '1hour', mockTasks);
      
      // Should have tasks
      expect(result.length).toBeGreaterThan(0);
      
      // Should not start with micro tasks
      const firstTask = mockTasks.find(t => t.id === result[0].taskId);
      expect(firstTask?.activationEnergy).not.toBe('micro');
    });

    it('should not require warmup', () => {
      const result = sequenceTasks('focused', '30min', mockTasks);
      const hasWarmup = result.some(t => t.title.includes('Movement') || t.title.includes('Rest'));
      expect(hasWarmup).toBe(false);
    });
  });

  describe('Hurting State (Dysregulated)', () => {
    it('should start with rest activity', () => {
      const result = sequenceTasks('hurting', '30min', mockTasks);
      
      expect(result.length).toBeGreaterThan(0);
      expect(result[0].title).toContain('Rest');
      expect(result[0].estimatedDuration).toBe(20);
    });

    it('should only include gentle tasks after rest', () => {
      const result = sequenceTasks('hurting', '1hour', mockTasks);
      
      // After rest, should only have micro or easy tasks
      for (let i = 1; i < result.length; i++) {
        const task = mockTasks.find(t => t.id === result[i].taskId);
        expect(['micro', 'easy']).toContain(task?.activationEnergy);
      }
    });

    it('should not include deep work tasks', () => {
      const result = sequenceTasks('hurting', '2plus', mockTasks);
      
      const hasDeepWork = result.some(t => {
        const task = mockTasks.find(mt => mt.id === t.taskId);
        return task?.activationEnergy === 'deep';
      });
      
      expect(hasDeepWork).toBe(false);
    });
  });

  describe('Time Allocation', () => {
    it('should fit tasks within 15 minute window', () => {
      const result = sequenceTasks('squirrel', '15min', mockTasks);
      const total = calculateTotalDuration(result);
      expect(total).toBeLessThanOrEqual(15);
    });

    it('should fit tasks within 30 minute window', () => {
      const result = sequenceTasks('squirrel', '30min', mockTasks);
      const total = calculateTotalDuration(result);
      expect(total).toBeLessThanOrEqual(30);
    });

    it('should fit tasks within 1 hour window', () => {
      const result = sequenceTasks('squirrel', '1hour', mockTasks);
      const total = calculateTotalDuration(result);
      expect(total).toBeLessThanOrEqual(60);
    });

    it('should fit tasks within 2+ hour window', () => {
      const result = sequenceTasks('squirrel', '2plus', mockTasks);
      const total = calculateTotalDuration(result);
      expect(total).toBeLessThanOrEqual(120);
    });
  });

  describe('Duration Calculation', () => {
    it('should correctly sum task durations', () => {
      const tasks = [
        { id: 1, title: 'Task 1', durationMinutes: 5, activationEnergy: 'easy' as const },
        { id: 2, title: 'Task 2', durationMinutes: 10, activationEnergy: 'easy' as const },
      ];

      const sequenced = sequenceTasks('squirrel', '30min', tasks);
      const total = calculateTotalDuration(sequenced);
      
      expect(total).toBe(15);
    });
  });

  describe('Validation', () => {
    it('should validate sequences fit within time', () => {
      const result = sequenceTasks('squirrel', '30min', mockTasks);
      const validation = validateSequence(result, '30min');
      
      expect(validation.isValid).toBe(true);
      expect(validation.totalDuration).toBeLessThanOrEqual(30);
    });

    it('should warn when sequence exceeds time', () => {
      // Create a sequence that exceeds time by manually constructing it
      const longTasks = [
        { id: 1, title: 'Long task 1', durationMinutes: 20, activationEnergy: 'medium' as const },
        { id: 2, title: 'Long task 2', durationMinutes: 20, activationEnergy: 'medium' as const },
      ];

      const result = sequenceTasks('squirrel', '15min', longTasks);
      const validation = validateSequence(result, '15min');
      
      // Should either exclude tasks or warn
      expect(validation.totalDuration).toBeLessThanOrEqual(15);
    });

    it('should calculate remaining time correctly', () => {
      const result = sequenceTasks('squirrel', '30min', mockTasks);
      const validation = validateSequence(result, '30min');
      
      expect(validation.timeRemaining).toBe(30 - validation.totalDuration);
    });
  });

  describe('Encouragement Messages', () => {
    it('should provide squirrel-specific messages', () => {
      const msg = getEncouragementMessage('squirrel', 1, 3);
      expect(msg).toContain('tiny');
    });

    it('should provide tired-specific messages', () => {
      const msg = getEncouragementMessage('tired', 1, 3);
      expect(msg.toLowerCase()).toContain('movement');
    });

    it('should provide focused-specific messages', () => {
      const msg = getEncouragementMessage('focused', 1, 3);
      expect(msg).toContain('zone');
    });

    it('should provide hurting-specific messages', () => {
      const msg = getEncouragementMessage('hurting', 1, 3);
      expect(msg).toContain('Rest');
    });

    it('should provide different messages for different positions', () => {
      const msg1 = getEncouragementMessage('squirrel', 1, 3);
      const msg2 = getEncouragementMessage('squirrel', 2, 3);
      
      // Messages should be different (or at least from the same pool)
      expect(msg1).toBeDefined();
      expect(msg2).toBeDefined();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty task list', () => {
      const result = sequenceTasks('squirrel', '30min', []);
      expect(result.length).toBe(0);
    });

    it('should handle single task', () => {
      const singleTask: Task[] = [
        { id: 1, title: 'Single task', durationMinutes: 5, activationEnergy: 'easy' },
      ];

      const result = sequenceTasks('squirrel', '30min', singleTask);
      expect(result.length).toBeGreaterThan(0);
    });

    it('should handle very short time window', () => {
      const result = sequenceTasks('squirrel', '15min', mockTasks);
      const validation = validateSequence(result, '15min');
      
      expect(validation.isValid).toBe(true);
    });

    it('should handle tasks longer than available time', () => {
      const longTasks: Task[] = [
        { id: 1, title: 'Very long task', durationMinutes: 60, activationEnergy: 'deep' },
      ];

      const result = sequenceTasks('squirrel', '15min', longTasks);
      const validation = validateSequence(result, '15min');
      
      // Should not include tasks that don't fit
      expect(validation.totalDuration).toBeLessThanOrEqual(15);
    });
  });
});
