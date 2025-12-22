-- KarUCU Main Campus Database Schema
-- Clean schema for VPS deployment
-- Generated: December 2024

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

-- Database: `karumaincu_database`

-- --------------------------------------------------------
-- Table: users (CORE - must be created first)
-- --------------------------------------------------------
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `registration_number` varchar(20) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `member_type` enum('student','associate') NOT NULL,
  `role` enum('member','editor','admin') DEFAULT 'member',
  `status` enum('active','inactive','pending') DEFAULT 'pending',
  `course` varchar(255) DEFAULT NULL,
  `year_of_study` int(11) DEFAULT NULL,
  `staff_id` varchar(50) DEFAULT NULL,
  `alumni_year` int(11) DEFAULT NULL,
  `doctrinal_agreement` tinyint(1) DEFAULT 0,
  `profile_image` varchar(255) DEFAULT NULL,
  `reset_token` varchar(255) DEFAULT NULL,
  `reset_token_expiry` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `last_login` timestamp NULL DEFAULT NULL,
  `profile_complete` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `registration_number` (`registration_number`),
  UNIQUE KEY `email` (`email`),
  KEY `idx_status` (`status`),
  KEY `idx_role_status` (`role`,`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Table: announcements
-- --------------------------------------------------------
CREATE TABLE `announcements` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `category` enum('general','urgent','event') DEFAULT 'general',
  `priority` enum('low','medium','high') DEFAULT 'medium',
  `status` enum('draft','published','archived') DEFAULT 'draft',
  `featured_image` varchar(255) DEFAULT NULL,
  `scheduled_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_by` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `fk_announcement_creator` (`created_by`),
  CONSTRAINT `fk_announcement_creator` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Table: blogs
-- --------------------------------------------------------
CREATE TABLE `blogs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `content` longtext NOT NULL,
  `excerpt` text DEFAULT NULL,
  `featured_image` varchar(255) DEFAULT NULL,
  `category` varchar(100) DEFAULT NULL,
  `tags` longtext DEFAULT NULL,
  `status` enum('draft','pending','approved','rejected') DEFAULT 'draft',
  `rejection_reason` text DEFAULT NULL,
  `slug` varchar(255) DEFAULT NULL,
  `view_count` int(11) DEFAULT 0,
  `author_id` int(11) NOT NULL,
  `approved_by` int(11) DEFAULT NULL,
  `approved_at` timestamp NULL DEFAULT NULL,
  `published_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  KEY `idx_status` (`status`),
  KEY `idx_author_status` (`author_id`,`status`),
  CONSTRAINT `fk_blog_author` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_blog_approver` FOREIGN KEY (`approved_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Table: blog_comments
-- --------------------------------------------------------
CREATE TABLE `blog_comments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `post_id` int(11) NOT NULL,
  `author_id` int(11) DEFAULT NULL,
  `author_name` varchar(100) DEFAULT NULL,
  `author_email` varchar(100) DEFAULT NULL,
  `content` text NOT NULL,
  `parent_id` int(11) DEFAULT NULL,
  `status` enum('pending','approved','rejected') DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_post` (`post_id`),
  KEY `idx_status` (`status`),
  CONSTRAINT `fk_blog_comment_post` FOREIGN KEY (`post_id`) REFERENCES `blogs` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_blog_comment_author` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Table: blog_categories
-- --------------------------------------------------------
CREATE TABLE `blog_categories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `slug` varchar(100) NOT NULL,
  `color` varchar(7) DEFAULT '#6366f1',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Table: events
-- --------------------------------------------------------
CREATE TABLE `events` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `event_date` datetime NOT NULL,
  `end_date` datetime DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `venue_details` text DEFAULT NULL,
  `capacity` int(11) DEFAULT 0,
  `registration_required` tinyint(1) DEFAULT 0,
  `registration_deadline` datetime DEFAULT NULL,
  `featured_image` varchar(255) DEFAULT NULL,
  `category` varchar(100) DEFAULT NULL,
  `status` enum('draft','published','cancelled','completed') DEFAULT 'draft',
  `created_by` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_event_date` (`event_date`),
  KEY `idx_status` (`status`),
  CONSTRAINT `fk_event_creator` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Table: event_registrations
-- --------------------------------------------------------
CREATE TABLE `event_registrations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `event_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `registration_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `attendance_status` enum('registered','attended','absent','cancelled') DEFAULT 'registered',
  `notes` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_event_user` (`event_id`,`user_id`),
  CONSTRAINT `fk_event_registration_event` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_event_registration_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Table: sermons
-- --------------------------------------------------------
CREATE TABLE `sermons` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `youtube_url` varchar(500) NOT NULL,
  `youtube_id` varchar(50) DEFAULT NULL,
  `thumbnail_url` varchar(500) DEFAULT NULL,
  `speaker` varchar(255) DEFAULT NULL,
  `sermon_date` date DEFAULT NULL,
  `series_name` varchar(255) DEFAULT NULL,
  `scripture_reference` varchar(255) DEFAULT NULL,
  `duration` int(11) DEFAULT NULL,
  `view_count` int(11) DEFAULT 0,
  `featured` tinyint(1) DEFAULT 0,
  `status` enum('draft','published','archived') DEFAULT 'draft',
  `created_by` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_sermon_date` (`sermon_date`),
  KEY `idx_status` (`status`),
  CONSTRAINT `fk_sermon_creator` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Table: galleries
-- --------------------------------------------------------
CREATE TABLE `galleries` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `url` varchar(500) NOT NULL,
  `category` enum('worship','fellowship','outreach','events','conferences','other') DEFAULT 'other',
  `thumbnail_url` varchar(500) DEFAULT NULL,
  `platform` enum('google_photos','google_drive','dropbox','onedrive','other') DEFAULT 'other',
  `is_active` tinyint(1) DEFAULT 1,
  `view_count` int(11) DEFAULT 0,
  `created_by` int(11) NOT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_category` (`category`),
  KEY `idx_is_active` (`is_active`),
  CONSTRAINT `galleries_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `galleries_ibfk_2` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Table: leaders
-- --------------------------------------------------------
CREATE TABLE `leaders` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `full_name` varchar(255) NOT NULL,
  `position` varchar(255) NOT NULL,
  `bio` text DEFAULT NULL,
  `photo_url` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `display_order` int(11) DEFAULT 0,
  `status` enum('active','inactive') DEFAULT 'active',
  `term_start` date DEFAULT NULL,
  `term_end` date DEFAULT NULL,
  `created_by` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_status` (`status`),
  CONSTRAINT `fk_leader_creator` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Table: leader_elections
-- --------------------------------------------------------
CREATE TABLE `leader_elections` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `start_date` datetime NOT NULL,
  `end_date` datetime NOT NULL,
  `status` enum('draft','open','closed','archived') DEFAULT 'draft',
  `max_nominations_per_member` int(11) DEFAULT 5,
  `created_by` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_status` (`status`),
  CONSTRAINT `fk_election_creator` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Table: election_positions
-- --------------------------------------------------------
CREATE TABLE `election_positions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `election_id` int(11) NOT NULL,
  `title` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `display_order` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_election` (`election_id`),
  CONSTRAINT `fk_position_election` FOREIGN KEY (`election_id`) REFERENCES `leader_elections` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Table: leader_nominations
-- --------------------------------------------------------
CREATE TABLE `leader_nominations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `election_id` int(11) NOT NULL,
  `nominator_id` int(11) NOT NULL,
  `nominee_id` int(11) NOT NULL,
  `position` varchar(100) DEFAULT NULL,
  `reason` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_nomination` (`election_id`,`nominator_id`,`nominee_id`),
  CONSTRAINT `fk_nomination_election` FOREIGN KEY (`election_id`) REFERENCES `leader_elections` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_nomination_nominator` FOREIGN KEY (`nominator_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_nomination_nominee` FOREIGN KEY (`nominee_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Table: study_locations
-- --------------------------------------------------------
CREATE TABLE `study_locations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `capacity` int(11) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Table: bible_study_sessions
-- --------------------------------------------------------
CREATE TABLE `bible_study_sessions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `registration_deadline` datetime NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date DEFAULT NULL,
  `is_open` tinyint(1) DEFAULT 1,
  `max_participants` int(11) DEFAULT NULL,
  `created_by` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_sessions_open` (`is_open`),
  CONSTRAINT `bible_study_sessions_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Table: bible_study_registrations
-- --------------------------------------------------------
CREATE TABLE `bible_study_registrations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `session_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `location_id` int(11) NOT NULL,
  `year_of_study` varchar(50) NOT NULL,
  `school` varchar(255) NOT NULL,
  `registration_number` varchar(50) DEFAULT NULL,
  `status` enum('pending','approved','rejected') DEFAULT 'pending',
  `group_number` int(11) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `registered_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_registration` (`session_id`,`user_id`),
  CONSTRAINT `bible_study_registrations_ibfk_1` FOREIGN KEY (`session_id`) REFERENCES `bible_study_sessions` (`id`) ON DELETE CASCADE,
  CONSTRAINT `bible_study_registrations_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `bible_study_registrations_ibfk_3` FOREIGN KEY (`location_id`) REFERENCES `study_locations` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Table: bible_reading_calendar
-- --------------------------------------------------------
CREATE TABLE `bible_reading_calendar` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `month` int(11) NOT NULL,
  `year` int(11) NOT NULL,
  `day` int(11) NOT NULL,
  `book` varchar(100) NOT NULL,
  `chapter_start` int(11) NOT NULL,
  `chapter_end` int(11) DEFAULT NULL,
  `verse_start` int(11) DEFAULT NULL,
  `verse_end` int(11) DEFAULT NULL,
  `devotional_note` text DEFAULT NULL,
  `created_by` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_date` (`year`,`month`,`day`),
  CONSTRAINT `fk_reading_calendar_creator` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Table: verse_of_day
-- --------------------------------------------------------
CREATE TABLE `verse_of_day` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `verse_reference` varchar(255) NOT NULL,
  `verse_text` text NOT NULL,
  `commentary` text DEFAULT NULL,
  `date` date NOT NULL,
  `auto_generated` tinyint(1) DEFAULT 0,
  `created_by` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_date` (`date`),
  KEY `idx_date` (`date`),
  CONSTRAINT `fk_verse_creator` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Table: prayer_requests (public)
-- --------------------------------------------------------
CREATE TABLE `prayer_requests` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `category` varchar(100) DEFAULT NULL,
  `is_public` tinyint(1) DEFAULT 1,
  `is_anonymous` tinyint(1) DEFAULT 0,
  `status` enum('active','answered','archived') DEFAULT 'active',
  `requester_id` int(11) DEFAULT NULL,
  `answered_at` timestamp NULL DEFAULT NULL,
  `testimony` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_status` (`status`),
  CONSTRAINT `fk_prayer_request_requester` FOREIGN KEY (`requester_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Table: user_prayer_requests (personal prayer journal)
-- --------------------------------------------------------
CREATE TABLE `user_prayer_requests` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `category` varchar(100) DEFAULT 'personal',
  `priority` enum('low','medium','high') DEFAULT 'medium',
  `status` enum('active','answered','archived') DEFAULT 'active',
  `is_private` tinyint(1) DEFAULT 1,
  `answered_at` timestamp NULL DEFAULT NULL,
  `testimony` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_user_status` (`user_id`,`status`),
  CONSTRAINT `fk_user_prayer_request_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Table: donations
-- --------------------------------------------------------
CREATE TABLE `donations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `donor_id` int(11) DEFAULT NULL,
  `donor_name` varchar(100) DEFAULT NULL,
  `donor_email` varchar(100) DEFAULT NULL,
  `amount` decimal(10,2) NOT NULL,
  `currency` varchar(3) DEFAULT 'KES',
  `category_id` int(11) DEFAULT NULL,
  `payment_method` enum('mpesa','bank_transfer','cash','other') DEFAULT 'mpesa',
  `transaction_reference` varchar(100) DEFAULT NULL,
  `status` enum('pending','completed','failed','refunded') DEFAULT 'pending',
  `anonymous` tinyint(1) DEFAULT 0,
  `message` text DEFAULT NULL,
  `donation_date` date DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_status` (`status`),
  CONSTRAINT `fk_donation_donor` FOREIGN KEY (`donor_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Table: ministries
-- --------------------------------------------------------
CREATE TABLE `ministries` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `leader_id` int(11) DEFAULT NULL,
  `assistant_leader_id` int(11) DEFAULT NULL,
  `status` enum('active','inactive') DEFAULT 'active',
  `meeting_day` enum('Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday') DEFAULT NULL,
  `meeting_time` time DEFAULT NULL,
  `meeting_location` varchar(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_status` (`status`),
  CONSTRAINT `fk_ministry_leader` FOREIGN KEY (`leader_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_ministry_assistant_leader` FOREIGN KEY (`assistant_leader_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Table: ministry_members
-- --------------------------------------------------------
CREATE TABLE `ministry_members` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ministry_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `position` enum('member','coordinator','assistant') DEFAULT 'member',
  `joined_date` date DEFAULT NULL,
  `status` enum('active','inactive') DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_ministry_user` (`ministry_id`,`user_id`),
  CONSTRAINT `fk_ministry_member_ministry` FOREIGN KEY (`ministry_id`) REFERENCES `ministries` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_ministry_member_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Table: password_reset_tokens
-- --------------------------------------------------------
CREATE TABLE `password_reset_tokens` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `token` varchar(255) NOT NULL,
  `expires_at` timestamp NOT NULL,
  `used` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_token` (`token`),
  CONSTRAINT `fk_password_reset_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Table: email_verification_tokens
-- --------------------------------------------------------
CREATE TABLE `email_verification_tokens` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `token` varchar(255) NOT NULL,
  `expires_at` timestamp NOT NULL,
  `verified` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_token` (`token`),
  CONSTRAINT `fk_email_verification_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- View: nomination_results
-- --------------------------------------------------------
CREATE VIEW `nomination_results` AS 
SELECT 
  `ln`.`election_id`,
  `ln`.`nominee_id`,
  `u`.`full_name` AS `nominee_name`,
  `u`.`email` AS `nominee_email`,
  `u`.`registration_number`,
  `u`.`course`,
  `u`.`year_of_study`,
  COUNT(`ln`.`id`) AS `nomination_count`,
  GROUP_CONCAT(DISTINCT `ln`.`position` SEPARATOR ', ') AS `suggested_positions`
FROM `leader_nominations` `ln`
JOIN `users` `u` ON `ln`.`nominee_id` = `u`.`id`
GROUP BY `ln`.`election_id`, `ln`.`nominee_id`, `u`.`full_name`, `u`.`email`, `u`.`registration_number`, `u`.`course`, `u`.`year_of_study`
ORDER BY COUNT(`ln`.`id`) DESC;

-- --------------------------------------------------------
-- Default Data: Study Locations
-- --------------------------------------------------------
INSERT INTO `study_locations` (`name`, `description`, `capacity`, `is_active`) VALUES
('Main Campus Hostel', 'Main campus student hostels', 100, 1),
('Town Hostels', 'Off-campus hostels in town', 150, 1),
('Karatina Town', 'Students living in Karatina town', 80, 1),
('Nearby Villages', 'Students from nearby villages', 50, 1),
('Online/Remote', 'For students who prefer online study', NULL, 1);

-- --------------------------------------------------------
-- Default Data: Blog Categories
-- --------------------------------------------------------
INSERT INTO `blog_categories` (`name`, `description`, `slug`, `color`) VALUES
('Testimony', 'Personal testimonies and faith stories', 'testimony', '#6366f1'),
('Teaching', 'Bible teachings and devotionals', 'teaching', '#10b981'),
('News', 'CU news and updates', 'news', '#f59e0b'),
('Events', 'Event recaps and highlights', 'events', '#ef4444');

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */