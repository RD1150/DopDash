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
ALTER TABLE `abTestVariants` ADD CONSTRAINT `abTestVariants_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `retentionMetrics` ADD CONSTRAINT `retentionMetrics_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `techniqueRatings` ADD CONSTRAINT `techniqueRatings_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;