import pool from '../config/db.js';

/**
 * שליפת המסלול האישי של המשתמש — מסודר לפי order_index
 */
export const getItineraryByUserId = async (userId) => {
    const [rows] = await pool.query(
        `SELECT
            f.favorite_id,
            f.order_index,
            p.place_id,
            p.name,
            p.description,
            p.category,
            p.latitude,
            p.longitude,
            p.opening_hours,
            p.is_approved
         FROM favorites f
         JOIN places p ON f.place_id = p.place_id
         WHERE f.user_id = ?
         ORDER BY f.order_index ASC`,
        [userId]
    );
    return rows;
};

/**
 * הוספת מקום למסלול — order_index = הסוף (max + 1)
 */
export const addToItinerary = async (userId, placeId) => {
    const [[{ maxOrder }]] = await pool.query(
        `SELECT COALESCE(MAX(order_index), -1) AS maxOrder
         FROM favorites
         WHERE user_id = ?`,
        [userId]
    );

    const [result] = await pool.query(
        `INSERT INTO favorites (user_id, place_id, order_index)
         VALUES (?, ?, ?)`,
        [userId, placeId, maxOrder + 1]
    );

    return {
        favorite_id: result.insertId,
        user_id: userId,
        place_id: placeId,
        order_index: maxOrder + 1
    };
};

/**
 * בדיקה אם מקום כבר קיים במסלול
 */
export const getItineraryEntry = async (userId, placeId) => {
    const [rows] = await pool.query(
        `SELECT favorite_id, user_id, place_id, order_index
         FROM favorites
         WHERE user_id = ? AND place_id = ?`,
        [userId, placeId]
    );
    return rows[0] || null;
};

/**
 * שליפת רשומה יחידה לפי favorite_id (לצורך בדיקת בעלות)
 */
export const getItineraryEntryById = async (favoriteId) => {
    const [rows] = await pool.query(
        `SELECT favorite_id, user_id, place_id, order_index
         FROM favorites
         WHERE favorite_id = ?`,
        [favoriteId]
    );
    return rows[0] || null;
};

/**
 * הסרת מקום מהמסלול לפי favorite_id
 */
export const removeFromItinerary = async (favoriteId) => {
    const [result] = await pool.query(
        `DELETE FROM favorites
         WHERE favorite_id = ?`,
        [favoriteId]
    );
    return result.affectedRows > 0;
};

/**
 * עדכון סדר המסלול — מקבל מערך של { favorite_id, order_index }
 * מבצע את כל העדכונים בטרנזקציה אחת
 */
export const reorderItinerary = async (userId, entries) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        for (const { favorite_id, order_index } of entries) {
            await connection.query(
                `UPDATE favorites
                 SET order_index = ?
                 WHERE favorite_id = ? AND user_id = ?`,
                [order_index, favorite_id, userId]
            );
        }

        await connection.commit();
        return true;
    } catch (err) {
        await connection.rollback();
        throw err;
    } finally {
        connection.release();
    }
};
