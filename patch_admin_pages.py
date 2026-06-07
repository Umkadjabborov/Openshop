import sys

file = r'c:\Users\user\Desktop\Oppen shop 2\src\App.jsx'
with open(file, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. DashboardPage + AddProductModal ni almashtirish
start = content.index('function AddProductModal(')
end = content.index('function fmt(')

new_code = r"""function AddProductModal({ open, onClose, brands, categories, onAddProduct }) {
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
          <button type="button" className="close-btn" onClick={onClose}>\u2715</button>
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

function AdminCategoriesPage({ categories, auth }) {
  const [search, setSearch] = useState('');
  const filtered = categories.filter(c => !search || c.name.toLowerCase().includes(search.toLowerCase()));

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
          </div>
          <div className="db-table-wrap">
            <div className="db-table-head" style={{gridTemplateColumns:'40px 1fr 120px 100px'}}>
              <div className="db-th">#</div>
              <div className="db-th">Nomi</div>
              <div className="db-th">Icon</div>
              <div className="db-th">Slug</div>
            </div>
            {filtered.length === 0 ? (
              <div className="db-empty">Kategoriya topilmadi</div>
            ) : filtered.map((cat, i) => (
              <div key={cat.id} className="db-table-row" style={{gridTemplateColumns:'40px 1fr 120px 100px'}}>
                <div className="db-td">{i + 1}</div>
                <div className="db-td"><strong>{cat.name}</strong></div>
                <div className="db-td" style={{fontSize:'1.4rem'}}>{cat.icon || '📦'}</div>
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

function AdminBrandsPage({ brands, auth }) {
  const [search, setSearch] = useState('');
  const filtered = brands.filter(b => !search || b.name.toLowerCase().includes(search.toLowerCase()));

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
          </div>
          <div className="db-table-wrap">
            <div className="db-table-head" style={{gridTemplateColumns:'40px 1fr 200px'}}>
              <div className="db-th">#</div>
              <div className="db-th">Brend nomi</div>
              <div className="db-th">Slug</div>
            </div>
            {filtered.length === 0 ? (
              <div className="db-empty">Brend topilmadi</div>
            ) : filtered.map((brand, i) => (
              <div key={brand.id} className="db-table-row" style={{gridTemplateColumns:'40px 1fr 200px'}}>
                <div className="db-td">{i + 1}</div>
                <div className="db-td">
                  <div style={{display:'flex',alignItems:'center',gap:10}}>
                    {brand.logo_url
                      ? <img src={brand.logo_url} alt={brand.name} style={{width:32,height:32,objectFit:'contain',borderRadius:6,background:'#f5f5f5',padding:3}} onError={e=>{e.currentTarget.style.display='none'}} />
                      : <div style={{width:32,height:32,borderRadius:6,background:'#FDECEA',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:900,color:'#E63329',fontSize:13}}>{brand.name[0]}</div>
                    }
                    <strong>{brand.name}</strong>
                  </div>
                </div>
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

function DashboardPage({ products, brands, categories, auth }) {
  const navigate = useNavigate();
  const totalValue = products.reduce((sum, p) => sum + Number(p.price || 0), 0);

  const stats = [
    { label: 'Jami mahsulotlar', value: products.length, icon: '📦', to: '/dashboard/products', color: '#FDECEA', tc: '#E63329' },
    { label: 'Kategoriyalar', value: categories.length, icon: '🏷️', to: '/dashboard/categories', color: '#EBF2FF', tc: '#2563EB' },
    { label: 'Brendlar', value: brands.length, icon: '⭐', to: '/dashboard/brands', color: '#DCFCE7', tc: '#16A34A' },
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

"""

new_content = content[:start] + new_code + content[end:]

# 2. Routes ga yangi yo'llar qo'shish
old_dashboard_route = """        <Route path="/dashboard" element={
          auth.role === 'admin'
            ? <DashboardPage products={products} brands={brands} categories={categories} onAddProduct={handleAddProduct} onDeleteProduct={handleDeleteProduct} auth={auth} />
            : <Navigate to="/login" replace />
        } />"""

new_dashboard_route = """        <Route path="/dashboard" element={
          auth.role === 'admin'
            ? <DashboardPage products={products} brands={brands} categories={categories} auth={auth} />
            : <Navigate to="/login" replace />
        } />
        <Route path="/dashboard/products" element={
          auth.role === 'admin'
            ? <AdminProductsPage products={products} brands={brands} categories={categories} onAddProduct={handleAddProduct} onDeleteProduct={handleDeleteProduct} auth={auth} />
            : <Navigate to="/login" replace />
        } />
        <Route path="/dashboard/categories" element={
          auth.role === 'admin'
            ? <AdminCategoriesPage categories={categories} auth={auth} />
            : <Navigate to="/login" replace />
        } />
        <Route path="/dashboard/brands" element={
          auth.role === 'admin'
            ? <AdminBrandsPage brands={brands} auth={auth} />
            : <Navigate to="/login" replace />
        } />"""

new_content = new_content.replace(old_dashboard_route, new_dashboard_route)

# 3. isDashboard ni /dashboard ile boshlanadigan barchaga qo'llash
old_is = "  const isDashboard = location.pathname === '/dashboard';"
new_is = "  const isDashboard = location.pathname.startsWith('/dashboard');"
new_content = new_content.replace(old_is, new_is)

with open(file, 'w', encoding='utf-8') as f:
    f.write(new_content)

c2 = open(file, encoding='utf-8').read()
sys.stdout.write(
    'AdminSidebar:' + str(c2.count('function AdminSidebar')) +
    ' AdminProductsPage:' + str(c2.count('function AdminProductsPage')) +
    ' AdminCategoriesPage:' + str(c2.count('function AdminCategoriesPage')) +
    ' AdminBrandsPage:' + str(c2.count('function AdminBrandsPage')) +
    ' DashboardPage:' + str(c2.count('function DashboardPage')) +
    ' routes:' + str(c2.count('/dashboard/products')) +
    ' startsWith:' + str(c2.count("startsWith('/dashboard')"))
)
