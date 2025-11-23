-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 22, 2025 at 10:00 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `karucu_main_campus`
--

-- --------------------------------------------------------

--
-- Table structure for table `announcements`
--

CREATE TABLE `announcements` (
  `id` int(11) NOT NULL,
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
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `announcements`
--

INSERT INTO `announcements` (`id`, `title`, `content`, `category`, `priority`, `status`, `featured_image`, `scheduled_at`, `expires_at`, `created_by`, `created_at`, `updated_at`) VALUES
(1, 'hello', 'gghh', 'general', 'medium', 'published', NULL, NULL, '2025-11-06 21:00:00', 4, '2025-11-07 15:16:20', '2025-11-07 15:16:20'),
(2, 'Fellowship Meeting - This Friday', 'Join us this Friday at 5 PM for our weekly fellowship meeting. We will have worship, Bible study, and fellowship time. All are welcome!', 'general', 'high', 'published', NULL, NULL, '2025-11-14 13:47:58', 4, '2025-11-07 16:47:58', '2025-11-07 16:47:58'),
(3, 'Choir Auditions Open', 'KarUCU Choir is looking for new members! If you love to worship through song, come for auditions next Tuesday at 4 PM in the Music Room.', 'general', 'medium', 'published', NULL, NULL, '2025-11-21 13:47:58', 4, '2025-11-07 16:47:58', '2025-11-07 16:47:58'),
(4, 'Fellowship Meeting - This Friday', 'Join us this Friday at 5 PM for our weekly fellowship meeting. We will have worship, Bible study, and fellowship time. All are welcome!', 'general', 'high', 'published', NULL, NULL, '2025-11-14 13:49:30', 4, '2025-11-07 16:49:30', '2025-11-07 16:49:30'),
(5, 'Choir Auditions Open', 'KarUCU Choir is looking for new members! If you love to worship through song, come for auditions next Tuesday at 4 PM in the Music Room.', 'general', 'medium', 'published', NULL, NULL, '2025-11-21 13:49:30', 4, '2025-11-07 16:49:30', '2025-11-07 16:49:30'),
(6, 'Fellowship Meeting - This Friday', 'Join us this Friday at 5 PM for our weekly fellowship meeting. We will have worship, Bible study, and fellowship time. All are welcome!', 'general', 'high', 'published', NULL, NULL, '2025-11-14 13:53:32', 4, '2025-11-07 16:53:32', '2025-11-07 16:53:32'),
(7, 'Choir Auditions Open', 'KarUCU Choir is looking for new members! If you love to worship through song, come for auditions next Tuesday at 4 PM in the Music Room.', 'general', 'medium', 'published', NULL, NULL, '2025-11-21 13:53:32', 4, '2025-11-07 16:53:32', '2025-11-07 16:53:32'),
(8, 'Fellowship Meeting - This Friday', 'Join us this Friday at 5 PM for our weekly fellowship meeting. We will have worship, Bible study, and fellowship time. All are welcome!', 'general', 'high', 'published', NULL, NULL, '2025-11-14 13:54:29', 4, '2025-11-07 16:54:29', '2025-11-07 16:54:29'),
(9, 'Choir Auditions Open', 'KarUCU Choir is looking for new members! If you love to worship through song, come for auditions next Tuesday at 4 PM in the Music Room.', 'general', 'medium', 'published', NULL, NULL, '2025-11-21 13:54:29', 4, '2025-11-07 16:54:29', '2025-11-07 16:54:29'),
(10, 'Fellowship Meeting - This Friday', 'Join us this Friday at 5 PM for our weekly fellowship meeting. We will have worship, Bible study, and fellowship time. All are welcome!', 'general', 'high', 'published', NULL, NULL, '2025-11-14 13:55:33', 4, '2025-11-07 16:55:33', '2025-11-07 16:55:33'),
(11, 'Choir Auditions Open', 'KarUCU Choir is looking for new members! If you love to worship through song, come for auditions next Tuesday at 4 PM in the Music Room.', 'general', 'medium', 'published', NULL, NULL, '2025-11-21 13:55:33', 4, '2025-11-07 16:55:33', '2025-11-07 16:55:33');

-- --------------------------------------------------------

--
-- Table structure for table `bible_reading_calendar`
--

CREATE TABLE `bible_reading_calendar` (
  `id` int(11) NOT NULL,
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
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `bible_reading_calendar`
--

INSERT INTO `bible_reading_calendar` (`id`, `month`, `year`, `day`, `book`, `chapter_start`, `chapter_end`, `verse_start`, `verse_end`, `devotional_note`, `created_by`, `created_at`) VALUES
(2, 11, 2025, 1, 'Genesis', 1, 2, NULL, NULL, 'Begin your journey through the Bible with the story of creation. Reflect on God\'s power and creativity.', 4, '2025-11-07 16:53:32'),
(3, 11, 2025, 2, 'Psalms', 23, NULL, NULL, NULL, 'The Lord is my shepherd. Meditate on God\'s care and provision in your life.', 4, '2025-11-07 16:53:32');

-- --------------------------------------------------------

--
-- Table structure for table `bible_studies`
--

CREATE TABLE `bible_studies` (
  `id` int(11) NOT NULL,
  `title` varchar(200) NOT NULL,
  `scripture_reference` varchar(100) DEFAULT NULL,
  `content` text NOT NULL,
  `study_date` date DEFAULT NULL,
  `facilitator_id` int(11) DEFAULT NULL,
  `ministry_id` int(11) DEFAULT NULL,
  `status` enum('draft','published','archived') DEFAULT 'draft',
  `created_by` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `bible_study_registrations`
--

CREATE TABLE `bible_study_registrations` (
  `id` int(11) NOT NULL,
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
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `bible_study_registrations`
--

INSERT INTO `bible_study_registrations` (`id`, `session_id`, `user_id`, `full_name`, `email`, `phone`, `location_id`, `year_of_study`, `school`, `registration_number`, `status`, `group_number`, `notes`, `registered_at`, `updated_at`) VALUES
(5, 6, 3, 'ken', 'kingoristephen635@gmail.com', '+254769956286', 12, 'Year 3', 'business', 'fubuhol', 'approved', NULL, NULL, '2025-11-15 17:24:24', '2025-11-15 17:24:24');

-- --------------------------------------------------------

--
-- Table structure for table `bible_study_sessions`
--

CREATE TABLE `bible_study_sessions` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `registration_deadline` datetime NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date DEFAULT NULL,
  `is_open` tinyint(1) DEFAULT 1,
  `max_participants` int(11) DEFAULT NULL,
  `created_by` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `bible_study_sessions`
--

INSERT INTO `bible_study_sessions` (`id`, `title`, `description`, `registration_deadline`, `start_date`, `end_date`, `is_open`, `max_participants`, `created_by`, `created_at`, `updated_at`) VALUES
(6, 'test', 'hello', '2025-11-16 00:00:00', '2025-11-16', '2025-11-18', 1, NULL, 4, '2025-11-15 17:23:19', '2025-11-15 17:23:19'),
(7, 'peer to peer bible study', 'Welcome to ultimate bible study experience', '2025-11-22 00:00:00', '2025-11-21', '2025-11-23', 1, NULL, 4, '2025-11-21 20:13:04', '2025-11-21 20:13:04');

-- --------------------------------------------------------

--
-- Table structure for table `blogs`
--

CREATE TABLE `blogs` (
  `id` int(11) NOT NULL,
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
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `blogs`
--

INSERT INTO `blogs` (`id`, `title`, `content`, `excerpt`, `featured_image`, `category`, `tags`, `status`, `rejection_reason`, `slug`, `view_count`, `author_id`, `approved_by`, `approved_at`, `published_at`, `created_at`, `updated_at`) VALUES
(1, 'Walking in Faith: A Student\'s Journey', 'As students, we face many challenges - academic pressure, financial struggles, and uncertainty about the future. But God calls us to walk by faith, not by sight. In this post, I want to share how trusting God has transformed my university experience...', 'Discover how faith can transform your university experience and help you overcome challenges.', NULL, 'testimony', '[\"faith\",\"testimony\",\"student-life\"]', 'approved', NULL, NULL, 0, 4, 4, '2025-11-07 13:47:58', '2025-11-07 13:47:58', '2025-11-07 16:47:58', '2025-11-07 16:47:58'),
(2, 'The Power of Prayer in Campus Ministry', 'Prayer is the foundation of effective campus ministry. When we pray, we invite God to work in ways we cannot imagine. This article explores practical ways to build a strong prayer culture in your fellowship...', 'Learn how to build a powerful prayer culture in your campus fellowship.', NULL, 'teaching', '[\"prayer\",\"ministry\",\"campus\"]', 'approved', NULL, NULL, 0, 4, 4, '2025-11-07 13:47:58', '2025-11-07 13:47:58', '2025-11-07 16:47:58', '2025-11-07 16:47:58'),
(3, 'Walking in Faith: A Student\'s Journey', 'As students, we face many challenges - academic pressure, financial struggles, and uncertainty about the future. But God calls us to walk by faith, not by sight. In this post, I want to share how trusting God has transformed my university experience...', 'Discover how faith can transform your university experience and help you overcome challenges.', NULL, 'testimony', '[\"faith\",\"testimony\",\"student-life\"]', 'approved', NULL, NULL, 0, 4, 4, '2025-11-07 13:49:30', '2025-11-07 13:49:30', '2025-11-07 16:49:30', '2025-11-07 16:49:30'),
(4, 'The Power of Prayer in Campus Ministry', 'Prayer is the foundation of effective campus ministry. When we pray, we invite God to work in ways we cannot imagine. This article explores practical ways to build a strong prayer culture in your fellowship...', 'Learn how to build a powerful prayer culture in your campus fellowship.', NULL, 'teaching', '[\"prayer\",\"ministry\",\"campus\"]', 'approved', NULL, NULL, 0, 4, 4, '2025-11-07 13:49:30', '2025-11-07 13:49:30', '2025-11-07 16:49:30', '2025-11-07 16:49:30'),
(5, 'Walking in Faith: A Student\'s Journey', 'As students, we face many challenges - academic pressure, financial struggles, and uncertainty about the future. But God calls us to walk by faith, not by sight. In this post, I want to share how trusting God has transformed my university experience...', 'Discover how faith can transform your university experience and help you overcome challenges.', NULL, 'testimony', '[\"faith\",\"testimony\",\"student-life\"]', 'approved', NULL, NULL, 0, 4, 4, '2025-11-07 13:53:32', '2025-11-07 13:53:32', '2025-11-07 16:53:32', '2025-11-07 16:53:32'),
(6, 'The Power of Prayer in Campus Ministry', 'Prayer is the foundation of effective campus ministry. When we pray, we invite God to work in ways we cannot imagine. This article explores practical ways to build a strong prayer culture in your fellowship...', 'Learn how to build a powerful prayer culture in your campus fellowship.', NULL, 'teaching', '[\"prayer\",\"ministry\",\"campus\"]', 'approved', NULL, NULL, 0, 4, 4, '2025-11-07 13:53:32', '2025-11-07 13:53:32', '2025-11-07 16:53:32', '2025-11-07 16:53:32'),
(7, 'Walking in Faith: A Student\'s Journey', 'As students, we face many challenges - academic pressure, financial struggles, and uncertainty about the future. But God calls us to walk by faith, not by sight. In this post, I want to share how trusting God has transformed my university experience...', 'Discover how faith can transform your university experience and help you overcome challenges.', NULL, 'testimony', '[\"faith\",\"testimony\",\"student-life\"]', 'approved', NULL, NULL, 0, 4, 4, '2025-11-07 13:54:29', '2025-11-07 13:54:29', '2025-11-07 16:54:29', '2025-11-07 16:54:29'),
(8, 'The Power of Prayer in Campus Ministry', 'Prayer is the foundation of effective campus ministry. When we pray, we invite God to work in ways we cannot imagine. This article explores practical ways to build a strong prayer culture in your fellowship...', 'Learn how to build a powerful prayer culture in your campus fellowship.', NULL, 'teaching', '[\"prayer\",\"ministry\",\"campus\"]', 'approved', NULL, NULL, 0, 4, 4, '2025-11-07 13:54:29', '2025-11-07 13:54:29', '2025-11-07 16:54:29', '2025-11-07 16:54:29'),
(9, 'Walking in Faith: A Student\'s Journey', 'As students, we face many challenges - academic pressure, financial struggles, and uncertainty about the future. But God calls us to walk by faith, not by sight. In this post, I want to share how trusting God has transformed my university experience...', 'Discover how faith can transform your university experience and help you overcome challenges.', NULL, 'testimony', '[\"faith\",\"testimony\",\"student-life\"]', 'approved', NULL, NULL, 0, 4, 4, '2025-11-07 13:55:33', '2025-11-07 13:55:33', '2025-11-07 16:55:33', '2025-11-07 16:55:33'),
(10, 'The Power of Prayer in Campus Ministry', 'Prayer is the foundation of effective campus ministry. When we pray, we invite God to work in ways we cannot imagine. This article explores practical ways to build a strong prayer culture in your fellowship...', 'Learn how to build a powerful prayer culture in your campus fellowship.', NULL, 'teaching', '[\"prayer\",\"ministry\",\"campus\"]', 'approved', NULL, NULL, 0, 4, 4, '2025-11-07 13:55:33', '2025-11-07 13:55:33', '2025-11-07 16:55:33', '2025-11-07 16:55:33'),
(11, 'my blog', 'wegvqegqg', 'sfqegweg', '/uploads/blogs/1762757055521-0c3qx.jpg', NULL, '[\"faith\"]', 'approved', NULL, 'my-blog-1762754963874', 0, 3, NULL, NULL, NULL, '2025-11-10 06:09:23', '2025-11-10 06:44:22'),
(12, 'welcome to karumain cu', 'cjwhihihfcjufculh;iph;h;hluglo', 'testing a blog', '/uploads/blogs/1762795445415-szylby.jpg', 'Testimony', '[\"faith\"]', 'approved', NULL, 'welcome-to-karumain-cu-1762795483876', 0, 22, NULL, NULL, NULL, '2025-11-10 17:24:43', '2025-11-10 17:34:51');

-- --------------------------------------------------------

--
-- Table structure for table `blog_categories`
--

CREATE TABLE `blog_categories` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `slug` varchar(100) NOT NULL,
  `color` varchar(7) DEFAULT '#6366f1',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `blog_categories`
--

INSERT INTO `blog_categories` (`id`, `name`, `description`, `slug`, `color`, `created_at`) VALUES
(1, 'Testimony', 'Personal testimonies and faith stories', '', '#6366f1', '2025-11-10 05:15:04'),
(11, 'test blog', 'amazon', 'test-blog', '#6366f1', '2025-11-10 05:52:34');

-- --------------------------------------------------------

--
-- Table structure for table `blog_comments`
--

CREATE TABLE `blog_comments` (
  `id` int(11) NOT NULL,
  `post_id` int(11) NOT NULL,
  `author_id` int(11) DEFAULT NULL,
  `author_name` varchar(100) DEFAULT NULL,
  `author_email` varchar(100) DEFAULT NULL,
  `content` text NOT NULL,
  `parent_id` int(11) DEFAULT NULL,
  `status` enum('pending','approved','rejected') DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `donations`
--

CREATE TABLE `donations` (
  `id` int(11) NOT NULL,
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
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `donation_categories`
--

CREATE TABLE `donation_categories` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `target_amount` decimal(10,2) DEFAULT NULL,
  `current_amount` decimal(10,2) DEFAULT 0.00,
  `status` enum('active','completed','paused') DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `election_positions`
--

CREATE TABLE `election_positions` (
  `id` int(11) NOT NULL,
  `election_id` int(11) NOT NULL,
  `title` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `display_order` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `election_positions`
--

INSERT INTO `election_positions` (`id`, `election_id`, `title`, `description`, `display_order`, `created_at`) VALUES
(9, 5, 'chair', 'csj', 1, '2025-11-12 19:53:42'),
(10, 5, 'vice chair', 'hello', 2, '2025-11-15 17:19:02');

-- --------------------------------------------------------

--
-- Table structure for table `email_verification_tokens`
--

CREATE TABLE `email_verification_tokens` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `token` varchar(255) NOT NULL,
  `expires_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `verified` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `events`
--

CREATE TABLE `events` (
  `id` int(11) NOT NULL,
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
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `events`
--

INSERT INTO `events` (`id`, `title`, `description`, `event_date`, `end_date`, `location`, `venue_details`, `capacity`, `registration_required`, `registration_deadline`, `featured_image`, `category`, `status`, `created_by`, `created_at`, `updated_at`) VALUES
(12, 'worship experience  jjnbilhnjo;', 'A transformative 3-day conference for young believers. Theme: \"Anchored in Christ\"', '2025-12-07 05:00:00', '2025-12-07 15:00:00', 'Rch 6', '', 300, 1, '2025-11-27 16:55:00', '/uploads/general/1762758293739-w4un6.jpg', 'conference', 'published', 4, '2025-11-07 16:55:33', '2025-11-15 17:22:04'),
(13, 'Leaders training', 'welcome to this amaizing session', '2025-11-11 09:30:00', '2025-11-11 16:40:00', 'Rch 12', NULL, 3000, 0, NULL, '/uploads/general/1762795973916-eyu1co.jpg', 'trainning', 'published', 4, '2025-11-10 17:33:17', '2025-11-10 17:33:17');

-- --------------------------------------------------------

--
-- Table structure for table `event_registrations`
--

CREATE TABLE `event_registrations` (
  `id` int(11) NOT NULL,
  `event_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `registration_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `attendance_status` enum('registered','attended','absent','cancelled') DEFAULT 'registered',
  `notes` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `galleries`
--

CREATE TABLE `galleries` (
  `id` int(11) NOT NULL,
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
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `galleries`
--

INSERT INTO `galleries` (`id`, `title`, `description`, `url`, `category`, `thumbnail_url`, `platform`, `is_active`, `view_count`, `created_by`, `updated_by`, `created_at`, `updated_at`) VALUES
(1, 'Sunday Service - November 2024', 'Photos from our powerful Sunday worship service', 'https://photos.google.com/share/sample1', 'worship', 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=400', 'google_photos', 1, 0, 4, NULL, '2025-11-07 16:53:32', '2025-11-07 16:53:32'),
(2, 'Outreach Mission - Karatina Town', 'Community outreach and evangelism in Karatina town', 'https://drive.google.com/drive/folders/sample2', 'outreach', 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=400', 'google_drive', 1, 0, 4, NULL, '2025-11-07 16:53:32', '2025-11-07 16:53:32'),
(3, 'Sunday Service - November 2024', 'Photos from our powerful Sunday worship service', 'https://photos.google.com/share/sample1', 'worship', 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=400', 'google_photos', 1, 0, 4, NULL, '2025-11-07 16:54:29', '2025-11-07 16:54:29'),
(4, 'Outreach Mission - Karatina Town', 'Community outreach and evangelism in Karatina town', 'https://drive.google.com/drive/folders/sample2', 'outreach', 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=400', 'google_drive', 1, 0, 4, NULL, '2025-11-07 16:54:29', '2025-11-07 16:54:29'),
(5, 'Sunday Service - November 2024', 'Photos from our powerful Sunday worship service', 'https://drive.google.com/file/d/11VIY0L_yM7cpGbWTDPhX_odrPxL4DksN/view?usp=drive_link', 'worship', 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=400', 'google_photos', 1, 5, 4, NULL, '2025-11-07 16:55:33', '2025-11-15 17:14:53'),
(6, 'Outreach Mission - Karatina Town', 'Community outreach and evangelism in Karatina town', 'https://drive.google.com/drive/folders/sample2', 'outreach', 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=400', 'google_drive', 1, 1, 4, NULL, '2025-11-07 16:55:33', '2025-11-07 17:02:14');

-- --------------------------------------------------------

--
-- Table structure for table `leaders`
--

CREATE TABLE `leaders` (
  `id` int(11) NOT NULL,
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
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `leaders`
--

INSERT INTO `leaders` (`id`, `full_name`, `position`, `bio`, `photo_url`, `email`, `phone`, `display_order`, `status`, `term_start`, `term_end`, `created_by`, `created_at`, `updated_at`) VALUES
(9, 'Pastor David Kimani', 'Patron', 'Pastor David has been serving in campus ministry for over 15 years. He is passionate about mentoring young believers and helping them discover their purpose in Christ.', '/uploads/leaders/1762758034496-vxl76i.jpg', 'pastor.david@ku.ac.ke', '0722111222', 1, 'active', NULL, NULL, 4, '2025-11-07 16:55:33', '2025-11-10 07:00:37'),
(11, 'Kingori Stephen', 'hhh', 'hhh', '/uploads/leaders/1762758019723-zns4h.jpg', 'kingoristephen635@gmail.com', '+254769956286', 1, 'active', NULL, NULL, 4, '2025-11-07 18:00:17', '2025-11-10 07:00:23'),
(12, 'joyce', 'prayer cordinator', NULL, '/uploads/leaders/1762796803675-g0es8n.jpg', 'kingoristephen635@gmail.com', '+254769956286', 1, 'active', NULL, NULL, 4, '2025-11-10 17:47:07', '2025-11-10 17:47:07');

-- --------------------------------------------------------

--
-- Table structure for table `leadership_positions`
--

CREATE TABLE `leadership_positions` (
  `id` int(11) NOT NULL,
  `title` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `term_start` date DEFAULT NULL,
  `term_end` date DEFAULT NULL,
  `status` enum('active','completed','interim') DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `leader_elections`
--

CREATE TABLE `leader_elections` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `start_date` datetime NOT NULL,
  `end_date` datetime NOT NULL,
  `status` enum('draft','open','closed','archived') DEFAULT 'draft',
  `max_nominations_per_member` int(11) DEFAULT 5,
  `created_by` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `leader_elections`
--

INSERT INTO `leader_elections` (`id`, `title`, `description`, `start_date`, `end_date`, `status`, `max_nominations_per_member`, `created_by`, `created_at`, `updated_at`) VALUES
(5, 'test', 'welcome', '2025-11-11 23:19:12', '2025-12-12 23:19:12', 'open', 5, 4, '2025-11-12 19:44:30', '2025-11-12 20:19:12');

-- --------------------------------------------------------

--
-- Table structure for table `leader_nominations`
--

CREATE TABLE `leader_nominations` (
  `id` int(11) NOT NULL,
  `election_id` int(11) NOT NULL,
  `nominator_id` int(11) NOT NULL COMMENT 'Member who is nominating',
  `nominee_id` int(11) NOT NULL COMMENT 'Member being nominated',
  `position` varchar(100) DEFAULT NULL COMMENT 'Optional: specific position',
  `reason` text DEFAULT NULL COMMENT 'Why they are nominating this person',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `leader_nominations`
--

INSERT INTO `leader_nominations` (`id`, `election_id`, `nominator_id`, `nominee_id`, `position`, `reason`, `created_at`) VALUES
(8, 5, 3, 1, 'chair', 'hello', '2025-11-12 20:26:33'),
(9, 5, 4, 2, 'vice chair', '', '2025-11-15 17:19:29'),
(12, 5, 1, 2, 'chair', 'role model', '2025-11-21 20:02:26');

-- --------------------------------------------------------

--
-- Table structure for table `media_configuration`
--

CREATE TABLE `media_configuration` (
  `id` int(11) NOT NULL,
  `config_key` varchar(100) NOT NULL,
  `config_value` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `updated_by` int(11) NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `media_files`
--

CREATE TABLE `media_files` (
  `id` int(11) NOT NULL,
  `filename` varchar(255) NOT NULL,
  `original_name` varchar(255) NOT NULL,
  `file_path` varchar(500) NOT NULL,
  `file_type` enum('image','audio','video','document') NOT NULL,
  `mime_type` varchar(100) DEFAULT NULL,
  `file_size` int(11) DEFAULT NULL,
  `uploaded_by` int(11) NOT NULL,
  `description` text DEFAULT NULL,
  `alt_text` varchar(255) DEFAULT NULL,
  `usage_context` enum('blog','event','sermon','profile','general') DEFAULT 'general',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `ministries`
--

CREATE TABLE `ministries` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `leader_id` int(11) DEFAULT NULL,
  `assistant_leader_id` int(11) DEFAULT NULL,
  `status` enum('active','inactive') DEFAULT 'active',
  `meeting_day` enum('Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday') DEFAULT NULL,
  `meeting_time` time DEFAULT NULL,
  `meeting_location` varchar(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `ministry_members`
--

CREATE TABLE `ministry_members` (
  `id` int(11) NOT NULL,
  `ministry_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `position` enum('member','coordinator','assistant') DEFAULT 'member',
  `joined_date` date DEFAULT curdate(),
  `status` enum('active','inactive') DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Stand-in structure for view `nomination_results`
-- (See below for the actual view)
--
CREATE TABLE `nomination_results` (
`election_id` int(11)
,`nominee_id` int(11)
,`nominee_name` varchar(255)
,`nominee_email` varchar(255)
,`registration_number` varchar(20)
,`course` varchar(255)
,`year_of_study` int(11)
,`nomination_count` bigint(21)
,`suggested_positions` mediumtext
);

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `token` varchar(255) NOT NULL,
  `expires_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `used` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `prayer_requests`
--

CREATE TABLE `prayer_requests` (
  `id` int(11) NOT NULL,
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
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `reading_progress`
--

CREATE TABLE `reading_progress` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `reading_date` date NOT NULL,
  `completed` tinyint(1) DEFAULT 0,
  `completed_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sermons`
--

CREATE TABLE `sermons` (
  `id` int(11) NOT NULL,
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
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sermons`
--

INSERT INTO `sermons` (`id`, `title`, `description`, `youtube_url`, `youtube_id`, `thumbnail_url`, `speaker`, `sermon_date`, `series_name`, `scripture_reference`, `duration`, `view_count`, `featured`, `status`, `created_by`, `created_at`, `updated_at`) VALUES
(1, 'Living a Life of Purpose', 'God has a plan and purpose for your life. Discover how to align your life with His divine purpose.', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'dQw4w9WgXcQ', NULL, 'Pastor David Kimani', '2025-10-31', 'Purpose Driven Life', 'Jeremiah 29:11', 2700, 0, 0, 'published', 4, '2025-11-07 16:47:58', '2025-11-07 16:47:58'),
(2, 'The Power of Faith', 'Faith is the substance of things hoped for. Learn how to activate your faith and see God move in your life.', 'https://www.youtube.com/watch?v=jNQXAC9IVRw', 'jNQXAC9IVRw', NULL, 'Rev. Grace Muthoni', '2025-10-24', 'Faith Series', 'Hebrews 11:1', 2280, 0, 0, 'published', 4, '2025-11-07 16:47:58', '2025-11-07 16:47:58'),
(3, 'Living a Life of Purpose', 'God has a plan and purpose for your life. Discover how to align your life with His divine purpose.', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'dQw4w9WgXcQ', NULL, 'Pastor David Kimani', '2025-10-31', 'Purpose Driven Life', 'Jeremiah 29:11', 2700, 0, 0, 'published', 4, '2025-11-07 16:49:30', '2025-11-07 16:49:30'),
(4, 'The Power of Faith', 'Faith is the substance of things hoped for. Learn how to activate your faith and see God move in your life.', 'https://www.youtube.com/watch?v=jNQXAC9IVRw', 'jNQXAC9IVRw', NULL, 'Rev. Grace Muthoni', '2025-10-24', 'Faith Series', 'Hebrews 11:1', 2280, 0, 0, 'published', 4, '2025-11-07 16:49:30', '2025-11-07 16:49:30'),
(5, 'Living a Life of Purpose', 'God has a plan and purpose for your life. Discover how to align your life with His divine purpose.', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'dQw4w9WgXcQ', NULL, 'Pastor David Kimani', '2025-10-31', 'Purpose Driven Life', 'Jeremiah 29:11', 2700, 0, 0, 'published', 4, '2025-11-07 16:53:32', '2025-11-07 16:53:32'),
(6, 'The Power of Faith', 'Faith is the substance of things hoped for. Learn how to activate your faith and see God move in your life.', 'https://www.youtube.com/watch?v=jNQXAC9IVRw', 'jNQXAC9IVRw', NULL, 'Rev. Grace Muthoni', '2025-10-24', 'Faith Series', 'Hebrews 11:1', 2280, 0, 0, 'published', 4, '2025-11-07 16:53:32', '2025-11-07 16:53:32'),
(7, 'Living a Life of Purpose', 'God has a plan and purpose for your life. Discover how to align your life with His divine purpose.', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'dQw4w9WgXcQ', NULL, 'Pastor David Kimani', '2025-10-31', 'Purpose Driven Life', 'Jeremiah 29:11', 2700, 0, 0, 'published', 4, '2025-11-07 16:54:29', '2025-11-07 16:54:29'),
(8, 'The Power of Faith', 'Faith is the substance of things hoped for. Learn how to activate your faith and see God move in your life.', 'https://www.youtube.com/watch?v=jNQXAC9IVRw', 'jNQXAC9IVRw', NULL, 'Rev. Grace Muthoni', '2025-10-24', 'Faith Series', 'Hebrews 11:1', 2280, 0, 0, 'published', 4, '2025-11-07 16:54:29', '2025-11-07 16:54:29'),
(9, 'Living a Life of Purpose', 'God has a plan and purpose for your life. Discover how to align your life with His divine purpose.', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'dQw4w9WgXcQ', NULL, 'Pastor David Kimani', '2025-10-31', 'Purpose Driven Life', 'Jeremiah 29:11', 2700, 0, 0, 'published', 4, '2025-11-07 16:55:33', '2025-11-07 16:55:33'),
(10, 'The Power of Faith', 'Faith is the substance of things hoped for. Learn how to activate your faith and see God move in your life.', 'https://www.youtube.com/watch?v=jNQXAC9IVRw', 'jNQXAC9IVRw', NULL, 'Rev. Grace Muthoni', '2025-10-24', 'Faith Series', 'Hebrews 11:1', 2280, 0, 0, 'published', 4, '2025-11-07 16:55:33', '2025-11-07 16:55:33');

-- --------------------------------------------------------

--
-- Table structure for table `study_group_settings`
--

CREATE TABLE `study_group_settings` (
  `id` int(11) NOT NULL,
  `session_id` int(11) NOT NULL,
  `location_id` int(11) NOT NULL,
  `members_per_group` int(11) NOT NULL DEFAULT 10,
  `group_by_criteria` enum('location','school','year','mixed') DEFAULT 'location',
  `auto_assign` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `study_locations`
--

CREATE TABLE `study_locations` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `capacity` int(11) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `study_locations`
--

INSERT INTO `study_locations` (`id`, `name`, `description`, `capacity`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'Main Campus Hostel', 'Main campus student hostels', 100, 1, '2025-11-09 18:49:59', '2025-11-09 18:49:59'),
(2, 'Town Hostels', 'Off-campus hostels in town', 150, 1, '2025-11-09 18:49:59', '2025-11-09 18:49:59'),
(3, 'Karatina Town', 'Students living in Karatina town', 80, 1, '2025-11-09 18:49:59', '2025-11-09 18:49:59'),
(4, 'Nearby Villages', 'Students from nearby villages', 50, 1, '2025-11-09 18:49:59', '2025-11-09 18:49:59'),
(6, 'Main Campus Hostel', 'Main campus student hostels', 100, 1, '2025-11-09 19:03:30', '2025-11-09 19:03:30'),
(7, 'Town Hostels', 'Off-campus hostels in town', 150, 1, '2025-11-09 19:03:30', '2025-11-09 19:03:30'),
(8, 'Karatina Town', 'Students living in Karatina town', 80, 1, '2025-11-09 19:03:30', '2025-11-09 19:03:30'),
(9, 'Nearby Villages', 'Students from nearby villages', 50, 1, '2025-11-09 19:03:30', '2025-11-09 19:03:30'),
(10, 'Online/Remote', 'For students who prefer online study', NULL, 1, '2025-11-09 19:03:30', '2025-11-09 19:03:30'),
(11, 'g town', NULL, NULL, 1, '2025-11-10 07:55:07', '2025-11-10 07:55:07'),
(12, 'kirima', NULL, NULL, 1, '2025-11-10 17:39:22', '2025-11-10 17:39:22');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
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
  `last_login` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `registration_number`, `email`, `password_hash`, `full_name`, `phone`, `member_type`, `role`, `status`, `course`, `year_of_study`, `staff_id`, `alumni_year`, `doctrinal_agreement`, `profile_image`, `reset_token`, `reset_token_expiry`, `created_at`, `updated_at`, `last_login`) VALUES
(1, 'b1030732g23', 'kingoristephen635@gmail.com', '$2a$10$Y02UKF522Ngsez9SSpuQzeHPuXH4fOYCLEeU7xONy3yWr2BF01yfK', 'stephen', '0788419041', 'student', 'admin', 'active', 'project', 3, NULL, NULL, 1, 'https://lh3.googleusercontent.com/a/ACg8ocJdxSNokXjbeRBO-olpU7WEMoQz1uVqiq_caD7eHE3qMxtosWA=s96-c', '3dcb1b6d8d1c9325b8e5f82b73d3e311add8aa28c411d3082981b45393a9d0f3', '2025-11-12 14:40:45', '2025-11-07 10:12:19', '2025-11-22 08:33:33', '2025-11-21 20:13:17'),
(2, 'b10307', 'kingoristephen@gmail.com', '$2a$10$4gRXc48Kibkm0ywSXk3gQuiP/9C6KvtTTxBnuLeZ4s3u2RXJliSV.', 'kingori', '+254769956286', 'student', 'member', 'active', 'acturial', 2, NULL, NULL, 1, NULL, NULL, NULL, '2025-11-07 10:45:38', '2025-11-07 11:09:32', '2025-11-07 11:09:32'),
(3, '32g23', 'stephen.king\'ori@s.karu.ac.ke', '', 'Stephen King\'ori', '0788419041', 'student', 'editor', 'active', 'bbm', 3, NULL, NULL, 1, 'https://lh3.googleusercontent.com/a/ACg8ocJZCsNMySUCZDDECSW1Enl7JE57X3NyYm5rxifSSLfT40hc=s96-c', NULL, NULL, '2025-11-07 12:31:41', '2025-11-22 08:56:39', '2025-11-22 08:56:39'),
(4, 'ADMIN002', 'kingscreationagency635@gmail.com', '$2a$10$rfEAjOyKHNN/Rjhb.j6orePKzV6.nEpuk.rPk9.FZGdfI8mwMuDTe', 'Kings Creation Agency', '+254700000000', 'associate', 'admin', 'active', NULL, NULL, NULL, NULL, 1, 'https://lh3.googleusercontent.com/a/ACg8ocIG4x6jXxH9KT-KD7ExLD9yZShnaW7v11E97MIITJlK6l8Xyw=s96-c', NULL, NULL, '2025-11-07 14:06:45', '2025-11-22 08:57:15', '2025-11-22 08:57:15'),
(6, 'C027-01-5678/2023', 'jane.smith@student.ku.ac.ke', '$2a$10$GzA8m.WlMg2FqGyJcTdUWuCCU8u0Ho0tVpeiqv/EesfHy/fB0eqa6', 'Jane Smith', '0723456789', 'student', 'member', 'active', 'Business Administration', 2, NULL, NULL, 1, NULL, NULL, NULL, '2025-11-07 16:43:00', '2025-11-07 16:43:00', NULL),
(21, 'b10307353673889', 'mikelawrence154@gmail.com', '$2a$10$vUsBMDIhucuvxHK.Nl.mVu3bl4xG4ApNBdjgyNwlua6b/KunBKxI6', 'Mike', '0788419041', 'student', 'member', 'active', 'Political science', 3, NULL, NULL, 1, NULL, 'fc14f8bd6fab8389118135154b6cf0c62c19bda3e3b5b725f2c8601e0dceb246', '2025-11-10 10:47:52', '2025-11-10 09:45:38', '2025-11-10 09:47:52', NULL),
(22, 'b103/0732g23', 'musivajoyce74@gmail.com', '$2a$10$/CUmJ7qm7I6ThuqhKrNqDOmJRpgrjD.wF2dT9CXcmkZtzBhzF1yEW', 'joyce', '+254769956286', 'student', 'member', 'active', 'business', 3, NULL, NULL, 1, NULL, '8684e4fa7ec6fcb3da706250e343905cb673f9a1ac2fb96337737399e8a85c18', '2025-11-10 18:27:33', '2025-11-10 17:20:08', '2025-11-10 17:27:33', '2025-11-10 17:20:47');

-- --------------------------------------------------------

--
-- Table structure for table `user_bookmarks`
--

CREATE TABLE `user_bookmarks` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `bookmark_type` enum('verse','blog','sermon','prayer') NOT NULL,
  `reference_id` int(11) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `content` text DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_prayer_requests`
--

CREATE TABLE `user_prayer_requests` (
  `id` int(11) NOT NULL,
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
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_prayer_requests`
--

INSERT INTO `user_prayer_requests` (`id`, `user_id`, `title`, `content`, `category`, `priority`, `status`, `is_private`, `answered_at`, `testimony`, `created_at`, `updated_at`) VALUES
(1, 1, 'Exam Success', 'Please pray for me as I prepare for my final exams. I need God\'s wisdom and understanding.', 'academic', 'high', 'active', 0, NULL, NULL, '2025-11-07 16:55:33', '2025-11-07 16:55:33'),
(2, 1, 'Family Healing', 'My mother is unwell. Please pray for her complete healing and recovery.', 'health', 'high', 'active', 0, NULL, NULL, '2025-11-07 16:55:33', '2025-11-07 16:55:33'),
(3, 3, 'thanks giving', 'Thankyou', 'personal', 'medium', 'answered', 1, '2025-11-11 15:08:21', 'come through', '2025-11-11 15:05:19', '2025-11-11 15:08:21'),
(4, 3, 'test prayer request', 'hello admin', 'personal', 'medium', 'active', 1, NULL, NULL, '2025-11-12 14:51:25', '2025-11-12 14:51:25');

-- --------------------------------------------------------

--
-- Table structure for table `verse_of_day`
--

CREATE TABLE `verse_of_day` (
  `id` int(11) NOT NULL,
  `verse_reference` varchar(255) NOT NULL,
  `verse_text` text NOT NULL,
  `commentary` text DEFAULT NULL,
  `date` date NOT NULL,
  `created_by` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `verse_of_day`
--

INSERT INTO `verse_of_day` (`id`, `verse_reference`, `verse_text`, `commentary`, `date`, `created_by`, `created_at`) VALUES
(1, 'John 3:16', 'For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.', 'This verse reminds us of God\'s incredible love for humanity. His love is so great that He gave His most precious gift - His Son - so that we might have eternal life.', '2025-11-07', 4, '2025-11-07 16:49:30'),
(2, 'Philippians 4:13', 'I can do all things through Christ who strengthens me.', 'When we feel weak or inadequate, we can find strength in Christ. This verse encourages us to rely on His power rather than our own.', '2025-11-08', 4, '2025-11-07 16:49:30');

-- --------------------------------------------------------

--
-- Structure for view `nomination_results`
--
DROP TABLE IF EXISTS `nomination_results`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `nomination_results`  AS SELECT `ln`.`election_id` AS `election_id`, `ln`.`nominee_id` AS `nominee_id`, `u`.`full_name` AS `nominee_name`, `u`.`email` AS `nominee_email`, `u`.`registration_number` AS `registration_number`, `u`.`course` AS `course`, `u`.`year_of_study` AS `year_of_study`, count(`ln`.`id`) AS `nomination_count`, group_concat(distinct `ln`.`position` separator ', ') AS `suggested_positions` FROM (`leader_nominations` `ln` join `users` `u` on(`ln`.`nominee_id` = `u`.`id`)) GROUP BY `ln`.`election_id`, `ln`.`nominee_id`, `u`.`full_name`, `u`.`email`, `u`.`registration_number`, `u`.`course`, `u`.`year_of_study` ORDER BY count(`ln`.`id`) DESC ;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `announcements`
--
ALTER TABLE `announcements`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_announcement_creator` (`created_by`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `idx_category` (`category`),
  ADD KEY `idx_created_at` (`created_at`);

--
-- Indexes for table `bible_reading_calendar`
--
ALTER TABLE `bible_reading_calendar`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_date` (`year`,`month`,`day`),
  ADD KEY `fk_reading_calendar_creator` (`created_by`),
  ADD KEY `idx_date` (`year`,`month`,`day`);

--
-- Indexes for table `bible_studies`
--
ALTER TABLE `bible_studies`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_bible_study_facilitator` (`facilitator_id`),
  ADD KEY `fk_bible_study_ministry` (`ministry_id`),
  ADD KEY `fk_bible_study_creator` (`created_by`),
  ADD KEY `idx_date` (`study_date`),
  ADD KEY `idx_status` (`status`);

--
-- Indexes for table `bible_study_registrations`
--
ALTER TABLE `bible_study_registrations`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_registration` (`session_id`,`user_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `idx_registrations_session` (`session_id`),
  ADD KEY `idx_registrations_location` (`location_id`),
  ADD KEY `idx_registrations_status` (`status`),
  ADD KEY `idx_registrations_group` (`group_number`);

--
-- Indexes for table `bible_study_sessions`
--
ALTER TABLE `bible_study_sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `created_by` (`created_by`),
  ADD KEY `idx_sessions_deadline` (`registration_deadline`),
  ADD KEY `idx_sessions_open` (`is_open`);

--
-- Indexes for table `blogs`
--
ALTER TABLE `blogs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD KEY `fk_blog_author` (`author_id`),
  ADD KEY `fk_blog_approver` (`approved_by`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `idx_category` (`category`),
  ADD KEY `idx_published_at` (`published_at`),
  ADD KEY `idx_slug` (`slug`);

--
-- Indexes for table `blog_categories`
--
ALTER TABLE `blog_categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD KEY `idx_slug` (`slug`);

--
-- Indexes for table `blog_comments`
--
ALTER TABLE `blog_comments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_blog_comment_author` (`author_id`),
  ADD KEY `fk_blog_comment_parent` (`parent_id`),
  ADD KEY `idx_post` (`post_id`),
  ADD KEY `idx_status` (`status`);

--
-- Indexes for table `donations`
--
ALTER TABLE `donations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_donation_donor` (`donor_id`),
  ADD KEY `fk_donation_category` (`category_id`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `idx_date` (`donation_date`),
  ADD KEY `idx_method` (`payment_method`);

--
-- Indexes for table `donation_categories`
--
ALTER TABLE `donation_categories`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_status` (`status`);

--
-- Indexes for table `election_positions`
--
ALTER TABLE `election_positions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_election` (`election_id`),
  ADD KEY `idx_order` (`display_order`);

--
-- Indexes for table `email_verification_tokens`
--
ALTER TABLE `email_verification_tokens`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_email_verification_user` (`user_id`),
  ADD KEY `idx_token` (`token`);

--
-- Indexes for table `events`
--
ALTER TABLE `events`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_event_creator` (`created_by`),
  ADD KEY `idx_event_date` (`event_date`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `idx_category` (`category`);

--
-- Indexes for table `event_registrations`
--
ALTER TABLE `event_registrations`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_event_user` (`event_id`,`user_id`),
  ADD KEY `idx_event` (`event_id`),
  ADD KEY `idx_user` (`user_id`);

--
-- Indexes for table `galleries`
--
ALTER TABLE `galleries`
  ADD PRIMARY KEY (`id`),
  ADD KEY `updated_by` (`updated_by`),
  ADD KEY `idx_category` (`category`),
  ADD KEY `idx_is_active` (`is_active`),
  ADD KEY `idx_created_by` (`created_by`),
  ADD KEY `idx_view_count` (`view_count`);

--
-- Indexes for table `leaders`
--
ALTER TABLE `leaders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_leader_creator` (`created_by`),
  ADD KEY `idx_position` (`position`),
  ADD KEY `idx_display_order` (`display_order`),
  ADD KEY `idx_status` (`status`);

--
-- Indexes for table `leadership_positions`
--
ALTER TABLE `leadership_positions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_leadership_user` (`user_id`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `idx_term` (`term_start`,`term_end`);

--
-- Indexes for table `leader_elections`
--
ALTER TABLE `leader_elections`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `idx_dates` (`start_date`,`end_date`),
  ADD KEY `fk_election_creator` (`created_by`);

--
-- Indexes for table `leader_nominations`
--
ALTER TABLE `leader_nominations`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_nomination` (`election_id`,`nominator_id`,`nominee_id`),
  ADD KEY `idx_election` (`election_id`),
  ADD KEY `idx_nominator` (`nominator_id`),
  ADD KEY `idx_nominee` (`nominee_id`);

--
-- Indexes for table `media_configuration`
--
ALTER TABLE `media_configuration`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `config_key` (`config_key`),
  ADD KEY `fk_media_config_updater` (`updated_by`);

--
-- Indexes for table `media_files`
--
ALTER TABLE `media_files`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_media_file_uploader` (`uploaded_by`),
  ADD KEY `idx_type` (`file_type`),
  ADD KEY `idx_context` (`usage_context`);

--
-- Indexes for table `ministries`
--
ALTER TABLE `ministries`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_ministry_leader` (`leader_id`),
  ADD KEY `fk_ministry_assistant_leader` (`assistant_leader_id`),
  ADD KEY `idx_status` (`status`);

--
-- Indexes for table `ministry_members`
--
ALTER TABLE `ministry_members`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_ministry_user` (`ministry_id`,`user_id`),
  ADD KEY `idx_ministry` (`ministry_id`),
  ADD KEY `idx_user` (`user_id`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_password_reset_user` (`user_id`),
  ADD KEY `idx_token` (`token`),
  ADD KEY `idx_expires` (`expires_at`);

--
-- Indexes for table `prayer_requests`
--
ALTER TABLE `prayer_requests`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_prayer_request_requester` (`requester_id`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `idx_is_public` (`is_public`),
  ADD KEY `idx_category` (`category`);

--
-- Indexes for table `reading_progress`
--
ALTER TABLE `reading_progress`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_user_date` (`user_id`,`reading_date`),
  ADD KEY `idx_user_id` (`user_id`),
  ADD KEY `idx_reading_date` (`reading_date`);

--
-- Indexes for table `sermons`
--
ALTER TABLE `sermons`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_sermon_creator` (`created_by`),
  ADD KEY `idx_sermon_date` (`sermon_date`),
  ADD KEY `idx_series_name` (`series_name`),
  ADD KEY `idx_featured` (`featured`),
  ADD KEY `idx_status` (`status`);

--
-- Indexes for table `study_group_settings`
--
ALTER TABLE `study_group_settings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_session_location` (`session_id`,`location_id`),
  ADD KEY `location_id` (`location_id`);

--
-- Indexes for table `study_locations`
--
ALTER TABLE `study_locations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `registration_number` (`registration_number`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idx_registration_number` (`registration_number`),
  ADD KEY `idx_email` (`email`),
  ADD KEY `idx_member_type` (`member_type`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `idx_reset_token` (`reset_token`);

--
-- Indexes for table `user_bookmarks`
--
ALTER TABLE `user_bookmarks`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_user_type` (`user_id`,`bookmark_type`),
  ADD KEY `idx_reference` (`reference_id`);

--
-- Indexes for table `user_prayer_requests`
--
ALTER TABLE `user_prayer_requests`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_user_id` (`user_id`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `idx_category` (`category`);

--
-- Indexes for table `verse_of_day`
--
ALTER TABLE `verse_of_day`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `date` (`date`),
  ADD KEY `fk_verse_creator` (`created_by`),
  ADD KEY `idx_date` (`date`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `announcements`
--
ALTER TABLE `announcements`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `bible_reading_calendar`
--
ALTER TABLE `bible_reading_calendar`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `bible_studies`
--
ALTER TABLE `bible_studies`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `bible_study_registrations`
--
ALTER TABLE `bible_study_registrations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `bible_study_sessions`
--
ALTER TABLE `bible_study_sessions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `blogs`
--
ALTER TABLE `blogs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `blog_categories`
--
ALTER TABLE `blog_categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `blog_comments`
--
ALTER TABLE `blog_comments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `donations`
--
ALTER TABLE `donations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `donation_categories`
--
ALTER TABLE `donation_categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `election_positions`
--
ALTER TABLE `election_positions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `email_verification_tokens`
--
ALTER TABLE `email_verification_tokens`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `events`
--
ALTER TABLE `events`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `event_registrations`
--
ALTER TABLE `event_registrations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `galleries`
--
ALTER TABLE `galleries`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `leaders`
--
ALTER TABLE `leaders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `leadership_positions`
--
ALTER TABLE `leadership_positions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `leader_elections`
--
ALTER TABLE `leader_elections`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `leader_nominations`
--
ALTER TABLE `leader_nominations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `media_configuration`
--
ALTER TABLE `media_configuration`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `media_files`
--
ALTER TABLE `media_files`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `ministries`
--
ALTER TABLE `ministries`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `ministry_members`
--
ALTER TABLE `ministry_members`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `prayer_requests`
--
ALTER TABLE `prayer_requests`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `reading_progress`
--
ALTER TABLE `reading_progress`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `sermons`
--
ALTER TABLE `sermons`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `study_group_settings`
--
ALTER TABLE `study_group_settings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `study_locations`
--
ALTER TABLE `study_locations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `user_bookmarks`
--
ALTER TABLE `user_bookmarks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_prayer_requests`
--
ALTER TABLE `user_prayer_requests`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `verse_of_day`
--
ALTER TABLE `verse_of_day`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `announcements`
--
ALTER TABLE `announcements`
  ADD CONSTRAINT `fk_announcement_creator` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `bible_reading_calendar`
--
ALTER TABLE `bible_reading_calendar`
  ADD CONSTRAINT `fk_reading_calendar_creator` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `bible_studies`
--
ALTER TABLE `bible_studies`
  ADD CONSTRAINT `fk_bible_study_creator` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_bible_study_facilitator` FOREIGN KEY (`facilitator_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_bible_study_ministry` FOREIGN KEY (`ministry_id`) REFERENCES `ministries` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `bible_study_registrations`
--
ALTER TABLE `bible_study_registrations`
  ADD CONSTRAINT `bible_study_registrations_ibfk_1` FOREIGN KEY (`session_id`) REFERENCES `bible_study_sessions` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `bible_study_registrations_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `bible_study_registrations_ibfk_3` FOREIGN KEY (`location_id`) REFERENCES `study_locations` (`id`);

--
-- Constraints for table `bible_study_sessions`
--
ALTER TABLE `bible_study_sessions`
  ADD CONSTRAINT `bible_study_sessions_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `blogs`
--
ALTER TABLE `blogs`
  ADD CONSTRAINT `fk_blog_approver` FOREIGN KEY (`approved_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_blog_author` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `blog_comments`
--
ALTER TABLE `blog_comments`
  ADD CONSTRAINT `fk_blog_comment_author` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_blog_comment_parent` FOREIGN KEY (`parent_id`) REFERENCES `blog_comments` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_blog_comment_post` FOREIGN KEY (`post_id`) REFERENCES `blogs` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `donations`
--
ALTER TABLE `donations`
  ADD CONSTRAINT `fk_donation_category` FOREIGN KEY (`category_id`) REFERENCES `donation_categories` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_donation_donor` FOREIGN KEY (`donor_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `election_positions`
--
ALTER TABLE `election_positions`
  ADD CONSTRAINT `fk_position_election` FOREIGN KEY (`election_id`) REFERENCES `leader_elections` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `email_verification_tokens`
--
ALTER TABLE `email_verification_tokens`
  ADD CONSTRAINT `fk_email_verification_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `events`
--
ALTER TABLE `events`
  ADD CONSTRAINT `fk_event_creator` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `event_registrations`
--
ALTER TABLE `event_registrations`
  ADD CONSTRAINT `fk_event_registration_event` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_event_registration_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `galleries`
--
ALTER TABLE `galleries`
  ADD CONSTRAINT `galleries_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `galleries_ibfk_2` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `leaders`
--
ALTER TABLE `leaders`
  ADD CONSTRAINT `fk_leader_creator` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `leadership_positions`
--
ALTER TABLE `leadership_positions`
  ADD CONSTRAINT `fk_leadership_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `leader_elections`
--
ALTER TABLE `leader_elections`
  ADD CONSTRAINT `fk_election_creator` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `leader_nominations`
--
ALTER TABLE `leader_nominations`
  ADD CONSTRAINT `fk_nomination_election` FOREIGN KEY (`election_id`) REFERENCES `leader_elections` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_nomination_nominator` FOREIGN KEY (`nominator_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_nomination_nominee` FOREIGN KEY (`nominee_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `media_configuration`
--
ALTER TABLE `media_configuration`
  ADD CONSTRAINT `fk_media_config_updater` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `media_files`
--
ALTER TABLE `media_files`
  ADD CONSTRAINT `fk_media_file_uploader` FOREIGN KEY (`uploaded_by`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `ministries`
--
ALTER TABLE `ministries`
  ADD CONSTRAINT `fk_ministry_assistant_leader` FOREIGN KEY (`assistant_leader_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_ministry_leader` FOREIGN KEY (`leader_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `ministry_members`
--
ALTER TABLE `ministry_members`
  ADD CONSTRAINT `fk_ministry_member_ministry` FOREIGN KEY (`ministry_id`) REFERENCES `ministries` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_ministry_member_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD CONSTRAINT `fk_password_reset_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `prayer_requests`
--
ALTER TABLE `prayer_requests`
  ADD CONSTRAINT `fk_prayer_request_requester` FOREIGN KEY (`requester_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `reading_progress`
--
ALTER TABLE `reading_progress`
  ADD CONSTRAINT `fk_reading_progress_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `sermons`
--
ALTER TABLE `sermons`
  ADD CONSTRAINT `fk_sermon_creator` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `study_group_settings`
--
ALTER TABLE `study_group_settings`
  ADD CONSTRAINT `study_group_settings_ibfk_1` FOREIGN KEY (`session_id`) REFERENCES `bible_study_sessions` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `study_group_settings_ibfk_2` FOREIGN KEY (`location_id`) REFERENCES `study_locations` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `user_bookmarks`
--
ALTER TABLE `user_bookmarks`
  ADD CONSTRAINT `fk_bookmark_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `user_prayer_requests`
--
ALTER TABLE `user_prayer_requests`
  ADD CONSTRAINT `fk_user_prayer_request_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `verse_of_day`
--
ALTER TABLE `verse_of_day`
  ADD CONSTRAINT `fk_verse_creator` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
