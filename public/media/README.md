# Aurora Media Assets

Drop optimized background media here when replacing the live CSS aurora with video.

Expected files:

- `aurora-loop.webm` - preferred desktop source, 8-12 seconds, seamless loop.
- `aurora-loop.mp4` - Safari fallback.
- `aurora-poster.jpg` - static fallback and reduced-motion poster.

Recommended budgets:

- WebM: 1-2.5 MB.
- MP4: 2-4 MB.
- Poster: 150-300 KB.

After adding files, enable the media sources in `src/App.tsx`.
