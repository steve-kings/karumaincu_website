-- =====================================================
-- KarUCU Main Campus Database Schema
-- Karatina University Christian Union Management System
-- =====================================================

-- Create Database
CREATE DATABASE IF NOT EXISTS karucu_main_campus 
CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE karucu_main_campus;

-- =====================================================
-- USERS & AUTHENTICATION TABLES
-- =====================================================

-- Users Table (Core user information)
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    registration_number VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    member_type ENUM('student', 'associate') NOT NULL,
    role ENUM('member', 'editor', 'admin') DEFAULT 'member',
    status ENUM('active', 'inactive', 'pending') DEFAULT 'pending',
    course VARCHAR(255),
    year_of_study INT,
    staff_id VARCHAR(50),
    alumni_year INT,
    doctrinal_agreement BOOLEAN DEFAULT FALSE,
    profile_image VARCHAR(255),
    reset_token VARCHAR(255) DEFAULT NULL,
    reset_token_expiry DATETIME DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    
    INDEX idx_registration_number (registration_number),
    INDEX idx_email (email),
    INDEX idx_member_type (member_type),
    INDEX idx_status (status),
    INDEX idx_reset_token (reset_token)
);

-- Password Reset Tokens
CREATE TABLE password_reset_tokens (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    token VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_password_reset_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_token (token),
    INDEX idx_expires (expires_at)
);

-- Email Verification Tokens
CREATE TABLE email_verification_tokens (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    token VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_email_verification_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_token (token)
);

-- =====================================================
-- MINISTRIES & LEADERSHIP TABLES
-- =====================================================

-- Ministries Table
CREATE TABLE ministries (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    leader_id INT,
    assistant_leader_id INT,
    status ENUM('active', 'inactive') DEFAULT 'active',
    meeting_day ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'),
    meeting_time TIME,
    meeting_location VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_ministry_leader FOREIGN KEY (leader_id) REFERENCES users(id) ON DELETE SET NULL,
    CONSTRAINT fk_ministry_assistant_leader FOREIGN KEY (assistant_leader_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_status (status)
);

-- Ministry Members (Many-to-Many relationship)
CREATE TABLE ministry_members (
    id INT PRIMARY KEY AUTO_INCREMENT,
    ministry_id INT NOT NULL,
    user_id INT NOT NULL,
    position ENUM('member', 'coordinator', 'assistant') DEFAULT 'member',
    joined_date DATE DEFAULT (CURRENT_DATE),
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_ministry_member_ministry FOREIGN KEY (ministry_id) REFERENCES ministries(id) ON DELETE CASCADE,
    CONSTRAINT fk_ministry_member_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_ministry_user (ministry_id, user_id),
    INDEX idx_ministry (ministry_id),
    INDEX idx_user (user_id)
);

-- Leadership Positions
CREATE TABLE leadership_positions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    user_id INT,
    term_start DATE,
    term_end DATE,
    status ENUM('active', 'completed', 'interim') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_leadership_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_status (status),
    INDEX idx_term (term_start, term_end)
);

-- =====================================================
-- EVENTS & ACTIVITIES TABLES
-- =====================================================

-- Events Table
CREATE TABLE events (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    event_date DATETIME NOT NULL,
    end_date DATETIME,
    location VARCHAR(255),
    venue_details TEXT,
    capacity INT DEFAULT 0,
    registration_required BOOLEAN DEFAULT FALSE,
    registration_deadline DATETIME,
    featured_image VARCHAR(255),
    category VARCHAR(100),
    status ENUM('draft', 'published', 'cancelled', 'completed') DEFAULT 'draft',
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_event_creator FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_event_date (event_date),
    INDEX idx_status (status),
    INDEX idx_category (category)
);

-- Event Registrations
CREATE TABLE event_registrations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    event_id INT NOT NULL,
    user_id INT NOT NULL,
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    attendance_status ENUM('registered', 'attended', 'absent', 'cancelled') DEFAULT 'registered',
    notes TEXT,
    
    CONSTRAINT fk_event_registration_event FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    CONSTRAINT fk_event_registration_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_event_user (event_id, user_id),
    INDEX idx_event (event_id),
    INDEX idx_user (user_id)
);

-- Announcements Table
CREATE TABLE announcements (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    category ENUM('general', 'urgent', 'event') DEFAULT 'general',
    priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
    status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
    featured_image VARCHAR(255),
    scheduled_at TIMESTAMP NULL,
    expires_at TIMESTAMP NULL,
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_announcement_creator FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_status (status),
    INDEX idx_category (category),
    INDEX idx_created_at (created_at)
);

