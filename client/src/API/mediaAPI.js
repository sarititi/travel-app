const BASE_URL = 'http://localhost:3000';

/**
 * שליפת כל המדיה (תמונות/פוסטים) של מקום
 */
export const getMedia = async (placeId) => {
  const res = await fetch(`${BASE_URL}/places/${encodeURIComponent(placeId)}/media`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
};

/**
 * העלאת מדיה חדשה (תמונה) למקום — דורש טוקן
 * file: File object
 */
export const uploadMedia = async (placeId, file, token) => {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${BASE_URL}/places/${encodeURIComponent(placeId)}/media`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json();
};

/**
 * מחיקת מדיה — רק הבעלים או אדמין
 */
export const deleteMedia = async (placeId, mediaId, token) => {
  const res = await fetch(
    `${BASE_URL}/places/${encodeURIComponent(placeId)}/media/${encodeURIComponent(mediaId)}`,
    {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
};