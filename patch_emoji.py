file = r'c:\Users\user\Desktop\Oppen shop 2\src\App.jsx'
with open(file, 'r', encoding='utf-8') as f:
    content = f.read()

old_cat = content[content.index('function AdminCategoriesPage('):content.index('function AdminBrandsPage(')]

new_cat = r"""function AdminCategoriesPage({ categories, onAddCategory, auth }) {
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
                  <button type="button" className="close-btn" onClick={handleClose}>\u2715</button>
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

"""

content = content.replace(old_cat, new_cat)

with open(file, 'w', encoding='utf-8') as f:
    f.write(content)

import sys
c2 = open(file, encoding='utf-8').read()
sys.stdout.write('EmojiPicker:' + str(c2.count('EmojiPicker')) + ' showPicker:' + str(c2.count('showPicker')))
