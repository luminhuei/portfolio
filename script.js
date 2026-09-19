// Reveal elements as they enter the viewport
const observer = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    }
  },
  { threshold: 0.15 }
);

document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

// ---------------------------------------------------------------------------
// Hero entrance timeline (ms after load): intro → headline → positioning →
// projects hint, then the chat bar arrives late, then its hint chips.
// Tweak BAR_DELAY / CHIPS_DELAY to taste.
// ---------------------------------------------------------------------------
const BAR_DELAY = 1600;
const CHIPS_DELAY = 2400;
[
  [".hero-intro", 200],
  [".hero-title", 500],
  [".hero-current", 850],
  [".hero-scroll", 1200],
  [".minagpt .chat-bar", BAR_DELAY],
  [".minagpt .chat-chips", CHIPS_DELAY],
].forEach(([sel, t]) => {
  const el = document.querySelector(sel);
  if (el) setTimeout(() => el.classList.add("visible"), t);
});

// ---------------------------------------------------------------------------
// Hero: colorful skill pills rain down from above, hit the floor at the bottom
// of the screen, pile up, and can be grabbed and thrown (Matter.js physics).
// ---------------------------------------------------------------------------
const pillIcon = (paths, filled) =>
  `<svg viewBox="0 0 24 24" fill="${filled ? "currentColor" : "none"}" stroke="${filled ? "none" : "currentColor"}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>`;

const PILLS = [
  { t: "Branding", bg: "#ff894a", svg: pillIcon('<path d="M12 3v3.5M12 17.5V21M3 12h3.5M17.5 12H21M5.9 5.9l2.5 2.5M15.6 15.6l2.5 2.5M18.1 5.9l-2.5 2.5M8.4 15.6l-2.5 2.5"/>') },
  { t: "", bg: "#fbe58d", dot: true, svg: pillIcon('<path d="M12 3c.6 4.5 2.5 6.4 7 7-4.5.6-6.4 2.5-7 7-.6-4.5-2.5-6.4-7-7 4.5-.6 6.4-2.5 7-7z"/>', true) },
  { t: "", bg: "#a3d9ff", dot: true, svg: pillIcon('<path d="M5 12.5l4.5 4.5L19 7.5"/>') },
  { t: "", bg: "#ff894a", dot: true, svg: pillIcon('<path d="M9 18V6l8-2v12"/><circle cx="6.8" cy="18" r="2.2" fill="currentColor" stroke="none"/><circle cx="14.8" cy="16" r="2.2" fill="currentColor" stroke="none"/>') },
  { t: "Visual design", bg: "#d9c9ff", svg: pillIcon('<path d="M4 20l1-4L16.5 4.5a2.1 2.1 0 0 1 3 3L8 19l-4 1z"/><path d="M14.5 6.5l3 3"/>') },
  { t: "User testing", bg: "#fdcf00", svg: pillIcon('<circle cx="12" cy="12" r="8.5"/><path d="M9 14c1 1.4 5 1.4 6 0"/><path d="M9.5 9.8h.01M14.5 9.8h.01"/>') },
  { t: "Design systems", bg: "#5adba5", svg: pillIcon('<path d="M9.5 4l-2 16M16.5 4l-2 16M4.5 9h16M3.5 15h16"/>') },
  { t: "0 → 1 launches", bg: "#a3d9ff", svg: pillIcon('<path d="M3.5 17l5.5-5.5 4 4L20.5 7"/><path d="M14.5 7h6v6"/>') },
  { t: "B2B & B2C", bg: "#fbcfe8", svg: pillIcon('<circle cx="12" cy="12" r="8.5"/><ellipse cx="12" cy="12" rx="4" ry="8.5"/><path d="M3.5 12h17"/>') },
  { t: "Prototyping", bg: "#f4f4f5", svg: pillIcon('<path d="M3 7h4l10 10h4"/><path d="M18.5 14.5L21 17l-2.5 2.5"/><path d="M3 17h4l3-3"/><path d="M14 10l3-3h4"/><path d="M18.5 4.5L21 7l-2.5 2.5"/>') },
  { t: "Data dashboards", bg: "#d9f99d", svg: pillIcon('<path d="M5 20v-9M12 20V4M19 20v-6"/>') },
  { t: "", bg: "#f4f4f5", dot: true, svg: pillIcon('<path d="M12 4v16M5.1 8l13.8 8M18.9 8L5.1 16"/>') },
];

