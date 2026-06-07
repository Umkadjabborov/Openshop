file = r'c:\Users\user\Desktop\Oppen shop 2\src\App.css'
with open(file, 'r', encoding='utf-8') as f:
    css = f.read()

extra = """
/* ===== DASHBOARD STATS + OVERVIEW ===== */
.db-stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
  margin-bottom: 24px;
}
@media(min-width: 640px) { .db-stats-grid { grid-template-columns: repeat(4, 1fr); } }

.db-stat-card {
  background: var(--sc, #FDECEA);
  border-radius: 14px;
  padding: 20px 18px;
  cursor: pointer;
  transition: transform .18s, box-shadow .18s;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.db-stat-card:hover { transform: translateY(-3px); box-shadow: 0 8px 20px rgba(0,0,0,.1); }
.db-stat-icon { font-size: 1.6rem; line-height: 1; }
.db-stat-value { font-size: 1.8rem; font-weight: 900; color: var(--tc, #E63329); letter-spacing: -.03em; }
.db-stat-label { font-size: .78rem; font-weight: 700; color: #6B6860; }

.db-dash-section { margin-top: 4px; }
.db-dash-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}
.db-dash-title { font-size: 1rem; font-weight: 900; color: #1A1916; }

.db-nav-divider {
  height: 1px;
  background: #E5E3DD;
  margin: 8px 4px;
}
"""

with open(file, 'w', encoding='utf-8') as f:
    f.write(css + extra)

import sys
c2 = open(file, encoding='utf-8').read()
sys.stdout.write('db-stats-grid:' + str(c2.count('db-stats-grid')) + ' len:' + str(len(c2)))
