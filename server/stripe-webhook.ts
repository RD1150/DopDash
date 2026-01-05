import type { Request, Response } from 'express';
import Stripe from 'stripe';
import { getDb } from './db.js';
import { users } from '../drizzle/schema.js';
import { eq } from 'drizzle-orm';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-12-15.clover',
});

export async function handleStripeWebhook(req: Request, res: Response) {
  const sig = req.headers['stripe-signature'];

  if (!sig) {
    console.error('[Webhook] No signature provided');
    return res.status(400).send('No signature');
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error('[Webhook] Signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle test events
  if (event.id.startsWith('evt_test_')) {
    console.log('[Webhook] Test event detected, returning verification response');
    return res.json({ verified: true });
  }

  console.log('[Webhook] Processing event:', event.type, event.id);

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        
        // Extract user info from metadata
        const userId = session.metadata?.user_id;
        const customerEmail = session.customer_email || session.metadata?.customer_email;

        if (!userId) {
          console.error('[Webhook] No user_id in session metadata');
          return res.status(400).send('Missing user_id');
        }

        console.log(`[Webhook] Payment successful for user ${userId}`);

        // Update user to premium status
        const db = await getDb();
        if (!db) {
          console.error('[Webhook] Database not available');
          return res.status(500).send('Database error');
        }

        await db
          .update(users)
          .set({
            isPremium: 1, // 1 = true for MySQL boolean
            stripeCustomerId: session.customer as string,
            updatedAt: new Date(),
          })
          .where(eq(users.id, parseInt(userId)));

        console.log(`[Webhook] User ${userId} upgraded to premium`);
        break;
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log('[Webhook] Payment intent succeeded:', paymentIntent.id);
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.error('[Webhook] Payment failed:', paymentIntent.id);
        break;
      }

      default:
        console.log(`[Webhook] Unhandled event type: ${event.type}`);
    }

    return res.json({ received: true });
  } catch (error: any) {
    console.error('[Webhook] Error processing event:', error);
    return res.status(500).send(`Webhook processing error: ${error.message}`);
  }
}
