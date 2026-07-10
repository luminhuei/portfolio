# Interactive figure demos

命名規則:`{case}-{nn}-{slug}`(nn = 頁面上第 nn 個圖位)。
每個 demo:HTML 錨點 `#demo-{id}` · 檔案 `demos/{id}.js` · 共用樣式 `demos/demos.css`。
做法:照 Figma 原尺寸 1:1 重建(精確 token),整體縮放進漸層舞台(裝置佔 80% 寬)。

| ID | 頁面 | 位置 | Figma 來源 | 互動 |
|---|---|---|---|---|
| `tablet-05-tier-unlock` | tablet.html / zh | Process「Decision one」的圖 | frame 3010:11395 | 高級 AYCE BBQ 情境,無限自動循環:Tier 1 Classic BBQ(彩色)停留 → 平滑捲至 Tier 2 Premium Cuts(置灰+鎖徽章)→ Unlock 按壓特效 → 恢復彩色 → 同樣走 Tier 3 Wagyu Reserve(各 6 道菜)→ 捲回 Tier 1 並重新上鎖,循環。圖不在視窗內會暫停;prefers-reduced-motion 時改為手動點 Unlock。+ 會加購物車;藍色用餐倒數 2:00:00 每秒跳。菜品圖為灰色佔位(待真圖) |
