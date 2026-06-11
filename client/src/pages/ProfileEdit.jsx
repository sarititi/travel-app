import { useContext, useState } from 'react';
import { UserContext } from '../context/userContext';

export default function ProfileEdit() {
  const { user, login } = useContext(UserContext);
  const [name, setName] = useState(user?.username || '');

  const handleSave = (e) => {
    e.preventDefault();
    // For demo we just update local user object
    const updated = { ...user, username: name };
    login(updated);
    alert('עודכן');
  };

  if (!user) return <div style={{padding:20}}>אנא היכנסו למערכת.</div>;

  return (
    <div style={{padding:20, maxWidth:720, margin:'0 auto', textAlign:'right'}}>
      <h1>עדכון פרופיל</h1>
      <form onSubmit={handleSave}>
        <label>שם משתמש</label>
        <input value={name} onChange={(e) => setName(e.target.value)} />
        <div style={{height:12}} />
        <button type="submit">שמור</button>
      </form>
    </div>
  );
}
