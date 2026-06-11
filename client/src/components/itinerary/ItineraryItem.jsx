import { Link } from 'react-router-dom';

const EMOJIS = ['🏖️', '⛰️', '🌆', '🏛️', '🌿', '🍃', '🗺️', '🌅', '🏕️', '🌊'];

function placeEmoji(name) {
  const idx = name ? name.charCodeAt(0) % EMOJIS.length : 0;
  return EMOJIS[idx];
}

export default function ItineraryItem({ item, index, onRemove, removing }) {
  const { favorite_id, place_id, name, description, categories = [] } = item;

  return (
    <div className="itinerary-item">
      <div className="itinerary-item__order">{index + 1}</div>

      <div className="itinerary-item__thumb">
        {placeEmoji(name)}
      </div>

      <div className="itinerary-item__content">
        <h3 className="itinerary-item__name">{name}</h3>

        {categories.length > 0 && (
          <div className="itinerary-item__categories">
            {categories.slice(0, 3).map((cat) => (
              <span key={cat} className="category-tag">{cat}</span>
            ))}
          </div>
        )}

        {description && (
          <p className="itinerary-item__desc">{description}</p>
        )}
      </div>

      <div className="itinerary-item__actions">
        <Link to={`/places/${place_id}`} className="btn-view-place">
          צפיה
        </Link>
        <button
          className="btn-remove-place"
          onClick={() => onRemove(favorite_id)}
          disabled={removing === favorite_id}
        >
          {removing === favorite_id ? '...' : 'הסרה'}
        </button>
      </div>
    </div>
  );
}
