ALTER TABLE `users` ADD `isPremium` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `stripeCustomerId` varchar(255);