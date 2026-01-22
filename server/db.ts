import { eq, and, desc, or, gte } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, userProfiles, InsertUserProfile, tasks, InsertTask, journalEntries, InsertJournalEntry, dailyAffirmations, InsertDailyAffirmation, habits, InsertHabit, habitCompletions, InsertHabitCompletion, moodEntries, InsertMoodEntry, userStats, InsertUserStats, leaderboardEntries, InsertLeaderboardEntry, contests, InsertContest, contestParticipation, InsertContestParticipation, rewards, InsertReward, userRewards, InsertUserReward, dailyCheckIns, InsertDailyCheckIn, termsVersions, InsertTermsVersion, userTermsAcceptance, InsertUserTermsAcceptance, emailVerificationCodes, InsertEmailVerificationCode, nervousSystemStates, InsertNervousSystemState, decisionTreeSessions, InsertDecisionTreeSession, characterPicks, InsertCharacterPick, weeklyCharacterPicks, InsertWeeklyCharacterPick } from "../drizzle/schema";
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


// ============ EMAIL VERIFICATION FUNCTIONS ============

export async function createEmailVerificationCode(userId: number, email: string): Promise<string> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  // Generate 6-digit code
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  
  // Code expires in 10 minutes
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
  
  await db.insert(emailVerificationCodes).values({
    userId,
    email,
    code,
    expiresAt,
  });
  
  return code;
}

export async function verifyEmailCode(userId: number, code: string): Promise<boolean> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.select().from(emailVerificationCodes)
    .where(and(
      eq(emailVerificationCodes.userId, userId),
      eq(emailVerificationCodes.code, code),
      gte(emailVerificationCodes.expiresAt, new Date())
    ))
    .limit(1);
  
  if (result.length === 0) return false;
  
  // Mark as verified
  await db.update(emailVerificationCodes)
    .set({ verified: 1 })
    .where(eq(emailVerificationCodes.id, result[0].id));
  
  return true;
}

export async function getLatestVerifiedEmail(userId: number): Promise<string | null> {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.select().from(emailVerificationCodes)
    .where(and(
      eq(emailVerificationCodes.userId, userId),
      eq(emailVerificationCodes.verified, 1)
    ))
    .orderBy(desc(emailVerificationCodes.createdAt))
    .limit(1);
  
  return result.length > 0 ? result[0].email : null;
}

// ============ TERMS VERSION FUNCTIONS ============
export async function createTermsVersion(data: InsertTermsVersion) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(termsVersions).values(data);
  return result;
}

export async function getLatestTermsVersion() {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.select().from(termsVersions)
    .orderBy(desc(termsVersions.effectiveDate))
    .limit(1);
  
  return result.length > 0 ? result[0] : null;
}

export async function getTermsVersionById(id: number) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.select().from(termsVersions)
    .where(eq(termsVersions.id, id))
    .limit(1);
  
  return result.length > 0 ? result[0] : null;
}

export async function recordTermsAcceptance(userId: number, termsVersionId: number, ipAddress?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(userTermsAcceptance).values({
    userId,
    termsVersionId,
    ipAddress,
  });
}

export async function getUserLatestTermsAcceptance(userId: number) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.select().from(userTermsAcceptance)
    .where(eq(userTermsAcceptance.userId, userId))
    .orderBy(desc(userTermsAcceptance.acceptedAt))
    .limit(1);
  
  return result.length > 0 ? result[0] : null;
}

export async function hasUserAcceptedTermsVersion(userId: number, termsVersionId: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;
  
  const result = await db.select().from(userTermsAcceptance)
    .where(and(
      eq(userTermsAcceptance.userId, userId),
      eq(userTermsAcceptance.termsVersionId, termsVersionId)
    ))
    .limit(1);
  
  return result.length > 0;
}


// Decision Tree functions

export async function recordNervousSystemState(userId: number, state: "squirrel" | "tired" | "focused" | "hurting", description?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(nervousSystemStates).values({
    userId,
    state,
    description,
    recordedAt: new Date(),
  });
}

export async function getLatestNervousSystemState(userId: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.select()
    .from(nervousSystemStates)
    .where(eq(nervousSystemStates.userId, userId))
    .orderBy(desc(nervousSystemStates.recordedAt))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

export async function createDecisionTreeSession(session: InsertDecisionTreeSession) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(decisionTreeSessions).values(session);
  return result;
}

export async function getDecisionTreeSession(sessionId: number, userId: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.select()
    .from(decisionTreeSessions)
    .where(and(
      eq(decisionTreeSessions.id, sessionId),
      eq(decisionTreeSessions.userId, userId)
    ))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

export async function getTasksByActivationEnergy(userId: number, activationEnergy: "micro" | "easy" | "medium" | "deep") {
  const db = await getDb();
  if (!db) return [];

  return await db.select()
    .from(tasks)
    .where(and(
      eq(tasks.userId, userId),
      eq(tasks.completed, 0),
      eq(tasks.activationEnergy, activationEnergy)
    ))
    .orderBy(desc(tasks.createdAt));
}

export async function getTasksByState(userId: number, state: string) {
  const db = await getDb();
  if (!db) return [];

  return await db.select()
    .from(tasks)
    .where(and(
      eq(tasks.userId, userId),
      eq(tasks.completed, 0),
      eq(tasks.recommendedState, state)
    ))
    .orderBy(desc(tasks.createdAt));
}

export async function getTasksBySequenceGroup(userId: number, sequenceGroup: string) {
  const db = await getDb();
  if (!db) return [];

  return await db.select()
    .from(tasks)
    .where(and(
      eq(tasks.userId, userId),
      eq(tasks.completed, 0),
      eq(tasks.sequenceGroup, sequenceGroup)
    ))
    .orderBy(tasks.sequenceOrder);
}


// ============ PICK & WIN FUNCTIONS ============

export async function createCharacterPick(pick: InsertCharacterPick) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(characterPicks).values(pick);
  return pick;
}

export async function getCharacterPickHistory(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(characterPicks).where(eq(characterPicks.userId, userId));
}

export async function getWeeklyCharacterPick(userId: number, weekStartDate: string) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.select().from(weeklyCharacterPicks)
    .where(and(
      eq(weeklyCharacterPicks.userId, userId),
      eq(weeklyCharacterPicks.weekStartDate, weekStartDate)
    ))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

export async function createWeeklyCharacterPick(pick: InsertWeeklyCharacterPick) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(weeklyCharacterPicks).values(pick);
  return pick;
}
