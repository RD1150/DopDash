import { eq, and, desc, gte } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, userProfiles, InsertUserProfile, tasks, InsertTask, journalEntries, InsertJournalEntry, dailyAffirmations, InsertDailyAffirmation, habits, InsertHabit, habitCompletions, InsertHabitCompletion, moodEntries, InsertMoodEntry, userStats, InsertUserStats, leaderboardEntries, InsertLeaderboardEntry, contests, InsertContest, contestParticipation, InsertContestParticipation, rewards, InsertReward, userRewards, InsertUserReward, dailyCheckIns, InsertDailyCheckIn } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// User Profile functions
export async function getUserProfile(userId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(userProfiles).where(eq(userProfiles.userId, userId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createUserProfile(profile: InsertUserProfile) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(userProfiles).values(profile);
}

export async function updateUserProfile(userId: number, updates: Partial<InsertUserProfile>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(userProfiles).set(updates).where(eq(userProfiles.userId, userId));
}

// Task functions
export async function getUserTasks(userId: number, completed?: boolean) {
  const db = await getDb();
  if (!db) return [];

  const conditions = [eq(tasks.userId, userId)];
  if (completed !== undefined) {
    conditions.push(eq(tasks.completed, completed ? 1 : 0));
  }

  return await db.select().from(tasks).where(and(...conditions)).orderBy(desc(tasks.createdAt));
}

export async function createTask(task: InsertTask) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(tasks).values(task);
  return result;
}

export async function updateTask(taskId: number, userId: number, updates: Partial<InsertTask>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(tasks).set(updates).where(and(eq(tasks.id, taskId), eq(tasks.userId, userId)));
}

export async function deleteTask(taskId: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.delete(tasks).where(and(eq(tasks.id, taskId), eq(tasks.userId, userId)));
}

// Journal functions
export async function getUserJournalEntries(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(journalEntries).where(eq(journalEntries.userId, userId)).orderBy(desc(journalEntries.completedAt));
}

export async function createJournalEntry(entry: InsertJournalEntry) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(journalEntries).values(entry);
}

// Daily Affirmation functions
export async function getTodayAffirmation(userId: number, date: string) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(dailyAffirmations)
    .where(and(eq(dailyAffirmations.userId, userId), eq(dailyAffirmations.shownDate, date)))
    .limit(1);
  
  return result.length > 0 ? result[0] : undefined;
}

export async function createDailyAffirmation(affirmation: InsertDailyAffirmation) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(dailyAffirmations).values(affirmation);
}

// ============ HABIT FUNCTIONS ============

export async function getUserHabits(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(habits)
    .where(and(eq(habits.userId, userId), eq(habits.isActive, 1)))
    .orderBy(desc(habits.createdAt));
}

export async function createHabit(habit: InsertHabit) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(habits).values(habit);
  return result;
}

export async function updateHabit(habitId: number, userId: number, updates: Partial<InsertHabit>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(habits).set(updates).where(and(eq(habits.id, habitId), eq(habits.userId, userId)));
}

export async function deleteHabit(habitId: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(habits).set({ isActive: 0 }).where(and(eq(habits.id, habitId), eq(habits.userId, userId)));
}

export async function getHabitCompletions(habitId: number, userId: number, days: number = 30) {
  const db = await getDb();
  if (!db) return [];

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  const startDateStr = startDate.toISOString().split('T')[0];

  return await db.select().from(habitCompletions)
    .where(and(
      eq(habitCompletions.habitId, habitId),
      eq(habitCompletions.userId, userId),
      gte(habitCompletions.date, startDateStr)
    ))
    .orderBy(desc(habitCompletions.date));
}

export async function completeHabit(habitId: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const today = new Date().toISOString().split('T')[0];
  
  const existing = await db.select().from(habitCompletions)
    .where(and(
      eq(habitCompletions.habitId, habitId),
      eq(habitCompletions.userId, userId),
      eq(habitCompletions.date, today)
    ))
    .limit(1);

  if (existing.length > 0) {
    return { alreadyCompleted: true };
  }

  await db.insert(habitCompletions).values({
    habitId,
    userId,
    completedAt: new Date(),
    date: today,
  });

  const habit = await db.select().from(habits).where(eq(habits.id, habitId)).limit(1);
  if (habit.length > 0) {
    const h = habit[0];
    const newStreak = (h.currentStreak || 0) + 1;
    const longestStreak = Math.max(newStreak, h.longestStreak || 0);
    
    await db.update(habits).set({
      currentStreak: newStreak,
      longestStreak: longestStreak,
      lastCompletedDate: today,
    }).where(eq(habits.id, habitId));
  }

  return { success: true };
}

// ============ MOOD FUNCTIONS ============

export async function createMoodEntry(entry: InsertMoodEntry) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(moodEntries).values(entry);
}

