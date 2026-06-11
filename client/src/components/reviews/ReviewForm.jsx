import { useState } from 'react';

const STARS = [1, 2, 3, 4, 5];

export default function ReviewForm({ onSubmit }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleSubmit = async () => {
    if (!rating) {
      setSubmitError('אנא בחרו דירוג כוכבים.');
      return;
    }
    setSubmitError('');
    setSubmitting(true);
    
    try {
      await onSubmit(rating, comment.trim());
      setRating(0);
      setComment('');
    } catch (err) {
      setSubmitError('שגיאה בשמירת התגובה. אנא נסו שוב.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="review-form">
      <p className="review-form__label">הוסיפו תגובה</p>
      
      <div className="review-form__stars" onMouseLeave={() => setHoverRating(0)}>
        {STARS.map((s) => (
          <button
            key={s}
            className={`star-btn ${(hoverRating || rating) >= s ? 'star-btn--active' : ''}`}
            onMouseEnter={() => setHoverRating(s)}
            onClick={() => setRating(s)}
            type="button"
          >
            ★
          </button>
        ))}
        {rating > 0 && <span className="review-form__rating-label">{rating} / 5</span>}
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
  );
}