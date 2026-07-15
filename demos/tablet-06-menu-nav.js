/* ---------------------------------------------------------------------------
   tablet-06-menu-nav — the ORIGINAL tier-unlock demo (tablet-05-tier-unlock),
   modified ONLY to correct the navigation IA:
     • the top horizontal scroller now carries the major DINING MODES
       (Hot Pot / BBQ / Sushi / Drinks / Desserts) instead of sub-categories
     • a left SIDE NAVIGATION is added for that mode's sub-categories
       (All / Beef / Pork / Chicken / Seafood / Veggies / Sides)
   Everything else — card style, dish names, tags, tier sections, colours,
   cart — is untouched. Strictly black/white/grey (white-label product; brand
   colours belong to the merchants, not the chrome). One device, two focuses:
     data-focus="nav"  → Decision one, plays the navigation story
     data-focus="tier" → Decision two, the original greyed→unlock story
   Original kept on disk as tablet-05-tier-unlock.js (backup).
--------------------------------------------------------------------------- */
(function () {
  const roots = document.querySelectorAll("[id^='demo-tablet-06-menu-nav']");
  if (!roots.length) return;

  const zh = (document.documentElement.lang || "").startsWith("zh");
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* icons (inline SVG) — unchanged from the original */
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
        ["Marinated Short Rib", "COMBO", "Sweet soy-marinated beef short rib, sliced thin for the grill and served with ssamjang."],
        ["Pork Belly Samgyeopsal", "", "Thick-cut pork belly grilled tableside, with lettuce wraps, garlic, and green-onion salad."],
        ["Spicy Chicken Bulgogi", "ORDERED", "Boneless chicken thigh in gochujang marinade, charred over the open flame."],
        ["Beef Brisket Slices", "", "Paper-thin brisket that cooks in seconds — dip in sesame oil with a pinch of salt."],
        ["Garlic Shrimp Skewers", "TOP PICK", "Butterflied shrimp brushed with garlic butter, finished with a squeeze of lemon."],
        ["Seasonal Veggie Platter", "NEW", "Mushrooms, kabocha, corn cheese, and peppers — everything the grill's edge is for."],
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
        ["Prime Ribeye", "PREMIUM", "Well-marbled USDA Prime ribeye, cut to order and rested before it hits your grill."],
        ["Beef Tongue with Scallion", "PREMIUM", "Delicate tongue slices with scallion salt — the connoisseur's first order."],
        ["Iberico Pork Collar", "PREMIUM", "Spanish Iberico presa with deep nutty fat — grill slow at the cooler edge."],
        ["Miso Black Cod", "PREMIUM", "Sweet miso-cured black cod that caramelizes beautifully over charcoal."],
        ["Herb Lamb Chops", "PREMIUM", "Frenched lamb chops in rosemary marinade — sear fast, two minutes a side."],
        ["Jumbo Tiger Prawns", "PREMIUM", "Head-on tiger prawns brushed with chili butter, grilled in the shell."],
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
        ["A5 Wagyu Striploin", "WAGYU", "Certified A5 from Kagoshima — snowflake marbling that melts at grill temperature."],
        ["Wagyu Chateaubriand", "WAGYU", "The tenderest center cut, portioned for the table and seared whole."],
        ["Truffle Wagyu Nigiri", "WAGYU", "Seared wagyu over rice with shaved truffle — finished tableside."],
        ["Wagyu Zabuton", "WAGYU", "The rare chuck-flap 'cushion cut' — intense marbling, impossibly tender off the grill."],
        ["A5 Wagyu Ribcap", "WAGYU", "The prized spinalis crown of the ribeye, sliced thin for a quick kiss of flame."],
        ["Wagyu Karubi Short Rib", "WAGYU", "Classic yakiniku short rib in sweet garlic soy — rich, glossy, unmistakably wagyu."],
      ],
    },
  ];

  /* NEW navigation labels only — the two levels Mina asked for */
  const MODES = ["Hot Pot", "BBQ", "Sushi", "Drinks", "Desserts"]; // top scroller (major dining modes)
  const SUBS = ["All", "Beef", "Pork", "Chicken", "Seafood", "Veggies", "Sides"]; // left side-nav (sub-categories)

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

  function build(root) {
    const focus = root.dataset.focus === "tier" ? "tier" : "nav";

    root.innerHTML = `
      <div class="demo-stage">
        <div class="tdv tdv-hasnav" data-focus="${focus}">
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
              ${MODES.map((m, i) => `<span class="tdv-tab${i === 1 ? " on" : ""}">${m}</span>`).join("")}
            </div>
          </div>
          <div class="tdv-body">
            <nav class="tdv-side">
              ${SUBS.map((s, i) => `<button class="tdv-subnav${i === 0 ? " on" : ""}">${s}</button>`).join("")}
            </nav>
            <div class="tdv-left">
              <div class="tdv-scroll">
                <div class="tdv-content">${TIERS.map(tierSection).join("")}</div>
              </div>
            </div>
            <aside class="tdv-cart">
              <div class="tdv-cartcard">
                <div class="tdv-carthead"><b>Shopping Cart (<span class="tdv-count">2</span>)</b><span class="tdv-clear">Clear Cart</span></div>
                <div class="tdv-cartscroll">
                  <div class="tdv-item">
                    <span class="tdv-thumb"></span>
                    <div class="tdv-itembody">
                      <p class="tdv-itemname">Marinated Short Rib</p>
                      <div class="tdv-itemfoot">
                        <span class="tdv-stepper"><button class="tdv-step">${I.minus}</button><span class="tdv-qty">1</span><button class="tdv-step">${I.plus}</button></span>
                      </div>
                    </div>
                  </div>
                  <div class="tdv-item">
                    <span class="tdv-thumb"></span>
                    <div class="tdv-itembody">
                      <p class="tdv-itemname">Pork Belly Samgyeopsal</p>
                      <div class="tdv-itemfoot">
                        <span class="tdv-stepper"><button class="tdv-step">${I.minus}</button><span class="tdv-qty">2</span><button class="tdv-step">${I.plus}</button></span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="tdv-cartfoot"><button class="tdv-submit">Submit</button></div>
              </div>
            </aside>
          </div>
        </div>
      </div>
      <span class="demo-hint">${reduced ? (zh ? "可互動" : "Interactive") : (focus === "tier" ? (zh ? "自動播放 — Tier 解鎖" : "Auto-plays — tiers unlock") : (zh ? "自動播放 — 大類別與子分類導覽" : "Auto-plays — modes & sub-categories"))}</span>`;

    const stage = root.querySelector(".demo-stage");
    const device = root.querySelector(".tdv");
    const scroller = root.querySelector(".tdv-scroll");
    const countEl = root.querySelector(".tdv-count");
    let count = 2;

    /* scale the native 1194x834 device to fit the stage width (unchanged) */
    const fit = () => {
      const s = stage.clientWidth / 1194;
      device.style.transform = `scale(${s})`;
      stage.style.height = `${Math.round(834 * s)}px`;
    };
    new ResizeObserver(fit).observe(stage);
    window.addEventListener("resize", fit);
    fit();

    /* dining timer (unchanged) */
    const timerEl = root.querySelector(".tdv-timer");
    let secs = 2 * 3600;
    setInterval(() => {
      if (secs > 0) secs -= 1;
      const h = Math.floor(secs / 3600), m = String(Math.floor((secs % 3600) / 60)).padStart(2, "0"), s = String(secs % 60).padStart(2, "0");
      timerEl.textContent = `${h}:${m}:${s}`;
    }, 1000);

    /* nav highlighting — clicking a mode / sub-category sets the active state */
    const modeEls = [...root.querySelectorAll(".tdv-tab")];
    const subEls = [...root.querySelectorAll(".tdv-subnav")];
    const setMode = (i) => modeEls.forEach((e, k) => e.classList.toggle("on", k === i));
    const setSub = (i) => subEls.forEach((e, k) => e.classList.toggle("on", k === i));
    modeEls.forEach((e, i) => e.addEventListener("click", () => setMode(i)));
    subEls.forEach((e, i) => e.addEventListener("click", () => setSub(i)));

    /* ---- tier lock state (unchanged from the original) ---- */
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
    ["t2", "t3"].forEach((key) => {
      tierEls[key].querySelector(".tdv-unlockbtn").addEventListener("click", () => setLocked(key, false));
    });
    /* nav focus is about navigation, not permissions — start everything unlocked */
    if (focus === "nav") { setLocked("t2", false); setLocked("t3", false); }

    /* + buttons bump the cart count (unchanged) */
    root.querySelectorAll(".tdv-add").forEach((btn) => {
      btn.addEventListener("click", () => {
        count += 1; countEl.textContent = count;
        btn.classList.remove("tdv-popped"); void btn.offsetWidth; btn.classList.add("tdv-popped");
      });
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

    /* Decision two — the original greyed → unlock tour, unchanged */
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

    /* Decision one — walk the two nav levels: modes on top, sub-categories left */
    async function navCycle() {
      const modeOrder = [1, 0, 2, 1]; // BBQ → Hot Pot → Sushi → BBQ
      const subOrder = [1, 4, 6, 0];  // Beef → Seafood → Sides → All
      for (;;) {
        await waitOnStage(); setMode(1); setSub(0); await sleep(2400);
        for (const i of modeOrder) { await waitOnStage(); setMode(i); await sleep(1700); }
        for (const i of subOrder) { await waitOnStage(); setSub(i); await sleep(1600); }
      }
    }

    if (!reduced) (focus === "tier" ? tierCycle() : navCycle());
  }

  roots.forEach(build);
})();
