import { getData, create, update, deleteItem } from './generalAPI';

/**
 * שליפת תגובות למקום
 */
export const getReviews = async (placeId) => {
  if (!placeId) {
    throw new Error('getReviews: missing placeId');
  }

  const path = `/places/${encodeURIComponent(placeId)}/reviews`;
  console.log('getReviews -> fetch path:', path, 'placeId:', placeId);

  return getData(path); // מערך של reviews
};

/**
 * הוספת תגובה חדשה (מחייב token)
 */
export const createReview = (placeId, reviewData, token) =>
  create(`/places/${encodeURIComponent(placeId)}/reviews`, reviewData, token);

/**
 * עדכון תגובה (מחייב token + בעלות)
 */
export const updateReview = (placeId, reviewId, reviewData, token) =>
  update(
    `/places/${encodeURIComponent(placeId)}/reviews/${encodeURIComponent(reviewId)}`,
    reviewData,
    token
  );

/**
 * מחיקת תגובה (מחייב token + בעלות)
 */
export const deleteReview = (placeId, reviewId, token) =>
  deleteItem(
    `/places/${encodeURIComponent(placeId)}/reviews/${encodeURIComponent(reviewId)}`,
    token
  );

/**
 * דירוג "הועיל לי" / "לא הועיל" על תגובה (מחייב token)
 * vote: 'up' | 'down' | null (ביטול הצבעה)
 * מחזיר { helpful_count, not_helpful_count, user_vote }
 */
export const voteReviewHelpful = (placeId, reviewId, vote, token) =>
  create(
    `/places/${encodeURIComponent(placeId)}/reviews/${encodeURIComponent(reviewId)}/helpful`,
    { vote },
    token
  );