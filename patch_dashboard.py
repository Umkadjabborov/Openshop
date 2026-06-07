import re

file = r'c:\Users\user\Desktop\Oppen shop 2\src\App.jsx'

with open(file, 'r', encoding='utf-8') as f:
    content = f.read()

start = content.index('function DashboardPage(')
end = content.index('function fmt(')

new_dashboard = '''function AddProductModal({ open, onClose, brands, categories, onAddProduct }) {
  const [form, setForm] = useState({ name: '', description: '', brand_id: '', category_id: '', price: '', old_price: '', stock_qty: 1, image_url: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name || !form.brand_id || !form.category_id || !form.price) {
      setMessage("Iltimos, barcha majburiy maydonlarni to\\'ldiring.");
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
      setMessage("Mahsulot saqlanmadi. Qayta urinib ko\\'ring.");
    }
  }

  if (!open) return null;
  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div className="dialog-card add-product-modal" onClick={(e) => e.stopPropagation()}>
        <div className="dialog-header">
          <h2>Yangi mahsulot qo\'shish</h2>
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
                  {brands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
              </label>
              <label>Kategoriya *
                <select name="category_id" value={form.category_id} onChange={handleChange} required>
                  <option value="">Kategoriya tanlang</option>
                  {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
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
              <button type="submit" className="auth-submit" disabled={loading}>{loading ? 'Saqlanmoqda...' : "Qo\'shish"}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function DashboardPage({ products, brands, categories, onAddProduct, onDeleteProduct, auth }) {
  const [modalOpen, setModalOpen] = useState(false);

  const totalValue = products.reduce((sum, item) => sum + Number(item.price || 0), 0);
  const reportData = [
    { label: 'Oylik savdo', value: `${Math.round(totalValue / 1000000)} mln` },
    { label: 'Yangi mahsulotlar', value: `${products.filter((item) => item.is_new).length}` },
    { label: 'Umumiy mahsulotlar', value: `${products.length}` },
  ];

  return (
    <main className="wrap dashboard-page">
      <AddProductModal open={modalOpen} onClose={() => setModalOpen(false)} brands={brands} categories={categories} onAddProduct={onAddProduct} />
      <section className="section dashboard-top">
        <div className="dashboard-intro">
          <h1>Admin dashboard</h1>
          <p>Salom, {auth?.user?.name || \'Admin\'}. Bu yerda mahsulotlarni boshqarishingiz mumkin.</p>
        </div>
        <div className="report-grid">
          {reportData.map((item) => (
            <div key={item.label} className="report-card">
              <span>{item.label}</span>
              <strong>{item.value}</strong>
            </div>
          ))}
        </div>
      </section>
      <section className="section dashboard-list">
        <div className="sec-head">
          <h2 className="sec-title">Barcha mahsulotlar ({products.length} ta)</h2>
          <button type="button" className="add-product-btn" onClick={() => setModalOpen(true)}>
            + Mahsulot qo\'shish
          </button>
        </div>
        <div className="admin-prod-grid">
          {products.map((product) => (
            <div key={product.id} className="admin-prod-card">
              <div className="admin-prod-img">
                <img src={makeImageUrl(product.image_url)} alt={product.name} onError={(e) => { e.currentTarget.src = PLACEHOLDER; }} />
                {product.discount_pct > 0 && <span className="badge-d">-{product.discount_pct}%</span>}
                {product.is_new && <span className="badge-n">NEW</span>}
              </div>
              <div className="admin-prod-body">
                <div className="admin-prod-brand">{product.brand_name || \'---\'}</div>
                <div className="admin-prod-name">{product.name}</div>
                <div className="admin-prod-cat">{product.category_name || \'---\'}</div>
                <div className="admin-prod-price">
                  {fmt(product.price)}
                  {product.old_price ? <span className="admin-prod-old">{fmt(product.old_price)}</span> : null}
                </div>
                <div className="admin-prod-stock">Ombordan: {product.stock_qty || 0} ta</div>
              </div>
              <button type="button" className="delete-btn" onClick={() => onDeleteProduct(product.id)}>O\'chirish</button>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

'''

new_content = content[:start] + new_dashboard + content[end:]

with open(file, 'w', encoding='utf-8') as f:
    f.write(new_content)

print('Done. Length:', len(new_content))
