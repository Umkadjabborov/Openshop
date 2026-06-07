import sys

file = r'c:\Users\user\Desktop\Oppen shop 2\src\App.jsx'
with open(file, 'r', encoding='utf-8') as f:
    content = f.read()

start = content.index('function AddProductModal(')
end = content.index('function fmt(')

new_code = r'''function DashboardPage({ products, brands, categories, onAddProduct, onDeleteProduct, auth }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedRows, setSelectedRows] = useState(new Set());

  const filtered = products.filter(p =>
    !search || p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.brand_name || '').toLowerCase().includes(search.toLowerCase())
  );

  const totalValue = products.reduce((sum, item) => sum + Number(item.price || 0), 0);

  function toggleRow(id) {
    setSelectedRows(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function toggleAll(e) {
    setSelectedRows(e.target.checked ? new Set(filtered.map(p => p.id)) : new Set());
  }

  return (
    <div className="db-layout">
      {/* SIDEBAR */}
      <aside className="db-sidebar">
        <div className="db-logo">
          <span className="db-logo-text">Open<span className="db-logo-dot">Shop</span></span>
        </div>
        <nav className="db-nav">
          <a className="db-nav-item db-nav-active" href="#">
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>
            Dashboard
          </a>
          <a className="db-nav-item" href="#">
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
            Mahsulotlar
          </a>
          <a className="db-nav-item" href="#">
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
            Kategoriyalar
          </a>
          <a className="db-nav-item" href="#">
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 21h18M3 10h18M3 7l9-4 9 4M4 10v11M20 10v11M8 10v11M16 10v11M12 10v11"/></svg>
            Brendlar
          </a>
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

      {/* MAIN */}
      <main className="db-main">
        {/* TOPBAR */}
        <header className="db-topbar">
          <div className="db-topbar-title">Mahsulotlar boshqaruvi</div>
          <div className="db-topbar-actions">
            <div className="db-stat-chip">
              <span>Jami:</span><strong>{products.length} ta</strong>
            </div>
            <div className="db-stat-chip">
              <span>Qiymat:</span><strong>{Math.round(totalValue / 1000000)} mln</strong>
            </div>
            <div className="db-stat-chip">
              <span>Yangi:</span><strong>{products.filter(p => p.is_new).length} ta</strong>
            </div>
          </div>
        </header>

        {/* CONTENT */}
        <div className="db-content">
          {/* TOOLBAR */}
          <div className="db-toolbar">
            <div className="db-search-box">
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              <input
                type="text"
                placeholder="Mahsulot yoki brend qidirish..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <div className="db-toolbar-right">
              {selectedRows.size > 0 && (
                <span className="db-selected-info">{selectedRows.size} ta tanlandi</span>
              )}
              <button className="db-btn-primary" onClick={() => setModalOpen(true)}>
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>
                Mahsulot qo'shish
              </button>
            </div>
          </div>

          {/* TABLE */}
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
            ) : (
              filtered.map((product, i) => (
                <div
                  key={product.id}
                  className={`db-table-row${selectedRows.has(product.id) ? ' db-row-selected' : ''}`}
                  onClick={() => toggleRow(product.id)}
                >
                  <div className="db-td cb-col" onClick={e => e.stopPropagation()}>
                    <input type="checkbox" checked={selectedRows.has(product.id)} onChange={() => toggleRow(product.id)} />
                  </div>
                  <div className="db-td num-col">{i + 1}</div>
                  <div className="db-td img-col">
                    <div className="db-row-thumb">
                      <img
                        src={makeImageUrl(product.image_url)}
                        alt={product.name}
                        onError={e => { e.currentTarget.src = PLACEHOLDER; }}
                      />
                    </div>
                  </div>
                  <div className="db-td name-col">
                    <div className="db-name-cell">{product.name}</div>
                  </div>
                  <div className="db-td brand-col">{product.brand_name || '—'}</div>
                  <div className="db-td cat-col">{product.category_name || '—'}</div>
                  <div className="db-td price-col">{fmt(product.price)}</div>
                  <div className="db-td old-col">{product.old_price ? fmt(product.old_price) : '—'}</div>
                  <div className="db-td disc-col">
                    {product.discount_pct > 0
                      ? <span className="db-badge db-badge-red">-{product.discount_pct}%</span>
                      : '—'}
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
                      <button
                        className="db-act-icon db-act-danger"
                        title="O'chirish"
                        onClick={() => onDeleteProduct(product.id)}
                      >
                        <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>
                      </button>
                      <button className="db-act-icon" title="Ko'rish">
                        <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}

            {/* PAGINATION */}
            <div className="db-pagination">
              <span className="db-pag-info">Jami {filtered.length} ta mahsulot</span>
              <div className="db-pag-btns">
                <button className="db-page-btn db-page-nav">
                  <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="m15 18-6-6 6-6"/></svg>
                </button>
                <button className="db-page-btn db-page-active">1</button>
                <button className="db-page-btn">2</button>
                <button className="db-page-btn">3</button>
                <button className="db-page-btn db-page-nav">
                  <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="m9 18 6-6-6-6"/></svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ADD PRODUCT MODAL */}
      {modalOpen && (
        <AddProductModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          brands={brands}
          categories={categories}
          onAddProduct={onAddProduct}
        />
      )}
    </div>
  );
}

'''

new_content = content[:start] + new_code + content[end:]
with open(file, 'w', encoding='utf-8') as f:
    f.write(new_content)

c2 = open(file, encoding='utf-8').read()
sys.stdout.write('DashboardPage: ' + str(c2.count('db-layout')) + ' len:' + str(len(c2)))
