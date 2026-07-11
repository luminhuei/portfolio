/* ---------------------------------------------------------------------------
   dashboard-07-order-transaction — Order Details ⇄ Transaction Details,
   rebuilt from Figma frames 467:15607 / 467:16822 with the navigation
   chrome deliberately removed: pure report content, switched by the
   product's own tabs. Native 1520x1120, scaled to fit the stage.
   Fake data: Golden Ember BBQ, store #A62, business day Jul 10, 2026.
--------------------------------------------------------------------------- */
(function () {
  const root = document.getElementById("demo-dashboard-07-order-transaction");
  if (!root) return;

  const S = (d, w) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${w || 1.7}" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
  const I = {
    chev: S('<path d="M6.5 9.75l5.5 5.5 5.5-5.5"/>', 1.8),
    search: S('<circle cx="11" cy="11" r="6.2"/><path d="M15.7 15.7L20.5 20.5"/>'),
    warn: S('<path d="M12 3.5L1.8 20.5h20.4z"/><path d="M12 10v5"/><path d="M12 17.6h.01"/>'),
    x: S('<path d="M6 6l12 12M18 6L6 18"/>'),
    plus: S('<path d="M12 5.5v13M5.5 12h13"/>', 2),
    filter: S('<path d="M4 5.5h16l-6.2 7.2v5.2L10.2 20v-7.3z"/>'),
    columns: S('<rect x="3.5" y="4.5" width="17" height="15" rx="2"/><path d="M9.5 4.5v15M14.5 4.5v15"/>'),
    export_: S('<path d="M12 15V4"/><path d="M7.5 8.5L12 4l4.5 4.5"/><path d="M4.5 15v3.5a1.5 1.5 0 001.5 1.5h12a1.5 1.5 0 001.5-1.5V15"/>'),
    check: S('<circle cx="12" cy="12" r="8.5"/><path d="M8.5 12.2l2.4 2.4 4.6-4.8"/>'),
    refresh: S('<path d="M4.5 12a7.5 7.5 0 0113-5.2L20 9"/><path d="M20 4.5V9h-4.5"/><path d="M19.5 12a7.5 7.5 0 01-13 5.2L4 15"/><path d="M4 19.5V15h4.5"/>', 1.6),
    half: S('<circle cx="12" cy="12" r="8.5"/><path d="M12 3.5v17A8.5 8.5 0 0012 3.5z" fill="currentColor" stroke="none"/>'),
    first: S('<path d="M11 6l-6 6 6 6M19 6l-6 6 6 6"/>', 1.8),
    prev: S('<path d="M15 6l-6 6 6 6"/>', 1.8),
    next: S('<path d="M9 6l6 6-6 6"/>', 1.8),
    last: S('<path d="M13 6l6 6-6 6M5 6l6 6-6 6"/>', 1.8),
  };

  const chip = (kind, label) => {
    const ic = kind === "paid" ? I.check : kind === "refund" ? I.refresh : I.half;
    return `<span class="odv-chip odv-chip-${kind}"><span class="odv-ic14">${ic}</span>${label}</span>`;
  };

  /* ---- Order Details rows: one evening at Golden Ember BBQ ---- */
  const ORDER_COLS = ["Seq #", "Order #", "Order opened", "Payment status", "Channel", "Server", "Subtotal", "Promotion", "Tax", "Total"];
  const ORDER_ROWS = [
    ["1", "20260710-041", "07/10/2026 06:12 pm", chip("paid", "Paid"), "POS", "Maya R.", "$186.40", "-$18.00", "$15.85", "$184.25"],
    ["2", "20260710-042", "07/10/2026 06:18 pm", chip("paid", "Paid"), "App", "Jordan K.", "$92.70", "$0.00", "$7.88", "$100.58"],
    ["3", "20260710-043", "07/10/2026 06:24 pm", chip("partial", "Partial refund"), "POS", "Alex T.", "$148.00", "$0.00", "$12.58", "$135.20"],
    ["4", "20260710-044", "07/10/2026 06:31 pm", chip("paid", "Paid"), "Kiosk", "&mdash;", "$64.90", "-$6.50", "$5.52", "$63.92"],
    ["5", "20260710-045", "07/10/2026 06:37 pm", chip("refund", "Refund"), "App", "Sam W.", "$58.20", "$0.00", "$4.95", "$0.00"],
    ["6", "20260710-046", "07/10/2026 06:45 pm", chip("paid", "Paid"), "Web", "Rio P.", "$112.35", "$0.00", "$9.55", "$121.90"],
    ["7", "20260710-047", "07/10/2026 06:52 pm", chip("paid", "Paid"), "POS", "Maya R.", "$203.15", "-$20.00", "$17.27", "$200.42"],
    ["8", "20260710-048", "07/10/2026 07:03 pm", chip("paid", "Paid"), "POS", "Jordan K.", "$77.60", "$0.00", "$6.60", "$84.20"],
  ];

  /* ---- Transaction Details rows, by subtype — the fee chain in one row ---- */
  const TXN_COLS = ["Transaction date", "Order #", "Type", "Payment method", "Description", "Amount", "Tip", "Auto gratuity", "Transaction fee", "Net total"];
  const TXN_ROWS = {
    "Payment": [
      ["07/10/2026 06:15 pm", "20260710-041", "Payment", "Credit card", "Order #20260710-041", "$184.25", "$27.60", "$9.32", "-$5.62", "$215.55"],
      ["07/10/2026 06:21 pm", "20260710-042", "Payment", "Apple Pay", "Order #20260710-042", "$100.58", "$15.00", "$0.00", "-$3.24", "$112.34"],
      ["07/10/2026 06:34 pm", "20260710-044", "Payment", "Credit card", "Order #20260710-044", "$63.92", "$9.60", "$0.00", "-$2.07", "$71.45"],
      ["07/10/2026 06:49 pm", "20260710-046", "Payment", "Credit card", "Order #20260710-046", "$121.90", "$18.30", "$6.10", "-$4.11", "$142.19"],
      ["07/10/2026 06:57 pm", "20260710-047", "Payment", "Gift card", "Order #20260710-047", "$200.42", "$30.00", "$10.02", "$0.00", "$240.44"],
    ],
    "Refund": [
      ["07/10/2026 07:41 pm", "20260710-045", "Refund", "Apple Pay", "Full refund &mdash; order cancelled", "-$58.20", "$0.00", "$0.00", "$1.87", "-$56.33"],
      ["07/10/2026 08:02 pm", "20260710-043", "Refund", "Credit card", "Partial refund &mdash; 86&rsquo;d item", "-$12.80", "$0.00", "$0.00", "$0.41", "-$12.39"],
    ],
    "Adjust fee": [
      ["07/10/2026 09:15 pm", "20260710-039", "Adjust fee", "Credit card", "Dispute adjustment", "$0.00", "$0.00", "$0.00", "-$15.00", "-$15.00"],
    ],
    "Other": [
      ["07/10/2026 10:05 pm", "&mdash;", "Other", "Cash", "Cash drawer adjustment", "$2.40", "$0.00", "$0.00", "$0.00", "$2.40"],
    ],
  };
  const TXN_TOTALS = { "Payment": 84, "Refund": 8, "Adjust fee": 3, "Other": 1 };

  const table = (cols, rows, orderLinkCol) => `
    <div class="odv-tablewrap">
      <table class="odv-table">
        <thead><tr>${cols.map((c) => `<th>${c}</th>`).join("")}</tr></thead>
        <tbody>
          ${rows.map((r) => `<tr>${r.map((cell, i) =>
            `<td>${i === orderLinkCol && cell !== "&mdash;" ? `<span class="odv-link">${cell}</span>` : cell}</td>`).join("")}</tr>`).join("")}
        </tbody>
      </table>
    </div>`;

  const banner = `
    <div class="odv-banner">
      <span class="odv-ic20">${I.warn}</span>
      <p>Data is not syncing in real time. Changes made after 5:00 am on Jul 10, may not be reflected in yesterday&rsquo;s data.</p>
      <button class="odv-bannerx" aria-label="Dismiss">${I.x}</button>
    </div>`;

  const footer = (total, pages) => `
    <div class="odv-foot">
      <span class="odv-total">Total ${total}</span>
      <div class="odv-pager">
        <span>Rows per page</span>
        <button class="odv-pagesize">10<span class="odv-ic12">${I.chev}</span></button>
        <span class="odv-pageno">Page 1 of ${pages}</span>
        <button class="odv-pagebtn">${I.first}</button>
        <button class="odv-pagebtn">${I.prev}</button>
        <button class="odv-pagebtn">${I.next}</button>
        <button class="odv-pagebtn">${I.last}</button>
      </div>
    </div>`;

  const filterChips = `
    <div class="odv-chips">
      <span class="odv-fchip odv-fchip-set">Employee<span class="odv-fchipval">Server</span><span class="odv-ic12">${I.x}</span></span>
      ${["Payment status", "Dining type", "Channel", "Split payment", "Payment method", "Apply promotion", "Tax exempt"]
        .map((c) => `<span class="odv-fchip"><span class="odv-ic14">${I.plus}</span>${c}</span>`).join("")}
    </div>`;

  root.innerHTML = `
    <div class="demo-stage">
      <div class="odv">
        <div class="odv-filters">
          <button class="odv-btn">Today<span class="odv-ic12">${I.chev}</span></button>
          <button class="odv-btn">Custom hours<span class="odv-ic12">${I.chev}</span></button>
          <button class="odv-searchbtn" aria-label="Search">${I.search}</button>
        </div>
        <div class="odv-tabs">
          <button class="odv-tab on" data-view="order">Order details</button>
          <button class="odv-tab" data-view="txn">Transaction details</button>
        </div>

        <section class="odv-view on" data-view="order">
          <h2 class="odv-h2">Order Details</h2>
          <p class="odv-note">This report does not include any third-party data from integration or manual entry on the POS</p>
          ${banner}
          <div class="odv-segrow">
            <div class="odv-seg" data-seg>
              <button class="odv-segbtn on">Standard</button>
              <button class="odv-segbtn">Group buy</button>
              <button class="odv-segbtn">No show fee</button>
            </div>
            <div class="odv-actions">
              <button class="odv-btn"><span class="odv-ic16">${I.filter}</span>Filter</button>
              <button class="odv-btn"><span class="odv-ic16">${I.columns}</span>Display columns</button>
              <button class="odv-export"><span class="odv-ic16">${I.export_}</span>Export</button>
            </div>
          </div>
          ${filterChips}
          ${table(ORDER_COLS, ORDER_ROWS, 1)}
          ${footer(128, 16)}
        </section>

        <section class="odv-view" data-view="txn">
          <h2 class="odv-h2">Transaction Details</h2>
          <p class="odv-note">This report does not include any third-party data from integration or manual entry on the POS</p>
          ${banner}
          <div class="odv-segrow">
            <div class="odv-seg" data-txnseg>
              ${Object.keys(TXN_ROWS).map((k, i) => `<button class="odv-segbtn${i === 0 ? " on" : ""}" data-subtype="${k}">${k}</button>`).join("")}
            </div>
            <div class="odv-actions">
              <button class="odv-export"><span class="odv-ic16">${I.export_}</span>Export</button>
            </div>
          </div>
          ${Object.keys(TXN_ROWS).map((k, i) => `
          <div class="odv-txnpanel${i === 0 ? " on" : ""}" data-panel="${k}">
            ${table(TXN_COLS, TXN_ROWS[k], 1)}
            ${footer(TXN_TOTALS[k], Math.max(1, Math.ceil(TXN_TOTALS[k] / 10)))}
          </div>`).join("")}
        </section>
      </div>
    </div>`;

  const stage = root.querySelector(".demo-stage");
  const device = root.querySelector(".odv");

  /* scale the native 1520x1120 panel to the stage width */
  const W = 1520, H = 1120;
  const fit = () => {
    const s = stage.clientWidth / W;
    device.style.transform = `scale(${s})`;
    stage.style.height = `${Math.round(H * s)}px`;
  };
  new ResizeObserver(fit).observe(stage);
  fit();

  /* ---- interactions: view switch, subtype tabs, seg pills, banner ---- */
  root.querySelectorAll(".odv-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      root.querySelectorAll(".odv-tab").forEach((t) => t.classList.toggle("on", t === tab));
      root.querySelectorAll(".odv-view").forEach((v) => v.classList.toggle("on", v.dataset.view === tab.dataset.view));
    });
  });
  root.querySelectorAll("[data-txnseg] .odv-segbtn").forEach((btn) => {
    btn.addEventListener("click", () => {
      btn.closest("[data-txnseg]").querySelectorAll(".odv-segbtn").forEach((b) => b.classList.toggle("on", b === btn));
      root.querySelectorAll(".odv-txnpanel").forEach((p) => p.classList.toggle("on", p.dataset.panel === btn.dataset.subtype));
    });
  });
  root.querySelectorAll("[data-seg] .odv-segbtn").forEach((btn) => {
    btn.addEventListener("click", () => {
      btn.closest("[data-seg]").querySelectorAll(".odv-segbtn").forEach((b) => b.classList.toggle("on", b === btn));
    });
  });
  root.querySelectorAll(".odv-bannerx").forEach((x) => {
    x.addEventListener("click", () => root.querySelectorAll(".odv-banner").forEach((b) => (b.style.display = "none")));
  });
})();
