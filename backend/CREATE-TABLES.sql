-- Create `users` table
CREATE TABLE `users` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `realname` varchar(45) NOT NULL,
  `phone_number` int(11) NOT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `phone_number_UNIQUE` (`phone_number`)
) 
ENGINE=InnoDB 
AUTO_INCREMENT=19 
DEFAULT CHARSET=utf8mb4 
COLLATE=utf8mb4_general_ci;

-- Create `bets` table
CREATE TABLE `bets` (
  `bet_id` int(11) NOT NULL AUTO_INCREMENT,
  `text` varchar(255) NOT NULL,
  `betamount` varchar(50) NOT NULL,
  `startdate` varchar(45) NOT NULL,
  `enddate` varchar(50) NOT NULL,
  `bettor_id` varchar(100) NOT NULL,
  `conditionals` varchar(255) NOT NULL,
  `likes` int(11) DEFAULT 0,
  PRIMARY KEY (`bet_id`)
) 
ENGINE=InnoDB 
AUTO_INCREMENT=65 
DEFAULT CHARSET=utf8mb4 
COLLATE=utf8mb4_general_ci;

-- Create `betaccepts` table
CREATE TABLE `betaccepts` (
  `accept_id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `bet_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  PRIMARY KEY (`accept_id`),
  UNIQUE KEY `betid` (`bet_id`, `user_id`),
  KEY `betaccepts_ibfk_2` (`user_id`),
  CONSTRAINT `betaccepts_ibfk_1` 
    FOREIGN KEY (`bet_id`) 
    REFERENCES `bets` (`bet_id`) 
    ON DELETE CASCADE,
  CONSTRAINT `betaccepts_ibfk_2` 
    FOREIGN KEY (`user_id`) 
    REFERENCES `users` (`user_id`) 
    ON DELETE CASCADE
) 
ENGINE=InnoDB 
AUTO_INCREMENT=50 
DEFAULT CHARSET=utf8mb4 
COLLATE=utf8mb4_general_ci;

-- Create `betlikes` table
CREATE TABLE `betlikes` (
  `like_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `bet_id` int(11) NOT NULL,
  `like_timestamp` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`like_id`),
  UNIQUE KEY `user_id` (`user_id`, `bet_id`),
  KEY `bet_id` (`bet_id`),
  CONSTRAINT `betlikes_ibfk_1` 
    FOREIGN KEY (`user_id`) 
    REFERENCES `users` (`user_id`) 
    ON DELETE CASCADE,
  CONSTRAINT `betlikes_ibfk_2` 
    FOREIGN KEY (`bet_id`) 
    REFERENCES `bets` (`bet_id`) 
    ON DELETE CASCADE
) 
ENGINE=InnoDB 
AUTO_INCREMENT=157 
DEFAULT CHARSET=utf8mb4 
COLLATE=utf8mb4_general_ci;
