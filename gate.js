/* Peblla case-study gate — same password as the agency vault. Content is
   hidden while <html> carries .locked (set synchronously in each page's
   head); the correct password lifts it. Only a SHA-256 hash lives here, so
   the password itself never appears in the source. One unlock opens every
   Peblla page (localStorage), matching how the resume hands out one password
   for the whole site. */
(function () {
  var HASH = "0e6a8e0b849ed9b064c5a25e1ee5592f427e3eb9d250e42069ce46147d00e8d4";
  var KEY = "pv-ok";
  var gate = document.getElementById("pvGate");
  function reveal(remember) {
    document.documentElement.classList.remove("locked");
    if (gate) gate.remove();
    if (remember) {
      try { localStorage.setItem(KEY, "1"); } catch (e) {}
    }
    if (window.rescanLightbox) window.rescanLightbox();
    document.querySelectorAll("video[autoplay]").forEach(function (v) {
      v.play().catch(function () {});
    });
  }
  try {
    if (localStorage.getItem(KEY) === "1") { reveal(false); return; }
  } catch (e) {}
  if (!gate) return;
  var pwEl = document.getElementById("pvPw");
  var btn = document.getElementById("pvBtn");
  var msg = document.getElementById("pvMsg");
  function check() {
    var pw = pwEl.value.trim();
    if (!pw) return;
    crypto.subtle.digest("SHA-256", new TextEncoder().encode(pw)).then(function (buf) {
      var hex = Array.prototype.map.call(new Uint8Array(buf), function (b) {
        return b.toString(16).padStart(2, "0");
      }).join("");
      if (hex === HASH) { reveal(true); }
      else { msg.hidden = false; pwEl.select(); }
    });
  }
  btn.addEventListener("click", check);
  pwEl.addEventListener("keydown", function (e) { if (e.key === "Enter") check(); });
})();
