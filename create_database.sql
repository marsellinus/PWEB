-- SQL script to create the database and tables for the Portfolio Website

-- Create the database if it doesn't exist
CREATE DATABASE IF NOT EXISTS pweb_db;

-- Use the database
USE pweb_db;

-- Contact form submissions table
CREATE TABLE IF NOT EXISTS contact_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    message TEXT NOT NULL,
    submission_date DATETIME NOT NULL
);

-- Add indexes for better performance
ALTER TABLE contact_messages ADD INDEX idx_email (email);
ALTER TABLE contact_messages ADD INDEX idx_date (submission_date);

-- Optional: Add a sample record for testing
-- INSERT INTO contact_messages (full_name, email, phone, message, submission_date)
-- VALUES ('Test User', 'test@example.com', '+6281234567890', 'This is a test message', NOW());
