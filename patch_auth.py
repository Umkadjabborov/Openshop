file = r'c:\Users\user\Desktop\Oppen shop 2\src\App.jsx'
with open(file, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. RegisterPage ni almashtirish
old_register = """function RegisterPage({ onRegister }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  function handleSubmit(event) {
    event.preventDefault();
    if (!name || !email || !password) {
      setMessage("Iltimos barcha maydonlarni to'ldiring.");
      return;
    }
    onRegister({ name, email });
    navigate('/');
  }

  return (
    <main className="wrap auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Ro'yxatdan o'tish</h1>
          <p>Yangi user sifatida mahsulotlarni ko'rish va savatga qo'shish uchun ro'yxatdan o'ting.</p>
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
          <button type="submit" className="auth-submit">Ro'yxatdan o'tish</button>
        </form>
      </div>
    </main>
  );
}"""

new_register = """function RegisterPage({ onRegister }) {
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
}"""

content = content.replace(old_register, new_register)

# 2. LoginPage ni almashtirish - faqat email/password qoldiramiz, DB login
old_login = """function LoginPage({ onLogin }) {
  const [method, setMethod] = useState('admin');
  const presets = {
    admin: { label: 'Admin', email: 'admin@example.com', password: 'Admin123' },
    user: { label: 'User', email: 'user@example.com', password: 'User123' },
    guest: { label: 'Visitor', email: 'guest@example.com', password: 'Guest123' },
  };
  const initial = presets[method];
  const [email, setEmail] = useState(initial.email);
  const [password, setPassword] = useState(initial.password);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  function selectMethod(key) {
    setMethod(key);
    setEmail(presets[key].email);
    setPassword(presets[key].password);
    setError('');
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const success = await onLogin(email.trim(), password.trim(), method);
    if (success) {
      navigate(method === 'admin' ? '/dashboard' : '/');
    } else {
      setError('Login yoki parol noto\u2019g\u2019ri. Iltimos qayta urinib ko\u2019ring.');
    }
  }

  return (
    <main className="wrap auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Kirish</h1>
          <p>Admin, User yoki Visitor sifatida tizimga kiring.</p>
        </div>
        <div className="auth-methods">
          {Object.entries(presets).map(([key, preset]) => (
            <button key={key} type="button" className={`auth-method${method === key ? ' active' : ''}`} onClick={() => selectMethod(key)}>{preset.label}</button>
          ))}
        </div>
        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            Email
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </label>
          <label>
            Parol
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </label>
          {error ? <div className="auth-error">{error}</div> : null}
          <button type="submit" className="auth-submit">Tizimga kirish</button>
        </form>
        <div className="auth-note">
          <p><strong>Test login:</strong></p>
          <p>Admin: admin@example.com / Admin123</p>
          <p>User: user@example.com / User123</p>
          <p>Visitor: guest@example.com / Guest123</p>
        </div>
        <button type="button" className="auth-link" onClick={() => navigate('/register')}>Ro'yxatdan o'tish</button>
      </div>
    </main>
  );
}"""

new_login = """function LoginPage({ onLogin }) {
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
}"""

content = content.replace(old_login, new_login)

# 3. App() dagi handleLogin ni DB ga so'rov yuboruvchi qilish
old_handle_login = """  function handleLogin(email, password, method) {
    const account = accounts[method];
    if (!account) return Promise.resolve(false);
    if (account.email === email && account.password === password) {
      setAuth({ role: account.role, user: account.user });
      return Promise.resolve(true);
    }
    return Promise.resolve(false);
  }"""

new_handle_login = """  async function handleLogin(email, password) {
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
  }"""

content = content.replace(old_handle_login, new_handle_login)

# 4. handleRegister ni yangilash
old_handle_register = """  function handleRegister(user) {
    setAuth({ role: 'user', user });
    showToast(`Xush kelibsiz, ${user.name}!`);
  }"""

new_handle_register = """  function handleRegister(user) {
    const authData = { role: 'user', user: { id: user.id, name: user.name, email: user.email } };
    setAuth(authData);
    localStorage.setItem('auth', JSON.stringify(authData));
    showToast(`Xush kelibsiz, ${user.name}!`);
  }"""

content = content.replace(old_handle_register, new_handle_register)

# 5. Auth initial state ni localStorage dan olish
old_auth_state = "  const [auth, setAuth] = useState({ role: null, user: null });"
new_auth_state = """  const [auth, setAuth] = useState(() => {
    try {
      const saved = localStorage.getItem('auth');
      return saved ? JSON.parse(saved) : { role: null, user: null };
    } catch { return { role: null, user: null }; }
  });"""

content = content.replace(old_auth_state, new_auth_state)

# 6. accounts ni olib tashlash (endi kerak emas)
old_accounts = """  const accounts = {
    admin: { role: 'admin', user: { name: 'Administrator', email: 'admin@example.com' }, email: 'admin@example.com', password: 'Admin123' },
    user: { role: 'user', user: { name: 'Sotuvchi', email: 'user@example.com' }, email: 'user@example.com', password: 'User123' },
    guest: { role: 'guest', user: { name: 'Visitor', email: 'guest@example.com' }, email: 'guest@example.com', password: 'Guest123' },
  };

"""
content = content.replace(old_accounts, '\n')

# 7. Header da logout uchun kirish tugmasini yangilash - onLogin -> auth aware
# handleMobileNavigate da Kabinet -> logout yoki login
old_mobile_nav = "    if (tab === 'Kabinet') navigate(auth.role === 'admin' ? '/dashboard' : '/login');"
new_mobile_nav = """    if (tab === 'Kabinet') {
      if (auth.role) {
        localStorage.removeItem('auth');
        setAuth({ role: null, user: null });
        navigate('/');
      } else {
        navigate('/login');
      }
    }"""
content = content.replace(old_mobile_nav, new_mobile_nav)

with open(file, 'w', encoding='utf-8') as f:
    f.write(content)

import sys
c2 = open(file, encoding='utf-8').read()
sys.stdout.write(
    'handleLogin:' + str(c2.count('async function handleLogin')) +
    ' handleRegister:' + str(c2.count('handleRegister')) +
    ' localStorage:' + str(c2.count('localStorage')) +
    ' api/auth:' + str(c2.count('/api/auth'))
)
