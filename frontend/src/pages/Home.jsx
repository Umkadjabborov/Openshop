import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../api';
import Banner from '../components/Banner';
import ProductGrid from '../components/ProductGrid';
import Toast from '../components/Toast';

// categories will be loaded from API

export default function Home({ onAddToCart, onWishlist, wishlist, toast, showToast }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchParams] = useSearchParams();
  const search = searchParams.get('search') || '';

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await api.getProducts();
        let filtered = data;

        if (selectedCategory) {
          filtered = filtered.filter((p) => Number(p.category_id) === Number(selectedCategory));
        }

        if (search) {
          filtered = data.filter((p) =>
            p.name_uz.toLowerCase().includes(search.toLowerCase()) ||
            p.name_ru?.toLowerCase().includes(search.toLowerCase())
          );
        }

        setProducts(filtered);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [search, selectedCategory]);

  // load categories
  useEffect(() => {
    api.getCategories().then((cats) => setCategories(cats)).catch(() => {});
  }, []);

  return (
    <div>
      <Banner />

      <div className="wrap section">
        <div className="sec-head">
          <h2 className="sec-title">
            {search ? `Qidirish: "${search}"` : 'Kategoriyalar'}
          </h2>
        </div>
        {!search && (
          <div className="cat-grid">
            <div className="cat-card" onClick={() => setSelectedCategory(null)}>
              <div className="cat-icon">🔎</div>
              <div className="cat-name">Barchasi</div>
            </div>
            {categories.map((cat) => (
              <div key={cat.id} className="cat-card" onClick={() => setSelectedCategory(cat.id)}>
                <div className="cat-icon">📁</div>
                <div className="cat-name">{cat.name_uz || cat.name_ru || cat.slug}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="wrap section">
        <div className="sec-head">
          <h2 className="sec-title">
            Eng yangi <b>Mahsulotlar</b>
          </h2>
        </div>
        <ProductGrid
          products={products}
          loading={loading}
          onAddToCart={onAddToCart}
          onWishlist={onWishlist}
          wishlist={wishlist}
        />
      </div>

      {toast && <Toast message={toast} />}
    </div>
  );
}
