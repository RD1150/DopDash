CREATE TABLE `feedbacks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`type` enum('bug','feature','general') NOT NULL,
	`message` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `feedbacks_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `feedbacks` ADD CONSTRAINT `feedbacks_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;