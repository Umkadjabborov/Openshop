import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import CartPage from './pages/CartPage';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminAddProduct from './pages/AdminAddProduct';
import './index.css';

function App() {
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [user, setUser] = useState(null);
  const [toast, setToast] = useState('');

  // Load cart and wishlist from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedCart) setCart(JSON.parse(savedCart));
    if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
    // load current user if token exists
    const tok = localStorage.getItem('token');
    if (tok) {
      import('./api').then(({ api }) => api.getMe().then(res => setUser(res.user)).catch(() => {}));
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Save wishlist to localStorage
  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === product.id);
      if (existing) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
    showToast('Savatga qo\'shildi! ✓');
  };

  const handleLogin = (userObj, t) => {
    setUser(userObj);
    localStorage.setItem('token', t);
  };

  const handleLogout = () => {
    setUser(null);
    setToken('');
    localStorage.removeItem('token');
  };

  const updateCart = (productId, quantity) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
    showToast('Savattan olib tashlandi');
  };

  const toggleWishlist = (productId) => {
    setWishlist((prevWishlist) =>
      prevWishlist.includes(productId)
        ? prevWishlist.filter((id) => id !== productId)
        : [...prevWishlist, productId]
    );
  };

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(''), 2000);
  };

  return (
    <Router>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header cartCount={cart.length} user={user} onLogout={handleLogout} />
        <main style={{ flex: 1 }}>
          <Routes>
            <Route
              path="/"
              element={
                <Home
                  onAddToCart={addToCart}
                  onWishlist={toggleWishlist}
                  wishlist={wishlist}
                  toast={toast}
                  showToast={showToast}
                />
              }
            />
            <Route
              path="/product/:id"
              element={
                <ProductDetail
                  onAddToCart={addToCart}
                  onWishlist={toggleWishlist}
                  wishlist={wishlist}
                  toast={toast}
                />
              }
            />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/register" element={<Register onLogin={handleLogin} />} />
            <Route path="/admin/add" element={<AdminAddProduct />} />
            <Route
              path="/cart"
              element={
                <CartPage
                  cart={cart}
                  onUpdateCart={updateCart}
                  onRemoveFromCart={removeFromCart}
                />
              }
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
