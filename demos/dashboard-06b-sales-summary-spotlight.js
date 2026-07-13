/* ---------------------------------------------------------------------------
   dashboard-06b-sales-summary-spotlight — alternative take on the Solution 02
   figure, presented Stripe-marketing-style for comparison with
   dashboard-06-sales-summary (same slot; one of the two will be retired).

   No navigation chrome at all: a chrome-free white panel holds just the
   "Sales Summary" heading and the three orange charts (Sales by day with
   the live tooltip, Day of week, Time of day — exact Figma vectors from
   frame 453:13243, same 1232px content geometry as dashboard-06), and a
   floating card overlaps it on the left where the 13 summary tables take
   the stage one at a time (Revenue, Cash, …). Data is identical to
   dashboard-06: Golden Ember BBQ #A62, May 10 – Jun 19, 2025, everything
   reconciling to Net Sales $13,486.50.

   Native canvas 1776x760 (panel 1328x548 at x=448, float card 520 wide
   overlapping just the panel padding so no chart content is covered),
   scaled to fit the stage. Chart + table styling reuses the asv- classes;
   asp- covers the spotlight layout (demos.css).
--------------------------------------------------------------------------- */
(function () {
  const root = document.getElementById("demo-dashboard-06b-sales-summary-spotlight");
  if (!root) return;

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const S = (d, w) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${w || 1.6}" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
  const I = {
    info: S('<circle cx="12" cy="12" r="8.5"/><path d="M12 11.2v5"/><path d="M12 7.6h.01"/>', 1.7),
    sliders: S('<path d="M4.5 7h15M4.5 12h15M4.5 17h15"/><circle cx="9.5" cy="7" r="1.9"/><circle cx="15" cy="12" r="1.9"/><circle cx="8" cy="17" r="1.9"/>'),
  };

  /* ---- the exact Figma chart vectors (frame 453:13243) ---- */
  const PLOT_W = 1163;
  const FIGMA_DAY_PATH = "M0 79.9963H101.544C114.716 75.697 156.067 67.6357 216.093 69.7854C276.119 71.9351 327.474 70.6811 345.649 69.7854C368.492 61.9034 419.981 46.1393 443.191 46.1393C466.401 46.1393 511.22 42.1982 530.728 40.2277L567.744 33.2413H857.869L1044.45 11.2072L1163 0.996311";
  const FIGMA_TOD_FILL = "M511 73H0V49.5L39.0765 68L73.6441 58.5L102.2 63L147.789 22.5L214.42 51.5L243.476 0L272.032 19.5L293.074 13L316.119 49L359.704 0L385.755 22L398.78 19.5L426.835 51.5L485.951 49L511 73Z";
  const FIGMA_TOD_STROKE = "M0.433112 50.4201L38.9331 68.9201L74.4331 59.4201L102.433 63.9201L148.433 23.4201L214.933 52.4201L243.933 1.42013L272.933 20.4201L293.433 13.9201L316.933 49.9201L359.433 1.42013L386.433 22.9201L398.933 20.4201L427.933 52.9201L486.433 50.4201L512.433 74.4201";
  const DOW = [590, 440, -190, 200, 350, 590, 200];
  const DATES = (() => {
    const months = [["May", 31], ["Jun", 30]];
    const out = [];
    let m = 0, d = 10;
    for (let i = 0; i < 41; i++) {
      out.push(`${months[m][0]} ${d}. 2025`);
      if (++d > months[m][1]) { d = 1; m++; }
    }
    return out;
  })();

  const gridRows = (labels, tops) => labels.map((l, i) => `
    <div class="asv-grow" style="top:${tops[i]}px">
      <span class="asv-glabel">${l}</span><span class="asv-gline"></span>
    </div>`).join("");

  /* ---- the 13 summary tables — same names and Golden Ember BBQ data as
     dashboard-06-sales-summary (kept in sync by hand; single source is the
     product screens, Figma nodes 134:13624 + 134:13616) ---- */
  const cell = (v, bold) => `<span class="asv-trv">${bold ? `<b>${v}</b>` : v}</span>`;
  const trow = (label, vals, info) => `
    <div class="asv-tr">
      <span class="asv-trlabel">${label}${info ? `<span class="asv-tinfo">${I.info}</span>` : ""}</span>
      <span class="asv-trvals">${vals.map((v) => cell(v)).join("")}</span>
    </div>`;
  const thead2 = (cols) => `
    <div class="asv-tr asv-tr-head">
      <span class="asv-trlabel">${cols[0]}</span>
      <span class="asv-trvals">${cols.slice(1).map(([t, inf]) => `<span class="asv-trv">${t}${inf ? `<span class="asv-tinfo">${I.info}</span>` : ""}</span>`).join("")}</span>
    </div>`;
  const ttotal = (label, vals) => `
    <div class="asv-tr asv-tr-total">
      <span class="asv-trlabel"><b>${label}</b></span>
      <span class="asv-trvals">${vals.map((v) => cell(v, 1)).join("")}</span>
    </div>`;
  const viewBtn = '<button class="asv-viewbtn">View Details</button>';
  const slidersBtn = `<button class="asv-ticon">${I.sliders}</button>`;

  const CARDS = [
    ["Revenue summary", "",
      trow("Net Sales", ["$13,486.50"], 1) +
      trow("Net Taxes", ["$1,092.41"], 1) +
      trow("Net Gratuity", ["$486.00"], 1) +
      trow("Tips", ["$1,975.25"]) +
      trow("Service Charges", ["$312.00"]) +
      trow("Delivery Fees", ["$164.80"], 1) +
      ttotal("Total amount", ["$17,516.96"])],
    ["Cash summary", "",
      thead2(["Cash flow", ["Amount"]]) +
      trow("Total Cash Payments", ["$1,482.90"]) +
      trow("Cash Refund", ["$36.50"]) +
      trow("Cash Before Tipout", ["$1,446.40"], 1) +
      trow("Paid In", ["$50.00"]) +
      trow("Paid Out", ["$128.75"]) +
      trow("Non Cash Tips", ["$212.40"], 1) +
      ttotal("Total Cash", ["$1,155.25"])],
    ["Net sales", "",
      trow("Gross Sales", ["$14,982.35"], 1) +
      trow("Promotion", ["$842.75"]) +
      trow("Points", ["$187.60"]) +
      trow("Sales Refund", ["$465.50"], 1) +
      ttotal("Net Sales", ["$13,486.50"])],
    ["Payment summary", viewBtn + slidersBtn,
      thead2(["Payment method", ["Payments"], ["Tips", 1], ["Auto Gratuity"], ["Total"]]) +
      trow("Card", ["$10,318.65", "$1,624.85", "$402.00", "$12,345.50"]) +
      trow("Cash", ["$1,482.90", "$212.40", "$32.00", "$1,727.30"]) +
      trow("Gift Card", ["$868.20", "$58.00", "$12.00", "$938.20"]) +
      trow("3rd Party", ["$1,238.75", "$80.00", "$40.00", "$1,358.75"]) +
      ttotal("Subtotal", ["$13,908.50", "$1,975.25", "$486.00", "$16,369.75"]) +
      '<div class="asv-tr asv-tr-gap"></div>' +
      trow("Deposit Sales Collected", ["$180.00"], 1) +
      ttotal("Total", ["$14,088.50", "$1,975.25", "$486.00", "$16,549.75"])],
    ["Dining type summary", "",
      thead2(["Dining type", ["Net Sales"], ["Orders"], ["Guests"]]) +
      trow("AYCE Dinner", ["$7,412.80", "132", "264"]) +
      trow("AYCE Lunch", ["$3,268.90", "86", "158"]) +
      trow("À la carte", ["$1,894.30", "71", "92"]) +
      trow("Happy Hour", ["$910.50", "34", "34"]) +
      ttotal("Total", ["$13,486.50", "323", "548"])],
    ["Service area summary", "",
      thead2(["Service area", ["Net Sales"], ["Orders"], ["Guests"]]) +
      trow("Main Dining", ["$8,652.35", "196", "342"]) +
      trow("Patio", ["$2,314.90", "58", "108"]) +
      trow("Bar Counter", ["$1,532.75", "47", "62"]) +
      trow("Private Room", ["$986.50", "22", "36"]) +
      ttotal("Total", ["$13,486.50", "323", "548"])],
    ["Gratuity summary", slidersBtn,
      thead2(["Gratuity type", ["Charged", 1], ["Refunded", 1], ["Net"]]) +
      trow("Auto Gratuity 18%", ["$342.00", "$18.00", "$324.00"]) +
      trow("Auto Gratuity 20%", ["$128.00", "$0.00", "$128.00"]) +
      trow("Manual Gratuity", ["$22.00", "$0.00", "$22.00"]) +
      trow("3rd Party Gratuity", ["$12.00", "$0.00", "$12.00"]) +
      ttotal("Total", ["$504.00", "$18.00", "$486.00"])],
    ["Service mode", "",
      thead2(["Metric", ["Quick Service"], ["Table Service"], ["Total"]]) +
      trow("Net Sales", ["$3,842.15", "$9,644.35", "$13,486.50"]) +
      trow("Total Guests", ["152", "396", "548"]) +
      trow("Avg/Guest", ["$25.28", "$24.35", "$24.61"]) +
      trow("Total Payments", ["118", "214", "332"]) +
      trow("Avg/Payment", ["$32.56", "$45.07", "$40.62"]) +
      trow("Total Orders", ["109", "214", "323"]) +
      trow("Avg/Order", ["$35.25", "$45.07", "$41.75"]) +
      trow("Turn Time", ["-", "52:24", "52:24"])],
    ["Tax summary", viewBtn,
      thead2(["Tax type", ["Taxable Sales"], ["Tax Collected"]]) +
      trow("Dine-in Sales Tax 8%", ["$10,743.30", "$859.46"]) +
      trow("Takeout Sales Tax 8%", ["$1,832.60", "$146.61"]) +
      trow("Liquor Tax 8.25%", ["$910.60", "$75.13"]) +
      trow("Packaging Fee 5%", ["$224.20", "$11.21"]) +
      ttotal("Total", ["$13,710.70", "$1,092.41"])],
    ["Void summary", viewBtn,
      thead2(["Type", ["Amount"], ["Amount %"], ["Volume"], ["Volume %"]]) +
      trow("Voided Items", ["$129.75", "0.87%", "11", "3.4%"]) +
      trow("Sales Refund", ["$465.50", "3.11%", "9", "2.8%"]) +
      trow("Comps", ["$86.20", "0.58%", "4", "1.2%"]) +
      ttotal("Total", ["$681.45", "4.55%", "24", "7.4%"])],
    ["Unclosed orders", viewBtn,
      trow("Unclosed Order", ["$268.40"], 1) +
      trow("Unclosed Order Volume", ["6"])],
    ["Discount summary", "",
      thead2(["Discount", ["Amount"], ["Count"]]) +
      trow("Happy Hour 20%", ["$228.40", "21"]) +
      trow("Loyalty Reward", ["$146.25", "13"]) +
      trow("Birthday Dessert", ["$89.50", "11"]) +
      trow("Employee Meal 50%", ["$86.10", "9"]) +
      trow("Manager Comp", ["$78.00", "4"]) +
      trow("Student 10%", ["$59.80", "8"]) +
      trow("Senior 10%", ["$47.35", "7"]) +
      trow("First Visit $5", ["$45.00", "9"]) +
      trow("Grand Opening Coupon", ["$32.50", "5"]) +
      trow("Damaged Dish Comp", ["$18.25", "2"]) +
      trow("Off-peak Combo", ["$11.60", "3"]) +
      ttotal("Total", ["$842.75", "92"])],
    ["Chains, sales summary", "",
      thead2(["Location", ["Net Sales"], ["Orders"], ["Guests"]]) +
      trow("#A62 — Downtown", ["$13,486.50", "323", "548"]) +
      trow("#A63 — Express", ["$9,842.20", "402", "402"]) +
      trow("#A64 — Riverside", ["$11,204.35", "287", "471"]) +
      trow("Web Store", ["$2,318.60", "96", "96"]) +
      ttotal("Total", ["$36,851.65", "1,108", "1,517"])],
  ];
  const cardHtml = ([title, act, body]) => `
    <div class="asv-thead">
      <span class="asv-ttitle">${title}</span>
      <span class="asv-tact">${act || ""}</span>
    </div>
    <div class="asv-trows">${body}</div>`;

  root.innerHTML = `
    <div class="demo-stage">
      <div class="asp">
        <section class="asp-panel">
          <h1 class="asv-h1">Sales Summary</h1>
          <p class="asv-sub">Settlement time 12:00 am &middot; May 10, 2025 - Jun 19, 2025</p>

          <div class="asp-chart1">
            <p class="asv-ctitle">Sales by day</p>
            <div class="asv-cgrid" data-daychart>
              ${gridRows(["$900", "$400", "$-100"], [0, 40, 80])}
              <svg class="asv-plot" viewBox="0 0 1163 81" preserveAspectRatio="none" style="left:68px;top:10px;width:1164px;height:81px">
                <path data-daypath d="${FIGMA_DAY_PATH}" stroke="#FF4D00" stroke-width="2" fill="none"/>
              </svg>
              <div class="asv-gx" style="left:68px;right:0">
                <span class="asv-xfirst">May 10</span><span>15</span><span>20</span><span>25</span><span>30</span><span>Jun 4</span><span>9</span><span>14</span><span>19</span>
              </div>
              <div class="asv-tip" data-tip>
                <span class="asv-tipdot"></span>
                <div class="asv-tipcard">
                  <p class="asv-tipdate" data-tip-date>May 30. 2025</p>
                  <div class="asv-tiprow"><span>Net sales</span><b data-tip-net>$417.00</b></div>
                  <div class="asv-tiprow"><span>Orders</span><b data-tip-orders>10</b></div>
                  <div class="asv-tiprow"><span>Guests</span><b data-tip-guests>17</b></div>
                </div>
              </div>
            </div>
          </div>

          <div class="asv-duo asp-duo">
            <div class="asv-half">
              <p class="asv-ctitle">Day of week</p>
              <div class="asv-cgrid">
                ${gridRows(["$600", "$0", "$-200"], [0, 60, 80])}
                <div data-dowbars>${DOW.map(() => '<span class="asv-bar"></span>').join("")}</div>
                <div class="asv-gx" style="left:84px;right:16px">${["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => `<span>${d}</span>`).join("")}</div>
              </div>
            </div>
            <div class="asv-half">
              <p class="asv-ctitle asv-ctitle-sm">Time of day</p>
              <div class="asv-cgrid">
                ${gridRows(["$900", "$400", "$-100"], [0, 40, 80])}
                <svg class="asv-plot" viewBox="0 0 512 75" preserveAspectRatio="none" style="left:68px;top:15px;width:512px;height:75px">
                  <path d="${FIGMA_TOD_FILL}" fill="#FF4D00" fill-opacity="0.05"/>
                  <path d="${FIGMA_TOD_STROKE}" stroke="#FF4D00" stroke-width="2" fill="none"/>
                </svg>
                <div class="asv-gx" style="left:68px;right:0"><span class="asv-xfirst">10 am</span><span>3 pm</span><span>10pm</span></div>
              </div>
            </div>
          </div>
        </section>

        <aside class="asp-float" data-float>${cardHtml(CARDS[0])}</aside>
      </div>
    </div>`;

  const $ = (sel) => root.querySelector(sel);
  const stage = $(".demo-stage");
  const device = $(".asp");

  /* scale the native 1600x760 composition to the stage width */
  const W = 1816, H = 640;
  const fit = () => {
    const s = stage.clientWidth / W;
    device.style.transform = `scale(${s})`;
    stage.style.height = `${Math.round(H * s)}px`;
  };
  new ResizeObserver(fit).observe(stage);
  fit();

  /* ---- day-of-week bars (same $ scale as dashboard-06) ---- */
  const BAR_X = [84, 157.33, 230.67, 304, 377.33, 450.67, 524];
  root.querySelectorAll("[data-dowbars] .asv-bar").forEach((bar, i) => {
    const v = DOW[i];
    const h = Math.abs(v) / 10;
    bar.style.left = `${BAR_X[i]}px`;
    bar.style.height = `${h}px`;
    bar.style.top = v >= 0 ? `${70 - h}px` : "71px";
    bar.classList.toggle("asv-bar-neg", v < 0);
  });

  /* ---- tooltip: rides the real path; the mouse takes over on hover ---- */
  const dayPath = $("[data-daypath]");
  const tip = $("[data-tip]");
  const samples = [];
  const len = dayPath.getTotalLength();
  for (let i = 0; i <= 240; i++) samples.push(dayPath.getPointAtLength((len * i) / 240));
  const money = (v) => (v < 0 ? `-$${Math.abs(Math.round(v))}.00` : `$${Math.round(v)}.00`);
  const showTipAt = (x) => {
    x = Math.max(0, Math.min(PLOT_W, x));
    let best = samples[0];
    for (const p of samples) if (Math.abs(p.x - x) < Math.abs(best.x - x)) best = p;
    const net = 900 - best.y * 12.5;
    $("[data-tip-date]").textContent = DATES[Math.round((best.x / PLOT_W) * 40)];
    $("[data-tip-net]").textContent = money(net);
    const orders = Math.max(1, Math.round(Math.max(net, 0) / 41.7));
    $("[data-tip-orders]").textContent = orders;
    $("[data-tip-guests]").textContent = Math.max(orders, Math.round(Math.max(net, 0) / 24.6));
    tip.style.left = `${68 + best.x}px`;
    tip.style.top = `${10 + best.y}px`;
    tip.classList.toggle("asv-tip-flip", best.x > PLOT_W - 240);
    tip.classList.add("on");
  };
  showTipAt(579); /* the design's resting tooltip: May 30 */

  let userOnChart = false;
  const dayChart = $("[data-daychart]");
  dayChart.addEventListener("mousemove", (e) => {
    userOnChart = true;
    const r = dayChart.getBoundingClientRect();
    showTipAt((e.clientX - r.left) / (r.width / dayChart.offsetWidth) - 68);
  });
  dayChart.addEventListener("mouseleave", () => { userOnChart = false; });

  /* ---- auto-play: rotate the floating card; glide the tooltip between ---- */
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  let onStage = true;
  new IntersectionObserver(([e]) => (onStage = e.isIntersecting), { threshold: 0.3 }).observe(stage);
  const waitOnStage = async () => { while (!onStage) await sleep(280); };

  const float = $("[data-float]");
  let floatHover = false;
  float.addEventListener("pointerenter", () => { floatHover = true; });
  float.addEventListener("pointerleave", () => { floatHover = false; });

  const placeFloat = () => {
    /* keep the card inside the canvas whatever its height */
    const h = float.offsetHeight;
    float.style.top = `${Math.min(170, Math.max(24, H - h - 20))}px`;
  };
  placeFloat();

  const glideTip = (ms, from, to) => new Promise((done) => {
    const t0 = performance.now();
    const ease = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
    const frame = (now) => {
      if (userOnChart) return done();
      const t = Math.min((now - t0) / ms, 1);
      showTipAt((from + (to - from) * ease(t)) * PLOT_W);
      t < 1 ? requestAnimationFrame(frame) : done();
    };
    requestAnimationFrame(frame);
  });

  const rotate = async () => {
    let i = 0;
    for (;;) {
      await waitOnStage();
      await sleep(3800);
      while (floatHover) await sleep(300); /* let the visitor finish reading */
      i = (i + 1) % CARDS.length;
      float.classList.add("asp-swap");
      await sleep(300);
      float.innerHTML = cardHtml(CARDS[i]);
      placeFloat();
      float.classList.remove("asp-swap");
    }
  };
  const stroll = async () => {
    for (;;) {
      await waitOnStage();
      await sleep(6500);
      if (!userOnChart) { showTipAt(0.12 * PLOT_W); await glideTip(2600, 0.12, 0.88); }
      await sleep(400);
      showTipAt(579); /* settle back on the design's resting point */
    }
  };
  if (!reduced) { rotate(); stroll(); }
})();
