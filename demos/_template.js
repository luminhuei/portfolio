/* ---------------------------------------------------------------------------
   _template.js — starting point for a new interactive figure. NOT loaded by
   any page; copy to demos/{case}-{nn}-{slug}.js and fill in the blanks.
   See DEMOS.md for the full SOP.

   {case}-{nn}-{slug} — one-line description of the moment this figure shows.
   Native {W}x{H} from Figma frame {node-id}, scaled to fit the stage.
--------------------------------------------------------------------------- */
(function () {
  const root = document.getElementById("demo-{case}-{nn}-{slug}");
  if (!root) return;

  /* localized corner hint (en page / zh page) — and it must describe the
     ACTUAL mode: reduced-motion users get the static, manually operable
     version, so tell them it's interactive, not auto-playing */
  const zh = (document.documentElement.lang || "").startsWith("zh");
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const T = {
    hint: reduced
      ? (zh ? "可互動 — …" : "Interactive — …")
      : (zh ? "自動播放 — …" : "Auto-plays — …"),
  };

  /* build the device at its NATIVE design size, using the exact Figma tokens.
     Pick a short unique class prefix per demo (tablet demos use tdv-). */
  root.innerHTML = `
    <div class="demo-stage">
      <div class="xxx">
        <!-- device markup at native {W}x{H}; images stay gray placeholders
             until real assets are approved for the public site -->
      </div>
    </div>
    <span class="demo-hint">${T.hint}</span>`;

  const stage = root.querySelector(".demo-stage");
  const device = root.querySelector(".xxx");

  /* scale the native box to the stage width. ALL of this demo's CSS goes in
     demos/demos.css (own prefix section, no separate file); the device class
     contract there is:
       .xxx { position:absolute; top:0; left:0;        <- never widens the page
              width:{W}px; height:{H}px;
              transform-origin:top left;               <- else the scale drifts
              background:#fff; border-radius:18px; overflow:hidden;
              box-shadow:0 30px 70px rgba(18,18,18,.22), 0 6px 18px rgba(18,18,18,.1); }
     and add your prefix's rules to the @media (prefers-reduced-motion) block
     (transition:none / animation:none / scroll-behavior:auto). */
  const W = 1194, H = 834; // native design size from Figma
  const fit = () => {
    const s = stage.clientWidth / W;
    device.style.transform = `scale(${s})`;
    stage.style.height = `${Math.round(H * s)}px`;
  };
  new ResizeObserver(fit).observe(stage);
  fit();

  /* ---- the figure's own interaction / auto-play loop goes here ----
     Conventions:
     - const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
     - pause while off screen:
         let onStage = true;
         new IntersectionObserver(([e]) => (onStage = e.isIntersecting),
           { threshold: 0.3 }).observe(stage);
     - if (!reduced) startLoop();  // reduced motion gets the static version
  */
})();
