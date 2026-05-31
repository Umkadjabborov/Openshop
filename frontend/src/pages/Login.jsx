import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api';

export default function Login({ onLogin }) {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const data = await api.login(phone, password);
      localStorage.setItem('token', data.token);
      onLogin(data.user, data.token);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Login failed');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-side auth-side--info">
          <h2>OpenShopga xush kelibsiz</h2>
          <p>Telefon raqamingiz va parolingiz yordamida kirishingiz mumkin. Agar ro'yxatdan o'tmagan bo'lsangiz, quyidagi tugma orqali ro'yxatdan o'ting.</p>
          <div className="auth-credentials">
            <strong>Admin test:</strong>
            <p>Telefon: <span>998901234567</span></p>
            <p>Parol: <span>admin123</span></p>
          </div>
          <Link className="auth-link" to="/register">Yangi hisob ochish</Link>
        </div>
        <div className="auth-side auth-side--form">
          <h2>Kirish</h2>
          <form onSubmit={submit} className="auth-form">
            <label>
              Telefon
              <input type="text" placeholder="998901234567" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </label>
            <label>
              Parol
              <input type="password" placeholder="Parol" value={password} onChange={(e) => setPassword(e.target.value)} />
            </label>
            {error && <div className="auth-error">{error}</div>}
            <button className="order-btn" type="submit">Kirish</button>
          </form>
        </div>
      </div>
    </div>
  );
}
