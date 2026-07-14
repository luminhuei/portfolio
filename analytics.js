/* ---------------------------------------------------------------------------
   analytics.js — site-wide analytics loader, included in the <head> of every
   page. Google Analytics 4 (page views, engagement time, user paths, custom
   events) + Microsoft Clarity (heatmaps + session recordings) live together
   here so the tracking IDs sit in one place.

   Per-company attribution: append ?utm_source=<company>&utm_medium=jobapp to
   the link you send each employer. GA4 captures UTM params automatically —
   no code needed here; just filter by "source" in the GA4 reports.
--------------------------------------------------------------------------- */
(function () {
  var GA_ID = "G-H28VTXNLWJ"; // Google Analytics 4 Measurement ID
  var CLARITY_ID = "xmh398wie4"; // Microsoft Clarity Project ID
  var NOTIFY_URL = "https://portfolio-notify.luminhuei.workers.dev"; // Cloudflare Worker → Discord

  /* --- Google Analytics 4 (gtag.js) --- */
  if (GA_ID) {
    var g = document.createElement("script");
    g.async = true;
    g.src = "https://www.googletagmanager.com/gtag/js?id=" + GA_ID;
    document.head.appendChild(g);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag("js", new Date());
    window.gtag("config", GA_ID);
  }

  /* --- Microsoft Clarity (heatmaps + session recordings) --- */
  if (CLARITY_ID) {
    (function (c, l, a, r, i, t, y) {
      c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
      t = l.createElement(r); t.async = 1; t.src = "https://www.clarity.ms/tag/" + i;
      y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
    })(window, document, "clarity", "script", CLARITY_ID);
  }

  /* --- Instant Discord pings (proxied through a Cloudflare Worker) ---
     window.portfolioNotify(type, {text, via, source}) fires a fire-and-forget
     beacon to the Worker, which formats a message and posts it to the Discord
     webhook (kept as a Worker secret — never in this file). text/plain avoids
     a CORS preflight. No-op until NOTIFY_URL is set. */
  function utmSource() {
    try { return new URLSearchParams(location.search).get("utm_source") || ""; }
    catch (e) { return ""; }
  }
  window.portfolioNotify = function (type, detail) {
    if (!NOTIFY_URL) return;
    detail = detail || {};
    var body = JSON.stringify({
      type: type,
      text: detail.text || "",
      via: detail.via || "",
      page: document.title || location.pathname,
      source: detail.source || utmSource(),
    });
    try {
      if (navigator.sendBeacon) {
        navigator.sendBeacon(NOTIFY_URL, new Blob([body], { type: "text/plain" }));
      } else {
        fetch(NOTIFY_URL, { method: "POST", body: body, keepalive: true,
          headers: { "Content-Type": "text/plain" } });
      }
    } catch (e) {}
  };

  /* Ping once per session when a company-tagged link (?utm_source=…) is opened */
  (function () {
    var src = utmSource();
    if (!src) return;
    try {
      if (sessionStorage.getItem("pf_notified_visit")) return;
      sessionStorage.setItem("pf_notified_visit", "1");
    } catch (e) {}
    window.portfolioNotify("visit", { source: src });
  })();
})();
