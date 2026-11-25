# Fox One · Multi-Hero prototypes

Open `index.html` in Chrome or Safari. Everything runs locally from `file://` with no server or network.

## What's here
| File | What it is |
|---|---|
| `c1-magnify-conveyor.html` | Bell-curve "dock" conveyor on a shared baseline (from the Over-Stimulated reference). Uses the vertical asset. |
| `c5-depth-queue.html` | Rotation as a 3D queue; the camera flies forward through it. |
| `c6-fox-o-window.html` | Editorial poster: per-title color field, photo seen through the FOX-O silhouette (`Fox-o.svg`), title hung over the window edge. |
| `c7-game-dash.html` | Game-console dashboard: full-bleed backdrop, tile row with a glowing focus ring (← → move along it, OK plays), minimal metadata and ambient particles under the FOX One nav. |
| `c9-spine-shelf.html` | Shelf: the current title is an open panel, the rest stand beside it as angled spines; the next spine's edge fills as the timer. |
| `01–07-*.html` | Archive: card-based transition variants inside the current home template card. |

## Controls (every prototype)
`← →` slide · `Space` pause · `S` safe zones · `G` grid · `O` overlay home template · `N` nav · `R` next rail · `F` fit ↔ 1:1 · `H` hide panel · `[ ]` prev/next prototype.
Extras: C1 `M` marquee mode, `T` light theme · C2 `Enter` dive · C6 `B` full-bleed · C7 `Enter` launch, `P` particles · 06 `Enter` takeover.

Shared design system: `shared/base.css` holds the FOX One tokens and components (nav, badges, meta row, buttons, tiles, Up-next peek) measured from the home template; `shared/stage.js` renders them (`HeroKit.ui`) and runs the D-pad focus model: ← → across the hero buttons (past the end pages the hero), ↑ to the nav, ↓ to the Live Lineup row.

## Swapping content
The carousel shows only the titles that have a folder in `assets/titles/` and loops through them:
Eagles vs Cowboys, Best Medicine, Accused, FC Juárez and FOX Soul. Each folder holds the processed files the prototypes use:

| File | Use |
|---|---|
| `logo.png` | Title art (transparent PNG). FC Juárez has no supplied title art, so its logo is typeset. The FOX Soul logo was lifted out of its key art. |
| `key-16x9.jpg` | 1920×1080 key art, used for stills and thumbnails (FOX Soul's has the logo removed so it isn't shown twice). |
| `video.mp4` + `video-poster.jpg` | Looping muted background, H.264 1920 wide, 30fps, no audio. |

Raw source files (screen recordings, 4K PNGs, AVIF) stay in a git-ignored `_source/` folder next to them.
All metadata text in `shared/data.js` is still mock. Title art for C2's masks is embedded in `shared/logo-data.js` as data URIs
(Chrome blocks CSS mask images from `file://`); regenerate it from each `logo.png` after replacing a logo.

## Notes
- Stage is authored at 1920×1080 and scaled to fit the window. Press `F` for true 1:1 pixels.
- Videos are transcoded to H.264 because source HEVC clips won't play reliably in Chrome.
- The nav strip and rail strip are cropped from `22LR.template.home`.
