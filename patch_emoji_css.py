file = r'c:\Users\user\Desktop\Oppen shop 2\src\App.css'
with open(file, 'r', encoding='utf-8') as f:
    css = f.read()

extra = """
/* ===== EMOJI PICKER ===== */
.emoji-field { position: relative; }

.emoji-trigger {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 14px;
  border: 1.5px solid #E8EAED;
  border-radius: 9px;
  background: #fafafa;
  cursor: pointer;
  font-family: 'Nunito', sans-serif;
  font-size: .88rem;
  font-weight: 600;
  color: #1a1a1a;
  width: 100%;
  transition: border-color .15s;
}
.emoji-trigger:hover { border-color: #E63329; background: #fff; }

.emoji-preview { font-size: 1.4rem; line-height: 1; }
.emoji-trigger-label { flex: 1; text-align: left; color: #6B6860; }

.emoji-picker-wrap {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  z-index: 9999;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(0,0,0,.15);
}
"""

with open(file, 'w', encoding='utf-8') as f:
    f.write(css + extra)

import sys
c2 = open(file, encoding='utf-8').read()
sys.stdout.write('emoji-picker-wrap:' + str(c2.count('emoji-picker-wrap')))
