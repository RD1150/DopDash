import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as db from './db';
import { decisionTreeRouter } from './decisionTreeRouter';

// Mock the db module
vi.mock('./db', () => ({
  getUserTasks: vi.fn(),
  recordNervousSystemState: vi.fn(),
  getLatestNervousSystemState: vi.fn(),
  createDecisionTreeSession: vi.fn(),
}));

describe('decisionTree.getTasksForBrainCheck', () => {
  const mockUserId = 1;
  const mockCtx = { user: { id: mockUserId } };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return all incomplete tasks when no time filter is provided', async () => {
    const mockTasks = [
      { id: 1, title: 'Task 1', durationMinutes: 5, activationEnergy: 'easy', category: 'work' },
      { id: 2, title: 'Task 2', durationMinutes: 10, activationEnergy: 'medium', category: 'home' },
      { id: 3, title: 'Task 3', durationMinutes: 20, activationEnergy: 'deep', category: 'work' },
    ];

    vi.mocked(db.getUserTasks).mockResolvedValue(mockTasks as any);

    const caller = decisionTreeRouter.createCaller(mockCtx as any);
    const result = await caller.getTasksForBrainCheck({});

    expect(result).toHaveLength(3);
    expect(result[0]).toEqual({
      id: 1,
      title: 'Task 1',
      durationMinutes: 5,
      activationEnergy: 'easy',
      category: 'work',
    });
  });

  it('should filter tasks by 5 minute time limit', async () => {
    const mockTasks = [
      { id: 1, title: 'Quick task', durationMinutes: 3, activationEnergy: 'micro', category: 'home' },
      { id: 2, title: 'Medium task', durationMinutes: 5, activationEnergy: 'easy', category: 'work' },
      { id: 3, title: 'Long task', durationMinutes: 15, activationEnergy: 'medium', category: 'work' },
    ];

    vi.mocked(db.getUserTasks).mockResolvedValue(mockTasks as any);

    const caller = decisionTreeRouter.createCaller(mockCtx as any);
    const result = await caller.getTasksForBrainCheck({ timeAvailable: '5min' });

    expect(result).toHaveLength(2);
    expect(result.map(t => t.id)).toEqual([1, 2]);
  });

  it('should filter tasks by 15 minute time limit', async () => {
    const mockTasks = [
      { id: 1, title: 'Task 1', durationMinutes: 5, activationEnergy: 'easy', category: 'home' },
      { id: 2, title: 'Task 2', durationMinutes: 10, activationEnergy: 'medium', category: 'work' },
      { id: 3, title: 'Task 3', durationMinutes: 20, activationEnergy: 'deep', category: 'work' },
    ];

    vi.mocked(db.getUserTasks).mockResolvedValue(mockTasks as any);

    const caller = decisionTreeRouter.createCaller(mockCtx as any);
    const result = await caller.getTasksForBrainCheck({ timeAvailable: '15min' });

    expect(result).toHaveLength(2);
    expect(result.map(t => t.id)).toEqual([1, 2]);
  });

  it('should filter tasks by 30 minute time limit', async () => {
    const mockTasks = [
      { id: 1, title: 'Task 1', durationMinutes: 10, activationEnergy: 'easy', category: 'home' },
      { id: 2, title: 'Task 2', durationMinutes: 25, activationEnergy: 'medium', category: 'work' },
      { id: 3, title: 'Task 3', durationMinutes: 45, activationEnergy: 'deep', category: 'work' },
    ];

    vi.mocked(db.getUserTasks).mockResolvedValue(mockTasks as any);

    const caller = decisionTreeRouter.createCaller(mockCtx as any);
    const result = await caller.getTasksForBrainCheck({ timeAvailable: '30min' });

    expect(result).toHaveLength(2);
    expect(result.map(t => t.id)).toEqual([1, 2]);
  });

  it('should filter tasks by 1 hour time limit', async () => {
    const mockTasks = [
      { id: 1, title: 'Task 1', durationMinutes: 30, activationEnergy: 'easy', category: 'home' },
      { id: 2, title: 'Task 2', durationMinutes: 50, activationEnergy: 'medium', category: 'work' },
      { id: 3, title: 'Task 3', durationMinutes: 90, activationEnergy: 'deep', category: 'work' },
    ];

    vi.mocked(db.getUserTasks).mockResolvedValue(mockTasks as any);

    const caller = decisionTreeRouter.createCaller(mockCtx as any);
    const result = await caller.getTasksForBrainCheck({ timeAvailable: '1hour' });

    expect(result).toHaveLength(2);
    expect(result.map(t => t.id)).toEqual([1, 2]);
  });

  it('should return all tasks for 2+ hours time limit', async () => {
    const mockTasks = [
      { id: 1, title: 'Task 1', durationMinutes: 30, activationEnergy: 'easy', category: 'home' },
      { id: 2, title: 'Task 2', durationMinutes: 90, activationEnergy: 'medium', category: 'work' },
      { id: 3, title: 'Task 3', durationMinutes: 120, activationEnergy: 'deep', category: 'work' },
    ];

    vi.mocked(db.getUserTasks).mockResolvedValue(mockTasks as any);

    const caller = decisionTreeRouter.createCaller(mockCtx as any);
    const result = await caller.getTasksForBrainCheck({ timeAvailable: '2plus' });

    expect(result).toHaveLength(3);
  });

  it('should use default duration of 5 minutes for tasks without durationMinutes', async () => {
    const mockTasks = [
      { id: 1, title: 'Task without duration', durationMinutes: null, activationEnergy: 'easy', category: 'home' },
      { id: 2, title: 'Task 2', durationMinutes: 10, activationEnergy: 'medium', category: 'work' },
    ];

    vi.mocked(db.getUserTasks).mockResolvedValue(mockTasks as any);

    const caller = decisionTreeRouter.createCaller(mockCtx as any);
    const result = await caller.getTasksForBrainCheck({ timeAvailable: '5min' });

    expect(result).toHaveLength(1);
    expect(result[0].durationMinutes).toBe(5);
  });

  it('should use default activation energy of easy for tasks without activationEnergy', async () => {
    const mockTasks = [
      { id: 1, title: 'Task without energy', durationMinutes: 5, activationEnergy: null, category: 'home' },
    ];

    vi.mocked(db.getUserTasks).mockResolvedValue(mockTasks as any);

    const caller = decisionTreeRouter.createCaller(mockCtx as any);
    const result = await caller.getTasksForBrainCheck({});

    expect(result[0].activationEnergy).toBe('easy');
  });

  it('should return empty array when no tasks match the time filter', async () => {
    const mockTasks = [
      { id: 1, title: 'Long task', durationMinutes: 30, activationEnergy: 'deep', category: 'work' },
    ];

    vi.mocked(db.getUserTasks).mockResolvedValue(mockTasks as any);

    const caller = decisionTreeRouter.createCaller(mockCtx as any);
    const result = await caller.getTasksForBrainCheck({ timeAvailable: '5min' });

    expect(result).toHaveLength(0);
  });

  it('should return empty array when user has no tasks', async () => {
    vi.mocked(db.getUserTasks).mockResolvedValue([]);

    const caller = decisionTreeRouter.createCaller(mockCtx as any);
    const result = await caller.getTasksForBrainCheck({});

    expect(result).toHaveLength(0);
  });
});
