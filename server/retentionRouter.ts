import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import * as db from "./db";
import { z } from "zod";

export const retentionRouter = router({
  // Record a user session (called on app load)
  recordSession: protectedProcedure
    .mutation(async ({ ctx }) => {
      try {
        await db.recordUserSession(ctx.user.id);
        return { success: true };
      } catch (error) {
        console.error("Failed to record session:", error);
        return { success: false };
      }
    }),

  // Get user retention metrics
  getMetrics: protectedProcedure
    .query(async ({ ctx }) => {
      try {
        const metrics = await db.getUserRetentionMetrics(ctx.user.id);
        return metrics;
      } catch (error) {
        console.error("Failed to get retention metrics:", error);
        return null;
      }
    }),

  // Get retention cohort (admin only)
  getCohort: protectedProcedure
    .input(z.object({
      days: z.number().min(1).max(90),
    }))
    .query(async ({ ctx, input }) => {
      // Only allow admin to view cohort data
      if (ctx.user.role !== 'admin') {
        throw new Error('Unauthorized');
      }

      try {
        const cohort = await db.getRetentionCohort(input.days);
        
        // Calculate retention rates
        const totalUsers = cohort.length;
        const activeUsers = cohort.filter(u => u.isActive).length;
        const retentionRate = totalUsers > 0 ? (activeUsers / totalUsers) * 100 : 0;

        return {
          totalUsers,
          activeUsers,
          retentionRate: Math.round(retentionRate * 100) / 100,
          cohort: cohort.map(u => ({
            userId: u.userId,
            email: u.email,
            createdAt: u.createdAt,
            lastActiveDate: u.lastActiveDate,
            isActive: u.isActive,
            daysSinceSignup: Math.floor(
              (new Date().getTime() - new Date(u.createdAt).getTime()) / (1000 * 60 * 60 * 24)
            ),
          })),
        };
      } catch (error) {
        console.error("Failed to get cohort:", error);
        return null;
      }
    }),

  // Get D1/D7/D30 retention rates (admin only)
  getRetentionRates: protectedProcedure
    .query(async ({ ctx }) => {
      if (ctx.user.role !== 'admin') {
        throw new Error('Unauthorized');
      }

      try {
        const d1Cohort = await db.getRetentionCohort(1);
        const d7Cohort = await db.getRetentionCohort(7);
        const d30Cohort = await db.getRetentionCohort(30);

        const calculateRate = (cohort: any[]) => {
          const total = cohort.length;
          const active = cohort.filter(u => u.isActive).length;
          return total > 0 ? Math.round((active / total) * 10000) / 100 : 0;
        };

        return {
          d1Retention: calculateRate(d1Cohort),
          d7Retention: calculateRate(d7Cohort),
          d30Retention: calculateRate(d30Cohort),
          d1Users: d1Cohort.length,
          d7Users: d7Cohort.length,
          d30Users: d30Cohort.length,
        };
      } catch (error) {
        console.error("Failed to get retention rates:", error);
        return null;
      }
    }),

  // Get funnel analytics (admin only)
  getFunnelAnalytics: protectedProcedure
    .query(async ({ ctx }) => {
      if (ctx.user.role !== 'admin') {
        throw new Error('Unauthorized');
      }

      try {
        // This would need additional tracking in the app
        // For now, return a placeholder structure
        return {
          signups: 0,
          completedOnboarding: 0,
          completedFirstTask: 0,
          usedBrainCheck: 0,
          completedSecondDay: 0,
          funnelStages: [
            { stage: 'Signup', count: 0, dropoff: 0 },
            { stage: 'Onboarding', count: 0, dropoff: 0 },
            { stage: 'First Task', count: 0, dropoff: 0 },
            { stage: 'Brain Check', count: 0, dropoff: 0 },
            { stage: 'Day 2 Return', count: 0, dropoff: 0 },
          ],
        };
      } catch (error) {
        console.error("Failed to get funnel analytics:", error);
        return null;
      }
    }),
});