(function initPills() {
  const wrap = document.querySelector(".pills");
  if (!wrap || typeof Matter === "undefined") return;
  const { Engine, Bodies, Body, Composite } = Matter;

  const W = () => wrap.clientWidth;
  const H = () => wrap.clientHeight;
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const config = matchMedia("(max-width: 560px)").matches
    ? PILLS.filter((p) => !p.dot).slice(0, 6)
    : PILLS;

  const engine = Engine.create({ enableSleeping: true });
  const world = engine.world;

  const wallOpts = { isStatic: true, friction: 0.9, restitution: 0.1 };
  const floor = Bodies.rectangle(W() / 2, H() + 30, W() * 4, 60, wallOpts);
  const leftWall = Bodies.rectangle(-30, H() / 2, 60, H() * 6, wallOpts);
  const rightWall = Bodies.rectangle(W() + 30, H() / 2, 60, H() * 6, wallOpts);
  Composite.add(world, [floor, leftWall, rightWall]);

  const items = [];
  let ball = null; // the gray dot behaves like a bouncing arcade ball
  config.forEach((p, i) => {
    const el = document.createElement("div");
    const isBall = !reduceMotion && p.dot && p.bg === "#f4f4f5";
    el.className =
      "pill" + (p.dot ? " pill-dot" : "") + (isBall ? " pill-ball" : "");
    el.innerHTML = (p.t ? `<span>${p.t}</span>` : "") + p.svg;
    el.style.background = p.bg;
    wrap.appendChild(el);
    const w = el.offsetWidth;
    const h = el.offsetHeight;
    // scatter horizontally, stagger vertically so they rain down in sequence
    const x = (0.1 + 0.8 * ((i * 0.618034) % 1)) * W();
    const y = reduceMotion ? H() - h / 2 - 4 : -(150 + i * 170);
    const body = Bodies.rectangle(x, y, w, h, {
      chamfer: { radius: Math.min(w, h) / 2 - 1 },
      restitution: 0.65, // springy: bounce a few times on landing, like a sponge
      friction: 0.4,
      frictionAir: 0.015,
      angle: (Math.random() - 0.5) * 0.5,
      density: 0.002,
    });
    Composite.add(world, body);
    const it = { el, body, w, h };
    items.push(it);
    if (isBall) ball = it;
    makeGrabbable(el, body);
  });

  // Turn the gray dot into a perpetual bouncing ball: no gravity, no friction,
  // full restitution, constant speed. It ricochets off the walls and knocks
  // the other pills around. A ball-only ceiling (via collision filtering) keeps
  // it inside the hero while the other pills still rain in from above.
  const CAT_PILL = 0x0001,
    CAT_BALL = 0x0002,
    CAT_CEIL = 0x0004;
  const grav = engine.gravity || world.gravity || { y: 1, scale: 0.001 };
  const gCancel = grav.y * (grav.scale != null ? grav.scale : 0.001);
  const BALL_SPEED = 4.8;
  let ceiling = null;
  if (ball) {
    const b = ball.body;
    b.restitution = 1;
    b.friction = 0;
    b.frictionStatic = 0;
    b.frictionAir = 0;
    b.collisionFilter = { category: CAT_BALL, mask: CAT_PILL | CAT_CEIL, group: 0 };
    Body.setDensity(b, 0.005); // a touch heavier so it can shove pills around
    ceiling = Bodies.rectangle(W() / 2, -30, W() * 4, 60, {
      isStatic: true,
      friction: 0,
      restitution: 1,
      collisionFilter: { category: CAT_CEIL, mask: CAT_BALL },
    });
    Composite.add(world, ceiling);
    Body.setPosition(b, { x: W() * 0.5, y: H() * 0.5 });
    Body.setVelocity(b, { x: BALL_SPEED * 0.8, y: BALL_SPEED * 0.6 });

    // When the ball strikes a pill, wake it and pop it away from the ball with a
    // little lift + spin — otherwise settled pills sleep and ignore the hit.
    Matter.Events.on(engine, "collisionStart", (evt) => {
      for (const pair of evt.pairs) {
        const other =
          pair.bodyA === b ? pair.bodyB : pair.bodyB === b ? pair.bodyA : null;
        if (!other || other.isStatic) continue;
        Matter.Sleeping.set(other, false);
        const dx = other.position.x - b.position.x;
        const dy = other.position.y - b.position.y;
        const d = Math.hypot(dx, dy) || 1;
        const KICK = 3.6;
        Body.setVelocity(other, {
          x: other.velocity.x + (dx / d) * KICK,
          y: other.velocity.y + (dy / d) * KICK - 1.4, // slight upward pop
        });
        Body.setAngularVelocity(
          other,
          other.angularVelocity + (Math.random() - 0.5) * 0.35
        );
      }
    });

    // Ball-only obstacles: the floating navigation pieces and the MinaGPT ask
    // bar act as walls for the ball. They live only in the ball's collision
    // world — falling pills still rain straight through them. The navbar is
    // fixed to the viewport, so obstacle positions re-sync on scroll/resize.
    const OBSTACLES = [".nav-logo", ".topbar .nav", ".nav-mail", ".minagpt .chat-bar"];
    const obstacleBodies = [];
    const syncObstacles = () => {
      const wr = wrap.getBoundingClientRect();
      OBSTACLES.forEach((sel, i) => {
        const el = document.querySelector(sel);
        if (!el) return;
        const rc = el.getBoundingClientRect();
        if (rc.width < 4 || rc.height < 4) return;
        const cx = rc.left - wr.left + rc.width / 2;
        const cy = rc.top - wr.top + rc.height / 2;
        let ob = obstacleBodies[i];
        // rebuild if the element was resized (e.g. viewport change)
        if (ob && (Math.abs(ob.w - rc.width) > 2 || Math.abs(ob.h - rc.height) > 2)) {
          Composite.remove(world, ob.body);
          ob = obstacleBodies[i] = null;
        }
        if (!ob) {
          obstacleBodies[i] = {
            w: rc.width,
            h: rc.height,
            body: Bodies.rectangle(cx, cy, rc.width, rc.height, {
              isStatic: true,
              friction: 0,
              restitution: 1,
              chamfer: { radius: Math.min(rc.width, rc.height) / 2 - 1 },
              collisionFilter: { category: CAT_CEIL, mask: CAT_BALL },
            }),
          };
          Composite.add(world, obstacleBodies[i].body);
        } else {
          Body.setPosition(ob.body, { x: cx, y: cy });
        }
      });
    };
    syncObstacles();
    // entrance animations translate these elements into place — re-sync a few
    // times until the hero timeline (chat bar arrives ~1.6s) has settled
    [600, 1400, 2600, 4000].forEach((t) => setTimeout(syncObstacles, t));
    window.addEventListener("scroll", syncObstacles, { passive: true });
    window.addEventListener("resize", syncObstacles);
  }

  // Called around each physics step to keep the ball perpetual and lively.
  const maintainBall = (phase) => {
    if (!ball || ball.el.classList.contains("held")) return;
    const b = ball.body;
    if (phase === "pre") {
      Matter.Sleeping.set(b, false);
      Body.applyForce(b, b.position, { x: 0, y: -b.mass * gCancel }); // cancel gravity
      return;
    }
    // post-step: renormalize to a constant speed, avoid a vertical-only path
    let vx = b.velocity.x,
      vy = b.velocity.y;
    const sp = Math.hypot(vx, vy);
    if (sp < 0.01) {
      vx = BALL_SPEED;
      vy = -BALL_SPEED * 0.6;
    } else if (Math.abs(vx) < 0.18 * sp) {
      vx = (vx >= 0 ? 1 : -1) * 0.18 * sp;
    }
    const k = BALL_SPEED / Math.hypot(vx, vy);
    Body.setVelocity(b, { x: vx * k, y: vy * k });
    // safety net: never let a fast frame tunnel the ball out of the box
    const r = Math.min(ball.w, ball.h) / 2;
    const x = b.position.x,
      y = b.position.y;
    const nx = Math.max(r, Math.min(W() - r, x));
    const ny = Math.max(r, Math.min(H() - r, y));
    if (nx !== x || ny !== y) {
      Body.setPosition(b, { x: nx, y: ny });
      Body.setVelocity(b, {
        x: nx !== x ? -b.velocity.x : b.velocity.x,
        y: ny !== y ? -b.velocity.y : b.velocity.y,
      });
    }
  };

  const sync = () => {
    for (const it of items) {
      const { x, y } = it.body.position;
      it.el.style.transform = `translate3d(${x - it.w / 2}px, ${y - it.h / 2}px, 0) rotate(${it.body.angle}rad)`;
    }
  };

  // expose a hook so the sim can be stepped manually (tests, debugging)
  window.__pills = { engine, sync };

  if (reduceMotion) {
    for (let i = 0; i < 30; i++) Engine.update(engine, 16.6);
    sync();
    return;
  }

  let running = false;
  let raf = null;
  let last = performance.now();
  const loop = (t) => {
    maintainBall("pre");
    Engine.update(engine, Math.min(16.6, t - last));
    last = t;
    maintainBall("post");
    sync();
    if (running) raf = requestAnimationFrame(loop);
  };
  new IntersectionObserver(([entry]) => {
    running = entry.isIntersecting;
    cancelAnimationFrame(raf);
    if (running) {
      last = performance.now();
      raf = requestAnimationFrame(loop);
    }
  }).observe(wrap);

  window.addEventListener("resize", () => {
    Body.setPosition(floor, { x: W() / 2, y: H() + 30 });
    Body.setPosition(rightWall, { x: W() + 30, y: H() / 2 });
    if (ceiling) Body.setPosition(ceiling, { x: W() / 2, y: -30 });
  });

  function makeGrabbable(el, body) {
    let down = false;
    let lastP = null;
    let vel = { x: 0, y: 0 };
    const toLocal = (e) => {
      const r = wrap.getBoundingClientRect();
      return {
        x: Math.min(W() - 20, Math.max(20, e.clientX - r.left)),
        y: Math.min(H() - 20, Math.max(-200, e.clientY - r.top)),
      };
    };

    el.addEventListener("pointerdown", (e) => {
      down = true;
      el.setPointerCapture(e.pointerId);
      el.classList.add("held");
      lastP = { ...toLocal(e), t: performance.now() };
      vel = { x: 0, y: 0 };
      Matter.Sleeping.set(body, false);
      e.preventDefault();
    });

    el.addEventListener("pointermove", (e) => {
      if (!down) return;
      const p = toLocal(e);
      const now = performance.now();
      const dt = Math.max(1, now - lastP.t);
      vel = { x: ((p.x - lastP.x) / dt) * 16, y: ((p.y - lastP.y) / dt) * 16 };
      Matter.Sleeping.set(body, false);
      Body.setPosition(body, p);
      Body.setVelocity(body, { x: 0, y: 0 });
      Body.setAngularVelocity(body, 0);
      lastP = { ...p, t: now };
    });

    const release = () => {
      if (!down) return;
      down = false;
      el.classList.remove("held");
      // wake the body up, then fling it with the velocity the pointer had —
      // a sleeping body ignores velocity and would hang frozen in the air
      Matter.Sleeping.set(body, false);
      Body.setVelocity(body, {
        x: Math.max(-25, Math.min(25, vel.x)),
        y: Math.max(-25, Math.min(25, vel.y)),
      });
    };
    el.addEventListener("pointerup", release);
    el.addEventListener("pointercancel", release);
  }
})();

