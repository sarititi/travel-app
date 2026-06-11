const BASE_URL = 'http://localhost:3000';

/**
 * שליפת תגובות למקום
 */
export const getReviews = async (placeId) => {
  const res = await fetch(`${BASE_URL}/places/${encodeURIComponent(placeId)}/reviews`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json(); // מערך של reviews
};

/**
 * הוספת תגובה חדשה (מחייב token)
 */
export const createReview = async (placeId, reviewData, token) => {
  const res = await fetch(`${BASE_URL}/places/${encodeURIComponent(placeId)}/reviews`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(reviewData),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
};

/**
 * עדכון תגובה (מחייב token + בעלות)
 */
export const updateReview = async (placeId, reviewId, reviewData, token) => {
  const res = await fetch(
    `${BASE_URL}/places/${encodeURIComponent(placeId)}/reviews/${encodeURIComponent(reviewId)}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(reviewData),
    }
  );
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
};

/**
 * מחיקת תגובה (מחייב token + בעלות)
 */
export const deleteReview = async (placeId, reviewId, token) => {
  const res = await fetch(
    `${BASE_URL}/places/${encodeURIComponent(placeId)}/reviews/${encodeURIComponent(reviewId)}`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
};

/**
 * דירוג "הועיל לי" / "לא הועיל" על תגובה (מחייב token)
 * vote: 'up' | 'down' | null (ביטול הצבעה)
 */
export const voteReviewHelpful = async (placeId, reviewId, vote, token) => {
  const res = await fetch(
    `${BASE_URL}/places/${encodeURIComponent(placeId)}/reviews/${encodeURIComponent(reviewId)}/helpful`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ vote }),
    }
  );
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json(); // { helpful_count, not_helpful_count, user_vote }
};