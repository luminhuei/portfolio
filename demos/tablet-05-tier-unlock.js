/* ---------------------------------------------------------------------------
   tablet-05-tier-unlock — interactive figure for the Ordering Tablet case.
   A live mini tablet: Tier 1 orderable, Tier 2 greyed out with lock badges.
   Scroll reveals the locked tier; "Unlock" restores it in place.
   Data is illustrative — no real product content.
--------------------------------------------------------------------------- */
(function () {
  const root = document.getElementById("demo-tablet-05-tier-unlock");
  if (!root) return;

  const zh = (document.documentElement.lang || "").startsWith("zh");
  const T = {
    hint: zh ? "可互動 — 捲動,然後解鎖" : "Interactive — scroll, then unlock",
    replay: zh ? "↺ 重新鎖定" : "↺ Lock again",
  };

  const LOCK_SVG =
    '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="10.5" width="14" height="9.5" rx="2"/><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3"/></svg>';
  const LOCK_SVG_AMBER =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="10.5" width="14" height="9.5" rx="2"/><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3"/></svg>';
  const CHECK_SVG =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 12.5l5 5L19.5 7"/></svg>';

  const TIER1 = [
    ["Spicy Miso Ramen", "Combo", "$20.00"],
    ["Creamy Ramen", "Top Pick", "$20.00"],
    ["Zen Ramen", "Ordered", "$18.00"],
    ["Shoyu Classic", "", "$17.00"],
    ["Garlic Tonkotsu", "Top Pick", "$21.00"],
    ["Yuzu Shio", "New", "$19.00"],
  ];
  const TIER2 = [
    ["Wagyu Truffle Ramen", "Platinum", "$42.00"],
    ["Uni Butter Ramen", "Platinum", "$38.00"],
    ["Lobster Paitan", "Platinum", "$36.00"],
    ["King Crab Tsukemen", "Platinum", "$45.00"],
    ["A5 Beef Bowl", "Platinum", "$40.00"],
    ["Golden Broth Special", "Platinum", "$34.00"],
  ];

  const card = ([name, tag, price], locked) => `
    <div class="td-card">
      <div class="td-ph">${locked ? `<span class="td-badge">${LOCK_SVG}</span>` : ""}</div>
      <div class="td-name">${name}</div>
      ${tag ? `<span class="td-tag">${tag}</span>` : ""}
      <div class="td-rowb"><span class="td-price">${price}</span><button class="td-add" aria-label="Add ${name}">+</button></div>
    </div>`;

  root.innerHTML = `
    <div class="td">
      <div class="td-top">
        <div class="td-logo"><span class="td-logomark"></span>peblla</div>
        <div class="td-topright">
          <span class="td-table">#A62</span>
          <span class="td-timer">1:23:45</span>
        </div>
      </div>
      <div class="td-body">
        <div class="td-menu" tabindex="0">
          <div class="td-tabs">
            <span class="td-tab on">Full Menu</span>
            <span class="td-tab">Drink Menu</span>
            <span class="td-tab">Dessert</span>
          </div>
          <section class="td-tier" data-tier="1">
            <p class="td-kicker">Full Menu</p>
            <h4>Tier 1 &middot; Signature</h4>
            <div class="td-note"><strong>Limit:</strong> 3 items per round of ordering, 4 items total from this category</div>
            <div class="td-grid">${TIER1.map((d) => card(d, false)).join("")}</div>
          </section>
          <section class="td-tier td-locked" data-tier="2">
            <p class="td-kicker">Full Menu</p>
            <h4>Tier 2 &middot; Platinum</h4>
            <div class="td-lockbar">
              ${LOCK_SVG_AMBER}
              <span class="td-lockmsg">This menu is available for Platinum members. Please contact your server to unlock.</span>
              <button class="td-unlock">Unlock</button>
            </div>
            <div class="td-grid">${TIER2.map((d) => card(d, true)).join("")}</div>
          </section>
        </div>
        <aside class="td-cart">
          <div class="td-cart-head">Shopping Cart (<span class="td-count">2</span>)<span class="td-clear">Clear Cart</span></div>
          <div class="td-cart-item"><span class="td-cart-thumb"></span><div><b>Spicy Miso Ramen</b><span>Extra Lava Egg &times;1</span></div></div>
          <div class="td-cart-item"><span class="td-cart-thumb"></span><div><b>Creamy Ramen</b><span>Buy 1 Get 1 &minus;$10.00</span></div></div>
          <button class="td-submit">Submit</button>
          <div class="td-order"><span>My Order</span><b class="td-total">$40.00</b></div>
        </aside>
      </div>
    </div>
    <span class="demo-hint">${T.hint}</span>
    <button class="demo-replay" hidden>${T.replay}</button>`;

  const menu = root.querySelector(".td-menu");
  const tier2 = root.querySelector('.td-tier[data-tier="2"]');
  const lockbar = root.querySelector(".td-lockbar");
  const lockmsg = root.querySelector(".td-lockmsg");
  const unlockBtn = root.querySelector(".td-unlock");
  const replayBtn = root.querySelector(".demo-replay");
  const countEl = root.querySelector(".td-count");
  const totalEl = root.querySelector(".td-total");
  const LOCK_MSG = lockmsg.textContent;
  let count = 2;
  let total = 40;

  // pulse the lock banner the first time the locked tier scrolls into view
  const seen = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting && tier2.classList.contains("td-locked")) {
        lockbar.classList.add("td-attn");
        seen.disconnect();
      }
    },
    { root: menu, threshold: 0.35 }
  );
  seen.observe(tier2);

  unlockBtn.addEventListener("click", () => {
    unlockBtn.disabled = true;
    unlockBtn.textContent = "Unlocking…";
    setTimeout(() => {
      tier2.classList.remove("td-locked");
      lockbar.classList.add("td-done");
      lockbar.classList.remove("td-attn");
      lockmsg.innerHTML = `${CHECK_SVG} Platinum menu unlocked — enjoy!`;
      replayBtn.hidden = false;
    }, 650);
  });

  replayBtn.addEventListener("click", () => {
    tier2.classList.add("td-locked");
    lockbar.classList.remove("td-done");
    lockmsg.textContent = LOCK_MSG;
    unlockBtn.disabled = false;
    unlockBtn.textContent = "Unlock";
    replayBtn.hidden = true;
  });

  // + buttons: bump the cart (locked tier's buttons are pointer-events: none)
  root.querySelectorAll(".td-add").forEach((btn) => {
    const price = parseFloat(
      btn.closest(".td-card").querySelector(".td-price").textContent.replace("$", "")
    );
    btn.addEventListener("click", () => {
      count += 1;
      total += price;
      countEl.textContent = count;
      totalEl.textContent = `$${total.toFixed(2)}`;
      btn.classList.remove("td-popped");
      void btn.offsetWidth; // restart the pop animation
      btn.classList.add("td-popped");
    });
  });
})();
