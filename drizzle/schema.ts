import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, json } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * User profile and game state
 */
export const userProfiles = mysqlTable("userProfiles", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  
  // Game progression
  xp: int("xp").notNull().default(0),
  level: int("level").notNull().default(1),
  coins: int("coins").notNull().default(0),
  
  // Streak tracking
  currentStreak: int("currentStreak").notNull().default(0),
  longestStreak: int("longestStreak").notNull().default(0),
  lastActiveDate: varchar("lastActiveDate", { length: 10 }), // YYYY-MM-DD format
  vacationModeActive: int("vacationModeActive").notNull().default(0), // 0 or 1 for boolean
  vacationModeStartDate: varchar("vacationModeStartDate", { length: 10 }),
  
  // Onboarding state
  hasCompletedOnboarding: int("hasCompletedOnboarding").notNull().default(0), // 0 or 1 for boolean
  selectedFlavor: varchar("selectedFlavor", { length: 20 }).default("gentle"),
  selectedContext: varchar("selectedContext", { length: 20 }).default("nest"),
  selectedTheme: varchar("selectedTheme", { length: 20 }).default("default"),
  
  // Mascot state
  mascotMood: varchar("mascotMood", { length: 20 }).default("neutral"),
  lastPetTime: timestamp("lastPetTime"),
  lastFeedTime: timestamp("lastFeedTime"),
  
  // Purchased items (JSON array of item IDs)
  purchasedItems: json("purchasedItems").$type<string[]>(),
  equippedAccessories: json("equippedAccessories").$type<string[]>(),
  
  // Settings
  soundEnabled: int("soundEnabled").notNull().default(1), // 0 or 1 for boolean
  soundTheme: varchar("soundTheme", { length: 20 }).default("default"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type UserProfile = typeof userProfiles.$inferSelect;
export type InsertUserProfile = typeof userProfiles.$inferInsert;

/**
 * Tasks (both Quick Wins and Boss Battles)
 */
export const tasks = mysqlTable("tasks", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  
  title: text("title").notNull(),
  type: mysqlEnum("type", ["quick", "boss"]).notNull(),
  category: varchar("category", { length: 50 }), // work, home, self, family
  
  // Boss Battle specific
  subtasks: json("subtasks").$type<Array<{ id: string; text: string; completed: boolean }>>(),
  
  completed: int("completed").notNull().default(0), // 0 or 1 for boolean
  completedAt: timestamp("completedAt"),
  
  // Rewards
  xpReward: int("xpReward").notNull().default(10),
  coinReward: int("coinReward").notNull().default(5),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Task = typeof tasks.$inferSelect;
export type InsertTask = typeof tasks.$inferInsert;

/**
 * Journal entries (completed task history)
 */
export const journalEntries = mysqlTable("journalEntries", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  
  taskTitle: text("taskTitle").notNull(),
  taskType: varchar("taskType", { length: 20 }).notNull(),
  xpEarned: int("xpEarned").notNull(),
  coinEarned: int("coinEarned").notNull(),
  
  completedAt: timestamp("completedAt").notNull(),
  date: varchar("date", { length: 10 }).notNull(), // YYYY-MM-DD for easy querying
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type JournalEntry = typeof journalEntries.$inferSelect;
export type InsertJournalEntry = typeof journalEntries.$inferInsert;

/**
 * Daily affirmations shown to users
 */
export const dailyAffirmations = mysqlTable("dailyAffirmations", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  
  message: text("message").notNull(),
  shownDate: varchar("shownDate", { length: 10 }).notNull(), // YYYY-MM-DD
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type DailyAffirmation = typeof dailyAffirmations.$inferSelect;
export type InsertDailyAffirmation = typeof dailyAffirmations.$inferInsert;