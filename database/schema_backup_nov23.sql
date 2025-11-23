-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 23, 2025 at 10:13 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12
-- Database: karucu_main_campus
--
-- COMPLETE DATABASE BACKUP WITH ALL TABLES, PROCEDURES, AND DATA
-- This backup includes:
-- - cleanup_old_members stored procedure
-- - All 40+ tables with structure and sample data
-- - Foreign key constraints and indexes
-- - nomination_results view

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

-- --------------------------------------------------------
-- Stored Procedures
-- --------------------------------------------------------

DELIMITER $$

CREATE DEFINER=`root`@`localhost` PROCEDURE `cleanup_old_members` ()
BEGIN
  DECLARE deleted_count INT DEFAULT 0;
  
  -- Start transaction
  START TRANSACTION;
  
  -- Count members to be deleted (for logging)
  SELECT COUNT(*) INTO deleted_count
  FROM users
  WHERE member_type = 'student'
    AND role = 'member'
    AND created_at < DATE_SUB(NOW(), INTERVAL 4 YEAR);
  
  -- Archive old members before deletion (optional - create archive table first)
  -- INSERT INTO users_archive SELECT * FROM users WHERE ...
  
  -- Delete members who have been registered for more than 4 years
  -- Only delete students with member role (not admins or editors)
  DELETE FROM users
  WHERE member_type = 'student'
    AND role = 'member'
    AND created_at < DATE_SUB(NOW(), INTERVAL 4 YEAR);
  
  -- Commit transaction
  COMMIT;
  
  -- Return count of deleted members
  SELECT deleted_count AS members_deleted;
END$$

DELIMITER ;

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
  KEY `idx_status` (`status`),
  KEY `idx_category` (`category`),
  KEY `idx_created_at` (`created_at`),
  CONSTRAINT `fk_announcement_creator` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE CASCADE
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
  KEY `fk_reading_calendar_creator` (`created_by`),
  KEY `idx_date` (`year`,`month`,`day`),
  KEY `idx_month_year` (`month`,`year`),
  KEY `idx_book` (`book`),
  CONSTRAINT `fk_reading_calendar_creator` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Table: bible_studies
-- --------------------------------------------------------

CREATE TABLE `bible_studies` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(200) NOT NULL,
  `scripture_reference` varchar(100) DEFAULT NULL,
  `content` text NOT NULL,
  `study_date` date DEFAULT NULL,
  `facilitator_id` int(11) DEFAULT NULL,
  `ministry_id` int(11) DEFAULT NULL,
  `status` enum('draft','published','archived') DEFAULT 'draft',
  `created_by` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `fk_bible_study_facilitator` (`facilitator_id`),
  KEY `fk_bible_study_ministry` (`ministry_id`),
  KEY `fk_bible_study_creator` (`created_by`),
  KEY `idx_date` (`study_date`),
  KEY `idx_status` (`status`),
  CONSTRAINT `fk_bible_study_creator` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_bible_study_facilitator` FOREIGN KEY (`facilitator_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_bible_study_ministry` FOREIGN KEY (`ministry_id`) REFERENCES `ministries` (`id`) ON DELETE SET NULL
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
  `school` varchar(255) NOT NULL COMMENT 'e.g., School of Education, School of Science',
  `registration_number` varchar(50) DEFAULT NULL,
  `status` enum('pending','approved','rejected') DEFAULT 'pending',
  `group_number` int(11) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `registered_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_registration` (`session_id`,`user_id`),
  KEY `user_id` (`user_id`),
  KEY `idx_registrations_session` (`session_id`),
  KEY `idx_registrations_location` (`location_id`),
  KEY `idx_registrations_status` (`status`),
  KEY `idx_registrations_group` (`group_number`),
  CONSTRAINT `bible_study_registrations_ibfk_1` FOREIGN KEY (`session_id`) REFERENCES `bible_study_sessions` (`id`) ON DELETE CASCADE,
  CONSTRAINT `bible_study_registrations_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `bible_study_registrations_ibfk_3` FOREIGN KEY (`location_id`) REFERENCES `study_locations` (`id`)
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
  KEY `created_by` (`created_by`),
  KEY `idx_sessions_deadline` (`registration_deadline`),
  KEY `idx_sessions_open` (`is_open`),
  CONSTRAINT `bible_study_sessions_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE CASCADE
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
  `tags` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`tags`)),
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
  KEY `fk_blog_approver` (`approved_by`),
  KEY `idx_status` (`status`),
  KEY `idx_category` (`category`),
  KEY `idx_published_at` (`published_at`),
  KEY `idx_slug` (`slug`),
  KEY `idx_author_status` (`author_id`,`status`),
  KEY `idx_created_at` (`created_at`),
  KEY `idx_blogs_created_at` (`created_at`),
  CONSTRAINT `fk_blog_approver` FOREIGN KEY (`approved_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_blog_author` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
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
  UNIQUE KEY `name` (`name`),
  UNIQUE KEY `slug` (`slug`),
  KEY `idx_slug` (`slug`)
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
  KEY `fk_blog_comment_author` (`author_id`),
  KEY `fk_blog_comment_parent` (`parent_id`),
  KEY `idx_post` (`post_id`),
  KEY `idx_status` (`status`),
  CONSTRAINT `fk_blog_comment_author` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_blog_comment_parent` FOREIGN KEY (`parent_id`) REFERENCES `blog_comments` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_blog_comment_post` FOREIGN KEY (`post_id`) REFERENCES `blogs` (`id`) ON DELETE CASCADE
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
  `donation_date` date DEFAULT curdate(),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `fk_donation_donor` (`donor_id`),
  KEY `fk_donation_category` (`category_id`),
  KEY `idx_status` (`status`),
  KEY `idx_date` (`donation_date`),
  KEY `idx_method` (`payment_method`),
  CONSTRAINT `fk_donation_category` FOREIGN KEY (`category_id`) REFERENCES `donation_categories` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_donation_donor` FOREIGN KEY (`donor_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Table: donation_categories
-- --------------------------------------------------------

CREATE TABLE `donation_categories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `target_amount` decimal(10,2) DEFAULT NULL,
  `current_amount` decimal(10,2) DEFAULT 0.00,
  `status` enum('active','completed','paused') DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Continue in next part due to size...
