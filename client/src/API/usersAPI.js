import { getData, create, update, deleteItem, postRaw } from './generalAPI';

const LOCAL_KEY = 'local_users';

const getLocalUsers = () => {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_KEY) || '[]');
  } catch (e) {
    return [];
  }
};

const saveLocalUsers = (users) => localStorage.setItem(LOCAL_KEY, JSON.stringify(users));

/**
 * התחברות: מנסה את השרת, ואם הוא לא מגיב (שגיאת רשת)
 * עובר למשתמשים שנשמרו מקומית (offline)
 */
export const loginUser = async (email, password) => {
  try {
    return await postRaw('/auth/login', { email, password });
  } catch (err) {
    // fallback to local login
  }

  const users = getLocalUsers();
  const encoded = btoa(password || '');
  const found = users.find((u) => u.email === email && u.password === encoded);
  if (!found) return { error: 'Invalid credentials (offline)' };
  const { id, username, email: e, role } = found;
  const token = btoa(`${e}:${id}`);
  return { user: { id, username, email: e, role }, token };
};

/**
 * שליפת פרטי משתמש לפי ID (כולל username, email, role)
 */
export const getUserById = (userId, token) =>
  getData(`/user/${userId}`, token);

/**
 * עדכון שם משתמש ואימייל
 */
export const updateUserProfile = (userId, data, token) =>
  update(`/user/${userId}`, data, token);

/**
 * שליפת הטיולים שיצר המשתמש
 */
export const getUserPlaces = (userId, token) =>
  getData(`/user/${userId}/places`, token);

/**
 * שליפת התגובות שכתב המשתמש
 */
export const getUserReviews = (userId, token) =>
  getData(`/user/${userId}/reviews`, token);

/**
 * הרשמה: מנסה את השרת, ואם הוא לא מגיב (שגיאת רשת)
 * נרשם מקומית (offline)
 */
export const registerUser = async (userData) => {
  try {
    return await postRaw('/auth/register', userData);
  } catch (err) {
    // fallback to local registration
  }

  const { userName, email, password } = userData;
  if (!userName || !email || !password) return { error: 'Missing fields' };

  const users = getLocalUsers();
  if (users.find((u) => u.email === email)) return { error: 'Email already in use (offline)' };

  const id = Date.now();
  const encoded = btoa(password);
  const newUser = { id, username: userName, email, role: 'regular', password: encoded };
  users.push(newUser);
  saveLocalUsers(users);
  const token = btoa(`${email}:${id}`);
  return { user: { id, username: userName, email, role: 'regular' }, token };
};

/** Admin: שליפת כל המשתמשים (דורש טוקן אדמין) */
export const getAllUsers = (token) => getData('/user/', token);

/** Admin: מחיקת משתמש לפי ID */
export const deleteUser = (userId, token) => deleteItem(`/user/${userId}`, token);

/** Admin: שליפת משתמשים מחוברים דרך Socket manager */
export const getOnlineUsers = (token) => getData('/user/online', token);

/** Admin: עדכון משתמש (username/email/role) */
export const updateUser = (userId, data, token) => update(`/user/${userId}`, data, token);

/** Admin: יצירת משתמש חדש (username, email, password, role) */
export const createUser = (data, token) => create('/user/', data, token);