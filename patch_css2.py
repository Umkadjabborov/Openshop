file = r'c:\Users\user\Desktop\Oppen shop 2\src\App.css'
with open(file, 'r', encoding='utf-8') as f:
    css = f.read()

extra = """

/* ============================================
   ADMIN DASHBOARD PANEL
   ============================================ */
.db-layout {
  display: flex;
  min-height: 100vh;
  background: #F4F3F0;
  font-family: 'Nunito', sans-serif;
  margin: -12px;
}

/* SIDEBAR */
.db-sidebar {
  width: 220px;
  background: #fff;
  border-right: 1px solid #E5E3DD;
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0; left: 0; bottom: 0;
  z-index: 100;
}
.db-logo {
  padding: 20px 20px 16px;
  border-bottom: 1px solid #E5E3DD;
}
.db-logo-text {
  font-size: 20px;
  font-weight: 900;
  letter-spacing: -0.5px;
  color: #1A1916;
}
.db-logo-dot { color: #E63329; }
.db-nav { padding: 12px 10px; flex: 1; }
.db-nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 12px;
  border-radius: 8px;
  cursor: pointer;
  color: #6B6860;
  font-size: 13.5px;
  font-weight: 600;
  transition: all .15s;
  text-decoration: none;
  margin-bottom: 2px;
}
.db-nav-item:hover { background: #F4F3F0; color: #1A1916; }
.db-nav-active { background: #FDECEA; color: #E63329; }
.db-sidebar-footer {
  padding: 14px;
  border-top: 1px solid #E5E3DD;
}
.db-user-card {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  border-radius: 8px;
  background: #F4F3F0;
}
.db-avatar {
  width: 32px; height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #E63329 0%, #ff6b6b 100%);
  display: flex; align-items: center; justify-content: center;
  color: #fff;
  font-size: 13px;
  font-weight: 700;
  flex-shrink: 0;
}
.db-user-name { font-size: 13px; font-weight: 700; color: #1A1916; }
.db-user-role { font-size: 11px; color: #9C9A94; }

/* MAIN */
.db-main {
  margin-left: 220px;
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* TOPBAR */
.db-topbar {
  background: #fff;
  border-bottom: 1px solid #E5E3DD;
  padding: 0 24px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 50;
  gap: 16px;
}
.db-topbar-title {
  font-size: 17px;
  font-weight: 900;
  letter-spacing: -0.3px;
  color: #1A1916;
  white-space: nowrap;
}
.db-topbar-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}
.db-stat-chip {
  display: flex;
  align-items: center;
  gap: 5px;
  background: #F4F3F0;
  border: 1px solid #E5E3DD;
  border-radius: 20px;
  padding: 4px 12px;
  font-size: 12.5px;
  color: #6B6860;
}
.db-stat-chip strong { color: #1A1916; font-weight: 800; }

/* CONTENT */
.db-content { padding: 20px 24px; flex: 1; }

/* TOOLBAR */
.db-toolbar {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 14px;
  flex-wrap: wrap;
}
.db-search-box {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #fff;
  border: 1px solid #E5E3DD;
  border-radius: 8px;
  padding: 0 12px;
  height: 36px;
  min-width: 260px;
  transition: border-color .15s;
}
.db-search-box:focus-within { border-color: #E63329; }
.db-search-box input {
  border: none; outline: none;
  font-family: 'Nunito', sans-serif;
  font-size: 13.5px;
  color: #1A1916;
  background: transparent;
  width: 100%;
}
.db-search-box input::placeholder { color: #9C9A94; }
.db-toolbar-right {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 8px;
}
.db-selected-info {
  font-size: 13px;
  font-weight: 700;
  color: #E63329;
  background: #FDECEA;
  padding: 4px 12px;
  border-radius: 20px;
}
.db-btn-primary {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #E63329;
  border: none;
  border-radius: 8px;
  padding: 0 16px;
  height: 36px;
  font-size: 13px;
  font-weight: 800;
  color: #fff;
  cursor: pointer;
  transition: background .15s;
  font-family: 'Nunito', sans-serif;
  white-space: nowrap;
}
.db-btn-primary:hover { background: #C4271F; }

/* TABLE */
.db-table-wrap {
  background: #fff;
  border: 1px solid #E5E3DD;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 4px rgba(0,0,0,.06);
}

/* Column widths */
.cb-col   { width: 36px;  flex-shrink: 0; }
.num-col  { width: 40px;  flex-shrink: 0; }
.img-col  { width: 52px;  flex-shrink: 0; }
.name-col { flex: 2;      min-width: 0; }
.brand-col{ flex: 1;      min-width: 80px; }
.cat-col  { flex: 1;      min-width: 80px; }
.price-col{ width: 110px; flex-shrink: 0; }
.old-col  { width: 110px; flex-shrink: 0; }
.disc-col { width: 80px;  flex-shrink: 0; }
.stock-col{ width: 70px;  flex-shrink: 0; }
.status-col{ width: 90px; flex-shrink: 0; }
.act-col  { width: 80px;  flex-shrink: 0; }

.db-table-head {
  display: flex;
  align-items: center;
  padding: 0 14px;
  height: 40px;
  border-bottom: 1px solid #E5E3DD;
  background: #F9F8F6;
  gap: 8px;
}
.db-th {
  font-size: 11.5px;
  font-weight: 700;
  color: #9C9A94;
  text-transform: uppercase;
  letter-spacing: .04em;
  white-space: nowrap;
  overflow: hidden;
}

.db-table-row {
  display: flex;
  align-items: center;
  padding: 0 14px;
  min-height: 54px;
  border-bottom: 1px solid #E5E3DD;
  gap: 8px;
  transition: background .1s;
  cursor: pointer;
}
.db-table-row:last-child { border-bottom: none; }
.db-table-row:hover { background: #F9F8F6; }
.db-row-selected { background: #FFF5F5 !important; }

.db-td {
  font-size: 13px;
  color: #1A1916;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.db-row-thumb {
  width: 38px; height: 38px;
  border-radius: 8px;
  background: #F4F3F0;
  border: 1px solid #E5E3DD;
  overflow: hidden;
  flex-shrink: 0;
}
.db-row-thumb img { width: 100%; height: 100%; object-fit: contain; padding: 3px; }

.db-name-cell {
  font-size: 13px;
  font-weight: 700;
  color: #1A1916;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.db-badge {
  display: inline-flex;
  align-items: center;
  font-size: 11.5px;
  font-weight: 800;
  padding: 3px 8px;
  border-radius: 6px;
  white-space: nowrap;
}
.db-badge-red { background: #FEE2E2; color: #DC2626; }
.db-badge-green { background: #DCFCE7; color: #16A34A; }

.db-status {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  font-weight: 700;
  white-space: nowrap;
}
.db-status-dot {
  width: 7px; height: 7px;
  border-radius: 50%;
  flex-shrink: 0;
}
.db-status-active .db-status-dot { background: #16A34A; }
.db-status-active { color: #16A34A; }
.db-status-out .db-status-dot { background: #DC2626; }
.db-status-out { color: #DC2626; }

.db-actions { display: flex; align-items: center; gap: 4px; }
.db-act-icon {
  width: 28px; height: 28px;
  border-radius: 6px;
  border: 1px solid #E5E3DD;
  background: transparent;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
  color: #9C9A94;
  transition: all .15s;
}
.db-act-icon:hover { background: #F4F3F0; color: #6B6860; border-color: #D0CEC7; }
.db-act-danger:hover { background: #FEE2E2 !important; color: #DC2626 !important; border-color: #FECACA !important; }

/* PAGINATION */
.db-pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-top: 1px solid #E5E3DD;
  background: #F9F8F6;
  flex-wrap: wrap;
  gap: 8px;
}
.db-pag-info { font-size: 13px; color: #6B6860; }
.db-pag-btns { display: flex; align-items: center; gap: 4px; }
.db-page-btn {
  width: 30px; height: 30px;
  border-radius: 7px;
  border: 1px solid #E5E3DD;
  background: #fff;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  color: #6B6860;
  transition: all .15s;
  font-family: 'Nunito', sans-serif;
}
.db-page-btn:hover { border-color: #D0CEC7; color: #1A1916; }
.db-page-active { background: #E63329 !important; border-color: #E63329 !important; color: #fff !important; }
.db-page-nav { color: #9C9A94; }

.db-empty {
  padding: 40px;
  text-align: center;
  color: #9C9A94;
  font-weight: 700;
  font-size: 14px;
}

/* Add product modal adjustments */
.add-product-modal {
  max-width: 580px;
  max-height: 92vh;
  overflow-y: auto;
}
.add-product-modal .dashboard-form { gap: 11px; }
.add-product-modal .dashboard-form label {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: .85rem;
  font-weight: 700;
  color: #1a1a1a;
}
.add-product-modal .dashboard-form input,
.add-product-modal .dashboard-form textarea,
.add-product-modal .dashboard-form select {
  padding: 9px 12px;
  border: 1.5px solid #E8EAED;
  border-radius: 9px;
  background: #fafafa;
  font-family: Nunito, sans-serif;
  font-size: .85rem;
  outline: none;
  transition: border-color .15s;
  width: 100%;
}
.add-product-modal .dashboard-form input:focus,
.add-product-modal .dashboard-form select:focus,
.add-product-modal .dashboard-form textarea:focus {
  border-color: #E63329;
  background: #fff;
}
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.modal-actions { display: flex; gap: 10px; justify-content: flex-end; margin-top: 6px; }
.cancel-btn {
  padding: 10px 20px;
  border: 1.5px solid #E8EAED;
  border-radius: 10px;
  background: #fff;
  color: #9AA0A6;
  font-weight: 700;
  font-size: .85rem;
  cursor: pointer;
  transition: border-color .15s, color .15s;
}
.cancel-btn:hover { border-color: #E63329; color: #E63329; }
"""

with open(file, 'w', encoding='utf-8') as f:
    f.write(css + extra)

c2 = open(file, encoding='utf-8').read()
import sys
sys.stdout.write('db-layout:' + str(c2.count('db-layout')) + ' len:' + str(len(c2)))
