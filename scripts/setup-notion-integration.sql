-- This script sets up the database tables for caching Notion data
-- Run this to improve performance by caching frequently accessed data

CREATE TABLE IF NOT EXISTS authors (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  avatar TEXT,
  bio TEXT,
  twitter VARCHAR(255),
  linkedin VARCHAR(255),
  github VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS posts (
  id VARCHAR(255) PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  excerpt TEXT,
  content LONGTEXT,
  cover_image TEXT,
  published_at TIMESTAMP,
  updated_at TIMESTAMP,
  category VARCHAR(255),
  author_id VARCHAR(255),
  featured BOOLEAN DEFAULT FALSE,
  reading_time INT DEFAULT 0,
  notion_page_id VARCHAR(255) UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (author_id) REFERENCES authors(id)
);

CREATE TABLE IF NOT EXISTS post_tags (
  id INT AUTO_INCREMENT PRIMARY KEY,
  post_id VARCHAR(255),
  tag VARCHAR(255),
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
  UNIQUE KEY unique_post_tag (post_id, tag)
);

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  active BOOLEAN DEFAULT TRUE
);

-- Insert sample authors
INSERT INTO authors (id, name, avatar, bio, twitter, linkedin) VALUES
('1', 'Sarah Chen', '/placeholder.svg?height=100&width=100', 'Senior Product Manager with 8+ years of experience in enterprise software. Passionate about user experience and data-driven decisions.', 'sarahchen', 'sarahchen'),
('2', 'Marcus Rodriguez', '/placeholder.svg?height=100&width=100', 'Full-stack developer and technical writer. Loves exploring new technologies and sharing knowledge with the community.', 'marcusdev', 'marcusrodriguez')
ON DUPLICATE KEY UPDATE name=VALUES(name);
