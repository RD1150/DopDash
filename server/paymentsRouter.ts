import { protectedProcedure, router } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import Stripe from "stripe";
import { SUBSCRIPTION_TIERS, getSubscriptionTier } from "../shared/coinPackages";
import * as db from "./db";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-12-15.clover',
});

export const paymentsRouter = router({
  /**
   * Create a Stripe Checkout session for subscription
   * Supports monthly and annual billing periods
   * Payment methods: Apple Pay, PayPal, Card
   */
  createCheckoutSession: protectedProcedure
    .input(z.object({
      tierId: z.string(),
      billingPeriod: z.enum(['monthly', 'annual']),
    }))
    .mutation(async ({ ctx, input }) => {
      const origin = ctx.req.headers.origin || `http://localhost:${process.env.PORT || 3000}`;
      const tier = getSubscriptionTier(input.tierId);

      if (!tier) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Invalid subscription tier',
        });
      }

      try {
        const price = input.billingPeriod === 'monthly' ? tier.monthlyPrice : tier.annualPrice;
        const interval = input.billingPeriod === 'monthly' ? 'month' : 'year';

        const session = await stripe.checkout.sessions.create({
          mode: 'subscription',
          payment_method_types: ['card', 'apple_pay', 'paypal'],
          line_items: [
            {
              price_data: {
                currency: 'usd',
                product_data: {
                  name: `${tier.name} Subscription`,
                  description: `${tier.monthlyCoins} coins/month + ${tier.dailyBonus} daily bonus`,
                },
                unit_amount: price,
                recurring: {
                  interval: interval,
                  interval_count: 1,
                },
              },
              quantity: 1,
            },
          ],
          success_url: `${origin}/buy-coins?success=true&tierId=${tier.id}`,
          cancel_url: `${origin}/buy-coins?cancelled=true`,
          customer_email: ctx.user.email || undefined,
          client_reference_id: ctx.user.id.toString(),
          metadata: {
            user_id: ctx.user.id.toString(),
            tier_id: tier.id,
            billing_period: input.billingPeriod,
            monthly_coins: tier.monthlyCoins.toString(),
            daily_bonus: tier.dailyBonus.toString(),
            customer_email: ctx.user.email || '',
            customer_name: ctx.user.name || '',
          },
          allow_promotion_codes: true,
        });

        return {
          checkoutUrl: session.url,
          sessionId: session.id,
        };
      } catch (error: any) {
        console.error('[Stripe] Error creating checkout session:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `Failed to create checkout session: ${error.message}`,
        });
      }
    }),

  /**
   * Verify subscription payment and activate subscription
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
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Payment not completed',
          });
        }

        const metadata = session.metadata;
        if (!metadata || metadata.user_id !== ctx.user.id.toString()) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'Invalid payment session',
          });
        }

        const monthlyCoins = parseInt(metadata.monthly_coins || '0');

        // Add initial coins to user account
        const updatedProfile = await db.addCoinsToUser(ctx.user.id, monthlyCoins);

        return {
          success: true,
          coinsAdded: monthlyCoins,
          newBalance: updatedProfile.coins,
        };
      } catch (error: any) {
        console.error('[Stripe] Error verifying payment:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `Failed to verify payment: ${error.message}`,
        });
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
