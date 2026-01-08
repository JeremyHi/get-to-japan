import { Router } from 'express';
import express from 'express';
import Stripe from 'stripe';
import { userQueries } from '../db/queries.js';

const router = Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder');

// Stripe webhook - needs raw body
router.post('/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    if (webhookSecret) {
      event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } else {
      // In development, parse the body directly
      event = JSON.parse(req.body.toString());
    }
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      await handleCheckoutComplete(session);
      break;
    }

    case 'customer.subscription.created':
    case 'customer.subscription.updated': {
      const subscription = event.data.object;
      await handleSubscriptionUpdate(subscription);
      break;
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object;
      await handleSubscriptionCanceled(subscription);
      break;
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object;
      await handlePaymentFailed(invoice);
      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  res.json({ received: true });
});

async function handleCheckoutComplete(session) {
  const customerId = session.customer;
  const subscriptionId = session.subscription;
  const customerEmail = session.customer_email;

  console.log(`Checkout completed for ${customerEmail}`);

  // Find user by email and update their subscription
  const user = userQueries.findByEmail(customerEmail);
  if (user) {
    userQueries.setStripeCustomerId(user.id, customerId);

    // Subscription details will be updated via the subscription webhook
  }
}

async function handleSubscriptionUpdate(subscription) {
  const customerId = subscription.customer;
  const status = subscription.status;
  const currentPeriodEnd = new Date(subscription.current_period_end * 1000).toISOString();

  console.log(`Subscription ${subscription.id} updated: ${status}`);

  // Find user by Stripe customer ID
  const db = (await import('../db/queries.js')).getDb();
  const user = db.prepare('SELECT * FROM users WHERE stripe_customer_id = ?').get(customerId);

  if (user) {
    if (status === 'active' || status === 'trialing') {
      userQueries.updateSubscription(user.id, 'pro', currentPeriodEnd, subscription.id);
    } else if (status === 'canceled' || status === 'unpaid') {
      userQueries.updateSubscription(user.id, 'free', null, null);
    }
  }
}

async function handleSubscriptionCanceled(subscription) {
  const customerId = subscription.customer;

  console.log(`Subscription ${subscription.id} canceled`);

  const db = (await import('../db/queries.js')).getDb();
  const user = db.prepare('SELECT * FROM users WHERE stripe_customer_id = ?').get(customerId);

  if (user) {
    userQueries.updateSubscription(user.id, 'free', null, null);
  }
}

async function handlePaymentFailed(invoice) {
  const customerId = invoice.customer;

  console.log(`Payment failed for customer ${customerId}`);

  // TODO: Send email notification about failed payment
}

export default router;
