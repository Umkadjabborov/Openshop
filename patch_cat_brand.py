file = r'c:\Users\user\Desktop\Oppen shop 2\src\App.jsx'
with open(file, 'r', encoding='utf-8') as f:
    content = f.read()

# ---- AdminCategoriesPage ----
old_cat = content[content.index('function AdminCategoriesPage('):content.index('function AdminBrandsPage(')]

new_cat = r"""function AdminCategoriesPage({ categories, onAddCategory, auth }) {
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ name: '', icon: '' });
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const filtered = categories.filter(c => !search || c.name.toLowerCase().includes(search.toLowerCase()));

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name) { setMsg("Nom majburiy"); return; }
    setLoading(true);
    const res = await fetch('/api/categories', {
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
            <div className="dialog-overlay" onClick={() => setModalOpen(false)}>
              <div className="dialog-card add-product-modal" onClick={e => e.stopPropagation()}>
                <div className="dialog-header">
                  <h2>Yangi kategoriya</h2>
                  <button type="button" className="close-btn" onClick={() => setModalOpen(false)}>\u2715</button>
                </div>
                <div className="dialog-body">
                  <form className="dashboard-form" onSubmit={handleSubmit}>
                    <label>Kategoriya nomi *<input value={form.name} onChange={e => setForm(p => ({...p, name: e.target.value}))} required placeholder="Smartfonlar" /></label>
                    <label>Icon (emoji)<input value={form.icon} onChange={e => setForm(p => ({...p, icon: e.target.value}))} placeholder="\ud83d\udce6" /></label>
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

"""

# ---- AdminBrandsPage ----
old_brand_start = content.index('function AdminBrandsPage(')
old_brand_end = content.index('function DashboardPage(')
old_brand = content[old_brand_start:old_brand_end]

new_brand = r"""function AdminBrandsPage({ brands, onAddBrand, auth }) {
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
    const res = await fetch('/api/brands', {
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
                  <button type="button" className="close-btn" onClick={() => setModalOpen(false)}>\u2715</button>
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

"""

# Replace both
content = content.replace(old_cat, new_cat)
content = content.replace(old_brand, new_brand)

# App.jsx da onAddCategory va onAddBrand handler qo'shish
# handleAddProduct dan keyin qo'shamiz
old_after = "  async function handleDeleteProduct(productId) {"
new_handlers = """  function handleAddCategory(cat) {
    setCategories(prev => [...prev, cat]);
  }

  function handleAddBrand(brand) {
    setBrands(prev => [...prev, brand]);
  }

  async function handleDeleteProduct(productId) {"""
content = content.replace(old_after, new_handlers)

# Routes da onAddCategory va onAddBrand proplarini uzatish
content = content.replace(
    "? <AdminCategoriesPage categories={categories} auth={auth} />",
    "? <AdminCategoriesPage categories={categories} onAddCategory={handleAddCategory} auth={auth} />"
)
content = content.replace(
    "? <AdminBrandsPage brands={brands} auth={auth} />",
    "? <AdminBrandsPage brands={brands} onAddBrand={handleAddBrand} auth={auth} />"
)

with open(file, 'w', encoding='utf-8') as f:
    f.write(content)

import sys
c2 = open(file, encoding='utf-8').read()
sys.stdout.write(
    'onAddCategory:' + str(c2.count('onAddCategory')) +
    ' onAddBrand:' + str(c2.count('onAddBrand')) +
    ' handleAddCategory:' + str(c2.count('handleAddCategory')) +
    ' handleAddBrand:' + str(c2.count('handleAddBrand'))
)
