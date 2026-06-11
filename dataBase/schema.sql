CREATE DATABASE IF NOT EXISTS travel_app;
USE travel_app;
 
----------------------------------------------------
-- DROP TABLES (איפוס מסד נתונים)
----------------------------------------------------
SET FOREIGN_KEY_CHECKS = 0;
 
DROP TABLE IF EXISTS review_helpful;
DROP TABLE IF EXISTS media;
DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS favorites;
DROP TABLE IF EXISTS places;
DROP TABLE IF EXISTS credentials;
DROP TABLE IF EXISTS users;
 
SET FOREIGN_KEY_CHECKS = 1;
 
----------------------------------------------------
-- CREATE TABLES
----------------------------------------------------
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    user_type VARCHAR(20) NOT NULL CHECK (user_type IN ('user', 'admin'))
);
 
CREATE TABLE credentials (
    user_id INT PRIMARY KEY REFERENCES users(user_id) ON DELETE CASCADE,
    password_hash VARCHAR(255) NOT NULL
);
 
CREATE TABLE places (
    place_id INT AUTO_INCREMENT PRIMARY KEY,
    created_by INT REFERENCES users(user_id) ON DELETE SET NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    categories JSON NOT NULL,
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    opening_hours JSON,
    is_approved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
 
CREATE TABLE favorites (
    favorite_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    place_id INT NOT NULL REFERENCES places(place_id) ON DELETE CASCADE,
    order_index INT NOT NULL DEFAULT 0,
    UNIQUE(user_id, place_id)
);
 
CREATE TABLE reviews (
    review_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    place_id INT NOT NULL REFERENCES places(place_id) ON DELETE CASCADE,
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
 
CREATE TABLE review_helpful (
    id INT AUTO_INCREMENT PRIMARY KEY,
    review_id INT NOT NULL,
    user_id INT NOT NULL,
    vote ENUM('up', 'down') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (review_id) REFERENCES reviews(review_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id)   REFERENCES users(user_id)     ON DELETE CASCADE,
    UNIQUE KEY unique_vote (review_id, user_id)
);
 
CREATE TABLE media (
    media_id INT AUTO_INCREMENT PRIMARY KEY,
    place_id INT REFERENCES places(place_id) ON DELETE CASCADE,
    user_id INT REFERENCES users(user_id) ON DELETE SET NULL,
    media_type VARCHAR(20) NOT NULL CHECK (media_type IN ('image', 'video', 'audio')),
    media_url VARCHAR(255) NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);