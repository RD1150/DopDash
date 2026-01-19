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
CREATE TABLE `termsVersions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`version` varchar(20) NOT NULL,
	`title` varchar(255) NOT NULL,
	`content` longtext NOT NULL,
	`effectiveDate` timestamp NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `termsVersions_id` PRIMARY KEY(`id`),
	CONSTRAINT `termsVersions_version_unique` UNIQUE(`version`)
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
ALTER TABLE `emailVerificationCodes` ADD CONSTRAINT `emailVerificationCodes_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `userTermsAcceptance` ADD CONSTRAINT `userTermsAcceptance_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `userTermsAcceptance` ADD CONSTRAINT `userTermsAcceptance_termsVersionId_termsVersions_id_fk` FOREIGN KEY (`termsVersionId`) REFERENCES `termsVersions`(`id`) ON DELETE restrict ON UPDATE no action;