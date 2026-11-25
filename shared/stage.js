/* HeroKit — shared stage chrome, metadata renderer, rotation timer, HUD + keys. */
(function () {
  const OPTIONS = [
    ["c1-magnify-conveyor.html", "C1 · Magnify Conveyor"],
    ["c2-title-portal.html", "C2 · Title Portal"],
    ["c3-now-line.html", "C3 · Now Line"],
    ["c4-bento-morph.html", "C4 · Bento Morph"],
    ["c5-depth-queue.html", "C5 · Depth Queue"],
    ["c6-fox-o-window.html", "C6 · FOX-O Window"],
    ["c7-game-dash.html", "C7 · Game Dash"],
    ["c8-editorial-split.html", "C8 · Editorial Split"],
    ["c9-spine-shelf.html", "C9 · Spine Shelf"],
    ["c10-film-gate.html", "C10 · Film Gate"],
    ["c11-long-exposure.html", "C11 · Long Exposure"],
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
    plus: '<svg class="st" viewBox="0 0 24 24"><path d="M12 4v16M4 12h16"/></svg>',
    restart: '<svg viewBox="0 0 24 24"><path d="M12 4a8 8 0 1 1-7.7 10.1l1.9-.6A6 6 0 1 0 7.8 7.8L10 10H3V3l2.4 2.4A8 8 0 0 1 12 4z"/></svg>',
    bell: '<svg class="st" viewBox="0 0 24 24"><path d="M13 3.2A5.6 5.6 0 0 0 6.2 8.6v4.2L4.6 16h14.8l-1.6-3.2V11M9.8 19a2.3 2.3 0 0 0 4.4 0M18 2.5v6M15 5.5h6"/></svg>',
    mute: '<svg viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.6 3 2.7-2.7-1.4-1.4-2.7 2.7-2.7-2.7-1.4 1.4 2.7 2.7-2.7 2.7 1.4 1.4 2.7-2.7 2.7 2.7 1.4-1.4z"/></svg>',
    info: '<svg viewBox="0 0 24 24"><path d="M11 10h2v7h-2zm0-3h2v2h-2zm1-5a10 10 0 1 0 0 20 10 10 0 0 0 0-20z"/></svg>',
    search: '<svg viewBox="0 0 24 24"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5 20 20"/></svg>',
    person: '<svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="5"/><path d="M2 24c0-6 4.5-9 10-9s10 3 10 9z"/></svg>',
    bellPlus: '<svg viewBox="0 0 24 24"><path d="M12 2a6 6 0 0 0-6 6v4.6L4.3 16a1 1 0 0 0 .9 1.5h13.6a1 1 0 0 0 .9-1.5L18 12.6V8a6 6 0 0 0-6-6zm-2.5 17a2.5 2.5 0 0 0 5 0z"/></svg>',
  };

  const T0 = Date.now();
  const pad2 = (n) => String(n).padStart(2, "0");
  const fmtClock = (ms) => new Date(ms).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

  /* ---------- FOX One components (match LR.template.home) ---------- */
  const SPEC = /^(4K|HD|UHD|HDR|CC|TV-[\w]+|PG(-\d+)?|NR)$/i;
  const ui = {
    /* Status badge: LIVE (red, dot) or a white NEW EPISODE style badge. tile:true = tile chip geometry */
    badge(item, { tile = false, label } = {}) {
      const t = tile ? " badge--tile" : "";
      if (item.type === "live") return `<span class="badge badge--live${t}">${tile ? "" : '<span class="dot"></span>'}${label || (tile ? "Live" : item.status.badge)}</span>`;
      if (!item.status && !label) return "";
      const kind = (item.status && item.status.kind) || "new";
      return `<span class="badge badge--${kind}${t}">${label || item.status.badge}</span>`;
    },
    /* Meta row: [status] NET [spec] text text */
    metaRow(item, { status = true } = {}) {
      const bits = item.meta.map((m, i) => i === 0 ? `<span class="net">${m}</span>` : SPEC.test(m) ? `<span class="badge badge--spec">${m}</span>` : `<span>${m}</span>`);
      return `<div class="meta">${status ? ui.badge(item) : ""}${bits.join("")}</div>`;
    },
    score(item) {
      const s = item.score; if (!s) return "";
      return `<span class="score" data-score>
          <span class="score__t" style="--c:${s.away.color}">${s.away.abbr} <em data-side="away">${s.away.score}</em></span>
          <span class="score__t" style="--c:${s.home.color}">${s.home.abbr} <em data-side="home">${s.home.score}</em></span>
          <span class="score__clock">${s.clock}</span></span>`;
    },
    title(item, cls = "") {
      return item.logo
        ? `<div class="logo ${cls}"><img src="${item.logo}" alt="${item.logoAlt || ""}" draggable="false"></div>`
        : `<div class="logo logo--type ${cls}">${item.logoText}</div>`;
    },
    social(item) {
      if (!item.social) return "";
      const ico = item.social.live ? '<span class="ico ico--live"></span>' : `<span class="ico">${ICONS.info}</span>`;
      return `<div class="social">${ico}<span>${item.social.text}</span></div>`;
    },
    /* Primary white button + round secondaries */
    ctas(item, { unfocused = false, cls = "" } = {}) {
      return `<div class="ctas ${cls}">${item.ctas.map((c, i) => i === 0
        ? `<span class="btn btn--primary ${unfocused ? "" : "is-focused"}">${ICONS[c.icon]}${c.label}</span>`
        : `<span class="btn btn--round" title="${c.label}">${ICONS[c.icon]}</span>`).join("")}</div>`;
    },
    /* Portrait tile 252×378 (Live Lineup) */
    tile(item, { prog } = {}) {
      const a = item.art, src = a.still || a.poster || a.src;
      const pos = `${Math.round((item.focusX ?? .5) * 100)}% 50%`;
      return `<div class="tile-p"><img class="tile-p__art" src="${src}" alt="" draggable="false" style="object-position:${pos}">
        ${item.type === "live" ? ui.badge(item, { tile: true }) : ""}
        ${item.logo ? `<div class="tile-p__logo"><img src="${item.logo}" alt=""></div>` : ""}
        ${item.type === "live" || prog != null ? `<div class="tile-p__prog" style="--p:${prog ?? 45}%"><i></i></div>` : ""}</div>`;
    },
    nav(active = "Home") {
      return `<nav class="page-nav fo-nav" aria-label="FOX One">
        <img class="fo-nav__logo" src="assets/ui/fox-one-logo.png" alt="FOX One" draggable="false">
        <div class="fo-nav__items">
          <span class="fo-nav__item fo-nav__item--icon" title="Search">${ICONS.search}</span>
          ${["Home", "Live", "Hubs", "My Stuff"].map((t) => `<span class="fo-nav__item ${t === active ? "is-active" : ""}">${t}</span>`).join("")}
        </div>
        <span class="fo-nav__profile" title="Profile">${ICONS.person}</span>
      </nav>`;
    },
  };

  /* ---------- Up-next peek: every concept shows the next title (no dots / numbers) ----------
     mountPeek(host, style) adds a 16:9 tile of the NEXT title; the Rotator keeps it in sync and fills its bar with the dwell. */
  function mountPeek(host, style = "") {
    host.insertAdjacentHTML("beforeend", `<div class="peek" style="${style}"><div class="peek__in"></div><div class="peek__bar"><i></i></div></div>`);
    const el = host.lastElementChild; kit.peeks.push(el); updatePeeks(kit.rot ? kit.rot.index : 0); return el;
  }
  function peekHtml(item) {
    const a = item.art, src = a.still || a.poster || a.src;
    return `<div class="peek__card"><img class="peek__art" src="${src}" alt="" draggable="false">
      ${item.type === "live" ? ui.badge(item, { tile: true }) : ""}${item.logo ? `<img class="peek__logo" src="${item.logo}" alt="">` : ""}</div>`;
  }
  function updatePeeks(i) {
    const D = kit.data, n = D.length;
    kit.peeks.forEach((el) => {
      const inn = el.querySelector(".peek__in"), d = D[(i + 1) % n];
      if (el.dataset.id === d.id) return; el.dataset.id = d.id;
      inn.querySelectorAll(".peek__card").forEach((c) => { c.classList.add("out"); setTimeout(() => c.remove(), 500); });
      inn.insertAdjacentHTML("beforeend", peekHtml(d));
      const c = inn.lastElementChild; requestAnimationFrame(() => requestAnimationFrame(() => c.classList.add("in")));
    });
  }

  /* ---------- Metadata block ---------- */
  function metaBlock(item, opts = {}) {
    // Minimal lockup (Mason): title art · light meta row with Live / black-white badge · one short line · CTAs.
    // No scores, progress bars, countdowns, sponsor or social lines.
    const parts = [ui.title(item), ui.metaRow(item)];
    if (item.tagline && !opts.noTagline) parts.push(`<div class="tagline">${item.tagline}</div>`);
    parts.push(ui.ctas(item, opts));
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
        kit.focus && kit.focus.refresh();
        updatePeeks(i);
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
      if (kit.peeks.length) { const w = (Math.min(elapsed / d, 1) * 100).toFixed(1) + "%"; kit.peeks.forEach((el) => (el.querySelector(".peek__bar i").style.width = w)); }
      if (elapsed >= d) api.go(i + 1, 1);
      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
    updatePeeks(0);
    return api;
  }


  /* ---------- D-pad focus model (same in every concept) ----------
     Three stacked zones: NAV ↑ HERO ↓ RAIL. Focus starts on the hero's primary CTA.
     HERO (default "ctas" mode): ← → move across Watch · + · bell. Pressing → on the last button
       pages to the next title (focus lands on its Watch button); ← on the first button pages back.
       Auto-advance runs with visible progress and holds for 8s after any press.
     HERO ("carousel" mode, for concepts whose hero IS a row of tiles): ← → move along the row, OK plays.
     ↑ from the hero always goes to the nav; ↓ always goes to the Live Lineup row below the hero.
     No vertical scrolling inside the hero. */
  function Focus(kit, opts) {
    const stage = kit.stage, mode = opts.heroMode || "ctas", HOLD = 8000;
    const st = { zone: "hero", cta: 0, nav: 1, tile: 0, userPaused: false, holdUntil: 0, want: null };
    const navEls = () => [...stage.querySelectorAll(".fo-nav__item, .fo-nav__profile")];
    const tiles = () => [...stage.querySelectorAll(".rail-tiles .tile-p")];
    const visible = (el) => el.checkVisibility ? el.checkVisibility({ opacityProperty: true, visibilityProperty: true }) : !!el.offsetParent;
    function heroBtns() {
      if (opts.heroItems) return opts.heroItems();   // concept-supplied focus row (e.g. CTAs + an inline trailer)
      const groups = [...stage.querySelectorAll(".ctas")].filter((g) => !g.closest(".page-rail") && visible(g) && !g.closest(".out, .is-prev, .is-out"));
      const g = groups[groups.length - 1];
      return g ? [...g.querySelectorAll(".btn")] : [];
    }
    let raf = 0;
    function apply() {
      raf = 0;
      stage.querySelectorAll(".is-focused").forEach((el) => el.classList.remove("is-focused"));
      stage.classList.toggle("at-rail", st.zone === "rail");
      stage.classList.toggle("nav-focus", st.zone === "nav");
      stage.classList.toggle("hero-focus", st.zone === "hero");
      if (st.zone === "hero" && mode === "ctas") {
        // Every rendered CTA row mirrors the focused index, so crossfading slides never flash the wrong state
        if (opts.heroItems) { const b = opts.heroItems(); const n = Math.min(st.cta, b.length - 1); if (b[n]) b[n].classList.add("is-focused"); }
        else stage.querySelectorAll(".ctas").forEach((g) => { const b = g.querySelectorAll(".btn"); const n = Math.min(st.cta, b.length - 1); if (b[n]) b[n].classList.add("is-focused"); });
      } else if (st.zone === "nav") { const n = navEls(); n[st.nav] && n[st.nav].classList.add("is-focused"); }
      else if (st.zone === "rail") {
        const t = tiles(); st.tile = Math.min(st.tile, t.length - 1); t[st.tile] && t[st.tile].classList.add("is-focused");
        const row = stage.querySelector(".rail-tiles"); if (row) row.style.transform = `translateX(${-Math.max(0, st.tile - 4) * 284}px)`;
      }
      pause();
    }
    const schedule = () => { if (!raf) raf = requestAnimationFrame(apply); };
    new MutationObserver((list) => { if (list.some((m) => m.addedNodes.length)) schedule(); }).observe(stage, { childList: true, subtree: true });

    function pause() {
      const r = kit.rot; if (!r) return;
      const want = st.userPaused || st.zone !== "hero" || performance.now() < st.holdUntil;
      if (want !== st.want) { st.want = want; r.setPaused(want); }
    }
    setInterval(pause, 250);
    const hold = () => { st.holdUntil = performance.now() + HOLD; };
    const page = (dir) => { const r = kit.rot; if (!r) return; st.cta = 0; st.want = null; r.setPaused(false); dir > 0 ? r.next(true) : r.prev(true); r.restartTimer(); hold(); };
    const press = (el) => { if (!el) return; el.classList.remove("is-pressed"); void el.offsetWidth; el.classList.add("is-pressed"); setTimeout(() => el.classList.remove("is-pressed"), 220); };

    return {
      get zone() { return st.zone; },
      get cta() { return st.cta; },
      togglePause() { st.userPaused = !st.userPaused; st.want = null; pause(); kit.refreshHud(); },
      refresh: schedule,
      key(e) {
        const k = e.key, z = st.zone;
        if (!/^(Arrow(Up|Down|Left|Right)|Enter)$/.test(k)) return false;
        hold();
        if (z === "nav") {
          const n = navEls().length;
          if (k === "ArrowLeft") st.nav = Math.max(0, st.nav - 1);
          else if (k === "ArrowRight") st.nav = Math.min(n - 1, st.nav + 1);
          else if (k === "ArrowDown") st.zone = "hero";
          else if (k === "Enter") press(navEls()[st.nav]);
        } else if (z === "rail") {
          const n = tiles().length;
          if (k === "ArrowLeft") st.tile = Math.max(0, st.tile - 1);
          else if (k === "ArrowRight") st.tile = Math.min(n - 1, st.tile + 1);
          else if (k === "ArrowUp") st.zone = "hero";
          else if (k === "Enter") press(tiles()[st.tile]);
        } else {
          if (k === "ArrowUp") st.zone = "nav";
          else if (k === "ArrowDown") st.zone = "rail";
          else if (mode === "carousel") {
            if (k === "ArrowRight") page(1); else if (k === "ArrowLeft") page(-1); else return false;
          } else {
            const n = heroBtns().length || 1;
            if (k === "ArrowRight") { if (st.cta < n - 1) st.cta++; else page(1); }
            else if (k === "ArrowLeft") { if (st.cta > 0) st.cta--; else page(-1); }
            else if (k === "Enter") press(heroBtns()[st.cta]);
          }
        }
        apply(); return true;
      },
    };
  }

  /* ---------- Stage chrome, scaling, HUD ---------- */
  const kit = {
    data: window.HERO_DATA, ICONS, ui, metaBlock, mountPeek, peeks: [], livebar, Rotator, T0,
    art: (item, layer, opts) => window.HeroArt.render(item, layer, opts),
    stage: null, rot: null, flags: { safe: false, grid: false, ref: false, native: false },
    keyHandlers: [],
    get zone() { return this.focus ? this.focus.zone : "hero"; },
    onKey(fn) { this.keyHandlers.push(fn); },

    init(opts) {
      const { title, notes = "", extraKeys = [], nav = true, rail = true } = opts;
      const stage = (this.stage = document.getElementById("stage"));
      this.flags.nav = nav; this.flags.rail = rail;
      stage.classList.toggle("no-nav", !nav); stage.classList.toggle("no-rail", !rail);
      if (window.self !== window.top || /embed/.test(location.search)) document.body.classList.add("embedded");

      const D = window.HERO_DATA || [];
      const railItems = [...D, ...D].slice(0, 7);
      stage.insertAdjacentHTML("afterbegin", ui.nav() +
        `<div class="page-rail"><div class="row-head row-head--live rail-head">Live Lineup</div>
          <div class="rail-tiles">${railItems.map((it, i) => ui.tile(it, { prog: [45, 70, 30, 55, 20, 60, 35][i] })).join("")}</div></div>`);
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
            <kbd>← →</kbd><span>${opts.heroMode === "carousel" ? "Move through the hero row" : "Move across the hero buttons; past the last (or first) button pages the hero"}</span>
            <kbd>↑ ↓</kbd><span>Up: page nav · Down: Live Lineup row below the hero</span>
            <kbd>OK</kbd><span>Select (Enter)</span>
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

      this.focus = Focus(this, opts);
      addEventListener("keydown", (e) => {
        if (e.metaKey || e.ctrlKey || e.altKey) return;
        for (const h of this.keyHandlers) if (h(e) === true) { e.preventDefault(); return; }
        if (this.focus.key(e)) { e.preventDefault(); return; }
        const k = e.key;
        if (k === " ") { this.focus.togglePause(); }
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
