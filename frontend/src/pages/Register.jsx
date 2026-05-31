import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api';

export default function Register({ onLogin }) {
  const [phone, setPhone] = useState('');
  const [full_name, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const data = await api.register({ phone, full_name, password });
      localStorage.setItem('token', data.token);
      onLogin(data.user, data.token);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Register failed');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-side auth-side--info">
          <h2>Ro'yxatdan o'tish</h2>
          <p>Do'konimizga kirish uchun telefon raqamingiz va yangi parol yarating.</p>
          <div className="auth-credentials auth-credentials--note">
            <strong>Yangi hisob uchun:</strong>
            <p>Telefon raqami: <span>998901234567</span></p>
            <p>Parol: <span>admin123</span></p>
          </div>
          <Link className="auth-link" to="/login">Mavjud hisobga kirish</Link>
        </div>
        <div className="auth-side auth-side--form">
          <h2>Ro'yxatdan o'tish</h2>
          <form onSubmit={submit} className="auth-form">
            <label>
              Telefon
              <input type="text" placeholder="998901234567" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </label>
            <label>
              To'liq ism
              <input type="text" placeholder="Ismingiz" value={full_name} onChange={(e) => setFullName(e.target.value)} />
            </label>
            <label>
              Parol
              <input type="password" placeholder="Parol" value={password} onChange={(e) => setPassword(e.target.value)} />
            </label>
            {error && <div className="auth-error">{error}</div>}
            <button className="order-btn" type="submit">Ro'yxatdan o'tish</button>
          </form>
        </div>
      </div>
    </div>
  );
}
