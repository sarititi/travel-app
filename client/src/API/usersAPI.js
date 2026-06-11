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