import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Header({ cartCount }) {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    if (search.trim()) {
      navigate(`/?search=${search}`);
    }
  };

  const handleLogoClick = () => {
    navigate('/');
    setSearch('');
  };

  const token = localStorage.getItem('token');

  return (
    <header className="header">
      <div className="wrap">
        <div className="header-inner">
          <div className="logo" onClick={handleLogoClick}>
            Open<span>Shop</span>
          </div>
          <div className="search-wrap">
            <input
              type="text"
              className="search-input"
              placeholder="Mahsulotlarni qidirish..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button className="search-btn" onClick={handleSearch}>
              🔍
            </button>
          </div>
          <div className="header-actions">
            <div
              className="hbtn"
              onClick={() => navigate('/cart')}
              title="Savat"
            >
              <span>🛒</span>
              <span>Savat</span>
              {cartCount > 0 && <div className="hbadge">{cartCount}</div>}
            </div>
            {!token ? (
              <div className="hbtn" onClick={() => navigate('/login')}>
                <span>🔒</span>
                <span>Kirish</span>
              </div>
            ) : (
              <div className="hbtn" onClick={() => { localStorage.removeItem('token'); navigate('/'); window.location.reload(); }}>
                <span>🚪</span>
                <span>Chiqish</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
