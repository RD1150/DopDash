/**
 * AI Coach Router
 * Provides tRPC procedures for AI-powered behavioral therapy support
 */

import { router, protectedProcedure } from './_core/trpc';
import { z } from 'zod';
import { invokeLLM } from './_core/llm';
import { 
  getAllTechniques, 
  getTechniquesForState, 
  getRandomTechniqueForState,
  NervousSystemState 
} from './therapyKnowledgeBase';
import { buildCoachSystemPrompt, buildFollowUpContext, generateOpeningMessage } from './coachPrompts';

export const coachRouter = router({
  /**
   * Get a therapeutic technique recommendation based on user's nervous system state
   */
  getTechniqueForState: protectedProcedure
    .input(z.object({
      state: z.enum(['squirrel', 'tired', 'focused', 'hurting'] as const),
      category: z.enum(['grounding', 'motivation', 'breakdown', 'cognitive', 'emotion']).optional()
    }))
    .query((opts) => {
      const { input } = opts;
      const techniques = input.category 
        ? getAllTechniques().filter(t => t.state.includes(input.state as NervousSystemState) && t.category === input.category)
        : getTechniquesForState(input.state as NervousSystemState);
      
      if (techniques.length === 0) {
        return null;
      }
      
      // Return a random technique
      return techniques[Math.floor(Math.random() * techniques.length)];
    }),

  /**
   * Chat with AI coach for real-time support
   * Uses therapy knowledge base + user context to provide personalized guidance
   */
  chat: protectedProcedure
    .input(z.object({
      message: z.string(),
      nervousSystemState: z.enum(['squirrel', 'tired', 'focused', 'hurting'] as const),
      context: z.object({
        tasksCompleted: z.number().optional(),
        currentMood: z.number().optional(), // 1-5
        recentChallenge: z.string().optional(),
        streakDays: z.number().optional()
      }).optional()
    }))
    .mutation(async (opts) => {
      const { input, ctx } = opts;
      const techniques = getTechniquesForState(input.nervousSystemState as NervousSystemState);
      
      // Build context for LLM
      const techniqueContext = techniques
        .slice(0, 3) // Use top 3 techniques for this state
        .map(t => `- ${t.name}: ${t.description} (${t.duration} min)`)
        .join('\n');
      
      const systemPrompt = buildCoachSystemPrompt({
        nervousSystemState: input.nervousSystemState as NervousSystemState,
        tasksCompleted: input.context?.tasksCompleted,
        currentMood: input.context?.currentMood,
        recentChallenge: input.context?.recentChallenge,
        streakDays: input.context?.streakDays
      });

      try {
        const messages = [
          { role: 'system' as const, content: systemPrompt },
          { role: 'user' as const, content: input.message }
        ];

        const response = await invokeLLM({
          messages: messages as any
        });

        const coachMessage = response.choices[0]?.message?.content || 'I\'m here to help. What\'s going on?';

        // Store conversation for personalization and history
        try {
          const { storeCoachConversation } = await import('./db');
          await storeCoachConversation(
            ctx.user.id,
            input.nervousSystemState as NervousSystemState,
            input.message,
            typeof coachMessage === 'string' ? coachMessage : 'I\'m here to help.',
            undefined,
            undefined
          );
        } catch (error) {
          console.warn('Could not store conversation:', error);
        }

        return {
          message: coachMessage,
          timestamp: new Date(),
          suggestedTechnique: getRandomTechniqueForState(input.nervousSystemState as NervousSystemState)
        };
      } catch (error) {
        console.error('Coach chat error:', error);
        return {
          message: 'I\'m having trouble connecting right now. Try again in a moment, or pick a technique from the menu.',
          timestamp: new Date(),
          suggestedTechnique: getRandomTechniqueForState(input.nervousSystemState as NervousSystemState)
        };
      }
    }),

  /**
   * Get all available techniques
   */
  getAllTechniques: protectedProcedure.query(() => {
    return getAllTechniques();
  }),

  /**
   * Get techniques for a specific nervous system state
   */
  getTechniquesForState: protectedProcedure
    .input(z.enum(['squirrel', 'tired', 'focused', 'hurting'] as const))
    .query((opts) => {
      const { input } = opts;
      return getTechniquesForState(input as NervousSystemState);
    }),

  /**
   * Record that user completed a technique
   * Useful for tracking what works best for each user
   */
  recordTechniqueCompletion: protectedProcedure
    .input(z.object({
      techniqueId: z.string(),
      helpfulRating: z.number().min(1).max(5),
      notes: z.string().optional()
    }))
    .mutation(async (opts) => {
      const { input, ctx } = opts;
      // TODO: Store in database for personalization
      console.log(`User ${ctx.user.id} completed technique ${input.techniqueId} with rating ${input.helpfulRating}`);
      
      return {
        success: true,
        message: 'Thanks for the feedback! This helps us personalize your coaching.'
      };
    })
});
