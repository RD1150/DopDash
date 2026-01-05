/**
 * Dopamine Dasher - Product Configuration
 * 
 * Defines the premium tier pricing for Stripe integration
 */

export const PRODUCTS = {
  PREMIUM_LIFETIME: {
    name: 'Dopamine Dasher Premium - Lifetime Access',
    description: 'One payment. Yours forever. Unlock all premium features.',
    price: 29.99,
    currency: 'usd',
    type: 'one_time' as const,
    features: [
      'All premium themes (Cyberpunk, Ocean, Sunset, Lavender)',
      'Cloud sync across devices',
      'Advanced analytics and insights',
      'Custom mascot accessories',
      'Wallpaper generator',
      'Priority support',
      'All future updates included'
    ]
  }
} as const;

export type ProductKey = keyof typeof PRODUCTS;
