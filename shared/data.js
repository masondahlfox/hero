/* Multi-hero content. Only titles with a folder in assets/titles/ are listed; the carousel loops through them.
   Art is the real asset per title (assets/titles/<id>/): video.mp4 + video-poster.jpg, key-16x9.jpg, logo.png.
   Metadata text (meta, taglines, scores, social lines) is still MOCK for prototyping — swap for feed values.
   type: 'live' | 'show' | 'special'
   art:  { kind:'video', src, poster, still }   (looping muted background video; still = key art for thumbnails)
         { kind:'img', src }                    (key art)
   Offsets (startedMinAgo) are relative to page load so the demo always reads "live". */
(function () {
  const A = (id, f) => `assets/titles/${id}/${f}`;
  window.HERO_DATA = [
    {
      id: "eagles-cowboys",
      focusX: 0.5,
      accent: "#00a5b5",
      type: "live",
      typeLabel: "Live Sports",
      shortLabel: "Live Now",
      logo: A("eagles-cowboys", "logo.png"),
      logoAlt: "Eagles vs Cowboys",
      art: { kind: "video", src: A("eagles-cowboys", "video.mp4"), poster: A("eagles-cowboys", "video-poster.jpg"), still: A("eagles-cowboys", "key-16x9.jpg") },
      status: { badge: "Live" },
      score: {
        away: { abbr: "DAL", score: 13, color: "#869397" },
        home: { abbr: "PHI", score: 17, color: "#00a5b5" },
        clock: "3RD · 8:42"
      },
      live: { startedMinAgo: 98, durationMin: 210 },
      meta: ["FOX", "4K", "NFL"],
      tagline: "NFC East Rivalry",
      social: { live: true, text: "1.4M watching now on FOX One" },
      ctas: [{ label: "Watch Live", icon: "play" }, { icon: "plus", label: "My Stuff" }, { icon: "bell", label: "Notify Me" }],
      dwell: 12000
    },
    {
      id: "best-medicine",
      focusX: 0.6,
      accent: "#f2a46b",
      type: "show",
      typeLabel: "Comedy Series",
      shortLabel: "New Episode",
      logo: A("best-medicine", "logo.png"),
      logoAlt: "Best Medicine",
      art: { kind: "video", src: A("best-medicine", "video.mp4"), poster: A("best-medicine", "video-poster.jpg"), still: A("best-medicine", "key-16x9.jpg") },
      status: { badge: "New Episode", kind: "new" },
      meta: ["FOX", "TV-14", "Comedy"],
      tagline: "Season 2 Now Streaming",
      social: { text: "New episodes Tuesdays on FOX, next day on FOX One" },
      ctas: [{ label: "Watch Now", icon: "play" }, { icon: "plus", label: "My Stuff" }, { icon: "bell", label: "Notify Me" }],
      dwell: 8000
    },
    {
      id: "accused",
      focusX: 0.6,
      accent: "#c58b5a",
      type: "show",
      typeLabel: "Drama Series",
      shortLabel: "Featured",
      logo: A("accused", "logo.png"),
      logoAlt: "Accused",
      art: { kind: "video", src: A("accused", "video.mp4"), poster: A("accused", "video-poster.jpg"), still: A("accused", "key-16x9.jpg") },
      sponsor: { label: "Presented by", name: "American" },
      meta: ["FOX", "TV-14", "Drama"],
      tagline: "All-New Episodes",
      social: { icon: true, text: "Recommended by more than 96% of FOX One viewers in the past 30 days" },
      ctas: [{ label: "Watch Now", icon: "play" }, { icon: "plus", label: "My Stuff" }, { icon: "bell", label: "Notify Me" }],
      dwell: 8000
    },
    {
      id: "fc-juarez",
      focusX: 0.5,
      accent: "#7ed957",
      type: "show",
      typeLabel: "Liga MX",
      shortLabel: "Replay",
      logo: A("fc-juarez", "logo.png"),   /* typeset placeholder — no title art supplied */
      logoAlt: "FC Juárez",
      art: { kind: "video", src: A("fc-juarez", "video.mp4"), poster: A("fc-juarez", "video-poster.jpg") },
      meta: ["FOX", "4K", "Liga MX"],
      tagline: "Bravos de Juárez",
      social: { text: "Every Liga MX match, live and on demand on FOX One" },
      ctas: [{ label: "Watch Now", icon: "play" }, { icon: "plus", label: "My Stuff" }, { icon: "bell", label: "Notify Me" }],
      dwell: 8000
    },
    {
      id: "fox-soul",
      focusX: 0.5,
      accent: "#c13cff",
      type: "show",
      typeLabel: "Streaming Channel",
      shortLabel: "Free 24/7",
      logo: A("fox-soul", "logo.png"),
      logoAlt: "FOX Soul",
      art: { kind: "img", src: A("fox-soul", "key-16x9.jpg") },
      meta: ["FOX Soul", "HD", "Culture"],
      tagline: "Black Culture, Always On",
      social: { text: "Streaming free around the clock on FOX One" },
      ctas: [{ label: "Watch Now", icon: "play" }, { icon: "plus", label: "My Stuff" }, { icon: "bell", label: "Notify Me" }],
      dwell: 8000
    }
  ];
})();
