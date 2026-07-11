/* ---------------------------------------------------------------------------
   dashboard-06-sales-summary — the Sales Summary report page, rebuilt 1:1
   from the Peblla shadcn/ui system frame 453:13243 (a 1920px-wide, 3859px
   tall page). Shown in a 1752x1080 viewport: the dashboard-04 static shell
   (72px icon rail + 240px second rail = 312) + the frame's exact content
   band (80 + 1280 + 80), so every content measurement stays 1:1 with Figma
   while the shell matches the sibling figure. The content scrolls.
   Shares the .adv shell classes; the content area is new (asv- in demos.css).

   Interactions: the Sales-by-day tooltip glides along the real Figma path
   (and follows the mouse on hover); the date-preset dropdown and the
   dual-month custom-range calendar actually work and re-draw all three
   charts. Auto-loop: tooltip glide → preset "Last 7 days" → custom range
   May 10 – Jun 19 via the dual calendar → scroll through the summary
   tables → repeat. Tables keep the design file's anonymized placeholders.
--------------------------------------------------------------------------- */
(function () {
  const root = document.getElementById("demo-dashboard-06-sales-summary");
  if (!root) return;

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  /* no corner hint — same request as the dashboard-04 figure on this page */

  /* ---- icons: Phosphor-style strokes for the top bar, Feather for the
     rails — identical set to dashboard-04, plus the Sales Summary extras ---- */
  const S = (d, w) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${w || 1.6}" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
  const I = {
    chev: S('<path d="M6.5 9.75l5.5 5.5 5.5-5.5"/>', 1.8),
    fileText: S('<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M16 13H8M16 17H8M10 9H8"/>', 1.7),
    barChart: S('<path d="M18 20V10M12 20V4M6 20v-6"/>', 1.7),
    pieChart: S('<path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/>', 1.7),
    percent: S('<path d="M19 5L5 19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/>', 1.7),
    list: S('<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>', 1.7),
    cart: S('<circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>', 1.7),
    member: S('<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>', 1.7),
    zap: S('<path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>', 1.7),
    grid: S('<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>', 1.7),
    usersGroup: S('<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>', 1.7),
    layout: S('<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>', 1.7),
    star: S('<path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14l-5-4.87 6.91-1.01z"/>', 1.7),
    gear: S('<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>', 1.7),
    monitor: S('<rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>', 1.7),
    clipboard: S('<path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/>', 1.7),
    info: S('<circle cx="12" cy="12" r="8.5"/><path d="M12 11.2v5"/><path d="M12 7.6h.01"/>', 1.7),
    xCircle: S('<circle cx="12" cy="12" r="8.5"/><path d="M9.3 9.3l5.4 5.4M14.7 9.3l-5.4 5.4"/>', 1.7),
    outdent: S('<path d="M11 5.75h8.5M11 12h8.5M4.5 18.25h15"/><path d="M7.5 8.5L4 12l3.5 3.5"/>'),
    indent: S('<path d="M11 5.75h8.5M11 12h8.5M4.5 18.25h15"/><path d="M4.5 8.5L8 12l-3.5 3.5"/>'),
    search: S('<circle cx="11" cy="11" r="6.2"/><path d="M15.7 15.7L20.5 20.5"/>'),
    globe: S('<circle cx="12" cy="12" r="8.2"/><ellipse cx="12" cy="12" rx="3.6" ry="8.2"/><path d="M3.8 12h16.4"/>'),
    buildings: S('<path d="M3.5 20.5v-13l6.5-3v16"/><path d="M10 20.5h10.5V9.8L15 7.2v13.3"/><path d="M2.5 20.5h19"/>'),
    store: S('<path d="M4.6 10.6v9.9h14.8v-9.9"/><path d="M3.5 6.8l1.6-3.3h13.8l1.6 3.3c0 1.6-1.3 2.9-2.9 2.9-1.2 0-2.3-.8-2.7-1.9-.4 1.1-1.5 1.9-2.9 1.9s-2.5-.8-2.9-1.9c-.4 1.1-1.5 1.9-2.7 1.9-1.6 0-2.9-1.3-2.9-2.9z"/>'),
    headset: S('<path d="M4.5 14v-2a7.5 7.5 0 0115 0v2"/><rect x="3.5" y="13.2" width="4.2" height="6" rx="2.1"/><rect x="16.3" y="13.2" width="4.2" height="6" rx="2.1"/><path d="M19.5 19.2v.3a3 3 0 01-3 3h-3.2"/>'),
    user: S('<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="10" r="3"/><path d="M6.6 18.4c1.2-2.1 3.1-3.3 5.4-3.3s4.2 1.2 5.4 3.3"/>'),
    mail: S('<rect x="3.5" y="5.5" width="17" height="13" rx="1.5"/><path d="M4.5 7.5l7.5 5.5 7.5-5.5"/>'),
    funnel: S('<path d="M4.5 5h15l-5.8 6.8v6.7l-3.4-1.8v-4.9z"/>'),
    exportUp: S('<path d="M12 13.5V3.5"/><path d="M8.3 6.8L12 3.2l3.7 3.6"/><path d="M4.8 12.5v7h14.4v-7"/>'),
    sliders: S('<path d="M4.5 7h15M4.5 12h15M4.5 17h15"/><circle cx="9.5" cy="7" r="1.9"/><circle cx="15" cy="12" r="1.9"/><circle cx="8" cy="17" r="1.9"/>'),
    chevL: S('<path d="M14.5 6l-5.5 6 5.5 6"/>', 1.8),
    chevR: S('<path d="M9.5 6l5.5 6-5.5 6"/>', 1.8),
  };

  /* ---- shell data — same product menus as the dashboard-04 figure ---- */
  const NAV1 = [
    ["fileText", "Report Center", "New"],
    ["barChart", "Report"],
    ["pieChart", "Analytics"],
    ["percent", "Promotions"],
    ["list", "Menu"],
    ["cart", "Order"],
    ["member", "Member"],
    ["zap", "Integration"],
    ["grid", "Management"],
    ["usersGroup", "Group Buy"],
    ["layout", "Table Service"],
    ["star", "Reputation", "Beta"],
    ["gear", "Settings"],
    ["monitor", "Devices"],
    ["clipboard", "Store Account"],
  ];
  const SUBNAV = [
    ["Sales", ["Sales Overview", "Sales Summary", "Order Details"]],
    ["Transactions", ["Transaction Details"]],
    ["Reconciliation", ["Payment Reconciliation", "Payout Reconciliation"]],
  ];
  const TOPNAV = [
    [I.search, "Search"],
    [I.globe, "America / New York"],
    [I.buildings, "Organization"],
    [I.store, "Store"],
    [I.headset, "Support"],
    [I.user, "Account"],
    [I.mail, "Inbox"],
  ];

  const railItem = ([icon, label, badge], i) => `
    <div class="adv-item${i === 0 ? " adv-on" : ""}">
      <span class="adv-ic20">${I[icon]}</span>
      <span class="adv-itemlabel">${label}</span>
      ${badge ? `<span class="adv-badge${badge === "New" ? " adv-badge-new" : ""}">${badge}</span>` : ""}
      <span class="adv-ic16 adv-chev">${I.chev}</span>
    </div>`;

  /* ======================================================================
     chart datasets — $ values; the y-axes stay fixed as in the design
     (Sales by day / Time of day: $900 | $400 | $-100 · Day of week:
     $600 | $0 | $-200). The default set uses the exact Figma vectors.
     ====================================================================== */
  const PLOT_W = 1163; /* Figma plot viewBox width */
  const yDay = (v) => +((900 - v) * 0.08).toFixed(2);   /* $ -> 0..80 svg y */
  const yTod = (v) => +((900 - v) * 0.075).toFixed(2);  /* $ -> 0..75 svg y */
  const ptsToPath = (vals, yFn) =>
    "M" + vals.map((v, i) => `${+(i * PLOT_W / (vals.length - 1)).toFixed(1)} ${yFn(v)}`).join("L");

  const FIGMA_DAY_PATH = "M0 79.9963H101.544C114.716 75.697 156.067 67.6357 216.093 69.7854C276.119 71.9351 327.474 70.6811 345.649 69.7854C368.492 61.9034 419.981 46.1393 443.191 46.1393C466.401 46.1393 511.22 42.1982 530.728 40.2277L567.744 33.2413H857.869L1044.45 11.2072L1163 0.996311";
  const FIGMA_TOD_FILL = "M511 73H0V49.5L39.0765 68L73.6441 58.5L102.2 63L147.789 22.5L214.42 51.5L243.476 0L272.032 19.5L293.074 13L316.119 49L359.704 0L385.755 22L398.78 19.5L426.835 51.5L485.951 49L511 73Z";
  const FIGMA_TOD_STROKE = "M0.433112 50.4201L38.9331 68.9201L74.4331 59.4201L102.433 63.9201L148.433 23.4201L214.933 52.4201L243.933 1.42013L272.933 20.4201L293.433 13.9201L316.933 49.9201L359.433 1.42013L386.433 22.9201L398.933 20.4201L427.933 52.9201L486.433 50.4201L512.433 74.4201";

  const dates = (m0, d0, n) => {
    /* fixed 2025 calendar strings, "May 30. 2025" like the design tooltip */
    const months = [["May", 31], ["Jun", 30]];
    const out = [];
    let m = m0, d = d0;
    for (let i = 0; i < n; i++) {
      out.push(`${months[m][0]} ${d}. 2025`);
      if (++d > months[m][1]) { d = 1; m++; }
    }
    return out;
  };

  const todPts = (vals) => {
    const pts = vals.map((v, i) => `${+(i * 511 / (vals.length - 1)).toFixed(1)} ${yTod(v)}`);
    return {
      stroke: "M" + pts.join("L"),
      fill: "M" + pts.join("L") + "L511 75L0 75Z",
    };
  };

  const DS = {
    /* the exact Figma frame — default view and the custom-range target */
    full: {
      preset: "Today",
      range: "Mar 01, 2025",
      xlabels: ["May 10", "15", "20", "25", "30", "Jun 4", "9", "14", "19"],
      dayPath: FIGMA_DAY_PATH,
      dates: dates(0, 10, 41),
      dow: [590, 440, -190, 200, 350, 590, 200],
      todFill: FIGMA_TOD_FILL,
      todStroke: FIGMA_TOD_STROKE,
    },
    yesterday: {
      preset: "Yesterday",
      range: "Feb 28, 2025",
      xlabels: ["10 am", "1 pm", "4 pm", "7 pm", "10 pm"],
      day: [-60, -10, 130, 350, 280, 190, 260, 410, 640, 540, 300, 120, 20],
      dateLabel: "Feb 28. 2025",
      dow: [0, 0, 0, 0, 0, 470, 0], /* Feb 28, 2025 is a Friday */
      tod: [-40, 60, 220, 150, 90, 280, 470, 320, 240, 430, 640, 520, 350, 190, 40, -60],
    },
    today: {
      preset: "Today",
      range: "Mar 01, 2025",
      xlabels: ["10 am", "1 pm", "4 pm", "7 pm", "10 pm"],
      day: [-40, 30, 190, 430, 330, 210, 300, 470, 720, 610, 350, 150, 40],
      dateLabel: "Mar 1. 2025",
      dow: [0, 0, 0, 0, 0, 0, 430], /* Mar 1, 2025 is a Saturday */
      tod: [-30, 80, 260, 180, 110, 320, 520, 360, 270, 480, 700, 560, 380, 210, 60, -50],
    },
    week: {
      preset: "Last 7 days",
      range: "Jun 13, 2025 - Jun 19, 2025",
      xlabels: ["Jun 13", "14", "15", "16", "17", "18", "19"],
      day: [95, 240, 205, 410, 360, 540, 745],
      dates: dates(1, 13, 7),
      dow: [420, 180, -90, 240, 360, 600, 310],
      tod: [-20, 150, 320, 180, 90, 260, 480, 300, 210, 420, 650, 520, 340, 460, 220, -40],
    },
    month: {
      preset: "Last 30 days",
      range: "May 21, 2025 - Jun 19, 2025",
      xlabels: ["May 21", "26", "31", "Jun 5", "10", "15", "19"],
      day: [-60, 10, 90, 60, 140, 220, 180, 260, 310, 250, 330, 420, 380, 300, 360, 450, 520, 470, 400, 480, 560, 610, 550, 630, 700, 660, 730, 790, 760, 820],
      dates: dates(0, 21, 30),
      dow: [510, 380, 120, 220, 300, 570, 260],
      tod: [-50, 90, 240, 130, 200, 380, 550, 400, 280, 500, 720, 590, 410, 300, 140, -20],
    },
    thisMonth: {
      preset: "This month",
      range: "Jun 01, 2025 - Jun 19, 2025",
      xlabels: ["Jun 1", "4", "7", "10", "13", "16", "19"],
      day: [40, 120, 90, 210, 180, 300, 260, 380, 330, 420, 470, 400, 520, 480, 590, 640, 580, 690, 750],
      dates: dates(1, 1, 19),
      dow: [460, 320, 60, 190, 280, 540, 230],
      tod: [-30, 110, 280, 160, 120, 330, 510, 350, 260, 460, 680, 540, 370, 250, 90, -30],
    },
  };
  const MENU = [
    ["Today", "today"],
    ["Yesterday", "yesterday"],
    ["Last 7 days", "week"],
    ["Last 30 days", "month"],
    ["This month", "thisMonth"],
    ["Custom range", "custom"],
  ];

  /* ======================================================================
     content markup
     ====================================================================== */
  const gridRows = (labels, tops) => labels.map((l, i) => `
    <div class="asv-grow" style="top:${tops[i]}px">
      <span class="asv-glabel">${l}</span><span class="asv-gline"></span>
    </div>`).join("");

  const xlabelsHtml = (labels) =>
    labels.map((l, i) => `<span${i === 0 ? ' class="asv-xfirst"' : ""}>${l}</span>`).join("");

  /* dual-month calendar — fixed May / June 2025 (the design's range) */
  const calMonth = (name, firstDow, days, base, navIcon) => {
    let cells = "";
    for (let i = 0; i < firstDow; i++) cells += '<span class="asv-cd asv-cd-empty"></span>';
    for (let d = 1; d <= days; d++) cells += `<span class="asv-cd" data-serial="${base + d}">${d}</span>`;
    return `
      <div class="asv-cm">
        <div class="asv-cmhead">
          ${navIcon === "l" ? `<button class="asv-cnav">${I.chevL}</button>` : '<span class="asv-cnav asv-cnav-ghost"></span>'}
          <span class="asv-cmname">${name}</span>
          ${navIcon === "r" ? `<button class="asv-cnav">${I.chevR}</button>` : '<span class="asv-cnav asv-cnav-ghost"></span>'}
        </div>
        <div class="asv-cw">${["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((w) => `<span class="asv-cwd">${w}</span>`).join("")}${cells}</div>
      </div>`;
  };
  const fmtSerial = (s) => (s <= 31 ? `May ${String(s).padStart(2, "0")}, 2025` : `Jun ${String(s - 31).padStart(2, "0")}, 2025`);

  /* ---- tables: 1:1 with the design file's anonymized placeholders ---- */
  const vals = (n, bold) => `<span class="asv-trvals">${Array(n).fill(`<span class="asv-trv">${bold ? "<b>$0.00</b>" : "$0.00"}</span>`).join("")}</span>`;
  const trow = (label, n, info) => `
    <div class="asv-tr">
      <span class="asv-trlabel">${label}${info ? `<span class="asv-tinfo">${I.info}</span>` : ""}</span>
      ${vals(n)}
    </div>`;
  const thead2 = (cols) => `
    <div class="asv-tr asv-tr-head">
      <span class="asv-trlabel">${cols[0]}</span>
      <span class="asv-trvals">${cols.slice(1).map(([t, inf]) => `<span class="asv-trv">${t}${inf ? `<span class="asv-tinfo">${I.info}</span>` : ""}</span>`).join("")}</span>
    </div>`;
  const ttotal = (label, n) => `
    <div class="asv-tr asv-tr-total">
      <span class="asv-trlabel"><b>${label}</b></span>
      ${vals(n, 1)}
    </div>`;
  const tcard = (title, act, body) => `
    <section class="asv-tcard">
      <div class="asv-thead">
        <span class="asv-ttitle">${title}</span>
        <span class="asv-tact">${act || ""}</span>
      </div>
      <div class="asv-trows">${body}</div>
    </section>`;
  const viewBtn = '<button class="asv-viewbtn">View Details</button>';
  const slidersBtn = `<button class="asv-ticon">${I.sliders}</button>`;

  const TABLES_LEFT = [
    tcard("Revenue summary", "", [1, 1, 1, 0, 0, 1].map((f) => trow("List name", 1, f)).join("") + ttotal("Total amount", 1)),
    tcard("Net sales", "", [1, 0, 0, 1].map((f) => trow("List name", 1, f)).join("") + ttotal("Total", 1)),
    tcard("Gratuity summary", slidersBtn,
      thead2(["List title here", ["Table 2", 1], ["Table 3", 1], ["Table 4"]]) +
      [0, 0, 0, 0].map(() => trow("List name", 3)).join("") + ttotal("Total", 3)),
    tcard("Unclosed orders", viewBtn, trow("List name", 1, 1) + trow("List name", 1)),
    tcard("Dining type summary", "",
      thead2(["List title here", ["Table 2"], ["Table 3"], ["Table 4"]]) +
      [0, 0, 0, 0].map(() => trow("List name", 3)).join("") + ttotal("Total", 3)),
    tcard("Service area summary", "",
      thead2(["List title here", ["Table 2"], ["Table 3"], ["Table 4"]]) +
      [0, 0, 0, 0].map(() => trow("List name", 3)).join("") + ttotal("Total", 3)),
    tcard("Discount summary", "",
      thead2(["List title here", ["Table 3"], ["Table 4"]]) +
      Array(11).fill(trow("List name", 2)).join("") + ttotal("Total", 2)),
  ].join("");

  const TABLES_RIGHT = [
    tcard("Cash summary", "",
      thead2(["List title here", ["Table 4"]]) +
      [0, 0, 1, 0, 0, 1].map((f) => trow("List name", 1, f)).join("") + ttotal("Total cash", 1)),
    tcard("Payment summary", viewBtn + slidersBtn,
      thead2(["List title here", ["Table 1"], ["Table 2"], ["Table 3"], ["Table 4"]]) +
      [0, 0, 0, 0].map(() => trow("List name", 4)).join("") +
      ttotal("Subtotal", 4) +
      '<div class="asv-tr asv-tr-gap"></div>' +
      trow("Deposit sales collected", 1, 1) +
      ttotal("Total", 4)),
    tcard("Chains, sales summary", "",
      thead2(["List title here", ["Table 2"], ["Table 3"], ["Table 4"]]) +
      [0, 0, 0, 0].map(() => trow("List name", 3)).join("") + ttotal("Total", 3)),
    tcard("Service mode", "",
      thead2(["List title here", ["Table 2"], ["Table 3"], ["Table 4"]]) +
      Array(8).fill(trow("List name", 3)).join("")),
    tcard("Tax summary", viewBtn,
      thead2(["List title here", ["Table 3"], ["Table 4"]]) +
      [0, 0, 0, 0].map(() => trow("List name", 2)).join("") + ttotal("Total", 2)),
    tcard("Void summary", viewBtn,
      thead2(["Type", ["Amount"], ["Amount %"], ["Volume"], ["Volume %"]]) +
      [0, 0, 0].map(() => trow("List name", 4)).join("") + ttotal("Total", 4)),
  ].join("");

  const CONTENT = `
    <div class="asv-daterow">
      <button class="asv-btn" data-preset-btn><span data-preset-label>Today</span><span class="adv-ic12">${I.chev}</span></button>
      <button class="asv-btn" data-range-btn><span data-range-label>Mar 01, 2025</span><span class="adv-ic12">${I.chev}</span></button>
      <button class="asv-btn">Custom hours<span class="adv-ic12">${I.chev}</span></button>
      <button class="asv-btn asv-btn-med" data-search-btn>Search</button>

      <div class="asv-pop asv-menu" data-menu>
        ${MENU.map(([label, key]) => `<div class="asv-mitem${key === "today" ? " asv-msel" : ""}" data-pick="${key}">${label}</div>`).join("")}
      </div>

      <div class="asv-pop asv-cal" data-cal>
        <div class="asv-calmonths">
          ${calMonth("May 2025", 4, 31, 0, "l")}
          ${calMonth("June 2025", 0, 30, 31, "r")}
        </div>
        <div class="asv-calfoot">
          <button class="asv-calbtn" data-cal-cancel>Cancel</button>
          <button class="asv-calbtn asv-calbtn-pri" data-cal-apply>Apply</button>
        </div>
      </div>
    </div>

    <div class="asv-titlerow">
      <h1 class="asv-h1">Sales Summary</h1>
      <p class="asv-sub">Settlement time 12:00 am</p>
    </div>

    <div class="asv-tabsrow">
      <div class="asv-tabs" data-seg>
        <button class="asv-tab on">3rd Party Excl</button>
        <button class="asv-tab">3rd Party Incl</button>
      </div>
      <div class="asv-actions">
        <button class="asv-btn asv-btn-med"><span class="adv-ic20">${I.funnel}</span>Filters<span class="adv-ic12">${I.chev}</span></button>
        <button class="asv-btn asv-btn-med"><span class="adv-ic20">${I.gear}</span>Customize<span class="adv-ic12">${I.chev}</span></button>
        <button class="asv-btn asv-btn-med"><span class="adv-ic20">${I.exportUp}</span>Export<span class="adv-ic12">${I.chev}</span></button>
      </div>
    </div>

    <div class="asv-chips">
      <span class="asv-chip">Employee<span class="asv-chipdiv"></span><span class="asv-chiptag">Server</span><button class="asv-chipx" aria-label="Remove filter">${I.xCircle}</button></span>
      <span class="asv-chip">Service area<span class="asv-chipdiv"></span><span class="asv-chiptag">Main dining</span><button class="asv-chipx" aria-label="Remove filter">${I.xCircle}</button></span>
    </div>

    <section class="asv-card">
      <div class="asv-cardhead">Sales trends</div>

      <div class="asv-cblock">
        <p class="asv-ctitle">Sales by day</p>
        <div class="asv-cgrid asv-cgrid-day" data-daychart>
          ${gridRows(["$900", "$400", "$-100"], [0, 40, 80])}
          <svg class="asv-plot asv-anim" data-dayplot viewBox="0 0 1163 81" preserveAspectRatio="none" style="left:68px;top:10px;width:1164px;height:81px">
            <path data-daypath d="${FIGMA_DAY_PATH}" stroke="#FF4D00" stroke-width="2" fill="none"/>
          </svg>
          <div class="asv-gx asv-anim" data-dayx style="left:68px;right:0">${xlabelsHtml(DS.full.xlabels)}</div>
          <div class="asv-tip" data-tip>
            <span class="asv-tipdot"></span>
            <div class="asv-tipcard">
              <p class="asv-tipdate" data-tip-date>May 30. 2025</p>
              <div class="asv-tiprow"><span>Net sales</span><b data-tip-net>$417.00</b></div>
              <div class="asv-tiprow"><span>Orders</span><b data-tip-orders>10</b></div>
              <div class="asv-tiprow"><span>Guests</span><b data-tip-guests>10</b></div>
            </div>
          </div>
        </div>
      </div>

      <div class="asv-cblock asv-duo">
        <div class="asv-half">
          <p class="asv-ctitle">Day of week</p>
          <div class="asv-cgrid" data-dowchart>
            ${gridRows(["$600", "$0", "$-200"], [0, 60, 80])}
            <div data-dowbars>${DS.full.dow.map(() => '<span class="asv-bar"></span>').join("")}</div>
            <div class="asv-gx" style="left:84px;right:16px">${["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => `<span>${d}</span>`).join("")}</div>
          </div>
        </div>
        <div class="asv-half">
          <p class="asv-ctitle asv-ctitle-sm">Time of day</p>
          <div class="asv-cgrid" data-todchart>
            ${gridRows(["$900", "$400", "$-100"], [0, 40, 80])}
            <svg class="asv-plot asv-anim" data-todplot viewBox="0 0 512 75" preserveAspectRatio="none" style="left:68px;top:15px;width:512px;height:75px">
              <path data-todfill d="${FIGMA_TOD_FILL}" fill="#FF4D00" fill-opacity="0.05"/>
              <path data-todstroke d="${FIGMA_TOD_STROKE}" stroke="#FF4D00" stroke-width="2" fill="none"/>
            </svg>
            <div class="asv-gx asv-anim" data-todx style="left:68px;right:0"><span class="asv-xfirst">10 am</span><span>3 pm</span><span>10pm</span></div>
          </div>
        </div>
      </div>
    </section>

    <div class="asv-tables">
      <div class="asv-tcol">${TABLES_LEFT}</div>
      <div class="asv-tcol">${TABLES_RIGHT}</div>
    </div>`;

  root.innerHTML = `
    <div class="demo-stage">
      <div class="adv asv">
        <aside class="adv-rail1">
          <div class="adv-r1head"><span class="adv-logomark"></span></div>
          <div class="adv-r1menu">
            <div class="adv-r1tools">
              <button class="adv-iconbtn adv-r1toggle" aria-label="Navigation">${I.outdent}</button>
            </div>
            ${NAV1.map(railItem).join("")}
          </div>
          <div class="adv-r1foot"><div class="adv-item adv-version">version 5.53.0</div></div>
        </aside>

        <header class="adv-top">
          <div class="adv-crumbs">
            <span class="adv-crumb adv-crumb-on">Report center</span>
            <span class="adv-crumb">/</span>
            <span class="adv-crumb">Sales summary</span>
          </div>
          <nav class="adv-topnav">
            ${TOPNAV.map(([ic, label]) => `<span class="adv-topitem"><span class="adv-ic20">${ic}</span>${label}<span class="adv-ic12">${I.chev}</span></span>`).join("")}
          </nav>
        </header>

        <aside class="adv-rail2">
          <div class="adv-r2top">
            <button class="adv-iconbtn adv-r2toggle" aria-label="Collapse sub-navigation">${I.outdent}</button>
            ${SUBNAV.map(([group, kids]) => `
            <div class="adv-item2 adv-parent2"><span class="adv-itemlabel">${group}</span><span class="adv-ic16 adv-chev-up">${I.chev}</span></div>
            <div class="adv-sub2">
              <div class="adv-sub2wrap">
                ${kids.map((label) => `<div class="adv-subitem2${label === "Sales Summary" ? " adv-sub2on" : ""}">${label}</div>`).join("")}
              </div>
            </div>`).join("")}
          </div>
        </aside>

        <main class="adv-content asv-main">${CONTENT}</main>
      </div>
    </div>`;

  const $ = (sel) => root.querySelector(sel);
  const $$ = (sel) => [...root.querySelectorAll(sel)];
  const stage = $(".demo-stage");
  const device = $(".adv");
  const content = $(".asv-main");

  /* scale the native 1752x1080 viewport to the stage width */
  const W = 1752, H = 1080;
  const fit = () => {
    const s = stage.clientWidth / W;
    device.style.transform = `scale(${s})`;
    stage.style.height = `${Math.round(H * s)}px`;
  };
  new ResizeObserver(fit).observe(stage);
  fit();

  /* rails are static by design, same as the dashboard-04 figure */

  /* ---- small interactions: segmented tabs, filter chips ---- */
  $$(".asv-tab").forEach((tab) => tab.addEventListener("click", () => {
    $$(".asv-tab").forEach((t) => t.classList.toggle("on", t === tab));
  }));
  $$(".asv-chipx").forEach((x) => x.addEventListener("click", () => x.closest(".asv-chip").remove()));

  /* ======================================================================
     charts
     ====================================================================== */
  const dayPath = $("[data-daypath]");
  const dayPlot = $("[data-dayplot]");
  const dayX = $("[data-dayx]");
  const dowBars = $$("[data-dowbars] .asv-bar");
  const todFill = $("[data-todfill]");
  const todStroke = $("[data-todstroke]");
  const todPlot = $("[data-todplot]");
  const todX = $("[data-todx]");

  const BAR_X = [84, 157.33, 230.67, 304, 377.33, 450.67, 524];
  const paintBars = (dow) => {
    dowBars.forEach((bar, i) => {
      const v = dow[i];
      const h = Math.max(Math.abs(v) / 10, 0);
      bar.style.left = `${BAR_X[i]}px`;
      bar.style.height = `${h}px`;
      bar.style.top = v >= 0 ? `${70 - h}px` : "71px";
      bar.classList.toggle("asv-bar-neg", v < 0);
      bar.style.opacity = v === 0 ? "0" : "1";
    });
  };
  paintBars(DS.full.dow);

  /* tooltip sampling along the rendered path */
  let samples = [];
  const buildSamples = () => {
    samples = [];
    const len = dayPath.getTotalLength();
    for (let i = 0; i <= 240; i++) {
      const p = dayPath.getPointAtLength((len * i) / 240);
      samples.push(p);
    }
  };
  buildSamples();

  let ds = DS.full;
  const tip = $("[data-tip]");
  const money = (v) => `$${Math.max(0, Math.round(v))}.00`;
  const showTipAt = (x) => {
    /* x in plot coords 0..1163 */
    x = Math.max(0, Math.min(PLOT_W, x));
    let best = samples[0];
    for (const p of samples) if (Math.abs(p.x - x) < Math.abs(best.x - x)) best = p;
    const net = 900 - best.y * 12.5;
    const idx = Math.round((best.x / PLOT_W) * ((ds.dates ? ds.dates.length : 1) - 1));
    $("[data-tip-date]").textContent = ds.dates ? ds.dates[idx] : ds.dateLabel;
    $("[data-tip-net]").textContent = money(net);
    const orders = Math.max(1, Math.round(Math.max(net, 0) / 41.7));
    $("[data-tip-orders]").textContent = orders;
    $("[data-tip-guests]").textContent = orders;
    tip.style.left = `${68 + best.x}px`;
    tip.style.top = `${10 + best.y}px`;
    tip.classList.toggle("asv-tip-flip", best.x > PLOT_W - 240);
    tip.classList.add("on");
  };
  const hideTip = () => tip.classList.remove("on");
  showTipAt(579); /* the design's resting tooltip: May 30, $417.00 */

  /* manual hover on the Sales-by-day chart */
  let userOnChart = false;
  const dayChart = $("[data-daychart]");
  dayChart.addEventListener("mousemove", (e) => {
    userOnChart = true;
    const r = dayChart.getBoundingClientRect();
    const scale = r.width / dayChart.offsetWidth;
    showTipAt((e.clientX - r.left) / scale - 68);
  });
  dayChart.addEventListener("mouseleave", () => { userOnChart = false; });

  /* swap all three charts to a dataset (crossfade; bars glide via CSS) */
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const applyDataset = async (key) => {
    ds = DS[key] || DS.full;
    $("[data-preset-label]").textContent = ds.preset;
    $("[data-range-label]").textContent = ds.range;
    $$("[data-pick]").forEach((m) => m.classList.toggle("asv-msel", (DS[m.dataset.pick] || {}).preset === ds.preset));
    hideTip();
    [dayPlot, dayX, todPlot, todX].forEach((el) => el.classList.add("asv-fade"));
    await sleep(reduced ? 0 : 270);
    dayPath.setAttribute("d", ds.dayPath || ptsToPath(ds.day, yDay));
    dayX.innerHTML = xlabelsHtml(ds.xlabels);
    if (ds.todFill) {
      todFill.setAttribute("d", ds.todFill);
      todStroke.setAttribute("d", ds.todStroke);
    } else {
      const t = todPts(ds.tod);
      todFill.setAttribute("d", t.fill);
      todStroke.setAttribute("d", t.stroke);
    }
    paintBars(ds.dow);
    buildSamples();
    [dayPlot, dayX, todPlot, todX].forEach((el) => el.classList.remove("asv-fade"));
  };

  /* ======================================================================
     date-preset dropdown + dual-month custom-range calendar
     ====================================================================== */
  const menu = $("[data-menu]");
  const cal = $("[data-cal]");
  const presetBtn = $("[data-preset-btn]");
  const rangeBtn = $("[data-range-btn]");
  const openPanel = (el, on) => el.classList.toggle("on", on);
  const closePanels = () => { openPanel(menu, false); openPanel(cal, false); };

  presetBtn.addEventListener("click", () => {
    const on = !menu.classList.contains("on");
    closePanels();
    openPanel(menu, on);
  });
  rangeBtn.addEventListener("click", () => {
    const on = !cal.classList.contains("on");
    closePanels();
    openPanel(cal, on);
  });
  device.addEventListener("click", (e) => {
    if (!e.target.closest("[data-menu],[data-cal],[data-preset-btn],[data-range-btn]")) closePanels();
  });

  $$("[data-pick]").forEach((item) => item.addEventListener("click", () => {
    closePanels();
    if (item.dataset.pick === "custom") { openPanel(cal, true); return; }
    applyDataset(item.dataset.pick);
  }));

  /* calendar range selection */
  let calStart = null, calEnd = null;
  const cells = $$(".asv-cd[data-serial]");
  const paintCal = () => {
    cells.forEach((c) => {
      const s = +c.dataset.serial;
      c.classList.toggle("asv-cd-cap", s === calStart || s === calEnd);
      c.classList.toggle("asv-cd-inr", calStart != null && calEnd != null && s > calStart && s < calEnd);
    });
  };
  cells.forEach((c) => c.addEventListener("click", () => {
    const s = +c.dataset.serial;
    if (calStart == null || calEnd != null) { calStart = s; calEnd = null; }
    else if (s >= calStart) calEnd = s;
    else { calEnd = calStart; calStart = s; }
    paintCal();
  }));
  $("[data-cal-cancel]").addEventListener("click", () => { calStart = calEnd = null; paintCal(); closePanels(); });
  $("[data-cal-apply]").addEventListener("click", async () => {
    closePanels();
    if (calStart == null) return;
    if (calEnd == null) calEnd = calStart;
    await applyDataset("full");
    $("[data-preset-label]").textContent = "Custom range";
    $("[data-range-label]").textContent = `${fmtSerial(calStart)} - ${fmtSerial(calEnd)}`;
    $$("[data-pick]").forEach((m) => m.classList.toggle("asv-msel", m.dataset.pick === "custom"));
  });
  $("[data-search-btn]").addEventListener("click", async () => {
    [dayPlot, todPlot].forEach((el) => el.classList.add("asv-fade"));
    await sleep(reduced ? 0 : 250);
    [dayPlot, todPlot].forEach((el) => el.classList.remove("asv-fade"));
  });

  /* ======================================================================
     auto-play loop
     ====================================================================== */
  let onStage = true;
  new IntersectionObserver(([e]) => (onStage = e.isIntersecting), { threshold: 0.3 }).observe(stage);
  const waitOnStage = async () => { while (!onStage) await sleep(280); };

  const press = async (el) => {
    if (!el) return;
    el.classList.add("asv-press");
    await sleep(200);
    el.classList.remove("asv-press");
    el.click();
    await sleep(120);
  };
  const hover = async (el, ms) => {
    if (!el) return;
    el.classList.add("asv-hov");
    await sleep(ms || 150);
    el.classList.remove("asv-hov");
  };

  const glideTip = (ms, from, to) => new Promise((done) => {
    const t0 = performance.now();
    const ease = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
    const frame = (now) => {
      if (userOnChart) return done(); /* the visitor took over the chart */
      const t = Math.min((now - t0) / ms, 1);
      showTipAt((from + (to - from) * ease(t)) * PLOT_W);
      t < 1 ? requestAnimationFrame(frame) : done();
    };
    requestAnimationFrame(frame);
  });

  const glideScroll = (target, ms) => new Promise((done) => {
    const from = content.scrollTop;
    const t0 = performance.now();
    const ease = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
    const frame = (now) => {
      const t = Math.min((now - t0) / ms, 1);
      content.scrollTop = from + (target - from) * ease(t);
      t < 1 ? requestAnimationFrame(frame) : done();
    };
    requestAnimationFrame(frame);
  });

  const pickViaMenu = async (key) => {
    closePanels();
    await press(presetBtn);
    await sleep(420);
    const items = $$("[data-pick]");
    for (const item of items) {
      await hover(item, 120);
      if (item.dataset.pick === key) { await press(item); return; }
    }
  };

  const cycle = async () => {
    for (;;) {
      await waitOnStage();
      await sleep(1400);

      /* 1 — the tooltip strolls along the sales line */
      if (!userOnChart) { showTipAt(0.12 * PLOT_W); await glideTip(2600, 0.12, 0.88); }
      await sleep(600);
      hideTip();

      /* 2 — preset dropdown: Last 7 days */
      await waitOnStage();
      await pickViaMenu("week");
      await sleep(2200);
      if (!userOnChart) { showTipAt(0.15 * PLOT_W); await glideTip(1800, 0.15, 0.8); }
      await sleep(500);
      hideTip();

      /* 3 — custom range via the dual calendar: May 10 → Jun 19 */
      await waitOnStage();
      await pickViaMenu("custom");
      await sleep(650);
      const d1 = $('.asv-cd[data-serial="10"]');
      const d2 = $('.asv-cd[data-serial="50"]');
      await hover(d1, 320); await press(d1);
      await sleep(480);
      await hover(d2, 320); await press(d2);
      await sleep(650);
      await press($("[data-cal-apply]"));
      await sleep(1600);

      /* 4 — the summary tables below cover the books */
      await waitOnStage();
      await glideScroll(760, 1500);
      await sleep(1100);
      await glideScroll(0, 1300);
      await sleep(1400);
    }
  };
  if (!reduced) cycle();
})();
