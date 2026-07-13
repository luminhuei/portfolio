/* ---------------------------------------------------------------------------
   dashboard-08-weekly-report — the Weekly Report's mobile card stream as a
   SINGLE phone screen centered in one #fafafa frame, slowly auto-scrolling
   on a loop. Rebuilt faithfully from Figma Ng5Qec5PY0iDOczXTzjGc8 /
   5407:3522 — Material-3 report cards: stat tabs + detail row + charts with
   right-side y-axis, gridlines and dot legends; stacked bars (gray past
   week, orange current), two-line member chart, two-segment donut, ranked
   table with colored up/down deltas. Five modules top to bottom: Trend for
   sales and upsell, Top sales items, Sales channel distribution, Member
   analysis summary, Review summary (Off-premise geo removed by request).
   Native phone 412 wide; content scrolls. Fake data: Golden Ember BBQ,
   store #A62, week of Jul 04-10, 2026.
--------------------------------------------------------------------------- */
(function () {
  const root = document.getElementById("demo-dashboard-08-weekly-report");
  if (!root) return;
  const S = (d, w) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${w || 1.7}" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
  const I = {
    cal: S('<rect x="3.5" y="5" width="17" height="15.5" rx="2"/><path d="M3.5 9.5h17M8 3v4M16 3v4"/>', 1.7),
    signal: S('<path d="M2 20h2M7 20v-4M12 20v-8M17 20V8M22 20V4"/>', 2.2),
    wifi: S('<path d="M2 8.5a15 15 0 0120 0"/><path d="M5 12a10 10 0 0114 0"/><path d="M8.5 15.5a5 5 0 017 0"/><path d="M12 19h.01"/>'),
    batt: S('<rect x="2" y="8" width="17" height="9" rx="2"/><path d="M21 11v3"/><rect x="4" y="10" width="11" height="5" rx="1" fill="currentColor" stroke="none"/>'),
    chev: S('<path d="M9 6l6 6-6 6"/>', 2),
    pin: S('<path d="M12 21s7-6.2 7-11a7 7 0 10-14 0c0 4.8 7 11 7 11z"/><circle cx="12" cy="10" r="2.4"/>'),
    arrowUp: S('<path d="M12 19V5"/><path d="M6 11l6-6 6 6"/>', 2),
  };
  const up = '<span class="wk-tri wk-tri-up"></span>';
  const down = '<span class="wk-tri wk-tri-down"></span>';

  /* --- shared phone chrome --- */
  const statusbar = `
    <div class="wk-status">
      <span class="wk-time">9:41</span>
      <span class="wk-statusicons"><span>${I.signal}</span><span>${I.wifi}</span><span>${I.batt}</span></span>
    </div>`;
  const datebar = `
    <div class="wk-datebar"><span class="wk-ic20">${I.cal}</span><span>Jul 04 &ndash; Jul 10, 2026</span></div>`;

  /* --- pieces --- */
  const tab = (label, val, dDir, dTxt, active) => `
    <div class="wk-tab${active ? " wk-tab-on" : ""}">
      <span class="wk-tlabel">${label}</span>
      <span class="wk-tval">${val}</span>
      <span class="wk-delta wk-delta-${dDir}">${dDir === "up" ? up : down}${dTxt}</span>
    </div>`;

  const detail = (pairs) => `
    <div class="wk-detail">${pairs.map(([l, v]) => `<div class="wk-dcol"><span class="wk-dl">${l}</span><span class="wk-dv">${v}</span></div>`).join("")}</div>`;

  const dotLegend = (items) => `
    <div class="wk-legend">${items.map(([cls, txt]) => `<span><span class="wk-dot wk-dot-${cls}"></span>${txt}</span>`).join("")}</div>`;

  const kfmt = (k) => (k >= 1 ? `${k}k` : `${Math.round(k * 1000)}`);

  /* bars: {net, upsell, hot, label}; stacked = show upsell cap */
  const barChart = (bars, yTop, ticks, stacked) => {
    const H = 128;
    return `
    <div class="wk-chart">
      <div class="wk-plot">
        ${ticks.map((t) => `<div class="wk-gl" style="bottom:${(t / yTop * 100).toFixed(1)}%"></div>`).join("")}
        <div class="wk-bars">
          ${bars.map((b) => `
          <div class="wk-bcol"><div class="wk-bstack">
            ${stacked ? `<div class="wk-seg wk-up${b.hot ? " wk-hot" : ""}" style="height:${(b.upsell / yTop * H).toFixed(1)}px"></div>` : ""}
            <div class="wk-seg wk-net${b.hot ? " wk-hot" : ""}" style="height:${(b.net / yTop * H).toFixed(1)}px"></div>
          </div></div>`).join("")}
        </div>
      </div>
      <div class="wk-yaxis">${ticks.map((t) => `<span class="wk-yt" style="bottom:${(t / yTop * 100).toFixed(1)}%">${kfmt(t)}</span>`).join("")}</div>
      <div class="wk-xaxis">${bars.map((b) => `<span class="wk-xt">${b.label}</span>`).join("")}</div>
    </div>`;
  };

  const trendCard = (t) => `
    <div class="wk-card">
      <div class="wk-tabs">${tab(t.a[0], t.a[1], t.a[2], t.a[3])}${tab(t.b[0], t.b[1], t.b[2], t.b[3])}</div>
      <div class="wk-body">
        ${detail([[t.a[0], t.a[4]], [t.b[0], t.b[4]]])}
        ${barChart(t.bars, t.yTop, t.ticks, true)}
        ${dotLegend([["a", t.a[0]], ["b", t.b[0]]])}
      </div>
    </div>`;

  /* member line chart: two series over N points */
  const linePts = (arr, yTop) => arr.map((v, i) => `${(i / (arr.length - 1) * 316).toFixed(1)},${(112 - v / yTop * 108).toFixed(1)}`).join(" ");
  const lineCard = (m) => `
    <div class="wk-card">
      <div class="wk-tabs">${tab(m.label, m.big, m.dDir, m.dTxt)}</div>
      <div class="wk-body">
        ${detail([[m.label, m.big2]])}
        <div class="wk-chart wk-linechart">
          <div class="wk-plot">
            ${m.ticks.map((t) => `<div class="wk-gl" style="bottom:${(t / m.yTop * 100).toFixed(1)}%"></div>`).join("")}
            <svg class="wk-line" viewBox="0 0 316 120" preserveAspectRatio="none">
              <polyline points="${linePts(m.prev, m.yTop)}" fill="none" stroke="#bdbdbd" stroke-width="2"/>
              <polyline points="${linePts(m.cur, m.yTop)}" fill="none" stroke="#ff4d00" stroke-width="2.4"/>
            </svg>
          </div>
          <div class="wk-yaxis">${m.ticks.map((t) => `<span class="wk-yt" style="bottom:${(t / m.yTop * 100).toFixed(1)}%">${t}</span>`).join("")}</div>
          <div class="wk-xaxis">${m.xlabels.map((x) => `<span class="wk-xt">${x}</span>`).join("")}</div>
        </div>
        ${dotLegend([["a", "This week"], ["b2", "Last week"]])}
      </div>
    </div>`;

  /* review donut: a seamless closed ring — a full light-orange (Yelp) circle
     with the dark-orange (Google) arc laid over its share, so the two colors
     meet edge-to-edge with no white gap */
  const donutCard = (r) => {
    const rad = 52, c = 2 * Math.PI * rad;
    const gseg = (r.google / 100) * c;
    return `
    <div class="wk-card">
      <div class="wk-tabs">${tab(r.a[0], r.a[1], r.a[2], r.a[3])}${tab(r.b[0], r.b[1], r.b[2], r.b[3])}</div>
      <div class="wk-body wk-body-center">
        <svg class="wk-donut" viewBox="0 0 140 140">
          <circle cx="70" cy="70" r="${rad}" fill="none" stroke="#ffc7ac" stroke-width="17"/>
          <circle cx="70" cy="70" r="${rad}" fill="none" stroke="#ff4d00" stroke-width="17"
            stroke-dasharray="${gseg.toFixed(2)} ${(c - gseg).toFixed(2)}" transform="rotate(-90 70 70)"/>
        </svg>
        ${dotLegend([["a", `Google ${r.google}%`], ["b", `Yelp ${r.yelp}%`]])}
        <button class="wk-sentiment">Sentiment analysis${I.chev}</button>
      </div>
    </div>`;
  };

  /* abstract map (simplified vector, not a real map) + heat-size legend */
  const geoCard = (g) => `
    <div class="wk-card">
      <div class="wk-tabs">${tab(g.a[0], g.a[1], g.a[2], g.a[3])}${tab(g.b[0], g.b[1], g.b[2], g.b[3])}</div>
      <div class="wk-body">
        <div class="wk-map">
          <svg viewBox="0 0 348 240" preserveAspectRatio="xMidYMid slice">
            <rect width="348" height="240" fill="#eef1f4"/>
            <g stroke="#dfe4ea" stroke-width="7"><path d="M-10 60h368M-10 130h368M-10 196h368M64 -10v260M172 -10v260M262 -10v260"/></g>
            <g stroke="#e8ecf1" stroke-width="2.5"><path d="M-10 96h368M118 -10v260M216 -10v260"/></g>
            <circle cx="176" cy="118" r="56" fill="#ff4d00" opacity="0.13"/>
            <circle cx="112" cy="72" r="34" fill="#ff4d00" opacity="0.16"/>
            <circle cx="256" cy="158" r="42" fill="#ff4d00" opacity="0.12"/>
            <circle cx="86" cy="182" r="24" fill="#ff4d00" opacity="0.16"/>
            <g fill="#ff4d00"><circle cx="176" cy="118" r="5"/><circle cx="112" cy="72" r="4"/><circle cx="256" cy="158" r="4"/><circle cx="86" cy="182" r="3.5"/></g>
          </svg>
          <span class="wk-maplabel"><span class="wk-ic14">${I.pin}</span>Koreatown &middot; Midtown</span>
        </div>
        <div class="wk-heatlegend">
          ${[["18", ">15", ">$200"], ["12", ">10", ">$100"], ["8", "5&ndash;9", ">$50"], ["4", "1&ndash;4", ">$10"]].map(([sz, u, s]) => `
          <div class="wk-heatcol">
            <span class="wk-heatdot" style="width:${sz}px;height:${sz}px"></span>
            <span class="wk-heatrow"><span>Users</span><span>${u}</span></span>
            <span class="wk-heatrow"><span>Sales</span><span>${s}</span></span>
          </div>`).join("")}
        </div>
      </div>
    </div>`;

  const heading = (t) => `<p class="wk-mtitle">${t}</p>`;

  /* ============ single phone — five modules, top to bottom ============ */
  const CONTENT = `
    ${statusbar}${datebar}
    ${heading("Trend for sales and upsell")}
    ${trendCard({
      a: ["Net sales", "$148.2k", "up", "6.4%", "$148,240.50"],
      b: ["Upsell sales", "$18.6k", "up", "3.1%", "$18,610.36"],
      bars: [{ net: 128, upsell: 15, label: "Jun 26" }, { net: 139, upsell: 16.5, label: "Jul 03" }, { net: 148.2, upsell: 18.6, hot: true, label: "Jul 10" }],
      yTop: 180, ticks: [180, 135, 90, 45, 0],
    })}
    ${trendCard({
      a: ["Third party", "$22.4k", "down", "2.2%", "$22,412.80"],
      b: ["Direct delivery", "$3.1k", "up", "8.0%", "$3,104.50"],
      bars: [{ net: 20.8, upsell: 2.5, label: "Jun 26" }, { net: 23.1, upsell: 2.8, label: "Jul 03" }, { net: 22.4, upsell: 3.1, hot: true, label: "Jul 10" }],
      yTop: 32, ticks: [32, 24, 16, 8, 0],
    })}
    ${heading("Top sales items")}
    <div class="wk-card wk-tablecard">
      <table class="wk-table">
        <thead><tr><th>Rank</th><th>Item name</th><th class="wk-r">Count</th><th class="wk-r">Amount</th></tr></thead>
        <tbody>
          <tr><td class="wk-rankcell"><span class="wk-rank">1</span><span class="wk-rdelta up">${up}2</span></td><td>Wagyu Reserve</td><td class="wk-r">486</td><td class="wk-r">$14,580.00</td></tr>
          <tr><td class="wk-rankcell"><span class="wk-rank">2</span><span class="wk-rdelta zero">0</span></td><td>Premium Cuts</td><td class="wk-r">612</td><td class="wk-r">$12,240.00</td></tr>
          <tr><td class="wk-rankcell"><span class="wk-rank">3</span><span class="wk-rdelta up">${up}1</span></td><td>Soju Bottle</td><td class="wk-r">704</td><td class="wk-r">$8,448.00</td></tr>
          <tr><td class="wk-rankcell"><span class="wk-rank">4</span><span class="wk-rdelta down">${down}2</span></td><td>Signature Cocktail</td><td class="wk-r">388</td><td class="wk-r">$4,268.00</td></tr>
          <tr><td class="wk-rankcell"><span class="wk-rank">5</span><span class="wk-rdelta zero">0</span></td><td>Corkage &amp; Dessert</td><td class="wk-r">251</td><td class="wk-r">$2,761.00</td></tr>
        </tbody>
      </table>
    </div>
    ${heading("Sales channel distribution")}
    <div class="wk-card">
      <div class="wk-tabs wk-tabs-4">
        <div class="wk-tab wk-tab-on"><span class="wk-tlabel">Pick up</span><span class="wk-tval">$9.1k</span><span class="wk-tsub">150</span></div>
        <div class="wk-tab"><span class="wk-tlabel">Dine in</span><span class="wk-tval">$121.4k</span><span class="wk-tsub">592</span></div>
        <div class="wk-tab"><span class="wk-tlabel">Delivery</span><span class="wk-tval">$284</span><span class="wk-tsub">8</span></div>
        <div class="wk-tab"><span class="wk-tlabel">Take out</span><span class="wk-tval">$17.8k</span><span class="wk-tsub">121</span></div>
      </div>
      <div class="wk-body">
        ${detail([["Pick up", "$9,142.60"]])}
        ${barChart([{ net: 3.1, label: "App" }, { net: 1.8, label: "Web" }, { net: 2.9, label: "POS" }, { net: 1.3, label: "Kiosk" }], 4, [4, 3, 2, 1, 0], false)}
        ${dotLegend([["a", "Net Sales"], ["b", "Upsell"]])}
      </div>
    </div>
    ${heading("Member analysis summary")}
    ${lineCard({
      label: "Active members", big: "518", big2: "518", dDir: "up", dTxt: "7%",
      cur: [42, 58, 50, 46, 68, 90, 84], prev: [48, 56, 44, 40, 52, 60, 58],
      yTop: 100, ticks: [100, 50, 0], xlabels: ["Jul 04", "Jul 07", "Jul 10"],
    })}
    ${heading("Review summary")}
    ${donutCard({
      a: ["Avg rate", "4.6", "up", "0.2"], b: ["Response / Review", "48/62", "up", "14%"],
      google: 78, yelp: 22,
    })}
    <div class="wk-endcap">
      <p class="wk-endtext">End of report</p>
      <button class="wk-backtop" type="button">${I.arrowUp}Back to top</button>
    </div>`;

  /* One #fafafa frame (same width as the other figures) with a single phone
     centered inside. The screen slowly auto-scrolls on a loop. */
  root.innerHTML = `
    <div class="wk-duo">
      <div class="wk-cell wk-solo"><div class="wk"><div class="wk-scroll">${CONTENT}</div></div></div>
    </div>`;

  const cell = root.querySelector(".wk-cell");
  const device = cell.querySelector(".wk");
  const scroll = cell.querySelector(".wk-scroll");
  const W = 412, H = 812;
  const fit = () => {
    const w = cell.clientWidth;
    if (!w) return;
    const s = w / W;
    device.style.transform = `scale(${s})`;
    cell.style.height = `${Math.round(H * s)}px`;
  };
  new ResizeObserver(fit).observe(cell);
  window.addEventListener("resize", fit);
  window.addEventListener("load", fit);
  fit();

  /* --- slow one-way auto-scroll: glide DOWN to the bottom, then the
     "Back to top" button presses itself and the screen snaps back to the
     top (no reverse scrolling). Pauses on hover / off screen. --- */
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const backtop = cell.querySelector(".wk-backtop");
  let hovered = false, onStage = true;
  cell.addEventListener("pointerenter", () => (hovered = true));
  cell.addEventListener("pointerleave", () => (hovered = false));
  new IntersectionObserver(([e]) => (onStage = e.isIntersecting), { threshold: 0.2 }).observe(root);

  /* press effect, then snap to the top instantly (used by auto-loop + click) */
  let progress = 0;                     // 0 = top, 1 = bottom
  let last = performance.now();
  let phase = "top";                    // "top" (dwell) | "scroll" | "bottom" (dwell)
  let holdT = 0;
  let snapping = false;

  const backToTop = () => {
    if (snapping) return;
    snapping = true;
    backtop.classList.add("wk-press");
    setTimeout(() => {
      scroll.scrollTop = 0;             // straight to the top, no scroll
      progress = 0;
      scroll.classList.remove("wk-fadein");
      void scroll.offsetWidth;          // restart the animation
      scroll.classList.add("wk-fadein"); // then let the info fade+rise back in
    }, 240);
    setTimeout(() => {
      backtop.classList.remove("wk-press");
      snapping = false;
      phase = "top";                    // dwell at the top again — read the title first
      holdT = 0;
      last = performance.now();
    }, 560);
  };
  backtop.addEventListener("click", backToTop);

  if (!reduced) {
    const HOLD_TOP_MS = 2600;           // let the title be read before scrolling
    const HOLD_BOTTOM_MS = 1400;        // dwell at the bottom before returning
    const DOWN_MS = 22000;              // time to glide top -> bottom
    const ease = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
    const tick = (now) => {
      const dt = now - last;
      last = now;
      if (onStage && !hovered && !snapping) {
        const range = scroll.scrollHeight - scroll.clientHeight;
        if (range > 2) {
          if (phase === "top") {
            holdT += dt;
            if (holdT >= HOLD_TOP_MS) phase = "scroll";
          } else if (phase === "scroll") {
            progress = Math.min(1, progress + dt / DOWN_MS);
            scroll.scrollTop = range * ease(progress);
            if (progress >= 1) { phase = "bottom"; holdT = 0; }
          } else {
            holdT += dt;
            if (holdT >= HOLD_BOTTOM_MS) backToTop();
          }
        }
      }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }
})();
