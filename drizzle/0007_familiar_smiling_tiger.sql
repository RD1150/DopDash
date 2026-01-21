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
ALTER TABLE `tasks` ADD `activationEnergy` enum('micro','easy','medium','deep') DEFAULT 'easy';--> statement-breakpoint
ALTER TABLE `tasks` ADD `recommendedState` varchar(50);--> statement-breakpoint
ALTER TABLE `decisionTreeSessions` ADD CONSTRAINT `decisionTreeSessions_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `nervousSystemStates` ADD CONSTRAINT `nervousSystemStates_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;