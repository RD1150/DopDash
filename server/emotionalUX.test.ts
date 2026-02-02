import { describe, it, expect } from "vitest";
import {
  COMPLETION_AFFIRMATIONS,
  REDIRECTION_MESSAGES,
  STATE_AWARE_MESSAGES,
  ANCHOR_PHRASE,
  HESITATION_THRESHOLDS,
  COMPLETION_ANIMATION,
  getRandomAffirmation,
  getRandomRedirection,
  getStateAwareMessage,
} from "../shared/emotionalUX";

describe("Emotional UX System", () => {
  describe("Completion Affirmations", () => {
    it("should have exactly 5 affirmations", () => {
      expect(COMPLETION_AFFIRMATIONS.length).toBe(5);
    });

    it("should contain non-productivity language", () => {
      const affirmations = COMPLETION_AFFIRMATIONS.join(" ");
      expect(affirmations).not.toMatch(/productive|efficient|optimized/i);
    });

    it("should contain supportive language", () => {
      const affirmations = COMPLETION_AFFIRMATIONS.join(" ");
      expect(affirmations).toMatch(/counted|showed up|mattered|effort/i);
    });

    it("should return random affirmation", () => {
      const affirmation = getRandomAffirmation();
      expect(COMPLETION_AFFIRMATIONS).toContain(affirmation as any);
    });

    it("should return different affirmations on multiple calls", () => {
      const affirmations = new Set(
        Array.from({ length: 20 }, () => getRandomAffirmation())
      );
      expect(affirmations.size).toBeGreaterThan(1);
    });
  });

  describe("Redirection Messages", () => {
    it("should have exactly 4 redirection messages", () => {
      expect(REDIRECTION_MESSAGES.length).toBe(4);
    });

    it("should be gentle and non-judgmental", () => {
      const messages = REDIRECTION_MESSAGES.join(" ");
      expect(messages).not.toMatch(/failed|lazy|procrastinating/i);
    });

    it("should validate effort and stopping", () => {
      const messages = REDIRECTION_MESSAGES.join(" ");
      expect(messages).toMatch(/effort|okay|smaller|lighter/i);
    });

    it("should return random redirection", () => {
      const redirection = getRandomRedirection();
      expect(REDIRECTION_MESSAGES).toContain(redirection as any);
    });

    it("should return different redirections on multiple calls", () => {
      const redirections = new Set(
        Array.from({ length: 20 }, () => getRandomRedirection())
      );
      expect(redirections.size).toBeGreaterThan(1);
    });
  });

  describe("State-Aware Language", () => {
    it("should have all required states", () => {
      const requiredStates = [
        "SMALL_TASK",
        "QUICK_COMPLETION",
        "ABANDONED_TASK",
        "RETURNING_AFTER_INACTIVITY",
        "MISSED_DAYS",
        "LOW_ENERGY",
      ];
      requiredStates.forEach((state) => {
        expect(STATE_AWARE_MESSAGES).toHaveProperty(state);
      });
    });

    it("should include anchor phrase in appropriate contexts", () => {
      const reEntryMsg = getStateAwareMessage("RETURNING_AFTER_INACTIVITY");
      const missedDaysMsg = getStateAwareMessage("MISSED_DAYS");
      const lowEnergyMsg = getStateAwareMessage("LOW_ENERGY");
      
      expect(reEntryMsg).toContain("You're not behind");
      expect(missedDaysMsg).toContain("You're not behind");
      expect(lowEnergyMsg).toContain("You're not behind");
    });

    it("should validate effort in abandoned task message", () => {
      const message = getStateAwareMessage("ABANDONED_TASK");
      expect(message).toMatch(/effort|stopping/i);
    });

    it("should acknowledge quick wins", () => {
      const message = getStateAwareMessage("QUICK_COMPLETION");
      expect(message).toMatch(/quick|wins|count/i);
    });

    it("should return correct message for each state", () => {
      expect(getStateAwareMessage("SMALL_TASK")).toContain("won't take long");
      expect(getStateAwareMessage("QUICK_COMPLETION")).toContain("Quick wins");
      expect(getStateAwareMessage("ABANDONED_TASK")).toContain("Stopping");
    });
  });

  describe("Core Anchor Phrase", () => {
    it("should be exactly 'You're not behind.'", () => {
      expect(ANCHOR_PHRASE).toBe("You're not behind.");
    });

    it("should appear in re-entry contexts", () => {
      const reEntryMessages = [
        getStateAwareMessage("RETURNING_AFTER_INACTIVITY"),
        getStateAwareMessage("MISSED_DAYS"),
        getStateAwareMessage("LOW_ENERGY"),
      ];
      reEntryMessages.forEach((msg) => {
        expect(msg).toContain(ANCHOR_PHRASE);
      });
    });
  });

  describe("Hesitation Detection Thresholds", () => {
    it("should have pause duration threshold", () => {
      expect(HESITATION_THRESHOLDS.PAUSE_DURATION_MS).toBe(30000);
    });

    it("should have repeated opens threshold", () => {
      expect(HESITATION_THRESHOLDS.REPEATED_OPENS_THRESHOLD).toBe(3);
    });

    it("should have repeated opens time window", () => {
      expect(HESITATION_THRESHOLDS.REPEATED_OPENS_WINDOW_MS).toBe(300000);
    });

    it("pause duration should be reasonable (20-40 seconds)", () => {
      expect(HESITATION_THRESHOLDS.PAUSE_DURATION_MS).toBeGreaterThanOrEqual(
        20000
      );
      expect(HESITATION_THRESHOLDS.PAUSE_DURATION_MS).toBeLessThanOrEqual(
        40000
      );
    });

    it("time window should be 5 minutes", () => {
      expect(HESITATION_THRESHOLDS.REPEATED_OPENS_WINDOW_MS).toBe(300000);
    });
  });

  describe("Animation Configuration", () => {
    it("should have completion animation duration under 1 second", () => {
      expect(COMPLETION_ANIMATION.DURATION_MS).toBeLessThan(1000);
    });

    it("should be calm, not celebratory", () => {
      expect(COMPLETION_ANIMATION.TYPE).toBe("calm");
    });

    it("should have sound off by default", () => {
      expect(COMPLETION_ANIMATION.SOUND).toBe("off");
    });
  });

  describe("Emotional Tone Validation", () => {
    it("should never use urgency language", () => {
      const allMessages = [
        ...COMPLETION_AFFIRMATIONS,
        ...REDIRECTION_MESSAGES,
        ...Object.values(STATE_AWARE_MESSAGES),
        ANCHOR_PHRASE,
      ].join(" ");

      expect(allMessages).not.toMatch(/limited time|unlock|urgent|now/i);
    });

    it("should never use productivity/hustle language", () => {
      const allMessages = [
        ...COMPLETION_AFFIRMATIONS,
        ...REDIRECTION_MESSAGES,
        ...Object.values(STATE_AWARE_MESSAGES),
        ANCHOR_PHRASE,
      ].join(" ");

      expect(allMessages).not.toMatch(
        /productive|efficient|optimize|maximize|hustle/i
      );
    });

    it("should never use shame or judgment language", () => {
      const allMessages = [
        ...COMPLETION_AFFIRMATIONS,
        ...REDIRECTION_MESSAGES,
        ...Object.values(STATE_AWARE_MESSAGES),
        ANCHOR_PHRASE,
      ].join(" ");

      expect(allMessages).not.toMatch(/failed|lazy|weak|bad|wrong/i);
    });

    it("should use supportive and validating language", () => {
      const allMessages = [
        ...COMPLETION_AFFIRMATIONS,
        ...REDIRECTION_MESSAGES,
        ...Object.values(STATE_AWARE_MESSAGES),
        ANCHOR_PHRASE,
      ].join(" ");

      expect(allMessages).toMatch(
        /counted|showed|effort|okay|matter|support|gentle/i
      );
    });
  });

  describe("Integration Tests", () => {
    it("should provide complete emotional feedback flow", () => {
      const affirmation = getRandomAffirmation();
      expect(affirmation).toBeTruthy();
      expect(COMPLETION_AFFIRMATIONS).toContain(affirmation as any);

      const redirection = getRandomRedirection();
      expect(redirection).toBeTruthy();
      expect(REDIRECTION_MESSAGES).toContain(redirection as any);

      const reEntryMessage = getStateAwareMessage(
        "RETURNING_AFTER_INACTIVITY"
      );
      expect(reEntryMessage).toContain(ANCHOR_PHRASE);
    });

    it("should maintain emotional consistency across all messages", () => {
      const allMessages = [
        ...COMPLETION_AFFIRMATIONS,
        ...REDIRECTION_MESSAGES,
        ...Object.values(STATE_AWARE_MESSAGES),
        ANCHOR_PHRASE,
      ];

      allMessages.forEach((msg: any) => {
        expect(typeof msg).toBe("string");
        expect((msg as string).length).toBeGreaterThan(0);
      });

      allMessages.forEach((msg: any) => {
        expect(msg).not.toMatch(/^[A-Z\s.!?]+$/);
      });
    });
  });
});
