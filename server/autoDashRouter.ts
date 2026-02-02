/**
 * Auto-Dash tRPC Router
 * Handles all Auto-Dash operations for Premium users
 */

import { router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import {
  generateAutoDashSuggestion,
  getActiveSuggestion,
  acceptSuggestion,
  rejectSuggestion,
  completeSuggestion,
  getAutoDashHistory,
  getAutoDashStats,
} from "./autoDash";
import { TRPCError } from "@trpc/server";

export const autoDashRouter = router({
  /**
   * Generate a new Auto-Dash suggestion
   */
  generateSuggestion: protectedProcedure
    .input(
      z.object({
        energyLevel: z.enum(["low", "medium", "high"]),
        moodLevel: z.number().min(1).max(5),
        timeAvailable: z.enum(["2min", "5min", "15min"]),
        context: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const suggestion = await generateAutoDashSuggestion(
          ctx.user.id,
          input.energyLevel,
          input.moodLevel,
          input.timeAvailable,
          input.context
        );

        return {
          success: true,
          suggestion,
        };
      } catch (error) {
        console.error("Error generating suggestion:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to generate suggestion",
        });
      }
    }),

  /**
   * Get the current active suggestion for the user
   */
  getActive: protectedProcedure.query(async ({ ctx }) => {
    try {
      const suggestion = await getActiveSuggestion(ctx.user.id);
      return suggestion;
    } catch (error) {
      console.error("Error fetching active suggestion:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch suggestion",
      });
    }
  }),

  /**
   * Accept a suggestion and create a task from it
   */
  accept: protectedProcedure
    .input(
      z.object({
        suggestionId: z.number(),
        category: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const result = await acceptSuggestion(
          ctx.user.id,
          input.suggestionId,
          input.category
        );

        return {
          success: true,
          taskId: result.taskId,
          title: result.title,
        };
      } catch (error) {
        console.error("Error accepting suggestion:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to accept suggestion",
        });
      }
    }),

  /**
   * Reject a suggestion
   */
  reject: protectedProcedure
    .input(z.object({ suggestionId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      try {
        await rejectSuggestion(ctx.user.id, input.suggestionId);
        return { success: true };
      } catch (error) {
        console.error("Error rejecting suggestion:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to reject suggestion",
        });
      }
    }),

  /**
   * Mark a suggestion as completed
   */
  complete: protectedProcedure
    .input(z.object({ suggestionId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      try {
        await completeSuggestion(ctx.user.id, input.suggestionId);
        return { success: true };
      } catch (error) {
        console.error("Error completing suggestion:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to complete suggestion",
        });
      }
    }),

  /**
   * Get Auto-Dash history for the user
   */
  getHistory: protectedProcedure
    .input(z.object({ limit: z.number().default(10) }))
    .query(async ({ ctx, input }) => {
      try {
        const history = await getAutoDashHistory(ctx.user.id, input.limit);
        return history;
      } catch (error) {
        console.error("Error fetching history:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch history",
        });
      }
    }),

  /**
   * Get Auto-Dash statistics for the user
   */
  getStats: protectedProcedure.query(async ({ ctx }) => {
    try {
      const stats = await getAutoDashStats(ctx.user.id);
      return stats;
    } catch (error) {
      console.error("Error fetching stats:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch statistics",
      });
    }
  }),
});
