/**
 * A/B Test Variants for Demo Gate Messaging
 * Tests different CTA copy and messaging to optimize conversion
 */

export type GateVariant = 'variant_a' | 'variant_b' | 'variant_c';

export interface GateVariantConfig {
  title: string;
  description: string;
  ctaText: string;
  dismissText: string;
  benefits: string[];
  variant: GateVariant;
}

export const GATE_VARIANTS: Record<GateVariant, GateVariantConfig> = {
  variant_a: {
    title: "You're Crushing It!",
    description: "You've completed {count} tasks in demo mode. That's amazing momentum! Create an account to unlock unlimited tasks and save your progress.",
    ctaText: 'Create Account (Free)',
    dismissText: 'Continue with demo',
    benefits: [
      'Unlimited Tasks',
      'Keep Your Streak',
      'Access Everywhere',
    ],
    variant: 'variant_a',
  },
  variant_b: {
    title: 'Ready to Level Up?',
    description: 'You just proved you can do it! {count} tasks completed. Sign up now to unlock rewards, build your streak, and keep the momentum going.',
    ctaText: 'Unlock Unlimited (Free)',
    dismissText: 'Keep trying demo',
    benefits: [
      'Earn Coins & Rewards',
      'Build Your Streak',
      'Never Lose Progress',
    ],
    variant: 'variant_b',
  },
  variant_c: {
    title: 'Your Momentum Matters',
    description: 'You\'ve completed {count} tasks—that\'s real progress! Create a free account to save your streak and unlock the full Dopamine Dasher experience.',
    ctaText: 'Save My Progress',
    dismissText: 'Continue demo',
    benefits: [
      'Save Your Streak',
      'Unlock All Features',
      'Track Your Growth',
    ],
    variant: 'variant_c',
  },
};

export function getRandomVariant(): GateVariant {
  const variants: GateVariant[] = ['variant_a', 'variant_b', 'variant_c'];
  const randomIndex = Math.floor(Math.random() * variants.length);
  return variants[randomIndex];
}

export function getVariantForSession(sessionId: string): GateVariant {
  // Deterministic variant selection based on session ID
  // Same session always gets same variant
  const hash = sessionId.split('').reduce((acc, char) => {
    return acc + char.charCodeAt(0);
  }, 0);
  
  const variants: GateVariant[] = ['variant_a', 'variant_b', 'variant_c'];
  return variants[hash % variants.length];
}

export function getGateConfig(variant: GateVariant, taskCount: number): GateVariantConfig {
  const config = GATE_VARIANTS[variant];
  return {
    ...config,
    description: config.description.replace('{count}', taskCount.toString()),
  };
}
