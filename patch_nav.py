file = r'c:\Users\user\Desktop\Oppen shop 2\src\App.jsx'
with open(file, 'r', encoding='utf-8') as f:
    content = f.read()

# useLocation import qo'shish
old_import = "import { Link, Navigate, Route, Routes, useNavigate, useParams } from 'react-router-dom';"
new_import = "import { Link, Navigate, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom';"
content = content.replace(old_import, new_import)

# App return qismini o'zgartirish
old_return = """  return (
    <div className="app">
      <Topbar />
      <Header
        cartCount={cartCount}
        wishCount={wish.size}
        searchTerm={searchTerm}
        onSearch={setSearchTerm}
        onFavorites={() => navigate('/favorites')}
        onCart={() => navigate('/cart')}
        onLogin={() => navigate('/login')}
        onCatalog={handleOpenCatalog}
      />
      <CatalogDialog
        open={catalogOpen}
        categories={categories}
        selectedCategory={selectedCategory}
        onClose={() => setCatalogOpen(false)}
        onSelectCategory={handleSelectCategory}
        onSearch={setSearchTerm}
      />
      <MobileNav active={mobileActive} onNavigate={handleMobileNavigate} />"""

new_return = """  const location = useLocation();
  const isDashboard = location.pathname === '/dashboard';

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
          onCatalog={handleOpenCatalog}
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
      {!isDashboard && <MobileNav active={mobileActive} onNavigate={handleMobileNavigate} />}"""

content = content.replace(old_return, new_return)

# Footer va Toast ni ham yashirish
old_footer = "      <Footer />\n      <Toast message={toastMessage} />"
new_footer = "      {!isDashboard && <Footer />}\n      <Toast message={toastMessage} />"
content = content.replace(old_footer, new_footer)

with open(file, 'w', encoding='utf-8') as f:
    f.write(content)

import sys
c2 = open(file, encoding='utf-8').read()
sys.stdout.write('isDashboard:' + str(c2.count('isDashboard')) + ' useLocation:' + str(c2.count('useLocation')))
