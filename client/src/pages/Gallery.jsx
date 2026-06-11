import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPlaces } from '../API/placeAPI';
import '../styles/gallery.css';

const BASE_URL = 'http://localhost:3000';

export default function Gallery() {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMedia = async () => {
      setLoading(true);
      try {
        const placesRes = await getPlaces({ page: 1, limit: 12 });
        const places = placesRes.places || [];

        const allMedia = [];
        await Promise.all(
          places.map(async (p) => {
            try {
              const res = await fetch(`${BASE_URL}/places/${p.place_id}/media`);
              if (!res.ok) return;
              const items = await res.json();
              items.forEach((it) => allMedia.push({ ...it, placeId: p.place_id }));
            } catch (e) {
              // ignore single place failures
            }
          })
        );

        setMedia(allMedia);
      } catch (err) {
        setMedia([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMedia();
  }, []);

  return (
    <div className="gallery-page">
      <h1 className="gallery-title">גלריית תמונות</h1>
      <p className="gallery-subtitle">תמונות ששותפו על ידי הקהילה שלנו • גלו השראה לטיול הבא שלכם</p>

      {loading ? (
        <div className="gallery-loading">
          <div className="places-spinner" />
          <span>טוען תמונות...</span>
        </div>
      ) : media.length === 0 ? (
        <div className="gallery-empty">
          <div className="empty-icon">📷</div>
          <p>עדיין אין תמונות בגלריה. היו הראשונים להוסיף!</p>
        </div>
      ) : (
        <div className="gallery-grid">
          {media.map((m) => {
            const mid = m.media_id || m.id;
            return (
              <Link
                to={`/gallery/${m.placeId}/${mid}`}
                className="gallery-item"
                key={`${m.placeId}-${mid}`}>
                <img src={m.media_url || m.url} alt={m.caption || m.uploaded_by || 'תמונה מהגלריה'} />
                {(m.uploaded_by || m.caption) && (
                  <div className="gallery-item__info">
                    <div className="gallery-item__uploader">
                      {m.uploaded_by ? `צולם על ידי ${m.uploaded_by}` : ''}
                    </div>
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}