/* ---------------------------------------------------------------------------
   tablet-05-tier-unlock (v2) — rebuilt 1:1 from Figma frame 3010:11395.
   The device renders at its native 1194x834 and is scaled to fit the stage,
   so every measurement, color, and type size is the file's exact value.
   Scenario: a premium all-you-can-eat BBQ. Tier 1 comes with the table;
   Tiers 2-3 are paid upgrades that grey out (with lock badges) as they
   scroll into view and unlock in place. Dish photos: gray placeholders.
--------------------------------------------------------------------------- */
(function () {
  const root = document.getElementById("demo-tablet-05-tier-unlock");
  if (!root) return;

  const zh = (document.documentElement.lang || "").startsWith("zh");
  const T = {
    hint: zh ? "可互動 — 捲動,然後解鎖" : "Interactive — scroll, then unlock",
    replay: zh ? "↺ 重新鎖定" : "↺ Lock again",
  };

  /* icons (inline SVG) */
  const I = {
    kiosk: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="11" rx="1.5"/><path d="M12 15v3M8.5 21h7M9 18h6"/></svg>',
    user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="3.6"/><path d="M5.5 20c1-3.4 3.5-5 6.5-5s5.5 1.6 6.5 5"/></svg>',
    bell: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 10a6 6 0 0 1 12 0c0 4 1.5 5.5 1.5 5.5h-15S6 14 6 10z"/><path d="M10 19a2.2 2.2 0 0 0 4 0"/></svg>',
    clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/></svg>',
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/></svg>',
    chevron: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.5 6l6 6-6 6"/></svg>',
    plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M12 5.5v13M5.5 12h13"/></svg>',
    minus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M5.5 12h13"/></svg>',
    lock: '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="10.5" width="14" height="9.5" rx="2"/><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3"/></svg>',
  };

  /* ---- AYCE BBQ menu: Tier 1 included, Tiers 2-3 paid upgrades ---- */
  const TIERS = [
    {
      key: "t1",
      kicker: "Tier 1 · Included with your table",
      name: "Classic BBQ",
      locked: false,
      limit: "<b>Limit:</b>&nbsp;3 items per round of ordering, 4 items total from this category",
      dishes: [
        ["Marinated Short Rib", "COMBO", "Sweet soy-marinated beef short rib, sliced thin for the grill and served with ssamjang."],
        ["Pork Belly Samgyeopsal", "TOP PICK", "Thick-cut pork belly grilled tableside, with lettuce wraps, garlic, and green-onion salad."],
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
      ],
    },
  ];

  const card = ([name, tag, desc]) => `
    <div class="tdv-card">
      <div class="tdv-media"><div class="tdv-img"></div><span class="tdv-lock">${I.lock}</span></div>
      <div class="tdv-text">
        <p class="tdv-name">${name}</p>
        ${tag ? `<span class="tdv-tag">${tag}</span>` : `<span class="tdv-tag" style="visibility:hidden">·</span>`}
        <p class="tdv-desc">${desc}</p>
        <div class="tdv-pricerow"><span class="tdv-price">$20.00</span><button class="tdv-add" aria-label="Add ${name}">${I.plus}</button></div>
      </div>
    </div>`;

  const tierSection = (t) => `
    <section class="tdv-tier" data-tier="${t.key}" data-locks="${t.locked ? "1" : ""}">
      <p class="tdv-kicker">${t.kicker}</p>
      <div class="tdv-h">${t.name}</div>
      ${t.limit ? `<div class="tdv-snack"><span class="tdv-snacktext">${t.limit}</span></div>` : ""}
      ${t.locked ? `
      <div class="tdv-snack tdv-bordered">
        <span class="tdv-snacktext tdv-lockmsg">${t.lockmsg}</span>
        <button class="tdv-unlockbtn">Unlock ${I.chevron}</button>
      </div>` : ""}
      <div class="tdv-grid">${t.dishes.map(card).join("")}</div>
    </section>`;

  root.innerHTML = `
    <div class="demo-stage">
      <div class="tdv">
        <div class="tdv-top">
          <div class="tdv-logo"><span class="tdv-logodot"></span></div>
          <div class="tdv-topbtns">
            <span class="tdv-pill">${I.kiosk}#A62</span>
            <span class="tdv-pill">${I.user}Login</span>
            <span class="tdv-pill">${I.bell}Service</span>
            <span class="tdv-pill tdv-outlined">${I.clock}<span class="tdv-timer">2:00:00</span></span>
          </div>
        </div>
        <div class="tdv-body">
          <div class="tdv-left">
            <div class="tdv-menuhead">
              <div class="tdv-tabs">
                <span class="tdv-tab on">Beef</span>
                <span class="tdv-tab">Pork</span>
                <span class="tdv-tab">Chicken</span>
                <span class="tdv-tab">Seafood</span>
                <span class="tdv-tab">Veggies</span>
                <span class="tdv-tab">Sides</span>
                <span class="tdv-tab">Drinks</span>
                <span class="tdv-search">${I.search}</span>
              </div>
            </div>
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
                    <span class="tdv-cart-tag">Combo</span>
                    <div class="tdv-mod"><span>1</span><span>Extra Ssamjang</span></div>
                    <div class="tdv-mod"><span>2</span><span>Kimchi Refill</span></div>
                    <div class="tdv-mod"><span>1</span><span>Steamed Egg Souffl&eacute;</span></div>
                    <div class="tdv-itemfoot">
                      <span class="tdv-itemprice">$20.00</span>
                      <span class="tdv-stepper"><button class="tdv-step">${I.minus}</button><span class="tdv-qty">1</span><button class="tdv-step">${I.plus}</button></span>
                    </div>
                  </div>
                </div>
                <div class="tdv-item">
                  <span class="tdv-thumb"></span>
                  <div class="tdv-itembody">
                    <p class="tdv-itemname">Pork Belly Samgyeopsal</p>
                    <p class="tdv-itemdesc">Thick-cut pork belly grilled tableside, with lettuce wraps and green-onion salad</p>
                    <p class="tdv-discount">Buy 1 Get 1 Discount ( -$10.00)</p>
                    <div class="tdv-itemfoot">
                      <span class="tdv-itemprice">$20.00</span>
                      <span class="tdv-stepper"><button class="tdv-step">${I.minus}</button><span class="tdv-qty">2</span><button class="tdv-step">${I.plus}</button></span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="tdv-cartfoot"><button class="tdv-submit">Submit</button></div>
            </div>
            <div class="tdv-myorder"><b>My Order $0.00</b><span>View</span></div>
          </aside>
        </div>
      </div>
    </div>
    <span class="demo-hint">${T.hint}</span>
    <button class="demo-replay" hidden>${T.replay}</button>`;

  const stage = root.querySelector(".demo-stage");
  const device = root.querySelector(".tdv");
  const scroller = root.querySelector(".tdv-scroll");
  const replayBtn = root.querySelector(".demo-replay");
  const countEl = root.querySelector(".tdv-count");
  let count = 2;

  /* scale the native 1194x834 device to fit the stage width */
  const fit = () => {
    const s = stage.clientWidth / 1194;
    device.style.transform = `scale(${s})`;
    stage.style.height = `${Math.round(834 * s)}px`;
  };
  new ResizeObserver(fit).observe(stage);
  fit();

  /* dining timer: guests just sat down — 2 hours left, counting down (blue) */
  const timerEl = root.querySelector(".tdv-timer");
  let secs = 2 * 3600;
  const tickTimer = () => {
    if (secs > 0) secs -= 1;
    const h = Math.floor(secs / 3600);
    const m = String(Math.floor((secs % 3600) / 60)).padStart(2, "0");
    const s = String(secs % 60).padStart(2, "0");
    timerEl.textContent = `${h}:${m}:${s}`;
  };
  setInterval(tickTimer, 1000);

  /* paid tiers grey out as they scroll into view, each with its own unlock */
  const lockedTiers = [...root.querySelectorAll('.tdv-tier[data-locks="1"]')];
  const state = new Map(); // section -> { unlocked }
  lockedTiers.forEach((sec) => {
    const t = TIERS.find((x) => x.key === sec.dataset.tier);
    state.set(sec, { unlocked: false, lockmsg: t.lockmsg, donemsg: t.donemsg });

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !state.get(sec).unlocked) sec.classList.add("tdv-locked");
      },
      { root: scroller, threshold: 0.15 }
    );
    io.observe(sec);

    sec.querySelector(".tdv-unlockbtn").addEventListener("click", () => {
      state.get(sec).unlocked = true;
      sec.classList.remove("tdv-locked");
      sec.querySelector(".tdv-lockmsg").textContent = state.get(sec).donemsg;
      sec.querySelector(".tdv-unlockbtn").style.display = "none";
      replayBtn.hidden = false;
    });
  });

  replayBtn.addEventListener("click", () => {
    lockedTiers.forEach((sec) => {
      state.get(sec).unlocked = false;
      sec.classList.add("tdv-locked");
      sec.querySelector(".tdv-lockmsg").textContent = state.get(sec).lockmsg;
      sec.querySelector(".tdv-unlockbtn").style.display = "";
    });
    replayBtn.hidden = true;
  });

  /* + buttons bump the cart count (inert while a tier is locked) */
  root.querySelectorAll(".tdv-add").forEach((btn) => {
    btn.addEventListener("click", () => {
      count += 1;
      countEl.textContent = count;
      btn.classList.remove("tdv-popped");
      void btn.offsetWidth;
      btn.classList.add("tdv-popped");
    });
  });
})();
