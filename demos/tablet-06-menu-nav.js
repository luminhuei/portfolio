/* ---------------------------------------------------------------------------
   tablet-06-menu-nav — the shared Ordering-Tablet mockup used by BOTH
   Decision one (navigation) and Decision two (tier lock). One device, driven
   by data-focus on the container:
     data-focus="nav"  → auto-plays the navigation story: switch dining mode
                         (Hot Pot / BBQ / Sushi …) → the left side-nav swaps to
                         that mode's sub-categories → toggle 3-vs-4-per-row.
     data-focus="tier" → auto-plays the tier story: higher-tier dishes greyed
                         with a lock badge → "unlock" → colours return.

   Corrects the real product's information architecture: the TOP bar carries
   the major dining modes (mixed-format AYCE venues offer several), and the
   LEFT side-nav carries that mode's sub-categories. Native 1194x834, scaled
   to fit. Adapted from tablet-05-tier-unlock.js (kept as a backup).
--------------------------------------------------------------------------- */
(function () {
  const roots = document.querySelectorAll("[id^='demo-tablet-06-menu-nav']");
  if (!roots.length) return;

  const zh = (document.documentElement.lang || "").startsWith("zh");
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const I = {
    kiosk: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="11" rx="1.5"/><path d="M12 15v3M8.5 21h7M9 18h6"/></svg>',
    user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="3.6"/><path d="M5.5 20c1-3.4 3.5-5 6.5-5s5.5 1.6 6.5 5"/></svg>',
    bell: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 10a6 6 0 0 1 12 0c0 4 1.5 5.5 1.5 5.5h-15S6 14 6 10z"/><path d="M10 19a2.2 2.2 0 0 0 4 0"/></svg>',
    receipt: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6.5 3.5h11V20l-1.83-1.2-1.84 1.2-1.83-1.2-1.83 1.2-1.84-1.2-1.83 1.2z"/><path d="M9.5 8.5h5M9.5 12h5"/></svg>',
    clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/></svg>',
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/></svg>',
    chevron: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.5 6l6 6-6 6"/></svg>',
    plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M12 5.5v13M5.5 12h13"/></svg>',
    minus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M5.5 12h13"/></svg>',
    lock: '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="10.5" width="14" height="9.5" rx="2"/><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3"/></svg>',
    grid3: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="3" y="4.5" width="4.5" height="15" rx="1"/><rect x="9.75" y="4.5" width="4.5" height="15" rx="1"/><rect x="16.5" y="4.5" width="4.5" height="15" rx="1"/></svg>',
    grid4: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="3" y="5" width="3.4" height="14" rx="1"/><rect x="8.2" y="5" width="3.4" height="14" rx="1"/><rect x="13.4" y="5" width="3.4" height="14" rx="1"/><rect x="18.6" y="5" width="2.4" height="14" rx="1"/></svg>',
  };

  /* ---- menu data: dining modes → sub-categories → dishes.
     tier: 0 = included, 1 = paid upgrade (greys out under tier focus). ---- */
  const MODES = [
    { key: "hotpot", name: "Hot Pot",
      subs: ["All", "Broths", "Beef", "Seafood", "Veggies", "Noodles"],
      dishes: [
        ["Mala Spicy Broth", "SIGNATURE", "Broths", 0], ["Pork Bone Broth", "", "Broths", 0],
        ["Sliced Ribeye", "TOP PICK", "Beef", 0], ["Fatty Beef Roll", "", "Beef", 0],
        ["Shrimp Paste", "", "Seafood", 0], ["Fish Tofu", "NEW", "Seafood", 0],
        ["Napa & Enoki Set", "", "Veggies", 0], ["Handmade Udon", "", "Noodles", 0],
        ["Wagyu Shabu Set", "PREMIUM", "Beef", 1], ["King Crab Legs", "PREMIUM", "Seafood", 1],
      ] },
    { key: "bbq", name: "BBQ",
      subs: ["All", "Beef", "Pork", "Chicken", "Seafood", "Veggies"],
      dishes: [
        ["Marinated Short Rib", "COMBO", "Beef", 0], ["Beef Brisket Slices", "", "Beef", 0],
        ["Pork Belly Samgyeopsal", "", "Pork", 0], ["Spicy Chicken Bulgogi", "ORDERED", "Chicken", 0],
        ["Garlic Shrimp Skewers", "TOP PICK", "Seafood", 0], ["Seasonal Veggie Platter", "NEW", "Veggies", 0],
        ["Prime Ribeye", "PREMIUM", "Beef", 1], ["A5 Wagyu Striploin", "WAGYU", "Beef", 1],
        ["Beef Tongue & Scallion", "PREMIUM", "Beef", 1], ["Herb Lamb Chops", "PREMIUM", "Pork", 1],
      ] },
    { key: "sushi", name: "Sushi",
      subs: ["All", "Nigiri", "Roll", "Sashimi", "Tempura"],
      dishes: [
        ["Salmon Nigiri", "TOP PICK", "Nigiri", 0], ["Tuna Nigiri", "", "Nigiri", 0],
        ["Spicy Tuna Roll", "", "Roll", 0], ["Dragon Roll", "SIGNATURE", "Roll", 0],
        ["Salmon Sashimi", "", "Sashimi", 0], ["Shrimp Tempura", "NEW", "Tempura", 0],
        ["Uni & Toro Set", "PREMIUM", "Sashimi", 1], ["Seared Wagyu Nigiri", "WAGYU", "Nigiri", 1],
      ] },
    { key: "drinks", name: "Drinks",
      subs: ["All", "Soft", "Tea", "Beer & Sake"],
      dishes: [
        ["Iced Barley Tea", "", "Tea", 0], ["Yuzu Soda", "NEW", "Soft", 0],
        ["Peach Green Tea", "", "Tea", 0], ["Draft Beer", "", "Beer & Sake", 0],
        ["Junmai Sake", "PREMIUM", "Beer & Sake", 1],
      ] },
    { key: "dessert", name: "Desserts",
      subs: ["All", "Cake", "Ice Cream", "Fruit"],
      dishes: [
        ["Matcha Lava Cake", "NEW", "Cake", 0], ["Black Sesame Ice Cream", "", "Ice Cream", 0],
        ["Mango Mochi", "", "Cake", 0], ["Seasonal Fruit Plate", "", "Fruit", 0],
      ] },
  ];

  const dishCard = (d) => {
    const [name, tag, , tier] = d;
    return `<div class="mnv-card${tier ? " mnv-t2" : ""}" data-sub="${d[2]}">
      <div class="mnv-media"><div class="mnv-img"></div><span class="mnv-lock">${I.lock}</span><button class="mnv-add" aria-label="Add ${name}">${I.plus}</button></div>
      <div class="mnv-txt"><p class="mnv-name">${name}</p>${tag ? `<span class="mnv-tag">${tag}</span>` : `<span class="mnv-tag" style="visibility:hidden">·</span>`}</div>
    </div>`;
  };

  function build(root) {
    const focus = root.dataset.focus || "nav";
    const active = focus === "tier" ? "bbq" : "bbq"; // both open on BBQ
    const modeTabs = MODES.map((m) => `<button class="mnv-mode${m.key === active ? " on" : ""}" data-mode="${m.key}">${m.name}</button>`).join("");

    root.innerHTML = `
      <div class="demo-stage"><div class="mnv" data-focus="${focus}">
        <div class="mnv-top">
          <div class="mnv-logo"><span class="mnv-logodot"></span></div>
          <div class="mnv-pills">
            <span class="mnv-pill">${I.kiosk}#A62</span>
            <span class="mnv-pill">${I.user}Login</span>
            <span class="mnv-pill">${I.receipt}My Order</span>
            <span class="mnv-pill">${I.bell}Check</span>
            <span class="mnv-pill mnv-outlined">${I.clock}<span class="mnv-timer">2:00:00</span></span>
            <span class="mnv-iconbtn">${I.search}</span>
          </div>
        </div>
        <div class="mnv-modebar">${modeTabs}</div>
        <div class="mnv-body">
          <nav class="mnv-side"></nav>
          <div class="mnv-main">
            <div class="mnv-mainhead">
              <p class="mnv-crumb"></p>
              <div class="mnv-density" role="group" aria-label="Layout density">
                <button class="mnv-dbtn on" data-cols="3">${I.grid3}</button>
                <button class="mnv-dbtn" data-cols="4">${I.grid4}</button>
              </div>
            </div>
            ${focus === "tier" ? `<div class="mnv-unlockbar"><span class="mnv-unlocktxt"></span><button class="mnv-unlockbtn">${zh ? "解鎖" : "Unlock"} ${I.chevron}</button></div>` : ""}
            <div class="mnv-scroll"><div class="mnv-grid" data-cols="3"></div></div>
          </div>
          <aside class="mnv-cart">
            <div class="mnv-cartcard">
              <div class="mnv-carthead"><b>Shopping Cart (<span class="mnv-count">2</span>)</b><span class="mnv-clear">Clear</span></div>
              <div class="mnv-cartscroll">
                <div class="mnv-citem"><span class="mnv-thumb"></span><div class="mnv-cibody"><p class="mnv-ciname">Marinated Short Rib</p><span class="mnv-stepper"><button class="mnv-step">${I.minus}</button><span class="mnv-qty">1</span><button class="mnv-step">${I.plus}</button></span></div></div>
                <div class="mnv-citem"><span class="mnv-thumb"></span><div class="mnv-cibody"><p class="mnv-ciname">Pork Belly Samgyeopsal</p><span class="mnv-stepper"><button class="mnv-step">${I.minus}</button><span class="mnv-qty">2</span><button class="mnv-step">${I.plus}</button></span></div></div>
              </div>
              <div class="mnv-cartfoot"><button class="mnv-submit">Submit</button></div>
            </div>
          </aside>
        </div>
      </div></div>
      <span class="demo-hint">${reduced ? (zh ? "可互動" : "Interactive") : (focus === "tier" ? (zh ? "自動播放 — Tier 解鎖" : "Auto-plays — tier unlock") : (zh ? "自動播放 — 切換餐飲模式與版面" : "Auto-plays — modes & density"))}</span>`;

    const stage = root.querySelector(".demo-stage");
    const device = root.querySelector(".mnv");
    const sideEl = root.querySelector(".mnv-side");
    const gridEl = root.querySelector(".mnv-grid");
    const crumbEl = root.querySelector(".mnv-crumb");
    const countEl = root.querySelector(".mnv-count");
    const unlockBar = root.querySelector(".mnv-unlockbar");
    let count = 2;
    let curMode = active, curSub = "All", locked = true;

    /* scale native 1194x834 to fit */
    const fit = () => {
      const s = stage.clientWidth / 1194;
      device.style.transform = `scale(${s})`;
      stage.style.height = `${Math.round(834 * s)}px`;
    };
    new ResizeObserver(fit).observe(stage);
    fit();

    /* dining timer */
    const timerEl = root.querySelector(".mnv-timer");
    let secs = 2 * 3600;
    setInterval(() => {
      if (secs > 0) secs -= 1;
      const h = Math.floor(secs / 3600), m = String(Math.floor((secs % 3600) / 60)).padStart(2, "0"), s = String(secs % 60).padStart(2, "0");
      timerEl.textContent = `${h}:${m}:${s}`;
    }, 1000);

    const modeOf = (k) => MODES.find((m) => m.key === k);

    const renderSide = () => {
      const m = modeOf(curMode);
      sideEl.innerHTML = m.subs.map((s) => `<button class="mnv-sub${s === curSub ? " on" : ""}" data-sub="${s}">${s}</button>`).join("");
    };
    const renderGrid = () => {
      const m = modeOf(curMode);
      const dishes = curSub === "All" ? m.dishes : m.dishes.filter((d) => d[2] === curSub);
      gridEl.innerHTML = dishes.map(dishCard).join("");
      // tier focus greys the paid-upgrade dishes until unlocked
      gridEl.classList.toggle("mnv-tierlock", focus === "tier" && locked);
      crumbEl.textContent = m.name + (curSub === "All" ? "" : "  ·  " + curSub);
      if (unlockBar) {
        unlockBar.style.display = focus === "tier" && locked ? "" : "none";
        const txt = unlockBar.querySelector(".mnv-unlocktxt");
        if (txt) txt.textContent = zh
          ? "Premium 與 Wagyu 部位屬付費升級 — 請服務生為您解鎖"
          : "Premium & Wagyu cuts are a paid upgrade — ask your server to unlock.";
      }
    };
    const selectMode = (k) => { curMode = k; curSub = "All"; root.querySelectorAll(".mnv-mode").forEach((b) => b.classList.toggle("on", b.dataset.mode === k)); renderSide(); renderGrid(); };
    const selectSub = (s) => { curSub = s; root.querySelectorAll(".mnv-sub").forEach((b) => b.classList.toggle("on", b.dataset.sub === s)); renderGrid(); };
    const setCols = (n) => { gridEl.dataset.cols = n; root.querySelectorAll(".mnv-dbtn").forEach((b) => b.classList.toggle("on", b.dataset.cols === String(n))); };

    renderSide(); renderGrid();

    /* interactions */
    root.addEventListener("click", (e) => {
      const mode = e.target.closest(".mnv-mode"); if (mode) return selectMode(mode.dataset.mode);
      const sub = e.target.closest(".mnv-sub"); if (sub) return selectSub(sub.dataset.sub);
      const dbtn = e.target.closest(".mnv-dbtn"); if (dbtn) return setCols(+dbtn.dataset.cols);
      const add = e.target.closest(".mnv-add");
      if (add) { count += 1; countEl.textContent = count; add.classList.remove("mnv-popped"); void add.offsetWidth; add.classList.add("mnv-popped"); }
      const un = e.target.closest(".mnv-unlockbtn"); if (un) { locked = false; renderGrid(); }
    });

    /* ---- auto-play ---- */
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    let onStage = true;
    new IntersectionObserver(([en]) => (onStage = en.isIntersecting), { threshold: 0.3 }).observe(stage);
    const waitOn = async () => { while (!onStage) await sleep(280); };

    async function navLoop() {
      const order = ["bbq", "hotpot", "sushi", "bbq"];
      for (;;) {
        await waitOn(); await sleep(2200);
        for (const k of order) { await waitOn(); selectMode(k); await sleep(2200); }
        await waitOn(); selectSub("Beef"); await sleep(1700); selectSub("All"); await sleep(1200);
        await waitOn(); setCols(4); await sleep(2400); setCols(3); await sleep(1600);
      }
    }
    async function tierLoop() {
      for (;;) {
        await waitOn(); locked = true; renderGrid(); await sleep(2600);
        await waitOn();
        const btn = root.querySelector(".mnv-unlockbtn");
        if (btn) { btn.classList.add("mnv-press"); await sleep(240); btn.classList.remove("mnv-press"); await sleep(160); }
        locked = false; renderGrid(); await sleep(3200);
      }
    }
    if (!reduced) (focus === "tier" ? tierLoop() : navLoop());
  }

  roots.forEach(build);
})();
