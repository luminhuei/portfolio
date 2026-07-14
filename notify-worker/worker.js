/* ---------------------------------------------------------------------------
   portfolio-notify — Cloudflare Worker that forwards site interaction pings to
   a Discord channel. Deployed separately on Cloudflare (NOT part of GitHub
   Pages). The Discord webhook URL lives ONLY as the Worker secret
   DISCORD_WEBHOOK — it never appears in the site's source or this file.

   The site (analytics.js → window.portfolioNotify) sends a text/plain POST:
     { type: "visit" | "question", text, via, page, source }

   Protections (best-effort, right-sized for a personal portfolio):
     - Origin allowlist: only accept requests from the live site.
     - Per-IP rate limit: max 15 pings / 60s per isolate.
     - Message length + basic shape validation.
   If abused, delete/regenerate the Discord webhook to instantly cut it off.
--------------------------------------------------------------------------- */

const ALLOWED_ORIGINS = [
  "https://luminhuei.github.io",
  "http://localhost:4174", // local testing
];

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    const allowOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
    const cors = {
      "Access-Control-Allow-Origin": allowOrigin,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (request.method === "OPTIONS") return new Response(null, { headers: cors });
    if (request.method !== "POST") return new Response("Method Not Allowed", { status: 405, headers: cors });

    // Origin allowlist — blocks casual cross-site abuse (a browser can't spoof Origin)
    if (origin && !ALLOWED_ORIGINS.includes(origin)) {
      return new Response("Forbidden", { status: 403, headers: cors });
    }

    // Per-IP rate limit (best-effort, per isolate)
    const ip = request.headers.get("CF-Connecting-IP") || "unknown";
    if (!rateOk(ip)) return new Response("Too Many Requests", { status: 429, headers: cors });

    let data;
    try { data = JSON.parse(await request.text()); } catch (e) {
      return new Response("Bad Request", { status: 400, headers: cors });
    }

    const content = formatMessage(data);
    if (!content) return new Response("Ignored", { headers: cors });

    if (env.DISCORD_WEBHOOK) {
      try {
        await fetch(env.DISCORD_WEBHOOK, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: content.slice(0, 1900) }),
        });
      } catch (e) { /* swallow — notifications are best-effort */ }
    }
    return new Response("ok", { headers: cors });
  },
};

/* --- simple in-memory sliding-window rate limit --- */
const hits = new Map();
function rateOk(ip) {
  const now = Date.now(), WINDOW = 60000, MAX = 15;
  const arr = (hits.get(ip) || []).filter((t) => now - t < WINDOW);
  if (arr.length >= MAX) { hits.set(ip, arr); return false; }
  arr.push(now);
  hits.set(ip, arr);
  return true;
}

/* --- format a Discord message from the ping --- */
function formatMessage(d) {
  if (!d || typeof d !== "object") return null;
  const who = d.source ? `**${clean(d.source)}**` : "an organic visitor";
  const page = d.page ? ` — ${clean(d.page)}` : "";
  if (d.type === "visit") {
    return `🔔 ${who} just opened your portfolio${page}`;
  }
  if (d.type === "question") {
    const verb = d.via === "chip" ? "tapped a suggestion" : "asked MinaGPT";
    const icon = d.via === "chip" ? "👆" : "💬";
    return `${icon} ${who} ${verb}${page}:\n> ${clean(d.text)}`;
  }
  return null;
}
function clean(s) {
  s = String(s == null ? "" : s).replace(/[`@]/g, "").trim();
  return s.length > 300 ? s.slice(0, 300) + "…" : s;
}
