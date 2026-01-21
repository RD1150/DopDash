import { protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { sequenceTasks, calculateTotalDuration, validateSequence, getEncouragementMessage } from "./sequencing";
import type { UserState, TimeAvailable, Task } from "./sequencing";

export const decisionTreeRouter = router({
  recordState: protectedProcedure
    .input(z.object({
      state: z.enum(["squirrel", "tired", "focused", "hurting"]),
      description: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      await db.recordNervousSystemState(ctx.user.id, input.state, input.description);
      return { success: true };
    }),

  getLatestState: protectedProcedure
    .query(async ({ ctx }) => {
      return await db.getLatestNervousSystemState(ctx.user.id);
    }),

  sequenceTasks: protectedProcedure
    .input(z.object({
      timeAvailable: z.enum(["15min", "30min", "1hour", "2plus"]),
      userState: z.enum(["squirrel", "tired", "focused", "hurting"]),
      taskIds: z.array(z.number()).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      let userTasks = await db.getUserTasks(ctx.user.id, false);
      
      if (input.taskIds && input.taskIds.length > 0) {
        userTasks = userTasks.filter(t => input.taskIds!.includes(t.id));
      }

      const tasksForSequencing: Task[] = userTasks.map(t => ({
        id: t.id,
        title: t.title,
        durationMinutes: t.durationMinutes || 5,
        activationEnergy: (t.activationEnergy as any) || "easy",
        recommendedState: t.recommendedState || undefined,
        sequenceGroup: t.sequenceGroup || undefined,
        sequenceOrder: t.sequenceOrder || undefined,
      }));

      const sequenced = sequenceTasks(
        input.userState as UserState,
        input.timeAvailable as TimeAvailable,
        tasksForSequencing
      );

      const validation = validateSequence(sequenced, input.timeAvailable as TimeAvailable);

      await db.createDecisionTreeSession({
        userId: ctx.user.id,
        timeAvailable: input.timeAvailable,
        userState: input.userState,
        brainDumpTasks: userTasks.map(t => t.title),
        sequencedTasks: sequenced.map(s => ({
          taskId: s.taskId,
          order: s.order,
          estimatedDuration: s.estimatedDuration,
        })),
      });

      return {
        sequenced,
        totalDuration: validation.totalDuration,
        timeRemaining: validation.timeRemaining,
        isValid: validation.isValid,
        warnings: validation.warnings,
      };
    }),

  getEncouragement: protectedProcedure
    .input(z.object({
      state: z.enum(["squirrel", "tired", "focused", "hurting"]),
      taskPosition: z.number().min(1),
      totalTasks: z.number().min(1),
    }))
    .query(({ input }) => {
      return getEncouragementMessage(
        input.state as UserState,
        input.taskPosition,
        input.totalTasks
      );
    }),
});
