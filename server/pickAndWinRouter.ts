import { protectedProcedure, router } from './_core/trpc';
import { z } from 'zod';
import * as db from './db';
import { nanoid } from 'nanoid';

const CHARACTER_DISCOUNTS = {
  focused: 25,
  energized: 20,
  creative: 15,
  chill: 0, // Free trial instead
};

const generateDiscountCode = (): string => {
  return `DD-${nanoid(8).toUpperCase()}`;
};

const getWeekStart = (date: Date = new Date()): string => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
  const weekStart = new Date(d.setDate(diff));
  return weekStart.toISOString().split('T')[0];
};

export const pickAndWinRouter = router({
  /**
   * Pick a character and generate a discount code
   */
  pickCharacter: protectedProcedure
    .input(
      z.object({
        character: z.enum(['focused', 'energized', 'creative', 'chill']),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      const { character } = input;

      // Generate discount code
      const discountCode = generateDiscountCode();
      const discountPercent = CHARACTER_DISCOUNTS[character];
      
      // Code expires in 30 days
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30);

      // Insert character pick
      await db.createCharacterPick({
        userId,
        character,
        discountPercent,
        discountCode,
        expiresAt,
      });

      return {
        discountCode,
        discountPercent,
        character,
        expiresAt: expiresAt.toISOString(),
      };
    }),

  /**
   * Check if user can pick weekly bonus
   */
  canPickWeekly: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.user.id;
    const weekStart = getWeekStart();

    // Check if user already picked this week
    const existingPick = await db.getWeeklyCharacterPick(userId, weekStart);

    return {
      canPick: !existingPick,
      lastPickDate: existingPick?.pickedAt || null,
    };
  }),

  /**
   * Pick weekly bonus character
   */
  pickWeeklyBonus: protectedProcedure
    .input(
      z.object({
        character: z.enum(['focused', 'energized', 'creative', 'chill']),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      const { character } = input;
      const weekStart = getWeekStart();

      // Check if already picked this week
      const existingPick = await db.getWeeklyCharacterPick(userId, weekStart);

      if (existingPick) {
        throw new Error('You already picked your weekly bonus this week!');
      }

      // Insert weekly pick and award coins
      const bonusCoins = 50;
      await db.createWeeklyCharacterPick({
        userId,
        character,
        bonusCoins,
        weekStartDate: weekStart,
      });

      // Update user coins
      const userProfile = await db.getUserProfile(userId);

      if (userProfile) {
        await db.updateUserProfile(userId, {
          coins: (userProfile.coins || 0) + bonusCoins,
        });
      }

      return {
        character,
        bonusCoins,
        totalCoins: (userProfile?.coins || 0) + bonusCoins,
      };
    }),

  /**
   * Get user's pick history
   */
  getPickHistory: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.user.id;
    const picks = await db.getCharacterPickHistory(userId);
    return picks;
  }),
});
