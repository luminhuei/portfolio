/* ---------------------------------------------------------------------------
   dashboard-08-weekly-report — the Weekly Report's mobile card stream, shown
   as two phone-screen-sized panels (rounded + shadow, no device mockup —
   the portrait shape reads as "phone" the way a wide panel reads as "web").
   Rebuilt from Figma Ng5Qec5PY0iDOczXTzjGc8 / 5407:3522: 6 modules / 7 cards,
   split 3+3 — left = sales performance, right = customers & place. Each phone
   slowly auto-scrolls (pauses on hover / off screen). Native 900x812 group of
   two 390x780 screens, scaled to fit the stage.
   Fake data: Golden Ember BBQ, store #A62, week of Jul 04-10, 2026.
--------------------------------------------------------------------------- */
(function () {
  const root = document.getElementById("demo-dashboard-08-weekly-report");
  if (!root) return;

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const S = (d, w) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${w || 1.7}" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
  const I = {
    up: S('<path d="M12 19V6"/><path d="M6 11l6-6 6 6"/>', 2),
    down: S('<path d="M12 5v13"/><path d="M6 13l6 6 6-6"/>', 2),
    chev: S('<path d="M9.5 6l6 6-6 6"/>', 1.8),
    signal: S('<path d="M2 20h2M7 20v-4M12 20v-8M17 20V8M22 20V4"/>', 2.2),
    wifi: S('<path d="M2 8.5a15 15 0 0120 0"/><path d="M5 12a10 10 0 0114 0"/><path d="M8.5 15.5a5 5 0 017 0"/><path d="M12 19h.01"/>'),
    batt: S('<rect x="2" y="8" width="17" height="9" rx="2"/><path d="M21 11v3"/><rect x="4" y="10" width="11" height="5" rx="1" fill="currentColor" stroke="none"/>'),
    pin: S('<path d="M12 21s7-6.2 7-11a7 7 0 10-14 0c0 4.8 7 11 7 11z"/><circle cx="12" cy="10" r="2.4"/>'),
  };
  const delta = (dir, txt) => `<span class="wkl-delta wkl-delta-${dir === "up" ? "up" : "down"}">${dir === "up" ? I.up : I.down}${txt}</span>`;

  const statusbar = `
    <div class="wkl-status">
      <span class="wkl-time">9:41</span>
      <span class="wkl-statusicons"><span>${I.signal}</span><span>${I.wifi}</span><span>${I.batt}</span></span>
    </div>`;
  const header = `
    <div class="wkl-head">
      <p class="wkl-htitle">Weekly Report</p>
      <p class="wkl-hsub">Jul 04 &ndash; Jul 10, 2026 &middot; Golden Ember BBQ</p>
    </div>`;

  /* ---- grouped bar chart: 3 weeks, two series, last week hot ---- */
  const groupedBars = (groups, max) => `
    <div class="wkl-gbars">
      ${groups.map((g) => `
      <div class="wkl-ggroup">
        <div class="wkl-gpair">
          <span class="wkl-gbar${g.hot ? " wkl-gbar-hot" : ""}" style="height:${(g.a / max * 100).toFixed(1)}%"></span>
          <span class="wkl-gbar wkl-gbar-b${g.hot ? " wkl-gbar-bhot" : ""}" style="height:${(g.b / max * 100).toFixed(1)}%"></span>
        </div>
        <span class="wkl-glabel">${g.label}</span>
      </div>`).join("")}
    </div>`;

  const trendCard = (aName, aVal, aD, bName, bVal, bD, groups, max) => `
    <div class="wkl-card">
      <div class="wkl-twins">
        <div class="wkl-twin"><span class="wkl-tlabel"><span class="wkl-dot wkl-dot-a"></span>${aName}</span><span class="wkl-tval">${aVal}</span>${delta(aD[0], aD[1])}</div>
        <div class="wkl-twin"><span class="wkl-tlabel"><span class="wkl-dot wkl-dot-b"></span>${bName}</span><span class="wkl-tval">${bVal}</span>${delta(bD[0], bD[1])}</div>
      </div>
      ${groupedBars(groups, max)}
    </div>`;

  /* ---- single-series column chart (channel) ---- */
  const columns = (bars, max) => `
    <div class="wkl-cols">
      ${bars.map((b) => `
      <div class="wkl-col">
        <span class="wkl-colbar" style="height:${(b.v / max * 100).toFixed(1)}%"></span>
        <span class="wkl-collabel">${b.label}</span>
      </div>`).join("")}
    </div>`;

  /* ---- line chart (member analysis), two series over 7 points ---- */
  const linePts = (arr, max) => arr.map((v, i) => `${(i / (arr.length - 1) * 320).toFixed(1)},${(112 - v / max * 96).toFixed(1)}`).join(" ");
  const lineChart = (a, b, max) => `
    <svg class="wkl-line" viewBox="0 0 320 120" preserveAspectRatio="none">
      <polyline points="${linePts(b, max)}" fill="none" stroke="#d4d4d8" stroke-width="2" />
      <polyline points="${linePts(a, max)}" fill="none" stroke="#ff4d00" stroke-width="2.4" />
    </svg>`;

  /* ---- donut (review) ---- */
  const donut = (pct) => {
    const r = 52, c = 2 * Math.PI * r, seg = (pct / 100) * c;
    return `
    <svg class="wkl-donut" viewBox="0 0 140 140">
      <circle cx="70" cy="70" r="${r}" fill="none" stroke="#ffe0d3" stroke-width="18" />
      <circle cx="70" cy="70" r="${r}" fill="none" stroke="#ff4d00" stroke-width="18"
        stroke-dasharray="${seg.toFixed(1)} ${(c - seg).toFixed(1)}" stroke-dashoffset="${(c * 0.25).toFixed(1)}" stroke-linecap="round" transform="rotate(-90 70 70)" />
      <text x="70" y="66" class="wkl-donutbig">4.6</text>
      <text x="70" y="86" class="wkl-donutsm">avg rate</text>
    </svg>`;
  };

  /* ---- abstract "map" (simplified vector, not a real map) ---- */
  const geoMap = `
    <div class="wkl-map">
      <svg viewBox="0 0 358 180" preserveAspectRatio="xMidYMid slice">
        <rect width="358" height="180" fill="#eef1f4" />
        <g stroke="#dfe4ea" stroke-width="6">
          <path d="M-10 46h378M-10 104h378M-10 150h378" />
          <path d="M70 -10v200M168 -10v200M258 -10v200" />
        </g>
        <g stroke="#e8ecf1" stroke-width="2">
          <path d="M-10 74h378M118 -10v200M212 -10v200" />
        </g>
        <circle cx="176" cy="92" r="52" fill="#ff4d00" opacity="0.14" />
        <circle cx="120" cy="60" r="34" fill="#ff4d00" opacity="0.16" />
        <circle cx="250" cy="120" r="40" fill="#ff4d00" opacity="0.12" />
        <g fill="#ff4d00"><circle cx="176" cy="92" r="5"/><circle cx="120" cy="60" r="4"/><circle cx="250" cy="120" r="4"/></g>
      </svg>
      <span class="wkl-maplabel"><span class="wkl-ic14">${I.pin}</span>Koreatown &middot; Midtown</span>
    </div>`;

  const module = (title, body) => `<p class="wkl-mtitle">${title}</p>${body}`;

  /* ============ LEFT PHONE — sales performance ============ */
  const LEFT = `
    ${statusbar}${header}
    ${module("Trend for sales and upsell", `
      ${trendCard("Net sales", "$148.2k", ["up", "+6.4%"], "Upsell sales", "$18.6k", ["up", "+3.1%"],
        [{ label: "Jun 26", a: 128, b: 15 }, { label: "Jul 03", a: 139, b: 16.5 }, { label: "Jul 10", a: 148.2, b: 18.6, hot: true }], 160)}
      ${trendCard("Third party", "$22.4k", ["down", "-2.2%"], "Direct delivery", "$3.1k", ["up", "+8.0%"],
        [{ label: "Jun 26", a: 20.8, b: 2.5 }, { label: "Jul 03", a: 23.1, b: 2.8 }, { label: "Jul 10", a: 22.4, b: 3.1, hot: true }], 26)}`)}
    ${module("Top sales items", `
      <div class="wkl-card wkl-tablecard">
        <table class="wkl-table">
          <thead><tr><th>Rank</th><th>Item name</th><th class="wkl-r">Count</th><th class="wkl-r">Amount</th></tr></thead>
          <tbody>
            <tr><td><span class="wkl-rank">1</span>${I.up}</td><td>Wagyu Reserve <span class="wkl-tag">upgrade</span></td><td class="wkl-r">486</td><td class="wkl-r">$14,580.00</td></tr>
            <tr><td><span class="wkl-rank">2</span>${I.up}</td><td>Premium Cuts <span class="wkl-tag">upgrade</span></td><td class="wkl-r">612</td><td class="wkl-r">$12,240.00</td></tr>
            <tr><td><span class="wkl-rank">3</span></td><td>Soju Bottle</td><td class="wkl-r">704</td><td class="wkl-r">$8,448.00</td></tr>
            <tr><td><span class="wkl-rank">4</span>${I.down}</td><td>Signature Cocktail</td><td class="wkl-r">388</td><td class="wkl-r">$4,268.00</td></tr>
            <tr><td><span class="wkl-rank">5</span>${I.up}</td><td>Corkage &amp; Dessert</td><td class="wkl-r">251</td><td class="wkl-r">$2,761.00</td></tr>
          </tbody>
        </table>
      </div>`)}
    ${module("Sales channel distribution", `
      <div class="wkl-card">
        <div class="wkl-triple">
          <div class="wkl-stat"><span class="wkl-slabel">Pick up</span><span class="wkl-sval">$9.1k</span></div>
          <div class="wkl-stat"><span class="wkl-slabel">Dine in</span><span class="wkl-sval">$121.4k</span></div>
          <div class="wkl-stat"><span class="wkl-slabel">Take out</span><span class="wkl-sval">$17.8k</span></div>
        </div>
        <p class="wkl-sub2">Dine in <b>$121,438.20</b></p>
        ${columns([{ label: "App", v: 14.2 }, { label: "Web", v: 7.6 }, { label: "POS", v: 98.4 }, { label: "Kiosk", v: 27.9 }], 100)}
      </div>`)}
    <div class="wkl-endcap">End of report</div>`;

  /* ============ RIGHT PHONE — customers & place ============ */
  const RIGHT = `
    ${statusbar}${header}
    ${module("Member analysis summary", `
      <div class="wkl-card">
        <div class="wkl-twins">
          <div class="wkl-twin"><span class="wkl-tlabel">Active members</span><span class="wkl-tval">518</span>${delta("up", "+7%")}</div>
          <div class="wkl-twin"><span class="wkl-tlabel">New this week</span><span class="wkl-tval">64</span>${delta("up", "+12%")}</div>
        </div>
        ${lineChart([62, 74, 88, 95, 120, 141, 138], [58, 66, 79, 84, 101, 120, 116], 150)}
        <div class="wkl-legend"><span><span class="wkl-dot wkl-dot-a"></span>This week</span><span><span class="wkl-dot wkl-dot-b"></span>Last week</span></div>
      </div>`)}
    ${module("Review summary", `
      <div class="wkl-card">
        <div class="wkl-twins">
          <div class="wkl-twin"><span class="wkl-tlabel">Avg rate</span><span class="wkl-tval">4.6</span>${delta("up", "+0.2")}</div>
          <div class="wkl-twin"><span class="wkl-tlabel">Response</span><span class="wkl-tval">48/62</span>${delta("up", "+14%")}</div>
        </div>
        <div class="wkl-donutrow">
          ${donut(78)}
          <div class="wkl-legend wkl-legend-col">
            <span><span class="wkl-dot wkl-dot-a"></span>Google &middot; 78%</span>
            <span><span class="wkl-dot wkl-dot-c"></span>Yelp &middot; 22%</span>
          </div>
        </div>
        <button class="wkl-link">Sentiment analysis${I.chev}</button>
      </div>`)}
    ${module("Off-premise geo distribution", `
      <div class="wkl-card">
        <div class="wkl-twins">
          <div class="wkl-twin"><span class="wkl-tlabel">Delivery orders</span><span class="wkl-tval">214</span>${delta("up", "+12%")}</div>
          <div class="wkl-twin"><span class="wkl-tlabel">Avg distance</span><span class="wkl-tval">2.4 mi</span>${delta("down", "-0.3")}</div>
        </div>
        ${geoMap}
      </div>`)}
    <div class="wkl-endcap">End of report</div>`;

  root.innerHTML = `
    <div class="demo-stage">
      <div class="wkl">
        <div class="wkl-phone"><div class="wkl-scroll">${LEFT}</div></div>
        <div class="wkl-phone"><div class="wkl-scroll">${RIGHT}</div></div>
      </div>
    </div>`;

  const stage = root.querySelector(".demo-stage");
  const device = root.querySelector(".wkl");
  const W = 900, H = 812;
  const fit = () => {
    const w = stage.clientWidth;
    if (!w) return; // don't collapse to zero while the figure is unmeasured
    const s = w / W;
    device.style.transform = `scale(${s})`;
    stage.style.height = `${Math.round(H * s)}px`;
  };
  new ResizeObserver(fit).observe(stage);
  window.addEventListener("resize", fit);
  window.addEventListener("load", fit);
  fit();

  /* ---- slow auto-scroll, pausing on hover / off screen ---- */
  const scrolls = [...root.querySelectorAll(".wkl-scroll")];
  const hovered = new WeakSet();
  scrolls.forEach((sc) => {
    const phone = sc.closest(".wkl-phone");
    phone.addEventListener("pointerenter", () => hovered.add(sc));
    phone.addEventListener("pointerleave", () => hovered.delete(sc));
  });
  let onStage = true;
  new IntersectionObserver(([e]) => (onStage = e.isIntersecting), { threshold: 0.2 }).observe(stage);

  if (!reduced) {
    const PERIOD = 34000; // ms for a full down-and-back
    const ease = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
    const start = performance.now();
    const tick = (now) => {
      if (onStage) {
        scrolls.forEach((sc, i) => {
          if (hovered.has(sc)) return;
          const range = sc.scrollHeight - sc.clientHeight;
          if (range <= 2) return;
          const phase = (((now - start + i * PERIOD * 0.5) % PERIOD) / PERIOD);
          const tri = phase < 0.5 ? phase * 2 : (1 - phase) * 2;
          const target = range * ease(tri);
          sc.scrollTop += (target - sc.scrollTop) * 0.08; // lerp — buttery, no snap after hover
        });
      }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }
})();