-- =====================================================
-- SPIRITUAL CONTENT TABLES
-- =====================================================

-- Bible Study Materials
CREATE TABLE bible_studies (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(200) NOT NULL,
    scripture_reference VARCHAR(100),
    content TEXT NOT NULL,
    study_date DATE,
    facilitator_id INT,
    ministry_id INT,
    status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_bible_study_facilitator FOREIGN KEY (facilitator_id) REFERENCES users(id) ON DELETE SET NULL,
    CONSTRAINT fk_bible_study_ministry FOREIGN KEY (ministry_id) REFERENCES ministries(id) ON DELETE SET NULL,
    CONSTRAINT fk_bible_study_creator FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_date (study_date),
    INDEX idx_status (status)
);

-- Sermons Table
CREATE TABLE sermons (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    youtube_url VARCHAR(500) NOT NULL,
    youtube_id VARCHAR(50),
    thumbnail_url VARCHAR(500),
    speaker VARCHAR(255),
    sermon_date DATE,
    series_name VARCHAR(255),
    scripture_reference VARCHAR(255),
    duration INT, -- in seconds
    view_count INT DEFAULT 0,
    featured BOOLEAN DEFAULT FALSE,
    status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_sermon_creator FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_sermon_date (sermon_date),
    INDEX idx_series_name (series_name),
    INDEX idx_featured (featured),
    INDEX idx_status (status)
);

-- Prayer Requests Table
CREATE TABLE prayer_requests (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(100),
    is_public BOOLEAN DEFAULT TRUE,
    is_anonymous BOOLEAN DEFAULT FALSE,
    status ENUM('active', 'answered', 'archived') DEFAULT 'active',
    requester_id INT,
    answered_at TIMESTAMP NULL,
    testimony TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_prayer_request_requester FOREIGN KEY (requester_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_status (status),
    INDEX idx_is_public (is_public),
    INDEX idx_category (category)
);

-- Verse of Day Table
CREATE TABLE verse_of_day (
    id INT PRIMARY KEY AUTO_INCREMENT,
    verse_reference VARCHAR(255) NOT NULL,
    verse_text TEXT NOT NULL,
    commentary TEXT,
    date DATE UNIQUE NOT NULL,
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_verse_creator FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_date (date)
);

-- Bible Reading Calendar Table
CREATE TABLE bible_reading_calendar (
    id INT PRIMARY KEY AUTO_INCREMENT,
    month INT NOT NULL,
    year INT NOT NULL,
    day INT NOT NULL,
    book VARCHAR(100) NOT NULL,
    chapter_start INT NOT NULL,
    chapter_end INT,
    verse_start INT,
    verse_end INT,
    devotional_note TEXT,
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_reading_calendar_creator FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_date (year, month, day),
    INDEX idx_date (year, month, day)
);

-- Reading Progress Table
CREATE TABLE reading_progress (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    reading_date DATE NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP NULL,
    
    CONSTRAINT fk_reading_progress_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_date (user_id, reading_date),
    INDEX idx_user_id (user_id),
    INDEX idx_reading_date (reading_date)
);

-- User Prayer Requests (Personal Prayer Journal)
CREATE TABLE user_prayer_requests (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(100) DEFAULT 'personal',
    priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
    status ENUM('active', 'answered', 'archived') DEFAULT 'active',
    is_private BOOLEAN DEFAULT TRUE,
    answered_at TIMESTAMP NULL,
    testimony TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_user_prayer_request_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    INDEX idx_category (category)
);

-- Blog Categories Table
CREATE TABLE blog_categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    slug VARCHAR(100) UNIQUE NOT NULL,
    color VARCHAR(7) DEFAULT '#6366f1',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_slug (slug)
);

-- User Bookmarks (for Bible verses, blogs, etc.)
CREATE TABLE user_bookmarks (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    bookmark_type ENUM('verse', 'blog', 'sermon', 'prayer') NOT NULL,
    reference_id INT,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_bookmark_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_type (user_id, bookmark_type),
    INDEX idx_reference (reference_id)
);

-- Leaders Table
CREATE TABLE leaders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    full_name VARCHAR(255) NOT NULL,
    position VARCHAR(255) NOT NULL,
    bio TEXT,
    photo_url VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(20),
    display_order INT DEFAULT 0,
    status ENUM('active', 'inactive') DEFAULT 'active',
    term_start DATE,
    term_end DATE,
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_leader_creator FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_position (position),
    INDEX idx_display_order (display_order),
    INDEX idx_status (status)
);

