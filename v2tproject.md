# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

v2t (video-to-text) is a classroom lecture processing pipeline: upload video/audio → FunASR speech recognition transcribes it → text is cleaned and formatted → LLM (DeepSeek-compatible API) generates a structured exam key-points summary in Markdown.

The app has a Python backend (`tools/api_server.py`) that wraps CLI tools behind a REST API with SSE streaming, and a Next.js 16 frontend (`frontend/`) that provides the upload/configuration/results UI.

## Running the App

Three terminals are needed:

```powershell
# Terminal 1 — Backend (requires conda env "DeepLearning")
conda activate DeepLearning
$env:DEEPSEEK_API_KEY = "sk-your-key"
python tools/api_server.py

# Terminal 2 — Frontend
cd frontend && npm run dev

# Terminal 3 — Tunnel (for public access)
cloudflared tunnel --protocol http2 run v2t
```

Backend listens on `127.0.0.1:8000`. Frontend on `localhost:3000`. The frontend auto-detects `localhost`/`127.0.0.1` and connects directly to the backend; for public deployments set `NEXT_PUBLIC_API_BASE_URL` to the backend origin.

## Commands

```bash
# Frontend (from frontend/)
npm run dev        # Next.js dev server
npm run build      # Production build
npm run lint       # ESLint

# Backend (from project root, in conda env "DeepLearning")
python tools/api_server.py                    # Start API server
python tools/pipeline.py videos/lecture.mp4   # Direct CLI pipeline run
python tools/pipeline.py outputs/lecture.json --skip-transcribe  # Resume from existing transcript
python tools/pipeline.py videos/lecture.mp4 --stream  # Streaming LLM output

# Tests (from project root, in conda env "DeepLearning")
python -m pytest tests/ -v
python -m pytest tests/test_pipeline.py -v    # Single test file
python -m unittest tests.test_pipeline.PipelinePromptTests.test_build_summary_prompt_uses_default_template_when_custom_prompt_missing  # Single test case
```

## Architecture

### Backend Pipeline (3-stage)

1. **Transcribe** (`tools/transcribe_video.py`) — FunASR Paraformer model transcribes audio/video. Supports VAD, punctuation restoration, hotwords, chunked processing for long audio. Local models in `models/`.
2. **Process** (`tools/process_transcript.py`) — Cleans raw transcript: removes filler words, merges segments, splits sentences, normalizes whitespace. Input: FunASR JSON. Output: cleaned `.txt`.
3. **Summarize** (`tools/pipeline.py`) — Sends cleaned transcript to a DeepSeek-compatible API with a structured system prompt that instructs the model to produce exam key-points in 6 sections. Supports custom prompt templates with `{{course}}` and `{{transcript}}` placeholders.

`tools/pipeline.py` also serves as the importable library for `api_server.py` — it exports `USER_PROMPT_TEMPLATE`, `build_summary_prompt()`, `call_deepseek_api_streaming()`, etc.

### API Server (`tools/api_server.py`)

A minimal `http.server`-based API server (no Flask/FastAPI). Key details:
- Spawns `pipeline.py` as a subprocess and parses its stdout for step markers (`[step] stepname:start`/`:end`) and token lines (JSON `{"token": "..."}`) for SSE forwarding.
- Frontend config is received as a nested struct with `transcriptInput` and `summaryInput` objects; `build_frontend_config()` flattens them into the flat dict the pipeline expects.
- Jobs live in memory, persisted to `outputs/jobs/{jobId}/metadata.json` and restored on startup.
- SSE endpoint at `GET /api/jobs/{jobId}/stream` emits `progress`, `token`, `done`, and `error` events.
- Uploaded files go to `videos/uploads/`.

### Frontend (`frontend/`)

- **Next.js 16 App Router** with `"use client"` on the single page (`src/app/page.tsx`, ~76KB).
- **shadcn/ui v4** components in `src/components/ui/` (32 components, using `@base-ui/react` primitives, NOT `@radix-ui`). The form system is `field.tsx` (native layout components), not the v3 `form.tsx` react-hook-form integration — bridge manually if needed.
- **API client** (`src/lib/api.ts`) defines all TypeScript types (`PipelineConfig`, `TranscriptInputConfig`, `SummaryInputConfig`, `Job`, etc.) and API functions. `resolveApiBaseUrl()` handles local dev vs. public deployment URL resolution.
- **Styling**: Tailwind CSS v4 with `base-nova` theme, Neutral base color, CSS variables for theming. Dark mode supported via `next-themes`.
- **Key dependencies**: `framer-motion` for animations, `sonner` for toasts, `lucide-react` for icons, `recharts` for charts.
- The entire app is a single page with inline state management (no state library). The page contains: file upload, configuration panels (Transcript Input / Summary Input), pipeline progress visualization with step-by-step tracking, a Markdown renderer, and job history.
- **Hydration note**: SSR-dependent components must not use `matchMedia`, `localStorage`, or `useReducedMotion()` during first render — defer these until after mount.

### Important: Next.js Version

The frontend's `AGENTS.md` warns: this Next.js 16 has breaking changes from training data. Read relevant guides in `node_modules/next/dist/docs/` before writing code.

## Configuration Flow

The frontend sends `POST /api/jobs` with a JSON body containing:
- `fileId` (from prior `POST /api/upload`)
- `transcriptInput` — `{ hotword, device, asrBatchSeconds, transcriptChunkSeconds }`
- `summaryInput` — `{ courseName, model, maxTokens, temperature, baseUrl, summaryPromptTemplate }`
- Plus top-level flags: `apiKey`, `asrPreset`, `enableVad`, `enablePunc`, `skipTranscribe`, `skipProcess`, `stream`, etc.

The backend's `build_frontend_config()` (line ~125 of `api_server.py`) flattens these into the CLI args for `pipeline.py`.

## Custom Summary Prompt Template

- Backend exports `USER_PROMPT_TEMPLATE` from `pipeline.py` and serves it via `GET /api/summary/default-prompt`.
- Templates use `{{course}}` and `{{transcript}}` placeholders.
- The frontend has a hardcoded fallback (`DEFAULT_SUMMARY_TEMPLATE` in `api.ts`) matching the backend default.
- Empty/whitespace custom prompts are treated as "use default" — the backend's `build_summary_prompt()` checks `custom_prompt.strip() or USER_PROMPT_TEMPLATE`.