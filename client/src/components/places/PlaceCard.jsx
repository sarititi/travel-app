import { useNavigate } from 'react-router-dom';
// ייבוא הקומפוננטה החסרה - שים לב לנתיב
import PlaceOwnerActions from './PlaceOwnerActions'; 

export default function PlaceCard({ place }) {
  const navigate = useNavigate();

  const {
    place_id,
    name,
    description,
    categories = [],
    created_by_username,
    created_at,
  } = place;

  const createdDate = formatDate(created_at);

  const handleCardClick = () => {
    navigate(`/places/${place_id}`);
  };

  const handleShowMore = (e) => {
    e.stopPropagation();
    navigate(`/places/${place_id}`);
  };

  return (
    <article
      className="place-card"
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleCardClick()}
      aria-label={`מקום: ${name}`}
    >
      {categories.length > 0 && (
        <div className="place-card__categories">
          {categories.slice(0, 3).map((cat) => (
            <span key={cat} className="category-tag">
              {cat}
            </span>
          ))}
        </div>
      )}

      <div className="place-card__body">
        <h2 className="place-card__title">{name}</h2>

        <div className="place-card__thumb">
          <PlaceThumbnail name={name} />
        </div>

        {description && <p className="place-card__desc">{description}</p>}

        {(created_by_username || createdDate) && (
          <div className="place-card__meta">
            {created_by_username && <span>נוצר על ידי {created_by_username}</span>}
            {createdDate && <span>{createdDate}</span>}
          </div>
        )}
      </div>

      <div className="place-card__footer">
        <button className="btn-show-more" onClick={handleShowMore}>
          הצג עוד
        </button>

        {/* כפתורי עריכה/מחיקה רק לבעלים */}
        <PlaceOwnerActions
          place={place}
          onDeleted={() => window.location.reload()}
        />
      </div>
    </article>
  );
}

function PlaceThumbnail({ name }) {
  const EMOJIS = ['🏖️', '⛰️', '🌆', '🏛️', '🌿', '🍃', '🗺️', '🌅', '🏕️', '🌊'];
  const idx = name ? name.charCodeAt(0) % EMOJIS.length : 0;

  return (
    <div className="place-card__thumb-placeholder">
      {EMOJIS[idx]}
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
// import { useNavigate } from 'react-router-dom';

// export default function PlaceCard({ place }) {
//   const navigate = useNavigate();

//   const {
//     place_id,
//     name,
//     description,
//     categories = [],
//     created_by_username,
//     created_at,
//   } = place;

//   const createdDate = formatDate(created_at);

//   const handleCardClick = () => {
//     navigate(`/places/${place_id}`);
//   };

//   const handleShowMore = (e) => {
//     e.stopPropagation();
//     navigate(`/places/${place_id}`);
//   };

//   return (
//     <article
//       className="place-card"
//       onClick={handleCardClick}
//       role="button"
//       tabIndex={0}
//       onKeyDown={(e) => e.key === 'Enter' && handleCardClick()}
//       aria-label={`מקום: ${name}`}
//     >
//       {categories.length > 0 && (
//         <div className="place-card__categories">
//           {categories.slice(0, 3).map((cat) => (
//             <span key={cat} className="category-tag">
//               {cat}
//             </span>
//           ))}
//         </div>
//       )}

//       <div className="place-card__body">
//         <h2 className="place-card__title">{name}</h2>

//         <div className="place-card__thumb">
//           <PlaceThumbnail name={name} />
//         </div>

//         {description && <p className="place-card__desc">{description}</p>}

//         {(created_by_username || createdDate) && (
//           <div className="place-card__meta">
//             {created_by_username && <span>נוצר על ידי {created_by_username}</span>}
//             {createdDate && <span>{createdDate}</span>}
//           </div>
//         )}
//       </div>

//       <div className="place-card__footer">
//         {/* כפתור התגובות הוסר — תגובות זמינות רק בעמוד הפרטים */}
//         <button className="btn-show-more" onClick={handleShowMore}>
//           הצג עוד
//         </button>
//       </div>
//       <div className="place-card__footer">
//         <button className="btn-show-more" onClick={handleShowMore}>
//           הצג עוד
//         </button>

//         {/* כפתורי עריכה/מחיקה רק לבעלים */}
//         <PlaceOwnerActions
//           place={place}
//           onDeleted={() => window.location.reload()}
//         />
//       </div>
//     </article>
//   );
// }

// function PlaceThumbnail({ name }) {
//   const EMOJIS = ['🏖️', '⛰️', '🌆', '🏛️', '🌿', '🍃', '🗺️', '🌅', '🏕️', '🌊'];
//   const idx = name ? name.charCodeAt(0) % EMOJIS.length : 0;

//   return (
//     <div className="place-card__thumb-placeholder">
//       {EMOJIS[idx]}
//     </div>
//   );
// }

// function formatDate(value) {
//   if (!value) return '';
//   const date = new Date(value);
//   if (Number.isNaN(date.getTime())) return '';

//   return new Intl.DateTimeFormat('he-IL', {
//     day: '2-digit',
//     month: '2-digit',
//     year: 'numeric',
//   }).format(date);
// }