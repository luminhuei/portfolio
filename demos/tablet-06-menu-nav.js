/* ---------------------------------------------------------------------------
   tablet-06-menu-nav — the ORIGINAL tier-unlock demo, modified only to add the
   navigation Mina asked for. Strictly black/white/grey (white-label product —
   brand colour belongs to the merchants, the chrome stays neutral). Card
   style, dish names, tags and tier sections are the original, untouched.

   Additions (Decision 04 shows the first two off; Decision 05 the tier tour):
     • top scroller = major DINING MODES (Hot Pot / BBQ / Sushi / Drinks /
       Desserts); switching a mode swaps the LEFT side-nav to that mode's
       sub-categories
     • a 3-vs-4-per-row DENSITY toggle at the content's top-right; the dish
       images resize to the column width
     • the cart is collapsed to a bottom-right icon (a drawer that slides in),
       freeing the content area for the 3/4 layout

   data-focus="nav"  → Decision 04: modes ↔ categories + density
   data-focus="tier" → Decision 05: the original greyed → slide → unlock
   Original kept on disk as tablet-05-tier-unlock.js (backup).
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
    cart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="20" r="1.3"/><circle cx="18" cy="20" r="1.3"/><path d="M2.5 3.5h2.3l2.2 11.2a1.5 1.5 0 0 0 1.5 1.2h8.1a1.5 1.5 0 0 0 1.5-1.2L20 7H6"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    grid3: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="3.5" y="5" width="4.3" height="14" rx="1"/><rect x="9.9" y="5" width="4.3" height="14" rx="1"/><rect x="16.3" y="5" width="4.3" height="14" rx="1"/></svg>',
    grid4: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="3" y="5.5" width="3.2" height="13" rx="1"/><rect x="8" y="5.5" width="3.2" height="13" rx="1"/><rect x="13" y="5.5" width="3.2" height="13" rx="1"/><rect x="18" y="5.5" width="3.2" height="13" rx="1"/></svg>',
  };

  /* ---- AYCE BBQ menu: Tier 1 included, Tiers 2-3 paid upgrades ----
     UNCHANGED from the original — names, tags, descriptions, tiers all intact */
  const TIERS = [
    {
      key: "t1",
      kicker: "Tier 1 · Included with your table",
      name: "Classic BBQ",
      locked: false,
      dishes: [
        ["Marinated Short Rib", "COMBO", ""],
        ["Pork Belly Samgyeopsal", "", ""],
        ["Spicy Chicken Bulgogi", "ORDERED", ""],
        ["Beef Brisket Slices", "", ""],
        ["Garlic Shrimp Skewers", "TOP PICK", ""],
        ["Seasonal Veggie Platter", "NEW", ""],
      ],
    },
    {
      key: "t2",
      kicker: "Tier 2 · Paid upgrade",
      name: "Premium Cuts",
      locked: true,
      lockmsg: "Premium Cuts is available as a paid upgrade. Please contact your server to unlock this menu.",
      donemsg: "Premium Cuts unlocked — enjoy!",
      dishes: [
        ["Prime Ribeye", "PREMIUM", ""],
        ["Beef Tongue with Scallion", "PREMIUM", ""],
        ["Iberico Pork Collar", "PREMIUM", ""],
        ["Miso Black Cod", "PREMIUM", ""],
        ["Herb Lamb Chops", "PREMIUM", ""],
        ["Jumbo Tiger Prawns", "PREMIUM", ""],
      ],
    },
    {
      key: "t3",
      kicker: "Tier 3 · Paid upgrade",
      name: "Wagyu Reserve",
      locked: true,
      lockmsg: "Wagyu Reserve is available as a paid upgrade. Please contact your server to unlock this menu.",
      donemsg: "Wagyu Reserve unlocked — enjoy!",
      dishes: [
        ["A5 Wagyu Striploin", "WAGYU", ""],
        ["Wagyu Chateaubriand", "WAGYU", ""],
        ["Truffle Wagyu Nigiri", "WAGYU", ""],
        ["Wagyu Zabuton", "WAGYU", ""],
        ["A5 Wagyu Ribcap", "WAGYU", ""],
        ["Wagyu Karubi Short Rib", "WAGYU", ""],
      ],
    },
  ];

  /* NEW nav labels only — dining modes (top) and each mode's sub-categories (left) */
  const MODES = ["Hot Pot", "BBQ", "Sushi", "Drinks", "Desserts"];
  const MODE_CATS = {
    "Hot Pot": ["All", "Broths", "Beef", "Seafood", "Veggies", "Noodles"],
    "BBQ": ["All", "Beef", "Pork", "Chicken", "Seafood", "Veggies", "Sides"],
    "Sushi": ["All", "Nigiri", "Rolls", "Sashimi", "Tempura"],
    "Drinks": ["All", "Soft Drinks", "Tea", "Beer & Sake"],
    "Desserts": ["All", "Cakes", "Ice Cream", "Fruit"],
  };

  /* card + tierSection — UNCHANGED from the original */
  const card = ([name, tag]) => `
    <div class="tdv-card">
      <div class="tdv-media"><div class="tdv-img"></div><span class="tdv-lock">${I.lock}</span><button class="tdv-add" aria-label="Add ${name}">${I.plus}</button></div>
      <div class="tdv-text">
        <p class="tdv-name">${name}</p>
        ${tag ? `<span class="tdv-tag">${tag}</span>` : `<span class="tdv-tag" style="visibility:hidden">·</span>`}
      </div>
    </div>`;

  const tierSection = (t) => `
    <section class="tdv-tier${t.locked ? " tdv-locked" : ""}" data-tier="${t.key}">
      <p class="tdv-kicker">${t.kicker}</p>
      <div class="tdv-h">${t.name}</div>
      ${t.locked ? `
      <div class="tdv-snack tdv-bordered">
        <span class="tdv-snacktext tdv-lockmsg">${t.lockmsg}</span>
        <button class="tdv-unlockbtn">Unlock ${I.chevron}</button>
      </div>` : ""}
      <div class="tdv-grid">${t.dishes.map(card).join("")}</div>
    </section>`;

  const sideFor = (mode) =>
    MODE_CATS[mode].map((c, i) => `<button class="tdv-subnav${i === 0 ? " on" : ""}">${c}</button>`).join("");

  /* per-mode menus for Decision 04 — so switching a mode changes the dishes
     too, like a real tableside iPad. All-fabricated demo data; the BBQ tier
     structure (used by Decision 05) is separate and untouched above. */
  const MODE_MENU = {
    "Hot Pot": { kicker: "Included with your table", title: "Signature Hot Pot", dishes: [
      ["Mala Spicy Broth", "SIGNATURE"], ["Pork Bone Broth", ""], ["Sliced Ribeye", "TOP PICK"], ["Fatty Beef Roll", ""],
      ["Fresh Shrimp Paste", ""], ["Handmade Fish Tofu", "NEW"], ["Napa & Mushroom Set", ""], ["Hand-pulled Udon", ""],
    ] },
    "BBQ": { kicker: "Included with your table", title: "Classic BBQ", dishes: [
      ["Marinated Short Rib", "COMBO"], ["Pork Belly Samgyeopsal", ""], ["Spicy Chicken Bulgogi", "ORDERED"], ["Beef Brisket Slices", ""],
      ["Garlic Shrimp Skewers", "TOP PICK"], ["Seasonal Veggie Platter", "NEW"], ["Prime Ribeye", "PREMIUM"], ["A5 Wagyu Striploin", "WAGYU"],
    ] },
    "Sushi": { kicker: "Included with your table", title: "Sushi & Sashimi", dishes: [
      ["Salmon Nigiri", "TOP PICK"], ["Bluefin Tuna Nigiri", ""], ["Spicy Tuna Roll", ""], ["Dragon Roll", "SIGNATURE"],
      ["Salmon Sashimi", ""], ["Chirashi Bowl", "NEW"], ["Shrimp Tempura", ""], ["Miso Soup", ""],
    ] },
    "Drinks": { kicker: "Free refills", title: "Drinks", dishes: [
      ["Iced Barley Tea", ""], ["Yuzu Soda", "NEW"], ["Peach Green Tea", ""], ["Fresh Lemonade", ""],
      ["Draft Beer", ""], ["Cold Brew Coffee", ""],
    ] },
    "Desserts": { kicker: "Included with your table", title: "Desserts", dishes: [
      ["Matcha Lava Cake", "NEW"], ["Black Sesame Ice Cream", ""], ["Mango Mochi", ""], ["Seasonal Fruit Plate", ""],
      ["Brown Sugar Boba", "TOP PICK"], ["Egg Tart", ""],
    ] },
  };
  const flatSection = (mode) => {
    const m = MODE_MENU[mode];
    return `<section class="tdv-tier"><p class="tdv-kicker">${m.kicker}</p><div class="tdv-h">${m.title}</div><div class="tdv-grid">${m.dishes.map(card).join("")}</div></section>`;
  };

  function build(root) {
    const focus = root.dataset.focus === "tier" ? "tier" : "nav";

    root.innerHTML = `
      <div class="demo-stage">
        <div class="tdv tdv-hasnav" data-focus="${focus}" style="--cols:3">
          <div class="tdv-top">
            <div class="tdv-logo"><span class="tdv-logodot"></span></div>
            <div class="tdv-topbtns">
              <span class="tdv-pill">${I.kiosk}#A62</span>
              <span class="tdv-pill">${I.user}Login</span>
              <span class="tdv-pill">${I.receipt}My Order</span>
              <span class="tdv-pill">${I.bell}Check</span>
              <span class="tdv-pill tdv-outlined">${I.clock}<span class="tdv-timer">2:00:00</span></span>
              <span class="tdv-search">${I.search}</span>
            </div>
          </div>
          <div class="tdv-menuhead">
            <div class="tdv-tabs">
              ${MODES.map((m) => `<span class="tdv-tab${m === "BBQ" ? " on" : ""}">${m}</span>`).join("")}
            </div>
          </div>
          <div class="tdv-body">
            <nav class="tdv-side">${sideFor("BBQ")}</nav>
            <div class="tdv-left">
              <div class="tdv-toolbar">
                <div class="tdv-density" role="group" aria-label="Layout density">
                  <button class="tdv-dbtn on" data-cols="3" aria-label="Fewer per row">${I.minus}</button>
                  <button class="tdv-dbtn" data-cols="4" aria-label="More per row">${I.plus}</button>
                </div>
              </div>
              <div class="tdv-scroll">
                <div class="tdv-content">${focus === "nav" ? flatSection("BBQ") : TIERS.map(tierSection).join("")}</div>
              </div>
            </div>
            <aside class="tdv-cart">
              <div class="tdv-cartcard">
                <div class="tdv-carthead"><b>Shopping Cart (<span class="tdv-count">2</span>)</b><button class="tdv-cartclose" aria-label="Close">${I.close}</button></div>
                <div class="tdv-cartscroll">
                  <div class="tdv-item">
                    <span class="tdv-thumb"></span>
                    <div class="tdv-itembody">
                      <p class="tdv-itemname">Marinated Short Rib</p>
                      <div class="tdv-itemfoot"><span class="tdv-stepper"><button class="tdv-step">${I.minus}</button><span class="tdv-qty">1</span><button class="tdv-step">${I.plus}</button></span></div>
                    </div>
                  </div>
                  <div class="tdv-item">
                    <span class="tdv-thumb"></span>
                    <div class="tdv-itembody">
                      <p class="tdv-itemname">Pork Belly Samgyeopsal</p>
                      <div class="tdv-itemfoot"><span class="tdv-stepper"><button class="tdv-step">${I.minus}</button><span class="tdv-qty">2</span><button class="tdv-step">${I.plus}</button></span></div>
                    </div>
                  </div>
                </div>
                <div class="tdv-cartfoot"><button class="tdv-submit">Submit</button></div>
              </div>
            </aside>
            <div class="tdv-scrim"></div>
            <button class="tdv-cartfab" aria-label="Cart">${I.cart}<span class="tdv-fabbadge">2</span></button>
          </div>
        </div>
      </div>
      <span class="demo-hint">${reduced ? (zh ? "可互動" : "Interactive") : (focus === "tier" ? (zh ? "自動播放 — Tier 解鎖" : "Auto-plays — tiers unlock") : (zh ? "自動播放 — 模式 · 分類 · 版面密度" : "Auto-plays — modes · categories · density"))}</span>`;

    const stage = root.querySelector(".demo-stage");
    const device = root.querySelector(".tdv");
    const scroller = root.querySelector(".tdv-scroll");
    const sideEl = root.querySelector(".tdv-side");
    const contentEl = root.querySelector(".tdv-content");
    const cartEl = root.querySelector(".tdv-cart");
    const scrimEl = root.querySelector(".tdv-scrim");
    const countEl = root.querySelector(".tdv-count");
    let count = 2;

    const fit = () => {
      const s = stage.clientWidth / 1194;
      device.style.transform = `scale(${s})`;
      stage.style.height = `${Math.round(834 * s)}px`;
    };
    new ResizeObserver(fit).observe(stage);
    window.addEventListener("resize", fit);
    fit();

    const timerEl = root.querySelector(".tdv-timer");
    let secs = 2 * 3600;
    setInterval(() => {
      if (secs > 0) secs -= 1;
      const h = Math.floor(secs / 3600), m = String(Math.floor((secs % 3600) / 60)).padStart(2, "0"), s = String(secs % 60).padStart(2, "0");
      timerEl.textContent = `${h}:${m}:${s}`;
    }, 1000);

    /* ---- top modes ↔ left categories ---- */
    const setMode = (mode) => {
      root.querySelectorAll(".tdv-tab").forEach((e) => e.classList.toggle("on", e.textContent === mode));
      sideEl.innerHTML = sideFor(mode);
      if (focus === "nav") { contentEl.innerHTML = flatSection(mode); scroller.scrollTop = 0; }
    };
    const setSub = (label) => root.querySelectorAll(".tdv-subnav").forEach((e) => e.classList.toggle("on", e.textContent === label));
    root.querySelectorAll(".tdv-tab").forEach((e) => e.addEventListener("click", () => setMode(e.textContent)));
    sideEl.addEventListener("click", (ev) => { const b = ev.target.closest(".tdv-subnav"); if (b) setSub(b.textContent); });

    /* ---- density toggle ---- */
    const setCols = (n) => {
      device.style.setProperty("--cols", n);
      device.classList.toggle("tdv-c4", n === 4);
      root.querySelectorAll(".tdv-dbtn").forEach((b) => b.classList.toggle("on", +b.dataset.cols === n));
    };
    root.querySelectorAll(".tdv-dbtn").forEach((b) => b.addEventListener("click", () => setCols(+b.dataset.cols)));

    /* ---- collapsible cart ---- */
    const openCart = (v) => { cartEl.classList.toggle("tdv-open", v); scrimEl.classList.toggle("tdv-on", v); };
    root.querySelector(".tdv-cartfab").addEventListener("click", () => openCart(!cartEl.classList.contains("tdv-open")));
    root.querySelector(".tdv-cartclose").addEventListener("click", () => openCart(false));
    scrimEl.addEventListener("click", () => openCart(false));

    /* ---- tier lock (unchanged) ---- */
    const tierEls = {};
    root.querySelectorAll(".tdv-tier").forEach((s) => (tierEls[s.dataset.tier] = s));
    const tierData = {};
    TIERS.forEach((t) => (tierData[t.key] = t));
    const setLocked = (key, locked) => {
      const sec = tierEls[key], t = tierData[key];
      if (!t.locked) return;
      sec.classList.toggle("tdv-locked", locked);
      sec.querySelector(".tdv-lockmsg").textContent = locked ? t.lockmsg : t.donemsg;
      sec.querySelector(".tdv-unlockbtn").style.display = locked ? "" : "none";
    };
    ["t2", "t3"].forEach((key) => tierEls[key].querySelector(".tdv-unlockbtn").addEventListener("click", () => setLocked(key, false)));
    if (focus === "nav") { setLocked("t2", false); setLocked("t3", false); }

    contentEl.addEventListener("click", (e) => {
      const btn = e.target.closest(".tdv-add");
      if (!btn) return;
      count += 1; countEl.textContent = count;
      root.querySelector(".tdv-fabbadge").textContent = count;
      btn.classList.remove("tdv-popped"); void btn.offsetWidth; btn.classList.add("tdv-popped");
    });

    /* ---- auto-play ---- */
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    let onStage = true;
    new IntersectionObserver(([e]) => (onStage = e.isIntersecting), { threshold: 0.3 }).observe(stage);
    const waitOnStage = async () => { while (!onStage) await sleep(280); };

    const easeInOut = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
    const scrollTier = (key) =>
      new Promise((res) => {
        const from = scroller.scrollTop;
        const to = key === "t1" ? 0 : tierEls[key].offsetTop - scroller.offsetTop;
        const dist = to - from;
        if (Math.abs(dist) < 2) return res();
        const dur = Math.min(1100, 450 + Math.abs(dist) * 0.35);
        let start;
        const step = (ts) => {
          if (start === undefined) start = ts;
          const t = Math.min(1, (ts - start) / dur);
          scroller.scrollTop = from + dist * easeInOut(t);
          t < 1 ? requestAnimationFrame(step) : res();
        };
        requestAnimationFrame(step);
      });

    const pressUnlock = async (key) => {
      if (!tierEls[key].classList.contains("tdv-locked")) return;
      const btn = tierEls[key].querySelector(".tdv-unlockbtn");
      btn.classList.add("tdv-press"); await sleep(220); btn.classList.remove("tdv-press"); await sleep(160);
      setLocked(key, false);
    };

    /* Decision 05 — original greyed → slide → unlock tour */
    async function tierCycle() {
      for (;;) {
        await waitOnStage(); await sleep(2600);
        for (const key of ["t2", "t3"]) {
          await waitOnStage(); await scrollTier(key); await sleep(1400);
          await pressUnlock(key); await sleep(2600);
        }
        await waitOnStage(); await scrollTier("t1"); await sleep(500);
        setLocked("t2", true); setLocked("t3", true);
      }
    }

    /* Decision 04 — modes ↔ categories, then the 3/4 density toggle */
    async function navCycle() {
      for (;;) {
        await waitOnStage(); setMode("BBQ"); setCols(3); await sleep(2400);
        for (const m of ["Hot Pot", "Sushi", "Drinks", "BBQ"]) { await waitOnStage(); setMode(m); await sleep(1900); }
        await waitOnStage(); setSub("Beef"); await sleep(1400); setSub("All"); await sleep(900);
        await waitOnStage(); setCols(4); await sleep(2600); setCols(3); await sleep(2000);
        await waitOnStage(); openCart(true); await sleep(2200); openCart(false); await sleep(1400);
      }
    }

    if (!reduced) (focus === "tier" ? tierCycle() : navCycle());
  }

  roots.forEach(build);
})();
