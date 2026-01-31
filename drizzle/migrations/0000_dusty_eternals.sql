CREATE TABLE `abTestVariants` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`coachVariant` enum('control','treatment') NOT NULL DEFAULT 'control',
	`coachVariantAssignedAt` timestamp NOT NULL DEFAULT (now()),
	`d1Completed` int NOT NULL DEFAULT 0,
	`d7Completed` int NOT NULL DEFAULT 0,
	`d30Completed` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `abTestVariants_id` PRIMARY KEY(`id`),
	CONSTRAINT `abTestVariants_userId_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
CREATE TABLE `characterPicks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`character` enum('focused','energized','creative','chill') NOT NULL,
	`discountPercent` int NOT NULL,
	`discountCode` varchar(50) NOT NULL,
	`pickedAt` timestamp NOT NULL DEFAULT (now()),
	`usedAt` timestamp,
	`expiresAt` timestamp NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `characterPicks_id` PRIMARY KEY(`id`),
	CONSTRAINT `characterPicks_discountCode_unique` UNIQUE(`discountCode`)
);
--> statement-breakpoint
CREATE TABLE `coachConversations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`nervousSystemState` enum('squirrel','tired','focused','hurting') NOT NULL,
	`userMessage` text NOT NULL,
	`coachMessage` text NOT NULL,
	`suggestedTechniqueId` varchar(100),
	`suggestedTechniqueName` varchar(255),
	`techniqueHelpfulRating` int,
	`techniqueNotes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `coachConversations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `coinPurchases` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`packageId` varchar(50) NOT NULL,
	`coinsAmount` int NOT NULL,
	`priceInCents` int NOT NULL,
	`stripePaymentIntentId` varchar(255) NOT NULL,
	`stripeSessionId` varchar(255),
	`status` enum('pending','completed','failed','refunded') NOT NULL DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`completedAt` timestamp,
	CONSTRAINT `coinPurchases_id` PRIMARY KEY(`id`),
	CONSTRAINT `coinPurchases_stripePaymentIntentId_unique` UNIQUE(`stripePaymentIntentId`)
);
--> statement-breakpoint
CREATE TABLE `contestParticipation` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`contestId` int NOT NULL,
	`progress` int NOT NULL DEFAULT 0,
	`completed` int NOT NULL DEFAULT 0,
	`rewardClaimed` int NOT NULL DEFAULT 0,
	`joinedAt` timestamp NOT NULL DEFAULT (now()),
	`completedAt` timestamp,
	CONSTRAINT `contestParticipation_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `contests` (
	`id` int AUTO_INCREMENT NOT NULL,
	`type` enum('weekly','daily','community','friends') NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`target` int NOT NULL,
	`reward` int NOT NULL,
	`startDate` timestamp NOT NULL,
	`endDate` timestamp NOT NULL,
	`active` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `contests_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `dailyAffirmations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`message` text NOT NULL,
	`shownDate` varchar(10) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `dailyAffirmations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `dailyCheckIns` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`date` varchar(10) NOT NULL,
	`energyLevel` enum('low','medium','high'),
	`vibe` enum('anxious','bored','overwhelmed','energized'),
	`need` enum('quick-wins','deep-focus','movement','rest'),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `dailyCheckIns_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `decisionTreeSessions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`timeAvailable` varchar(20) NOT NULL,
	`userState` varchar(20) NOT NULL,
	`activityPreference` varchar(50),
	`brainDumpTasks` json,
	`sequencedTasks` json,
	`completedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `decisionTreeSessions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `emailVerificationCodes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`email` varchar(320) NOT NULL,
	`code` varchar(6) NOT NULL,
	`verified` int NOT NULL DEFAULT 0,
	`expiresAt` timestamp NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `emailVerificationCodes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `feedbacks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`type` enum('bug','feature','general') NOT NULL,
	`message` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `feedbacks_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `habitCompletions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`habitId` int NOT NULL,
	`userId` int NOT NULL,
	`completedAt` timestamp NOT NULL,
	`date` varchar(10) NOT NULL,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `habitCompletions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `habits` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`frequency` enum('daily','weekly','custom') NOT NULL DEFAULT 'daily',
	`targetCount` int NOT NULL DEFAULT 1,
	`currentStreak` int NOT NULL DEFAULT 0,
	`longestStreak` int NOT NULL DEFAULT 0,
	`lastCompletedDate` varchar(10),
	`isActive` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `habits_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `journalEntries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`taskTitle` text NOT NULL,
	`taskType` varchar(20) NOT NULL,
	`xpEarned` int NOT NULL,
	`coinEarned` int NOT NULL,
	`completedAt` timestamp NOT NULL,
	`date` varchar(10) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `journalEntries_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `leaderboardEntries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`currentStreak` int NOT NULL DEFAULT 0,
	`totalTasksCompleted` int NOT NULL DEFAULT 0,
	`totalCoins` int NOT NULL DEFAULT 0,
	`globalRank` int,
	`weeklyRank` int,
	`lastUpdated` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `leaderboardEntries_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `moodEntries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`moodLevel` int NOT NULL,
	`energyLevel` enum('low','medium','high') NOT NULL,
	`notes` text,
	`date` varchar(10) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `moodEntries_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `nervousSystemStates` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`state` enum('squirrel','tired','focused','hurting') NOT NULL,
	`description` text,
	`recordedAt` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `nervousSystemStates_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `referrals` (
	`id` int AUTO_INCREMENT NOT NULL,
	`referrerId` int NOT NULL,
	`referredUserId` int NOT NULL,
	`referralCode` varchar(50) NOT NULL,
	`bonusCoinsAwarded` int NOT NULL DEFAULT 0,
	`referrerBonusCoins` int NOT NULL DEFAULT 50,
	`referredBonusCoins` int NOT NULL DEFAULT 25,
	`isActive` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`claimedAt` timestamp,
	`bonusAwardedAt` timestamp,
	CONSTRAINT `referrals_id` PRIMARY KEY(`id`),
	CONSTRAINT `referrals_referralCode_unique` UNIQUE(`referralCode`)
);
--> statement-breakpoint
CREATE TABLE `retentionMetrics` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`cohortDate` varchar(10) NOT NULL,
	`lastActiveDate` varchar(10) NOT NULL,
	`daysSinceSignup` int NOT NULL,
	`tasksCompletedOnDay` int NOT NULL DEFAULT 0,
	`usedBrainCheck` int NOT NULL DEFAULT 0,
	`usedCoach` int NOT NULL DEFAULT 0,
	`usedFocusMode` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `retentionMetrics_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `rewards` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`emoji` varchar(10),
	`type` enum('gif','sticker','badge') NOT NULL,
	`rarity` enum('common','rare','epic','legendary') NOT NULL,
	`cost` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `rewards_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tasks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`title` text NOT NULL,
	`type` enum('quick','boss') NOT NULL,
	`category` varchar(50),
	`durationMinutes` int NOT NULL DEFAULT 5,
	`subtasks` json,
	`completed` int NOT NULL DEFAULT 0,
	`completedAt` timestamp,
	`xpReward` int NOT NULL DEFAULT 10,
	`coinReward` int NOT NULL DEFAULT 5,
	`sequenceGroup` varchar(100),
	`sequenceOrder` int,
	`activationEnergy` enum('micro','easy','medium','deep') DEFAULT 'easy',
	`recommendedState` varchar(50),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `tasks_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `techniqueRatings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`techniqueId` varchar(100) NOT NULL,
	`techniqueName` varchar(255) NOT NULL,
	`nervousSystemState` enum('squirrel','tired','focused','hurting') NOT NULL,
	`rating` int NOT NULL,
	`feedback` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `techniqueRatings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `termsVersions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`version` varchar(20) NOT NULL,
	`title` varchar(255) NOT NULL,
	`content` text NOT NULL,
	`effectiveDate` timestamp NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `termsVersions_id` PRIMARY KEY(`id`),
	CONSTRAINT `termsVersions_version_unique` UNIQUE(`version`)
);
--> statement-breakpoint
CREATE TABLE `userProfiles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`xp` int NOT NULL DEFAULT 0,
	`level` int NOT NULL DEFAULT 1,
	`coins` int NOT NULL DEFAULT 0,
	`currentStreak` int NOT NULL DEFAULT 0,
	`longestStreak` int NOT NULL DEFAULT 0,
	`lastActiveDate` varchar(10),
	`vacationModeActive` int NOT NULL DEFAULT 0,
	`vacationModeStartDate` varchar(10),
	`hasCompletedOnboarding` int NOT NULL DEFAULT 0,
	`selectedFlavor` varchar(20) DEFAULT 'gentle',
	`selectedContext` varchar(20) DEFAULT 'nest',
	`selectedTheme` varchar(20) DEFAULT 'default',
	`mascotMood` varchar(20) DEFAULT 'neutral',
	`lastPetTime` timestamp,
	`lastFeedTime` timestamp,
	`purchasedItems` json,
	`equippedAccessories` json,
	`soundEnabled` int NOT NULL DEFAULT 1,
	`soundTheme` varchar(20) DEFAULT 'default',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `userProfiles_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `userRewards` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`rewardId` int NOT NULL,
	`owned` int NOT NULL DEFAULT 1,
	`unlockedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `userRewards_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `userStats` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`date` varchar(10) NOT NULL,
	`tasksCompleted` int NOT NULL DEFAULT 0,
	`habitsCompleted` int NOT NULL DEFAULT 0,
	`currentStreak` int NOT NULL DEFAULT 0,
	`moodAverage` int,
	`energyAverage` varchar(20),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `userStats_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `userTechniqueEffectiveness` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`techniqueId` varchar(100) NOT NULL,
	`techniqueName` varchar(255) NOT NULL,
	`techniqueCategory` enum('grounding','motivation','breakdown','cognitive','emotion') NOT NULL,
	`timesUsed` int NOT NULL DEFAULT 0,
	`averageRating` decimal(3,2) NOT NULL DEFAULT '0',
	`totalRatings` int NOT NULL DEFAULT 0,
	`effectiveForSquirrel` int NOT NULL DEFAULT 0,
	`effectiveForTired` int NOT NULL DEFAULT 0,
	`effectiveForFocused` int NOT NULL DEFAULT 0,
	`effectiveForHurting` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `userTechniqueEffectiveness_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `userTermsAcceptance` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`termsVersionId` int NOT NULL,
	`acceptedAt` timestamp NOT NULL DEFAULT (now()),
	`ipAddress` varchar(45),
	CONSTRAINT `userTermsAcceptance_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`openId` varchar(64) NOT NULL,
	`name` text,
	`email` varchar(320),
	`loginMethod` varchar(64),
	`role` enum('user','admin') NOT NULL DEFAULT 'user',
	`isPremium` int NOT NULL DEFAULT 0,
	`stripeCustomerId` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`lastSignedIn` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_openId_unique` UNIQUE(`openId`)
);
--> statement-breakpoint
CREATE TABLE `weeklyCharacterPicks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`character` enum('focused','energized','creative','chill') NOT NULL,
	`bonusCoins` int NOT NULL DEFAULT 50,
	`pickedAt` timestamp NOT NULL DEFAULT (now()),
	`weekStartDate` varchar(10) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `weeklyCharacterPicks_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `abTestVariants` ADD CONSTRAINT `abTestVariants_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `characterPicks` ADD CONSTRAINT `characterPicks_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `coachConversations` ADD CONSTRAINT `coachConversations_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `coinPurchases` ADD CONSTRAINT `coinPurchases_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `contestParticipation` ADD CONSTRAINT `contestParticipation_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `contestParticipation` ADD CONSTRAINT `contestParticipation_contestId_contests_id_fk` FOREIGN KEY (`contestId`) REFERENCES `contests`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `dailyAffirmations` ADD CONSTRAINT `dailyAffirmations_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `dailyCheckIns` ADD CONSTRAINT `dailyCheckIns_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `decisionTreeSessions` ADD CONSTRAINT `decisionTreeSessions_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `emailVerificationCodes` ADD CONSTRAINT `emailVerificationCodes_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `feedbacks` ADD CONSTRAINT `feedbacks_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `habitCompletions` ADD CONSTRAINT `habitCompletions_habitId_habits_id_fk` FOREIGN KEY (`habitId`) REFERENCES `habits`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `habitCompletions` ADD CONSTRAINT `habitCompletions_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `habits` ADD CONSTRAINT `habits_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `journalEntries` ADD CONSTRAINT `journalEntries_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `leaderboardEntries` ADD CONSTRAINT `leaderboardEntries_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `moodEntries` ADD CONSTRAINT `moodEntries_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `nervousSystemStates` ADD CONSTRAINT `nervousSystemStates_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `referrals` ADD CONSTRAINT `referrals_referrerId_users_id_fk` FOREIGN KEY (`referrerId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `referrals` ADD CONSTRAINT `referrals_referredUserId_users_id_fk` FOREIGN KEY (`referredUserId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `retentionMetrics` ADD CONSTRAINT `retentionMetrics_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tasks` ADD CONSTRAINT `tasks_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `techniqueRatings` ADD CONSTRAINT `techniqueRatings_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `userProfiles` ADD CONSTRAINT `userProfiles_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `userRewards` ADD CONSTRAINT `userRewards_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `userRewards` ADD CONSTRAINT `userRewards_rewardId_rewards_id_fk` FOREIGN KEY (`rewardId`) REFERENCES `rewards`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `userStats` ADD CONSTRAINT `userStats_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `userTechniqueEffectiveness` ADD CONSTRAINT `userTechniqueEffectiveness_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `userTermsAcceptance` ADD CONSTRAINT `userTermsAcceptance_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `userTermsAcceptance` ADD CONSTRAINT `userTermsAcceptance_termsVersionId_termsVersions_id_fk` FOREIGN KEY (`termsVersionId`) REFERENCES `termsVersions`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `weeklyCharacterPicks` ADD CONSTRAINT `weeklyCharacterPicks_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;