import { useContext } from 'react';
import { UserContext } from '../../context/userContext';
import { Link } from 'react-router-dom';

export default function Profile() {
  const { user } = useContext(UserContext);
  
  if (!user) return <div className="profile-message">אנא היכנסו למערכת.</div>;

  return (
    <div className="profile-page">
      <h1>פרופיל משתמש</h1>
      <p>שלום, {user.username}</p>
      <p>אימייל: {user.email || 'לא זמין'}</p>
      <Link to="/profile/edit" className="btn-primary">ערוך פרופיל</Link>
    </div>
  );
}