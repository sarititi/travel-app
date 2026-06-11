----------------------------------------------------
-- INSERT DATA
----------------------------------------------------
INSERT INTO users (user_id, username, email, user_type) VALUES
(1, 'admin', 'admin@test.com', 'admin'),
(3, 'regular_user', 'user@test.com', 'user');
 
INSERT INTO credentials (user_id, password_hash) VALUES
(1, 'hashed_password_admin'),
(3, 'hashed_password_user');
 
INSERT INTO places (
    created_by, name, description, categories,
    latitude, longitude, opening_hours, is_approved
) VALUES (
    1,
    'עין עבדת',
    'מסלול עין עבדת: נווה מדבר בנגב... (תוכן מקוצר כאן לצורך דוגמה)',
    '["משפחתי", "חינמי", "יבש"]',
    32.0853, 34.7818, NULL, 1
),
(
    1,
    'City Museum',
    'Modern art and history museum',
    '["museum", "art", "culture"]',
    32.0809, 34.7806, NULL, 1
);
 
INSERT INTO favorites (favorite_id, user_id, place_id) VALUES
(1, 3, 1);
 
INSERT INTO reviews (review_id, user_id, place_id, rating, comment) VALUES
(1, 3, 1, 5, 'Amazing place, great vibe!');
 
INSERT INTO media (media_id, place_id, user_id, media_type, media_url) VALUES
(1, 1, 3, 'image', 'https://example.com/image1.jpg');
 