/* ---------------------------------------------------------------------------
   Shared hover treatment for every .fig-demo figure: the figure grows 5%
   under the cursor, and a colorful frame segment follows the mouse along
   the border (ring + radial mask live in demos.css; JS only feeds --mx/--my).
--------------------------------------------------------------------------- */
(function () {
  document.querySelectorAll(".fig-demo").forEach((fig) => {
    const wrap = document.createElement("div");
    wrap.className = "demo-ringwrap";
    wrap.innerHTML = '<div class="demo-ring"></div>';
    fig.appendChild(wrap);

    fig.addEventListener("mousemove", (e) => {
      const r = fig.getBoundingClientRect();
      const s = fig.offsetWidth / r.width; // undo the hover scale
      fig.style.setProperty("--mx", (e.clientX - r.left) * s + "px");
      fig.style.setProperty("--my", (e.clientY - r.top) * s + "px");
    });
  });
})();
