import { useState, useEffect, useCallback, useContext } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { getPlaceById } from '../../API/placeAPI';
import { uploadMedia } from '../../API/mediaAPI';
import { UserContext } from '../../context/userContext';
import ReviewModal from '../../components/places/ReviewModal';
import PlaceOwnerActions from '../../components/places/PlaceOwnerActions';
import '../../styles/places.css';

const DAY_LABELS = {
  sun: 'ראשון',
  mon: 'שני',
  tue: 'שלישי',
  wed: 'רביעי',
  thu: 'חמישי',
  fri: 'שישי',
  sat: 'שבת',
};

const DAY_ORDER = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
const PLACE_EMOJIS = ['🏖️', '⛰️', '🌆', '🏛️', '🌿', '🍃', '🗺️', '🌅', '🏕️', '🌊'];

export default function PlaceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useContext(UserContext);

  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Review modal
  const reviewsOpen = searchParams.get('reviews') === '1';
  const openReviews = () => setSearchParams({ reviews: '1' }, { replace: false });
  const closeReviews = useCallback(() => {
    setSearchParams({}, { replace: false });
  }, [setSearchParams]);

  // Upload media states
  const [showUpload, setShowUpload] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const openUpload = () => {
    setShowUpload(true);
    setUploadFile(null);
    setUploadError('');
  };

  const closeUpload = () => {
    setShowUpload(false);
    setUploadFile(null);
    setUploadError('');
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setUploadError('ניתן להעלות רק קבצי תמונה');
        return;
      }
      setUploadFile(file);
      setUploadError('');
    }
  };

  const handleUploadSubmit = async () => {
    if (!uploadFile || !user) return;

    setUploading(true);
    setUploadError('');
    try {
      await uploadMedia(id, uploadFile, user.token);
      alert('התמונה הועלתה בהצלחה!');
      closeUpload();
    } catch (err) {
      setUploadError(err.message || 'שגיאה בהעלאה');
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    const fetchPlace = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await getPlaceById(id);
        setPlace(data);
      } catch {
        setError('לא ניתן לטעון את המקום. אנא נסו שוב.');
      } finally {
        setLoading(false);
      }
    };
    fetchPlace();
  }, [id]);

  if (loading) {
    return (
      <div className="places-page">
        <div className="places-loading">
          <div className="places-spinner" />
          <span>טוען מידע...</span>
        </div>
      </div>
    );
  }

  if (error || !place) {
    return (
      <div className="places-page">
        <div className="places-error">{error || 'המקום לא נמצא.'}</div>
      </div>
    );
  }

  const {
    name,
    description,
    categories = [],
    opening_hours,
    created_by_username,
    created_at,
  } = place;

  const emojiIdx = name ? name.charCodeAt(0) % PLACE_EMOJIS.length : 0;
  const placeEmoji = PLACE_EMOJIS[emojiIdx];
  const createdDate = formatDate(created_at);
  const hasHours =
    opening_hours &&
    typeof opening_hours === 'object' &&
    Object.keys(opening_hours).length > 0;

  return (
    <div className="place-detail-page">
      <button className="place-detail-back" onClick={() => navigate('/places')}>
        חזרה לרשימה
      </button>

      <section className="place-detail-shell">
        <div className="place-detail-hero">
          <div className="place-detail-hero-placeholder">{placeEmoji}</div>
        </div>

        <div className="place-detail-content">
          {categories.length > 0 && (
            <div className="place-detail-categories">
              {categories.map((cat) => (
                <span key={cat} className="category-tag">{cat}</span>
              ))}
            </div>
          )}

          <h1 className="place-detail-title">{name}</h1>

          {(created_by_username || createdDate) && (
            <div className="place-detail-meta">
              {created_by_username && (
                <span className="meta-item">נוצר על ידי {created_by_username}</span>
              )}
              {createdDate && <span className="meta-item">{createdDate}</span>}
            </div>
          )}

          {description && <p className="place-detail-desc">{description}</p>}

          {hasHours && (
            <div className="place-detail-hours">
              <p className="section-label">שעות פתיחה</p>
              <div className="hours-grid">
                {DAY_ORDER.map((day) => {
                  const val = opening_hours[day];
                  if (!val) return null;
                  const isClosed = val === 'closed';
                  return (
                    <div key={day} className="hours-row">
                      <span className="hours-day">{DAY_LABELS[day] ?? day}</span>
                      {isClosed ? (
                        <span className="hours-closed">סגור</span>
                      ) : (
                        <span>{val}</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* כפתור תגובות */}
          <div className="place-detail-reviews">
            <p className="section-label">תגובות</p>
            <button className="btn-open-reviews" onClick={openReviews}>
              💬 הצג תגובות
            </button>
          </div>

          {/* כפתור העלאת תמונה */}
          {user && (
            <div className="place-detail-reviews" style={{ marginTop: 12 }}>
              <p className="section-label">שתף תמונה מהמקום</p>
              <button
                className="btn-show-more"
                onClick={openUpload}
                style={{ background: 'var(--accent)', color: '#fff', border: 'none' }}
              >
                📷 הוסף תמונה לגלריה
              </button>
            </div>
          )}

          {/* כפתורי עריכה ומחיקה - רק למי שיצר את המקום */}
          <div style={{ marginTop: '20px' }}>
            <PlaceOwnerActions
              place={place}
              onDeleted={() => navigate('/places')}
            />
          </div>
        </div>
      </section>

      {/* מודאל תגובות */}
      {reviewsOpen && (
        <ReviewModal
          placeId={id}
          placeName={name}
          onClose={closeReviews}
        />
      )}

      {/* מודאל העלאת תמונה */}
      {showUpload && (
        <div
          className="review-modal-backdrop"
          onClick={(e) => e.target === e.currentTarget && closeUpload()}
        >
          <div className="review-modal" style={{ maxWidth: 420 }}>
            <div className="review-modal__header">
              <h2 className="review-modal__title">הוספת תמונה חדשה</h2>
              <button className="review-modal__close" onClick={closeUpload}>✕</button>
            </div>

            <div className="review-modal__body" style={{ textAlign: 'right' }}>
              <div
                style={{
                  border: '2px dashed var(--border)',
                  borderRadius: 12,
                  padding: 24,
                  textAlign: 'center',
                  marginBottom: 16,
                  background: 'var(--surface)',
                }}
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                  id="media-upload-input"
                />
                <label
                  htmlFor="media-upload-input"
                  style={{
                    cursor: 'pointer',
                    display: 'inline-block',
                    padding: '10px 20px',
                    background: 'var(--accent-bg)',
                    color: 'var(--accent)',
                    borderRadius: 8,
                    fontWeight: 600,
                  }}
                >
                  {uploadFile ? 'החלף תמונה' : 'בחר תמונה מהמחשב'}
                </label>

                {uploadFile && (
                  <div style={{ marginTop: 12, fontSize: 14 }}>
                    ✓ {uploadFile.name} ({(uploadFile.size / 1024 / 1024).toFixed(1)} MB)
                  </div>
                )}
              </div>

              {uploadError && (
                <div style={{ color: '#c2410c', marginBottom: 12, fontSize: 14 }}>
                  {uploadError}
                </div>
              )}

              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                <button type="button" className="btn-modal-cancel" onClick={closeUpload}>
                  ביטול
                </button>
                <button
                  onClick={handleUploadSubmit}
                  disabled={!uploadFile || uploading}
                  className="btn-modal-submit"
                >
                  {uploading ? 'מעלה...' : 'העלה תמונה'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
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