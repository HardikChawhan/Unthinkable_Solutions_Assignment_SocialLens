# SocialLens — Architecture Document

## Table of Contents

1. [System Overview](#system-overview)
2. [Frontend Architecture](#frontend-architecture)
3. [Backend Architecture](#backend-architecture)
4. [Data Flow](#data-flow)
5. [OCR Pipeline](#ocr-pipeline)
6. [PDF Pipeline](#pdf-pipeline)
7. [Analysis Engine](#analysis-engine)
8. [API Design](#api-design)
9. [Security Architecture](#security-architecture)
10. [Deployment Architecture](#deployment-architecture)
11. [Design Decisions](#design-decisions)
12. [Performance Strategy](#performance-strategy)

---

## System Overview

SocialLens is a two-tier web application:

```
┌─────────────────────────────────────────────────────────┐
│                     CLIENT TIER                          │
│  React 19 SPA · Vite · Tailwind · Framer Motion         │
│  Hosted: GitHub Pages (static CDN)                      │
└─────────────────────┬───────────────────────────────────┘
                      │ HTTPS REST API
┌─────────────────────▼───────────────────────────────────┐
│                    SERVER TIER                           │
│  Node.js · Express · Tesseract.js · pdf-parse           │
│  Hosted: Render (containerized)                         │
└─────────────────────────────────────────────────────────┘
```

The frontend is a completely static SPA deployed to GitHub Pages. It has **zero server-side rendering** — all routing is handled client-side. The backend is a stateless REST API deployed to Render's free tier.

**No database** is used. Files are processed in-memory and immediately deleted. Analysis results are returned to the client and optionally persisted in `localStorage`.

---

## Frontend Architecture

### Component Hierarchy

```
App
├── ThemeProvider (context)
├── AnalysisProvider (context)
├── Toaster
└── Router (BrowserRouter with basename)
    ├── / → LandingPage
    │   ├── Navbar
    │   ├── HeroSection
    │   ├── FeatureCards
    │   ├── HowItWorks
    │   └── Footer
    ├── /analyzer → AnalyzerPage
    │   ├── Navbar
    │   ├── DropZone (idle)
    │   ├── UploadProgress (uploading/extracting/analyzing)
    │   ├── AnalysisReport (complete)
    │   │   ├── ScoreRing
    │   │   ├── MetricCard × 4
    │   │   ├── RadarChart (recharts)
    │   │   ├── SuggestionCard × N
    │   │   └── ImprovedVersion
    │   └── Footer
    ├── /about → AboutPage
    └── * → NotFoundPage
```

### State Management

State is managed with **React Context + useReducer** (no Redux/Zustand needed at this scale):

| Context | Scope | Data |
|---|---|---|
| `ThemeContext` | Global | `theme`, `toggleTheme()` |
| `AnalysisContext` | Global | `uploadHistory`, `currentFile`, `extractedText`, `analysis`, history CRUD |

Local component state (useState) handles UI-only state: upload progress, loading flags, form values.

### Custom Hooks

| Hook | Purpose |
|---|---|
| `useFileUpload` | Wraps Axios upload with progress tracking |
| `useAnalysis` | Manages analysis request lifecycle |
| `useLocalStorage` | Type-safe localStorage with JSON serialization |
| `useKeyboardShortcuts` | Global keyboard shortcut registry |

### Routing Strategy

React Router v6 with `BrowserRouter` and `basename='/Unthinkable_Solution_Assignment'` for GitHub Pages compatibility. The Vite build sets `base: '/Unthinkable_Solution_Assignment/'` to ensure all asset paths are correctly prefixed.

**GitHub Pages limitation:** SPA routing requires a redirect strategy. A `404.html` that mirrors `index.html` is included in the build to handle direct URL access.

### Animation Architecture

All animations use **Framer Motion**. Animation variants are centralized in `src/animations/variants.js` and imported where needed — preventing animation logic duplication across components.

Key animation patterns:
- **Page transitions:** `AnimatePresence` + `motion.div` with `pageTransition` variant
- **Stagger children:** `staggerContainer` variant on parent, `fadeUp` on children
- **Score rings:** SVG `stroke-dashoffset` animated via `useAnimate`
- **Card hover:** `whileHover` with `cardHover.hover` variant
- **Loading states:** CSS keyframe animations for skeleton shimmer (avoids JS overhead)

---

## Backend Architecture

### Layer Structure

```
server.js (entry)
    │
    ├── middleware/security.js     (Helmet, CORS, rate-limit, body parser)
    │
    ├── routes/index.js
    │       ├── GET  /health       → healthController
    │       ├── POST /upload       → upload middleware → uploadController
    │       └── POST /analyze      → analyzeController
    │
    ├── controllers/               (HTTP layer: req/res/next only)
    │       ├── healthController
    │       ├── uploadController   → extractionService
    │       └── analyzeController  → analysisService
    │
    ├── services/                  (Business logic, no HTTP knowledge)
    │       ├── extractionService  (router: pdf vs image)
    │       ├── pdfService         (pdf-parse)
    │       ├── ocrService         (tesseract.js)
    │       └── analysisService    (rule-based + optional OpenAI)
    │
    ├── middleware/errorHandler.js (global error boundary)
    │
    └── utils/
            ├── fileUtils.js       (sanitize, cleanup, format)
            └── logger.js          (Morgan + structured log)
```

### Controller Pattern

Controllers are kept thin — they only handle HTTP concerns:

```js
// uploadController.js — representative pattern
async function handleUpload(req, res, next) {
  try {
    if (!req.file) throw new ApiError(400, 'No file provided')
    const result = await extractionService.extract(req.file.path, req.file.mimetype)
    res.json({ success: true, data: result })
  } catch (err) {
    next(err)  // delegate to global error handler
  }
}
```

All business logic lives in services. This means controllers are testable in isolation by mocking services.

---

## Data Flow

### Upload & Extraction Flow

```
Client                    Server
  │                          │
  ├──POST /upload─────────►  │
  │  (multipart/form-data)   │
  │                          ├── Multer: validate MIME, size, sanitize filename
  │                          ├── Save to uploads/ (temp)
  │                          ├── extractionService.extract(path, mimeType)
  │                          │     ├── if PDF → pdfService.extractFromPdf()
  │                          │     └── if image → ocrService.extractFromImage()
  │                          ├── cleanupFile(path)  ← always runs
  │  ◄──────200 JSON────────┤
  │  { extractedText, meta }  │
```

### Analysis Flow

```
Client                    Server
  │                          │
  ├──POST /analyze──────────►│
  │  { text: "..." }         │
  │                          ├── Validate: text length ≥ 20 chars
  │                          ├── analysisService.analyze(text)
  │                          │     ├── if OPENAI_API_KEY → gptAnalyze()
  │                          │     └── else → ruleBasedAnalyze()
  │  ◄──────200 JSON────────┤
  │  { metrics, suggestions } │
```

---

## OCR Pipeline

```
Image File (JPG/PNG)
        │
        ▼
Multer Disk Storage
(sanitized temp path)
        │
        ▼
Tesseract.js Worker
 ┌──────────────────┐
 │ loadLanguage('eng')│
 │ initialize('eng') │
 │ recognize(path)   │
 │ terminate()       │
 └──────────────────┘
        │
        ▼
{ data: { text, confidence } }
        │
        ▼
Post-processing:
- Trim whitespace
- Normalize line breaks
- Remove null bytes
        │
        ▼
{ text: string, confidence: number }
        │
        ▼
cleanupFile(path)  ← file deleted
```

**Tesseract.js v5** runs fully in Node.js — no external binary needed, no system dependencies. The worker is created per-request and terminated after use to prevent memory leaks.

---

## PDF Pipeline

```
PDF File
    │
    ▼
Multer Disk Storage
(sanitized temp path)
    │
    ▼
pdf-parse(buffer)
 ┌────────────────────────┐
 │ Returns:               │
 │  - text (full content) │
 │  - numpages            │
 │  - info (metadata)     │
 │  - metadata            │
 └────────────────────────┘
    │
    ▼
Post-processing:
- Normalize whitespace
- Preserve paragraph structure
- Extract meaningful text blocks
    │
    ▼
{ text, pageCount, info }
    │
    ▼
cleanupFile(path)  ← file deleted
```

---

## Analysis Engine

### Rule-Based Analyzer (Default)

The rule-based analyzer computes 11 independent sub-scores and weights them into an overall engagement score.

#### Scoring Weights

| Metric | Weight | Description |
|---|---|---|
| Readability | 20% | Flesch-Kincaid approximation |
| Engagement | 25% | Composite of sub-scores |
| CTA Strength | 15% | Action verb detection |
| Hook Strength | 15% | First-sentence analysis |
| Hashtag Quality | 10% | Count + density |
| Clarity | 10% | Sentence length + structure |
| Grammar | 5% | Heuristic error detection |

#### Sentiment Analysis

Uses a curated lexicon of 100+ positive/negative words with weights (-2 to +2). Sentiment score is normalized to [-1, +1]:

```
sentimentScore = Σ(word_weight) / max_possible_score
```

Labels: Positive (≥ 0.2), Negative (≤ -0.2), Neutral (between)

#### Platform Detection

Inferred from text characteristics:
- **Twitter/X**: < 280 chars, high hashtag density
- **Instagram**: 150-2200 chars, 5-30 hashtags, emoji-heavy
- **LinkedIn**: > 500 chars, professional language, no emoji
- **Facebook**: 100-500 chars, moderate hashtags

#### Improved Version Generation

The engine applies detected weaknesses to generate a rewritten version:
1. Strengthen the hook (add question or bold stat)
2. Add missing CTA if ctaScore < 60
3. Optimize hashtag count to 5-8
4. Add 1-3 relevant emojis if emojiUsage.count < 1
5. Shorten sentences > 25 words

### OpenAI Path (Optional)

When `OPENAI_API_KEY` is set, the engine calls **GPT-4o-mini** with a structured system prompt that returns JSON conforming to the same schema. This path is wrapped in try/catch — any OpenAI failure falls back to the rule-based analyzer transparently.

---

## API Design

### Response Envelope

All endpoints return a consistent response envelope:

**Success:**
```json
{
  "success": true,
  "data": { ... }
}
```

**Error:**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Human-readable message",
    "details": [ ... ]
  }
}
```

### HTTP Status Codes

| Code | Usage |
|---|---|
| 200 | Successful operation |
| 400 | Validation error / bad request |
| 413 | File too large |
| 415 | Unsupported media type |
| 429 | Rate limit exceeded |
| 500 | Internal server error |
| 503 | Service temporarily unavailable |

---

## Security Architecture

### Layers of Defense

```
Internet
    │
    ├── Render Platform (DDoS protection, TLS termination)
    │
    ▼
Express Rate Limiter (100 req/15 min per IP)
    │
    ▼
Helmet.js Headers:
  - X-Content-Type-Options: nosniff
  - X-Frame-Options: DENY
  - Strict-Transport-Security
  - Content-Security-Policy
    │
    ▼
CORS Whitelist (GitHub Pages origin only)
    │
    ▼
Multer Middleware:
  - MIME type whitelist
  - File size limit (10 MB)
  - Sanitized filenames (UUID prefix)
    │
    ▼
Controller Validation (express-validator)
    │
    ▼
Service Layer (business logic)
    │
    ▼
File Cleanup (always runs in finally block)
```

### Threat Model

| Threat | Mitigation |
|---|---|
| Path traversal | Filename sanitization, UUID-prefixed names |
| File bomb (zip/PDF) | 10 MB size limit enforced by Multer |
| MIME spoofing | Server-side MIME validation (not client-reported) |
| XSS | Helmet CSP headers, no HTML rendering of user content |
| Injection | express-validator + no raw SQL (no database) |
| DDoS | Rate limiting + Render platform protection |
| Data exposure | No persistent storage, files deleted post-processing |
| Secret leakage | .env excluded from git, .env.example provided |

---

## Deployment Architecture

### GitHub Pages (Frontend)

```
npm run build
    │
    ▼
dist/                    ← Vite output
├── index.html           ← entry with correct base path
├── assets/
│   ├── index-[hash].js  ← vendor chunk
│   ├── motion-[hash].js ← framer-motion chunk
│   └── charts-[hash].js ← recharts chunk
└── 404.html             ← mirrors index.html for SPA routing

gh-pages -d dist → pushes to gh-pages branch
```

GitHub Pages serves `dist/` as a static site. The `base: '/Unthinkable_Solution_Assignment/'` in Vite config ensures all asset URLs and the React Router basename align with the repository URL.

### Render (Backend)

Render runs the backend as a containerized Node.js service:

```
GitHub Push → Render Auto-Deploy
    │
    ▼
Build: npm install
    │
    ▼
Start: node server.js
    │
    ▼
Render assigns HTTPS URL:
https://sociallens-api.onrender.com
```

Environment variables are set in the Render dashboard. The service auto-restarts on crash.

**Note:** Render free tier spins down after 15 minutes of inactivity. First request after spindown may take 30-60 seconds. This is expected behavior on the free tier.

---

## Design Decisions

### Why No Database?
The core use case is **stateless analysis** — upload, process, respond. Files are deleted after processing. Analysis history is stored in `localStorage` on the client, which is sufficient for a demo/MVP and avoids the complexity of user authentication, data persistence, and privacy compliance (GDPR etc).

### Why Rule-Based Analysis (Not Always OpenAI)?
1. **Cost:** OpenAI API calls cost money. A rule-based fallback makes the app usable without any API key.
2. **Reliability:** OpenAI outages don't break the core product.
3. **Privacy:** Text never leaves the server without explicit opt-in (setting API key).
4. **Speed:** Rule-based analysis returns in < 50ms vs ~2s for GPT.

### Why Tesseract.js (Not a Cloud OCR API)?
Same reasoning: no external API dependency, no per-request cost, works offline, better privacy.

### Why React Context (Not Redux/Zustand)?
The app has minimal global state (theme + upload history). Redux adds boilerplate without benefit at this scale. If the app grows to include user auth, complex server state, and caching, **React Query + Zustand** would be the appropriate next step.

### Why Framer Motion (Not CSS Animations)?
Framer Motion's `AnimatePresence` handles mount/unmount animations elegantly — something pure CSS cannot do. The `layoutId` API enables shared element transitions (e.g., nav active indicator). The performance cost is acceptable; GPU-composited animations are used where possible (`transform`, `opacity`).

### Why Vite (Not Create React App)?
CRA is deprecated. Vite offers near-instant HMR, faster builds, native ESM, and better plugin ecosystem.

---

## Performance Strategy

### Frontend
- **Initial JS budget:** < 150 KB gzipped (via manual chunks)
- **LCP target:** < 2.5s on 4G
- **Animations:** `transform` and `opacity` only (compositor-only, no layout thrash)
- **React optimization:** `memo`, `useCallback`, `useMemo` on expensive computations
- **Image optimization:** All images served as WebP where possible

### Backend
- **Tesseract worker:** Created per-request, terminated after. No persistent worker pool (memory safe on free tier)
- **File cleanup:** `finally` block guarantees temp files never accumulate
- **Compression:** Gzip via Express `compression` middleware
- **Response time target:** < 500ms for analyze, < 10s for OCR (image dependent)
