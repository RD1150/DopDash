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
ALTER TABLE `characterPicks` ADD CONSTRAINT `characterPicks_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `weeklyCharacterPicks` ADD CONSTRAINT `weeklyCharacterPicks_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;