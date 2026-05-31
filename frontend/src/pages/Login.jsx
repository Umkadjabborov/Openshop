import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
    <div className="wrap" style={{ padding: 24 }}>
      <h2>Kirish</h2>
      <form onSubmit={submit} style={{ maxWidth: 420, marginTop: 12 }}>
        <div style={{ marginBottom: 8 }}>
          <input placeholder="Telefon" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
        <div style={{ marginBottom: 8 }}>
          <input type="password" placeholder="Parol" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        {error && <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>}
        <button className="order-btn" type="submit">Kirish</button>
      </form>
    </div>
  );
}
