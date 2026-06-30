# Aurora Media Assets

Drop optimized background media here when replacing the live CSS aurora with video.

Local generator:

- Open `public/tools/aurora-studio.html` in a browser or visit `/tools/aurora-studio.html` while the Vite dev server is running.
- Export `aurora-loop.webm` and `aurora-poster.png` directly from the browser.
- If Safari fallback is needed, transcode the exported WebM to `aurora-loop.mp4` later in an external tool.

Expected files:

- `aurora-dark-loop.webm` - dark theme background loop.
- `aurora-light-loop.webm` - light theme background loop.
- `aurora-dark-poster.png` - dark theme poster fallback.
- `aurora-light-poster.png` - light theme poster fallback.
- Optional Safari fallback sources can be added later as matching mp4 files.

Current repo includes:

- `aurora-poster.svg` - lightweight placeholder poster matching the current palette.

Recommended budgets:

- WebM: 1-2.5 MB.
- MP4: 2-4 MB.
- Poster: 150-300 KB.

After adding files, enable the media sources in `src/App.tsx`.
