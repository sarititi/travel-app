import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/userContext.jsx';
import { loginUser } from '../../API/usersAPI';
import '../../styles/auth.css';

export default function Login() {
  const { login } = useContext(UserContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    console.log('trying to login:', email, password);

    const data = await loginUser(email, password);
    console.log('login response:', data);

    if (data.error) {
      setError(data.error);
      return;
    }

    login({ ...data.user, token: data.token });
    navigate('/places');
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">✈️</div>
          <h1 className="auth-title">ברוכות הבאות</h1>
          <p className="auth-subtitle">התחברי כדי להמשיך את המסע שלך</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {error && (
            <div className="auth-error" role="alert">
              {error}
            </div>
          )}

          <div className="form-field">
            <label htmlFor="email">אימייל</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="password">סיסמה</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="הזיני סיסמה"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="auth-btn">
            התחברי
          </button>
        </form>

        <p className="auth-switch">
          עוד אין חשבון?{' '}
          <Link to="/register">הרשמי כאן</Link>
        </p>
      </div>
    </div>
  );
}