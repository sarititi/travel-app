export default function PlaceInfo({ place }) {
  const { name, description, categories = [], address, created_by_username } = place;

  return (
    <section className="place-info-section">
      <h1 className="place-detail-title">{name}</h1>
      
      {created_by_username && (
        <p className="place-author">פורסם על ידי: {created_by_username}</p>
      )}

      {categories.length > 0 && (
        <div className="place-categories-list">
          {categories.map((category) => (
            <span key={category} className="category-pill">
              {category}
            </span>
          ))}
        </div>
      )}

      {address && (
        <div className="place-location">
          <strong>כתובת:</strong> {address}
        </div>
      )}

      {description && (
        <div className="place-description-content">
          <h3>אודות המקום</h3>
          <p>{description}</p>
        </div>
      )}
    </section>
  );
}