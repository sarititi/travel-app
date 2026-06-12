import { useContext } from 'react';
import { UserContext } from '../../context/userContext';
import { deletePlace } from '../../API/placeAPI';

/**
 * PlaceOwnerActions
 * 
 * כפתורי ערוך / מחק – מוצגים רק לבעל המקום.
 * לחיצה על "ערוך" פותחת את עמוד העריכה בטאב / חלון חדש.
 * 
 * Props:
 *   place       – אובייקט המקום
 *   onDeleted   – callback לאחר מחיקה
 *   onUpdated   – callback לאחר עדכון (אחרי חזרה מהטאב החדש – לא חובה)
 */
export default function PlaceOwnerActions({ place, onDeleted, onUpdated }) {
  const { user } = useContext(UserContext);

  const currentUserId = user ? (user.id || user.user_id) : null;
  const placeOwnerId  = place ? place.created_by : null;
  const isOwner = Boolean(
    currentUserId &&
    placeOwnerId &&
    String(currentUserId) === String(placeOwnerId)
  );

  if (!isOwner) return null;

  /**
   * פותח את עמוד עריכת המקום בטאב חדש.
   * הנתיב /places/:id/edit – ודא שה-router מגדיר נתיב זה
   * ומרנדר את AddPlaceModal (מצב עריכה) עם ה-place_id.
   */
  const handleEdit = (e) => {
    e.stopPropagation();
    window.open(`/places/${place.place_id}/edit`, '_blank', 'noopener,noreferrer');
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (!window.confirm('האם אתה בטוח שברצונך למחוק את המקום הזה? פעולה זו בלתי הפיכה.')) return;

    try {
      await deletePlace(place.place_id, user.token);
      if (onDeleted) onDeleted(place.place_id);
      else window.location.reload();
    } catch (err) {
      alert('שגיאה במחיקה: ' + err.message);
    }
  };

  return (
    <div className="owner-actions-container">
      <button
        onClick={handleEdit}
        className="btn-owner-edit"
        title="ערוך מקום (נפתח בטאב חדש)"
      >
        ✏️ ערוך ↗
      </button>
      <button
        onClick={handleDelete}
        className="btn-owner-delete"
        title="מחק מקום"
      >
        🗑 מחק
      </button>
    </div>
  );
}