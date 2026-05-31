import { useState } from 'react';
import { api } from '../api';

export default function AdminAddProduct() {
  const [form, setForm] = useState({
    name_uz: '',
    slug: '',
    price: '',
    old_price: '',
    category_id: '',
    brand_id: '',
    description_uz: '',
    stock_qty: 0,
    product_images: [],
  });
  const [message, setMessage] = useState('');

  const change = (k, v) => setForm((s) => ({ ...s, [k]: v }));

  const addImage = () => {
    setForm((s) => ({ ...s, product_images: [...s.product_images, { image_url: '' }] }));
  };

  const setImageUrl = (idx, url) => {
    setForm((s) => {
      const imgs = [...s.product_images];
      imgs[idx] = { ...imgs[idx], image_url: url };
      return { ...s, product_images: imgs };
    });
  };

  const submit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        price: Number(form.price || 0),
        old_price: form.old_price ? Number(form.old_price) : null,
        category_id: form.category_id ? Number(form.category_id) : null,
        brand_id: form.brand_id ? Number(form.brand_id) : null,
      };
      await api.createProduct(payload);
      setMessage('Mahsulot qo\'shildi');
      setForm({ name_uz: '', slug: '', price: '', old_price: '', category_id: '', brand_id: '', description_uz: '', stock_qty: 0, product_images: [] });
    } catch (err) {
      setMessage(err.message || 'Xato');
    }
  };

  return (
    <div className="wrap" style={{ padding: 24 }}>
      <h2>Yangi mahsulot qo'shish (admin)</h2>
      <form onSubmit={submit} style={{ maxWidth: 800, marginTop: 12 }}>
        <input placeholder="Nomi (uz)" value={form.name_uz} onChange={(e) => change('name_uz', e.target.value)} />
        <input placeholder="Slug" value={form.slug} onChange={(e) => change('slug', e.target.value)} />
        <input placeholder="Narxi" value={form.price} onChange={(e) => change('price', e.target.value)} />
        <input placeholder="Eski narxi" value={form.old_price} onChange={(e) => change('old_price', e.target.value)} />
        <input placeholder="Category id" value={form.category_id} onChange={(e) => change('category_id', e.target.value)} />
        <input placeholder="Brand id" value={form.brand_id} onChange={(e) => change('brand_id', e.target.value)} />
        <textarea placeholder="Tavsif" value={form.description_uz} onChange={(e) => change('description_uz', e.target.value)} />
        <input placeholder="Stock qty" value={form.stock_qty} onChange={(e) => change('stock_qty', e.target.value)} />

        <div style={{ marginTop: 12 }}>
          <button type="button" onClick={addImage} style={{ marginBottom: 8 }} className="pc-cart">Rasm qo'shish</button>
          {form.product_images.map((img, idx) => (
            <div key={idx} style={{ marginBottom: 8 }}>
              <input placeholder="Image URL" value={img.image_url} onChange={(e) => setImageUrl(idx, e.target.value)} />
            </div>
          ))}
        </div>

        <div style={{ marginTop: 12 }}>
          <button className="order-btn" type="submit">Saqlash</button>
        </div>
        {message && <div style={{ marginTop: 12 }}>{message}</div>}
      </form>
    </div>
  );
}
