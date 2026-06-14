const BASE_URL = 'http://localhost:3000';

const LOCAL_KEY = 'local_users';

const getLocalUsers = () => {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_KEY) || '[]');
  } catch (e) {
    return [];
  }
};

const saveLocalUsers = (users) => localStorage.setItem(LOCAL_KEY, JSON.stringify(users));

export const loginUser = async (email, password) => {
  try {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (res && res.json) return await res.json();
  } catch (err) {
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
export const getUserById = async (userId, token) => {
  const res = await fetch(`${BASE_URL}/user/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
};

/**
 * עדכון שם משתמש ואימייל
 */
export const updateUserProfile = async (userId, data, token) => {
  const res = await fetch(`${BASE_URL}/user/${userId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
};

/**
 * שליפת הטיולים שיצר המשתמש
 */
export const getUserPlaces = async (userId, token) => {
  const res = await fetch(`${BASE_URL}/user/${userId}/places`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
};

/**
 * שליפת התגובות שכתב המשתמש
 */
export const getUserReviews = async (userId, token) => {
  const res = await fetch(`${BASE_URL}/user/${userId}/reviews`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
};

export const registerUser = async (userData) => {
  try {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    if (res && res.json) return await res.json();
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
export const getAllUsers = async (token) => {
  const res = await fetch(`${BASE_URL}/user/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
};

/** Admin: מחיקת משתמש לפי ID */
export const deleteUser = async (userId, token) => {
  const res = await fetch(`${BASE_URL}/user/${userId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
};

/** Admin: שליפת משתמשים מחוברים דרך Socket manager */
export const getOnlineUsers = async (token) => {
  const res = await fetch(`${BASE_URL}/user/online`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
};

/** Admin: עדכון משתמש (username/email/role) */
export const updateUser = async (userId, data, token) => {
  const res = await fetch(`${BASE_URL}/user/${userId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
};

/** Admin: יצירת משתמש חדש (username, email, password, role) */
export const createUser = async (data, token) => {
  const res = await fetch(`${BASE_URL}/user/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
};