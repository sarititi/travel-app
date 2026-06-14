import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../context/userContext';
import { getItinerary, removeFromItinerary } from '../API/itineraryAPI';

export default function Itinerary(){
  const { user } = useContext(UserContext);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      setLoading(true);
      try {
        const data = await getItinerary(user.token);
        setItems(data || []);
      } catch (err) {
        setError(err.message || 'Error loading itinerary');
      } finally {
        setLoading(false);
      }
    };
    load();
    const onChanged = () => { load(); };
    window.addEventListener('itinerary:changed', onChanged);
    return () => window.removeEventListener('itinerary:changed', onChanged);
  }, [user]);

  const handleRemove = async (favoriteId) => {
    if (!confirm('האם למחוק את הפריט מהמסלול?')) return;
    try {
      await removeFromItinerary(favoriteId, user.token);
      setItems((s) => s.filter((it) => it.favorite_id !== favoriteId));
    } catch (err) {
      alert('שגיאה במחיקה: ' + (err.message || err));
    }
  };

    return (
      <div className="favorites-page">
        <header className="favorites-header">
          <h1>המועדפים / מסלולים שלי ✨</h1>
          <p className="muted">כיף שיש לך טעמים — הנה מה ששמרת לעצמך</p>
        </header>

        {!user ? (
          <div className="fav-empty">יש להתחבר כדי לראות את המועדפים שלך.</div>
        ) : loading ? (
          <div className="fav-loading">טוען מועדפים...</div>
        ) : items.length === 0 ? (
          <div className="fav-empty">אין עדיין מועדפים — הוסף מקומות בעמודי טיולים!</div>
        ) : (
          <div className="fav-grid">
            {items.map((it) => (
              <article key={it.favorite_id} className="fav-card">
                <EmojiThumb name={it.name} />
                <div className="fav-body">
                  <h3 className="fav-title">{it.name}</h3>
                  <p className="fav-desc">{it.description || 'אין תאור'}</p>
                  <div className="fav-actions">
                    <a className="btn" href={`/places/${it.place_id}`}>פתח</a>
                    <button className="btn danger" onClick={() => handleRemove(it.favorite_id)}>הסר</button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    );

  return (
    <div style={{padding:20, maxWidth:900, margin:'0 auto', textAlign:'right'}}>
      <h1>מסלולים מותאמים אישית</h1>
      {error && <div className="error">{error}</div>}
      {loading ? (
        <div>טוען...</div>
      ) : (
        <div>
          {items.length === 0 ? (
            <p>עוד לא הוספת מקומות למסלול. היכנס לדף מקום ולחץ "הוסף למסלול".</p>
          ) : (
            <ul className="places-list">
              {items.map((it) => (
                <li key={it.favorite_id} className="place-item">
                  <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                    <div>
                      <strong>{it.name}</strong>
                      <div style={{fontSize:12, color:'#666'}}>{it.description}</div>
                    </div>
                    <div>
                      <button className="danger" onClick={() => handleRemove(it.favorite_id)}>מחק</button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
