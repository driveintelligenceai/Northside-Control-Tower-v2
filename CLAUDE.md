# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

**Project**: Northside Hospital Sales & Marketing Control Tower — a mission-control-style command center for the CMO and CTO. Tracks all marketing inputs (paid ads, campaigns) and outputs (patient bookings, lead attribution), monitors recursive AI learning agents, and surfaces anomalies. Pre-populated with realistic Northside Hospital (Atlanta, GA) data across 10 actual service lines. HIPAA-aware architecture with de-identified patient data throughout.

**Deployment**: Vercel (https://northside-control-tower.vercel.app)
**Database**: Neon PostgreSQL via Vercel Marketplace (auto-provisioned `DATABASE_URL`)
**Migrated from**: Replit on 2026-04-01

## Quick Start

```bash
git clone https://github.com/driveintelligenceai/Northside-Control-Tower.git
cd Northside-Control-Tower
pnpm install
vercel link --yes --project northside-control-tower
vercel env pull .env.local --yes
PORT=5173 BASE_PATH=/ pnpm --filter @workspace/control-tower run dev
```

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (ESM bundle)
- **Frontend**: React + Vite, TailwindCSS, shadcn/ui, Recharts, React Query

## Structure

```text
Northside-Control-Tower/
├── artifacts/              # Deployable applications
│   ├── api-server/         # Express API server (port 8080)
│   ├── control-tower/      # React + Vite frontend (previewPath: /)
│   └── mockup-sandbox/     # Component preview server
├── lib/                    # Shared libraries
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   └── db/                 # Drizzle ORM schema + DB connection
├── scripts/                # Utility scripts (seed, etc.)
│   └── src/                # Individual .ts scripts
├── pnpm-workspace.yaml
├── tsconfig.base.json
├── tsconfig.json
└── package.json
```

## Control Tower Pages (8 total)

1. **Command Center** (`/`) — System overview with KPIs, lead/booking velocity chart, agent health panel
2. **Attribution** (`/attribution`) — Multi-touch path analysis (First Touch, Multi-Touch, Last Touch models)
3. **Campaigns** (`/campaigns`) — Campaign control panel with active directory table, search/filter
4. **Bookings** (`/bookings`) — Patient booking funnel (Leads → Scheduled → Completed → Follow-ups)
5. **Content Lab** (`/content`) — Content performance analysis with asset library table
6. **AI Agents** (`/agents`) — Agent fleet status, accuracy/confidence bars, live activity feed
7. **Alerts** (`/alerts`) — Anomalies & alerts feed with severity filtering (critical/warning/info)
8. **Departments** (`/departments`) — Cross-department analysis by service line

## Database Schema (9 tables)

- `service_lines` — 10 Northside Hospital clinical departments
- `lead_sources` — 15 marketing channels (Google Ads, Facebook, Physician Referrals, etc.)
- `campaigns` — 25 active marketing campaigns with budgets and performance
- `patient_leads` — 50,000 de-identified patient leads with funnel stages (patientId format: NH-XXXXXX)
- `content_assets` — 25 marketing content pieces with engagement metrics
- `agents` / `agent_activities` — 5 AI agents (Data Quality, Attribution, Anomaly Detection, Optimization, Compliance) with 100 activity logs
- `alerts` — 15 system alerts/anomalies
- `attribution_touchpoints` — 25,000 multi-touch attribution entries (FK to patient_leads, lead_sources, campaigns)
- `audit_trail` — 200 audit entries tracking data access/mutations (HIPAA compliance)

## API Routes

All routes mounted at `/api`:
- `GET /api/dashboard/summary` — KPIs with period comparison trends
- `GET /api/dashboard/trends` — Time-series data for charts
- `GET /api/attribution` — Multi-model attribution analysis
- `GET /api/campaigns` — Campaign listing with search/filter/pagination
- `POST /api/campaigns` — Create a new campaign (with audit trail)
- `PATCH /api/campaigns/:id` — Update a campaign (with audit trail)
- `DELETE /api/campaigns/:id` — Delete a campaign (with audit trail)
- `GET /api/campaigns/top` — Top performing campaigns
- `GET /api/bookings/funnel` — Conversion pipeline stages
- `GET /api/bookings/by-service-line` — Bookings breakdown by department
- `GET /api/bookings/recent` — Recent booking activity feed
- `GET /api/content` — Content asset library
- `GET /api/content/top` — Top performing content
- `GET /api/agents` — Agent fleet status
- `GET /api/agents/:id/activities` — Agent activity logs
- `GET /api/alerts` — Alert feed with filtering
- `GET /api/alerts/summary` — Alert counts by severity
- `GET /api/service-lines` — Service line listing
- `GET /api/service-lines/performance` — Department performance metrics
- `GET /api/lead-sources` — Lead source listing

## Key Design Decisions

- **HIPAA-aware**: All patient data uses de-identified IDs (NH-XXXXXX format), no PHI stored
- **Period support**: 7d, 30d, 90d, 12m across most endpoints
- **ROI calculation**: Assumes $1,500 value per converted patient booking
- **Light theme**: Executive hospital dashboard with Northside Hospital branding (navy #003B71 sidebar, white backgrounds, blue #0073CF accents)
- **5 AI Agents**: Simulated recursive learning agents with accuracy/confidence scores

## TypeScript & Composite Projects

Every package extends `tsconfig.base.json` which sets `composite: true`. The root `tsconfig.json` lists all packages as project references. This means:

- **Always typecheck from the root** — run `pnpm run typecheck` (which runs `tsc --build --emitDeclarationOnly`). This builds the full dependency graph so that cross-package imports resolve correctly. Running `tsc` inside a single package will fail if its dependencies haven't been built yet.
- **`emitDeclarationOnly`** — we only emit `.d.ts` files during typecheck; actual JS bundling is handled by esbuild/tsx/vite...etc, not `tsc`.
- **Project references** — when package A depends on package B, A's `tsconfig.json` must list B in its `references` array. `tsc --build` uses this to determine build order and skip up-to-date packages.

## Root Scripts

- `pnpm run build` — runs `typecheck` first, then recursively runs `build` in all packages that define it
- `pnpm run typecheck` — runs `tsc --build --emitDeclarationOnly` using project references

## Packages

### `artifacts/api-server` (`@workspace/api-server`)

Express 5 API server. Routes live in `src/routes/` and use `@workspace/api-zod` for request and response validation and `@workspace/db` for persistence.

- Entry: `src/index.ts` — reads `PORT`, starts Express
- App setup: `src/app.ts` — mounts CORS, JSON/urlencoded parsing, routes at `/api`
- Routes: `src/routes/index.ts` mounts sub-routers (dashboard, service-lines, lead-sources, campaigns, bookings, content, agents, alerts)
- Depends on: `@workspace/db`, `@workspace/api-zod`
- `pnpm --filter @workspace/api-server run dev` — run the dev server
- `pnpm --filter @workspace/api-server run build` — production esbuild bundle (`dist/index.mjs` + `dist/serverless.mjs`)

### `artifacts/control-tower` (`@workspace/control-tower`)

React + Vite frontend for the Control Tower. Uses shadcn/ui components, Recharts for visualizations, React Query for data fetching.

- Entry: `src/main.tsx` — React app with QueryClientProvider
- Router: `src/App.tsx` — wouter with 8 page routes
- Pages: `src/pages/` — Individual page components
- Components: `src/components/ui/` — shadcn/ui components
- Depends on: `@workspace/api-client-react`

### `lib/db` (`@workspace/db`)

Database layer using Drizzle ORM with PostgreSQL. Exports a Drizzle client instance and schema models.

- `src/index.ts` — creates a `Pool` + Drizzle instance, exports schema
- `src/schema/index.ts` — barrel re-export of all models
- `drizzle.config.ts` — Drizzle Kit config (requires `DATABASE_URL` or `POSTGRES_URL`)
- Exports: `.` (pool, db, schema), `./schema` (schema only)

**DB connection resolution**: `DATABASE_URL` || `POSTGRES_URL` || `DATABASE_POSTGRES_URL_NON_POOLING` || `DATABASE_POSTGRES_URL`

**Schema push**: `pnpm exec dotenv -e .env.local -- pnpm --filter @workspace/db run push`
**Seed data**: `cd scripts && pnpm exec dotenv -e ../.env.local -- pnpm exec tsx src/seed.ts`

**Gotchas**:
- Pool `max: 1` is required for Vercel serverless (default 10 exhausts Neon connection limits)
- SSL `rejectUnauthorized: false` is needed for Neon connections from Vercel
- Always run `vercel env pull .env.local --yes` to get DB creds locally

### `lib/api-spec` (`@workspace/api-spec`)

Owns the OpenAPI 3.1 spec (`openapi.yaml`) and the Orval config (`orval.config.ts`). Running codegen produces output into two sibling packages:

1. `lib/api-client-react/src/generated/` — React Query hooks + fetch client
2. `lib/api-zod/src/generated/` — Zod schemas

Run codegen: `pnpm --filter @workspace/api-spec run codegen`

### `lib/api-zod` (`@workspace/api-zod`)

Generated Zod schemas from the OpenAPI spec. Used by `api-server` for response validation.

### `lib/api-client-react` (`@workspace/api-client-react`)

Generated React Query hooks and fetch client from the OpenAPI spec.

### `scripts` (`@workspace/scripts`)

Utility scripts package. Each script is a `.ts` file in `src/` with a corresponding npm script in `package.json`. Run scripts via `pnpm --filter @workspace/scripts run <script>`. Scripts can import any workspace package (e.g., `@workspace/db`) by adding it as a dependency in `scripts/package.json`.

- `seed` — Populates database with realistic Northside Hospital data (10 service lines, 15 lead sources, 25 campaigns, 50,000 patient leads, 25 content assets, 5 AI agents, 100 agent activities, 15 alerts, 25,000 attribution touchpoints, 200 audit trail entries)

## V1 / V2 Split

| Instance | URL | Repo | Purpose |
|---|---|---|---|
| **V1 (stable)** | https://northside-control-tower.vercel.app | `driveintelligenceai/Northside-Control-Tower` | Production — never break this |
| **V2 (enterprise)** | https://northside-control-tower-v2.vercel.app | `driveintelligenceai/Northside-Control-Tower-v2` | GAMEPLAN features: Oncology page, role-based views, trust badges, attribution switcher |

**V2 local dir**: `~/Developer/src/github.com/driveintelligenceai/Northside-Control-Tower-v2`

## Deploy Rules (MANDATORY)

1. **Every commit must deploy to Vercel** — run `vercel deploy --prod` from the project dir after every push
2. **V1 must always work** — never push breaking changes to V1 without testing first
3. **V2 gets all new features** — if a feature works in V2, backport to V1 only after full E2E verification
4. **Full visual E2E after each deploy** — check all routes return 200 and API returns valid JSON

## Vercel Deployment

- **V1 Production URL**: https://northside-control-tower.vercel.app
- **V2 Production URL**: https://northside-control-tower-v2.vercel.app
- **GitHub auto-deploy**: Push to `main` triggers production deploy
- **vercel.json**: Configures build commands, output directory, API rewrites, serverless function settings

### Architecture on Vercel

```text
Request → Vercel CDN
  ├── /api/* → Rewrite to api/index.mjs (Serverless Function)
  │             └── imports dist/serverless.mjs (pre-built Express app)
  │             └── connects to Neon PostgreSQL via POSTGRES_URL
  └── /* → Static files from artifacts/control-tower/dist/public/
```

**Key files for Vercel:**
- `vercel.json` — Build config, rewrites, function settings
- `api/index.mjs` — Serverless function entry (imports pre-built Express app)
- `artifacts/api-server/src/serverless.ts` — Express app export without `listen()` (built by esbuild to `dist/serverless.mjs`)

### Deploy commands

```bash
vercel deploy              # Preview deploy
vercel deploy --prod       # Production deploy
vercel env pull .env.local # Pull env vars locally
vercel env ls              # List env vars
vercel logs <url>          # Check runtime logs
```

### Environment Variables (auto-provisioned by Neon Marketplace integration)

- `DATABASE_URL` / `POSTGRES_URL` — Neon pooled connection string
- `POSTGRES_URL_NON_POOLING` — Direct connection (for migrations)
- `PGHOST`, `PGDATABASE`, `PGUSER`, `PGPASSWORD` — Individual connection params

## Migration History & Gotchas

- **Migrated from Replit 2026-04-01** — Replit uses Neon PostgreSQL (not Supabase, not their own DB)
- **Do NOT use Supabase** for this project — Supavisor pooler has SSL cert chain issues with `pg` module ("self-signed certificate in certificate chain")
- **vercel.json uses `routes`** (not `rewrites`) — includes `"handle": "filesystem"` + SPA catch-all to `/index.html`
- **`@replit/vite-plugin-*`** packages are still in `package.json` — loaded conditionally only when `REPL_ID` env exists (harmless on Vercel/local)
- **pnpm-workspace.yaml** — Replit platform binary overrides were removed; pnpm now installs native binaries for the current platform
- **Vercel project name must be lowercase** — `northside-control-tower` not `Northside-Control-Tower`