// ---------------------------------------------------------------------------
// MinaGPT — plan A: a fully static preview. No API keys, no network calls;
// answers are pre-written and keyword-matched. Upgraded to a real AI later
// via a Cloudflare Worker proxy (plan B) once the case studies are final.
// ---------------------------------------------------------------------------
(function initMinaGPT() {
  const box = document.querySelector(".minagpt");
  const screen = document.querySelector(".chat-screen");
  if (!box || !screen) return;
  const log = screen.querySelector(".chat-log");
  const scroll = screen.querySelector(".chat-scroll");
  const heroForm = box.querySelector(".chat-bar");
  const heroInput = box.querySelector(".chat-input");
  const screenForm = screen.querySelector(".chat-screen-bar .chat-bar");
  const screenInput = screenForm.querySelector(".chat-input");
  const closeBtn = screen.querySelector(".chat-close");

  const openChat = () => {
    screen.hidden = false;
    document.body.classList.add("chat-open");
    screenInput.focus();
  };
  const closeChat = () => {
    screen.hidden = true;
    document.body.classList.remove("chat-open");
  };

  // Persona: Mina's account manager. Every rule carries 2-3 phrasings picked
  // at random. `follow` is an optional ask-back the agent types as a second
  // bubble (role / industry elicitation — the visitor's reply lands in
  // Discord); `next` are the contextual chips offered after the answer, so
  // the conversation always has somewhere to go. Facts confirmed by Mina
  // 2026-09-19: 750+ restaurants, 10 years, 8 A'Design total (3 Gong cha-era),
  // 700+ daily dashboard operators, 14 exhibitions / 5 countries.
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

  // Never answer these — Mina's call. Falls straight to the fallback.
  const GUARD = /visa|sponsor|authoriz|green ?card|签证|簽證|工作許可|工作簽/i;

  const CHIPS_INTEREST = ["Design systems", "0→1 products", "B2B & data", "Brand"];
  const CHIPS_INDUSTRY = ["Restaurants & hospitality", "Retail / e-commerce", "B2B SaaS", "Something else"];

  const ANSWERS = [
    { id: "greeting", match: /^(hi+|hello+|hey+|yo|howdy|嗨|你好|哈囉)\b/i, a: [
      "Hey hey, welcome! I’m MinaGPT — Mina’s always-on agent 😄 Ask me about her work, her process, her education, her awards… or grab a question below 👇",
      "Hello! You’ve reached Mina’s front desk. I can talk products, process, background and awards all day — what would you like to know?",
      "Hi there! I’m the talkative part of this portfolio. Try me on anything about Mina — her work, her story, her awards 👇",
    ], next: ["What has Mina shipped?", "What’s her education?", "What makes her different?"] },
    { id: "sys", match: /design ?system|component librar/i, a: [
      "Design systems are her favorite deliverable: Mobile POS runs on one component set that covers bright front-of-house and dim back-of-house — and the team has extended it without her since. Start with the Mobile POS case.",
      "She builds systems that outlive her — semantic tokens, variant architecture, components a whole team can ship with. Mobile POS and Brand Guidelines show it best.",
    ], next: ["See it in Mobile POS?", "The brand side?", "Her other products?"] },
    { id: "zero", match: /0 ?(→|->|to) ?1|zero.?to.?one|from scratch|0到1|從零/i, a: [
      "0→1 is her home turf: Points Alliance went from raw idea to funded Phase 2 — 643 cross-brand members in the pilot. She designs the system first, then every primary screen.",
      "She’s done 0→1 the hard way — new product, new mental model (a dual-ledger loyalty currency), real pilot, real numbers. Points Alliance is the case to read.",
    ], next: ["Tell me about Points Alliance", "Her other products?", "Contact her?"] },
    { id: "ind-rest", match: /restaurant|hospitality|food|餐飲|餐廳/i, a: [
      "Then she’s literally your person 😄 Ten years in food & hospitality: Gong cha’s US digital journey, then Peblla’s whole restaurant platform — POS, tablets, loyalty, dashboards. Start anywhere below, it’s all relevant.",
      "Perfect match — restaurants are her home field. The entire Peblla platform (750+ restaurants) and Gong cha’s brand-to-app journey are on this site. Dig in 👇",
    ], next: ["Tell me about Mobile POS", "The ordering tablet?", "Contact her?"] },
    { id: "ind-retail", match: /retail|e.?commerce|shop|零售|電商/i, a: [
      "Great fit: Gong cha is retail F&B — app ordering, rewards, 30 stores across California. And Points Alliance is cross-brand loyalty, pure retail mechanics. Those two first.",
      "Retail runs on repeat purchase, and that’s her specialty — ordering flows, rewards loops, cross-brand loyalty. Start with Points Alliance.",
    ], next: ["Points Alliance?", "What has she shipped?", "Contact her?"] },
    { id: "ind-saas", match: /saas/i, a: [
      "Then you’ll want the Analytics Dashboard case — B2B SaaS through and through: 700+ operators daily, reports assembled from components. The design-system story inside Mobile POS is the bonus track.",
      "B2B is where her systems thinking shines: a report center 700+ operators open every day, built so new reports are assembled, not redesigned. Dashboard case first.",
    ], next: ["The analytics dashboard?", "Design systems?", "Contact her?"] },
    { id: "ind-else", match: /something else|other industr|其他/i, a: [
      "Variety is her thing — she’s covered everything from chemistry labs to bubble tea 😄 Tell me more about what you’re building, or email her: luminhuei@gmail.com — she loves a new industry.",
      "Even better — she picks up new domains fast (ask her about going from cosmetics chemistry to restaurant tech). Tell me more, or take it straight to luminhuei@gmail.com.",
    ], next: ["What has she shipped?", "Contact her?"] },
    { id: "hiring", match: /hiring|looking for|we need|our team|open role|role is|在找|招聘|徵才/i, a: [
      "Noted — literally, I take notes 😉 Fastest next step: email luminhuei@gmail.com with the role, she replies fast. Meanwhile, tell me what you care most about and I’ll match a case study:",
      "That sounds like a conversation Mina would enjoy. Drop her a line at luminhuei@gmail.com — and pick what matters most to you below, I’ll point you at the right case:",
    ], next: CHIPS_INTEREST },
    { id: "pos", match: /pos|handheld|tableside|checkout/i, a: [
      "The handheld Mobile POS is her flagship: designed handheld-first, not a shrunken desktop. Three months after launch, 64% of checkouts had moved tableside. The full case study is one scroll away.",
      "Ah, the Mobile POS — my favorite pitch 😄 A complete point-of-sale on a screen a server runs one-handed mid-service. 64% of checkouts moved tableside within three months of launch.",
      "She built a POS that fits in a server’s pocket — and restaurants actually switched: 64% of checkouts left the counter within three months. The Mobile POS case study has the whole story.",
    ], next: ["The design system behind it?", "Her design process?", "Her other products?"] },
    { id: "points", match: /point|loyalt|alliance|reward|member/i, a: [
      "Points Alliance is her 0→1 cross-brand loyalty MVP (2025): one alliance currency up front, a dual ledger behind, so brands lose nothing. 643 members placed cross-brand orders and 36,361+ points were redeemed in the pilot.",
      "That one’s clever: a loyalty program shared by independent restaurant brands, without anyone surrendering their member base. The pilot proved it — 643 members crossed brand lines to order.",
      "Her Points Alliance app lets restaurant brands share one rewards currency while keeping their books separate. 643 cross-brand members in the pilot — hypothesis validated, Phase 2 funded.",
    ], next: ["How does she do 0→1?", "Her other products?", "Contact her?"] },
    { id: "dashboard", match: /dashboard|analytic|report|data/i, a: [
      "She designed the UI and design system for a B2B analytics report center that 700+ store operators open every day — built for trust-at-a-glance, numbers that read as answers.",
      "The Analytics Dashboard: 700+ restaurant operators check it daily. Her rule for it was “numbers should read as answers” — no decoration, just decisions.",
      "A B2B report center used daily by 700+ operators, structured so a new report is assembled from existing components instead of designed from scratch. Very Mina: systems over one-offs.",
    ], next: ["The design system story?", "Her other products?", "Is she open to freelance?"] },
    { id: "tablet", match: /tablet|ayce|self.?order/i, a: [
      "The self-ordering tablet was built for all-you-can-eat restaurants — and in usability testing, 5 out of 5 untrained users completed the whole ordering flow unaided. Zero-training UX, literally.",
      "Guests order round after round on it without ever calling a server — 5 of 5 first-time users sailed through testing unaided. That case study is a fun one.",
      "It’s an ordering tablet a first-time guest can use with zero instructions: 5/5 untrained users completed the full flow in testing, and it now runs the all-you-can-eat format.",
    ], next: ["Her design process?", "Her other products?", "Contact her?"] },
    { id: "education", match: /education|degree|school|university|college|(?<!case )stud(y|ied)|mfa|master|bootcamp|certificat/i, a: [
      "She holds an MFA in Graphic Design from Academy of Art University (2016–2020) and a B.S. in Cosmetics Chemistry from Providence University — plus UC Berkeley Extension bootcamps in UX/UI (2020) and Digital Marketing (2022), and an eCornell Women’s Entrepreneurship Certificate (2025).",
      "Formally trained and then some 😄 MFA in Graphic Design (Academy of Art University, 2016–2020), a chemistry B.S. (Providence University — yes, really), UC Berkeley Extension bootcamps in UX/UI and Digital Marketing, and an eCornell Women’s Entrepreneurship Certificate (2025).",
      "Her path: B.S. in Cosmetics Chemistry → MFA in Graphic Design (Academy of Art University, 2016–2020) → UC Berkeley Extension UX/UI and Digital Marketing bootcamps → eCornell Women’s Entrepreneurship Certificate (2025). A scientist’s rigor with a designer’s eye.",
    ], next: ["Her awards?", "What has she shipped?", "How do I contact her?"] },
    { id: "awards", match: /award|recognition|prize|winning|exhibit|press|media|featured/i, a: [
      "8 A’Design Awards (2020–2024) across web design and visual communication, and her work has shown in 14 international design exhibitions across 5 countries. Press-wise: LA Weekly, Haute Living, Tech Times and Digital Journal have all covered her.",
      "She’s got hardware: 8 A’Design Awards between 2020 and 2024, 14 exhibitions across 5 countries, and features in LA Weekly, Haute Living, Tech Times and Digital Journal. Not bad for someone this easy to work with 😄",
      "8 international A’Design Awards, 14 design exhibitions across 5 countries, plus interviews in LA Weekly, Haute Living, Tech Times and Digital Journal. The About page’s Recognition section has the full record.",
    ], next: ["The brand work behind them?", "Her background?", "Contact her?"] },
    { id: "remote", match: /where|location|located|based|remote|relocat|city|time ?zone|timezone/i, a: [
      "She’s open to any fully remote opportunity — that’s the headline. For anything more specific, email her at luminhuei@gmail.com.",
      "Fully remote works beautifully for her — she’s open to any fully remote role. Want specifics? luminhuei@gmail.com is the fastest route.",
      "The short version: open to any fully remote opportunity. She keeps the details for real conversations — luminhuei@gmail.com 😊",
    ], next: ["Is she open to freelance?", "When can she start?", "How do I contact her?"] },
    { id: "freelance", match: /freelance|contract|part.?time|consult|gig|engagement/i, a: [
      "Yes! She’s open to freelance of any length — short, mid, long-term, and contract engagements. Email luminhuei@gmail.com with what you have in mind.",
      "Freelance, contract, short or long — all on the table. She’s taken projects from quick sprints to long engagements. Reach her at luminhuei@gmail.com.",
      "Absolutely: freelance and contract work of any length is welcome. Tell her about the project — luminhuei@gmail.com.",
    ], next: ["Fully remote?", "When can she start?", "Contact her?"] },
    { id: "availability", match: /availab|start date|when can|when could|how soon|notice period/i, a: [
      "Best answer: email Mina at luminhuei@gmail.com and she’ll get back to you — she’s quick.",
      "That’s a conversation for the boss 😄 Drop her a line at luminhuei@gmail.com and she’ll get back to you directly.",
      "I don’t manage her calendar (thankfully) — email luminhuei@gmail.com and she’ll reply herself.",
    ], next: ["How do I contact her?", "Is she open to freelance?"] },
    { id: "language", match: /language|mandarin|chinese|bilingual|english|tool|figma|adobe|software|stack/i, a: [
      "She works in English and Mandarin — truly bilingual, this site included. Toolbox: Figma, Adobe Creative Suite, Framer, Webflow, Claude Code / Claude / GPT / Gemini, and Google Analytics.",
      "Two languages (English + Mandarin), one design brain. Daily tools: Figma, Adobe Creative Suite, Framer, Webflow, the AI trio — Claude Code, GPT, Gemini — and Google Analytics.",
      "Bilingual — English and Mandarin, and this whole portfolio ships in both. Tools she actually uses: Figma, Adobe CS, Framer, Webflow, Claude Code / Claude / GPT / Gemini, Google Analytics.",
    ], next: ["Her design process?", "What has she shipped?"] },
    { id: "brandwork", match: /brand|logo|identity/i, a: [
      "Brand is where she started and it never left: five years leading Gong cha’s brand & digital (140% US sales growth, 3 A’Design awards for that work), and at Peblla she wrote the brand guidelines her design system grew from.",
      "Her brand chops are the real deal — Gong cha’s US brand transformation, award-winning campaign work, and Peblla’s brand book. To her, a design system is just a brand guideline that ships.",
    ], next: ["Her design system work?", "What has she shipped?", "Her awards?"] },
    { id: "projects", match: /ship|project|work|portfolio|product|done|built|case/i, a: [
      "Four products from 2024–25: the handheld Mobile POS (64% of checkouts moved tableside), Points Alliance loyalty app (643 cross-brand members), a B2B analytics dashboard (700+ daily operators), and a zero-training self-ordering tablet. Scroll down — they’re all here ↓",
      "The short reel: a Mobile POS servers run one-handed, a cross-brand loyalty app, an analytics center 700+ operators open daily, and a tablet guests use with zero training. Every one shipped. ↓",
      "She ships. 2024–25 alone: Mobile POS, Points Alliance, Analytics Dashboard, Ordering Tablet — four surfaces of one restaurant platform, all live. The case studies below have the receipts ↓",
    ], follow: [
      "Out of curiosity — what kind of role are you hiring for? Pick what matters most and I’ll point you at the case study that’ll hit closest to home:",
      "Quick question back: what does your team care most about? Pick one and I’ll match you with the right case study — that’s literally my job 😄",
    ], next: CHIPS_INTEREST },
    { id: "different", match: /different|superpower|strength|special|unique/i, a: [
      "Her range: brand identity, UX/UI and design systems — the whole journey. She led brand & digital at Gong cha (140% US sales growth), then built restaurant tech used by 750+ restaurants at Peblla — with 8 A’Design Awards along the way.",
      "Most designers pick a lane; Mina runs the full road — from brand book to design system to shipped product. Gong cha’s US digital journey (140% sales growth) and Peblla’s platform (750+ restaurants) both carry her fingerprints.",
      "She takes a rough idea all the way to the thing that ships — brand, product, motion, systems. That range is rare, and it’s why her work reads coherent from logo to checkout flow.",
    ], follow: [
      "And you? What kind of product are you building over there? Pick the closest — I’ll tell you which of her projects rhymes with it:",
      "Curious about your side: what industry are you in? Tell me and I’ll match her work to it:",
    ], next: CHIPS_INDUSTRY },
    { id: "process", match: /process|research|method|how.*(work|design)/i, a: [
      "Outcome-first and research-driven: she starts from real operational constraints, tests with actual users — servers, store operators, first-time guests — and ships design systems so whole teams move faster.",
      "Her process in one line: watch real hands, design for the worst hour of the shift, then lock the decisions into components. Error-proof beats beautiful — though she usually gets both.",
      "Research → constraints → prototypes → real-user testing → design system. She’s big on “numbers should read as answers”, and on asking about the dining format before opening Figma.",
    ], next: ["See a case study?", "What makes her different?"] },
    { id: "contact", match: /contact|email|hire|reach|linkedin|resume|cv/i, a: [
      "Email luminhuei@gmail.com, or find her on LinkedIn at minhueilu. She’s always down for a chat ☕",
      "The direct line: luminhuei@gmail.com — or LinkedIn (minhueilu). Tell her MinaGPT sent you 😄",
      "luminhuei@gmail.com lands straight in her inbox; LinkedIn (minhueilu) works too. She replies fast.",
    ], follow: [
      "Pro tip: mention the role in your email — those get famously fast replies 😄",
      "…and if you mention the role you have in mind, I’ll make sure your note lands at the top of her inbox 😄",
    ], next: ["Is she open to freelance?", "Fully remote?"] },
    { id: "about", match: /who|about|mina|min\s?huei|background|experience|year/i, a: [
      "Min Huei Lu (Mina): product designer, 10 years across branding and UX/UI — five years leading design at Gong cha, then Peblla’s restaurant platform. B2B & B2C, brand identity to design systems, 8 international design awards.",
      "The elevator pitch: 10 years from brand to product. Gong cha (led a 5+ designer team, 140% US sales growth) → Peblla (sole designer on a platform 750+ restaurants run on). She designs the whole journey.",
      "Mina’s a product designer who started in branding and never let go of it — 10 years in, her design systems still read like brand guidelines that ship. Gong cha, then Peblla. The About page tells it best.",
    ], next: ["Her education?", "Her awards?", "What has she shipped?"] },
  ];
  const FALLBACK = [
    "Ha — that one’s outside my brief! I’m Mina’s agent, not her biographer 😄 Ask me about her work, her process, her education or her awards — or grab one of the questions below.",
    "Hmm, you’ve stumped the agent. I’m best on her products, background, education and awards — the questions below are a good place to start. Or go straight to the source: luminhuei@gmail.com",
    "That’s above my pay grade — and I work for free 😅 Try me on her work, process, education or awards, pick a question below, or email Mina at luminhuei@gmail.com",
  ];
  const FALLBACK_NEXT = ["What has Mina shipped?", "What’s her education?", "How do I contact her?"];

  const CHIPS_INTEREST_ZH = ["設計系統", "0到1 產品", "B2B 與數據", "品牌"];
  const CHIPS_INDUSTRY_ZH = ["餐飲業", "零售/電商", "B2B SaaS", "其他產業"];

  // Traditional Chinese brain for /zh/ pages (regexes match zh + en keywords)
  const ANSWERS_ZH = [
    { id: "greeting", match: /^(hi+|hello+|hey+|嗨|你好|妳好|哈囉|您好)/i, a: [
      "嗨,歡迎!我是 MinaGPT —— Mina 的全天候經紀人 😄 她的作品、流程、學歷、獎項都可以問我,或直接點下面的問題 👇",
      "你好!這裡是 Mina 的前台。產品、設計流程、背景、得獎紀錄,我都能聊 —— 想先知道什麼?",
      "哈囉!我是這個作品集裡最愛講話的部分。關於 Mina 的事儘管問 👇",
    ], next: ["Mina 做過哪些產品?", "她的學歷?", "她有什麼不同?"] },
    { id: "sys", match: /design ?system|設計系統|元件庫/i, a: [
      "設計系統是她最愛的交付物:Mobile POS 靠一套元件同時支撐明亮的外場和昏暗的內場 —— 而且團隊在她之後還能自己擴充。從 Mobile POS 案例看起。",
      "她蓋的是「離開她也能活」的系統 —— 語意化色彩、變體架構、整個團隊都能拿來出貨的元件。Mobile POS 和品牌規範兩篇最能看出來。",
    ], next: ["去看 Mobile POS?", "品牌那一面?", "其他產品?"] },
    { id: "zero", match: /0 ?(→|->|to) ?1|0到1|從零/i, a: [
      "0到1 是她的主場:積分聯盟從一個想法做到 Phase 2 獲注資 —— 試點 643 名跨品牌會員。她的做法是先設計系統,再畫每一個主畫面。",
      "她走過最硬的 0到1 —— 新產品、新心智模型(雙帳本積分貨幣)、真實試點、真實數字。就讀積分聯盟那篇。",
    ], next: ["聊聊積分聯盟", "其他產品?", "怎麼聯絡她?"] },
    { id: "ind-rest", match: /restaurant|hospitality|餐飲|餐廳/i, a: [
      "那她根本就是為你準備的 😄 十年餐飲科技:貢茶的美國數位旅程、Peblla 的整套餐廳平台 —— POS、平板、會員、儀表板。從哪篇看起都對題。",
      "完美對口 —— 餐飲就是她的主場。Peblla 全平台(750+ 家餐廳)和貢茶從品牌到 App 的旅程都在這個網站上,慢慢挖 👇",
    ], next: ["聊聊 Mobile POS", "自助點餐平板?", "怎麼聯絡她?"] },
    { id: "ind-retail", match: /retail|e.?commerce|零售|電商/i, a: [
      "很搭:貢茶就是零售餐飲 —— App 點餐、會員獎勵、加州 30 家門店;積分聯盟是跨品牌忠誠度,純零售機制。先看這兩篇。",
      "零售的命脈是回購,而回購正是她的專長 —— 點餐流程、獎勵迴圈、跨品牌會員。從積分聯盟看起。",
    ], next: ["積分聯盟?", "Mina 做過哪些產品?", "怎麼聯絡她?"] },
    { id: "ind-saas", match: /saas/i, a: [
      "那你要看的是數據儀表板 —— 純正 B2B SaaS:700+ 位營運者每天在用、報表用元件組裝而非重新設計。Mobile POS 裡的設計系統故事是加碼曲目。",
      "B2B 正是她系統思維發光的地方:一個 700+ 營運者天天開的報表中心,設計成「組裝新報表」而不是「重畫新報表」。先讀儀表板那篇。",
    ], next: ["數據儀表板?", "設計系統?", "怎麼聯絡她?"] },
    { id: "ind-else", match: /something else|其他/i, a: [
      "更好 —— 她最擅長快速進入新領域(問她怎麼從化粧品化學跳到餐飲科技的 😄)。多跟我說一點,或直接寫信:luminhuei@gmail.com,她喜歡新產業。",
      "沒問題,她的跨域紀錄很精彩 —— 從化學實驗室到珍珠奶茶都做過。跟我多說說你們在做什麼,或直接找本人:luminhuei@gmail.com。",
    ], next: ["Mina 做過哪些產品?", "怎麼聯絡她?"] },
    { id: "hiring", match: /hiring|looking for|在找|招聘|徵才|我們需要/i, a: [
      "記下了 —— 我真的會記筆記 😉 最快的下一步:把職位寫信到 luminhuei@gmail.com,她回得很快。順便告訴我你們最重視什麼,我配一篇最對題的案例:",
      "這聽起來是 Mina 會很想聊的話題。先寄一封信到 luminhuei@gmail.com —— 然後從下面挑一個你們最在意的,我幫你指路:",
    ], next: CHIPS_INTEREST_ZH },
    { id: "pos", match: /pos|手持|桌邊|結帳/i, a: [
      "手持 Mobile POS 是她的代表作:從一開始就為手持而生,不是桌機縮小版。上線三個月,64% 的結帳從櫃台移到桌邊。完整案例就在下面。",
      "啊,Mobile POS,我最愛推銷的一件 😄 一套服務生單手就能操作的完整 POS,上線三個月內 64% 結帳移到桌邊完成。",
      "她做了一台放得進服務生口袋的 POS —— 而且餐廳真的買單:三個月內 64% 的結帳離開了櫃台。故事都在 Mobile POS 案例裡。",
    ], next: ["背後的設計系統?", "她的設計流程?", "其他產品?"] },
    { id: "points", match: /point|loyalt|alliance|積分|聯盟|會員/i, a: [
      "積分聯盟是她 2025 年從 0 到 1 主導的跨品牌忠誠度 MVP:前台一種聯盟貨幣、後台雙帳本,品牌什麼都不用交出來。試點期間 643 名會員跨品牌下單、兌換 36,361+ 積分。",
      "這個案子很聰明:讓獨立餐飲品牌共用一個會員獎勵計畫,但誰都不用交出自己的會員資產。試點驗證了 —— 643 名會員真的跨品牌下單了。",
      "積分聯盟 App 讓品牌們共享一種積分貨幣、各自保有帳本。試點 643 名跨品牌會員 —— 假設驗證成功,Phase 2 已獲注資。",
    ], next: ["0到1 怎麼做?", "其他產品?", "怎麼聯絡她?"] },
    { id: "dashboard", match: /dashboard|analytic|report|報表|儀表|數據/i, a: [
      "她為 B2B 數據報表中心設計了 UI 與設計系統 —— 700+ 家門店營運者每天打開的經營窗口,核心理念是「一眼讀懂、數字誠實」。",
      "數據儀表板:700+ 位餐廳營運者每天在看。她給它的規矩是「數字要讀起來像答案」—— 不裝飾,只給決策。",
      "一個 700+ 營運者天天用的 B2B 報表中心,架構設計成「新報表用現有元件組裝」而不是每次重畫 —— 非常 Mina:系統思維優先。",
    ], next: ["設計系統的故事?", "其他產品?", "接案嗎?"] },
    { id: "tablet", match: /tablet|平板|點餐|吃到飽/i, a: [
      "自助點餐平板為吃到飽餐廳而生:正式測試中,5 位零培訓用戶全部獨立完成完整點餐流程 —— 名符其實的零學習成本。",
      "客人整餐自己點、不用叫服務生 —— 測試裡 5 位第一次用的人全數順利走完流程。那篇案例很好看,推薦。",
      "一台第一次用就會的點餐平板:測試 5/5 零培訓用戶獨立完成全流程,現在跑在吃到飽業態裡,客人整場餐期都在用它加點。",
    ], next: ["她的設計流程?", "其他產品?", "怎麼聯絡她?"] },
    { id: "education", match: /education|degree|school|university|mfa|master|學歷|教育|畢業|學校|大學|碩士|唸|念/i, a: [
      "她是舊金山藝術大學(Academy of Art University)平面設計 MFA(2016–2020),大學唸靜宜大學化粧品科學系;另有 UC Berkeley Extension 的 UX/UI(2020)與數位行銷(2022)Bootcamp,以及康乃爾 eCornell 女性創業證書(2025)。",
      "科班出身,還不只一個班 😄 平面設計 MFA(Academy of Art University,2016–2020)、化學背景的學士(靜宜大學化粧品科學系,真的!)、UC Berkeley Extension 兩個 Bootcamp(UX/UI、數位行銷),加上 eCornell 女性創業證書(2025)。",
      "她的路線:化粧品科學學士(靜宜大學)→ 平面設計 MFA(Academy of Art University,2016–2020)→ UC Berkeley Extension UX/UI 與數位行銷 Bootcamp → eCornell 女性創業證書(2025)。科學家的嚴謹,設計師的眼睛。",
    ], next: ["得過什麼獎?", "Mina 做過哪些產品?", "怎麼聯絡她?"] },
    { id: "awards", match: /award|recognition|exhibit|press|得獎|獎項|獲獎|獎(?!勵)|展覽|報導|媒體/i, a: [
      "8 座 A’Design Award(2020–2024),涵蓋網頁設計與視覺傳達;作品在 5 個國家、14 場國際設計展展出過。媒體方面:LA Weekly、Haute Living、Tech Times、Digital Journal 都報導過她。",
      "戰績很實在:2020 到 2024 拿了 8 座 A’Design Award,五個國家 14 場展覽,還有 LA Weekly、Haute Living、Tech Times、Digital Journal 的專訪。這麼好相處的人得這麼多獎,不常見 😄",
      "8 座國際 A’Design Award、五國 14 場設計展,加上四家媒體的專訪報導。About 頁的 Recognition 區有完整清單。",
    ], next: ["這些獎背後的品牌作品?", "她的背景?", "怎麼聯絡她?"] },
    { id: "remote", match: /where|location|based|remote|relocat|哪裡|在哪|城市|地點|遠端|遠距|時區|搬/i, a: [
      "重點是這個:任何全遠端的機會她都開放。更具體的細節,寫信給她:luminhuei@gmail.com。",
      "全遠端對她來說再適合不過 —— 任何 fully remote 的角色都歡迎。想談細節?最快的路是 luminhuei@gmail.com。",
      "簡短版:開放任何全遠端機會。細節她留給真正的對話 —— luminhuei@gmail.com 😊",
    ], next: ["接案嗎?", "什麼時候可以開始?", "怎麼聯絡她?"] },
    { id: "freelance", match: /freelance|contract|part.?time|接案|兼職|約聘|合約|外包/i, a: [
      "可以!長短不拘 —— 短期、中期、長期、合約案都接。把你的想法寄到 luminhuei@gmail.com。",
      "接案、約聘、短期長期都在她的範圍內 —— 從快速衝刺到長期合作她都做過。聯絡:luminhuei@gmail.com。",
      "當然歡迎:任何長度的 freelance 與合約案都可以談。跟她說說你的專案 —— luminhuei@gmail.com。",
    ], next: ["可以全遠端嗎?", "什麼時候可以開始?", "怎麼聯絡她?"] },
    { id: "availability", match: /availab|start date|when can|how soon|何時|多快|什麼時候|到職|開始上班/i, a: [
      "這題最準的答案:寫信給 Mina(luminhuei@gmail.com),她會直接回覆你 —— 她回信很快。",
      "這是老闆等級的問題 😄 寄到 luminhuei@gmail.com,她親自回覆。",
      "我不管她的行事曆(幸好)—— 請寫信到 luminhuei@gmail.com,她會盡快回覆。",
    ], next: ["怎麼聯絡她?", "接案嗎?"] },
    { id: "language", match: /language|mandarin|bilingual|tool|figma|adobe|語言|中文|英文|雙語|工具|軟體/i, a: [
      "她用英文和中文工作 —— 真.雙語,連這個網站都是兩種語言。工具箱:Figma、Adobe Creative Suite、Framer、Webflow、Claude Code / Claude / GPT / Gemini、Google Analytics。",
      "兩種語言(英文+中文),一顆設計腦。日常工具:Figma、Adobe 全家桶、Framer、Webflow、AI 三劍客(Claude Code、GPT、Gemini),還有 Google Analytics。",
      "雙語 —— 英文與中文,整個作品集也雙語出貨。她真正在用的工具:Figma、Adobe CS、Framer、Webflow、Claude Code / Claude / GPT / Gemini、Google Analytics。",
    ], next: ["她的設計流程?", "Mina 做過哪些產品?"] },
    { id: "brandwork", match: /brand|logo|品牌|識別/i, a: [
      "品牌是她的起點,而且從沒離開:五年帶領貢茶的品牌與數位(美國銷售成長 140%、3 座 A’Design 獎是貢茶作品),在 Peblla 則寫下整套品牌規範,設計系統就從那裡長出來。",
      "她的品牌功力是真材實料 —— 貢茶的美國品牌改造、得獎的 campaign、Peblla 的品牌手冊。對她來說,設計系統就是一份能出貨的品牌規範。",
    ], next: ["她的設計系統作品?", "Mina 做過哪些產品?", "得過什麼獎?"] },
    { id: "projects", match: /ship|project|work|portfolio|做過|作品|產品|專案|案例/i, a: [
      "2024–25 年四個產品:手持 Mobile POS(64% 結帳移到桌邊)、積分聯盟 App(643 名跨品牌會員)、B2B 數據儀表板(700+ 每日營運者)、零培訓自助點餐平板。往下捲就能看到 ↓",
      "精華版:一台服務生單手操作的 POS、一個跨品牌會員 App、一個 700+ 營運者天天開的數據中心、一台零教學的點餐平板。每一個都真的上線了 ↓",
      "她是會出貨的設計師。光 2024–25:Mobile POS、積分聯盟、數據儀表板、點餐平板 —— 同一個餐飲平台的四個介面,全部上線。案例就在下面 ↓",
    ], follow: [
      "好奇問一句 —— 你們在招什麼樣的角色?挑一個你們最重視的,我幫你配最對題的案例:",
      "換我問你:你們團隊最在意什麼?選一個,我來配案例 —— 這可是我的本業 😄",
    ], next: CHIPS_INTEREST_ZH },
    { id: "different", match: /different|superpower|strength|unique|不同|獨特|特別/i, a: [
      "她的跨度:品牌識別、UX/UI 到設計系統,一路走完整段旅程。在貢茶帶品牌與數位(美國銷售成長 140%),後於 Peblla 打造全美 750+ 家餐廳使用的餐飲科技 —— 途中拿下 8 座 A’Design Award。",
      "多數設計師選一條車道,Mina 開整條路 —— 從品牌手冊到設計系統到上線產品。貢茶的美國數位旅程(銷售成長 140%)和 Peblla 的平台(750+ 家餐廳)都有她的指紋。",
      "她把一個粗略的想法,一路做到真的上線 —— 品牌、產品、動態、系統。這種跨度很少見,也是為什麼她的作品從 logo 到結帳流程讀起來是同一種語言。",
    ], follow: [
      "那你呢?你們在做什麼樣的產品?挑一個最接近的,我告訴你她哪個作品跟它押韻:",
      "換我好奇了:你們是什麼產業?跟我說,我來對號入座:",
    ], next: CHIPS_INDUSTRY_ZH },
    { id: "process", match: /process|research|method|流程|方法|怎麼做/i, a: [
      "成果先行、研究驅動:從真實營運限制出發,和真實用戶一起測試(服務生、店主、第一次見到產品的客人),再用設計系統讓整個團隊跑得更快。",
      "她的流程一句話:看真實的手怎麼動、為輪班最忙的那小時設計、再把決策鎖進元件裡。「不出錯」比「好看」重要 —— 但她通常兩個都拿到。",
      "研究 → 限制 → 原型 → 真實用戶測試 → 設計系統。她的口頭禪:「數字要讀起來像答案」,還有「先問業態,再開 Figma」。",
    ], next: ["看一篇案例?", "她有什麼不同?"] },
    { id: "contact", match: /contact|email|hire|reach|linkedin|resume|cv|聯絡|聯繫|信箱|履歷/i, a: [
      "寫信到 luminhuei@gmail.com,或在 LinkedIn 搜尋 minhueilu。她隨時歡迎聊聊 ☕",
      "直達通道:luminhuei@gmail.com,LinkedIn(minhueilu)也通。跟她說是 MinaGPT 介紹的 😄",
      "luminhuei@gmail.com 直接進她的收件匣;LinkedIn(minhueilu)也可以。她回信很快。",
    ], follow: [
      "小撇步:信裡寫明職位的,回覆速度出了名的快 😄",
      "…如果信裡提一下你想談的角色,我會確保它排在她收件匣的最上面 😄",
    ], next: ["接案嗎?", "可以全遠端嗎?"] },
    { id: "about", match: /who|about|mina|min\s?huei|background|experience|背景|介紹|是誰|年資/i, a: [
      "Min Huei Lu(Mina):產品設計師,十年橫跨品牌與 UX/UI —— 貢茶五年帶設計團隊,然後是 Peblla 的餐飲平台。B2B 與 B2C,從品牌識別到設計系統,途中 8 座國際設計獎。",
      "電梯簡報版:十年,從品牌走到產品。貢茶(帶 5+ 人設計團隊、美國銷售成長 140%)→ Peblla(獨挑大樑,750+ 家餐廳在用的平台)。她設計的是完整的旅程。",
      "Mina 是從品牌出身、始終沒放掉品牌的產品設計師 —— 十年過去,她的設計系統讀起來仍像「能出貨的品牌規範」。貢茶,然後 Peblla。About 頁說得最完整。",
    ], next: ["她的學歷?", "得過什麼獎?", "Mina 做過哪些產品?"] },
  ];
  const FALLBACK_ZH = [
    "哈,這題超出我的業務範圍了 😄 我是 Mina 的經紀人,不是她的百科全書 —— 她的作品、流程、學歷、獎項都可以問,或點下面的問題試試。",
    "嗯,你考倒我了。我最擅長聊她的產品、背景、學歷跟獎項 —— 下面的問題是個好起點,或直接找本人:luminhuei@gmail.com",
    "這題我答不上來,畢竟我只是她的業務代表 😅 聊聊她的作品或得獎紀錄吧,或寫信給 Mina:luminhuei@gmail.com",
  ];
  const FALLBACK_NEXT_ZH = ["Mina 做過哪些產品?", "她的學歷?", "怎麼聯絡她?"];

  const IS_ZH = document.documentElement.lang === "zh-Hant";
  const reply = (q) => {
    const fb = IS_ZH ? FALLBACK_ZH : FALLBACK;
    const fbNext = IS_ZH ? FALLBACK_NEXT_ZH : FALLBACK_NEXT;
    if (GUARD.test(q)) return { rule: "fallback", text: pick(fb), follow: "", next: fbNext };
    const set = IS_ZH ? ANSWERS_ZH : ANSWERS;
    const hit = set.find((c) => c.match.test(q));
    if (!hit) return { rule: "fallback", text: pick(fb), follow: "", next: fbNext };
    return { rule: hit.id, text: pick(hit.a), follow: hit.follow ? pick(hit.follow) : "", next: hit.next || [] };
  };

  // one live typewriter at a time; a new question finishes the previous
  // answer instantly instead of silently swallowing the input
  let current = null;
  const finishCurrent = () => {
    if (!current) return;
    clearTimeout(current.timer);
    current.el.textContent = current.text;
    current = null;
  };

  // short per-visit id so Mina can string one visitor's Q&A into a thread
  let chatSid = "";
  try {
    chatSid = sessionStorage.getItem("pf_chat_sid") || "";
    if (!chatSid) {
      chatSid = Math.random().toString(36).slice(2, 6);
      sessionStorage.setItem("pf_chat_sid", chatSid);
    }
  } catch (e) { chatSid = "anon"; }

  const ask = (q, via) => {
    if (!q.trim()) return;
    const r = reply(q);
    // analytics: record what visitors ask (GA4 event + Clarity session tag)
    if (typeof window.gtag === "function") {
      window.gtag("event", "minagpt_question", {
        question_text: q.slice(0, 100),
        answer_rule: r.rule,
        page_path: location.pathname,
        lang: IS_ZH ? "zh" : "en",
      });
    }
    if (typeof window.clarity === "function") {
      window.clarity("set", "minagpt_question", q.slice(0, 100));
    }
    // instant Discord ping — the full exchange: question, matched rule, answer
    if (typeof window.portfolioNotify === "function") {
      window.portfolioNotify("question", {
        text: q, via: via || "typed",
        answer: r.follow ? r.text + "\n↳ " + r.follow : r.text, rule: r.rule, sid: chatSid,
      });
    }
    finishCurrent();
    const oldRow = log.querySelector(".chat-followups");
    if (oldRow) oldRow.remove();
    openChat();
    const u = document.createElement("div");
    u.className = "chat-msg chat-msg-user-row";
    const bubble = document.createElement("span");
    bubble.className = "chat-msg-user";
    bubble.textContent = q;
    u.appendChild(bubble);
    log.appendChild(u);

    const b = document.createElement("div");
    b.className = "chat-msg chat-msg-bot";
    log.appendChild(b);
    scroll.scrollTop = scroll.scrollHeight;

    typeText(b, r.text, () => {
      if (r.follow) {
        const f = document.createElement("div");
        f.className = "chat-msg chat-msg-bot";
        log.appendChild(f);
        typeText(f, r.follow, () => renderFollowups(r.next));
      } else {
        renderFollowups(r.next);
      }
    });
  };

  // sequential typewriter — onDone chains the ask-back bubble and the chips;
  // interrupting with a new question drops the chain (finishCurrent skips onDone)
  function typeText(el, text, onDone) {
    const state = { el, text, i: 0, timer: null };
    current = state;
    const tick = () => {
      if (current !== state) return;
      el.textContent = text.slice(0, ++state.i);
      scroll.scrollTop = scroll.scrollHeight;
      if (state.i < text.length) state.timer = setTimeout(tick, 14);
      else { current = null; if (onDone) onDone(); }
    };
    state.timer = setTimeout(tick, 350);
  }

  // contextual chips under the latest answer — the "what next" rail that keeps
  // the conversation rolling; only the newest answer carries one
  function renderFollowups(labels) {
    if (!labels || !labels.length) return;
    const row = document.createElement("div");
    row.className = "chat-followups";
    labels.forEach((t) => {
      const c = document.createElement("button");
      c.type = "button";
      c.className = "chip";
      c.textContent = t;
      c.addEventListener("click", () => ask(t, "chip"));
      row.appendChild(c);
    });
    log.appendChild(row);
    scroll.scrollTop = scroll.scrollHeight;
  }

  // hero chips + in-chat suggestion chips all ask on click
  document.querySelectorAll(".minagpt .chip, .chat-suggest .chip").forEach((chip) =>
    chip.addEventListener("click", () => ask(chip.textContent, "chip"))
  );

  // suggestion row: native horizontal scroll + mouse drag-to-scroll
  const suggest = screen.querySelector(".chat-suggest");
  if (suggest) {
    let down = false;
    let dragging = false;
    let startX = 0;
    let startScroll = 0;
    let moved = 0;
    suggest.addEventListener("pointerdown", (e) => {
      down = true;
      dragging = false;
      moved = 0;
      startX = e.clientX;
      startScroll = suggest.scrollLeft;
    });
    suggest.addEventListener("pointermove", (e) => {
      if (!down) return;
      const dx = e.clientX - startX;
      moved = Math.max(moved, Math.abs(dx));
      // capture only once it's clearly a drag, so plain clicks stay native
      if (!dragging && moved > 6) {
        dragging = true;
        suggest.setPointerCapture(e.pointerId);
        suggest.classList.add("dragging");
      }
      if (dragging) suggest.scrollLeft = startScroll - dx;
    });
    const up = () => {
      down = false;
      dragging = false;
      suggest.classList.remove("dragging");
    };
    suggest.addEventListener("pointerup", up);
    suggest.addEventListener("pointercancel", up);
    // a drag should not fire the chip underneath the pointer
    suggest.addEventListener(
      "click",
      (e) => {
        if (moved > 6) {
          e.preventDefault();
          e.stopPropagation();
        }
      },
      true
    );
  }

  const wireForm = (form, input) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      ask(input.value);
      input.value = "";
    });
  };
  wireForm(heroForm, heroInput);
  wireForm(screenForm, screenInput);

  closeBtn.addEventListener("click", closeChat);
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !screen.hidden) closeChat();
  });
  // the nav stays visible in chat mode; using it should leave the chat
  document.querySelectorAll(".topbar a").forEach((a) =>
    a.addEventListener("click", closeChat)
  );
})();

