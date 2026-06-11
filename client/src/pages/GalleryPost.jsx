import { useEffect, useState, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/userContext';
import { deleteMedia } from '../API/mediaAPI';

const BASE_URL = 'http://localhost:3000';

export default function GalleryPost() {
  const { placeId, mediaId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  const mid = mediaId;

  useEffect(() => {
    const fetchItem = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${BASE_URL}/places/${placeId}/media`);
        if (!res.ok) throw new Error('HTTP ' + res.status);
        const list = await res.json();
        const found = list.find((i) => String(i.media_id || i.id) === String(mid));
        setItem(found || null);
      } catch (e) {
        setItem(null);
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [placeId, mid]);

  const handleDelete = async () => {
    if (!user || !item) return;
    if (!window.confirm('למחוק את התמונה הזו מהגלריה?')) return;

    setDeleting(true);
    try {
      await deleteMedia(placeId, item.media_id || item.id, user.token);
      alert('התמונה נמחקה בהצלחה');
      navigate('/gallery');
    } catch (err) {
      alert('שגיאה במחיקה: ' + err.message);
    } finally {
      setDeleting(false);
    }
  };

  const isOwner = user && item && (user.user_id === item.user_id || user.id === item.user_id);

  if (loading) {
    return (
      <div className="places-page" style={{ padding: 40, textAlign: 'center' }}>
        <div className="places-spinner" />
        <p>טוען פוסט...</p>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="places-page" style={{ padding: 40, textAlign: 'center' }}>
        <p>הפוסט לא נמצא.</p>
        <Link to="/gallery" className="btn-show-more" style={{ marginTop: 16, display: 'inline-block' }}>
          חזרה לגלריה
        </Link>
      </div>
    );
  }

  const imgUrl = item.media_url || item.url;
  const uploader = item.uploaded_by || item.username || 'משתמש';

  return (
    <div className="place-detail-page" style={{ maxWidth: 900, margin: '0 auto', padding: '24px 20px' }}>
      <button className="place-detail-back" onClick={() => navigate(-1)}>
        ← חזרה
      </button>

      <div className="place-detail-shell" style={{ gridTemplateColumns: '1fr' }}>
        <div>
          <div style={{ 
            borderRadius: 16, 
            overflow: 'hidden', 
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow)',
            background: 'var(--surface)'
          }}>
            <img 
              src={imgUrl} 
              alt={item.caption || 'תמונה מהגלריה'} 
              style={{ width: '100%', display: 'block', maxHeight: '70vh', objectFit: 'contain', background: '#f8f7f2' }} 
            />
          </div>

          <div style={{ marginTop: 20, textAlign: 'right' }}>
            <h1 style={{ margin: '0 0 8px', fontSize: 28 }}>{item.caption || 'פוסט מהגלריה'}</h1>
            
            <div style={{ color: 'var(--text)', fontSize: 15, marginBottom: 16 }}>
              צולם / הועלה על ידי <strong>{uploader}</strong>
              {item.uploaded_at && (
                <span style={{ marginInlineStart: 12, opacity: 0.7 }}>
                  • {new Date(item.uploaded_at).toLocaleDateString('he-IL')}
                </span>
              )}
            </div>

            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
              <Link to={`/places/${placeId}`} className="btn-show-more">
                צפה בפרטי המקום
              </Link>
              <Link to="/gallery" className="btn-show-more" style={{ background: 'transparent', borderColor: 'var(--border)' }}>
                חזרה לגלריה
              </Link>

              {isOwner && (
                <button 
                  onClick={handleDelete} 
                  disabled={deleting}
                  className="btn-remove-place"
                  style={{ marginInlineStart: 'auto' }}
                >
                  {deleting ? 'מוחק...' : '🗑️ מחק תמונה'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}