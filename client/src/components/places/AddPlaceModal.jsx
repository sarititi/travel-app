import { useState, useContext } from 'react';
import { UserContext } from '../../context/userContext';
import { createPlace } from '../../API/placeAPI';
import '../../styles/places.css';


const DAYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
const DAY_LABELS = {
  sun: 'ראשון', mon: 'שני', tue: 'שלישי', wed: 'רביעי',
  thu: 'חמישי', fri: 'שישי', sat: 'שבת'
};

export default function AddPlaceModal({ onClose, onPlaceAdded }) {
  const { user } = useContext(UserContext);
  const [form, setForm] = useState({
    name: '',
    description: '',
    categories: '',
    opening_hours: {}
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleHoursChange = (day, value) => {
    setForm({
      ...form,
      opening_hours: {
        ...form.opening_hours,
        [day]: value
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setError('שם המקום חובה');
      return;
    }

    setLoading(true);
    setError('');

    const placeData = {
      name: form.name.trim(),
      description: form.description.trim(),
      categories: form.categories
        .split(',')
        .map(c => c.trim())
        .filter(Boolean),
      opening_hours: form.opening_hours
    };

    try {
      await createPlace(placeData, user.token);
      onPlaceAdded();
      onClose();
    } catch (err) {
      setError(err.message || 'שגיאה ביצירת המקום');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="review-modal-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="review-modal" style={{ maxWidth: 620 }}>
        <div className="review-modal__header">
          <h2 className="review-modal__title">הוספת טיול חדש</h2>
          <button className="review-modal__close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="review-modal__body">
          {error && <div style={{ color: '#c2410c', marginBottom: 12 }}>{error}</div>}

          <div style={{ marginBottom: 16 }}>
            <label>שם המקום *</label>
            <input name="name" value={form.name} onChange={handleChange} required />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label>תיאור</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={3} />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label>קטגוריות (מופרדות בפסיק)</label>
            <input 
              name="categories" 
              value={form.categories} 
              onChange={handleChange} 
              placeholder="משפחתי, טבע, חינם" 
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label>שעות פתיחה</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 8 }}>
              {DAYS.map(day => (
                <div key={day}>
                  <small>{DAY_LABELS[day]}</small>
                  <input 
                    placeholder="09:00-17:00 או closed"
                    value={form.opening_hours[day] || ''} 
                    onChange={(e) => handleHoursChange(day, e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 20 }}>
            <button type="button" className="btn-modal-cancel" onClick={onClose}>ביטול</button>
            <button type="submit" className="btn-modal-submit" disabled={loading}>
              {loading ? 'שומר...' : 'צור מקום חדש'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}