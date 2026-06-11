const BASE_URL = 'http://localhost:3000';

export const getPlaces = async ({ page = 1, limit = 20, search = '', category = '', open_on = '' } = {}) => {
  const query = new URLSearchParams();
  if (page)     query.set('page',    page);
  if (limit)    query.set('limit',   limit);
  if (search)   query.set('search',  search);
  if (category) query.set('category', category);
  if (open_on)  query.set('open_on', open_on);

  const res = await fetch(`${BASE_URL}/places?${query.toString()}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json(); // { places, total, page, limit, totalPages }
};

/**
 * שליפת place בודד לפי ID
 */
export const getPlaceById = async (id) => {
  const res = await fetch(`${BASE_URL}/places/${encodeURIComponent(id)}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
};

/**
 * הוספת place חדש (מחייב token)
 */
export const createPlace = async (placeData, token) => {
  const res = await fetch(`${BASE_URL}/places`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(placeData),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
};

/**
 * עדכון place (מחייב token)
 */
export const updatePlace = async (id, placeData, token) => {
  const res = await fetch(`${BASE_URL}/places/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(placeData),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
};

/**
 * מחיקת place (מחייב token)
 */
export const deletePlace = async (id, token) => {
  const res = await fetch(`${BASE_URL}/places/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
};