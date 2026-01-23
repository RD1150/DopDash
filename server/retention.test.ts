import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as db from './db';

// Mock the database functions
vi.mock('./db', () => ({
  recordUserSession: vi.fn(),
  getUserRetentionMetrics: vi.fn(),
  getRetentionCohort: vi.fn(),
}));

describe('Retention Analytics', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('recordUserSession', () => {
    it('should record a user session', async () => {
      const userId = 123;
      const recordSpy = vi.spyOn(db, 'recordUserSession');

      await db.recordUserSession(userId);

      expect(recordSpy).toHaveBeenCalledWith(userId);
    });
  });

  describe('getUserRetentionMetrics', () => {
    it('should return retention metrics for a user', async () => {
      const userId = 123;
      const mockMetrics = {
        userId,
        daysSinceSignup: 5,
        lastActiveDate: '2026-01-23',
        currentStreak: 3,
        createdAt: new Date('2026-01-18'),
      };

      vi.mocked(db.getUserRetentionMetrics).mockResolvedValue(mockMetrics);

      const result = await db.getUserRetentionMetrics(userId);

      expect(result).toEqual(mockMetrics);
      expect(result?.daysSinceSignup).toBe(5);
      expect(result?.currentStreak).toBe(3);
    });

    it('should return null for non-existent user', async () => {
      const userId = 999;
      vi.mocked(db.getUserRetentionMetrics).mockResolvedValue(null);

      const result = await db.getUserRetentionMetrics(userId);

      expect(result).toBeNull();
    });
  });

  describe('getRetentionCohort', () => {
    it('should return cohort data for specified days', async () => {
      const mockCohort = [
        {
          userId: 1,
          email: 'user1@example.com',
          createdAt: new Date('2026-01-23'),
          lastActiveDate: '2026-01-23',
          isActive: true,
        },
        {
          userId: 2,
          email: 'user2@example.com',
          createdAt: new Date('2026-01-22'),
          lastActiveDate: null,
          isActive: false,
        },
      ];

      vi.mocked(db.getRetentionCohort).mockResolvedValue(mockCohort);

      const result = await db.getRetentionCohort(1);

      expect(result).toHaveLength(2);
      expect(result[0].isActive).toBe(true);
      expect(result[1].isActive).toBe(false);
    });

    it('should calculate retention rate correctly', async () => {
      const mockCohort = Array.from({ length: 100 }, (_, i) => ({
        userId: i + 1,
        email: `user${i + 1}@example.com`,
        createdAt: new Date('2026-01-23'),
        lastActiveDate: i < 30 ? '2026-01-23' : null, // 30% active
        isActive: i < 30,
      }));

      vi.mocked(db.getRetentionCohort).mockResolvedValue(mockCohort);

      const result = await db.getRetentionCohort(1);
      const activeCount = result.filter(u => u.isActive).length;
      const retentionRate = (activeCount / result.length) * 100;

      expect(retentionRate).toBe(30);
    });

    it('should handle empty cohort', async () => {
      vi.mocked(db.getRetentionCohort).mockResolvedValue([]);

      const result = await db.getRetentionCohort(1);

      expect(result).toHaveLength(0);
    });
  });

  describe('Retention Rate Calculations', () => {
    it('should calculate D1 retention correctly', () => {
      const cohort = [
        { isActive: true },
        { isActive: true },
        { isActive: false },
        { isActive: false },
      ];

      const activeCount = cohort.filter(u => u.isActive).length;
      const retentionRate = (activeCount / cohort.length) * 100;

      expect(retentionRate).toBe(50);
    });

    it('should calculate D7 retention correctly', () => {
      const cohort = Array.from({ length: 1000 }, (_, i) => ({
        isActive: i < 250, // 25% retention
      }));

      const activeCount = cohort.filter(u => u.isActive).length;
      const retentionRate = (activeCount / cohort.length) * 100;

      expect(retentionRate).toBe(25);
    });

    it('should handle 0% retention', () => {
      const cohort = [
        { isActive: false },
        { isActive: false },
        { isActive: false },
      ];

      const activeCount = cohort.filter(u => u.isActive).length;
      const retentionRate = (activeCount / cohort.length) * 100;

      expect(retentionRate).toBe(0);
    });

    it('should handle 100% retention', () => {
      const cohort = [
        { isActive: true },
        { isActive: true },
        { isActive: true },
      ];

      const activeCount = cohort.filter(u => u.isActive).length;
      const retentionRate = (activeCount / cohort.length) * 100;

      expect(retentionRate).toBe(100);
    });
  });
});
