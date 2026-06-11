import { formatDate } from '../../utils/dateUtils';

const STARS = [1, 2, 3, 4, 5];

export default function ReviewItem({ review, currentUser, onDelete, onVote }) {
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