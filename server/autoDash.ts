/**
 * Auto-Dash Feature
 * Generates AI-powered task suggestions for Premium users
 * Helps with decision paralysis by suggesting tasks based on energy/mood/time
 */

import { db } from "./db";
import { autoDashSuggestions, tasks } from "../drizzle/schema";
import { eq, and, gt, isNull } from "drizzle-orm";
import { invokeLLM } from "./_core/llm";
import { TRPCError } from "@trpc/server";

/**
 * Generate an Auto-Dash suggestion using LLM
 * Based on user's energy level, mood, and available time
 */
export async function generateAutoDashSuggestion(
  userId: number,
  energyLevel: "low" | "medium" | "high",
  moodLevel: number, // 1-5
  timeAvailable: "2min" | "5min" | "15min",
  userContext?: string // e.g., "work", "home", "self-care"
) {
  try {
    // Build context for LLM
    const energyDescriptions = {
      low: "very low energy, struggling to focus, might be overwhelmed",
      medium: "moderate energy, ready for something manageable",
      high: "high energy, ready for a challenge",
    };

    const timeDescriptions = {
      "2min": "2 minutes or less",
      "5min": "around 5 minutes",
      "15min": "around 15 minutes",
    };

    const prompt = `You are a supportive task coach for someone with ADHD. Generate ONE specific, actionable micro-task suggestion.

User's current state:
- Energy level: ${energyDescriptions[energyLevel]}
- Mood: ${moodLevel}/5 (1=very low, 5=excellent)
- Time available: ${timeDescriptions[timeAvailable]}
${userContext ? `- Context: ${userContext}` : ""}

Guidelines:
1. Task should be SPECIFIC and CONCRETE (not vague like "organize")
2. Task should be completable in the time available
3. Task should feel achievable, not overwhelming
4. For low energy: suggest tiny wins, sensory-friendly tasks
5. For high energy: suggest slightly more challenging tasks
6. Include a brief, encouraging reason why this task might feel good

Format your response as JSON:
{
  "title": "Specific task title",
  "description": "2-3 sentence description with encouragement",
  "estimatedMinutes": number between 1-15,
  "encouragement": "Brief supportive message"
}`;

    const response = await invokeLLM({
      messages: [
        {
          role: "system",
          content:
            "You are a supportive task coach for ADHD brains. Generate helpful, achievable micro-tasks.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "task_suggestion",
          strict: true,
          schema: {
            type: "object",
            properties: {
              title: { type: "string", description: "Task title" },
              description: { type: "string", description: "Task description" },
              estimatedMinutes: { type: "number", description: "Estimated duration" },
              encouragement: { type: "string", description: "Supportive message" },
            },
            required: ["title", "description", "estimatedMinutes", "encouragement"],
            additionalProperties: false,
          },
        },
      },
    });

    // Parse the LLM response
    const content = response.choices[0].message.content;
    const suggestion = JSON.parse(content);

    // Save to database
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // Expires in 1 hour

    const result = await db.insert(autoDashSuggestions).values({
      userId,
      suggestedTaskTitle: suggestion.title,
      suggestedTaskDescription: suggestion.description,
      energyLevel,
      moodLevel,
      timeAvailable,
      expiresAt,
    });

    return {
      id: result.insertId,
      title: suggestion.title,
      description: suggestion.description,
      estimatedMinutes: suggestion.estimatedMinutes,
      encouragement: suggestion.encouragement,
      energyLevel,
      moodLevel,
      timeAvailable,
      expiresAt,
    };
  } catch (error) {
    console.error("Error generating Auto-Dash suggestion:", error);
    throw error;
  }
}

/**
 * Get the current active Auto-Dash suggestion for a user
 */
export async function getActiveSuggestion(userId: number) {
  const now = new Date();

  const suggestion = await db
    .select()
    .from(autoDashSuggestions)
    .where(
      and(
        eq(autoDashSuggestions.userId, userId),
        gt(autoDashSuggestions.expiresAt, now),
        eq(autoDashSuggestions.accepted, 0),
        eq(autoDashSuggestions.rejected, 0)
      )
    )
    .orderBy(autoDashSuggestions.createdAt)
    .limit(1);

  return suggestion[0] || null;
}

/**
 * Accept an Auto-Dash suggestion and create a task from it
 */
export async function acceptSuggestion(
  userId: number,
  suggestionId: number,
  category?: string
) {
  // Mark suggestion as accepted
  await db
    .update(autoDashSuggestions)
    .set({ accepted: 1 })
    .where(
      and(
        eq(autoDashSuggestions.id, suggestionId),
        eq(autoDashSuggestions.userId, userId)
      )
    );

  // Get the suggestion details
  const suggestion = await db
    .select()
    .from(autoDashSuggestions)
    .where(eq(autoDashSuggestions.id, suggestionId))
    .limit(1);

  if (!suggestion[0]) {
    throw new Error("Suggestion not found");
  }

  // Create a task from the suggestion
  const taskResult = await db.insert(tasks).values({
    userId,
    title: suggestion[0].suggestedTaskTitle || "Quick Task",
    type: "quick",
    category: category || "self",
    durationMinutes: 5,
    xpReward: 10,
    coinReward: 5,
  });

  return {
    taskId: taskResult.insertId,
    title: suggestion[0].suggestedTaskTitle,
  };
}

/**
 * Reject an Auto-Dash suggestion
 */
export async function rejectSuggestion(userId: number, suggestionId: number) {
  await db
    .update(autoDashSuggestions)
    .set({ rejected: 1 })
    .where(
      and(
        eq(autoDashSuggestions.id, suggestionId),
        eq(autoDashSuggestions.userId, userId)
      )
    );
}

/**
 * Mark a suggestion as completed
 */
export async function completeSuggestion(userId: number, suggestionId: number) {
  await db
    .update(autoDashSuggestions)
    .set({ completed: 1 })
    .where(
      and(
        eq(autoDashSuggestions.id, suggestionId),
        eq(autoDashSuggestions.userId, userId)
      )
    );
}

/**
 * Get user's Auto-Dash history (for analytics)
 */
export async function getAutoDashHistory(userId: number, limit = 10) {
  const history = await db
    .select()
    .from(autoDashSuggestions)
    .where(eq(autoDashSuggestions.userId, userId))
    .orderBy(autoDashSuggestions.createdAt)
    .limit(limit);

  return history;
}

/**
 * Get Auto-Dash statistics for a user
 */
export async function getAutoDashStats(userId: number) {
  const suggestions = await db
    .select()
    .from(autoDashSuggestions)
    .where(eq(autoDashSuggestions.userId, userId));

  const stats = {
    totalGenerated: suggestions.length,
    accepted: suggestions.filter((s) => s.accepted).length,
    rejected: suggestions.filter((s) => s.rejected).length,
    completed: suggestions.filter((s) => s.completed).length,
    acceptanceRate:
      suggestions.length > 0
        ? Math.round(
            (suggestions.filter((s) => s.accepted).length / suggestions.length) * 100
          )
        : 0,
    completionRate:
      suggestions.length > 0
        ? Math.round(
            (suggestions.filter((s) => s.completed).length / suggestions.length) * 100
          )
        : 0,
  };

  return stats;
}
