import { describe, it, expect, beforeEach } from 'vitest';
import { useStore } from './store';

describe('ADHD Tax Reduction Features', () => {
  beforeEach(() => {
    const store = useStore.getState();
    store.currentEnergyLevel = null;
    store.parallelTasks = [];
    store.expandedTaskId = null;
  });

  describe('Feature 1: Decision Fatigue Elimination', () => {
    describe('setEnergyLevel', () => {
      it('should set energy level between 1-5', () => {
        const store = useStore.getState();
        store.setEnergyLevel(3);
        expect(store.currentEnergyLevel).toBe(3);
      });

      it('should clamp energy level to 1-5 range', () => {
        const store = useStore.getState();
        store.setEnergyLevel(0);
        expect(store.currentEnergyLevel).toBe(1);
        
        store.setEnergyLevel(10);
        expect(store.currentEnergyLevel).toBe(5);
      });
    });

    describe('getTasksByEnergyLevel', () => {
      it('should return easy tasks for low energy (1-2)', () => {
        const store = useStore.getState();
        store.todaysActions = [
          { id: '1', text: 'Easy task', category: 'momentum', completed: false, difficulty: 'easy' },
          { id: '2', text: 'Hard task', category: 'focus', completed: false, difficulty: 'hard' },
        ];
        
        const tasks = store.getTasksByEnergyLevel(1);
        expect(tasks).toHaveLength(1);
        expect(tasks[0].id).toBe('1');
      });

      it('should return all tasks for medium energy (3)', () => {
        const store = useStore.getState();
        store.todaysActions = [
          { id: '1', text: 'Easy task', category: 'momentum', completed: false, difficulty: 'easy' },
          { id: '2', text: 'Medium task', category: 'focus', completed: false, difficulty: 'medium' },
          { id: '3', text: 'Hard task', category: 'focus', completed: false, difficulty: 'hard' },
        ];
        
        const tasks = store.getTasksByEnergyLevel(3);
        expect(tasks).toHaveLength(3);
      });

      it('should return hard tasks for high energy (5)', () => {
        const store = useStore.getState();
        store.todaysActions = [
          { id: '1', text: 'Easy task', category: 'momentum', completed: false, difficulty: 'easy' },
          { id: '2', text: 'Hard task', category: 'focus', completed: false, difficulty: 'hard' },
        ];
        
        const tasks = store.getTasksByEnergyLevel(5);
        expect(tasks).toHaveLength(1);
        expect(tasks[0].id).toBe('2');
      });
    });

    describe('getRandomTask', () => {
      it('should return a random incomplete task', () => {
        const store = useStore.getState();
        store.todaysActions = [
          { id: '1', text: 'Task 1', category: 'focus', completed: false },
          { id: '2', text: 'Task 2', category: 'focus', completed: false },
          { id: '3', text: 'Task 3', category: 'focus', completed: true },
        ];
        
        const task = store.getRandomTask();
        expect(task).toBeDefined();
        expect(task?.completed).toBe(false);
        expect(['1', '2']).toContain(task?.id);
      });

      it('should return null if no incomplete tasks', () => {
        const store = useStore.getState();
        store.todaysActions = [
          { id: '1', text: 'Task 1', category: 'focus', completed: true },
        ];
        
        const task = store.getRandomTask();
        expect(task).toBeNull();
      });
    });
  });

  describe('Feature 2: Execution Friction Reduction', () => {
    describe('addSubtasks and toggleSubtask', () => {
      it('should add subtasks to a task', () => {
        const store = useStore.getState();
        store.todaysActions = [
          { id: '1', text: 'Main task', category: 'focus', completed: false },
        ];
        
        store.addSubtasks('1', [
          { id: 's1', text: 'Step 1', completed: false },
          { id: 's2', text: 'Step 2', completed: false },
        ]);
        
        const task = store.todaysActions[0];
        expect(task.subtasks).toHaveLength(2);
        expect(task.subtasks?.[0].text).toBe('Step 1');
      });

      it('should toggle subtask completion', () => {
        const store = useStore.getState();
        store.todaysActions = [
          {
            id: '1',
            text: 'Main task',
            category: 'focus',
            completed: false,
            subtasks: [
              { id: 's1', text: 'Step 1', completed: false },
            ],
          },
        ];
        
        store.toggleSubtask('1', 's1');
        const subtask = store.todaysActions[0].subtasks?.[0];
        expect(subtask?.completed).toBe(true);
      });

      it('should track progress across subtasks', () => {
        const store = useStore.getState();
        store.todaysActions = [
          {
            id: '1',
            text: 'Main task',
            category: 'focus',
            completed: false,
            subtasks: [
              { id: 's1', text: 'Step 1', completed: true },
              { id: 's2', text: 'Step 2', completed: false },
              { id: 's3', text: 'Step 3', completed: false },
            ],
          },
        ];
        
        const task = store.todaysActions[0];
        const completedCount = task.subtasks?.filter(s => s.completed).length || 0;
        const progress = Math.round((completedCount / (task.subtasks?.length || 1)) * 100);
        
        expect(progress).toBe(33);
      });
    });

    describe('setExpandedTask', () => {
      it('should set expanded task ID', () => {
        const store = useStore.getState();
        store.setExpandedTask('task-123');
        expect(store.expandedTaskId).toBe('task-123');
      });

      it('should clear expanded task when set to null', () => {
        const store = useStore.getState();
        store.setExpandedTask('task-123');
        store.setExpandedTask(null);
        expect(store.expandedTaskId).toBeNull();
      });
    });
  });

  describe('Feature 3: Context Switching Validation', () => {
    describe('addParallelTask and removeParallelTask', () => {
      it('should add task to parallel tracking', () => {
        const store = useStore.getState();
        store.addParallelTask('task-1');
        expect(store.parallelTasks).toContain('task-1');
      });

      it('should not add duplicate tasks', () => {
        const store = useStore.getState();
        store.addParallelTask('task-1');
        store.addParallelTask('task-1');
        expect(store.parallelTasks).toHaveLength(1);
      });

      it('should remove task from parallel tracking', () => {
        const store = useStore.getState();
        store.addParallelTask('task-1');
        store.addParallelTask('task-2');
        store.removeParallelTask('task-1');
        
        expect(store.parallelTasks).toContain('task-2');
        expect(store.parallelTasks).not.toContain('task-1');
      });

      it('should track multiple parallel tasks', () => {
        const store = useStore.getState();
        store.addParallelTask('task-1');
        store.addParallelTask('task-2');
        store.addParallelTask('task-3');
        
        expect(store.parallelTasks).toHaveLength(3);
      });
    });

    describe('Context switching without penalty', () => {
      it('should allow switching between tasks without resetting streak', () => {
        const store = useStore.getState();
        store.todaysActions = [
          { id: '1', text: 'Task 1', category: 'focus', completed: false },
          { id: '2', text: 'Task 2', category: 'focus', completed: false },
        ];
        
        const initialStreak = store.streak;
        
        // Switch from task 1 to task 2
        store.addParallelTask('1');
        store.addParallelTask('2');
        
        // Streak should remain unchanged
        expect(store.streak).toBe(initialStreak);
        expect(store.parallelTasks).toHaveLength(2);
      });
    });
  });

  describe('Integration: All 3 features together', () => {
    it('should support full ADHD-friendly workflow', () => {
      const store = useStore.getState();
      
      // User checks energy level
      store.setEnergyLevel(2);
      expect(store.currentEnergyLevel).toBe(2);
      
      // Setup tasks with difficulty
      store.todaysActions = [
        { id: '1', text: 'Easy task', category: 'momentum', completed: false, difficulty: 'easy' },
        { id: '2', text: 'Hard task', category: 'focus', completed: false, difficulty: 'hard' },
      ];
      
      // Get tasks matching energy level
      const easyTasks = store.getTasksByEnergyLevel(2);
      expect(easyTasks).toHaveLength(1);
      
      // Start task 1, then switch to task 2
      store.addParallelTask('1');
      store.addParallelTask('2');
      expect(store.parallelTasks).toHaveLength(2);
      
      // Break down task 1 into subtasks
      store.addSubtasks('1', [
        { id: 's1', text: 'Start', completed: false },
        { id: 's2', text: 'Do', completed: false },
      ]);
      
      // Complete a subtask
      store.toggleSubtask('1', 's1');
      const completedSubtasks = store.todaysActions[0].subtasks?.filter(s => s.completed).length || 0;
      expect(completedSubtasks).toBe(1);
    });
  });
});