// ---------------------------------------------------------------------------
// Footer eyes: pupils follow the mouse, same algorithm as the original site —
// the pupil sits on a circle of radius min(15, distance-to-mouse) around the
// eye center, pointed at the mouse. No easing: eyes dart instantly, which is
// what real eyes do. Radius 15 lets the pupil poke 9px past the white
// horizontally (4.5px vertically) and merge with the dark footer.
// ---------------------------------------------------------------------------
(function initEyes() {
  const eyes = [...document.querySelectorAll(".eye")];
  if (!eyes.length) return;

  let mx = window.innerWidth / 2;
  let my = 0; // look up until the mouse shows up
  window.addEventListener(
    "mousemove",
    (e) => {
      mx = e.clientX;
      my = e.clientY;
    },
    { passive: true }
  );

  const state = eyes.map((eye) => ({
    eye,
    pupil: eye.querySelector(".pupil"),
  }));

  const RADIUS = 15;
  const update = () => {
    for (const s of state) {
      const r = s.eye.getBoundingClientRect();
      const dx = mx - (r.left + r.width / 2);
      const dy = my - (r.top + r.height / 2);
      const dist = Math.min(RADIUS, Math.hypot(dx, dy));
      const ang = Math.atan2(dy, dx);
      s.pupil.style.transform = `translate(${(Math.cos(ang) * dist).toFixed(2)}px, ${(Math.sin(ang) * dist).toFixed(2)}px)`;
    }
  };
  window.__eyes = { update };

  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  let running = false;
  let raf = null;
  const loop = () => {
    update();
    if (running) raf = requestAnimationFrame(loop);
  };
  new IntersectionObserver(([entry]) => {
    running = entry.isIntersecting;
    cancelAnimationFrame(raf);
    if (running) raf = requestAnimationFrame(loop);
  }).observe(eyes[0]);
})();

