﻿import { useEffect, useMemo, useState, useRef } from 'react';
import { Link, Navigate, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom';
import EmojiPicker from 'emoji-picker-react';
import './App.css';

const API_BASE = 'http://localhost:4001';
const PLACEHOLDER = 'https://placehold.co/360x360/ffffff/222222?text=Product';
function Header({ cartCount, wishCount, searchTerm, onSearch, onFavorites, onCart, onLogin, onLogout, onCatalog, auth }) {
  return (
    <header className="header">
      <div className="wrap header-inner">
        <Link to="/" className="logo">Open<span>Shop</span></Link>
        <button className="catalog-btn" type="button" onClick={onCatalog}>
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          <span>Katalog</span>
        </button>
        <div className="search-wrap">
          <input
            className="search-input"
            type="text"
            value={searchTerm}
            placeholder="Smartfon, noutbuk, televizor..."
            onChange={(e) => onSearch(e.target.value)}
          />
          <button className="search-btn" type="button">
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
          </button>
        </div>
        <div className="header-actions">
          <div className="hbtn" role="button" onClick={onFavorites}>
            <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
            Sevimli
            <span className="hbadge">{wishCount}</span>
          </div>
          <div className="hbtn" role="button" onClick={onCart}>
            <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
            Savat
            <span className="hbadge">{cartCount}</span>
          </div>
          {auth?.role ? (
            <div className="hbtn" role="button" onClick={onLogout}>
              <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              Chiqish
            </div>
          ) : (
            <div className="hbtn" role="button" onClick={onLogin}>
              <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              {auth?.user?.name ? auth.user.name.split(' ')[0] : 'Kirish'}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

function CatalogDialog({ open, categories, selectedCategory, onClose, onSelectCategory, onSearch }) {
  if (!open) return null;
  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div className="dialog-card" onClick={(e) => e.stopPropagation()}>
        <div className="dialog-header">
          <h2>Katalog bo'yicha filtrlash</h2>
          <button type="button" className="close-btn" onClick={onClose}>✕</button>
        </div>
        <div className="dialog-body">
          <div className="dialog-search">
            <input type="text" placeholder="Qidiruv..." onChange={(e) => onSearch(e.target.value)} />
          </div>
          <div className="dialog-cats">
            <button type="button" className={`cat-pill${selectedCategory === null ? ' active' : ''}`} onClick={() => onSelectCategory(null)}>Barchasi</button>
            {categories.map((category) => (
              <button key={category.id} type="button" className={`cat-pill${selectedCategory === category.name ? ' active' : ''}`} onClick={() => onSelectCategory(category.name)}>
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError('');
    const result = await onLogin(email.trim(), password.trim());
    setLoading(false);
    if (result.success) {
      navigate(result.role === 'admin' ? '/dashboard' : '/');
    } else {
      setError(result.error || "Email yoki parol noto'g'ri.");
    }
  }

  return (
    <main className="wrap auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Kirish</h1>
          <p>Email va parolingiz bilan tizimga kiring.</p>
        </div>
        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            Email
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
          </label>
          <label>
            Parol
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" />
          </label>
          {error ? <div className="auth-error">{error}</div> : null}
          <button type="submit" className="auth-submit" disabled={loading}>{loading ? 'Tekshirilmoqda...' : 'Kirish'}</button>
        </form>
        <div className="auth-note">
          <p><strong>Admin kirish:</strong> admin@example.com / Admin123</p>
        </div>
        <button type="button" className="auth-link" onClick={() => navigate('/register')}>Ro'yxatdan o'tish</button>
      </div>
    </main>
  );
}

function RegisterPage({ onRegister }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    if (!name || !email || !password) {
      setMessage("Iltimos barcha maydonlarni to'ldiring.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), password }),
      });
      const data = await res.json();
      if (!res.ok) { setMessage(data.error || "Xatolik yuz berdi."); setLoading(false); return; }
      onRegister(data);
      navigate('/');
    } catch {
      setMessage("Serverga ulanishda xatolik.");
    }
    setLoading(false);
  }

  return (
    <main className="wrap auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Ro'yxatdan o'tish</h1>
          <p>Yangi hisob yarating va xarid qilishni boshlang.</p>
        </div>
        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            Ism
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
          </label>
          <label>
            Email
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </label>
          <label>
            Parol
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </label>
          {message ? <div className="auth-error">{message}</div> : null}
          <button type="submit" className="auth-submit" disabled={loading}>{loading ? 'Saqlanmoqda...' : "Ro'yxatdan o'tish"}</button>
        </form>
        <button type="button" className="auth-link" onClick={() => navigate('/login')}>Hisobim bor — Kirish</button>
      </div>
    </main>
  );
}

function CatalogPage({ categories, products, selectedCategory, searchTerm, onSelectCategory, onSearch, onToggleWish, onAddCart, onView, wish }) {
  return (
    <main className="wrap page-content">
      <section className="section">
        <div className="sec-head">
          <h2 className="sec-title">🛍️ Katalog</h2>
          <button className="sec-more" type="button" onClick={() => onSelectCategory(null)}>Barchasi</button>
        </div>
        <div className="catalog-bar">
          <div className="catalog-filters">
            <button type="button" className={`cat-pill${selectedCategory === null ? ' active' : ''}`} onClick={() => onSelectCategory(null)}>Barchasi</button>
            {categories.map((category) => (
              <button key={category.id} type="button" className={`cat-pill${selectedCategory === category.name ? ' active' : ''}`} onClick={() => onSelectCategory(category.name)}>
                {category.name}
              </button>
            ))}
          </div>
          <input className="search-input" type="text" value={searchTerm} placeholder="Katalog bo'yicha qidirish..." onChange={(e) => onSearch(e.target.value)} />
        </div>
      </section>
      <ProductGrid title="Barcha mahsulotlar" products={products} onToggleWish={onToggleWish} onAddCart={onAddCart} onView={onView} wish={wish} />
    </main>
  );
}

function FavoritesPage({ products, wish, onToggleWish, onView }) {
  const favorites = products.filter((product) => wish.has(product.id));
  return (
    <main className="wrap page-content">
      <section className="section">
        <div className="sec-head">
          <h2 className="sec-title">❤️ Sevimli mahsulotlar</h2>
          <span>{favorites.length} ta mahsulot</span>
        </div>
        {favorites.length ? (
          <div className="prod-grid">
            {favorites.map((product) => (
              <ProductCard key={product.id} product={product} isWish onToggleWish={onToggleWish} onAddCart={() => {}} onView={onView} />
            ))}
          </div>
        ) : (
          <div className="empty-state">Sevimli ro'yxatingiz bo'sh.</div>
        )}
      </section>
    </main>
  );
}

function CartPage({ products, cart, onChangeQty, onRemove, onAddCart }) {
  return (
    <main className="wrap page-content">
      <section className="section">
        <div className="sec-head">
          <h2 className="sec-title">🛒 Savat</h2>
          <span>{Object.keys(cart).length} ta mahsulot</span>
        </div>
        <div className="wrap">
          <CartSection products={products} cart={cart} onChangeQty={onChangeQty} onRemove={onRemove} />
        </div>
      </section>
    </main>
  );
}

function AddProductModal({ open, onClose, brands, categories, onAddProduct }) {
  const [form, setForm] = useState({ name: '', description: '', brand_id: '', category_id: '', price: '', old_price: '', stock_qty: 1, image_url: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name || !form.brand_id || !form.category_id || !form.price) {
      setMessage("Iltimos, barcha majburiy maydonlarni to'ldiring.");
      return;
    }
    setLoading(true);
    const created = await onAddProduct({
      name_uz: form.name,
      description_uz: form.description || form.name,
      price: Number(form.price),
      old_price: form.old_price ? Number(form.old_price) : null,
      stock_qty: Number(form.stock_qty) || 0,
      category_id: Number(form.category_id),
      brand_id: Number(form.brand_id),
      image_url: form.image_url,
      is_new: true,
      is_featured: true,
    });
    setLoading(false);
    if (created) {
      setForm({ name: '', description: '', brand_id: '', category_id: '', price: '', old_price: '', stock_qty: 1, image_url: '' });
      setMessage('');
      onClose();
    } else {
      setMessage("Mahsulot saqlanmadi. Qayta urinib ko'ring.");
    }
  }

  if (!open) return null;
  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div className="dialog-card add-product-modal" onClick={e => e.stopPropagation()}>
        <div className="dialog-header">
          <h2>Yangi mahsulot qo'shish</h2>
          <button type="button" className="close-btn" onClick={onClose}>✕</button>
        </div>
        <div className="dialog-body">
          <form className="dashboard-form" onSubmit={handleSubmit}>
            <label>Mahsulot nomi *<input name="name" value={form.name} onChange={handleChange} required /></label>
            <label>Tavsif<textarea name="description" value={form.description} onChange={handleChange} rows="2" /></label>
            <div className="form-row">
              <label>Brend *
                <select name="brand_id" value={form.brand_id} onChange={handleChange} required>
                  <option value="">Brendni tanlang</option>
                  {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
              </label>
              <label>Kategoriya *
                <select name="category_id" value={form.category_id} onChange={handleChange} required>
                  <option value="">Kategoriya tanlang</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </label>
            </div>
            <div className="form-row">
              <label>Narxi *<input name="price" type="number" min="0" value={form.price} onChange={handleChange} required /></label>
              <label>Eski narx<input name="old_price" type="number" min="0" value={form.old_price} onChange={handleChange} /></label>
              <label>Ombordan<input name="stock_qty" type="number" min="0" value={form.stock_qty} onChange={handleChange} /></label>
            </div>
            <label>Rasm URL<input name="image_url" value={form.image_url} onChange={handleChange} placeholder="https://..." /></label>
            {message ? <div className="auth-error">{message}</div> : null}
            <div className="modal-actions">
              <button type="button" className="cancel-btn" onClick={onClose}>Bekor qilish</button>
              <button type="submit" className="auth-submit" disabled={loading}>{loading ? 'Saqlanmoqda...' : "Qo'shish"}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function AdminSidebar({ auth }) {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;

  const navItems = [
    {
      to: '/dashboard',
      label: 'Dashboard',
      icon: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>,
    },
    {
      to: '/dashboard/products',
      label: 'Mahsulotlar',
      icon: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>,
    },
    {
      to: '/dashboard/users',
      label: 'Mijozlar',
      icon: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>,
    },
    {
      to: '/dashboard/categories',
      label: 'Kategoriyalar',
      icon: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>,
    },
    {
      to: '/dashboard/brands',
      label: 'Brendlar',
      icon: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>,
    },
  ];

  return (
    <aside className="db-sidebar">
      <div className="db-logo">
        <span className="db-logo-text">Open<span className="db-logo-dot">Shop</span></span>
      </div>
      <nav className="db-nav">
        {navItems.map(item => (
          <div
            key={item.to}
            className={`db-nav-item${path === item.to ? ' db-nav-active' : ''}`}
            onClick={() => navigate(item.to)}
          >
            {item.icon}
            {item.label}
          </div>
        ))}
        <div className="db-nav-divider" />
        <div className="db-nav-item" onClick={() => navigate('/')}>
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          Saytga qaytish
        </div>
      </nav>
      <div className="db-sidebar-footer">
        <div className="db-user-card">
          <div className="db-avatar">{(auth?.user?.name || 'A')[0]}</div>
          <div>
            <div className="db-user-name">{auth?.user?.name || 'Admin'}</div>
            <div className="db-user-role">Superadmin</div>
          </div>
        </div>
      </div>
    </aside>
  );
}

function AdminProductsPage({ products, brands, categories, onAddProduct, onDeleteProduct, auth }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedRows, setSelectedRows] = useState(new Set());

  const filtered = products.filter(p =>
    !search ||
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.brand_name || '').toLowerCase().includes(search.toLowerCase())
  );

  function toggleRow(id) {
    setSelectedRows(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  }
  function toggleAll(e) {
    setSelectedRows(e.target.checked ? new Set(filtered.map(p => p.id)) : new Set());
  }

  return (
    <div className="db-layout">
      <AdminSidebar auth={auth} />
      <main className="db-main">
        <header className="db-topbar">
          <div className="db-topbar-title">Mahsulotlar</div>
          <div className="db-topbar-actions">
            <div className="db-stat-chip"><span>Jami:</span><strong>{products.length} ta</strong></div>
            <div className="db-stat-chip"><span>Yangi:</span><strong>{products.filter(p => p.is_new).length} ta</strong></div>
          </div>
        </header>
        <div className="db-content">
          <div className="db-toolbar">
            <div className="db-search-box">
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              <input type="text" placeholder="Mahsulot yoki brend qidirish..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <div className="db-toolbar-right">
              {selectedRows.size > 0 && <span className="db-selected-info">{selectedRows.size} ta tanlandi</span>}
              <button className="db-btn-primary" onClick={() => setModalOpen(true)}>
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>
                Mahsulot qo'shish
              </button>
            </div>
          </div>
          <div className="db-table-wrap">
            <div className="db-table-head">
              <div className="db-th cb-col"><input type="checkbox" onChange={toggleAll} checked={selectedRows.size === filtered.length && filtered.length > 0} /></div>
              <div className="db-th num-col">#</div>
              <div className="db-th img-col">Rasm</div>
              <div className="db-th name-col">Mahsulot nomi</div>
              <div className="db-th brand-col">Brend</div>
              <div className="db-th cat-col">Kategoriya</div>
              <div className="db-th price-col">Narxi</div>
              <div className="db-th old-col">Eski narx</div>
              <div className="db-th disc-col">Chegirma</div>
              <div className="db-th stock-col">Ombor</div>
              <div className="db-th status-col">Holat</div>
              <div className="db-th act-col">Amallar</div>
            </div>
            {filtered.length === 0 ? (
              <div className="db-empty">Mahsulot topilmadi</div>
            ) : filtered.map((product, i) => (
              <div key={product.id} className={`db-table-row${selectedRows.has(product.id) ? ' db-row-selected' : ''}`} onClick={() => toggleRow(product.id)}>
                <div className="db-td cb-col" onClick={e => e.stopPropagation()}>
                  <input type="checkbox" checked={selectedRows.has(product.id)} onChange={() => toggleRow(product.id)} />
                </div>
                <div className="db-td num-col">{i + 1}</div>
                <div className="db-td img-col">
                  <div className="db-row-thumb">
                    <img src={makeImageUrl(product.image_url)} alt={product.name} onError={e => { e.currentTarget.src = PLACEHOLDER; }} />
                  </div>
                </div>
                <div className="db-td name-col"><div className="db-name-cell">{product.name}</div></div>
                <div className="db-td brand-col">{product.brand_name || '-'}</div>
                <div className="db-td cat-col">{product.category_name || '-'}</div>
                <div className="db-td price-col">{fmt(product.price)}</div>
                <div className="db-td old-col">{product.old_price ? fmt(product.old_price) : '-'}</div>
                <div className="db-td disc-col">
                  {product.discount_pct > 0 ? <span className="db-badge db-badge-red">-{product.discount_pct}%</span> : '-'}
                </div>
                <div className="db-td stock-col">{product.stock_qty || 0} ta</div>
                <div className="db-td status-col">
                  <div className={`db-status ${product.stock_qty > 0 ? 'db-status-active' : 'db-status-out'}`}>
                    <span className="db-status-dot" />
                    {product.stock_qty > 0 ? 'Mavjud' : 'Tugagan'}
                  </div>
                </div>
                <div className="db-td act-col" onClick={e => e.stopPropagation()}>
                  <div className="db-actions">
                    <button className="db-act-icon db-act-danger" title="O'chirish" onClick={() => onDeleteProduct(product.id)}>
                      <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>
                    </button>
                    <button className="db-act-icon" title="Ko'rish">
                      <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
            <div className="db-pagination">
              <span className="db-pag-info">Jami {filtered.length} ta mahsulot</span>
            </div>
          </div>
        </div>
      </main>
      {modalOpen && <AddProductModal open={modalOpen} onClose={() => setModalOpen(false)} brands={brands} categories={categories} onAddProduct={onAddProduct} />}
    </div>
  );
}

function AdminUsersPage({ users, auth }) {
  const [search, setSearch] = useState('');
  const filtered = users.filter(u => 
    !search || 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    (u.phone && u.phone.includes(search))
  );

  return (
    <div className="db-layout">
      <AdminSidebar auth={auth} />
      <main className="db-main">
        <header className="db-topbar">
          <div className="db-topbar-title">Mijozlar ro'yxati</div>
          <div className="db-topbar-actions">
            <div className="db-stat-chip"><span>Jami:</span><strong>{users.length} ta</strong></div>
          </div>
        </header>
        <div className="db-content">
          <div className="db-toolbar">
            <div className="db-search-box">
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              <input type="text" placeholder="Ism, email yoki telefon bo'yicha qidirish..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
          </div>
          <div className="db-table-wrap">
            <div className="db-table-head" style={{display:'grid', gridTemplateColumns:'44px 1.2fr 1fr 1fr 80px 100px 120px', gap:8, padding:'0 14px'}}>
              <div className="db-th">#</div>
              <div className="db-th">F.I.SH</div>
              <div className="db-th">Email</div>
              <div className="db-th">Telefon</div>
              <div className="db-th">Rol</div>
              <div className="db-th">Holat</div>
              <div className="db-th">Ro'yxatdan o'tgan</div>
            </div>
            {filtered.length === 0 ? (
              <div className="db-empty">Mijozlar topilmadi</div>
            ) : filtered.map((user, i) => (
              <div key={user.id} className="db-table-row" style={{display:'grid', gridTemplateColumns:'44px 1.2fr 1fr 1fr 80px 100px 120px', gap:8, padding:'0 14px'}}>
                <div className="db-td">{i + 1}</div>
                <div className="db-td"><strong>{user.name}</strong></div>
                <div className="db-td">{user.email}</div>
                <div className="db-td" style={{fontSize:'.85rem'}}>{user.phone || '—'}</div>
                <div className="db-td">
                  <span className={`db-badge ${user.role === 'admin' ? 'db-badge-red' : 'db-badge-green'}`}>
                    {user.role}
                  </span>
                </div>
                <div className="db-td">
                  <div className={`db-status ${user.is_active ? 'db-status-active' : 'db-status-out'}`} style={{fontSize:'.75rem'}}>
                    <span className="db-status-dot" />
                    {user.is_active ? 'Faol' : 'Nofaol'}
                  </div>
                </div>
                <div className="db-td" style={{fontSize:'.8rem', color:'var(--muted)'}}>
                  {user.created_at ? new Date(user.created_at).toLocaleDateString() : '—'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

function AdminCategoriesPage({ categories, onAddCategory, auth }) {
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ name: '', icon: '' });
  const [showPicker, setShowPicker] = useState(false);
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const pickerRef = useRef(null);
  const filtered = categories.filter(c => !search || c.name.toLowerCase().includes(search.toLowerCase()));

  useEffect(() => {
    function handleClick(e) {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) {
        setShowPicker(false);
      }
    }
    if (showPicker) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showPicker]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name) { setMsg("Nom majburiy"); return; }
    setLoading(true);
    const res = await fetch(`${API_BASE}/api/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: form.name, icon: form.icon }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) { setMsg(data.error || 'Xatolik'); return; }
    onAddCategory(data);
    setForm({ name: '', icon: '' });
    setMsg('');
    setModalOpen(false);
  }

  function handleClose() {
    setModalOpen(false);
    setShowPicker(false);
    setMsg('');
  }

  return (
    <div className="db-layout">
      <AdminSidebar auth={auth} />
      <main className="db-main">
        <header className="db-topbar">
          <div className="db-topbar-title">Kategoriyalar</div>
          <div className="db-topbar-actions">
            <div className="db-stat-chip"><span>Jami:</span><strong>{categories.length} ta</strong></div>
          </div>
        </header>
        <div className="db-content">
          <div className="db-toolbar">
            <div className="db-search-box">
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              <input type="text" placeholder="Kategoriya qidirish..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <div className="db-toolbar-right">
              <button className="db-btn-primary" onClick={() => setModalOpen(true)}>
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>
                Kategoriya qo'shish
              </button>
            </div>
          </div>

          {modalOpen && (
            <div className="dialog-overlay" onClick={handleClose}>
              <div className="dialog-card add-product-modal" onClick={e => e.stopPropagation()}>
                <div className="dialog-header">
                  <h2>Yangi kategoriya</h2>
                  <button type="button" className="close-btn" onClick={handleClose}>✕</button>
                </div>
                <div className="dialog-body">
                  <form className="dashboard-form" onSubmit={handleSubmit}>
                    <label>Kategoriya nomi *
                      <input
                        value={form.name}
                        onChange={e => setForm(p => ({...p, name: e.target.value}))}
                        required
                        placeholder="Smartfonlar"
                      />
                    </label>
                    <label>Icon
                      <div className="emoji-field">
                        <button
                          type="button"
                          className="emoji-trigger"
                          onClick={() => setShowPicker(p => !p)}
                        >
                          <span className="emoji-preview">{form.icon || '\ud83d\udce6'}</span>
                          <span className="emoji-trigger-label">Icon tanlash</span>
                          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></svg>
                        </button>
                        {showPicker && (
                          <div className="emoji-picker-wrap" ref={pickerRef}>
                            <EmojiPicker
                              onEmojiClick={e => { setForm(p => ({...p, icon: e.emoji})); setShowPicker(false); }}
                              width={300}
                              height={350}
                              searchPlaceHolder="Qidirish..."
                              previewConfig={{ showPreview: false }}
                            />
                          </div>
                        )}
                      </div>
                    </label>
                    {msg ? <div className="auth-error">{msg}</div> : null}
                    <div className="modal-actions">
                      <button type="button" className="cancel-btn" onClick={handleClose}>Bekor qilish</button>
                      <button type="submit" className="auth-submit" disabled={loading}>{loading ? 'Saqlanmoqda...' : "Qo'shish"}</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

          <div className="db-table-wrap">
            <div className="db-table-head" style={{display:'grid',gridTemplateColumns:'44px 56px 1fr 160px',gap:8,padding:'0 14px'}}>
              <div className="db-th">#</div>
              <div className="db-th">Icon</div>
              <div className="db-th">Nomi</div>
              <div className="db-th">Slug</div>
            </div>
            {filtered.length === 0 ? (
              <div className="db-empty">Kategoriya topilmadi</div>
            ) : filtered.map((cat, i) => (
              <div key={cat.id} className="db-table-row" style={{display:'grid',gridTemplateColumns:'44px 56px 1fr 160px',gap:8,padding:'0 14px'}}>
                <div className="db-td">{i + 1}</div>
                <div className="db-td" style={{fontSize:'1.5rem'}}>{cat.icon || '\ud83d\udce6'}</div>
                <div className="db-td"><strong>{cat.name}</strong></div>
                <div className="db-td" style={{color:'var(--muted)',fontSize:'.8rem'}}>{cat.slug}</div>
              </div>
            ))}
            <div className="db-pagination">
              <span className="db-pag-info">Jami {filtered.length} ta kategoriya</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function AdminBrandsPage({ brands, onAddBrand, auth }) {
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ name: '', logo_url: '' });
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const filtered = brands.filter(b => !search || b.name.toLowerCase().includes(search.toLowerCase()));

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name) { setMsg("Nom majburiy"); return; }
    setLoading(true);
    const res = await fetch(`${API_BASE}/api/brands`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: form.name, logo_url: form.logo_url }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) { setMsg(data.error || 'Xatolik'); return; }
    onAddBrand(data);
    setForm({ name: '', logo_url: '' });
    setMsg('');
    setModalOpen(false);
  }

  return (
    <div className="db-layout">
      <AdminSidebar auth={auth} />
      <main className="db-main">
        <header className="db-topbar">
          <div className="db-topbar-title">Brendlar</div>
          <div className="db-topbar-actions">
            <div className="db-stat-chip"><span>Jami:</span><strong>{brands.length} ta</strong></div>
          </div>
        </header>
        <div className="db-content">
          <div className="db-toolbar">
            <div className="db-search-box">
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              <input type="text" placeholder="Brend qidirish..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <div className="db-toolbar-right">
              <button className="db-btn-primary" onClick={() => setModalOpen(true)}>
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>
                Brend qo'shish
              </button>
            </div>
          </div>

          {modalOpen && (
            <div className="dialog-overlay" onClick={() => setModalOpen(false)}>
              <div className="dialog-card add-product-modal" onClick={e => e.stopPropagation()}>
                <div className="dialog-header">
                  <h2>Yangi brend</h2>
                  <button type="button" className="close-btn" onClick={() => setModalOpen(false)}>✕</button>
                </div>
                <div className="dialog-body">
                  <form className="dashboard-form" onSubmit={handleSubmit}>
                    <label>Brend nomi *<input value={form.name} onChange={e => setForm(p => ({...p, name: e.target.value}))} required placeholder="Apple" /></label>
                    <label>Logo URL<input value={form.logo_url} onChange={e => setForm(p => ({...p, logo_url: e.target.value}))} placeholder="https://..." /></label>
                    {msg ? <div className="auth-error">{msg}</div> : null}
                    <div className="modal-actions">
                      <button type="button" className="cancel-btn" onClick={() => setModalOpen(false)}>Bekor qilish</button>
                      <button type="submit" className="auth-submit" disabled={loading}>{loading ? 'Saqlanmoqda...' : "Qo'shish"}</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

          <div className="db-table-wrap">
            <div className="db-table-head" style={{display:'grid',gridTemplateColumns:'44px 56px 1fr 180px',gap:8,padding:'0 14px'}}>
              <div className="db-th">#</div>
              <div className="db-th">Logo</div>
              <div className="db-th">Nomi</div>
              <div className="db-th">Slug</div>
            </div>
            {filtered.length === 0 ? (
              <div className="db-empty">Brend topilmadi</div>
            ) : filtered.map((brand, i) => (
              <div key={brand.id} className="db-table-row" style={{display:'grid',gridTemplateColumns:'44px 56px 1fr 180px',gap:8,padding:'0 14px'}}>
                <div className="db-td">{i + 1}</div>
                <div className="db-td">
                  {brand.logo_url
                    ? <img src={brand.logo_url} alt={brand.name} style={{width:32,height:32,objectFit:'contain',borderRadius:6,background:'#f5f5f5',padding:3}} onError={e=>{e.currentTarget.style.display='none'}} />
                    : <div style={{width:32,height:32,borderRadius:6,background:'#FDECEA',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:900,color:'#E63329',fontSize:13}}>{brand.name[0]}</div>
                  }
                </div>
                <div className="db-td"><strong>{brand.name}</strong></div>
                <div className="db-td" style={{color:'var(--muted)',fontSize:'.8rem'}}>{brand.slug}</div>
              </div>
            ))}
            <div className="db-pagination">
              <span className="db-pag-info">Jami {filtered.length} ta brend</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function DashboardPage({ products, brands, categories, users, auth }) {
  const navigate = useNavigate();
  const totalValue = products.reduce((sum, p) => sum + Number(p.price || 0), 0);

  const stats = [
    { label: 'Jami mahsulotlar', value: products.length, icon: '📦', to: '/dashboard/products', color: '#FDECEA', tc: '#E63329' },
    { label: 'Kategoriyalar', value: categories.length, icon: '🏷️', to: '/dashboard/categories', color: '#EBF2FF', tc: '#2563EB' },
    { label: 'Brendlar', value: brands.length, icon: '⭐', to: '/dashboard/brands', color: '#DCFCE7', tc: '#16A34A' },
    { label: 'Mijozlar', value: users.length, icon: '👤', to: '/dashboard/users', color: '#F3E8FF', tc: '#9333EA' },
    { label: 'Umumiy qiymat', value: Math.round(totalValue / 1000000) + ' mln', icon: '💰', to: '/dashboard/products', color: '#FEF9C3', tc: '#CA8A04' },
  ];

  return (
    <div className="db-layout">
      <AdminSidebar auth={auth} />
      <main className="db-main">
        <header className="db-topbar">
          <div className="db-topbar-title">Admin Dashboard</div>
          <div className="db-topbar-actions">
            <div className="db-stat-chip"><span>Salom,</span><strong>{auth?.user?.name || 'Admin'}</strong></div>
          </div>
        </header>
        <div className="db-content">
          <div className="db-stats-grid">
            {stats.map(s => (
              <div key={s.label} className="db-stat-card" style={{'--sc': s.color, '--tc': s.tc}} onClick={() => navigate(s.to)}>
                <div className="db-stat-icon">{s.icon}</div>
                <div className="db-stat-value">{s.value}</div>
                <div className="db-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
          <div className="db-dash-section">
            <div className="db-dash-header">
              <span className="db-dash-title">So'nggi mahsulotlar</span>
              <button className="db-btn-primary" onClick={() => navigate('/dashboard/products')}>
                Barchasi
                <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </button>
            </div>
            <div className="db-table-wrap">
              <div className="db-table-head">
                <div className="db-th num-col">#</div>
                <div className="db-th img-col">Rasm</div>
                <div className="db-th name-col">Mahsulot</div>
                <div className="db-th brand-col">Brend</div>
                <div className="db-th price-col">Narxi</div>
                <div className="db-th status-col">Holat</div>
              </div>
              {products.slice(0, 8).map((p, i) => (
                <div key={p.id} className="db-table-row">
                  <div className="db-td num-col">{i + 1}</div>
                  <div className="db-td img-col">
                    <div className="db-row-thumb">
                      <img src={makeImageUrl(p.image_url)} alt={p.name} onError={e => { e.currentTarget.src = PLACEHOLDER; }} />
                    </div>
                  </div>
                  <div className="db-td name-col"><div className="db-name-cell">{p.name}</div></div>
                  <div className="db-td brand-col">{p.brand_name || '-'}</div>
                  <div className="db-td price-col">{fmt(p.price)}</div>
                  <div className="db-td status-col">
                    <div className={`db-status ${p.stock_qty > 0 ? 'db-status-active' : 'db-status-out'}`}>
                      <span className="db-status-dot" />
                      {p.stock_qty > 0 ? 'Mavjud' : 'Tugagan'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function fmt(value) {
  return Number(value || 0).toLocaleString('uz-UZ').replace(/,/g, ' ') + " so'm";
}

function makeImageUrl(imageUrl) {
  if (!imageUrl) return PLACEHOLDER;
  if (imageUrl.startsWith('http')) {
    return imageUrl;
  }
  return `${API_BASE}${imageUrl}`;
}

function stars(rating) {
  const value = Math.round(Number(rating) || 0);
  return Array.from({ length: 5 }, (_, index) => (
    <svg key={index} width="12" height="12" viewBox="0 0 24 24" fill={index < value ? '#F5A623' : '#E0E0E0'} stroke="none">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ));
}

function Topbar() {
  return (
    <div className="topbar">
      <div className="wrap topbar-inner">
        <div className="topbar-links">
          <a href="https://t.me/openshop_chatbot" target="_blank" rel="noreferrer">
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 3L3 10.5l6.5 2L17 7l-4.5 7 2 6.5L21 3z"/></svg>
            Telegram operator
          </a>
          <a href="tel:+998712036660">
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.12 1.18 2 2 0 012.11 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
            +998 71 203 66 60
          </a>
        </div>
        <div className="topbar-meta">
          <span>Har kuni 9:00–22:00</span>
          <a href="#">O'zbekiston</a>
        </div>
      </div>
    </div>
  );
}

function Banner({ products = [] }) {
  const defaultSlides = [
    { className: 'b1' },
    { className: 'b2' },
    { className: 'b3' },
  ];

  const slides = (products && products.length > 0)
    ? products.slice(0, 3).map((p, i) => ({
        tag: p.brand_name || 'Taklif',
        title: p.name || 'Mahsulot',
        sub: p.description ? (p.description.length > 80 ? p.description.slice(0, 77) + '...' : p.description) : '',
        price: p.price ? fmt(p.price) : '',
        oldPrice: p.old_price ? fmt(p.old_price) : '',
        color: '#fff',
        button: 'Batafsil',
        className: defaultSlides[i] ? defaultSlides[i].className : 'b1',
        image: p.image_url || p.image || '',
      }))
    : [
        {
          tag: '🔥 Eng sara taklif',
          title: 'iPhone 15 Pro Max\\n256GB Titanium',
          sub: 'Apple A17 Pro chip • 48MP kamera',
          price: '12 999 000 so\'m',
          oldPrice: '14 500 000 so\'m',
          color: '#fff',
          button: 'Hozir sotib ol',
          className: 'b1',
          image: '',
        },
        {
          tag: '💻 Noutbuklar',
          title: 'MacBook Air M2\\n13" 8GB/256GB',
          sub: 'Apple Silicon • 18 soat batareya',
          price: '16 490 000 so\'m',
          oldPrice: '18 000 000 so\'m',
          color: '#0f4c3a',
          button: 'Batafsil',
          className: 'b2',
          image: '',
        },
        {
          tag: '📺 Televizorlar',
          title: 'Samsung QLED\\n55" 4K Smart TV',
          sub: 'Quantum HDR • 120Hz panel',
          price: '8 990 000 so\'m',
          oldPrice: '11 200 000 so\'m',
          color: '#2c1a4e',
          button: 'Ko\'rish',
          className: 'b3',
          image: '',
        },
      ];

  const [slide, setSlide] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSlide((prev) => (prev + 1) % slides.length);
    }, 4500);
    return () => window.clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="banner-section" id="main-content">
      <div className="banner-slider">
        <div className="banner-track" style={{ transform: `translateX(-${slide * 100}%)` }}>
          {slides.map((item, index) => (
            <div key={index} className={`banner-slide ${item.className}`}>
              <div className="banner-content">
                <div className="banner-tag">{item.tag}</div>
                <div className="banner-title" style={{ whiteSpace: 'pre-line' }}>{item.title}</div>
                <div className="banner-sub">{item.sub}</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 8 }}>
                  <div className="banner-price">{item.price}</div>
                  <div className="banner-old">{item.oldPrice}</div>
                </div>
                <Link to="/" className="banner-btn" style={{ color: item.color }}>
                  {item.button}
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </Link>
              </div>
              {item.image ? (
                <img className="banner-image" src={makeImageUrl(item.image)} alt={item.title} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
              ) : (
                <div className="banner-img-right" />
              )}
            </div>
          ))}
        </div>
        <button className="banner-arrow ba-prev" type="button" onClick={() => setSlide((prev) => (prev - 1 + slides.length) % slides.length)}>
          <svg width="18" height="18" fill="none" stroke="#333" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
        <button className="banner-arrow ba-next" type="button" onClick={() => setSlide((prev) => (prev + 1) % slides.length)}>
          <svg width="18" height="18" fill="none" stroke="#333" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg>
        </button>
        <div className="banner-dots">
          {slides.map((_, index) => (
            <div key={index} className={`bdot${index === slide ? ' on' : ''}`} onClick={() => setSlide(index)} />
          ))}
        </div>
      </div>
    </div>
  );
}



function AppBanner() {
  return (
    <div className="app-banner">
      <div className="app-banner-text">
        <h3>📱 Ilovani yuklab oling!</h3>
        <p>Ko'proq chegirmalar va qulay buyurtma berish uchun</p>
        <div className="app-btns">
          <a href="#" className="app-btn">
            <svg viewBox="0 0 24 24" fill="white"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
            App Store
          </a>
          <a href="#" className="app-btn">
            <svg viewBox="0 0 24 24" fill="white"><path d="M3.18 23.76A1 1 0 012 22.89V1.11a1 1 0 011.18-.87l11.63 10.94-11.63 12.58zM20.43 10.3l-2.72-1.57-3.09 2.9 3.09 2.9 2.75-1.59a1.59 1.59 0 000-2.64zM4.34 1.23l11.05 10.39-3.09-2.9L4.34 1.23zm0 21.54l7.96-7.49-3.09-2.9L4.34 22.77z"/></svg>
            Google Play
          </a>
        </div>
      </div>
      <div className="app-qr" />
    </div>
  );
}

function ProductCard({ product, isWish, onToggleWish, onAddCart, onView }) {
  return (
    <div className="pc" onClick={() => onView(product.id)}>
      <div className="pc-img-wrap">
           <img className="pc-img" src={makeImageUrl(product.image_url)} alt={product.name} title={makeImageUrl(product.image_url)} onError={(e) => { e.currentTarget.src = PLACEHOLDER; }} />
        <div className="pc-badge">
          {product.discount_pct ? <span className="badge-d">-{product.discount_pct}%</span> : null}
          {product.is_new ? <span className="badge-n">NEW</span> : null}
        </div>
        <button className={`pc-wish${isWish ? ' on' : ''}`} type="button" onClick={(event) => { event.stopPropagation(); onToggleWish(product.id); }} title="Sevimli">
          <svg width="14" height="14" fill={isWish ? 'currentColor' : 'none'} stroke={isWish ? 'var(--red)' : 'currentColor'} strokeWidth="2" viewBox="0 0 24 24" style={{ color: isWish ? 'var(--red)' : 'var(--muted)' }}>
            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
          </svg>
        </button>
      </div>
      <div className="pc-body">
        <div className="pc-brand">{product.brand_name || product.brand}</div>
        <div className="pc-name">{product.name}</div>
        <div className="pc-stars">{stars(product.rating_avg || product.rating)} <span>{Number(product.rating_avg || product.rating || 0).toFixed(1)}</span></div>
        <div className="pc-price-row">
          <div className="pc-price">{fmt(product.price)}</div>
          {(product.old_price || product.old) ? <div className="pc-old">{fmt(product.old_price || product.old)}</div> : null}
        </div>
        <button className="pc-cart" type="button" onClick={(event) => { event.stopPropagation(); onAddCart(product.id); }}>
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg>
          Savatga qo'shish
        </button>
      </div>
    </div>
  );
}

function CartSection({ products, cart, onChangeQty, onRemove }) {
  const items = Object.entries(cart).map(([id, qty]) => {
    const product = products.find((item) => item.id === id);
    return product ? { product, qty } : null;
  }).filter(Boolean);

  if (!items.length) {
    return (
      <div className="cart-body">
        <div style={{ textAlign: 'center', color: 'var(--muted)' }}>
          <div style={{ fontSize: '3rem', marginBottom: 12 }}>🛒</div>
          <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text)', marginBottom: 6 }}>Savat bo'sh</div>
          <div style={{ fontSize: '.88rem' }}>Mahsulot qo'shing va buyurtma bering</div>
        </div>
      </div>
    );
  }

  const total = items.reduce((sum, item) => sum + Number(item.product.price || 0) * item.qty, 0);

  return (
    <div className="cart-body">
      {items.map(({ product, qty }) => (
        <div key={product.id} className="cart-row">
          <img src={makeImageUrl(product.image_url)} alt={product.name} onError={(e) => { e.currentTarget.src = PLACEHOLDER; }} />
          <div>
            <div className="cart-title">{product.name}</div>
            <div className="cart-value">{fmt(product.price)}</div>
          </div>
          <div className="cart-counter">
            <button type="button" onClick={() => onChangeQty(product.id, -1)}>-</button>
            <span>{qty}</span>
            <button type="button" onClick={() => onChangeQty(product.id, 1)}>+</button>
          </div>
          <button type="button" className="cart-remove" onClick={() => onRemove(product.id)}>✕</button>
        </div>
      ))}
      <div className="cart-summary">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: '.9rem' }}>
          <span style={{ color: 'var(--muted)' }}>Yetkazib berish</span>
          <span style={{ fontWeight: 700, color: 'var(--green)' }}>Bepul</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, fontSize: '1.05rem' }}>
          <span style={{ fontWeight: 700 }}>Jami:</span>
          <span style={{ fontWeight: 900, color: 'var(--red)' }}>{fmt(total)}</span>
        </div>
        <button type="button" className="order-btn" onClick={() => alert('Buyurtma berildi!')}>🛒 Buyurtma berish</button>
      </div>
    </div>
  );
}

function CategorySection({ categories, selectedCategory, onSelectCategory }) {
  return (
    <section className="section">
      <div className="sec-head">
        <h2 className="sec-title">📦 <b>Kategoriyalar</b></h2>
        <button className="sec-more" type="button" onClick={() => onSelectCategory(null)}>Barchasi →</button>
      </div>
      <div className="cat-grid">
        {categories.map((category) => (
          <button key={category.id} type="button" className="cat-card" onClick={() => onSelectCategory(category.name)}>
            <div className="cat-icon">{category.icon || '📦'}</div>
            <div className="cat-name">{category.name}</div>
          </button>
        ))}
      </div>
    </section>
  );
}

function FlashSale({ products, onToggleWish, onAddCart, onView, wish }) {
  const flash = products.filter((product) => product.discount_pct > 0);
  return (
    <div className="flash-section">
      <div className="flash-head">
        <div className="flash-title">⚡ Chegirmalar</div>
        <div className="countdown">23:59:59</div>
      </div>
      <div className="flash-scroll">
        {flash.map((product) => (
          <ProductCard key={product.id} product={product} isWish={wish.has(product.id)} onToggleWish={onToggleWish} onAddCart={onAddCart} onView={onView} />
        ))}
      </div>
    </div>
  );
}

function ProductGrid({ title, products, onToggleWish, onAddCart, onView, wish }) {
  return (
    <section className="section">
      <div className="sec-head">
        <h2 className="sec-title">{title}</h2>
        <button className="sec-more" type="button">Barchasi →</button>
      </div>
      <div className="prod-grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} isWish={wish.has(product.id)} onToggleWish={onToggleWish} onAddCart={onAddCart} onView={onView} />
        ))}
      </div>
    </section>
  );
}

function Home({ categories, products, cart, wish, onToggleWish, onAddCart, onSearch, searchTerm, onSelectCategory, selectedCategory, onChangeQty, onRemove }) {
  const navigate = useNavigate();
  return (
    <main>
      <Banner products={products} />
      <div className="wrap">
        <AppBanner />
      </div>
      <CategorySection categories={categories} selectedCategory={selectedCategory} onSelectCategory={onSelectCategory} />
      <FlashSale products={products} onToggleWish={onToggleWish} onAddCart={onAddCart} onView={(id) => navigate(`/products/${id}`)} wish={wish} />
      <ProductGrid title="⭐ Tavsiya etamiz" products={products.slice(0, 10)} onToggleWish={onToggleWish} onAddCart={onAddCart} onView={(id) => navigate(`/products/${id}`)} wish={wish} />
      <ProductGrid title="🆕 Yangi mahsulotlar" products={[...products.filter((product) => product.is_new), ...products.filter((product) => !product.is_new).slice(0, 7)].slice(0, 10)} onToggleWish={onToggleWish} onAddCart={onAddCart} onView={(id) => navigate(`/products/${id}`)} wish={wish} />
      <section className="section" id="cart-sec">
        <div className="sec-head">
          <h2 className="sec-title">🛒 <b>Savat</b></h2>
        </div>
        <div className="wrap">
          <CartSection products={products} cart={cart} onChangeQty={onChangeQty} onRemove={onRemove} />
        </div>
      </section>
    </main>
  );
}

function ProductDetail({ products, onAddCart }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = products.find((item) => String(item.id) === String(id));

  if (!product) {
    return <div className="wrap loading">Mahsulot topilmadi.</div>;
  }

  return (
    <main className="wrap detail-page">
      <button className="detail-back" type="button" onClick={() => navigate(-1)}>← Ortga</button>
      <div className="detail-grid">
        <div className="detail-image">
          <img src={makeImageUrl(product.image_url)} alt={product.name} onError={(e) => { e.currentTarget.src = PLACEHOLDER; }} />
        </div>
        <div className="detail-info">
          <span className="detail-badge">{product.discount_pct ? `${product.discount_pct}% chegirma` : 'Yangi'}</span>
          <h1>{product.name}</h1>
          <p className="detail-meta">{product.brand_name || product.brand} • {product.category_name || product.category}</p>
          <div className="detail-price-row">
            <strong>{fmt(product.price)}</strong>
            {product.old_price ? <span>{fmt(product.old_price)}</span> : null}
          </div>
          <div className="detail-rating">{stars(product.rating_avg || product.rating)} <span>{Number(product.rating_avg || product.rating || 0).toFixed(1)}</span></div>
          <p className="detail-description">{product.description || product.sub_title || 'Mahsulot haqida batafsil maʼlumot yoʻq.'}</p>
          <div className="detail-specs">
            <div><strong>Omborda:</strong> {product.stock_qty || 0} ta</div>
            <div><strong>Kafolat:</strong> {product.warranty_months || 12} oy</div>
          </div>
          <button type="button" className="pc-cart" onClick={() => onAddCart(product.id)}>
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg>
            Savatga qo'shish
          </button>
        </div>
      </div>
    </main>
  );
}

function Footer() {
  return (
    <footer>
      <div className="wrap">
        <div className="footer-grid">
          <div>
            <div className="footer-title">OpenShop.uz</div>
            <div className="footer-contact">
              <a href="tel:+998712036660">+998 (71) 203 66 60</a><br />
              Har kuni 9:00 dan 22:00 gacha<br />
              <a href="mailto:info@openshop.uz" style={{ color: '#9aa0a6', fontWeight: 400 }}>info@openshop.uz</a>
            </div>
            <div className="social-row">
              <a href="https://instagram.com/openshop_uz" className="social-btn" target="_blank" rel="noreferrer">
                <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1" fill="white" stroke="none"/></svg>
              </a>
              <a href="https://t.me/OPENSHOP_UZ" className="social-btn" target="_blank" rel="noreferrer">
                <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M21 3L3 10.5l6.5 2L17 7l-4.5 7 2 6.5L21 3z"/></svg>
              </a>
              <a href="https://youtube.com/@Openshop_uz" className="social-btn" target="_blank" rel="noreferrer">
                <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><rect x="2" y="6" width="20" height="13" rx="3"/><polygon points="10,9 16,12.5 10,16" fill="white" stroke="none"/></svg>
              </a>
              <a href="https://facebook.com/openshop.uz" className="social-btn" target="_blank" rel="noreferrer">
                <svg viewBox="0 0 24 24" fill="white" stroke="none"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>
              </a>
            </div>
          </div>
          <div>
            <div className="footer-title">Buyurtma</div>
            <ul className="footer-links">
              <li><a href="#">Atamalar va ta'riflar</a></li>
              <li><a href="#">Ro'yxatdan o'tish</a></li>
              <li><a href="#">Ommaviy Oferta</a></li>
              <li><a href="#">Izohlarni nashr etish</a></li>
            </ul>
          </div>
          <div>
            <div className="footer-title">To'lov va yetkazish</div>
            <ul className="footer-links">
              <li><a href="#">Mahsulot narxi</a></li>
              <li><a href="#">Tovarlarni topshirish</a></li>
              <li><a href="#">Mahsulot kafolati</a></li>
              <li><a href="#">Sotib oluvchi da'volari</a></li>
            </ul>
          </div>
          <div>
            <div className="footer-title">Qaytarish</div>
            <ul className="footer-links">
              <li><a href="#">Sifatli tovarni qaytarish</a></li>
              <li><a href="#">Nuqsonli tovarni qaytarish</a></li>
              <li><a href="#">Huquqiy asoslar</a></li>
              <li><a href="#">Yakuniy qoidalar</a></li>
            </ul>
          </div>
          <div>
            <div className="footer-title">To'lov usullari</div>
            <div className="footer-payments">
              <span className="pay-badge">Uzcard</span>
              <span className="pay-badge">Humo</span>
              <span className="pay-badge">Visa</span>
              <span className="pay-badge">Click</span>
              <span className="pay-badge">Payme</span>
              <span className="pay-badge">Ipak Yo'li</span>
            </div>
            <div style={{ marginTop: 16, fontSize: '.8rem', color: '#666' }}>
              <a href="/page/locations" style={{ color: '#9aa0a6' }}>📍 Bizning do'konlarimiz</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span style={{ fontSize: '.8rem', color: '#666' }}>© 2018–2026 "OPEN SHOP" MCHJ STIR 307095613</span>
          <a href="https://openshop.uz/app-download" style={{ fontSize: '.8rem', color: '#9aa0a6' }}>📱 Ilovani yuklab olish</a>
        </div>
      </div>
    </footer>
  );
}

function Toast({ message }) {
  return <div className={`cart-toast${message ? ' show' : ''}`}>{message || ''}</div>;
}

function MobileNav({ active, onNavigate }) {
  return (
    <nav className="mobile-nav">
      <div className="wrap">
        <button type="button" className={`mnbtn${active === 'Asosiy' ? ' active' : ''}`} onClick={() => onNavigate('Asosiy')}>
          <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          Asosiy
        </button>
        <button type="button" className={`mnbtn${active === 'Katalog' ? ' active' : ''}`} onClick={() => onNavigate('Katalog')}>
          <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          Katalog
        </button>
        <button type="button" className={`mnbtn${active === 'Savat' ? ' active' : ''}`} onClick={() => onNavigate('Savat')}>
          <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
          Savat
        </button>
        <button type="button" className={`mnbtn${active === 'Sevimli' ? ' active' : ''}`} onClick={() => onNavigate('Sevimli')}>
          <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
          Sevimli
        </button>
        <button type="button" className={`mnbtn${active === 'Kabinet' ? ' active' : ''}`} onClick={() => onNavigate('Kabinet')}>
          <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          Kabinet
        </button>
      </div>
    </nav>
  );
}

function App() {
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [catalogOpen, setCatalogOpen] = useState(false);
  const [cart, setCart] = useState({});
  const [wish, setWish] = useState(new Set());
  const [toastMessage, setToastMessage] = useState('');
  const [mobileActive, setMobileActive] = useState('Asosiy');
  const [auth, setAuth] = useState(() => {
    try {
      const saved = localStorage.getItem('auth');
      return saved ? JSON.parse(saved) : { role: null, user: null };
    } catch { return { role: null, user: null }; }
  });
  const navigate = useNavigate();


  useEffect(() => {
    async function load() {
      const [catsRes, brandsRes, productsRes, usersRes] = await Promise.all([
        fetch(`${API_BASE}/api/categories`),
        fetch(`${API_BASE}/api/brands`),
        fetch(`${API_BASE}/api/products`),
        fetch(`${API_BASE}/api/users`).catch(() => null),
      ]);
      if (catsRes.ok) setCategories(await catsRes.json());
      if (brandsRes.ok) setBrands(await brandsRes.json());
      if (productsRes.ok) {
        const productsJson = await productsRes.json();
        setProducts(productsJson);
      }
      if (usersRes && usersRes.ok) setUsers(await usersRes.json());
    }
    load();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = !searchTerm || product.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !selectedCategory || product.category_name === selectedCategory || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, selectedCategory]);

  const cartCount = Object.values(cart).reduce((sum, qty) => sum + qty, 0);

  function showToast(message) {
    setToastMessage(message);
    window.setTimeout(() => setToastMessage(''), 2200);
  }

  function handleAddCart(productId) {
    setCart((prev) => ({ ...prev, [productId]: (prev[productId] || 0) + 1 }));
    showToast('✓ Savatga qo\'shildi!');
  }

  function handleToggleWish(productId) {
    setWish((prev) => {
      const next = new Set(prev);
      if (next.has(productId)) next.delete(productId);
      else next.add(productId);
      return next;
    });
  }

  function handleChangeQty(productId, delta) {
    setCart((prev) => {
      const next = { ...prev };
      next[productId] = Math.max(0, (next[productId] || 0) + delta);
      if (next[productId] <= 0) delete next[productId];
      return next;
    });
  }

  function handleRemove(productId) {
    setCart((prev) => {
      const next = { ...prev };
      delete next[productId];
      return next;
    });
  }

  async function handleAddProduct(data) {
    try {
      const response = await fetch(`${API_BASE}/api/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const errorData = await response.json();
        showToast(errorData.error || 'Mahsulot saqlanmadi');
        return null;
      }
      const createdProduct = await response.json();
      setProducts((prev) => [createdProduct, ...prev]);
      showToast('Mahsulot bazaga saqlandi');
      return createdProduct;
    } catch (error) {
      console.error(error);
      showToast('Serverga ulanishda xatolik yuz berdi');
      return null;
    }
  }

  async function handleLogin(email, password) {
    // Admin hardcode (test uchun)
    if (email === 'admin@example.com' && password === 'Admin123') {
      const user = { id: 'admin', name: 'Administrator', email };
      const auth = { role: 'admin', user };
      setAuth(auth);
      localStorage.setItem('auth', JSON.stringify(auth));
      return { success: true, role: 'admin' };
    }
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) return { success: false, error: data.error };
      const authData = { role: data.role === 'admin' ? 'admin' : 'user', user: { id: data.id, name: data.name, email: data.email } };
      setAuth(authData);
      localStorage.setItem('auth', JSON.stringify(authData));
      return { success: true, role: authData.role };
    } catch {
      return { success: false, error: 'Serverga ulanishda xatolik' };
    }
  }

  function handleRegister(user) {
    const authData = { role: 'user', user: { id: user.id, name: user.name, email: user.email } };
    setAuth(authData);
    localStorage.setItem('auth', JSON.stringify(authData));
    showToast(`Xush kelibsiz, ${user.name}!`);
  }

  function handleAddCategory(cat) {
    setCategories(prev => [...prev, cat]);
  }

  function handleAddBrand(brand) {
    setBrands(prev => [...prev, brand]);
  }

  async function handleDeleteProduct(productId) {
    try {
      const response = await fetch(`${API_BASE}/api/products/${productId}`, { method: 'DELETE' });
      if (!response.ok) {
        const err = await response.json();
        showToast(err.error || "O'chirishda xatolik");
        return;
      }
      setProducts((prev) => prev.filter((product) => String(product.id) !== String(productId)));
      showToast("Mahsulot o'chirildi");
    } catch {
      showToast('Serverga ulanishda xatolik');
    }
  }

  function handleLogout() {
    localStorage.removeItem('auth');
    setAuth({ role: null, user: null });
    navigate('/');
    showToast('Tizimdan chiqildi');
  }

  function handleSelectCategory(category) {
    setSelectedCategory(category);
    setCatalogOpen(false);
    navigate('/catalog');
  }

  function handleOpenCatalog() {
    setCatalogOpen(true);
    navigate('/catalog');
  }

  function handleMobileNavigate(tab) {
    setMobileActive(tab);
    if (tab === 'Asosiy') navigate('/');
    if (tab === 'Katalog') {
      setCatalogOpen(false);
      navigate('/catalog');
    }
    if (tab === 'Savat') navigate('/cart');
    if (tab === 'Sevimli') navigate('/favorites');
    if (tab === 'Kabinet') {
      if (auth.role) {
        localStorage.removeItem('auth');
        setAuth({ role: null, user: null });
        navigate('/');
      } else {
        navigate('/login');
      }
    }
  }

  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/dashboard');

  return (
    <div className="app">
      {!isDashboard && <Topbar />}
      {!isDashboard && (
        <Header
          cartCount={cartCount}
          wishCount={wish.size}
          searchTerm={searchTerm}
          onSearch={setSearchTerm}
          onFavorites={() => navigate('/favorites')}
          onCart={() => navigate('/cart')}
          onLogin={() => navigate('/login')}
          onLogout={handleLogout}
          onCatalog={handleOpenCatalog}
          auth={auth}
        />
      )}
      {!isDashboard && (
        <CatalogDialog
          open={catalogOpen}
          categories={categories}
          selectedCategory={selectedCategory}
          onClose={() => setCatalogOpen(false)}
          onSelectCategory={handleSelectCategory}
          onSearch={setSearchTerm}
        />
      )}
      {!isDashboard && <MobileNav active={mobileActive} onNavigate={handleMobileNavigate} />}
      <Routes>
        <Route path="/" element={
          <Home
            categories={categories}
            products={filteredProducts}
            cart={cart}
            wish={wish}
            onToggleWish={handleToggleWish}
            onAddCart={handleAddCart}
            onSearch={setSearchTerm}
            searchTerm={searchTerm}
            onSelectCategory={handleSelectCategory}
            selectedCategory={selectedCategory}
            onChangeQty={handleChangeQty}
            onRemove={handleRemove}
          />
        } />
        <Route path="/catalog" element={
          <CatalogPage
            categories={categories}
            products={filteredProducts}
            selectedCategory={selectedCategory}
            searchTerm={searchTerm}
            onSelectCategory={handleSelectCategory}
            onSearch={setSearchTerm}
            onToggleWish={handleToggleWish}
            onAddCart={handleAddCart}
            onView={(id) => navigate(`/products/${id}`)}
            wish={wish}
          />
        } />
        <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
        <Route path="/register" element={<RegisterPage onRegister={handleRegister} />} />
        <Route path="/favorites" element={<FavoritesPage products={products} wish={wish} onToggleWish={handleToggleWish} onView={(id) => navigate(`/products/${id}`)} />} />
        <Route path="/cart" element={<CartPage products={products} cart={cart} onChangeQty={handleChangeQty} onRemove={handleRemove} onAddCart={handleAddCart} />} />
        <Route path="/dashboard" element={
          auth.role === 'admin'
            ? <DashboardPage products={products} brands={brands} categories={categories} users={users} auth={auth} />
            : <Navigate to="/login" replace />
        } />
        <Route path="/dashboard/products" element={
          auth.role === 'admin'
            ? <AdminProductsPage products={products} brands={brands} categories={categories} onAddProduct={handleAddProduct} onDeleteProduct={handleDeleteProduct} auth={auth} />
            : <Navigate to="/login" replace />
        } />
        <Route path="/dashboard/users" element={
          auth.role === 'admin'
            ? <AdminUsersPage users={users} auth={auth} />
            : <Navigate to="/login" replace />
        } />
        <Route path="/dashboard/categories" element={
          auth.role === 'admin'
            ? <AdminCategoriesPage categories={categories} onAddCategory={handleAddCategory} auth={auth} />
            : <Navigate to="/login" replace />
        } />
        <Route path="/dashboard/brands" element={
          auth.role === 'admin'
            ? <AdminBrandsPage brands={brands} onAddBrand={handleAddBrand} auth={auth} />
            : <Navigate to="/login" replace />
        } />
        <Route path="/products/:id" element={<ProductDetail products={products} onAddCart={handleAddCart} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {!isDashboard && <Footer />}
      <Toast message={toastMessage} />
    </div>
  );
}

export default App;
