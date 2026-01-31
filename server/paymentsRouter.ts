import { protectedProcedure, router } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import Stripe from "stripe";
import { COIN_PACKAGES } from "../shared/coinPackages";
import * as db from "./db";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-12-15.clover',
});

export const paymentsRouter = router({
  /**
   * Create a Stripe Checkout session for coin purchases
   * Supports Apple Pay, PayPal, and Card payments
   */
  createCheckoutSession: protectedProcedure
    .input(z.object({
      packageId: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const origin = ctx.req.headers.origin || `http://localhost:${process.env.PORT || 3000}`;
      const coinPackage = COIN_PACKAGES.find(pkg => pkg.id === input.packageId);

      if (!coinPackage) {
        throw new Error('Invalid coin package');
      }

      try {
        const session = await stripe.checkout.sessions.create({
          mode: 'payment',
          // Support multiple payment methods: Apple Pay, PayPal, Card
          payment_method_types: ['card', 'apple_pay', 'paypal'],
          line_items: [
            {
              price_data: {
                currency: 'usd',
                product_data: {
                  name: `${coinPackage.label} - ${coinPackage.coins} Coins`,
                  description: coinPackage.description,
                },
                unit_amount: coinPackage.price, // Already in cents
              },
              quantity: 1,
            },
          ],
          success_url: `${origin}/buy-coins?success=true&packageId=${coinPackage.id}`,
          cancel_url: `${origin}/buy-coins?cancelled=true`,
          customer_email: ctx.user.email || undefined,
          client_reference_id: ctx.user.id.toString(),
          metadata: {
            user_id: ctx.user.id.toString(),
            package_id: coinPackage.id,
            coins: coinPackage.coins.toString(),
            bonus_coins: (coinPackage.bonus || 0).toString(),
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

  /**
   * Verify payment and add coins to user account
   * Called after successful Stripe payment
   */
  verifyPayment: protectedProcedure
    .input(z.object({
      sessionId: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      try {
        const session = await stripe.checkout.sessions.retrieve(input.sessionId);

        if (session.payment_status !== 'paid') {
          throw new Error('Payment not completed');
        }

        const metadata = session.metadata;
        if (!metadata || metadata.user_id !== ctx.user.id.toString()) {
          throw new Error('Invalid payment session');
        }

        const coins = parseInt(metadata.coins || '0');
        const bonusCoins = parseInt(metadata.bonus_coins || '0');
        const totalCoins = coins + bonusCoins;

        // Add coins to user account
        const updatedProfile = await db.addCoinsToUser(ctx.user.id, totalCoins);

        return {
          success: true,
          coinsAdded: totalCoins,
          newBalance: updatedProfile.coins,
        };
      } catch (error: any) {
        console.error('[Stripe] Error verifying payment:', error);
        throw new Error(`Failed to verify payment: ${error.message}`);
      }
    }),

  /**
   * Get user's coin balance
   */
  getCoinBalance: protectedProcedure
    .query(async ({ ctx }) => {
      const profile = await db.getUserProfile(ctx.user.id);
      return {
        coins: profile?.coins || 0,
      };
    }),

  /**
   * Get user's payment history
   */
  getPaymentHistory: protectedProcedure
    .input(z.object({ limit: z.number().default(20) }))
    .query(async ({ ctx, input }) => {
      return await db.getUserPaymentHistory(ctx.user.id, input.limit);
    }),

  /**
   * Generate referral code for user
   */
  generateReferralCode: protectedProcedure
    .mutation(async ({ ctx }) => {
      // Generate unique referral code
      const code = `REF${ctx.user.id}${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      
      await db.createReferralCode(ctx.user.id, code);
      
      return { referralCode: code };
    }),

  /**
   * Get user's referral statistics
   */
  getReferralStats: protectedProcedure
    .query(async ({ ctx }) => {
      return await db.getUserReferralStats(ctx.user.id);
    }),

  /**
   * Claim referral bonus when new user signs up with code
   */
  claimReferralBonus: protectedProcedure
    .input(z.object({ referralCode: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const referral = await db.getReferralByCode(input.referralCode);
      
      if (!referral) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Invalid referral code",
        });
      }

      if (referral.claimedAt) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "This referral code has already been claimed",
        });
      }

      // Award bonus coins to both users
      await db.awardReferralBonus(referral.referrerId, ctx.user.id);

      return { success: true, bonusCoins: 25 };
    }),
});
