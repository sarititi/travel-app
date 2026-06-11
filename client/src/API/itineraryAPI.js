const BASE_URL = 'http://localhost:3000';

/**
 * שליפת המסלול האישי של המשתמש המחובר
 */
export const getItinerary = async (token) => {
  const res = await fetch(`${BASE_URL}/itinerary`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json(); // [{ favorite_id, order_index, place_id, name, description, ... }]
};

/**
 * הוספת מקום למסלול — { place_id }
 */
export const addToItinerary = async (placeId, token) => {
  const res = await fetch(`${BASE_URL}/itinerary`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ place_id: placeId }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
};

/**
 * הסרת מקום מהמסלול לפי favorite_id
 */
export const removeFromItinerary = async (favoriteId, token) => {
  const res = await fetch(`${BASE_URL}/itinerary/${favoriteId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
};

/**
 * עדכון סדר המסלול — { entries: [{ favorite_id, order_index }, ...] }
 */
export const reorderItinerary = async (entries, token) => {
  const res = await fetch(`${BASE_URL}/itinerary/reorder`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ entries }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
};
