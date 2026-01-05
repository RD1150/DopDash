import { trpc } from '@/lib/trpc';

/**
 * Hook to check if user has premium access
 * Returns isPremium status and loading state
 */
export function usePremium() {
  const { data, isLoading } = trpc.stripe.checkPremiumStatus.useQuery();
  
  return {
    isPremium: data?.isPremium ?? false,
    isLoading,
  };
}

/**
 * Premium themes that require payment
 */
export const PREMIUM_THEMES = ['cyberpunk', 'ocean', 'sunset', 'lavender'] as const;

/**
 * Free themes available to all users
 */
export const FREE_THEMES = ['default', 'cottagecore'] as const;

/**
 * Check if a theme requires premium access
 */
export function isPremiumTheme(theme: string): boolean {
  return PREMIUM_THEMES.includes(theme as any);
}
