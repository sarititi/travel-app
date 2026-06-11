import { useState, useEffect, useContext, useRef } from 'react';
import { UserContext } from '../../context/userContext';
import {
  getReviews,
  createReview,
  deleteReview,
  voteReviewHelpful,
} from '../../API/reviewAPI';

const STARS = [1, 2, 3, 4, 5];

export default function ReviewModal({ placeId, placeName, onClose }) {
  const { user } = useContext(UserContext);

  const [reviews, setReviews]       = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState('');
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // טופס הוספה
  const [rating, setRating]         = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment]       = useState('');

  const backdropRef = useRef(null);

  // נעילת גלילה ברקע
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  // סגירה ב-Escape
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  // טעינת תגובות
  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await getReviews(placeId);
        // מוסיפים user_vote מקומי לכל תגובה (יוחלף בנתוני שרת אם יחזירו)
        setReviews((data ?? []).map((r) => ({ ...r, user_vote: r.user_vote ?? null })));
      } catch {
        setError('לא ניתן לטעון תגובות. אנא נסו שוב.');
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [placeId]);

  const handleBackdropClick = (e) => {
    if (e.target === backdropRef.current) onClose();
  };

  // הגשת תגובה חדשה
  const handleSubmit = async () => {
    if (!rating) { setSubmitError('אנא בחרו דירוג כוכבים.'); return; }

    setSubmitError('');
    setSubmitting(true);
    try {
      const newReview = await createReview(
        placeId,
        { rating, comment: comment.trim() },
        user.token
      );
      console.log(newReview);
      setReviews((prev) => [{ ...newReview, user_vote: null }, ...prev]);
      setRating(0);
      setComment('');
    } catch {
      setSubmitError('שגיאה בשמירת התגובה. אנא נסו שוב.');
    } finally {
      setSubmitting(false);
    }
  };

  // מחיקת תגובה
  const handleDelete = async (reviewId) => {
    try {
      await deleteReview(placeId, reviewId, user.token);
      setReviews((prev) => prev.filter((r) => r.review_id !== reviewId));
    } catch {
      // שגיאה שקטה — אפשר להרחיב לאחר מכן
    }
  };

  // הצבעה helpful / not helpful
  const handleVote = async (reviewId, vote) => {
    const review = reviews.find((r) => r.review_id === reviewId);
    if (!review) return;

    // אם מצביעים על אותו כפתור — ביטול הצבעה
    const newVote = review.user_vote === vote ? null : vote;

    // עדכון אופטימיסטי מיידי
    setReviews((prev) =>
      prev.map((r) => {
        if (r.review_id !== reviewId) return r;

        let helpful     = r.helpful_count     ?? 0;
        let notHelpful  = r.not_helpful_count ?? 0;

        // הסרת הצבעה קודמת
        if (r.user_vote === 'up')   helpful     = Math.max(0, helpful - 1);
        if (r.user_vote === 'down') notHelpful  = Math.max(0, notHelpful - 1);

        // הוספת הצבעה חדשה
        if (newVote === 'up')   helpful    += 1;
        if (newVote === 'down') notHelpful += 1;

        return { ...r, helpful_count: helpful, not_helpful_count: notHelpful, user_vote: newVote };
      })
    );

    try {
      const result = await voteReviewHelpful(placeId, reviewId, newVote, user.token);
      // סנכרון עם ערכי השרת
      setReviews((prev) =>
        prev.map((r) =>
          r.review_id === reviewId
            ? { ...r, helpful_count: result.helpful_count, not_helpful_count: result.not_helpful_count, user_vote: result.user_vote }
            : r
        )
      );
    } catch {
      // rollback בשגיאה
      setReviews((prev) =>
        prev.map((r) =>
          r.review_id === reviewId ? review : r
        )
      );
    }
  };

  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
      : null;

  return (
    <div
      className="review-modal-backdrop"
      ref={backdropRef}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label={`תגובות על ${placeName}`}
    >
      <div className="review-modal">

        {/* כותרת */}
        <div className="review-modal__header">
          <div className="review-modal__title-row">
            <h2 className="review-modal__title">תגובות — {placeName}</h2>
            {avgRating && (
              <div className="review-modal__avg">
                <span className="review-avg-star">★</span>
                <span className="review-avg-number">{avgRating}</span>
                <span className="review-avg-count">({reviews.length})</span>
              </div>
            )}
          </div>
          <button className="review-modal__close" onClick={onClose} aria-label="סגור">✕</button>
        </div>

        <div className="review-modal__body">

          {/* טופס הוספת תגובה */}
          {user ? (
            <div className="review-form">
              <p className="review-form__label">הוסיפו תגובה</p>

              {/* כוכבים */}
              <div
                className="review-form__stars"
                role="group"
                aria-label="דירוג"
                onMouseLeave={() => setHoverRating(0)}
              >
                {STARS.map((s) => (
                  <button
                    key={s}
                    className={`star-btn ${(hoverRating || rating) >= s ? 'star-btn--active' : ''}`}
                    onMouseEnter={() => setHoverRating(s)}
                    onClick={() => setRating(s)}
                    aria-label={`${s} כוכבים`}
                    type="button"
                  >
                    ★
                  </button>
                ))}
                {rating > 0 && (
                  <span className="review-form__rating-label">{rating} / 5</span>
                )}
              </div>

              <textarea
                className="review-form__textarea"
                placeholder="שתפו את החוויה שלכם..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                maxLength={1000}
                dir="rtl"
              />
              <div className="review-form__footer">
                {submitError && <span className="review-form__error">{submitError}</span>}
                <span className="review-form__chars">{comment.length} / 1000</span>
                <button
                  className="review-form__submit"
                  onClick={handleSubmit}
                  disabled={submitting}
                >
                  {submitting ? 'שומר...' : 'פרסום'}
                </button>
              </div>
            </div>
          ) : (
            <div className="review-login-notice">
              יש להתחבר כדי להוסיף תגובה.
            </div>
          )}

          {/* רשימת תגובות */}
          <div className="review-list">
            {loading ? (
              <div className="review-list__loading">
                <div className="places-spinner" />
                <span>טוען תגובות...</span>
              </div>
            ) : error ? (
              <div className="review-list__error">{error}</div>
            ) : reviews.length === 0 ? (
              <div className="review-list__empty">
                <span>💬</span>
                <p>אין תגובות עדיין. היו הראשונים!</p>
              </div>
            ) : (
              reviews.map((review) => (
                <ReviewItem
                  key={review.review_id}
                  review={review}
                  currentUser={user}
                  onDelete={handleDelete}
                  onVote={handleVote}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── תגובה בודדת ─────────────────────────────────────────────────────────────

function ReviewItem({ review, currentUser, onDelete, onVote }) {
  const {
    review_id,
    user_id,
    username,
    rating,
    comment,
    created_at,
    helpful_count    = 0,
    not_helpful_count = 0,
    user_vote,
  } = review;

  const isOwner = currentUser && currentUser.user_id === user_id;
  const createdDate = formatDate(created_at);

  return (
    <article className="review-item" dir="rtl">
      <div className="review-item__top">
        <div className="review-item__info">
          <span className="review-item__author">{username ?? 'אנונימי'}</span>
          {createdDate && <span className="review-item__date">{createdDate}</span>}
        </div>
        <div className="review-item__stars" aria-label={`דירוג ${rating} מתוך 5`}>
          {STARS.map((s) => (
            <span key={s} className={`review-star ${s <= rating ? 'review-star--filled' : ''}`}>★</span>
          ))}
        </div>
      </div>

      {comment && <p className="review-item__comment">{comment}</p>}

      <div className="review-item__footer">
        <span className="review-helpful-label">האם זה הועיל?</span>

        <div className="review-helpful-btns">
          <button
            className={`helpful-btn helpful-btn--up ${user_vote === 'up' ? 'helpful-btn--active' : ''}`}
            onClick={() => currentUser && onVote(review_id, 'up')}
            disabled={!currentUser || isOwner}
            title={currentUser ? 'הועיל לי' : 'יש להתחבר'}
            aria-pressed={user_vote === 'up'}
          >
            👍 {helpful_count > 0 && <span>{helpful_count}</span>}
          </button>

          <button
            className={`helpful-btn helpful-btn--down ${user_vote === 'down' ? 'helpful-btn--active' : ''}`}
            onClick={() => currentUser && onVote(review_id, 'down')}
            disabled={!currentUser || isOwner}
            title={currentUser ? 'לא הועיל לי' : 'יש להתחבר'}
            aria-pressed={user_vote === 'down'}
          >
            👎 {not_helpful_count > 0 && <span>{not_helpful_count}</span>}
          </button>
        </div>

        {isOwner && (
          <button
            className="review-delete-btn"
            onClick={() => onDelete(review_id)}
            aria-label="מחק תגובה"
          >
            מחק
          </button>
        )}
      </div>
    </article>
  );
}

function formatDate(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('he-IL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
}