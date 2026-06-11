import { useContext } from 'react';
import { UserContext } from '../../context/userContext';
import { useNavigate } from 'react-router-dom';
import { deletePlace } from '../../API/placeAPI';

export default function PlaceOwnerActions({ place, onDeleted }) {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  // שימוש בלעדי ב-created_by כפי שביקשת
  const currentUserId = user ? (user.id || user.user_id) : null;
  const placeOwnerId = place ? place.created_by : null;

  const isOwner = Boolean(currentUserId && placeOwnerId && String(currentUserId) === String(placeOwnerId));

  if (!isOwner) return null;

  const handleEdit = (e) => {
    e.stopPropagation();
    alert('פונקציית עריכה תתווסף בהמשך');
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (!window.confirm('למחוק את המקום הזה?')) return;

    try {
      await deletePlace(place.place_id, user.token);
      if (onDeleted) onDeleted(place.place_id);
      else window.location.reload();
    } catch (err) {
      alert('שגיאה במחיקה: ' + err.message);
    }
  };

  return (
    <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
      <button onClick={handleEdit} className="btn-show-more" style={{ fontSize: '13px', padding: '6px 12px' }}>
        ערוך
      </button>
      <button onClick={handleDelete} className="btn-remove-place" style={{ fontSize: '13px', padding: '6px 12px' }}>
        מחק
      </button>
    </div>
  );
}