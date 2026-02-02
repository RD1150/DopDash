/**
 * Emotional UX System for Dopamine Dasher
 * Provides affirmations, redirection messages, and state-aware language
 * Core principle: "You're not behind. This mattered."
 */

// Completion affirmations (rotate randomly)
export const COMPLETION_AFFIRMATIONS = [
  "That counted.",
  "You didn't have to do more.",
  "This is how momentum starts.",
  "Even small steps change things.",
  "You showed up.",
] as const;

// Gentle redirection messages for hesitation/abandonment (rotate randomly)
export const REDIRECTION_MESSAGES = [
  "Want to make this smaller?",
  "It's okay to start lighter.",
  "One step is enough.",
  "Stopping doesn't erase effort.",
] as const;

// State-aware language based on context
export const STATE_AWARE_MESSAGES = {
  SMALL_TASK: "This won't take long. That's intentional.",
  QUICK_COMPLETION: "Quick wins still count.",
  ABANDONED_TASK: "Stopping doesn't erase effort.",
  RETURNING_AFTER_INACTIVITY: "You're not behind.",
  MISSED_DAYS: "You're not behind.",
  LOW_ENERGY: "You're not behind.",
} as const;

// Core anchor phrase (appears at re-entry moments)
export const ANCHOR_PHRASE = "You're not behind.";

// Hesitation detection thresholds
export const HESITATION_THRESHOLDS = {
  PAUSE_DURATION_MS: 30000, // 30 seconds on task screen
  REPEATED_OPENS_THRESHOLD: 3, // Open app 3+ times without completing
  REPEATED_OPENS_WINDOW_MS: 300000, // Within 5 minutes
} as const;

// Completion feedback animation config
export const COMPLETION_ANIMATION = {
  DURATION_MS: 800, // < 1 second
  TYPE: "calm", // fade, glow, checkmark, gentle lift - NOT celebratory
  SOUND: "off", // Keep optional, off by default
} as const;

// Helper functions
export function getRandomAffirmation(): string {
  return COMPLETION_AFFIRMATIONS[
    Math.floor(Math.random() * COMPLETION_AFFIRMATIONS.length)
  ];
}

export function getRandomRedirection(): string {
  return REDIRECTION_MESSAGES[
    Math.floor(Math.random() * REDIRECTION_MESSAGES.length)
  ];
}

export function getStateAwareMessage(
  state: keyof typeof STATE_AWARE_MESSAGES
): string {
  return STATE_AWARE_MESSAGES[state];
}

export type CompletionAffirmation = (typeof COMPLETION_AFFIRMATIONS)[number];
export type RedirectionMessage = (typeof REDIRECTION_MESSAGES)[number];
export type StateAwareContext = keyof typeof STATE_AWARE_MESSAGES;
