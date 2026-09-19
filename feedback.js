/* ---------------------------------------------------------------------------
   feedback.js — private feedback on case-study pages (2026-09-19).
   Three ways in, all anonymous on the visitor's side, all delivered straight
   to Mina's Discord through the portfolio-notify Worker; nothing is ever
   shown publicly:

     1. one-tap emoji reactions at the end of the page (no submit step)
     2. a note box under the reactions
     3. Google-Slides-style selection comments — select any passage in the
        case body and a 💬 button appears

   Attribution: the company tag saved by analytics.js (sessionStorage pf_src,
   from ?utm_source= or an ATS referrer) rides along invisibly, so Mina knows
   which company said what. Her own tests are labeled via pf_self (?me=1).
--------------------------------------------------------------------------- */
(function () {
  var NOTIFY_URL = "https://portfolio-notify.luminhuei.workers.dev";
  var main = document.querySelector("main.case");
  if (!main) return;

  var zh = (document.documentElement.lang || "").indexOf("zh") === 0;
  var T = zh ? {
    kicker: "Feedback",
    title: "跟我說說<em>你的想法</em>。",
    lead: "我很想聽你的回饋 —— 點個反應,或留幾句話都好。完全不記名、也不會公開:這些只會私下傳給我一個人。",
    placeholder: "哪裡打動你?哪裡你覺得可以更好?",
    send: "送出",
    sent: "收到了,謝謝!每一則我都會讀。",
    reacted: "已送出 — 謝謝!",
    hint: "✏️ 閱讀時圈選任何一句話,就能直接對那一段留言給我。",
    commentBtn: "留言",
    annTitle: "對這一段留言",
    annPlaceholder: "想對這段說什麼?",
    cancel: "取消",
    annSent: "收到了,謝謝!",
    reactions: [
      ["👍", "喜歡", "Like"],
      ["🔥", "很厲害", "Impressive"],
      ["💡", "有啟發", "Insightful"],
      ["🤔", "可以更好", "Could be better", true],
      ["🤝", "想聊聊", "Let’s talk"],
    ],
    promptBetter: "哪裡可以更好?跟我說是哪個部分、往什麼方向 ——",
  } : {
    kicker: "Feedback",
    title: "Tell me <em>what you think</em>.",
    lead: "I&rsquo;d love your feedback &mdash; tap a reaction, or leave me a note. It&rsquo;s anonymous and never public: it goes privately to me and no one else.",
    placeholder: "What worked? What would you push back on?",
    send: "Send",
    sent: "Got it — thank you! I read every note.",
    reacted: "Sent — thank you!",
    hint: "✏️ As you read — select any sentence to leave me a note on that exact passage.",
    commentBtn: "Comment",
    annTitle: "Comment on this passage",
    annPlaceholder: "What would you tell me about this part?",
    cancel: "Cancel",
    annSent: "Got it — thank you!",
    reactions: [
      ["👍", "Like", "Like"],
      ["🔥", "Impressive", "Impressive"],
      ["💡", "Insightful", "Insightful"],
      ["🤔", "Could be better", "Could be better", true],
      ["🤝", "Let’s talk", "Let’s talk"],
    ],
    promptBetter: "What could be better? Tell me which part, and in what direction —",
  };

  /* --- attribution + send ------------------------------------------------ */
  function source() {
    try { if (localStorage.getItem("pf_self") === "1") return "self-test"; } catch (e) {}
    try {
      var s = sessionStorage.getItem("pf_src");
      if (s) return s;
    } catch (e) {}
    try { return new URLSearchParams(location.search).get("utm_source") || ""; } catch (e) {}
    return "";
  }
  function send(payload) {
    payload.page = document.title || location.pathname;
    payload.source = source();
    var body = JSON.stringify(payload);
    try {
      if (navigator.sendBeacon) {
        navigator.sendBeacon(NOTIFY_URL, new Blob([body], { type: "text/plain" }));
      } else {
        fetch(NOTIFY_URL, { method: "POST", body: body, keepalive: true,
          headers: { "Content-Type": "text/plain" } });
      }
    } catch (e) {}
  }
  var pageKey = location.pathname.replace(/[^a-z-]/gi, "");

  /* --- 1+2. reactions + note box at the end of the case ------------------ */
  var block = document.createElement("section");
  block.className = "case-section fb-block";
  block.id = "fbBlock";
  block.innerHTML =
    '<p class="case-kicker">' + T.kicker + "</p>" +
    '<h2 class="step-title">' + T.title + "</h2>" +
    '<div class="step-body"><p>' + T.lead + "</p></div>" +
    '<div class="fb-react" role="group"></div>' +
    '<form class="fb-form">' +
    '<input class="fb-hp" name="website" type="text" tabindex="-1" autocomplete="off" aria-hidden="true" />' +
    '<textarea class="fb-text" rows="3" placeholder="' + T.placeholder + '" maxlength="1000"></textarea>' +
    '<button class="fb-send" type="submit">' + T.send + "</button>" +
    "</form>";

  var react = block.querySelector(".fb-react");
  T.reactions.forEach(function (r) {
    var b = document.createElement("button");
    b.type = "button";
    b.className = "fb-emoji";
    b.innerHTML = "<span>" + r[0] + "</span><small>" + r[1] + "</small>";
    var key = "fb-react-" + pageKey + "-" + r[2];
    try { if (localStorage.getItem(key)) b.classList.add("on"); } catch (e) {}
    b.addEventListener("click", function () {
      if (b.classList.contains("on")) return;
      b.classList.add("on");
      try { localStorage.setItem(key, "1"); } catch (e) {}
      send({ type: "reaction", emoji: r[0], label: r[2] });
      toast(react, T.reacted);
      /* "Could be better" invites a follow-up: retarget the note box and
         hand them the pen, so the critique arrives with a direction. */
      if (r[3]) {
        var ta = form.querySelector(".fb-text");
        if (ta) { ta.placeholder = T.promptBetter; ta.focus(); }
      }
    });
    react.appendChild(b);
  });

  var form = block.querySelector(".fb-form");
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var ta = form.querySelector(".fb-text");
    var text = ta.value.trim();
    if (!text) { ta.focus(); return; }
    send({ type: "comment", text: text, hp: form.querySelector(".fb-hp").value });
    form.innerHTML = '<p class="fb-thanks">' + T.sent + "</p>";
  });

  var next = main.querySelector(".next-project");
  if (next) main.insertBefore(block, next);
  else main.appendChild(block);

  /* --- reading hint after the first content section ----------------------- */
  var sections = Array.prototype.filter.call(
    main.children,
    function (el) { return el.id !== "pvGate" && el.tagName === "SECTION"; }
  );
  if (sections.length > 1) {
    var hint = document.createElement("p");
    hint.className = "fb-hint";
    hint.textContent = T.hint;
    sections[0].insertAdjacentElement("afterend", hint);
  }

  /* --- tiny confirmation toast ------------------------------------------- */
  function toast(near, msg) {
    var t = block.querySelector(".fb-toast") || document.createElement("p");
    t.className = "fb-toast";
    t.textContent = msg;
    near.insertAdjacentElement("afterend", t);
    t.classList.remove("show");
    void t.offsetWidth;
    t.classList.add("show");
  }

  /* --- 3. selection comments (Google-Slides style) ------------------------ */
  var fab = document.createElement("button");
  fab.type = "button";
  fab.className = "fb-fab";
  fab.textContent = "💬 " + T.commentBtn;
  fab.hidden = true;
  document.body.appendChild(fab);

  var pop = document.createElement("div");
  pop.className = "fb-pop";
  pop.hidden = true;
  pop.innerHTML =
    '<p class="fb-pop-title">' + T.annTitle + "</p>" +
    '<blockquote class="fb-quote"></blockquote>' +
    '<textarea rows="3" placeholder="' + T.annPlaceholder + '" maxlength="1000"></textarea>' +
    '<div class="fb-pop-row"><button type="button" class="fb-pop-cancel">' + T.cancel +
    '</button><button type="button" class="fb-pop-send">' + T.send + "</button></div>";
  document.body.appendChild(pop);

  var current = null; // {quote, section}
  function selectionInfo() {
    var sel = window.getSelection();
    if (!sel || sel.isCollapsed || sel.rangeCount === 0) return null;
    var text = sel.toString().replace(/\s+/g, " ").trim();
    if (text.length < 8 || text.length > 600) return null;
    var node = sel.anchorNode;
    var el = node && (node.nodeType === 1 ? node : node.parentElement);
    if (!el || !main.contains(el)) return null;
    if (el.closest(".fb-block, .fb-pop, #pvGate, input, textarea, button")) return null;
    var secEl = el.closest("section, article");
    var head = secEl && secEl.querySelector("h2, h3");
    return {
      quote: text,
      section: head ? head.textContent.replace(/\s+/g, " ").trim() : "",
      rect: sel.getRangeAt(0).getBoundingClientRect(),
    };
  }
  function placeFab() {
    if (!pop.hidden) return;
    var info = selectionInfo();
    if (!info) { fab.hidden = true; return; }
    current = info;
    fab.hidden = false;
    var x = Math.min(Math.max(info.rect.left + info.rect.width / 2 - 45, 10), innerWidth - 100);
    var y = info.rect.bottom + 8;
    if (y > innerHeight - 60) y = Math.max(info.rect.top - 44, 10);
    fab.style.left = x + "px";
    fab.style.top = y + "px";
  }
  document.addEventListener("mouseup", function () { setTimeout(placeFab, 10); });
  document.addEventListener("selectionchange", function () {
    clearTimeout(placeFab._t);
    placeFab._t = setTimeout(placeFab, 250);
  });

  fab.addEventListener("click", function () {
    if (!current) return;
    fab.hidden = true;
    pop.querySelector(".fb-quote").textContent =
      "「" + (current.quote.length > 140 ? current.quote.slice(0, 140) + "…" : current.quote) + "」";
    var r = fab.getBoundingClientRect();
    pop.hidden = false;
    var w = Math.min(340, innerWidth - 24);
    pop.style.width = w + "px";
    pop.style.left = Math.min(Math.max(parseFloat(fab.style.left) - 40, 12), innerWidth - w - 12) + "px";
    pop.style.top = Math.min(parseFloat(fab.style.top), innerHeight - 240) + "px";
    pop.querySelector("textarea").focus();
  });
  var popRow = pop.querySelector(".fb-pop-row");
  var popThanks = document.createElement("p");
  popThanks.className = "fb-thanks";
  popThanks.textContent = T.annSent;
  popThanks.hidden = true;
  pop.appendChild(popThanks);

  function closePop() {
    pop.hidden = true;
    popRow.hidden = false;
    popThanks.hidden = true;
    pop.querySelector("textarea").value = "";
  }
  pop.querySelector(".fb-pop-cancel").addEventListener("click", closePop);
  pop.querySelector(".fb-pop-send").addEventListener("click", function () {
    var ta = pop.querySelector("textarea");
    var text = ta.value.trim();
    if (!text) { ta.focus(); return; }
    send({
      type: "annotation",
      text: text,
      quote: current.quote.slice(0, 300),
      section: current.section,
    });
    popRow.hidden = true;
    popThanks.hidden = false;
    setTimeout(closePop, 1400);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") { closePop(); fab.hidden = true; }
  });
  document.addEventListener("mousedown", function (e) {
    if (!pop.hidden && !pop.contains(e.target) && e.target !== fab) closePop();
  });
})();
