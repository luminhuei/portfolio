/* ---------------------------------------------------------------------------
   dashboard-04-sales-overview — Analytics Dashboard shell, rebuilt 1:1 from
   the Peblla shadcn/ui system frames 119:1178 (second rail expanded) and
   123:2023 (second rail collapsed, sub-nav folds into the primary rail as an
   accordion). Native 1508x1117, scaled to fit the stage.
   Content area intentionally empty — the Sales Overview screen lands later.
--------------------------------------------------------------------------- */
(function () {
  const root = document.getElementById("demo-dashboard-04-sales-overview");
  if (!root) return;

  const zh = (document.documentElement.lang || "").startsWith("zh");
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const T = {
    hint: reduced
      ? (zh ? "可互動 — 點按鈕收合側欄" : "Interactive — toggle the sub-nav")
      : (zh ? "自動播放 — 第二側欄收合與展開" : "Auto-plays — the sub-nav tucks away"),
  };

  /* icons — top bar keeps Phosphor-style strokes; the nav items use Feather
     equivalents as requested. All 24 viewBox, currentColor. */
  const S = (d, w) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${w || 1.6}" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
  const I = {
    chev: S('<path d="M6.5 9.75l5.5 5.5 5.5-5.5"/>', 1.8),
    /* Feather icons for the primary rail */
    fileText: S('<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M16 13H8M16 17H8M10 9H8"/>', 1.7),
    barChart: S('<path d="M18 20V10M12 20V4M6 20v-6"/>', 1.7),
    pieChart: S('<path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/>', 1.7),
    percent: S('<path d="M19 5L5 19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/>', 1.7),
    list: S('<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>', 1.7),
    cart: S('<circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>', 1.7),
    member: S('<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>', 1.7),
    zap: S('<path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>', 1.7),
    grid: S('<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>', 1.7),
    usersGroup: S('<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>', 1.7),
    layout: S('<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>', 1.7),
    star: S('<path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14l-5-4.87 6.91-1.01z"/>', 1.7),
    gear: S('<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>', 1.7),
    monitor: S('<rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>', 1.7),
    clipboard: S('<path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/>', 1.7),
    outdent: S('<path d="M11 5.75h8.5M11 12h8.5M4.5 18.25h15"/><path d="M7.5 8.5L4 12l3.5 3.5"/>'),
    indent: S('<path d="M11 5.75h8.5M11 12h8.5M4.5 18.25h15"/><path d="M4.5 8.5L8 12l-3.5 3.5"/>'),
    search: S('<circle cx="11" cy="11" r="6.2"/><path d="M15.7 15.7L20.5 20.5"/>'),
    globe: S('<circle cx="12" cy="12" r="8.2"/><ellipse cx="12" cy="12" rx="3.6" ry="8.2"/><path d="M3.8 12h16.4"/>'),
    buildings: S('<path d="M3.5 20.5v-13l6.5-3v16"/><path d="M10 20.5h10.5V9.8L15 7.2v13.3"/><path d="M2.5 20.5h19"/>'),
    store: S('<path d="M4.6 10.6v9.9h14.8v-9.9"/><path d="M3.5 6.8l1.6-3.3h13.8l1.6 3.3c0 1.6-1.3 2.9-2.9 2.9-1.2 0-2.3-.8-2.7-1.9-.4 1.1-1.5 1.9-2.9 1.9s-2.5-.8-2.9-1.9c-.4 1.1-1.5 1.9-2.7 1.9-1.6 0-2.9-1.3-2.9-2.9z"/>'),
    headset: S('<path d="M4.5 14v-2a7.5 7.5 0 0115 0v2"/><rect x="3.5" y="13.2" width="4.2" height="6" rx="2.1"/><rect x="16.3" y="13.2" width="4.2" height="6" rx="2.1"/><path d="M19.5 19.2v.3a3 3 0 01-3 3h-3.2"/>'),
    user: S('<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="10" r="3"/><path d="M6.6 18.4c1.2-2.1 3.1-3.3 5.4-3.3s4.2 1.2 5.4 3.3"/>'),
    mail: S('<rect x="3.5" y="5.5" width="17" height="13" rx="1.5"/><path d="M4.5 7.5l7.5 5.5 7.5-5.5"/>'),
  };

  /* primary rail — the real Peblla store-admin menu; Report Center is the
     current page and hosts the sub-nav accordion when the second rail is
     collapsed */
  const NAV1 = [
    ["fileText", "Report Center", "New"],
    ["barChart", "Report"],
    ["pieChart", "Analytics"],
    ["percent", "Promotions"],
    ["list", "Menu"],
    ["cart", "Order"],
    ["member", "Member"],
    ["zap", "Integration"],
    ["grid", "Management"],
    ["usersGroup", "Group Buy"],
    ["layout", "Table Service"],
    ["star", "Reputation", "Beta"],
    ["gear", "Settings"],
    ["monitor", "Devices"],
    ["clipboard", "Store Account"],
  ];
  const SUBNAV = [
    ["Sales", ["Sales Overview", "Sales Summary", "Order Details"]],
    ["Transactions", ["Transaction Details"]],
    ["Reconciliation", ["Payment Reconciliation", "Payout Reconciliation"]],
  ];

  /* the sub-nav lives ONLY in the second rail — collapsing it never unfolds
     anything inside the gray primary rail */
  const railItem = ([icon, label, badge], i) => {
    const on = i === 0; // Report Center — the page we're on
    return `
      <div class="adv-item${on ? " adv-on" : ""}">
        <span class="adv-ic20">${I[icon]}</span>
        <span class="adv-itemlabel">${label}</span>
        ${badge ? `<span class="adv-badge${badge === "New" ? " adv-badge-new" : ""}">${badge}</span>` : ""}
        <span class="adv-ic16 adv-chev">${I.chev}</span>
      </div>`;
  };

  const TOPNAV = [
    [I.search, "Search"],
    [I.globe, "America / New York"],
    [I.buildings, "Organization"],
    [I.store, "Store"],
    [I.headset, "Support"],
    [I.user, "Account"],
    [I.mail, "Inbox"],
  ];

  root.innerHTML = `
    <div class="demo-stage">
      <div class="adv">
        <aside class="adv-rail1">
          <div class="adv-r1head">
            <span class="adv-logo"><span class="adv-logomark"></span>peblla</span>
          </div>
          <div class="adv-r1menu">
            <div class="adv-r1tools">
              <button class="adv-iconbtn adv-r1toggle" aria-label="Collapse navigation">${I.outdent}</button>
              <span class="adv-storechip">Store</span>
            </div>
            ${NAV1.map(railItem).join("")}
          </div>
          <div class="adv-r1foot"><div class="adv-item adv-version">version 5.53.0</div></div>
        </aside>

        <header class="adv-top">
          <div class="adv-crumbs">
            <span class="adv-crumb adv-crumb-on">Report center</span>
            <span class="adv-crumb">/</span>
            <span class="adv-crumb">Sales overview</span>
          </div>
          <nav class="adv-topnav">
            ${TOPNAV.map(([ic, label]) => `<span class="adv-topitem"><span class="adv-ic20">${ic}</span>${label}<span class="adv-ic12">${I.chev}</span></span>`).join("")}
          </nav>
        </header>

        <aside class="adv-rail2">
          <div class="adv-r2top">
            <button class="adv-iconbtn adv-r2toggle" aria-label="Collapse sub-navigation">${I.outdent}</button>
            ${SUBNAV.map(([group, kids]) => `
            <div class="adv-item2 adv-parent2"><span class="adv-itemlabel">${group}</span><span class="adv-ic16 adv-chev-up">${I.chev}</span></div>
            <div class="adv-sub2">
              <div class="adv-sub2wrap">
                ${kids.map((label) => `<div class="adv-subitem2${label === "Sales Overview" ? " adv-sub2on" : ""}">${label}</div>`).join("")}
              </div>
            </div>`).join("")}
          </div>
        </aside>

        <button class="adv-iconbtn adv-expandbtn" aria-label="Expand sub-navigation">${I.indent}</button>
        <main class="adv-content"></main>
      </div>
    </div>
    <span class="demo-hint">${T.hint}</span>`;

  const stage = root.querySelector(".demo-stage");
  const device = root.querySelector(".adv");

  /* scale the native 1508x1117 canvas to the stage width */
  const W = 1508, H = 1117;
  const fit = () => {
    const s = stage.clientWidth / W;
    device.style.transform = `scale(${s})`;
    stage.style.height = `${Math.round(H * s)}px`;
  };
  new ResizeObserver(fit).observe(stage);
  fit();

  /* ---- collapse / expand: the second rail slides away and the sub-nav
     folds into the primary rail as an accordion ---- */
  const setCollapsed = (on) => device.classList.toggle("adv-collapsed", on);
  const isCollapsed = () => device.classList.contains("adv-collapsed");

  root.querySelector(".adv-r2toggle").addEventListener("click", () => setCollapsed(true));
  root.querySelector(".adv-expandbtn").addEventListener("click", () => setCollapsed(false));
  root.querySelector(".adv-r1toggle").addEventListener("click", () => setCollapsed(!isCollapsed()));

  /* ---- auto-play: tuck the sub-nav away, bring it back, forever ---- */
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  let onStage = true;
  new IntersectionObserver(([e]) => (onStage = e.isIntersecting), { threshold: 0.3 }).observe(stage);
  const waitOnStage = async () => {
    while (!onStage) await sleep(280);
  };

  const pressBtn = async (btn) => {
    btn.classList.add("adv-press");
    await sleep(220);
    btn.classList.remove("adv-press");
    await sleep(140);
  };

  const cycle = async () => {
    for (;;) {
      await waitOnStage();
      await sleep(3000);
      if (!isCollapsed()) {
        await pressBtn(root.querySelector(".adv-r2toggle"));
        setCollapsed(true);
      }
      await waitOnStage();
      await sleep(3000);
      if (isCollapsed()) {
        await pressBtn(root.querySelector(".adv-expandbtn"));
        setCollapsed(false);
      }
    }
  };
  if (!reduced) cycle();
})();
