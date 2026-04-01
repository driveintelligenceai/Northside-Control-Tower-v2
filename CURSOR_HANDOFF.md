# Cursor Agent Handoff — Northside Control Tower

**Date**: 2026-04-01
**Status**: Demo-ready, DB connected, all 8 pages working
**Production URL**: https://northside-control-tower.vercel.app
**GitHub**: https://github.com/driveintelligenceai/Northside-Control-Tower

## Current State (Verified Working)

- All 8 dashboard pages render correctly with live data
- API healthcheck: `GET /api/healthz` → `{"status":"ok"}`
- Database: Neon PostgreSQL via Vercel Marketplace (75K+ rows seeded)
- Frontend: Vite + React + shadcn/ui + Recharts (static on Vercel CDN)
- API: Express 5 as Vercel Serverless Function at `/api/*`
- Auto-deploy: GitHub push to `main` → Vercel production

## Verification (run first)

```bash
curl -s https://northside-control-tower.vercel.app/api/healthz
# Expected: {"status":"ok"}

curl -s https://northside-control-tower.vercel.app/api/dashboard/summary | head -5
# Expected: JSON with totalLeads, newBookings, etc.
```

If either fails, check: `vercel env ls` for DATABASE_URL/POSTGRES_URL, then `vercel logs`.

## Local Development

```bash
cd ~/Developer/src/github.com/driveintelligenceai/Northside-Control-Tower
vercel env pull .env.local --yes    # Get DB creds
pnpm install                        # Install deps

# Run API server (needs DATABASE_URL from .env.local)
# Note: requires dotenv to load .env.local
pnpm exec dotenv -e .env.local -- pnpm --filter @workspace/api-server run dev

# Run frontend (separate terminal)
PORT=5173 BASE_PATH=/ pnpm --filter @workspace/control-tower run dev
```

## Architecture

```
pnpm monorepo (9 workspaces)
├── artifacts/api-server    Express 5 API (port 8080)
├── artifacts/control-tower  React+Vite frontend (port 5173)
├── artifacts/mockup-sandbox Component preview
├── lib/api-spec            OpenAPI 3.1 spec + Orval codegen
├── lib/api-client-react    Generated React Query hooks
├── lib/api-zod             Generated Zod validators
├── lib/db                  Drizzle ORM + Neon PostgreSQL
└── scripts                 Seed, utilities
```

## Database

- **Provider**: Neon PostgreSQL (Vercel Marketplace integration)
- **ORM**: Drizzle
- **Schema push**: `pnpm exec dotenv -e .env.local -- pnpm --filter @workspace/db run push`
- **Seed**: `cd scripts && pnpm exec dotenv -e ../.env.local -- pnpm exec tsx src/seed.ts`
- **10 tables**: service_lines, lead_sources, campaigns, patient_leads, content_assets, agents, agent_activities, alerts, attribution_touchpoints, audit_trail

### DB Connection Gotchas

- Code resolves: `DATABASE_URL || POSTGRES_URL || DATABASE_POSTGRES_URL_NON_POOLING || DATABASE_POSTGRES_URL`
- Pool `max: 1` for serverless (Vercel)
- SSL `rejectUnauthorized: false` for Neon
- `drizzle-kit` doesn't auto-load `.env.local` — use `dotenv -e .env.local --` prefix

## Completion Assessment

**Demo skeleton**: ~85% complete
- All 8 pages, all API routes, schema, seed data, deployment

**Enterprise target (docs/GAMEPLAN.md)**: ~35-45%
- Missing: real source integrations, role-based views, attribution confidence intervals, finance/margin linkage, HIPAA controls, anomaly explanation engine

## Next Priority: Deep Research Integration

The file `docs/GAMEPLAN.md` contains a comprehensive enterprise spec for oncology + cardio-oncology dashboard features. Key additions needed:

1. **Role-based views** (CMO, VP Marketing, Oncology Manager, etc.) — each with max 7 KPIs
2. **Net-new patient classification** (enterprise-new, specialty-new, reactivated, returning)
3. **Cardio-oncology pipeline** (eligibility → screening → enrollment → adherence)
4. **Multi-touch attribution models** (first-touch, last-touch, time-decay, position-based)
5. **Data trust badges** on every KPI tile (freshness + completeness scores)
6. **Geographic market penetration** map by ZIP
7. **Board-ready PDF export** for CMO view

## Files Changed From Replit Original

Only these files differ from the Replit codebase:

| File | Change | Why |
|------|--------|-----|
| `lib/db/src/index.ts` | POSTGRES_URL fallback, SSL, max:1 | Neon on Vercel vs Replit's internal Neon |
| `lib/db/drizzle.config.ts` | POSTGRES_URL fallback | Same |
| `artifacts/control-tower/vite.config.ts` | PORT/BASE_PATH defaults, conditional Replit plugins | Vercel doesn't inject PORT/BASE_PATH |
| `pnpm-workspace.yaml` | Removed platform binary overrides | Replit is Linux-only; we need macOS too |
| `artifacts/api-server/build.mjs` | Added serverless.ts entry point | Vercel needs Express without listen() |
| `artifacts/api-server/src/serverless.ts` | NEW: exports Express app | Serverless function entry |
| `api/index.mjs` | NEW: Vercel function wrapper | Routes /api/* to Express |
| `vercel.json` | NEW: deployment config | Build commands, rewrites, function config |

## Pixel-Perfect Verification (Run Before Any Changes)

Three deployments must be visually identical (same layout, branding, components — data values will differ due to random seeding):

| Version | URL/Path | Purpose |
|---------|----------|---------|
| **Replit (source of truth)** | https://northside-control-tower.replit.app | Original production |
| **Vercel (migrated)** | https://northside-control-tower.vercel.app | Current production |
| **Local dev** | http://localhost:5173 | Your working copy |
| **Archive backup** | `~/Developer/tools/backups/20260401-111544-Northside-Control-Tower` | Pre-handoff snapshot |

### Verification Procedure

For each of the 8 pages (`/`, `/attribution`, `/campaigns`, `/bookings`, `/content`, `/agents`, `/alerts`, `/departments`):

1. Open the page on **Replit** and **Vercel** side-by-side
2. Compare: sidebar layout, nav items, header, KPI cards, charts, tables, colors, fonts, spacing
3. Open the same page on **localhost:5173** after starting local dev
4. Any visual difference = bug. Fix before proceeding.

**Expected differences (not bugs):**
- KPI numbers/percentages (random seed data — structure must match, values will differ)
- Chart data points (same reason)
- Alert timestamps (time-relative)
- The Vercel toolbar icon (bottom-right corner on Vercel only)

**Actual bugs to fix if found:**
- Missing sidebar items or different nav order
- Different colors, fonts, or spacing
- Missing charts, cards, or panels
- Layout shifts or responsive breakage
- Broken icons or missing assets

### If Archive Needs Comparison

The archive at `~/Developer/tools/backups/20260401-111544-Northside-Control-Tower` is a full copy with node_modules. To run it:

```bash
cd ~/Developer/tools/backups/20260401-111544-Northside-Control-Tower
PORT=5174 BASE_PATH=/ pnpm --filter @workspace/control-tower run dev
# Opens on port 5174 — compare with localhost:5173
```

## Do NOT Change

- The seed data randomization (numbers will differ from Replit but structure is identical)
- The `@replit/vite-plugin-*` packages in package.json (they're conditionally loaded and harmless)
- The `.replit` and `replit.nix` files (needed if project is opened on Replit again)
