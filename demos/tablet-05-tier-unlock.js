/* ---------------------------------------------------------------------------
   tablet-05-tier-unlock (v2) — rebuilt 1:1 from Figma frame 3010:11395.
   The device renders at its native 1194x834 and is scaled to fit the stage,
   so every measurement, color, and type size is the file's exact value.
   Category 1 orderable; Category 2 (Platinum) greys out as it scrolls into
   view; "Unlock" restores it in place. Dish photos are gray placeholders.
--------------------------------------------------------------------------- */
(function () {
  const root = document.getElementById("demo-tablet-05-tier-unlock");
  if (!root) return;

  const zh = (document.documentElement.lang || "").startsWith("zh");
  const T = {
    hint: zh ? "可互動 — 捲動,然後解鎖" : "Interactive — scroll, then unlock",
    replay: zh ? "↺ 重新鎖定" : "↺ Lock again",
  };

  /* icons (all inline SVG, stroke = currentColor unless noted) */
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

  /* dish data — names/descriptions in the file's voice, prices $20 flat */
  const CAT1 = [
    ["Spicy Miso Ramen", "COMBO", "Spicy dashi broth made with savory miso and chicken stock with a special blend of chili bean sauce."],
    ["Creamy Ramen", "TOP PICK", "Rich and creamy chicken broth made with shiitake mushroom dashi, soy milk, and original sesame sauce."],
    ["Zen Ramen", "ORDERED", "Light and healthy pork broth made with kombu seaweed, shiitake mushroom, and white soy sauce."],
    ["Shoyu Classic", "", "Clear soy-sauce broth simmered with chicken bones, bonito flakes, and a touch of yuzu peel."],
    ["Garlic Tonkotsu", "TOP PICK", "Deep pork-bone broth finished with black garlic oil, wood-ear mushroom, and braised pork belly."],
    ["Yuzu Shio", "NEW", "Delicate salt-based broth brightened with fresh yuzu citrus, bamboo shoots, and sesame."],
  ];
  const CAT2 = [
    ["Wagyu Truffle Ramen", "PLATINUM", "A5 wagyu slices over rich paitan broth with shaved black truffle and a slow-poached egg."],
    ["Uni Butter Ramen", "PLATINUM", "Sea urchin butter melted into creamy chicken broth, topped with ikura and chive oil."],
    ["Lobster Paitan", "PLATINUM", "Whole-lobster broth simmered overnight, finished with claw meat and saffron oil."],
    ["King Crab Tsukemen", "PLATINUM", "Dipping-style noodles with king crab broth reduction and charred sweet corn."],
    ["A5 Beef Bowl", "PLATINUM", "Seared A5 striploin over koshihikari rice with truffle ponzu and onsen egg."],
    ["Golden Broth Special", "PLATINUM", "The chef's reserve: 48-hour golden chicken broth with foie gras chashu."],
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

  root.innerHTML = `
    <div class="demo-stage">
      <div class="tdv">
        <div class="tdv-top">
          <div class="tdv-logo"><span class="tdv-logodot"></span></div>
          <div class="tdv-topbtns">
            <span class="tdv-pill">${I.kiosk}#A62</span>
            <span class="tdv-pill">${I.user}Login</span>
            <span class="tdv-pill">${I.bell}Service</span>
            <span class="tdv-pill tdv-outlined">${I.clock}Dining Closed</span>
          </div>
        </div>
        <div class="tdv-body">
          <div class="tdv-left">
            <div class="tdv-menuhead">
              <div class="tdv-menutype">
                <button class="tdv-mt on">Full Menu</button>
                <button class="tdv-mt">Drink Menu</button>
              </div>
              <div class="tdv-tabs">
                <span class="tdv-tab on">Category 1</span>
                <span class="tdv-tab">Category 2</span>
                <span class="tdv-tab">Category 3</span>
                <span class="tdv-tab">Category 4</span>
                <span class="tdv-tab">Category 5</span>
                <span class="tdv-tab">Category 6</span>
                <span class="tdv-tab">Category 7</span>
                <span class="tdv-search">${I.search}</span>
              </div>
            </div>
            <div class="tdv-scroll">
              <div class="tdv-content">
                <section class="tdv-tier1">
                  <p class="tdv-kicker">Full Menu</p>
                  <div class="tdv-h">Category 1 Name</div>
                  <div class="tdv-snack"><span class="tdv-snacktext"><b>Limit:</b>&nbsp;3 items per round of ordering, 4 items total from this category</span></div>
                  <div class="tdv-grid">${CAT1.map(card).join("")}</div>
                </section>
                <section class="tdv-tier2">
                  <p class="tdv-kicker">Full Menu</p>
                  <div class="tdv-h">Category 2 Name</div>
                  <div class="tdv-snack tdv-bordered">
                    <span class="tdv-snacktext tdv-lockmsg">This menu is available for Platinum members. Please contact your server to unlock this menu.</span>
                    <button class="tdv-unlockbtn">Unlock ${I.chevron}</button>
                  </div>
                  <div class="tdv-grid">${CAT2.map(card).join("")}</div>
                </section>
              </div>
            </div>
          </div>
          <aside class="tdv-cart">
            <div class="tdv-cartcard">
              <div class="tdv-carthead"><b>Shopping Cart (<span class="tdv-count">2</span>)</b><span class="tdv-clear">Clear Cart</span></div>
              <div class="tdv-cartscroll">
                <div class="tdv-field">Special Instructions on Order</div>
                <div class="tdv-item">
                  <span class="tdv-thumb"></span>
                  <div class="tdv-itembody">
                    <p class="tdv-itemname">Spicy Miso Ramen</p>
                    <span class="tdv-cart-tag">Combo</span>
                    <div class="tdv-mod"><span>1</span><span>Extra Spicy Paste</span></div>
                    <div class="tdv-mod"><span>2</span><span>Extra Pork Belly</span></div>
                    <div class="tdv-mod"><span>1</span><span>Extra Lava Egg</span></div>
                    <div class="tdv-itemfoot">
                      <span class="tdv-itemprice">$20.00</span>
                      <span class="tdv-stepper"><button class="tdv-step">${I.minus}</button><span class="tdv-qty">1</span><button class="tdv-step">${I.plus}</button></span>
                    </div>
                  </div>
                </div>
                <div class="tdv-item">
                  <span class="tdv-thumb"></span>
                  <div class="tdv-itembody">
                    <p class="tdv-itemname">Creamy Ramen</p>
                    <p class="tdv-itemdesc">Dish Summary or extra Text, show all contents no matter how long the text is</p>
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
  const tier2 = root.querySelector(".tdv-tier2");
  const lockmsg = root.querySelector(".tdv-lockmsg");
  const unlockBtn = root.querySelector(".tdv-unlockbtn");
  const replayBtn = root.querySelector(".demo-replay");
  const countEl = root.querySelector(".tdv-count");
  const LOCK_MSG = lockmsg.textContent;
  let count = 2;
  let unlocked = false;

  /* scale the native 1194x834 device to fit the stage width */
  const fit = () => {
    const s = stage.clientWidth / 1194;
    device.style.transform = `scale(${s})`;
    stage.style.height = `${Math.round(834 * s)}px`;
  };
  new ResizeObserver(fit).observe(stage);
  fit();

  /* the tier greys out as it scrolls into view (and stays locked) */
  const io = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting && !unlocked) tier2.classList.add("tdv-locked");
    },
    { root: scroller, threshold: 0.18 }
  );
  io.observe(tier2);

  unlockBtn.addEventListener("click", () => {
    unlocked = true;
    tier2.classList.remove("tdv-locked");
    lockmsg.textContent = "Platinum menu unlocked — enjoy!";
    unlockBtn.style.display = "none";
    replayBtn.hidden = false;
  });

  replayBtn.addEventListener("click", () => {
    unlocked = false;
    tier2.classList.add("tdv-locked");
    lockmsg.textContent = LOCK_MSG;
    unlockBtn.style.display = "";
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
