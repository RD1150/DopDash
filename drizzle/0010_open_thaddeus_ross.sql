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
ALTER TABLE `coachConversations` ADD CONSTRAINT `coachConversations_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `userTechniqueEffectiveness` ADD CONSTRAINT `userTechniqueEffectiveness_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;