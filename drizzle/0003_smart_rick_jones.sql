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
CREATE TABLE `userRewards` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`rewardId` int NOT NULL,
	`owned` int NOT NULL DEFAULT 1,
	`unlockedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `userRewards_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `contestParticipation` ADD CONSTRAINT `contestParticipation_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `contestParticipation` ADD CONSTRAINT `contestParticipation_contestId_contests_id_fk` FOREIGN KEY (`contestId`) REFERENCES `contests`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `dailyCheckIns` ADD CONSTRAINT `dailyCheckIns_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `leaderboardEntries` ADD CONSTRAINT `leaderboardEntries_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `userRewards` ADD CONSTRAINT `userRewards_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `userRewards` ADD CONSTRAINT `userRewards_rewardId_rewards_id_fk` FOREIGN KEY (`rewardId`) REFERENCES `rewards`(`id`) ON DELETE cascade ON UPDATE no action;