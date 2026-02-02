CREATE TABLE `autoDashSuggestions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`suggestedTaskId` int,
	`suggestedTaskTitle` text,
	`suggestedTaskDescription` text,
	`energyLevel` enum('low','medium','high'),
	`moodLevel` int,
	`timeAvailable` varchar(20),
	`accepted` int NOT NULL DEFAULT 0,
	`rejected` int NOT NULL DEFAULT 0,
	`completed` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`expiresAt` timestamp,
	CONSTRAINT `autoDashSuggestions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `premiumPreferences` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`lowEnergyTaskLength` int NOT NULL DEFAULT 5,
	`lowEnergyLanguageTone` enum('gentle','supportive','celebratory') NOT NULL DEFAULT 'gentle',
	`affirmationTone` enum('gentle','enthusiastic','playful') NOT NULL DEFAULT 'gentle',
	`feedbackIntensity` enum('minimal','moderate','full') NOT NULL DEFAULT 'moderate',
	`soundEnabled` int NOT NULL DEFAULT 1,
	`streakForgivenessUsesRemaining` int NOT NULL DEFAULT 3,
	`lastStreakForgiveness` timestamp,
	`showProductivityMetrics` int NOT NULL DEFAULT 0,
	`showMoodPatterns` int NOT NULL DEFAULT 1,
	`showEnergyPatterns` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `premiumPreferences_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `subscriptions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`tier` enum('free','premium') NOT NULL DEFAULT 'free',
	`stripeSubscriptionId` varchar(255),
	`status` enum('active','paused','canceled') NOT NULL DEFAULT 'active',
	`currentPeriodStart` timestamp,
	`currentPeriodEnd` timestamp,
	`canceledAt` timestamp,
	`autoDashEnabled` int NOT NULL DEFAULT 0,
	`lowEnergyModeEnabled` int NOT NULL DEFAULT 0,
	`streakForgivenessEnabled` int NOT NULL DEFAULT 0,
	`rewardCustomizationEnabled` int NOT NULL DEFAULT 0,
	`gentleInsightsEnabled` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `subscriptions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `upsellPrompts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`triggerType` enum('decision_fatigue','low_energy','streak_broken','no_progress','stuck_task') NOT NULL,
	`triggerDescription` text,
	`shown` int NOT NULL DEFAULT 0,
	`clicked` int NOT NULL DEFAULT 0,
	`dismissed` int NOT NULL DEFAULT 0,
	`featurePromoted` enum('auto_dash','low_energy_mode','streak_forgiveness','reward_customization','gentle_insights') NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `upsellPrompts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `autoDashSuggestions` ADD CONSTRAINT `autoDashSuggestions_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `autoDashSuggestions` ADD CONSTRAINT `autoDashSuggestions_suggestedTaskId_tasks_id_fk` FOREIGN KEY (`suggestedTaskId`) REFERENCES `tasks`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `premiumPreferences` ADD CONSTRAINT `premiumPreferences_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `subscriptions` ADD CONSTRAINT `subscriptions_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `upsellPrompts` ADD CONSTRAINT `upsellPrompts_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;