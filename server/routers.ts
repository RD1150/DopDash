import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import Stripe from "stripe";
import { PRODUCTS } from "../shared/products.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-12-15.clover',
});

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // User Profile procedures
  profile: router({
    get: protectedProcedure.query(async ({ ctx }) => {
      let profile = await db.getUserProfile(ctx.user.id);
      
      // Create profile if it doesn't exist
      if (!profile) {
        await db.createUserProfile({
          userId: ctx.user.id,
          xp: 0,
          level: 1,
          coins: 0,
          currentStreak: 0,
          longestStreak: 0,
          vacationModeActive: 0,
          hasCompletedOnboarding: 0,
          soundEnabled: 1,
        });
        profile = await db.getUserProfile(ctx.user.id);
      }
      
      return profile;
    }),

    update: protectedProcedure
      .input(z.object({
        xp: z.number().optional(),
        level: z.number().optional(),
        coins: z.number().optional(),
        currentStreak: z.number().optional(),
        longestStreak: z.number().optional(),
        lastActiveDate: z.string().optional(),
        vacationModeActive: z.number().optional(),
        vacationModeStartDate: z.string().optional(),
        hasCompletedOnboarding: z.number().optional(),
        selectedFlavor: z.string().optional(),
        selectedContext: z.string().optional(),
        selectedTheme: z.string().optional(),
        mascotMood: z.string().optional(),
        lastPetTime: z.date().optional(),
        lastFeedTime: z.date().optional(),
        purchasedItems: z.array(z.string()).optional(),
        equippedAccessories: z.array(z.string()).optional(),
        soundEnabled: z.number().optional(),
        soundTheme: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        await db.updateUserProfile(ctx.user.id, input);
        return { success: true };
      }),
  }),

  // Task procedures
  tasks: router({
    list: protectedProcedure
      .input(z.object({
        completed: z.boolean().optional(),
      }).optional())
      .query(async ({ ctx, input }) => {
        return await db.getUserTasks(ctx.user.id, input?.completed);
      }),

    create: protectedProcedure
      .input(z.object({
        title: z.string(),
        type: z.enum(["quick", "boss"]),
        category: z.string().optional(),
        subtasks: z.array(z.object({
          id: z.string(),
          text: z.string(),
          completed: z.boolean(),
        })).optional(),
        xpReward: z.number().default(10),
        coinReward: z.number().default(5),
      }))
      .mutation(async ({ ctx, input }) => {
        await db.createTask({
          userId: ctx.user.id,
          ...input,
          completed: 0,
        });
        return { success: true };
      }),

    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().optional(),
        subtasks: z.array(z.object({
          id: z.string(),
          text: z.string(),
          completed: z.boolean(),
        })).optional(),
        completed: z.number().optional(),
        completedAt: z.date().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { id, ...updates } = input;
        await db.updateTask(id, ctx.user.id, updates);
        return { success: true };
      }),

    delete: protectedProcedure
      .input(z.object({
        id: z.number(),
      }))
      .mutation(async ({ ctx, input }) => {
        await db.deleteTask(input.id, ctx.user.id);
        return { success: true };
      }),
  }),

  // Journal procedures
  journal: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return await db.getUserJournalEntries(ctx.user.id);
    }),

    create: protectedProcedure
      .input(z.object({
        taskTitle: z.string(),
        taskType: z.string(),
        xpEarned: z.number(),
        coinEarned: z.number(),
        completedAt: z.date(),
        date: z.string(),
      }))
      .mutation(async ({ ctx, input }) => {
        await db.createJournalEntry({
          userId: ctx.user.id,
          ...input,
        });
        return { success: true };
      }),
  }),

  // Daily Affirmation procedures
  affirmation: router({
    getToday: protectedProcedure
      .input(z.object({
        date: z.string(),
      }))
      .query(async ({ ctx, input }) => {
        return await db.getTodayAffirmation(ctx.user.id, input.date);
      }),

    create: protectedProcedure
      .input(z.object({
        message: z.string(),
        shownDate: z.string(),
      }))
      .mutation(async ({ ctx, input }) => {
        await db.createDailyAffirmation({
          userId: ctx.user.id,
          ...input,
        });
        return { success: true };
      }),
  }),

  // Habit procedures
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
        return { success: true };
      }),

    complete: protectedProcedure
      .input(z.object({
        habitId: z.number(),
      }))
      .mutation(async ({ ctx, input }) => {
        return await db.completeHabit(input.habitId, ctx.user.id);
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

  // Mood procedures
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

  // Analytics procedures
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
  }),

  // Stripe payment procedures
  stripe: router({
    createCheckoutSession: protectedProcedure
      .mutation(async ({ ctx }) => {
        const origin = ctx.req.headers.origin || `http://localhost:${process.env.PORT || 3000}`;
        
        try {
          const session = await stripe.checkout.sessions.create({
            mode: 'payment',
            payment_method_types: ['card'],
            line_items: [
              {
                price_data: {
                  currency: PRODUCTS.PREMIUM_LIFETIME.currency,
                  product_data: {
                    name: PRODUCTS.PREMIUM_LIFETIME.name,
                    description: PRODUCTS.PREMIUM_LIFETIME.description,
                  },
                  unit_amount: Math.round(PRODUCTS.PREMIUM_LIFETIME.price * 100), // Convert to cents
                },
                quantity: 1,
              },
            ],
            success_url: `${origin}/settings?upgrade=success`,
            cancel_url: `${origin}/settings?upgrade=cancelled`,
            customer_email: ctx.user.email || undefined,
            client_reference_id: ctx.user.id.toString(),
            metadata: {
              user_id: ctx.user.id.toString(),
              customer_email: ctx.user.email || '',
              customer_name: ctx.user.name || '',
            },
            allow_promotion_codes: true,
          });

          return {
            url: session.url,
            sessionId: session.id,
          };
        } catch (error: any) {
          console.error('[Stripe] Error creating checkout session:', error);
          throw new Error(`Failed to create checkout session: ${error.message}`);
        }
      }),

    checkPremiumStatus: protectedProcedure
      .query(async ({ ctx }) => {
        return {
          isPremium: ctx.user.isPremium === 1,
          stripeCustomerId: ctx.user.stripeCustomerId,
        };
      }),
  }),
});

export type AppRouter = typeof appRouter;