-- Media Configuration Table
CREATE TABLE media_configuration (
    id INT PRIMARY KEY AUTO_INCREMENT,
    config_key VARCHAR(100) UNIQUE NOT NULL,
    config_value TEXT,
    description TEXT,
    updated_by INT NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_media_config_updater FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE CASCADE
);

-- =====================================================
-- BLOG & MEDIA TABLES
-- =====================================================

-- Blogs Table
CREATE TABLE blogs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    content LONGTEXT NOT NULL,
    excerpt TEXT,
    featured_image VARCHAR(255),
    category VARCHAR(100),
    tags JSON,
    status ENUM('draft', 'pending', 'approved', 'rejected') DEFAULT 'draft',
    rejection_reason TEXT,
    slug VARCHAR(255) UNIQUE,
    view_count INT DEFAULT 0,
    author_id INT NOT NULL,
    approved_by INT NULL,
    approved_at TIMESTAMP NULL,
    published_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_blog_author FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_blog_approver FOREIGN KEY (approved_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_status (status),
    INDEX idx_category (category),
    INDEX idx_published_at (published_at),
    INDEX idx_slug (slug)
);

-- Blog Comments
CREATE TABLE blog_comments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    post_id INT NOT NULL,
    author_id INT,
    author_name VARCHAR(100),
    author_email VARCHAR(100),
    content TEXT NOT NULL,
    parent_id INT NULL,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_blog_comment_post FOREIGN KEY (post_id) REFERENCES blogs(id) ON DELETE CASCADE,
    CONSTRAINT fk_blog_comment_author FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL,
    CONSTRAINT fk_blog_comment_parent FOREIGN KEY (parent_id) REFERENCES blog_comments(id) ON DELETE CASCADE,
    INDEX idx_post (post_id),
    INDEX idx_status (status)
);

-- Media Files
CREATE TABLE media_files (
    id INT PRIMARY KEY AUTO_INCREMENT,
    filename VARCHAR(255) NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_type ENUM('image', 'audio', 'video', 'document') NOT NULL,
    mime_type VARCHAR(100),
    file_size INT,
    uploaded_by INT NOT NULL,
    description TEXT,
    alt_text VARCHAR(255),
    usage_context ENUM('blog', 'event', 'sermon', 'profile', 'general') DEFAULT 'general',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_media_file_uploader FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_type (file_type),
    INDEX idx_context (usage_context)
);

-- =====================================================
-- FINANCIAL & DONATIONS TABLES
-- =====================================================

-- Donation Categories
CREATE TABLE donation_categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    target_amount DECIMAL(10,2),
    current_amount DECIMAL(10,2) DEFAULT 0.00,
    status ENUM('active', 'completed', 'paused') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_status (status)
);

-- Donations
CREATE TABLE donations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    donor_id INT,
    donor_name VARCHAR(100),
    donor_email VARCHAR(100),
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'KES',
    category_id INT,
    payment_method ENUM('mpesa', 'bank_transfer', 'cash', 'other') DEFAULT 'mpesa',
    transaction_reference VARCHAR(100),
    status ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending',
    anonymous BOOLEAN DEFAULT FALSE,
    message TEXT,
    donation_date DATE DEFAULT (CURRENT_DATE),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_donation_donor FOREIGN KEY (donor_id) REFERENCES users(id) ON DELETE SET NULL,
    CONSTRAINT fk_donation_category FOREIGN KEY (category_id) REFERENCES donation_categories(id) ON DELETE SET NULL,
    INDEX idx_status (status),
    INDEX idx_date (donation_date),
    INDEX idx_method (payment_method)
);

-- =====================================================
-- EVENTS & ACTIVITIES TABLES
-- =====================================================

-- Events Table
CREATE TABLE events (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    event_date DATETIME NOT NULL,
    end_date DATETIME,
    location VARCHAR(255) NOT NULL,
    venue_details TEXT,
    capacity INT DEFAULT 0,
    registration_required BOOLEAN DEFAULT FALSE,
    registration_deadline DATETIME,
    featured_image VARCHAR(255),
    category VARCHAR(100),
    status ENUM('draft', 'published', 'cancelled', 'completed') DEFAULT 'published',
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_event_creator FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_event_date (event_date),
    INDEX idx_status (status),
    INDEX idx_category (category)
);

