# Per-title assets

One folder per title. Folder names match the `id` values in `shared/data.js`.

- `eagles-cowboys/`
- `best-medicine/`
- `accused/`
- `long-winter/`

## Files in each folder

| File | Spec | Used by |
| --- | --- | --- |
| `logo.png` | Transparent title art, about 1200px wide | All |
| `key-16x9.jpg` | Key art, 3840×2160 | All |
| `poster-2x3.jpg` | Portrait poster, about 1000×1500 | C1, C5 |
| `layer-bg.jpg` | Parallax background layer, 3840×2160 | 05 |
| `layer-mid.png` | Parallax mid layer, transparent cut-out | 05 |
| `layer-fg.png` | Parallax foreground layer, transparent cut-out | 05 |
| `video.mp4` | Preview video, H.264 (not HEVC) | Video heroes |
| `video-poster.jpg` | First frame / poster for `video.mp4` | Video heroes |

Leave a file out if a title doesn't have it. The prototypes still read from
`assets/logos`, `assets/art` and `assets/video` until they are rewired.
