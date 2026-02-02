import { useEffect, useRef, useState } from "react";
import {
  getRandomRedirection,
  HESITATION_THRESHOLDS,
  type RedirectionMessage,
} from "@shared/emotionalUX";

interface HesitationEvent {
  type:
    | "TASK_CANCELLED"
    | "PAUSE_TOO_LONG"
    | "EXIT_MID_TASK"
    | "REPEATED_OPENS";
  message: RedirectionMessage;
  timestamp: number;
}

/**
 * useHesitationDetection Hook
 * Detects when users hesitate or abandon tasks and provides gentle redirection.
 *
 * Detectable situations:
 * - User cancels a task
 * - User pauses too long on a task screen
 * - User exits mid-task
 * - User opens app repeatedly without completing
 *
 * Behavior: Shows one single line of gentle redirection (inline, not modal)
 */
export function useHesitationDetection() {
  const [hesitationEvent, setHesitationEvent] = useState<HesitationEvent | null>(
    null
  );
  const pauseTimerRef = useRef<NodeJS.Timeout | null>(null);
  const appOpenCountRef = useRef<number>(0);
  const lastOpenTimeRef = useRef<number>(0);

  // Detect task cancellation
  const onTaskCancelled = () => {
    setHesitationEvent({
      type: "TASK_CANCELLED",
      message: getRandomRedirection(),
      timestamp: Date.now(),
    });
  };

  // Detect pause too long (30+ seconds on task screen)
  const onTaskScreenEnter = () => {
    pauseTimerRef.current = setTimeout(() => {
      setHesitationEvent({
        type: "PAUSE_TOO_LONG",
        message: getRandomRedirection(),
        timestamp: Date.now(),
      });
    }, HESITATION_THRESHOLDS.PAUSE_DURATION_MS);
  };

  const onTaskScreenExit = () => {
    if (pauseTimerRef.current) {
      clearTimeout(pauseTimerRef.current);
      pauseTimerRef.current = null;
    }
  };

  // Detect exit mid-task
  const onExitMidTask = () => {
    setHesitationEvent({
      type: "EXIT_MID_TASK",
      message: getRandomRedirection(),
      timestamp: Date.now(),
    });
  };

  // Detect repeated app opens without completion
  const onAppOpen = () => {
    const now = Date.now();
    const timeSinceLastOpen = now - lastOpenTimeRef.current;

    // Reset counter if outside the window
    if (timeSinceLastOpen > HESITATION_THRESHOLDS.REPEATED_OPENS_WINDOW_MS) {
      appOpenCountRef.current = 1;
    } else {
      appOpenCountRef.current++;
    }

    lastOpenTimeRef.current = now;

    // Trigger redirection if threshold reached
    if (
      appOpenCountRef.current >=
      HESITATION_THRESHOLDS.REPEATED_OPENS_THRESHOLD
    ) {
      setHesitationEvent({
        type: "REPEATED_OPENS",
        message: getRandomRedirection(),
        timestamp: Date.now(),
      });
      appOpenCountRef.current = 0; // Reset
    }
  };

  // Reset hesitation event after display
  const clearHesitation = () => {
    setHesitationEvent(null);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (pauseTimerRef.current) {
        clearTimeout(pauseTimerRef.current);
      }
    };
  }, []);

  return {
    hesitationEvent,
    clearHesitation,
    onTaskCancelled,
    onTaskScreenEnter,
    onTaskScreenExit,
    onExitMidTask,
    onAppOpen,
  };
}
