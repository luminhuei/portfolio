/* ---------------------------------------------------------------------------
   mpos-walkthrough.js — the section-01 Desktop POS figure. A white cursor
   bubble walks the real click path across three screenshots:

     home ── tap "Table Service" ──> table map ── tap table A-1 ──> ordering

   Coordinates are % of the 1920x1080 screens, measured off the real pixels.
   Runs only while the figure is on screen; loops; prefers-reduced-motion
   (and old browsers) just keep the first screenshot.
--------------------------------------------------------------------------- */
(function () {
  var stage = document.querySelector(".fig-shot-stage[data-walkthrough]");
  if (!stage) return;
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced || !("IntersectionObserver" in window)) return;

  var screens = stage.querySelectorAll("img.fs-screen");
  var cursor = document.createElement("div");
  cursor.className = "fs-cursor";
  var ripple = document.createElement("div");
  ripple.className = "fs-ripple";
  stage.appendChild(ripple);
  stage.appendChild(cursor);

  var TS = { x: 40.3, y: 14.5 };   // Table Service disc, screen 1
  var TBL = { x: 51.1, y: 81.3 };  // blue table A-1, screen 2
  var REST = { x: 60, y: 52 };     // neutral entry point

  function place(p, dur) {
    cursor.style.transitionDuration = (dur || 0) + "ms";
    cursor.style.left = p.x + "%";
    cursor.style.top = p.y + "%";
  }
  function show(i) {
    for (var k = 0; k < screens.length; k++) screens[k].classList.toggle("on", k <= i);
  }
  function click(p) {
    cursor.classList.add("press");
    ripple.style.left = p.x + "%";
    ripple.style.top = p.y + "%";
    ripple.classList.remove("go");
    void ripple.offsetWidth; /* restart the animation */
    ripple.classList.add("go");
    setTimeout(function () { cursor.classList.remove("press"); }, 260);
  }

  var timers = [];
  function at(t, fn) { timers.push(setTimeout(fn, t)); }
  function run() {
    stop();
    show(0);
    place(REST, 0);
    at(350, function () { cursor.style.opacity = "1"; });
    at(900, function () { place(TS, 1100); });          /* glide to Table Service */
    at(2150, function () { click(TS); });
    at(2600, function () { show(1); });                 /* -> table map */
    at(4100, function () { place(TBL, 1200); });        /* pause, then glide to A-1 */
    at(5450, function () { click(TBL); });
    at(5900, function () { show(2); });                 /* -> ordering */
    at(9300, function () { cursor.style.opacity = "0"; });
    at(9900, function () { show(0); });                 /* fade home, loop */
    at(10600, run);
  }
  function stop() {
    timers.forEach(clearTimeout);
    timers = [];
  }
  function reset() {
    stop();
    show(0);
    cursor.style.opacity = "0";
    place(REST, 0);
  }

  if (/wtforce/.test(location.search)) { run(); return; } /* QA hook: run without the viewport gate */

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting && e.intersectionRatio >= 0.35) {
        if (!timers.length) run();
      } else if (!e.isIntersecting) {
        reset(); /* fully off screen; ratio dips from load reflow don't restart it */
      }
    });
  }, { threshold: [0, 0.35, 0.7] });
  io.observe(stage);
})();
