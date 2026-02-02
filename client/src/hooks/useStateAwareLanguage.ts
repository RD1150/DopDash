import { useMemo } from "react";
import {
  getStateAwareMessage,
  ANCHOR_PHRASE,
  type StateAwareContext,
} from "@shared/emotionalUX";

interface TaskContext {
  taskDuration?: number; // milliseconds
  taskSize?: "small" | "medium" | "large";
  completionTime?: number; // milliseconds
  isAbandoned?: boolean;
  daysSinceLastActivity?: number;
  userEnergyLevel?: "low" | "medium" | "high";
}

/**
 * useStateAwareLanguage Hook
 * Provides contextually appropriate messages based on user state and task context.
 *
 * Examples:
 * - Small task → "This won't take long. That's intentional."
 * - Quick completion → "Quick wins still count."
 * - Abandoned task → "Stopping doesn't erase effort."
 * - Returning after inactivity → "You're not behind."
 * - Low energy → "You're not behind."
 */
export function useStateAwareLanguage(context: TaskContext) {
  const message = useMemo(() => {
    // Priority 1: Returning after inactivity or missed days
    if (context.daysSinceLastActivity && context.daysSinceLastActivity > 0) {
      return getStateAwareMessage("RETURNING_AFTER_INACTIVITY");
    }

    // Priority 2: Low energy context
    if (context.userEnergyLevel === "low") {
      return getStateAwareMessage("LOW_ENERGY");
    }

    // Priority 3: Abandoned task
    if (context.isAbandoned) {
      return getStateAwareMessage("ABANDONED_TASK");
    }

    // Priority 4: Quick completion
    if (
      context.completionTime &&
      context.completionTime < 60000 &&
      context.taskSize === "small"
    ) {
      return getStateAwareMessage("QUICK_COMPLETION");
    }

    // Priority 5: Small task
    if (context.taskSize === "small") {
      return getStateAwareMessage("SMALL_TASK");
    }

    // Default: Anchor phrase
    return ANCHOR_PHRASE;
  }, [context]);

  return { message };
}

/**
 * Helper function to determine task size based on description length
 */
export function estimateTaskSize(
  taskDescription: string
): "small" | "medium" | "large" {
  const wordCount = taskDescription.trim().split(/\s+/).length;
  if (wordCount <= 5) return "small";
  if (wordCount <= 15) return "medium";
  return "large";
}

/**
 * Helper function to calculate days since last activity
 */
export function daysSinceLastActivity(lastActivityTime: number): number {
  const now = Date.now();
  const diffMs = now - lastActivityTime;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  return diffDays;
}
