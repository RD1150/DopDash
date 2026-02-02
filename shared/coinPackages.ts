/**
 * Subscription tier definitions for Dopamine Dasher
 * Monthly recurring billing with Stripe
 */

export interface SubscriptionTier {
  id: string;
  name: string;
  monthlyPrice: number; // in cents (e.g., 599 = $5.99)
  monthlyPriceUSD: string;
  annualPrice: number; // in cents (e.g., 7188 = $71.88 = 10 months worth, 2 months free)
  annualPriceUSD: string;
  monthlyCoins: number; // coins earned per month
  dailyBonus: number; // bonus coins per day
  features: string[];
  popular?: boolean;
  stripePriceId?: string; // Stripe price ID for monthly
  stripeAnnualPriceId?: string; // Stripe price ID for annual
}

export const SUBSCRIPTION_TIERS: SubscriptionTier[] = [
  {
    id: "starter",
    name: "Focus",
    monthlyPrice: 599, // $5.99
    monthlyPriceUSD: "$5.99",
    annualPrice: 7188, // $71.88 (10 months, 2 free)
    annualPriceUSD: "$71.88",
    monthlyCoins: 1000,
    dailyBonus: 50,
    features: [
      "1,000 coins per month",
      "50 bonus coins daily",
      "Basic task insights",
      "Standard support",
    ],
    popular: false,
  },
  {
    id: "pro",
    name: "Momentum",
    monthlyPrice: 1499, // $14.99
    monthlyPriceUSD: "$14.99",
    annualPrice: 17988, // $179.88 (10 months, 2 free)
    annualPriceUSD: "$179.88",
    monthlyCoins: 3000,
    dailyBonus: 150,
    features: [
      "3,000 coins per month",
      "150 bonus coins daily",
      "Advanced analytics",
      "Priority support",
      "Exclusive rewards",
      "Early access to features",
    ],
    popular: true,
  },
];

/**
 * Get a subscription tier by ID
 */
export function getSubscriptionTier(id: string): SubscriptionTier | undefined {
  return SUBSCRIPTION_TIERS.find((tier) => tier.id === id);
}

/**
 * Format price for display
 */
export function formatPrice(priceInCents: number): string {
  return `$${(priceInCents / 100).toFixed(2)}`;
}

/**
 * Calculate annual savings
 */
export function calculateAnnualSavings(tier: SubscriptionTier): string {
  const monthlyTotal = tier.monthlyPrice * 12;
  const savings = monthlyTotal - tier.annualPrice;
  const savingsPercent = Math.round((savings / monthlyTotal) * 100);
  return `Save ${savingsPercent}% with annual`;
}
