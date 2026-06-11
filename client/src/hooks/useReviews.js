import { useState, useEffect } from 'react';
import { getReviews, createReview, deleteReview, voteReviewHelpful } from '../API/reviewAPI';

export function useReviews(placeId, user) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      try {
        const data = await getReviews(placeId);
        setReviews((data ?? []).map((r) => ({ ...r, user_vote: r.user_vote ?? null })));
      } catch {
        setError('לא ניתן לטעון תגובות. אנא נסו שוב.');
      } finally {
        setLoading(false);
      }
    };
    if (placeId) fetchReviews();
  }, [placeId]);

  const addReview = async (rating, comment) => {
    const newReview = await createReview(placeId, { rating, comment }, user.token);
    setReviews((prev) => [{ ...newReview, user_vote: null }, ...prev]);
  };

  const removeReview = async (reviewId) => {
    await deleteReview(placeId, reviewId, user.token);
    setReviews((prev) => prev.filter((r) => r.review_id !== reviewId));
  };

  const voteReview = async (reviewId, vote) => {
    const review = reviews.find((r) => r.review_id === reviewId);
    if (!review) return;

    const newVote = review.user_vote === vote ? null : vote;
    
    // עדכון אופטימיסטי ל-UI
    setReviews((prev) => prev.map((r) => {
      if (r.review_id !== reviewId) return r;
      let helpful = r.helpful_count ?? 0;
      let notHelpful = r.not_helpful_count ?? 0;
      if (r.user_vote === 'up') helpful = Math.max(0, helpful - 1);
      if (r.user_vote === 'down') notHelpful = Math.max(0, notHelpful - 1);
      if (newVote === 'up') helpful += 1;
      if (newVote === 'down') notHelpful += 1;
      return { ...r, helpful_count: helpful, not_helpful_count: notHelpful, user_vote: newVote };
    }));

    try {
      const result = await voteReviewHelpful(placeId, reviewId, newVote, user.token);
      setReviews((prev) => prev.map((r) => r.review_id === reviewId ? { ...r, ...result } : r));
    } catch {
      // חזרה למצב הקודם במקרה של שגיאה
      setReviews((prev) => prev.map((r) => r.review_id === reviewId ? review : r));
    }
  };

  return { reviews, loading, error, addReview, removeReview, voteReview };
}