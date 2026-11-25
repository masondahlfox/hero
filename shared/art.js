/* Generated placeholder key art (SVG), drawn at card size 1680×800.
   Each style returns separate bg / mid / fg layers so parallax options can split depth.
   Focal interest is kept right of center — the left 45% sits under the metadata scrim. */
(function () {
  const W = 1680, H = 800;
  let uid = 0;

  function rng(seed) {
    return function () {
      seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  const f = (n) => Math.round(n * 10) / 10;

  function svg(defs, body, par = "xMidYMid slice") {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="${par}"><defs>${defs}</defs>${body}</svg>`;
  }

  /* ---------------- Stadium (live football, night) ---------------- */
  function stadium(p, u, r) {
    const defs = `
      <linearGradient id="${u}sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${p.sky1}"/><stop offset=".55" stop-color="${p.sky2}"/><stop offset="1" stop-color="#000"/></linearGradient>
      <radialGradient id="${u}glow" cx=".68" cy=".46" r=".5"><stop offset="0" stop-color="${p.glow}" stop-opacity=".45"/><stop offset="1" stop-color="${p.glow}" stop-opacity="0"/></radialGradient>
      <linearGradient id="${u}beam" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".5"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
      <linearGradient id="${u}turf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${p.turf}" stop-opacity=".75"/><stop offset="1" stop-color="#1f8a45"/></linearGradient>
      <linearGradient id="${u}ribbon" x1="0" x2="1"><stop offset="0" stop-color="${p.a}"/><stop offset=".5" stop-color="#5fb6c4"/><stop offset="1" stop-color="${p.b}"/></linearGradient>
      <linearGradient id="${u}haze" x1="0" y1="0" x2="0" y2="1"><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".55"/></linearGradient>
      <filter id="${u}b6" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="6"/></filter>
      <filter id="${u}b24" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="24"/></filter>`;
    const towers = [[360, 120, .45], [860, 96, .9], [1220, 70, 1], [1560, 110, .9]];
    let beams = "", lamps = "";
    towers.forEach(([x, y, o]) => {
      for (let k = -1; k <= 1; k++) {
        const spread = 260 + r() * 120;
        beams += `<polygon points="${x - 18},${y + 8} ${x + 18},${y + 8} ${f(x + k * 180 + spread / 2)},${560} ${f(x + k * 180 - spread / 2)},${560}" fill="url(#${u}beam)" opacity="${f(.22 * o)}" filter="url(#${u}b6)"/>`;
      }
      for (let gx = 0; gx < 6; gx++) for (let gy = 0; gy < 3; gy++) lamps += `<circle cx="${x - 40 + gx * 16}" cy="${y - 12 + gy * 12}" r="4.2" fill="#fff" opacity="${f(o * (.75 + r() * .25))}"/>`;
      lamps += `<rect x="${x - 50}" y="${y - 22}" width="100" height="44" rx="3" fill="none" stroke="#9fb4c0" stroke-opacity="${f(.35 * o)}" stroke-width="2"/>`;
      lamps += `<circle cx="${x}" cy="${y}" r="70" fill="#dff3ff" opacity="${f(.55 * o)}" filter="url(#${u}b24)"/>`;
    });
    const bg = `<rect width="${W}" height="${H}" fill="url(#${u}sky)"/><rect width="${W}" height="${H}" fill="url(#${u}glow)"/>${beams}${lamps}`;

    let crowd = "";
    const cols = [p.a, p.b, "#ffffff", "#9fd8e0"];
    for (let i = 0; i < 1100; i++) {
      const x = r() * W, y = 330 + r() * 210 + (x < 840 ? (840 - x) * .04 : 0);
      crowd += `<circle cx="${f(x)}" cy="${f(y)}" r="${f(.8 + r() * 1.6)}" fill="${cols[(r() * 4) | 0]}" opacity="${f(.06 + r() * .32)}"/>`;
    }
    let lines = "";
    for (let k = 0; k <= 14; k++) {
      const xt = -140 + k * (1960 / 14), xb = 840 + (xt - 840) * 2.1;
      lines += `<line x1="${f(xt)}" y1="560" x2="${f(xb)}" y2="${H}" stroke="#fff" stroke-opacity="${k % 2 ? .18 : .38}" stroke-width="${k % 2 ? 2 : 3}"/>`;
    }
    const mid = `
      <path d="M0,330 C420,276 1180,250 ${W},300 L${W},562 L0,562 Z" fill="#03080c"/>
      ${crowd}
      <rect x="0" y="476" width="${W}" height="14" fill="url(#${u}ribbon)" opacity=".45"/>
      <path d="M0,330 C420,276 1180,250 ${W},300" stroke="${p.glow}" stroke-opacity=".5" stroke-width="3" fill="none"/>
      <polygon points="-140,560 1820,560 ${W + 600},${H} -600,${H}" fill="url(#${u}turf)"/>
      ${lines}`;

    let dust = "";
    for (let i = 0; i < 30; i++) dust += `<circle cx="${f(500 + r() * 1180)}" cy="${f(60 + r() * 500)}" r="${f(.8 + r() * 2.4)}" fill="#fff" opacity="${f(.15 + r() * .5)}"/>`;
    const fg = `${dust}<rect width="${W}" height="${H}" fill="url(#${u}haze)"/>`;
    return { defs, bg, mid, fg };
  }

  /* ---------------- Coast (comedy series, golden hour harbor) ---------------- */
  function coast(p, u, r) {
    const defs = `
      <linearGradient id="${u}sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${p.sky1}"/><stop offset=".62" stop-color="${p.sky2}"/><stop offset="1" stop-color="#ffd9a0"/></linearGradient>
      <radialGradient id="${u}sun" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="${p.sun}" stop-opacity=".9"/><stop offset="1" stop-color="${p.sun}" stop-opacity="0"/></radialGradient>
      <linearGradient id="${u}sea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c9805a"/><stop offset=".25" stop-color="${p.sea}"/><stop offset="1" stop-color="#08131d"/></linearGradient>
      <filter id="${u}b20" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="20"/></filter>
      <filter id="${u}b3"><feGaussianBlur stdDeviation="2.5"/></filter>`;
    let clouds = "";
    for (let i = 0; i < 9; i++) clouds += `<ellipse cx="${f(500 + r() * 1200)}" cy="${f(90 + r() * 260)}" rx="${f(160 + r() * 260)}" ry="${f(14 + r() * 24)}" fill="#ffd3a6" opacity="${f(.18 + r() * .3)}" filter="url(#${u}b20)"/>`;
    const bg = `<rect width="${W}" height="${H}" fill="url(#${u}sky)"/>${clouds}
      <circle cx="1180" cy="430" r="360" fill="url(#${u}sun)" opacity=".7"/>
      <circle cx="1180" cy="430" r="78" fill="#fff4d8"/>`;

    let refl = "";
    for (let i = 0; i < 26; i++) {
      const y = 476 + i * 12 + r() * 6, w = 40 + r() * 160 + i * 5;
      refl += `<rect x="${f(1180 - w / 2 + (r() - .5) * 60)}" y="${f(y)}" width="${f(w)}" height="3" rx="1.5" fill="#ffe8bd" opacity="${f(.65 - i * .02)}"/>`;
    }
    let houses = "";
    const pastel = ["#3b3340", "#4a3a36", "#2f3b45", "#45403a", "#383046"];
    for (let i = 0; i < 16; i++) {
      const x = 1230 + i * 30 + r() * 10, base = 470 - (i * 6) + r() * 10, w = 26 + r() * 14, h = 22 + r() * 18;
      houses += `<rect x="${f(x)}" y="${f(base - h)}" width="${f(w)}" height="${f(h)}" fill="${pastel[i % 5]}"/>`;
      houses += `<polygon points="${f(x - 3)},${f(base - h)} ${f(x + w / 2)},${f(base - h - 14)} ${f(x + w + 3)},${f(base - h)}" fill="#1b1a22"/>`;
      if (r() > .35) houses += `<rect x="${f(x + w / 2 - 3)}" y="${f(base - h + 7)}" width="6" height="7" fill="#ffd27a" opacity=".9"/>`;
    }
    const mid = `
      <path d="M760,476 C900,440 1060,450 1180,462 L1180,476 Z" fill="#3a3346" opacity=".6"/>
      <path d="M1200,476 C1300,420 1420,360 1540,330 C1600,318 1650,320 ${W},326 L${W},${H} L1200,${H} Z" fill="${p.land}"/>
      <rect y="476" width="${W}" height="${H - 476}" fill="url(#${u}sea)"/>
      ${refl}
      <path d="M1220,520 C1320,470 1440,400 1540,372 C1600,356 1650,358 ${W},362 L${W},${H} L1150,${H} Z" fill="${p.land}"/>
      ${houses}
      <polygon points="1552,372 1574,372 1570,262 1556,262" fill="#e9e2d6"/>
      <rect x="1550" y="246" width="26" height="18" fill="#2a2630"/>
      <circle cx="1563" cy="254" r="30" fill="#fff1c2" opacity=".6" filter="url(#${u}b20)"/>`;

    let boats = "", gulls = "";
    [[980, 600, 1], [1340, 640, .8], [820, 690, 1.3]].forEach(([x, y, s]) => {
      boats += `<g transform="translate(${x},${y}) scale(${s})"><polygon points="-60,0 60,0 46,18 -48,18" fill="#0b1118"/><line x1="0" y1="0" x2="0" y2="-80" stroke="#0b1118" stroke-width="3"/><polygon points="2,-76 2,-8 44,-8" fill="#0b1118" opacity=".85"/></g>`;
    });
    for (let i = 0; i < 6; i++) {
      const x = 900 + r() * 600, y = 160 + r() * 180, s = 6 + r() * 8;
      gulls += `<path d="M${f(x - s)},${f(y)} q${f(s / 2)},${f(-s / 2)} ${f(s)},0 q${f(s / 2)},${f(-s / 2)} ${f(s)},0" stroke="#2a1f24" stroke-width="2" fill="none" opacity=".75"/>`;
    }
    const fg = `${boats}${gulls}
      <rect x="0" y="${H - 70}" width="${W}" height="70" fill="#05090d" opacity=".55" filter="url(#${u}b3)"/>`;
    return { defs, bg, mid, fg };
  }

  /* ---------------- Winter (movie premiere, aurora night) ---------------- */
  function winter(p, u, r) {
    const defs = `
      <linearGradient id="${u}sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${p.sky1}"/><stop offset="1" stop-color="${p.sky2}"/></linearGradient>
      <linearGradient id="${u}aur" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${p.aurora}" stop-opacity="0"/><stop offset=".5" stop-color="${p.aurora}" stop-opacity=".75"/><stop offset="1" stop-color="#7c5cff" stop-opacity="0"/></linearGradient>
      <filter id="${u}b30" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="30"/></filter>
      <filter id="${u}b4" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="4"/></filter>`;
    let stars = "";
    for (let i = 0; i < 220; i++) stars += `<circle cx="${f(r() * W)}" cy="${f(r() * 460)}" r="${f(.5 + r() * 1.6)}" fill="#fff" opacity="${f(.2 + r() * .8)}"/>`;
    const bg = `<rect width="${W}" height="${H}" fill="url(#${u}sky)"/>${stars}
      <path d="M520,260 C760,120 980,320 1220,170 C1400,60 1560,200 1760,120 L1760,360 C1540,420 1380,300 1200,380 C980,470 760,330 520,420 Z" fill="url(#${u}aur)" filter="url(#${u}b30)" opacity=".9"/>
      <circle cx="1450" cy="150" r="44" fill="#f3f6ff" opacity=".9"/><circle cx="1450" cy="150" r="120" fill="#cfe0ff" opacity=".25" filter="url(#${u}b30)"/>`;

    function ridge(y0, amp, step) {
      let d = `M0,${y0}`, y = y0;
      for (let x = 0; x <= W + step; x += step) { y = y0 - r() * amp; d += ` L${x},${f(y)}`; }
      return d + ` L${W},${H} L0,${H} Z`;
    }
    const mid = `<path d="${ridge(470, 170, 120)}" fill="${p.m1}" opacity=".95"/>
      <path d="${ridge(540, 140, 90)}" fill="${p.m2}"/>
      <path d="${ridge(620, 90, 70)}" fill="${p.m3}"/>`;

    let trees = "";
    for (let i = 0; i < 26; i++) {
      const x = 700 + i * 40 + r() * 20, h = 90 + r() * 140, b = H - r() * 30;
      trees += `<polygon points="${f(x)},${f(b - h)} ${f(x + h * .22)},${f(b)} ${f(x - h * .22)},${f(b)}" fill="#02060f"/>`;
    }
    let snow = "";
    for (let i = 0; i < 140; i++) {
      const big = r() > .9;
      snow += `<circle cx="${f(r() * W)}" cy="${f(r() * H)}" r="${f(big ? 5 + r() * 6 : 1 + r() * 2.5)}" fill="#fff" opacity="${f(big ? .25 : .4 + r() * .5)}" ${big ? `filter="url(#${u}b4)"` : ""}/>`;
    }
    const fg = `${trees}${snow}`;
    return { defs, bg, mid, fg };
  }

  const STYLES = { stadium, coast, winter };

  /** Render key art for an item. layer: 'all' | 'bg' | 'mid' | 'fg' */
  function render(item, layer = "all", opts = {}) {
    const a = item.art;
    if (a.kind === "video") {
      if (layer !== "all" && layer !== "bg") return "";
      const pos = `style="object-position:${Math.round((item.focusX ?? .5) * 100)}% 50%"`;
      if (opts.still) return `<img src="${a.poster}" alt="" draggable="false" ${pos}>`;
      return `<video src="${a.src}" poster="${a.poster}" ${opts.noAutoplay ? "" : "autoplay"} muted loop playsinline preload="auto" ${pos}></video>`;
    }
    if (a.kind === "img") {
      if (layer === "all" || layer === "bg") return `<img src="${a.src}" alt="" draggable="false" style="object-position:${Math.round((item.focusX ?? .5) * 100)}% 50%">`;
      return "";
    }
    const u = "a" + (uid++) + "_";
    const seed = [...item.id].reduce((s, c) => s + c.charCodeAt(0) * 31, 7);
    const parts = STYLES[a.style](a.palette, u, rng(seed));
    const body = layer === "all" ? parts.bg + parts.mid + parts.fg : parts[layer];
    const fx = item.focusX ?? .5, par = opts.par || ((fx < .34 ? "xMin" : fx > .66 ? "xMax" : "xMid") + "YMid slice");
    return svg(parts.defs, body, par);
  }

  window.HeroArt = { render, W, H };
})();
