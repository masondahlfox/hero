/* HeroFocus — TV D-pad focus for a concept page (used by C9–C11).
   Zones: nav (page nav strip) · hero (the CTAs) · rail (stub rail below).
     hero:  ← → move across the CTAs. → past the last CTA brings the next item into the main hero
            position (the peek never takes focus); ← from the first CTA brings back the previous item.
            ↑ goes to the nav, ↓ leaves the hero for the rail. Nothing scrolls inside the hero.
     nav:   ← → across Search / Home / Live / Hubs / My Stuff / Profile; ↓ back to the primary CTA.
     rail:  ← → across tiles; ↑ back to the primary CTA.
   Focus always resets to the primary CTA when a new slide lands. Nothing in the margins takes focus. */
(function () {
  /* Hit boxes measured from assets/ui/nav-strip.png and rail-strip.png (stage px) */
  const NAV = [[660, 38, 56, 56, 28], [741, 36, 114, 60, 10], [872, 36, 104, 60, 10], [996, 36, 104, 60, 10], [1124, 36, 140, 60, 10], [1740, 34, 60, 60, 30]];
  const RAIL = Array.from({ length: 6 }, (_, k) => [120 + k * 285, 978, 252, 142, 16]);

  function init(K, { ctas }) {
    const stage = K.stage;
    stage.insertAdjacentHTML("beforeend", `<div class="fring" id="fring"></div>
      <style>
        .fring { position: absolute; z-index: 80; pointer-events: none; opacity: 0; border-radius: 12px;
          box-shadow: 0 0 0 4px #fff, 0 0 26px 6px rgba(255,255,255,.28);
          transition: left .22s var(--ease-std), top .22s var(--ease-std), width .22s var(--ease-std), height .22s var(--ease-std), opacity .2s; }
        .fring.on { opacity: 1; }
        .stage.zone-rail .page-rail { transform: translateY(-8px); }
        .stage:not(.zone-hero) .btn.is-focused { background: var(--btn-2); color: #fff; transform: none; box-shadow: none; }
      </style>`);
    const ring = stage.querySelector("#fring");
    const st = { zone: "hero", i: 0, nav: 1, rail: 0 };

    function paint() {
      stage.classList.toggle("zone-hero", st.zone === "hero");
      stage.classList.toggle("zone-nav", st.zone === "nav");
      stage.classList.toggle("zone-rail", st.zone === "rail");
      const list = ctas() || [];
      list.forEach((b, k) => b.classList.toggle("is-focused", st.zone === "hero" ? k === st.i : k === 0));
      const box = st.zone === "nav" ? NAV[st.nav] : st.zone === "rail" ? RAIL[st.rail] : null;
      if (box) {
        const [x, y, w, h, r] = box;
        Object.assign(ring.style, { left: x + "px", top: (st.zone === "rail" ? y - 8 : y) + "px", width: w + "px", height: h + "px", borderRadius: r + "px" });
      }
      ring.classList.toggle("on", !!box);
    }

    K.onKey((e) => {
      const k = e.key, n = (ctas() || []).length;
      if (st.zone === "hero") {
        if (k === "ArrowRight") { if (st.i < n - 1) st.i++; else { st.i = 0; K.rot.next(true); } }
        else if (k === "ArrowLeft") { if (st.i > 0) st.i--; else { st.i = 0; K.rot.prev(true); } }
        else if (k === "ArrowUp") st.zone = "nav";
        else if (k === "ArrowDown") st.zone = "rail";
        else if (k === "Enter") return true;
        else return false;
      } else if (st.zone === "nav") {
        if (k === "ArrowRight") st.nav = Math.min(NAV.length - 1, st.nav + 1);
        else if (k === "ArrowLeft") st.nav = Math.max(0, st.nav - 1);
        else if (k === "ArrowDown") { st.zone = "hero"; st.i = 0; }
        else if (k === "ArrowUp" || k === "Enter") {}
        else return false;
      } else {
        if (k === "ArrowRight") st.rail = Math.min(RAIL.length - 1, st.rail + 1);
        else if (k === "ArrowLeft") st.rail = Math.max(0, st.rail - 1);
        else if (k === "ArrowUp") { st.zone = "hero"; st.i = 0; }
        else if (k === "ArrowDown" || k === "Enter") {}
        else return false;
      }
      paint();
      return true;
    });

    const api = {
      get zone() { return st.zone; },
      /* Call after a new slide's CTAs are in the DOM: focus lands on its primary CTA */
      refresh() { st.i = 0; paint(); },
      paint,
    };
    paint();
    return api;
  }

  window.HeroFocus = { init };
})();
