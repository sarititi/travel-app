import pool from '../config/db.js';

// יצירת place רגיל
export const createPlace = async (userId, name, description, categories, latitude, longitude, openingHours) => {
    const [result] = await pool.query(
        `INSERT INTO places (created_by, name, description, categories, latitude, longitude, opening_hours, is_approved)
         VALUES (?, ?, ?, ?, ?, ?, ?, FALSE)`,
        [
            userId,
            name,
            description,
            JSON.stringify(categories),          // categories — מערך → JSON string
            latitude,
            longitude,
            openingHours ? JSON.stringify(openingHours) : null
        ]
    );
    return {
        place_id:     result.insertId,
        created_by:   userId,
        name,
        description,
        categories,
        latitude,
        longitude,
        opening_hours: openingHours || null,
        is_approved:   false,
        created_at:    new Date()
    };
};

// שליפת place יחיד לפי ID — כולל created_by
export const getPlaceById = async (placeId) => {
    const [rows] = await pool.query(
        `SELECT
            p.place_id,
            p.created_by,
            p.name,
            p.description,
            p.categories,
            p.latitude,
            p.longitude,
            p.opening_hours,
            p.is_approved,
            p.created_at,
            u.username AS created_by_username,
            u.user_id  AS created_by_id
         FROM places p
         LEFT JOIN users u ON p.created_by = u.user_id
         WHERE p.place_id = ?`,
        [placeId]
    );
    if (!rows[0]) return null;

    const place = rows[0];
    // MySQL מחזיר JSON columns כ-string — נמיר למערך
    if (typeof place.categories === 'string') {
        place.categories = JSON.parse(place.categories);
    }
    if (typeof place.opening_hours === 'string') {
        place.opening_hours = JSON.parse(place.opening_hours);
    }
    return place;
};

// עדכון place
export const updatePlace = async (placeId, name, description, categories, latitude, longitude, openingHours) => {
    const [result] = await pool.query(
        `UPDATE places
         SET name = ?, description = ?, categories = ?, latitude = ?, longitude = ?, opening_hours = ?
         WHERE place_id = ?`,
        [
            name,
            description,
            JSON.stringify(categories),
            latitude,
            longitude,
            openingHours ? JSON.stringify(openingHours) : null,
            placeId
        ]
    );
    return result.affectedRows > 0;
};

// מחיקת place
export const deletePlace = async (placeId) => {
    const [result] = await pool.query(
        `DELETE FROM places
         WHERE place_id = ?`,
        [placeId]
    );
    return result.affectedRows > 0;
};

export const fetchPlaces = async (conditions = [], params = [], limit, offset) => {
    const WHERE = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    const [[{ total }]] = await pool.query(
        `SELECT COUNT(*) AS total FROM places p ${WHERE}`,
        params
    );

    const [places] = await pool.query(
        `SELECT
            p.place_id,
            p.name,
            p.description,
            p.categories,
            p.latitude,
            p.longitude,
            p.opening_hours,
            p.is_approved,
            p.created_at,
            u.username AS created_by_username,
            u.user_id  AS created_by_id
         FROM places p
         LEFT JOIN users u ON p.created_by = u.user_id
         ${WHERE}
         ORDER BY p.place_id DESC
         LIMIT ? OFFSET ?`,
        [...params, limit, offset]
    );

    // המר categories ו-opening_hours מ-string ל-object/array לכל שורה
    const parsed = places.map(place => ({
        ...place,
        categories:    typeof place.categories    === 'string' ? JSON.parse(place.categories)    : (place.categories    ?? []),
        opening_hours: typeof place.opening_hours === 'string' ? JSON.parse(place.opening_hours) : (place.opening_hours ?? null),
    }));

    return { places: parsed, total };
};
