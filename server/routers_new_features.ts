// This file contains the new routers for habits, mood, and analytics
// Add these to server/routers.ts in the appRouter object before the stripe router

export const habitRoutes = `
  habits: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return await db.getUserHabits(ctx.user.id);
    }),

    create: protectedProcedure
      .input(z.object({
        name: z.string(),
        description: z.string().optional(),
        frequency: z.enum(["daily", "weekly", "custom"]).default("daily"),
        targetCount: z.number().default(1),
      }))
      .mutation(async ({ ctx, input }) => {
        const result = await db.createHabit({
          userId: ctx.user.id,
          ...input,
        });
        return { success: true, habitId: result.lastInsertRowid };
      }),

    update: protectedProcedure
      .input(z.object({
        habitId: z.number(),
        name: z.string().optional(),
        description: z.string().optional(),
        frequency: z.enum(["daily", "weekly", "custom"]).optional(),
        targetCount: z.number().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { habitId, ...updates } = input;
        await db.updateHabit(habitId, ctx.user.id, updates);
        return { success: true };
      }),

    delete: protectedProcedure
      .input(z.object({
        habitId: z.number(),
      }))
      .mutation(async ({ ctx, input }) => {
        await db.deleteHabit(input.habitId, ctx.user.id);
        return { success: true };
      }),

    complete: protectedProcedure
      .input(z.object({
        habitId: z.number(),
      }))
      .mutation(async ({ ctx, input }) => {
        const result = await db.completeHabit(input.habitId, ctx.user.id);
        return result;
      }),

    getCompletions: protectedProcedure
      .input(z.object({
        habitId: z.number(),
        days: z.number().default(30),
      }))
      .query(async ({ ctx, input }) => {
        return await db.getHabitCompletions(input.habitId, ctx.user.id, input.days);
      }),
  }),

  mood: router({
    checkIn: protectedProcedure
      .input(z.object({
        moodLevel: z.number().min(1).max(5),
        energyLevel: z.enum(["low", "medium", "high"]),
        notes: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const today = new Date().toISOString().split('T')[0];
        await db.createMoodEntry({
          userId: ctx.user.id,
          date: today,
          ...input,
        });
        return { success: true };
      }),

    getToday: protectedProcedure.query(async ({ ctx }) => {
      return await db.getTodayMoodEntry(ctx.user.id);
    }),

    getHistory: protectedProcedure
      .input(z.object({
        days: z.number().default(30),
      }))
      .query(async ({ ctx, input }) => {
        return await db.getMoodHistory(ctx.user.id, input.days);
      }),
  }),

  analytics: router({
    getStats: protectedProcedure
      .input(z.object({
        date: z.string(),
      }))
      .query(async ({ ctx, input }) => {
        return await db.getUserStats(ctx.user.id, input.date);
      }),

    getHistory: protectedProcedure
      .input(z.object({
        days: z.number().default(30),
      }))
      .query(async ({ ctx, input }) => {
        return await db.getStatsHistory(ctx.user.id, input.days);
      }),

    updateStats: protectedProcedure
      .input(z.object({
        date: z.string(),
        tasksCompleted: z.number().optional(),
        habitsCompleted: z.number().optional(),
        currentStreak: z.number().optional(),
        moodAverage: z.number().optional(),
        energyAverage: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { date, ...updates } = input;
        await db.updateUserStats(ctx.user.id, date, updates);
        return { success: true };
      }),
  }),
`;