// ---------------------------------------------------------------------------
// Case study hero: stagger the title in word by word
// ---------------------------------------------------------------------------
const caseTitle = document.querySelector(".case-title");
if (caseTitle) {
  const words = caseTitle.textContent.trim().split(/\s+/);
  caseTitle.textContent = "";
  words.forEach((word, i) => {
    const span = document.createElement("span");
    span.className = "word";
    span.style.setProperty("--d", `${i * 0.045}s`);
    span.textContent = word;
    caseTitle.appendChild(span);
    caseTitle.appendChild(document.createTextNode(" "));
  });
}

/* ---------- Work index: floating hover preview ---------- */
function initWorkIndex() {
  const peek = document.getElementById("tocPeek");
  if (!peek) return;
  if (window.matchMedia("(hover: none)").matches) return;

  const img = peek.querySelector(".toc-peek-img");
  const note = peek.querySelector(".toc-peek-note");
  const tags = peek.querySelector(".toc-peek-tags");

  const place = (e) => {
    const w = peek.offsetWidth;
    const h = peek.offsetHeight;
    let x = e.clientX + 28;
    let y = e.clientY - h / 2;
    if (x + w > window.innerWidth - 16) x = e.clientX - w - 28;
    y = Math.max(16, Math.min(window.innerHeight - h - 16, y));
    peek.style.transform = `translate(${x}px, ${y}px)`;
  };

  // pre-warm preview thumbnails so the card never flashes empty on first hover
  document.querySelectorAll(".toc-row[data-img]").forEach((row) => {
    const pre = new Image();
    pre.src = row.dataset.img;
  });

  document.querySelectorAll(".toc-row").forEach((row) => {
    row.addEventListener("mouseenter", (e) => {
      img.style.background = row.dataset.img
        ? `url("${row.dataset.img}") center top / cover no-repeat`
        : row.style.getPropertyValue("--lg") || "";
      img.classList.toggle("has-photo", !!row.dataset.img);
      note.textContent = row.dataset.note || "";
      tags.textContent = row.dataset.tags || "";
      peek.hidden = false;
      place(e);
    });
    row.addEventListener("mousemove", place);
    row.addEventListener("mouseleave", () => {
      peek.hidden = true;
    });
  });
}
initWorkIndex();

