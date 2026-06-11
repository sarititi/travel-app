import { useContext, useState } from 'react';
import { UserContext } from '../../context/userContext';
import { useNavigate } from 'react-router-dom';

export default function ProfileEdit() {
  const { user, login } = useContext(UserContext);
  const [name, setName] = useState(user?.username || '');
  const navigate = useNavigate();

  const handleSave = (e) => {
    e.preventDefault();
    const updated = { ...user, username: name };
    login(updated);
    alert('עודכן');
    navigate('/profile'); // חזרה לפרופיל לאחר השמירה
  };

  if (!user) return <div className="profile-message">אנא היכנסו למערכת.</div>;

  return (
    <div className="profile-edit-page">
      <h1>עדכון פרופיל</h1>
      <form onSubmit={handleSave} className="profile-form">
        <div className="form-group">
          <label>שם משתמש</label>
          <input 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
          />
        </div>
        <button type="submit" className="btn-primary">שמור</button>
      </form>
    </div>
  );
}