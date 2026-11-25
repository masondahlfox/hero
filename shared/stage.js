/* HeroKit — shared stage chrome, metadata renderer, rotation timer, HUD + keys. */
(function () {
  const OPTIONS = [
    ["c1-magnify-conveyor.html", "C1 · Magnify Conveyor"],
    ["c2-title-portal.html", "C2 · Title Portal"],
    ["c3-now-line.html", "C3 · Now Line"],
    ["c4-bento-morph.html", "C4 · Bento Morph"],
    ["c5-depth-queue.html", "C5 · Depth Queue"],
    ["c6-fox-o-window.html", "C6 · FOX-O Window"],
    ["01-cinematic-crossfade.html", "01 · Cinematic Crossfade"],
    ["02-peek-carousel.html", "02 · Peek Carousel"],
    ["03-thumbnail-selector.html", "03 · Thumbnail Selector"],
    ["04-diagonal-wipe.html", "04 · Diagonal Wipe"],
    ["05-parallax-depth.html", "05 · Parallax Depth"],
    ["06-live-takeover.html", "06 · Live Takeover"],
    ["07-content-tabs.html", "07 · Content-Type Tabs"],
  ];

  const ICONS = {
    play: '<svg viewBox="0 0 24 24"><path d="M6 3.8v16.4c0 .8.9 1.3 1.6.8l12.5-8.2c.6-.4.6-1.3 0-1.7L7.6 3c-.7-.5-1.6 0-1.6.8z"/></svg>',
    plus: '<svg viewBox="0 0 24 24"><path d="M11 3h2v8h8v2h-8v8h-2v-8H3v-2h8z"/></svg>',
    restart: '<svg viewBox="0 0 24 24"><path d="M12 4a8 8 0 1 1-7.7 10.1l1.9-.6A6 6 0 1 0 7.8 7.8L10 10H3V3l2.4 2.4A8 8 0 0 1 12 4z"/></svg>',
    bell: '<svg viewBox="0 0 24 24"><path d="M12 2a6 6 0 0 0-6 6v4.6L4.3 16a1 1 0 0 0 .9 1.5h13.6a1 1 0 0 0 .9-1.5L18 12.6V8a6 6 0 0 0-6-6zm-2.5 17a2.5 2.5 0 0 0 5 0z"/></svg>',
    mute: '<svg viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.6 3 2.7-2.7-1.4-1.4-2.7 2.7-2.7-2.7-1.4 1.4 2.7 2.7-2.7 2.7 1.4 1.4 2.7-2.7 2.7 2.7 1.4-1.4z"/></svg>',
    info: '<svg viewBox="0 0 24 24"><path d="M11 10h2v7h-2zm0-3h2v2h-2zm1-5a10 10 0 1 0 0 20 10 10 0 0 0 0-20z"/></svg>',
  };

  const T0 = Date.now();
  const pad2 = (n) => String(n).padStart(2, "0");
  const fmtClock = (ms) => new Date(ms).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

  /* ---------- Metadata block ---------- */
  function metaBlock(item, opts = {}) {
    const parts = [];
    if (item.sponsor) parts.push(`<div class="sponsor">${item.sponsor.label} <b>${item.sponsor.name}</b></div>`);

    if (item.type === "live") {
      const s = item.score;
      parts.push(`<div class="status-row">
        <span class="badge badge--live"><span class="dot"></span>${item.status.badge}</span>
        <span class="score" data-score>
          <span class="score__t" style="--c:${s.away.color}">${s.away.abbr} <em data-side="away">${s.away.score}</em></span>
          <span class="score__t" style="--c:${s.home.color}">${s.home.abbr} <em data-side="home">${s.home.score}</em></span>
          <span class="score__clock">${s.clock}</span>
        </span></div>`);
    } else if (item.status) {
      parts.push(`<div class="status-row"><span class="badge badge--${item.status.kind || "new"}">${item.status.badge}</span></div>`);
    }

    parts.push(item.logo
      ? `<div class="logo"><img src="${item.logo}" alt="${item.logoAlt || ""}" draggable="false"></div>`
      : `<div class="logo logo--type">${item.logoText}</div>`);

    parts.push(`<div class="meta">${item.meta.map((m, i) => i === 0 ? `<span class="net">${m}</span>` : `<span>${m}</span>`).join("")}</div>`);

    if (item.live && !opts.noLivebar) parts.push(livebar(item));
    if (item.countdown && !opts.noCountdown) parts.push(`<div class="countdown" data-countdown="${T0 + item.countdown.startsInMin * 60000}">${item.countdown.label} <span class="countdown__units"></span></div>`);
    if (item.tagline) parts.push(`<div class="tagline">${item.tagline}</div>`);
    if (item.social && !opts.noSocial) {
      const ico = item.social.live ? '<span class="ico ico--live"></span>' : item.social.icon ? '<span class="ico"></span>' : "";
      parts.push(`<div class="social">${ico}<span>${item.social.text}</span></div>`);
    }
    parts.push(`<div class="ctas">${item.ctas.map((c, i) => i === 0
      ? `<span class="btn ${opts.unfocused ? "" : "is-focused"}">${ICONS[c.icon]}${c.label}</span>`
      : `<span class="btn btn--sq" title="${c.label}">${ICONS[c.icon]}</span>`).join("")}</div>`);

    const html = parts.map((p, i) => p.replace(/^<(\w+) class="/, `<$1 style="--i:${i}" class="`)).join("");
    return `<div class="meta-block ${opts.stagger === false ? "" : "stagger"} ${opts.cls || ""}" data-type="${item.type}">${html}</div>`;
  }

  function livebar(item) {
    const start = T0 - item.live.startedMinAgo * 60000, end = start + item.live.durationMin * 60000;
    return `<div class="livebar" data-live-start="${start}" data-live-end="${end}">
      <span>${fmtClock(start)}</span><span class="livebar__track"><span class="livebar__fill"></span></span><span>${fmtClock(end)}</span></div>`;
  }

  /* Live clocks + countdowns update once a second everywhere on the page */
  function tick() {
    const now = Date.now();
    document.querySelectorAll("[data-live-start]").forEach((el) => {
      const s = +el.dataset.liveStart, e = +el.dataset.liveEnd;
      el.style.setProperty("--p", (Math.min(1, (now - s) / (e - s)) * 100).toFixed(2) + "%");
    });
    document.querySelectorAll("[data-countdown]").forEach((el) => {
      let d = Math.max(0, +el.dataset.countdown - now) / 1000;
      const D = Math.floor(d / 86400); d -= D * 86400;
      const H = Math.floor(d / 3600); d -= H * 3600;
      const M = Math.floor(d / 60); const S = Math.floor(d - M * 60);
      const u = el.querySelector(".countdown__units");
      if (u) u.innerHTML = [[D, "Days"], [H, "Hrs"], [M, "Min"], [S, "Sec"]].map(([v, l]) => `<span class="countdown__u"><b>${pad2(v)}</b><small>${l}</small></span>`).join("");
    });
  }

  /* ---------- Rotation timer ---------- */
  function Rotator({ count, durationFor, onChange, onTick, minGap = 420 }) {
    let i = 0, elapsed = 0, last = performance.now(), paused = false, lastManual = -1e9;
    const api = {
      get index() { return i; },
      get paused() { return paused; },
      go(n, dir, manual) {
        if (manual) { const t = performance.now(); if (t - lastManual < minGap) return false; lastManual = t; }
        const prev = i; i = ((n % count) + count) % count; elapsed = 0;
        if (prev !== i || manual) onChange && onChange(i, prev, dir || 1);
        kit.refreshHud(); return true;
      },
      next(manual) { return api.go(i + 1, 1, manual); },
      prev(manual) { return api.go(i - 1, -1, manual); },
      toggle() { paused = !paused; kit.refreshHud(); },
      setPaused(v) { paused = v; kit.refreshHud(); },
      restartTimer() { elapsed = 0; },
    };
    function loop(now) {
      const dt = now - last; last = now;
      if (!paused) elapsed += dt;
      const d = durationFor(i);
      onTick && onTick(Math.min(elapsed / d, 1), i, elapsed);
      if (elapsed >= d) api.go(i + 1, 1);
      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
    return api;
  }

  /* ---------- Stage chrome, scaling, HUD ---------- */
  const kit = {
    data: window.HERO_DATA, ICONS, metaBlock, livebar, Rotator, T0,
    art: (item, layer, opts) => window.HeroArt.render(item, layer, opts),
    stage: null, rot: null, flags: { safe: false, grid: false, ref: false, native: false },
    keyHandlers: [],
    onKey(fn) { this.keyHandlers.push(fn); },

    init({ title, notes = "", extraKeys = [], nav = true, rail = true }) {
      const stage = (this.stage = document.getElementById("stage"));
      this.flags.nav = nav; this.flags.rail = rail;
      stage.classList.toggle("no-nav", !nav); stage.classList.toggle("no-rail", !rail);
      if (window.self !== window.top || /embed/.test(location.search)) document.body.classList.add("embedded");

      stage.insertAdjacentHTML("afterbegin", `
        <img class="page-nav" src="assets/ui/nav-strip.png" alt="" draggable="false">
        <img class="page-rail" src="assets/ui/rail-strip.png" alt="" draggable="false">`);
      stage.insertAdjacentHTML("beforeend", `
        <img class="ref-overlay" src="assets/ui/reference-home-template-1080.jpg" alt="">
        <div class="overlay overlay--safe">
          <div class="safe-box safe-box--action"><span>Action-safe 5% · 96×54</span></div>
          <div class="safe-box safe-box--title"><span>Title-safe 10% · 192×108</span></div>
          <div class="safe-box safe-box--card"><span>Card content · 64px pad</span></div>
        </div>
        <div class="overlay overlay--grid"><div class="cols">${"<div></div>".repeat(12)}</div></div>`);

      const idx = OPTIONS.findIndex(([f]) => location.pathname.endsWith(f));
      const prevO = OPTIONS[(idx - 1 + OPTIONS.length) % OPTIONS.length], nextO = OPTIONS[(idx + 1) % OPTIONS.length];
      document.body.insertAdjacentHTML("beforeend", `
        <div class="hud" id="hud">
          <div class="hud__head"><span class="hud__title">${title}</span>
            <span class="hud__nav"><a href="${prevO[0]}">‹ prev</a><a href="index.html">all</a><a href="${nextO[0]}">next ›</a></span></div>
          <div class="hud__notes">${notes}</div>
          <div class="hud__status" id="hudStatus"></div>
          <div class="hud__keys">
            <kbd>← →</kbd><span>Previous / next slide</span>
            <kbd>Space</kbd><span>Pause / resume auto-rotate</span>
            ${extraKeys.map(([k, d]) => `<kbd>${k}</kbd><span>${d}</span>`).join("")}
            <kbd>N</kbd><span>Show / hide page nav</span>
            <kbd>R</kbd><span>Show / hide next rail (context)</span>
            <kbd>S</kbd><span>Safe zones</span>
            <kbd>G</kbd><span>12-col grid</span>
            <kbd>O</kbd><span>Overlay your home template (50%)</span>
            <kbd>F</kbd><span>Fit to window / 1:1 pixels</span>
            <kbd>H</kbd><span>Hide this panel</span>
            <kbd>[ ]</kbd><span>Previous / next option</span>
          </div>
        </div>`);
      this.hud = document.getElementById("hud");
      this._next = nextO[0]; this._prev = prevO[0];

      const fit = () => stage.style.setProperty("--s", Math.min(innerWidth / 1920, innerHeight / 1080));
      addEventListener("resize", fit); fit();

      addEventListener("keydown", (e) => {
        if (e.metaKey || e.ctrlKey || e.altKey) return;
        for (const h of this.keyHandlers) if (h(e) === true) { e.preventDefault(); return; }
        const k = e.key;
        if (k === "ArrowRight") { this.rot && this.rot.next(true); }
        else if (k === "ArrowLeft") { this.rot && this.rot.prev(true); }
        else if (k === " ") { this.rot && this.rot.toggle(); }
        else if (k === "s" || k === "S") this.toggle("safe", "show-safe");
        else if (k === "g" || k === "G") this.toggle("grid", "show-grid");
        else if (k === "o" || k === "O") this.toggle("ref", "show-ref");
        else if (k === "n" || k === "N") { this.flags.nav = !this.flags.nav; stage.classList.toggle("no-nav", !this.flags.nav); }
        else if (k === "r" || k === "R") { this.flags.rail = !this.flags.rail; stage.classList.toggle("no-rail", !this.flags.rail); }
        else if (k === "f" || k === "F") { this.flags.native = !this.flags.native; document.body.classList.toggle("native", this.flags.native); this.refreshHud(); }
        else if (k === "h" || k === "H") this.hud.classList.toggle("is-hidden");
        else if (k === "]") location.href = this._next;
        else if (k === "[") location.href = this._prev;
        else return;
        e.preventDefault();
      });

      tick(); setInterval(tick, 1000);
      return this;
    },

    toggle(flag, cls) { this.flags[flag] = !this.flags[flag]; this.stage.classList.toggle(cls, this.flags[flag]); this.refreshHud(); },

    refreshHud() {
      const el = document.getElementById("hudStatus"); if (!el) return;
      const r = this.rot, n = this.data.length;
      const pill = (t, on) => `<span class="hud__pill ${on ? "is-on" : ""}">${t}</span>`;
      el.innerHTML = [
        r ? pill(`Slide ${r.index + 1}/${n}`, false) : "",
        r ? pill(r.paused ? "Paused" : "Auto-rotate", !r.paused) : "",
        this.flags.safe ? pill("Safe", true) : "", this.flags.grid ? pill("Grid", true) : "",
        this.flags.ref ? pill("Template", true) : "", this.flags.native ? pill("1:1", true) : "",
      ].join("");
    },

    /* Restart CSS animations on an element subtree (re-trigger stagger) */
    replay(el) { el.classList.remove("is-active"); void el.offsetWidth; el.classList.add("is-active"); this.syncVideos(el); },

    /* Only the active slide's video decodes — keeps TV-class hardware honest */
    syncVideos(activeEl) {
      document.querySelectorAll(".stage video").forEach((v) => {
        if (activeEl.contains(v)) { v.play().catch(() => {}); } else if (!v.paused) v.pause();
      });
    },
  };

  window.HeroKit = kit;
})();
