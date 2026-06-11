import pool from '../config/db.js';

export const getUserByEmail = async (email) => {
	const [rows] = await pool.query(
		`SELECT user_id AS id, username, email, user_type AS role
		 FROM users
		 WHERE email = ?`,
		[email]
	);
	return rows[0] || null;
};

export const create = async (username, email, role = 'user') => {
	const [result] = await pool.query(
		`INSERT INTO users (username, email, user_type)
		 VALUES (?, ?, ?)`,
		[username, email, role]
	);
	return {
		id: result.insertId,
		username,
		email,
		role
	};
};

export const getUserById = async (id) => {
	const [rows] = await pool.query(
		`SELECT user_id AS id, username, email, user_type AS role
		 FROM users
		 WHERE user_id = ?`,
		[id]
	);
	return rows[0] || null;
};

export const getAllUsers = async () => {
	const [rows] = await pool.query(
		`SELECT user_id AS id, username, email, user_type AS role
		 FROM users
		 ORDER BY user_id ASC`
	);
	return rows;
};

export const updateUser = async (id, { username, email }) => {
	const [result] = await pool.query(
		`UPDATE users SET username = ?, email = ? WHERE user_id = ?`,
		[username, email, id]
	);
	return result.affectedRows > 0;
};

export const deleteUserById = async (id) => {
	const [result] = await pool.query(
		`DELETE FROM users WHERE user_id = ?`,
		[id]
	);
	return result.affectedRows > 0;
};