export async function getTodayMoodEntry(userId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const today = new Date().toISOString().split('T')[0];
  const result = await db.select().from(moodEntries)
    .where(and(eq(moodEntries.userId, userId), eq(moodEntries.date, today)))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getMoodHistory(userId: number, days: number = 30) {
  const db = await getDb();
  if (!db) return [];

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  const startDateStr = startDate.toISOString().split('T')[0];

  return await db.select().from(moodEntries)
    .where(and(
      eq(moodEntries.userId, userId),
      gte(moodEntries.date, startDateStr)
    ))
    .orderBy(desc(moodEntries.date));
}

// ============ ANALYTICS FUNCTIONS ============

export async function getUserStats(userId: number, date: string) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(userStats)
    .where(and(eq(userStats.userId, userId), eq(userStats.date, date)))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getStatsHistory(userId: number, days: number = 30) {
  const db = await getDb();
  if (!db) return [];

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  const startDateStr = startDate.toISOString().split('T')[0];

  return await db.select().from(userStats)
    .where(and(
      eq(userStats.userId, userId),
      gte(userStats.date, startDateStr)
    ))
    .orderBy(desc(userStats.date));
}

export async function updateUserStats(userId: number, date: string, updates: Partial<InsertUserStats>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const existing = await getUserStats(userId, date);
  
  if (existing) {
    await db.update(userStats).set(updates).where(
      and(eq(userStats.userId, userId), eq(userStats.date, date))
    );
  } else {
    await db.insert(userStats).values({
      userId,
      date,
      ...updates,
    });
  }
}


// ============ LEADERBOARD FUNCTIONS ============

export async function getGlobalLeaderboard(limit: number = 100) {
  const db = await getDb();
  if (!db) return [];

  return await db.select({
    id: leaderboardEntries.id,
    userId: leaderboardEntries.userId,
    currentStreak: leaderboardEntries.currentStreak,
    totalTasksCompleted: leaderboardEntries.totalTasksCompleted,
    totalCoins: leaderboardEntries.totalCoins,
    globalRank: leaderboardEntries.globalRank,
  })
    .from(leaderboardEntries)
    .orderBy(desc(leaderboardEntries.totalCoins))
    .limit(limit);
}

export async function updateLeaderboardEntry(userId: number, updates: Partial<InsertLeaderboardEntry>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const existing = await db.select().from(leaderboardEntries)
    .where(eq(leaderboardEntries.userId, userId))
    .limit(1);

  if (existing.length > 0) {
    await db.update(leaderboardEntries).set(updates).where(eq(leaderboardEntries.userId, userId));
  } else {
    await db.insert(leaderboardEntries).values({
      userId,
      ...updates,
    });
  }
}

export async function getUserLeaderboardRank(userId: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.select().from(leaderboardEntries)
    .where(eq(leaderboardEntries.userId, userId))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

// ============ CONTEST FUNCTIONS ============

export async function getActiveContests() {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(contests)
    .where(eq(contests.active, 1))
    .orderBy(desc(contests.startDate));
}

export async function createContest(contest: InsertContest) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(contests).values(contest);
  return result;
}

export async function getUserContestProgress(userId: number, contestId: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.select().from(contestParticipation)
    .where(and(
      eq(contestParticipation.userId, userId),
      eq(contestParticipation.contestId, contestId)
    ))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

export async function updateContestProgress(userId: number, contestId: number, progress: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const existing = await getUserContestProgress(userId, contestId);

  if (existing) {
    await db.update(contestParticipation)
      .set({ progress })
      .where(and(
        eq(contestParticipation.userId, userId),
        eq(contestParticipation.contestId, contestId)
      ));
  } else {
    await db.insert(contestParticipation).values({
      userId,
      contestId,
      progress,
    });
  }
}

export async function getContestLeaderboard(contestId: number, limit: number = 100) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(contestParticipation)
    .where(eq(contestParticipation.contestId, contestId))
    .orderBy(desc(contestParticipation.progress))
    .limit(limit);
}

// ============ REWARD FUNCTIONS ============

export async function getAllRewards() {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(rewards).orderBy(desc(rewards.cost));
}

export async function getUserRewards(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db.select({
    id: userRewards.id,
    userId: userRewards.userId,
    rewardId: userRewards.rewardId,
    name: rewards.name,
    emoji: rewards.emoji,
    type: rewards.type,
    rarity: rewards.rarity,
    unlockedAt: userRewards.unlockedAt,
  })
    .from(userRewards)
    .innerJoin(rewards, eq(userRewards.rewardId, rewards.id))
    .where(eq(userRewards.userId, userId))
    .orderBy(desc(userRewards.unlockedAt));
}

export async function purchaseReward(userId: number, rewardId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(userRewards).values({
    userId,
    rewardId,
  });
}

// ============ DAILY CHECK-IN FUNCTIONS ============

export async function getTodayCheckIn(userId: number) {
  const db = await getDb();
  if (!db) return null;

  const today = new Date().toISOString().split('T')[0];
  const result = await db.select().from(dailyCheckIns)
    .where(and(
      eq(dailyCheckIns.userId, userId),
      eq(dailyCheckIns.date, today)
    ))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

export async function createDailyCheckIn(checkIn: InsertDailyCheckIn) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(dailyCheckIns).values(checkIn);
}

export async function getCheckInHistory(userId: number, days: number = 30) {
  const db = await getDb();
  if (!db) return [];

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  const startDateStr = startDate.toISOString().split('T')[0];

  return await db.select().from(dailyCheckIns)
    .where(and(
      eq(dailyCheckIns.userId, userId),
      gte(dailyCheckIns.date, startDateStr)
    ))
    .orderBy(desc(dailyCheckIns.date));
}
