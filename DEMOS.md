# Interactive figure demos — SOP

Case study 頁的「圖」不用截圖,用程式碼 1:1 重建成可互動的展示。
每張圖都套同一個模板:**粉彩糖果漸層舞台 + 灰色細外框 + hover 放大 5% + 跟著滑鼠的彩色外框線**。

## 共用層自動提供(demos.css + fig-hover.js,不用每張圖重寫)

- **舞台背景**:顏色聚在下方、往上漸白,色層以 26s 極慢左右漂移(subtle wave)。預設是糖果粉彩;另有三個預設可以每張圖指定 — 方案 1 `--fig-pastel-sunset`(霓虹日落:桃紅→蜜橘→金黃→紫)、方案 2 `--fig-pastel-aurora`(極光:電綠→青→紫→洋紅光緣)、方案 3 `--fig-pastel-luminous`(亮彩 high-key:奶油黃→天空青→湖水綠→薄荷,尚未指定給任何 case),使用時搭配加高白色 `--fig-fade: var(--fig-fade-tall)`(色彩只留下方 1/3)。舞台以 case 為單位指定:case 頁的 `<body>` 掛 `case-tablet` / `case-mpos` 這類 class,demos.css 用 `.case-xxx .fig-demo { --fig-pastel: …; --fig-fade: … }` 統一套用。**已定案:Ordering Tablet 全部日落、Mobile POS 全部極光**,其他 case 之後再定(單張要例外時用 `#demo-xxx` 覆寫)
- **外框**:1px 不透明淺灰 `#e4e4e1`(不透明才不會被底下的粉彩染色)、圓角 16px
- **Hover**:整張圖放大 5%(`scale(1.05)`,柔緩動 0.5s);同時彩色外框線段亮起,**跟著滑鼠沿邊框移動**(conic 彩虹環 + 以游標為中心的 radial 遮罩,離開後淡出恢復灰框)
- **舞台寬度**:裝置容器 `.demo-stage` 佔舞台 80% 寬、置中
- **角落提示樣式**:`.demo-hint` mono 小字,位於圖右上角外側(文字內容由各 demo 提供)
- **重播按鈕樣式**:`.demo-replay` 黑色小藥丸(右下角),給「播一次型」demo 用;循環型不需要
- **reduced-motion(僅共用部分)**:自動停用背景漂移與 hover 縮放 — **demo 內部的動畫要自己停,見下方「每張圖自己負責」**

## 每張圖自己負責

- **裝置外殼**:白色背景、圓角、陰影都是 per-demo CSS,不是自動的。裝置類別(換成自己的前綴)的完整契約:
  ```css
  .xxx {
    position: absolute;      /* 原生寬才不會撐開頁面 */
    top: 0;
    left: 0;
    width: {W}px;            /* Figma 原生尺寸 */
    height: {H}px;
    transform-origin: top left;  /* 少了這個,縮放會偏位 */
    background: #fff;        /* 裝置一律白底 */
    border-radius: 18px;
    overflow: hidden;
    box-shadow: 0 30px 70px rgba(18,18,18,0.22), 0 6px 18px rgba(18,18,18,0.1);
  }
  ```
- **所有 demo 的 CSS 都寫進 `demos/demos.css`**(用自己的短前綴分段,如 tablet 用 `tdv-`)。不開 per-demo 的 css 檔、不inline 在 JS 裡。
- **reduced-motion**:在 demos.css 的 `@media (prefers-reduced-motion: reduce)` 區塊補上自己前綴的規則(transition: none、scroll-behavior: auto、animation: none),JS 端 `if (!reduced)` 才啟動自動循環。
- **角落提示文字要對應實際模式**:自動播放版寫「自動播放 — …」,reduced-motion 的靜態手動版要換成「可互動 — …」(見 _template.js 的 T.hint 分支)。

## 命名規則

`{case}-{nn}-{slug}`,nn = 該頁第 nn 個圖位。例:`tablet-05-tier-unlock`。
HTML 錨點 `#demo-{id}` · 檔案 `demos/{id}.js` · CSS 寫進 `demos/demos.css`。

## 新圖流程

1. **取規格**:用 Figma MCP 的 `get_design_context` 拿該 frame 的精確 token(尺寸、色碼、字級)+ `get_screenshot` 對照。記下**原生 px 尺寸**(如 1194×834)——頁面上 fig-ph 的 `--ar` 只是版位比例,**不等於原生尺寸**。frame node-id 記進下方清單。
2. **掛載點**:找到要替換的 `fig-ph`,**整個 div 刪掉**(含 inline `--ar/--ph` 與 `<span>` 標籤),原地放 `<div class="fig-demo" id="demo-{id}"></div>`。外層的 `<figure class="reveal">` 與 `<figcaption>` 保留;**`reveal` class 不要搬到 `.fig-demo` 上**(reveal 的 transform/transition 會跟 hover 放大打架)。確認 `<head>` 有 demos.css(en 頁 `demos/demos.css`,zh 頁 `../demos/demos.css`)。需要新字體(如 Roboto)時,**append 到既有的 Google Fonts css2 URL**(`&family=…`),不要開第二個 `<link>`。
3. **JS**:複製 `demos/_template.js` 為 `demos/{id}.js`。核心手法:**照原生尺寸 1:1 建構,再 `transform: scale()` 縮進舞台**,stage 高度由 JS 的 fit() 設定。
4. **雙語範圍**:只有訪客看的 `.demo-hint` 走 `zh` 旗標雙語;**模擬裝置內的 UI 文字(菜名、按鈕、訊息)一律英文**,zh 頁也不翻——展示的是產品原貌。
5. **Script 位置與順序**(兩頁都要,放在 `</body>` 前、`script.js` 之後;fig-hover 一定最後,因為 demo 會重寫容器 innerHTML):
   ```html
   <!-- {page}.html -->
   <script src="demos/{id}.js" defer></script>
   <script src="demos/fig-hover.js" defer></script>

   <!-- zh/{page}.html:路徑要加 ../ -->
   <script src="../demos/{id}.js" defer></script>
   <script src="../demos/fig-hover.js" defer></script>
   ```