/* ---------- Work index: subject-index filter (All / Product / Branding) ---------- */
function initTocFilter() {
  const bar = document.querySelector(".toc-filter");
  if (!bar) return;
  const buttons = bar.querySelectorAll(".toc-filter-btn");
  const rows = document.querySelectorAll(".toc-row");
  const eras = document.querySelectorAll(".toc-era");

  const apply = (filter) => {
    buttons.forEach((b) => {
      const on = b.dataset.filter === filter;
      b.classList.toggle("on", on);
      b.setAttribute("aria-pressed", on ? "true" : "false");
    });
    rows.forEach((row) => {
      row.classList.toggle(
        "f-hide",
        filter !== "all" && row.dataset.cat !== filter
      );
    });
    // hide a chapter when the filter empties it (the appendix has no list — always shown)
    eras.forEach((era) => {
      const list = era.querySelector(".toc-list");
      if (!list) return;
      const any = [...list.querySelectorAll(".toc-row")].some(
        (r) => !r.classList.contains("f-hide")
      );
      era.classList.toggle("f-hide", !any);
    });
  };

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const f = btn.dataset.filter;
      apply(f);
      // shareable view: work.html#product / #branding
      history.replaceState(null, "", f === "all" ? location.pathname : "#" + f);
    });
  });

  const applyFromHash = () => {
    const h = location.hash.replace("#", "");
    if (h === "product" || h === "branding") apply(h);
    else if (h === "" || h === "all") apply("all");
  };
  applyFromHash();
  window.addEventListener("hashchange", applyFromHash);
}
initTocFilter();

