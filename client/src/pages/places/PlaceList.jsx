import { useState, useEffect, useCallback, useContext } from 'react';
import { getPlaces } from '../../API/placeAPI';
import PlaceCard from '../../components/places/PlaceCard';
import { UserContext } from '../../context/userContext';
import AddPlaceModal from '../../components/places/AddPlaceModal';
import '../../styles/places.css';

const LIMIT = 12;

export default function PlaceList() {
  const [places, setPlaces] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useContext(UserContext);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 350);

    return () => clearTimeout(timer);
  }, [search]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getPlaces({ page, limit: LIMIT, search: debouncedSearch });
      setPlaces(data.places ?? []);
      setTotal(data.total ?? 0);
      setTotalPages(data.totalPages ?? 1);
    } catch {
      setError('שגיאה בטעינת המקומות. אנא נסו שוב.');
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch]);

  const handlePlaceAdded = () => {
    // רענון הרשימה
    window.location.reload();
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page]);

  return (
    <div className="places-page">
      <header className="places-header">
        <h1 className="places-header-title">
          <span className="emoji">✈️</span>
          יעדים מומלצים
          {total > 0 && !loading && <span className="places-count">({total})</span>}
        </h1>

        <div className="places-search-bar">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="חיפוש לפי שם או תיאור..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="חיפוש מקומות"
          />
          {search && (
            <button
              className="search-clear"
              onClick={() => setSearch('')}
              aria-label="נקה חיפוש"
            >
              ×
            </button>
          )}
        </div>
      </header>
      {user && (
        <div style={{ textAlign: 'right', marginBottom: '20px' }}>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-show-more"
            style={{
              background: 'var(--accent)',
              color: 'white',
              border: 'none',
              fontSize: '16px',
              padding: '12px 24px'
            }}
          >
            ➕ הוסף טיול חדש
          </button>
        </div>
      )}

      {/* מודאל הוספה */}
      {showAddModal && (
        <AddPlaceModal
          onClose={() => setShowAddModal(false)}
          onPlaceAdded={handlePlaceAdded}
        />
      )}

      {loading ? (
        <div className="places-loading">
          <div className="places-spinner" />
          <span>טוען מקומות...</span>
        </div>
      ) : error ? (
        <div className="places-error">{error}</div>
      ) : places.length === 0 ? (
        <div className="places-empty">
          <div className="empty-icon">🗺️</div>
          <p>לא נמצאו מקומות{debouncedSearch ? ` עבור "${debouncedSearch}"` : ''}.</p>
        </div>
      ) : (
        <div className="places-grid">
          {places.map((place) => (
            <PlaceCard key={place.place_id} place={place} />
          ))}
        </div>
      )}

      {!loading && !error && totalPages > 1 && (
        <div className="places-pagination">
          <button
            className="pagination-btn"
            disabled={page <= 1}
            onClick={() => setPage((currentPage) => currentPage - 1)}
          >
            הקודם
          </button>
          <span className="pagination-info">
            {page} / {totalPages}
          </span>
          <button
            className="pagination-btn"
            disabled={page >= totalPages}
            onClick={() => setPage((currentPage) => currentPage + 1)}
          >
            הבא
          </button>
        </div>
      )}
    </div>
  );
}