6. **圖片規則**:菜品/內容照片一律灰色漸層佔位(`linear-gradient(160deg,#ececee,#f6f6f7)`),真圖等另外批准後才上線。
7. **驗證**(改完必做):`node --check demos/{id}.js` → 確認伺服器活著(`python3 -m http.server 4174 -d /Users/Mina/FramerAgent/luminhuei-portfolio-2026`,docroot 是 repo 根目錄)→ 瀏覽器帶 `?v=N` cache-bust 重載 → 在 console(或瀏覽器 MCP 的 javascript 工具)斷言關鍵狀態(class、computed style、位置)→ 截圖 + 確認 console 無錯 → zh 頁同樣過一次。
8. **收尾**:更新下方清單(含 Figma node-id 與原生尺寸)→ **改過 demos.css 或 demo js 時,把頁面上資源連結的 `?v=` 參數換成當天日期**(否則瀏覽器快取會讓人看到舊版)→ commit + push。

## 動態圖的慣例

- 自動循環用 `async` 迴圈 + `sleep`;**圖滑出視窗要暫停**(IntersectionObserver threshold 0.3)
- 內部捲動用 **rAF 自己驅動**(easeInOut;不要用原生 smooth scroll——會被頁面自身的平滑捲動互相取消,見 tablet-05 的 scrollTier)
- 按鈕按壓特效:press class(scale 0.88 + opacity 0.55, 0.18s)
- 手動互動要能與自動循環共存(自動步驟先檢查狀態,已被使用者觸發就跳過)
- `prefers-reduced-motion` 給靜態可手動版:不自動捲動、hint 換成可互動文案、demos.css 補該前綴的 reduced-motion 規則

## 已完成的圖

| ID | 頁面 | 位置 | Figma 來源 | 互動 |
|---|---|---|---|---|
| `dashboard-04-sales-overview` | dashboard.html / zh | Solution 01「Sales Overview」的圖(id 沿用建立時的 04 圖位編號) | 檔案 EBx8zHO3QIWL3nzpU6HAuy,frames 119:1178(第二側欄展開)+ 123:2023(收合)(原生 1508×1117) | Peblla shadcn/ui 系統的儀表板外殼,無限自動循環:第二側欄(240px 白)滑出收合(只留一顆展開鈕)→ 再展開復原;**主側欄不會展開子選單,子選單只存在於第二側欄**。收合/展開鈕可手動點,含按壓特效。頂欄 52px:麵包屑 + 7 個選單(Search/時區/Organization/Store/Support/Account/Inbox)。主側欄 240px 灰,15 個真實項目(Report Center active 橘 #FF4D00 帶 New、Reputation 帶 Beta;icon 用 Feather 對應,文字來源 frame 124:1345);第二側欄三組:Sales(Sales Overview active/Sales Summary/Order Details)、Transactions、Reconciliation。中間 content = **Sales Overview 完整畫面**(frame 124:4305):黃色第三方聲明橫幅(可關)、3rd Party Excl./Incl. 切換、日期比較篩選列(營業日 5:00 am)、三張 Key Metrics 卡(Net Sales $21,862.50 呼應文案、綠漲紅跌徽章、Payment/Channel/Dining 分頁可點切換)、Sales VS Payment、Unclosed orders、Miscellaneous、Performance;假資料設定為虛構店家 Golden Ember BBQ(#A62,與 tablet 圖同店)。內容區可捲動,第二側欄收合時內容會回流變寬。字型 Inter(設計檔為 Roboto,沿用整站決定) |
| `tablet-05-tier-unlock` | tablet.html / zh | Process「Decision one」的圖 | frame 3010:11395(原生 1194×834) | 高級 AYCE BBQ 情境,無限自動循環:Tier 1 Classic BBQ(彩色)停留 → 平滑捲至 Tier 2 Premium Cuts(置灰+鎖徽章)→ Unlock 按壓特效 → 恢復彩色 → 同樣走 Tier 3 Wagyu Reserve(各 6 道菜)→ 捲回 Tier 1 並重新上鎖,循環(一圈約 13s)。圖不在視窗內會暫停;reduced-motion 改手動 Unlock。+ 會加購物車;藍色用餐倒數 2:00:00 每秒跳。菜品圖為灰色佔位(待真圖) |

## 待做的圖(tablet 頁提案)

01 Menu browsing · 02 Tier lock badges · 03 Order history · 04 Round control · 06 Poster prototype vs shipped(Figma frame 待定)· 07 Round limit state。
其他 case:mpos-05-staff-vs-guest(版位比例 1000:560;**Figma node-id 與原生尺寸未記錄,動工前先跟 Mina 要**)。
