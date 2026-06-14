import { useState, useContext } from 'react';
import { UserContext } from '../../context/userContext';
import { addToItinerary } from '../../API/itineraryAPI';

export default function AddToItineraryButton({ placeId }) {
  const { user } = useContext(UserContext);
  const [status, setStatus] = useState('idle'); 
  if (!user) return null;

  const handleAdd = async () => {
    setStatus('loading');
    try {
      await addToItinerary(placeId, user.token);
      setStatus('added');
      // notify other parts of the app (Itinerary / Favorites) to reload
      try { window.dispatchEvent(new CustomEvent('itinerary:changed')); } catch (e) {}
    } catch (err) {
      if (err.message.includes('409')) {
        setStatus('duplicate');
      } else {
        setStatus('error');
        setTimeout(() => setStatus('idle'), 3000);
      }
    }
  };

  if (status === 'added') {
    return (
      <button className="btn-add-itinerary btn-add-itinerary--added" disabled>
        ✅ נוסף למסלול
      </button>
    );
  }

  if (status === 'duplicate') {
    return (
      <button className="btn-add-itinerary btn-add-itinerary--added" disabled>
        ✓ כבר במסלול
      </button>
    );
  }

  if (status === 'error') {
    return (
      <button className="btn-add-itinerary" style={{ background: '#c2410c' }} onClick={handleAdd}>
        שגיאה — נסה שוב
      </button>
    );
  }

  return (
    <button
      className="btn-add-itinerary"
      onClick={handleAdd}
      disabled={status === 'loading'}
    >
      {status === 'loading' ? 'מוסיף...' : '🗺️ הוסף למסלול'}
    </button>
  );
}
