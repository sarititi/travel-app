import { useContext } from 'react';
import { UserContext } from '../context/userContext';
import { Link } from 'react-router-dom';

export default function Profile() {
  const { user } = useContext(UserContext);
  if (!user) return <div style={{padding:20}}>אנא היכנסו למערכת.</div>;

  return (
    <div style={{padding:20, maxWidth:900, margin:'0 auto', textAlign:'right'}}>
      <h1>פרופיל משתמש</h1>
      <p>שלום, {user.username}</p>
      <p>אימייל: {user.email || 'לא זמין'}</p>
      <Link to="/profile/edit">ערוך פרופיל</Link>
    </div>
  );
}
