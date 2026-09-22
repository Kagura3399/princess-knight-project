# My Princess's Knight 
一個**異世界 RPG 風格的雙人待辦 App**，使用者（女方）為男友打造。

- **公主端**（女方用，`dist/princess-app.html`）：女方是公主 Elia，發懸賞任務、審核、給獎勵。是「管理端」，角色/夥伴全解鎖、金幣 2000 方便預覽。
- **騎士端**（男友用，`dist/knight-app.html`）：男友是騎士，接懸賞、完成、賺金幣解鎖角色/夥伴/背景。初始什麼都沒有（金幣 0、只有騎士），強調收集成長感。

兩端透過 Firebase Firestore + 配對碼同步資料。語言：**繁體中文**。

## 視覺風格

- 星空藍紫 + 金，奧義魔法風
- 中文用**系統默認字體**（不要用辰宇落雁體，使用者明確要求過）
- 英文標題用 Cinzel 花體、副標用 Cormorant 斜體
- icon 全部是自製 SVG 中世紀復古線條風（在 `src/_core.js` 的 `ICO` 物件），**不要用 emoji**
- 深色/淺色背景自動切換：淺色背景時卡片維持深色半透明底確保文字可讀（`body.lightbg`）

## 技術架構

- **純前端 HTML**，無建置工具。每個模組是獨立的 .js / .css 檔
- 用 Python 組裝腳本把模組 + base64 素材注入成單一 HTML
- 圖片/字體都 base64 內嵌（單檔可離線、可裝 PWA）
- Firebase 用 CDN 載入（compat 版 9.23.0）

### 組裝方式（重要）

```bash
cd build
python3 assemble.py          # 產生 dist/princess-app.html
python3 assemble_knight.py   # 產生 dist/knight-app.html
```

組裝腳本會讀取 `src/` 的模組 + `assets/_assets.json`（base64 圖）+ `assets/_firebase_config.json`，組成成品。

**注意**：組裝腳本目前寫死讀取路徑是當前目錄的檔名（如 `_core.css`）。在 Claude Code 環境要調整路徑，或把所有檔案放同一層。建議改 assemble.py 的 `open()` 路徑指向 `../src/` 和 `../assets/`。

## 檔案結構

```
src/
  _core.css           共用 CSS：配色變數、淺色模式、基礎樣式
  _core.js            共用 JS：ICO（SVG icon）、SFX（音效）、BGM（背景音樂）、星空、Firebase 同步層
  _data.js            共用資料：11角色（含台詞）、4夥伴、補給、背景、價格、公主讚美句
  _screen.css         公主端畫面 CSS
  _knight_screen.css  騎士端專屬 CSS（角色出場動畫、手札清單等）

  公主端：
  _princess_screens.js  狀態 S、本地儲存、成本函式
  _app.js               主邏輯：boot、配對、同步、HUD、導覽、render
  _views.js             懸賞分頁：日期箭頭、月曆、審核
  _views2.js            張貼懸賞（不閃退）、計劃、夥伴養成
  _views3.js            圖鑑+登場特效、商店+改價、設定、年月選擇器

  騎士端：
  _knight_state.js    狀態 S、版本遷移、匯出/匯入備份碼
  _knight_sync.js     同步層：共享任務 + 個人進度雙雲端
  _knight_app.js      主邏輯：開場→配對→取名→主畫面、角色出場機制
  _knight_views.js    懸賞分頁：接懸賞/回報流程
  _knight_lists.js    手札（自建清單系統）
  _knight_views2.js   計劃、夥伴、兌換、角色詳情
  _knight_views3.js   設定（含備份碼）、年月選擇器、收尾

build/
  assemble.py         組裝公主端
  assemble_knight.py  組裝騎士端

assets/
  _assets.json        所有圖片的 base64（3.7MB）
  _firebase_config.json  Firebase 設定
  images/             去背好的 PNG 原圖
  chenyu-subset.woff  字型（目前不用，保留）

dist/
  princess-app.html   公主端成品
  knight-app.html     騎士端成品
```

## 驗證方式（重要）

開發環境有 **playwright**（無頭 Chromium），可截圖驗證。範例：

```python
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    browser=p.chromium.launch()
    page=browser.new_page(viewport={'width':430,'height':900})
    page.goto('file:///path/to/princess-app.html')
    page.wait_for_timeout(1200)
    # 用 evaluate 直接推進流程，避免時間差
    page.evaluate("enterFromIntro()")
    page.evaluate("document.getElementById('pairInput').value='t1';confirmPair()")
    page.screenshot(path='shot.png')
```

改完一定要重新組裝 + 截圖驗證再交付。每個 .js 改完先 `node --check` 驗證語法。

**注意**：開發環境通常無網路，Firebase 會 init 失敗（正常），不影響本機功能。同步要使用者手機實測。
