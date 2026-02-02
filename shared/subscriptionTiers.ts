/**
 * Subscription tier definitions
 * Defines pricing, features, and messaging for free and premium tiers
 */

export type SubscriptionTier = "free" | "premium";

export interface TierDefinition {
  tier: SubscriptionTier;
  name: string;
  badge?: string;
  price: number;
  billingPeriod: "month" | "year";
  description: string;
  supportingLine: string;
  features: string[];
  valueStatement: string;
  buttonText: string;
  recommended?: boolean;
}

export const SUBSCRIPTION_TIERS: Record<SubscriptionTier, TierDefinition> = {
  free: {
    tier: "free",
    name: "Free — Always Available",
    price: 0,
    billingPeriod: "month",
    description: "Start without pressure.",
    supportingLine: "The free version is meant to help you start something small and feel a win — no guilt, no pressure.",
    features: [
      "Create and complete tasks",
      "Instant dopamine feedback",
      "Gentle rewards and progress tracking",
      "Calm, judgment-free experience",
    ],
    valueStatement: "The free version is meant to help you start something small and feel a win — no guilt, no pressure.",
    buttonText: "Start Free",
  },
  premium: {
    tier: "premium",
    name: "Premium Support",
    badge: "Recommended",
    price: 5.99,
    billingPeriod: "month",
    description: "When you want things to feel easier.",
    supportingLine: "Premium isn't about doing more. It's about needing less effort to begin.",
    features: [
      "Auto-Dash task suggestions",
      "Let the app suggest one small thing when you feel stuck.",
      "Low-Energy Mode",
      "Softer tasks and gentler language for hard days.",
      "Streak forgiveness",
      "Progress doesn't disappear if you miss a day.",
      "Custom rewards & feedback",
      "Adjust sounds, affirmations, and completion style.",
      "Gentle insights",
      "Learn what helps you start — without charts or productivity scores.",
    ],
    valueStatement: "Premium isn't about doing more. It's about needing less effort to begin.",
    buttonText: "Upgrade for More Support",
    recommended: true,
  },
};

/**
 * Premium features mapping
 * Which database fields enable which features
 */
export const PREMIUM_FEATURES = {
  autoDash: {
    name: "Auto-Dash",
    description: "Task suggestions when you feel stuck",
    databaseField: "autoDashEnabled",
  },
  lowEnergyMode: {
    name: "Low-Energy Mode",
    description: "Softer language and shorter tasks for hard days",
    databaseField: "lowEnergyModeEnabled",
  },
  streakForgiveness: {
    name: "Streak Forgiveness",
    description: "Pause streaks instead of breaking them",
    databaseField: "streakForgivenessEnabled",
  },
  rewardCustomization: {
    name: "Reward Customization",
    description: "Adjust feedback tone and intensity",
    databaseField: "rewardCustomizationEnabled",
  },
  gentleInsights: {
    name: "Gentle Insights",
    description: "Self-understanding without productivity pressure",
    databaseField: "gentleInsightsEnabled",
  },
};

/**
 * Contextual upsell triggers
 * When to show premium prompts based on user behavior
 */
export const UPSELL_TRIGGERS = {
  decisionFatigue: {
    type: "decision_fatigue" as const,
    description: "User has been idle for 2+ minutes on Dash screen",
    featurePromoted: "autoDash",
    message: "Feeling stuck? Let Auto-Dash suggest something small.",
  },
  lowEnergy: {
    type: "low_energy" as const,
    description: "User selected low energy level",
    featurePromoted: "lowEnergyMode",
    message: "Try Low-Energy Mode for softer tasks and gentler language.",
  },
  streakBroken: {
    type: "streak_broken" as const,
    description: "User's streak was broken",
    featurePromoted: "streakForgiveness",
    message: "With Streak Forgiveness, you can pause instead of breaking your progress.",
  },
  noProgress: {
    type: "no_progress" as const,
    description: "User hasn't completed a task in 3+ days",
    featurePromoted: "autoDash",
    message: "Auto-Dash can help you start something small today.",
  },
  stuckTask: {
    type: "stuck_task" as const,
    description: "User has a task in progress for 30+ minutes",
    featurePromoted: "autoDash",
    message: "Try switching to something smaller with Auto-Dash.",
  },
};
