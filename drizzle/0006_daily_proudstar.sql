ALTER TABLE `tasks` ADD `durationMinutes` int DEFAULT 5 NOT NULL;--> statement-breakpoint
ALTER TABLE `tasks` ADD `sequenceGroup` varchar(100);--> statement-breakpoint
ALTER TABLE `tasks` ADD `sequenceOrder` int;