-- Event Registrations Table
CREATE TABLE event_registrations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    event_id INT NOT NULL,
    user_id INT NOT NULL,
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    attendance_status ENUM('registered', 'attended', 'absent', 'cancelled') DEFAULT 'registered',
    notes TEXT,
    
    CONSTRAINT fk_registration_event FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    CONSTRAINT fk_registration_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_registration (event_id, user_id),
    INDEX idx_event_id (event_id),
    INDEX idx_user_id (user_id)
);

-- =====================================================
-- SYSTEM TABLES
-- =====================================================

-- System Settings
CREATE TABLE system_settings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    setting_type ENUM('string', 'number', 'boolean', 'json') DEFAULT 'string',
    description TEXT,
    updated_by INT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_system_settings_updater FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_key (setting_key)
);

-- Activity Logs
CREATE TABLE activity_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50),
    entity_id INT,
    description TEXT,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_activity_log_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_user (user_id),
    INDEX idx_action (action),
    INDEX idx_entity (entity_type, entity_id),
    INDEX idx_created (created_at)
);

-- =====================================================
-- INITIAL DATA INSERTION
-- =====================================================

-- Insert Default Ministries
INSERT INTO ministries (name, description, meeting_day, meeting_time, meeting_location, status) VALUES
('Prayer Ministry', 'Dedicated to intercession and spiritual warfare for the campus and community', 'Friday', '18:00:00', 'Main Chapel', 'active'),
('Music Ministry', 'Praise and worship, choir, and technical support for services', 'Wednesday', '17:00:00', 'Music Room', 'active'),
('Creative Arts Ministry', 'Art, poetry, theatre, dance, and creative expression', 'Thursday', '16:00:00', 'Arts Hall', 'active'),
('Media Ministry', 'ICT, editorial, magazine, and digital content creation', 'Tuesday', '19:00:00', 'Computer Lab', 'active'),
('Bible Study & Discipleship', 'Bible study groups, BEST P class, discipleship and nurture classes', 'Wednesday', '18:00:00', 'Classroom A', 'active'),
('Missions & Evangelism', 'Campus Evangelism Team (CET) and outreach programs', 'Saturday', '14:00:00', 'Main Hall', 'active'),
('Gents Fellowship', 'Men''s fellowship and brotherhood activities', 'Sunday', '15:00:00', 'Conference Room', 'active'),
('Ladies Fellowship', 'Women''s fellowship and sisterhood activities', 'Sunday', '15:00:00', 'Ladies Lounge', 'active'),
('Hospitality Ministry', 'Catering and ushering departments', 'Monday', '17:00:00', 'Kitchen Area', 'active'),
('Finance & Auditing', 'Financial management and strategic development', 'Friday', '16:00:00', 'Office', 'active');

