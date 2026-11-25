/* Multi-hero content. Metadata below is MOCK for prototyping — swap for feed values.
   type: 'live' | 'show' | 'special'
   art:  { kind:'svg', style:'stadium'|'coast'|'winter' }  (generated placeholder key art)
         { kind:'video', src, poster }                     (looping muted background video)
         { kind:'img', src:'...' }                          (real key art)
   Offsets (startedMinAgo / startsInMin) are relative to page load so the demo always reads "live". */
window.HERO_DATA = [
  {
    id: "eagles-cowboys",
    focusX: 0.5,
    accent: "#00a5b5",
    type: "live",
    typeLabel: "Live Sports",
    shortLabel: "Live Now",
    logo: "assets/logos/eagles-vs-cowboys.png",
    logoAlt: "Eagles vs Cowboys",
    art: { kind: "video", src: "assets/video/eagles-cowboys-live.mp4", poster: "assets/video/eagles-cowboys-poster.jpg" },
    artFallback: { kind: "svg", style: "stadium", palette: { sky1: "#02131a", sky2: "#06303a", glow: "#bfe8ff", turf: "#0d5a2e", a: "#004c54", b: "#0b2a5b" } },
    status: { badge: "Live" },
    score: {
      away: { abbr: "DAL", score: 13, color: "#869397" },
      home: { abbr: "PHI", score: 17, color: "#00a5b5" },
      clock: "3RD · 8:42"
    },
    live: { startedMinAgo: 98, durationMin: 210 },
    meta: ["FOX", "NFL", "Football", "Live"],
    tagline: "NFC East Rivalry",
    social: { live: true, text: "1.4M watching now on FOX One" },
    ctas: [{ label: "Watch Live", icon: "play" }, { icon: "restart", label: "Start Over" }],
    dwell: 12000
  },
  {
    id: "best-medicine",
    focusX: 0.8,
    accent: "#f2a46b",
    type: "show",
    typeLabel: "Comedy Series",
    shortLabel: "New Episode",
    logo: "assets/logos/best-medicine.png",
    logoAlt: "Best Medicine",
    art: { kind: "svg", style: "coast", palette: { sky1: "#203a5c", sky2: "#f2a46b", sun: "#ffe2a8", sea: "#1d3d5a", land: "#0e1a22" } },
    status: { badge: "New Episode", kind: "new" },
    meta: ["FOX", "Comedy", "Series", "TV-14"],
    tagline: "The Science Behind Laughter",
    social: { text: "S1 · E9 now streaming · New episodes Tuesdays" },
    ctas: [{ label: "Watch Now", icon: "play" }, { icon: "plus", label: "My Stuff" }],
    dwell: 8000
  },
  {
    id: "accused",
    focusX: 0.63,
    accent: "#c58b5a",
    type: "show",
    typeLabel: "Drama Series",
    shortLabel: "Featured",
    logo: "assets/logos/accused.png",
    logoAlt: "Accused",
    art: { kind: "img", src: "assets/art/accused-keyart.jpg" },
    sponsor: { label: "Presented by", name: "American" },
    meta: ["FOX", "Drama", "Series", "TV-14"],
    tagline: "All-New Episodes",
    social: { icon: true, text: "Recommended by more than 96% of FOX One viewers in the past 30 days" },
    ctas: [{ label: "Watch Now", icon: "play" }, { icon: "plus", label: "My Stuff" }],
    dwell: 8000
  },
  {
    id: "long-winter",
    focusX: 0.85,
    accent: "#59ffc6",
    type: "special",
    typeLabel: "Movie Premiere",
    shortLabel: "Premiere",
    logoText: "The Long Winter",   /* typeset placeholder — no title art supplied */
    art: { kind: "svg", style: "winter", palette: { sky1: "#040a1c", sky2: "#14315c", aurora: "#59ffc6", m1: "#1d3a66", m2: "#11264a", m3: "#081428" } },
    status: { badge: "Premiere", kind: "premiere" },
    meta: ["FOX", "Movie", "Family", "TV-PG"],
    tagline: "World Premiere Event",
    countdown: { startsInMin: 4 * 1440 + 6 * 60 + 18, label: "Premieres in" },
    ctas: [{ label: "Set Reminder", icon: "bell" }, { icon: "plus", label: "My Stuff" }],
    dwell: 8000
  }
];
