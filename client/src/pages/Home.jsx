import '../styles/Home.css';

export default function Home() {
  return (
    <div className="home-page">
      <section className="hero">
        <h1>ברוכים הבאים ל-Travelly</h1>
        <p className="lead">פלפורמה לגלות מקומות, לשתף תמונות ולבנות מסלולים מותאמים אישית.</p>
      </section>

      <section className="about">
        <h2>מה אפשר לעשות כאן?</h2>
        <ul>
          <li>למצוא ולטייל במקומות מומלצים.</li>
          <li>לצפות בגלריית תמונות של מקומות.</li>
          <li>ליצור מסלולים מותאמים אישית.</li>
          <li>לשתף ולנהל פרופיל משתמש פשוט ונוח.</li>
        </ul>
      </section>

      <section className="quick-actions">
        <h3>קישורים מהירים</h3>
        <div className="actions-row">
          <a href="/places" className="action-card">לרשימת הטיולים</a>
          <a href="/gallery" className="action-card">לגלריה</a>
        </div>
      </section>
    </div>
  );
}
