import { useState } from 'react';
import { addToItinerary } from '../../API/itineraryAPI';

export default function AddTripModal({ onClose, onAdded, token }) {
  const [placeId, setPlaceId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!placeId.trim()) {
      setError('נא להזין מזהה מקום.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await addToItinerary(Number(placeId), token);
      onAdded();
    } catch (err) {
      if (err.message.includes('409')) {
        setError('המקום כבר נמצא במסלול שלך.');
      } else if (err.message.includes('404')) {
        setError('מקום עם מזהה זה לא נמצא.');
      } else {
        setError('שגיאה בהוספת המקום. אנא נסה שוב.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <h2 className="modal-title">➕ הוספת טיול למסלול</h2>
        <p className="modal-subtitle">הזן את מזהה המקום שברצונך להוסיף למסלול האישי שלך.</p>

        <form onSubmit={handleSubmit}>
          <div className="modal-field">
            <label htmlFor="place-id-input">מזהה מקום (place_id)</label>
            <input
              id="place-id-input"
              type="number"
              min="1"
              placeholder="לדוגמה: 1"
              value={placeId}
              onChange={(e) => { setPlaceId(e.target.value); setError(''); }}
              className={error ? 'input-error' : ''}
              autoFocus
            />
          </div>

          {error && <div className="modal-error">{error}</div>}

          <div className="modal-actions">
            <button type="submit" className="btn-modal-submit" disabled={loading}>
              {loading ? 'מוסיף...' : 'הוסף למסלול'}
            </button>
            <button type="button" className="btn-modal-cancel" onClick={onClose}>
              ביטול
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
