import { z } from 'zod';
import { protectedProcedure, publicProcedure, router } from './_core/trpc';
import { submitFeedback, getAllFeedback, getFeedbackStats } from './db';

export const feedbackRouter = router({
  submit: publicProcedure
    .input(
      z.object({
        type: z.enum(['bug', 'feature', 'general']),
        message: z.string().min(1).max(1000),
      })
    )
    .mutation(async ({ input, ctx }: any) => {
      const userId = ctx.user?.id || null;

      return await submitFeedback({
        userId,
        type: input.type,
        message: input.message,
      });
    }),

  list: protectedProcedure.query(async ({ ctx }: any) => {
    if (ctx.user.role !== 'admin') {
      throw new Error('Unauthorized');
    }
    return await getAllFeedback();
  }),

  getStats: protectedProcedure.query(async ({ ctx }: any) => {
    if (ctx.user.role !== 'admin') {
      throw new Error('Unauthorized');
    }
    return await getFeedbackStats();
  }),
});
