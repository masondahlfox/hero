# Fox One · Multi-Hero prototypes

Open `index.html` in Chrome or Safari. Everything runs locally from `file://` with no server or network.

## What's here
| File | What it is |
|---|---|
| `c1-magnify-conveyor.html` | Bell-curve "dock" conveyor on a shared baseline (from the Over-Stimulated reference). Uses the vertical asset. |
| `c2-title-portal.html` | Title art as a mask/window onto the feed, then a dive through the lettering into full-bleed. |
| `c3-now-line.html` | Log-scaled timeline anchored to NOW; art scrubs open from the item's moment in time. |
| `c4-bento-morph.html` | Per-content-type bento layouts (live / series / premiere) that re-flow into each other. |
| `c5-depth-queue.html` | Rotation as a 3D queue; the camera flies forward through it. |
| `01–07-*.html` | Archive: card-based transition variants inside the current home template card. |

## Controls (every prototype)
`← →` slide · `Space` pause · `S` safe zones · `G` grid · `O` overlay home template · `N` nav · `R` next rail · `F` fit ↔ 1:1 · `H` hide panel · `[ ]` prev/next prototype.
Extras: C1 `M` marquee mode, `T` light theme · C2 `Enter` dive · 06 `Enter` takeover · 07 `↑ ↓`.

## Swapping content
All titles live in `shared/data.js` (mock metadata). Art can be `img`, `video` (looping muted) or generated `svg` placeholders.
Title art for C2's masks is embedded in `shared/logo-data.js` as data URIs (Chrome blocks CSS mask images from `file://`).
To regenerate after replacing a logo PNG in `assets/logos/`, base64 it into that file under the same title id.

## Notes
- Stage is authored at 1920×1080 and scaled to fit the window. Press `F` for true 1:1 pixels.
- The Eagles clip is transcoded to H.264 / 60fps (`assets/video/`) because the source HEVC/120fps won't play reliably in Chrome.
- The Accused key art, nav strip and rail strip are cropped from `22LR.template.home`.
