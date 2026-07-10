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

  /* icons — Phosphor-style strokes, 24 viewBox, currentColor */
  const S = (d, w) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${w || 1.6}" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
  const I = {
    circle: S('<circle cx="12" cy="12" r="8.2"/>'),
    chev: S('<path d="M6.5 9.75l5.5 5.5 5.5-5.5"/>', 1.8),
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

  /* primary rail: 16 pattern items — first is the current page, one carries Beta */
  const railItem = (i) => {
    const on = i === 0;
    const badge = i === 0 ? "New" : i === 12 ? "Beta" : "";
    return `
      <div class="adv-item${on ? " adv-on" : ""}${i === 1 ? " adv-parent" : ""}">
        <span class="adv-ic20">${I.circle}</span>
        <span class="adv-itemlabel">Navigation</span>
        ${badge ? `<span class="adv-badge${badge === "New" ? " adv-badge-new" : ""}">${badge}</span>` : ""}
        <span class="adv-ic16 adv-chev">${I.chev}</span>
      </div>
      ${i === 1 ? `
      <div class="adv-acc">
        <div class="adv-accwrap">
          ${[0, 1, 2, 3, 4, 5, 6].map((k) => `<div class="adv-subitem${k === 1 ? " adv-subon" : ""}">Nav dropdown</div>`).join("")}
        </div>
      </div>` : ""}`;
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
            ${Array.from({ length: 16 }, (_, i) => railItem(i)).join("")}
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
            <div class="adv-item2 adv-parent2"><span class="adv-itemlabel">Navigation</span><span class="adv-ic16 adv-chev-up">${I.chev}</span></div>
            <div class="adv-sub2">
              <div class="adv-sub2wrap">
                <div class="adv-subitem2 adv-sub2on">Navigation</div>
                <div class="adv-subitem2">Navigation</div>
                <div class="adv-subitem2">Navigation</div>
              </div>
            </div>
          </div>
          <div class="adv-r2foot">
            <div class="adv-item2"><span class="adv-itemlabel">Navigation</span><span class="adv-ic16 adv-chev">${I.chev}</span></div>
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