/* ---------- Click-to-zoom lightbox for case-study figures ---------- */
function initLightbox() {
  const collect = () =>
    [...document.querySelectorAll(".case figure img")].filter(
      (img) => !img.closest(".bcf-figure") && !img.classList.contains("zoomable")
    );

  const overlay = document.createElement("div");
  overlay.className = "lightbox";
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-modal", "true");
  overlay.setAttribute("aria-label", "Enlarged image view");
  overlay.innerHTML =
    '<button class="lightbox-close" aria-label="Close enlarged image">&#215;</button><img alt="" />';
  /* Only enter the DOM once there is actually an image to enlarge. .lightbox is
     styled in case.css, which the homepage doesn't load — appended there it
     rendered as a plain 24px block under the footer, exposing the hero and its
     pills below the dark panel. */
  const mount = () => {
    if (!overlay.isConnected) document.body.appendChild(overlay);
  };

  const big = overlay.querySelector("img");
  const closeBtn = overlay.querySelector(".lightbox-close");
  let lastFocus = null;

  const open = (img) => {
    big.src = img.currentSrc || img.src;
    big.alt = img.alt || "";
    lastFocus = img;
    overlay.classList.add("open");
    document.body.style.overflow = "hidden";
    closeBtn.focus();
  };
  const close = () => {
    overlay.classList.remove("open");
    document.body.style.overflow = "";
    big.src = "";
    if (lastFocus) lastFocus.focus();
  };

  const bind = (img) => {
    img.classList.add("zoomable");
    img.setAttribute("tabindex", "0");
    img.setAttribute("role", "button");
    img.setAttribute("aria-label", (img.alt ? img.alt + " — " : "") + "click to enlarge");
    img.addEventListener("click", () => open(img));
    img.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        open(img);
      }
    });
  };

  const scan = () => {
    const imgs = collect();
    if (imgs.length) mount();
    imgs.forEach(bind);
  };
  scan();
  window.rescanLightbox = scan;

  overlay.addEventListener("click", close);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && overlay.classList.contains("open")) close();
  });
}
initLightbox();
