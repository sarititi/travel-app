import { useContext } from 'react';
import { UserContext } from '../../context/userContext';
import { useNavigate } from 'react-router-dom';
import { deletePlace } from '../../API/placeAPI';

export default function PlaceOwnerActions({ place, onDeleted }) {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  // בדיקה אם המשתמש הוא הבעלים
  const isOwner = user && (user.id === place.created_by || user.user_id === place.created_by);

  if (!isOwner) return null;

  const handleEdit = () => {
    // בהמשך נוסיף עמוד עריכה. כרגע נעביר למודאל או נשאיר TODO
    alert('פונקציית עריכה תתווסף בהמשך');
    // navigate(`/places/${place.place_id}/edit`);
  };

  const handleDelete = async () => {
    if (!window.confirm('למחוק את המקום הזה?')) return;

    try {
      await deletePlace(place.place_id, user.token);
      if (onDeleted) onDeleted(place.place_id);
      else window.location.reload(); // זמני עד שנוסיף state ניהול
    } catch (err) {
      alert('שגיאה במחיקה: ' + err.message);
    }
  };

  return (
    <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
      <button 
        onClick={handleEdit}
        className="btn-show-more"
        style={{ fontSize: '13px', padding: '6px 12px' }}
      >
        ✏️ ערוך
      </button>
      <button 
        onClick={handleDelete}
        className="btn-remove-place"
        style={{ fontSize: '13px', padding: '6px 12px' }}
      >
        🗑️ מחק
      </button>
    </div>
  );
}