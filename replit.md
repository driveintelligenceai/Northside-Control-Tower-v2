# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

**Project**: Northside Hospital Sales & Marketing Control Tower — a mission-control-style command center for the CMO and CTO. Tracks all marketing inputs (paid ads, campaigns) and outputs (patient bookings, lead attribution), monitors recursive AI learning agents, and surfaces anomalies. Pre-populated with realistic Northside Hospital (Atlanta, GA) data across 10 actual service lines. HIPAA-aware architecture with de-identified patient data throughout.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)
- **Frontend**: React + Vite, TailwindCSS, shadcn/ui, Recharts, React Query

## Structure

```text
artifacts-monorepo/
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
- `pnpm --filter @workspace/api-server run build` — production esbuild bundle (`dist/index.cjs`)

### `artifacts/control-tower` (`@workspace/control-tower`)

React + Vite frontend for the Control Tower. Uses shadcn/ui components, Recharts for visualizations, React Query for data fetching.

- Entry: `src/main.tsx` — React app with QueryClientProvider
- Router: `src/App.tsx` — React Router with 8 page routes
- Pages: `src/pages/` — Individual page components
- Components: `src/components/ui/` — shadcn/ui components
- Depends on: `@workspace/api-client-react`

### `lib/db` (`@workspace/db`)

Database layer using Drizzle ORM with PostgreSQL. Exports a Drizzle client instance and schema models.

- `src/index.ts` — creates a `Pool` + Drizzle instance, exports schema
- `src/schema/index.ts` — barrel re-export of all models
- `drizzle.config.ts` — Drizzle Kit config (requires `DATABASE_URL`, automatically provided by Replit)
- Exports: `.` (pool, db, schema), `./schema` (schema only)

Production migrations are handled by Replit when publishing. In development, we just use `pnpm --filter @workspace/db run push`, and we fallback to `pnpm --filter @workspace/db run push-force`.

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
