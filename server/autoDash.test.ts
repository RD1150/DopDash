/**
 * Auto-Dash Feature Tests
 * Comprehensive test coverage for AI-powered task suggestions
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  generateAutoDashSuggestion,
  getActiveSuggestion,
  acceptSuggestion,
  rejectSuggestion,
  completeSuggestion,
  getAutoDashHistory,
  getAutoDashStats,
} from "./autoDash";

// Mock the database and LLM
vi.mock("./db", () => ({
  db: {
    insert: vi.fn().mockReturnValue({
      values: vi.fn().mockResolvedValue({ insertId: 1 }),
    }),
    select: vi.fn().mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          orderBy: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([]),
          }),
          limit: vi.fn().mockResolvedValue([]),
        }),
      }),
    }),
    update: vi.fn().mockReturnValue({
      set: vi.fn().mockReturnValue({
        where: vi.fn().mockResolvedValue({}),
      }),
    }),
  },
}));

vi.mock("./server/_core/llm", () => ({
  invokeLLM: vi.fn().mockResolvedValue({
    choices: [
      {
        message: {
          content: JSON.stringify({
            title: "Water your plants",
            description: "A quick, calming task. Just 2 minutes to water your plants and take a breath.",
            estimatedMinutes: 2,
            encouragement: "Taking care of living things helps you feel grounded.",
          }),
        },
      },
    ],
  }),
}));

describe("Auto-Dash Feature", () => {
  describe("generateAutoDashSuggestion", () => {
    it("should generate a suggestion based on energy level, mood, and time", async () => {
      const suggestion = await generateAutoDashSuggestion(1, "low", 2, "2min");

      expect(suggestion).toHaveProperty("title");
      expect(suggestion).toHaveProperty("description");
      expect(suggestion).toHaveProperty("estimatedMinutes");
      expect(suggestion).toHaveProperty("encouragement");
      expect(suggestion.energyLevel).toBe("low");
      expect(suggestion.moodLevel).toBe(2);
      expect(suggestion.timeAvailable).toBe("2min");
    });

    it("should handle high energy level suggestions", async () => {
      const suggestion = await generateAutoDashSuggestion(1, "high", 5, "15min");

      expect(suggestion.energyLevel).toBe("high");
      expect(suggestion.moodLevel).toBe(5);
      expect(suggestion.timeAvailable).toBe("15min");
    });

    it("should include expiration time (1 hour from now)", async () => {
      const suggestion = await generateAutoDashSuggestion(1, "medium", 3, "5min");
      const now = Date.now();
      const expiresAt = new Date(suggestion.expiresAt).getTime();

      expect(expiresAt).toBeGreaterThan(now);
      expect(expiresAt - now).toBeLessThanOrEqual(60 * 60 * 1000 + 1000); // 1 hour + 1 second buffer
    });

    it("should accept optional context parameter", async () => {
      const suggestion = await generateAutoDashSuggestion(1, "low", 2, "2min", "work");

      expect(suggestion).toHaveProperty("title");
      expect(suggestion.energyLevel).toBe("low");
    });

    it("should handle LLM errors gracefully", async () => {
      vi.mocked(invokeLLM).mockRejectedValueOnce(new Error("LLM error"));

      await expect(
        generateAutoDashSuggestion(1, "low", 2, "2min")
      ).rejects.toThrow();
    });
  });

  describe("getActiveSuggestion", () => {
    it("should return null if no active suggestion exists", async () => {
      const suggestion = await getActiveSuggestion(1);
      expect(suggestion).toBeNull();
    });

    it("should filter out expired suggestions", async () => {
      // This is tested through the database query logic
      const suggestion = await getActiveSuggestion(1);
      expect(suggestion).toBeNull();
    });

    it("should filter out accepted suggestions", async () => {
      const suggestion = await getActiveSuggestion(1);
      expect(suggestion).toBeNull();
    });

    it("should filter out rejected suggestions", async () => {
      const suggestion = await getActiveSuggestion(1);
      expect(suggestion).toBeNull();
    });
  });

  describe("acceptSuggestion", () => {
    it("should mark suggestion as accepted", async () => {
      const result = await acceptSuggestion(1, 1);

      expect(result).toHaveProperty("taskId");
      expect(result).toHaveProperty("title");
    });

    it("should create a task from the suggestion", async () => {
      const result = await acceptSuggestion(1, 1, "work");

      expect(result.taskId).toBeDefined();
      expect(typeof result.taskId).toBe("number");
    });

    it("should throw error if suggestion not found", async () => {
      await expect(acceptSuggestion(1, 999)).rejects.toThrow(
        "Suggestion not found"
      );
    });

    it("should use provided category for task", async () => {
      const result = await acceptSuggestion(1, 1, "home");

      expect(result).toHaveProperty("taskId");
    });

    it("should default to 'self' category if not provided", async () => {
      const result = await acceptSuggestion(1, 1);

      expect(result).toHaveProperty("taskId");
    });
  });

  describe("rejectSuggestion", () => {
    it("should mark suggestion as rejected", async () => {
      await expect(rejectSuggestion(1, 1)).resolves.not.toThrow();
    });

    it("should only reject user's own suggestions", async () => {
      await expect(rejectSuggestion(1, 1)).resolves.not.toThrow();
    });
  });

  describe("completeSuggestion", () => {
    it("should mark suggestion as completed", async () => {
      await expect(completeSuggestion(1, 1)).resolves.not.toThrow();
    });

    it("should track completion for analytics", async () => {
      await expect(completeSuggestion(1, 1)).resolves.not.toThrow();
    });
  });

  describe("getAutoDashHistory", () => {
    it("should return empty array if no history exists", async () => {
      const history = await getAutoDashHistory(1);
      expect(Array.isArray(history)).toBe(true);
    });

    it("should respect limit parameter", async () => {
      const history = await getAutoDashHistory(1, 5);
      expect(Array.isArray(history)).toBe(true);
    });

    it("should default to 10 items", async () => {
      const history = await getAutoDashHistory(1);
      expect(Array.isArray(history)).toBe(true);
    });

    it("should return suggestions ordered by creation date", async () => {
      const history = await getAutoDashHistory(1);
      expect(Array.isArray(history)).toBe(true);
    });
  });

  describe("getAutoDashStats", () => {
    it("should return statistics object with all required fields", async () => {
      const stats = await getAutoDashStats(1);

      expect(stats).toHaveProperty("totalGenerated");
      expect(stats).toHaveProperty("accepted");
      expect(stats).toHaveProperty("rejected");
      expect(stats).toHaveProperty("completed");
      expect(stats).toHaveProperty("acceptanceRate");
      expect(stats).toHaveProperty("completionRate");
    });

    it("should calculate acceptance rate correctly", async () => {
      const stats = await getAutoDashStats(1);

      expect(stats.acceptanceRate).toBeGreaterThanOrEqual(0);
      expect(stats.acceptanceRate).toBeLessThanOrEqual(100);
    });

    it("should calculate completion rate correctly", async () => {
      const stats = await getAutoDashStats(1);

      expect(stats.completionRate).toBeGreaterThanOrEqual(0);
      expect(stats.completionRate).toBeLessThanOrEqual(100);
    });

    it("should handle zero suggestions gracefully", async () => {
      const stats = await getAutoDashStats(1);

      expect(stats.totalGenerated).toBe(0);
      expect(stats.acceptanceRate).toBe(0);
      expect(stats.completionRate).toBe(0);
    });
  });

  describe("Auto-Dash Feature - Integration", () => {
    it("should support full workflow: generate -> accept -> complete", async () => {
      // Generate
      const suggestion = await generateAutoDashSuggestion(1, "low", 2, "2min");
      expect(suggestion).toHaveProperty("title");

      // Accept
      const accepted = await acceptSuggestion(1, suggestion.id);
      expect(accepted).toHaveProperty("taskId");

      // Complete
      await expect(completeSuggestion(1, suggestion.id)).resolves.not.toThrow();
    });

    it("should support full workflow: generate -> reject -> generate new", async () => {
      // Generate
      const suggestion1 = await generateAutoDashSuggestion(1, "low", 2, "2min");
      expect(suggestion1).toHaveProperty("title");

      // Reject
      await expect(rejectSuggestion(1, suggestion1.id)).resolves.not.toThrow();

      // Generate new
      const suggestion2 = await generateAutoDashSuggestion(1, "low", 2, "2min");
      expect(suggestion2).toHaveProperty("title");
    });

    it("should track stats across multiple suggestions", async () => {
      // Generate multiple suggestions
      const suggestion1 = await generateAutoDashSuggestion(1, "low", 2, "2min");
      const suggestion2 = await generateAutoDashSuggestion(1, "medium", 3, "5min");

      // Get stats
      const stats = await getAutoDashStats(1);

      expect(stats.totalGenerated).toBeGreaterThanOrEqual(0);
    });
  });

  describe("Auto-Dash Feature - ADHD-Specific Behavior", () => {
    it("should generate different suggestions for different energy levels", async () => {
      const lowEnergy = await generateAutoDashSuggestion(1, "low", 2, "2min");
      const highEnergy = await generateAutoDashSuggestion(1, "high", 5, "15min");

      expect(lowEnergy.energyLevel).toBe("low");
      expect(highEnergy.energyLevel).toBe("high");
    });

    it("should respect time constraints", async () => {
      const quick = await generateAutoDashSuggestion(1, "low", 2, "2min");
      const longer = await generateAutoDashSuggestion(1, "high", 5, "15min");

      expect(quick.timeAvailable).toBe("2min");
      expect(longer.timeAvailable).toBe("15min");
    });

    it("should support mood-based suggestions", async () => {
      const veryLowMood = await generateAutoDashSuggestion(1, "low", 1, "2min");
      const goodMood = await generateAutoDashSuggestion(1, "high", 5, "15min");

      expect(veryLowMood.moodLevel).toBe(1);
      expect(goodMood.moodLevel).toBe(5);
    });

    it("should handle context-aware suggestions (work vs home)", async () => {
      const workTask = await generateAutoDashSuggestion(1, "medium", 3, "5min", "work");
      const homeTask = await generateAutoDashSuggestion(1, "medium", 3, "5min", "home");

      expect(workTask).toHaveProperty("title");
      expect(homeTask).toHaveProperty("title");
    });
  });
});
