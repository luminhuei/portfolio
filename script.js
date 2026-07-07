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
const BAR_DELAY = 6000;
const CHIPS_DELAY = 10000;
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
// Image strips inside project cards: slow self-scrolling ticker that speeds up
// with page scroll, loops seamlessly, and can be grabbed and flung.
// ---------------------------------------------------------------------------
let pageScrollBoost = 0;
let lastScrollY = window.scrollY;
window.addEventListener(
  "scroll",
  () => {
    const dy = window.scrollY - lastScrollY;
    lastScrollY = window.scrollY;
    pageScrollBoost = Math.max(-30, Math.min(30, pageScrollBoost + dy * 0.05));
  },
  { passive: true }
);

document.querySelectorAll(".strip").forEach((strip, stripIndex) => {
  const track = strip.querySelector(".strip-track");
  // Duplicate the shots so the loop can wrap around seamlessly
  track.innerHTML += track.innerHTML;

  const BASE_SPEED = 0.35; // px per frame of idle drift
  let setW = 0;
  let x = 0;
  let flingVx = 0;
  let raf = null;
  let active = false;
  let down = false;
  let startX = 0;
  let xAtDown = 0;
  let lastX = 0;
  let lastT = 0;
  let moved = 0;

  const measure = () => {
    setW = track.scrollWidth / 2;
  };
  measure();
  window.addEventListener("resize", measure);
  // Stagger the starting offset so cards don't all look identical
  x = -setW * (0.1 + 0.13 * stripIndex);

  const wrap = () => {
    if (setW <= 0) return;
    while (x <= -setW) x += setW;
    while (x > 0) x -= setW;
  };
  const apply = () => {
    track.style.transform = `translate3d(${x}px, 0, 0)`;
  };
  wrap();
  apply();

  const tick = () => {
    if (!down) {
      x -= BASE_SPEED + pageScrollBoost;
      x += flingVx;
      pageScrollBoost *= 0.93;
      flingVx *= 0.94;
      wrap();
      apply();
    }
    if (active) raf = requestAnimationFrame(tick);
  };

  new IntersectionObserver(([entry]) => {
    active = entry.isIntersecting;
    cancelAnimationFrame(raf);
    if (active) raf = requestAnimationFrame(tick);
  }).observe(strip);

  strip.addEventListener("pointerdown", (e) => {
    down = true;
    moved = 0;
    startX = e.clientX;
    xAtDown = x;
    lastX = e.clientX;
    lastT = performance.now();
    flingVx = 0;
    strip.setPointerCapture(e.pointerId);
    strip.classList.add("dragging");
  });

  strip.addEventListener("pointermove", (e) => {
    if (!down) return;
    const dx = e.clientX - startX;
    moved = Math.max(moved, Math.abs(dx));
    x = xAtDown + dx;
    const now = performance.now();
    flingVx = ((e.clientX - lastX) / Math.max(1, now - lastT)) * 16;
    lastX = e.clientX;
    lastT = now;
    wrap();
    apply();
  });

  const release = () => {
    if (!down) return;
    down = false;
    strip.classList.remove("dragging");
  };
  strip.addEventListener("pointerup", release);
  strip.addEventListener("pointercancel", release);

  // A real drag should not trigger clicks on links behind the pointer
  strip.addEventListener(
    "click",
    (e) => {
      if (moved > 6) {
        e.preventDefault();
        e.stopPropagation();
      }
    },
    true
  );
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
  config.forEach((p, i) => {
    const el = document.createElement("div");
    el.className = "pill" + (p.dot ? " pill-dot" : "");
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
      restitution: 0.4,
      friction: 0.4,
      frictionAir: 0.015,
      angle: (Math.random() - 0.5) * 0.5,
      density: 0.002,
    });
    Composite.add(world, body);
    items.push({ el, body, w, h });
    makeGrabbable(el, body);
  });

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
    Engine.update(engine, Math.min(16.6, t - last));
    last = t;
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

  const ANSWERS = [
    { match: /pos|handheld|tableside|checkout/i,
      a: "Mina designed a handheld POS for full-service restaurants — handheld-first, not a shrunken desktop POS. Within three months of launch, 64% of checkouts had moved to tableside. Full case study coming very soon." },
    { match: /point|loyalt|alliance|reward|member/i,
      a: "The Points Alliance app is a 0→1 cross-brand loyalty MVP she launched in 2025 — 643 members placed cross-brand orders and redeemed 36,361+ points across participating brands." },
    { match: /dashboard|analytic|report|data/i,
      a: "She designed the UI and design system for a B2B analytics report center that 600+ store operators check daily — built around trust-at-a-glance readability instead of decoration." },
    { match: /tablet|ayce|self.?order/i,
      a: "The self-ordering tablet was built for all-you-can-eat restaurants. In formal usability testing, 5 out of 5 untrained users completed the entire ordering flow — true zero-training UX." },
    { match: /ship|project|work|portfolio|done|built|case/i,
      a: "Four products between 2024–25: a handheld Mobile POS (64% of checkouts moved tableside), the Points Alliance loyalty app (643 cross-brand members), a B2B analytics dashboard (600+ daily operators), and a zero-training self-ordering tablet. Scroll down to meet them ↓" },
    { match: /different|superpower|strength|special|unique|brand|system/i,
      a: "Her range: she covers the whole journey — brand identity, UX/UI, and design systems. She led brand & digital at Gong cha (7 international awards, 140% US sales growth), then built restaurant tech at Peblla used by 750+ restaurants across the US." },
    { match: /process|research|method|how.*(work|design)/i,
      a: "Outcome-first and research-driven: she starts from real operational constraints, tests with actual users (servers, store operators, even first-time guests), and ships design systems so whole teams move faster." },
    { match: /contact|email|hire|reach|linkedin|resume|cv|available/i,
      a: "Email luminhuei@gmail.com, or find her on LinkedIn at minhueilu. She's always down for a chat ☕" },
    { match: /who|about|mina|min\s?huei|background|experience|year/i,
      a: "Min Huei Lu (Mina) is a product designer with 10 years across branding and UX/UI — Gong cha, then Peblla. B2B & B2C, from brand identity to design systems, with 8 international design awards along the way." },
  ];
  const FALLBACK =
    "I'm a lightweight preview of MinaGPT — the fully AI-powered version arrives with the case studies. Meanwhile, scroll down for four projects, or email Mina at luminhuei@gmail.com 😊";

  const reply = (q) => {
    const hit = ANSWERS.find((c) => c.match.test(q));
    return hit ? hit.a : FALLBACK;
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

  const ask = (q) => {
    if (!q.trim()) return;
    finishCurrent();
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

    const text = reply(q);
    const state = { el: b, text, i: 0, timer: null };
    current = state;
    const tick = () => {
      if (current !== state) return;
      b.textContent = text.slice(0, ++state.i);
      scroll.scrollTop = scroll.scrollHeight;
      if (state.i < text.length) state.timer = setTimeout(tick, 14);
      else current = null;
    };
    state.timer = setTimeout(tick, 350);
  };

  // hero chips + in-chat suggestion chips all ask on click
  document.querySelectorAll(".minagpt .chip, .chat-suggest .chip").forEach((chip) =>
    chip.addEventListener("click", () => ask(chip.textContent))
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
