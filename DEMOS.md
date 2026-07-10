# Interactive figure demos

命名規則:`{case}-{nn}-{slug}`(nn = 頁面上第 nn 個圖位)。
每個 demo:HTML 錨點 `#demo-{id}` · 檔案 `demos/{id}.js` · 共用樣式 `demos/demos.css`。
做法:照 Figma 原尺寸 1:1 重建(精確 token),整體縮放進漸層舞台(裝置佔 80% 寬)。

| ID | 頁面 | 位置 | Figma 來源 | 互動 |
|---|---|---|---|---|
| `tablet-05-tier-unlock` | tablet.html / zh | Process「Decision one」的圖 | frame 3010:11395 | Category 1 可點餐;捲到 Category 2 時整區變置灰+鎖徽章;點 Unlock 原地恢復顏色;↺ 重玩;+ 會加購物車。菜品圖為灰色佔位(待真圖) |
