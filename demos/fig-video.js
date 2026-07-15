/* ---------------------------------------------------------------------------
   fig-video.js — plays each .fig-video <video> only while it is on screen and
   pauses it otherwise, so the stacked prototype recordings never stream or
   decode two at once. Muted programmatic play() is allowed without a gesture;
   respects prefers-reduced-motion (leaves the poster + controls, no autoplay).
--------------------------------------------------------------------------- */
(function () {
  var vids = document.querySelectorAll(".fig-video video");
  if (!vids.length) return;

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced || !("IntersectionObserver" in window)) return; // static poster + controls

  var io = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (e) {
        var v = e.target;
        if (e.isIntersecting && e.intersectionRatio >= 0.4) {
          var p = v.play();
          if (p && p.catch) p.catch(function () {});
        } else if (!v.paused) {
          v.pause();
        }
      });
    },
    { threshold: [0, 0.4, 0.7] }
  );

  vids.forEach(function (v) { io.observe(v); });
})();