-- Insert Default Admin User
INSERT INTO users (
    registration_number, 
    email, 
    password_hash, 
    full_name, 
    phone, 
    member_type, 
    role, 
    status, 
    doctrinal_agreement,
    created_at,
    updated_at
) VALUES (
    'ADMIN001',
    'kingscreationagency635@gmail.com',
    '$2b$12$LQv3c1yqBwEHFuT4QjEM8ue5yDua7ft9ma/ucdHf.rVHFuW6qMjPG', -- This is the hash for '@Kings635'
    'Kings Creation Agency',
    '+254700000000',
    'associate',
    'admin',
    'active',
    TRUE,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- Insert Default Leadership Positions
INSERT INTO leadership_positions (title, description, status) VALUES
('Chairperson', 'Overall leader of KarUCU Main Campus', 'active'),
('Vice Chairperson', 'Assistant to the chairperson and deputy leader', 'active'),
('Secretary General', 'Records and documentation management', 'active'),
('Assistant Secretary', 'Assists the secretary general', 'active'),
('Treasurer', 'Financial management and accountability', 'active'),
('Assistant Treasurer', 'Assists the treasurer', 'active'),
('Organizing Secretary', 'Event planning and coordination', 'active'),
('Chaplain', 'Spiritual guidance and pastoral care', 'active'),
('Assistant Chaplain', 'Assists the chaplain in spiritual matters', 'active'),
('Academic Secretary', 'Academic affairs and student support', 'active');

-- Insert Default Donation Categories
INSERT INTO donation_categories (name, description, target_amount, status) VALUES
('General Fund', 'General operations and ministry activities', 50000.00, 'active'),
('Events & Conferences', 'Funding for special events and conferences', 30000.00, 'active'),
('Outreach Programs', 'Community outreach and evangelism activities', 25000.00, 'active'),
('Equipment & Technology', 'Sound systems, instruments, and tech equipment', 40000.00, 'active'),
('Welfare Fund', 'Supporting members in need', 20000.00, 'active'),
('Building & Infrastructure', 'Facility improvements and maintenance', 100000.00, 'active');

-- Insert Default Blog Categories
INSERT INTO blog_categories (name, description, slug, color) VALUES
('Testimony', 'Personal testimonies and faith stories', 'testimony', '#10b981'),
('Bible Study', 'Bible study insights and reflections', 'bible-study', '#3b82f6'),
('Prayer', 'Prayer requests and answered prayers', 'prayer', '#8b5cf6'),
('Ministry', 'Ministry activities and updates', 'ministry', '#f59e0b'),
('Events', 'Event reports and announcements', 'events', '#ef4444'),
('Devotional', 'Daily devotions and spiritual insights', 'devotional', '#06b6d4'),
('Community', 'Community outreach and service', 'community', '#84cc16'),
('Leadership', 'Leadership insights and guidance', 'leadership', '#f97316');

-- Insert Sample Events
INSERT INTO events (title, description, event_date, end_date, location, venue_details, capacity, registration_required, registration_deadline, category, status, created_by) VALUES
('Youth Conference 2024', 'Annual youth conference bringing together young Christians from across the region for worship, teaching, and fellowship.', '2024-12-15 09:00:00', '2024-12-17 18:00:00', 'Karatina University Main Hall', 'Main auditorium with capacity for 500 attendees. Registration required.', 500, TRUE, '2024-12-10 23:59:59', 'Conference', 'published', 1),
('Christmas Celebration', 'Join us for a joyful Christmas celebration with carols, drama, and fellowship as we celebrate the birth of our Savior.', '2024-12-25 15:00:00', '2024-12-25 19:00:00', 'KarUCU Fellowship Hall', 'Fellowship hall decorated for Christmas. Light refreshments will be served.', 200, FALSE, NULL, 'Celebration', 'published', 1),
('New Year Prayer Service', 'Start the new year with prayer and dedication to God. Join us for a powerful time of intercession and worship.', '2025-01-01 06:00:00', '2025-01-01 08:00:00', 'Prayer Garden', 'Outdoor prayer service. Bring a chair or mat. Indoor backup venue available.', 0, FALSE, NULL, 'Prayer', 'published', 1),
('Bible Study Marathon', 'Intensive Bible study session covering the book of Romans. Bring your Bible and notebook for this enriching experience.', '2025-01-10 14:00:00', '2025-01-10 18:00:00', 'Library Conference Room', 'Air-conditioned conference room. Study materials will be provided.', 50, TRUE, '2025-01-08 23:59:59', 'Study', 'published', 1),
('Community Outreach', 'Reach out to the local community with love and practical help. Join us in serving those in need around Karatina.', '2025-01-20 08:00:00', '2025-01-20 16:00:00', 'Karatina Town Center', 'Meet at the town center. Transport will be provided to various outreach locations.', 100, TRUE, '2025-01-18 23:59:59', 'Outreach', 'published', 1),
('Leadership Training Workshop', 'Equipping current and future leaders with biblical principles and practical skills for effective ministry leadership.', '2025-02-01 09:00:00', '2025-02-01 17:00:00', 'Student Center Boardroom', 'Professional training environment with multimedia facilities. Lunch included.', 30, TRUE, '2025-01-28 23:59:59', 'Training', 'published', 1);

-- Insert Default System Settings
INSERT INTO system_settings (setting_key, setting_value, setting_type, description) VALUES
('site_name', 'KarUCU Main Campus', 'string', 'Website name'),
('site_description', 'Karatina University Christian Union Main Campus - Committed to serve the Lord', 'string', 'Website description'),
('contact_email', 'info@karucumain.org', 'string', 'Main contact email'),
('contact_phone', '+254712345678', 'string', 'Main contact phone'),
('meeting_location', 'Karatina University Main Campus Chapel', 'string', 'Default meeting location'),
('registration_open', 'true', 'boolean', 'Whether new member registration is open'),
('max_members_per_ministry', '50', 'number', 'Maximum members allowed per ministry'),
('event_registration_days_ahead', '7', 'number', 'Days ahead events can be registered for'),
('blog_posts_per_page', '10', 'number', 'Number of blog posts per page'),
('enable_donations', 'true', 'boolean', 'Whether donation system is enabled'),
('bible_reading_plan_active', 'true', 'boolean', 'Whether Bible reading plan is active'),
('daily_verse_enabled', 'true', 'boolean', 'Whether daily verse feature is enabled'),
('prayer_journal_enabled', 'true', 'boolean', 'Whether prayer journal feature is enabled');

-- =====================================================
-- GALLERY SYSTEM TABLES
-- =====================================================

-- External Gallery Links Table
CREATE TABLE galleries (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    url VARCHAR(500) NOT NULL,
    category ENUM('worship', 'fellowship', 'outreach', 'events', 'conferences', 'other') DEFAULT 'other',
    thumbnail_url VARCHAR(500),
    platform ENUM('google_photos', 'google_drive', 'dropbox', 'onedrive', 'other') DEFAULT 'other',
    is_active BOOLEAN DEFAULT TRUE,
    view_count INT DEFAULT 0,
    created_by INT NOT NULL,
    updated_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL,
    
    INDEX idx_category (category),
    INDEX idx_is_active (is_active),
    INDEX idx_created_by (created_by),
    INDEX idx_view_count (view_count)
);

-- Insert Sample Gallery Links
INSERT INTO galleries (title, description, url, category, platform, thumbnail_url, is_active, created_by, view_count) VALUES
('Sunday Worship Service - January 2024', 'Photos from our powerful Sunday worship service with amazing testimonies and worship.', 'https://photos.google.com/share/sample-worship-album', 'worship', 'google_photos', 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=300&fit=crop', TRUE, 1, 25),
('Wednesday Fellowship - Prayer Night', 'Powerful prayer meeting with students interceding for the campus and nation.', 'https://drive.google.com/drive/folders/sample-prayer-photos', 'fellowship', 'google_drive', 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop', TRUE, 1, 18),
('Community Outreach - Feeding Program', 'KarUCU members serving the local community with love and compassion.', 'https://photos.google.com/share/sample-outreach-album', 'outreach', 'google_photos', 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=400&h=300&fit=crop', TRUE, 1, 42),
('Leadership Conference 2024', 'Annual leadership conference with inspiring speakers and leadership training sessions.', 'https://drive.google.com/drive/folders/sample-conference-photos', 'conferences', 'google_drive', 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&h=300&fit=crop', TRUE, 1, 67),
('Easter Celebration 2024', 'Celebrating the resurrection of our Lord Jesus Christ with joy and worship.', 'https://photos.google.com/share/sample-easter-album', 'events', 'google_photos', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop', TRUE, 1, 89),
('Bible Study Groups - Small Groups', 'Students diving deep into God\'s Word in small group settings across campus.', 'https://drive.google.com/drive/folders/sample-bible-study-photos', 'fellowship', 'google_drive', 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&h=300&fit=crop', TRUE, 1, 31);

-- =====================================================
-- CREATE VIEWS FOR COMMON QUERIES
-- =====================================================

-- Active Members View
CREATE VIEW active_members AS
SELECT 
    u.id,
    u.registration_number,
    u.full_name,
    u.email,
    u.phone,
    u.course,
    u.year_of_study,
    u.member_type,
    u.role,
    u.created_at,
    COUNT(mm.ministry_id) as ministry_count
FROM users u
LEFT JOIN ministry_members mm ON u.id = mm.user_id AND mm.status = 'active'
WHERE u.status = 'active'
GROUP BY u.id;

-- Ministry Statistics View
CREATE VIEW ministry_stats AS
SELECT 
    m.id,
    m.name,
    m.description,
    COUNT(mm.user_id) as member_count,
    m.meeting_day,
    m.meeting_time,
    m.meeting_location
FROM ministries m
LEFT JOIN ministry_members mm ON m.id = mm.ministry_id AND mm.status = 'active'
WHERE m.status = 'active'
GROUP BY m.id;

-- Gallery Statistics View
CREATE VIEW gallery_stats AS
SELECT 
    g.id,
    g.title,
    g.category,
    g.platform,
    g.view_count,
    g.is_active,
    u.full_name as created_by_name,
    g.created_at
FROM galleries g
LEFT JOIN users u ON g.created_by = u.id
WHERE g.is_active = TRUE
ORDER BY g.view_count DESC;

-- =====================================================
-- END OF SCRIPT
-- =====================================================