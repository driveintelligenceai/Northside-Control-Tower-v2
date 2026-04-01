# Northside Hospital Oncology + Cardio‑Oncology Marketing Control Center Dashboard  
*(Requirements extraction, data audit, architecture, visualization plan, implementation options, roadmap, and KPI logic)*

## Executive Summary

This work consolidates and operationalizes the instructions in the “Northside Hospital Dashboard — FINAL MASTER PROMPT (Version 4)” and the attached supporting context into a build-ready dashboard specification focused on **oncology + cardio‑oncology growth**. The core design mandate is to create a **real-time, role-based Sales + Marketing Control Center** that executives and operators can trust—specifically by fixing: multi-touch attribution failure, lack of contribution-margin linkage, missing role-based views, HIPAA pixel restrictions, lack of anomaly explanation, missing cardio‑oncology eligibility→enrollment visibility, and invisible access/scheduling bottlenecks. fileciteturn2file0

Key confirmed system constraints in the primary file include: **Oracle Health (Cerner) Millennium EHR (not Epic)**; **Palantir Foundry already deployed** (build on top, do not recommend replacing); **SAP S/4HANA Cloud** (finance/ERP); **IBM Netezza** (warehouse); **UKG Pro** (HR); **ServiceNow** (ITSM); and Cerner integration paths via **FHIR R4 (Ignite / Oracle Health APIs)** and **HL7 v2 (COI)**. fileciteturn2file0 Official Oracle documentation confirms availability of **FHIR R4 APIs for Oracle Health Millennium Platform**. citeturn4search1turn4search9

Two practical implications shape the dashboard’s structure:
1) “Net-new patient” must be defined with enterprise identity logic and **reported as separate subtypes** (enterprise-new, specialty-new, reactivated >24 months, returning)—not blended—to prevent overclaiming growth. fileciteturn2file1  
2) The dashboard must be **role-based and permission-gated**, with instant role switching and tight control of PHI exposure. fileciteturn2file0

A constraint that blocks a full “existing codebase critique” deliverable: the Version 4 file requires reading a connected GitHub repo first—but **no GitHub connector/repo content is available in the provided sources in this run**, so any critique of the prototype is **unspecified** and cannot be produced without the repo. fileciteturn2file0

## Connected-source inventory and what was found

### Enabled connectors used first

Google Drive connector calls returned **no searchable documents** (including no results for “northside-dashboard-final-V4” and even for broad “northside”), so no Drive-hosted artifacts can be cited from that connector in this run. *(Observed via connector searches; no files returned.)*

Airtable connector is enabled and shows four bases: **KPI Dictionary**, **Role Map**, **Data Source Inventory**, **Agent Specs**. However, each base currently contains a single table with schema fields set up but **records are effectively empty** (placeholders without populated content). *(Observed via Airtable base/table inspection; no substantive KPI/role definitions present.)*

Adobe Acrobat connector is enabled for PDF operations, but no PDFs were located via Drive for extraction during this run.

### Primary files available in attached context

| Item | Where it came from | What it contains (brief) |
|---|---|---|
| **Pasted text.txt** (“Northside Hospital Dashboard — FINAL MASTER PROMPT, Version 4”) | Uploaded context | Master instruction set: confirmed systems, failure modes, required roles, required KPIs, required schema tables, required agents, and required output artefact structure (GAMEPLAN.md sections). fileciteturn2file0 |
| **context.rtf** | Uploaded context | Expanded requirements, essential widgets, role-based philosophy, and practical KPI spine for oncology + cardio‑oncology (funnels, leakage, access, data-trust layer, benchmarks). fileciteturn2file1 |
| **Northside Hospital Cancer + Cardio-Oncology Marketing Control Center.md** | Uploaded context | Prior synthesized research including role-based tiles, agent stack, SLAs, and cost ranges; also contains outbound reference links that should be treated as secondary until independently verified. fileciteturn3file0 |

## Requirements, KPIs, personas, and specified mockups

### Product scope and non-negotiable constraints

The dashboard is explicitly defined as a **Sales + Marketing Control Center** (not a lightweight marketing dashboard) with: executive KPIs, acquisition funnel, referral performance, access/capacity, and a visible data-trust layer. fileciteturn2file1  
The primary clinical/business growth focus for v1 is **oncology + cardio‑oncology**, with operations spanning multiple campuses and distributed cancer/radiation locations. fileciteturn3file10

System and integration “do not contradict” facts (from Version 4) include:
- EHR: **Oracle Health (Cerner) Millennium**. fileciteturn2file0  
- BI/analytics platform already deployed: **Palantir Foundry** (do not replace). fileciteturn2file0  
- Finance: **SAP S/4HANA Cloud**; DW: **IBM Netezza**; HR: **UKG Pro**; ITSM: **ServiceNow**. fileciteturn2file0  
- Preferred integration path from Cerner: **FHIR R4** (Ignite/Oracle Health APIs) and **HL7 v2 via COI**. fileciteturn2file0  
Oracle’s official documentation describes **FHIR R4 APIs for Oracle Health Millennium Platform** and the general EHR API endpoint structure. citeturn4search1turn4search9

### Stakeholders and user personas

The Version 4 file specifies eight roles that must each have a defined view, KPIs (max 7 on primary view), drill-down depth, update cadence, PHI exposure level, mobile requirement, and board-export requirement. fileciteturn2file0

The required roles are:
CMO; VP/Director of Marketing; Oncology Service‑Line Manager; Cardio‑Oncology Program Manager; Physician Liaison; Call Center Manager; Access/Scheduling Manager; CFO Business Partner. fileciteturn2file0

Additionally, the context emphasizes that different stakeholders value different lenses: executives want growth/margin/access/market views; service-line leaders want physician-level leakage and booking speed; marketing leaders want attribution/channel efficiency; physicians/practice managers care about referral quality, schedule fill, and time-to-appointment—therefore one universal view is a failure state. fileciteturn2file1

### Required KPIs and metrics

The Version 4 file mandates a minimum KPI set including (non-exhaustive excerpt):
- **Net‑new patients** as four separate subtypes (enterprise-new, specialty-new, reactivated >24 months, returning). fileciteturn3file3  
- Net‑new oncology patients by tumor site + campus; net‑new cardio‑oncology patients. fileciteturn3file3  
- PAC by channel/service line; LTV:CAC; episode-based campaign ROI over a 12–24 month attribution window; lead→consult conversion; referral lifecycle conversion (created→contacted→scheduled→completed→leaked); referral leakage; time from referral to first oncology consult. fileciteturn3file3  
- Cardio‑oncology pipeline: eligibility screening rate, enrollment conversion, follow-up adherence. fileciteturn3file3  
- Access and call center: next available appointment, call volume, abandonment rate, hold time, appointment conversion. fileciteturn3file3  
- Financial credibility layer: marketing-attributed contribution margin with confidence interval. fileciteturn3file3  
- Market and referral power: geographic market penetration index by ZIP; physician referral relationship score; treatment start and completion rates by tumor site. fileciteturn3file3

The supporting context adds “absolutely essential widgets,” reinforcing funnels, referral lifecycle, access bottlenecks, and geo demand mapping as must-haves. fileciteturn2file1

### Specified UI patterns and mockup expectations

The Version 4 file demands a UI/UX specification: standardized KPI tiles (value, trend, vs target, alert state), chart types per KPI category (funnels, geo map, access, ROI, cardio-oncology pathway), anomaly explanation panel, and a per-tile data trust indicator. fileciteturn3file13  
It also explicitly requires a **board-ready single-page PDF export** and a **mobile Physician Liaison view** (minimum iPhone width 375px). fileciteturn3file13

## Data inventory and audit

### What data assets were actually provided

No structured operational datasets (CSV/Parquet/warehouse extracts) were located in Google Drive via the connector in this run, and the Airtable bases are currently templates without populated KPI/role/data-source definitions.

Therefore, the only “provided data files” available for schema audit in this run are Airtable schemas (mostly empty records) plus unstructured requirement documents (which are requirements sources, not datasets).

### Dataset audit table

| Dataset / Table | Location | Observed schema (fields → type) | Row count | Quality issues found | Remediation steps |
|---|---|---|---:|---|---|
| KPI Dictionary | Airtable base “KPI Dictionary” | Name → text; Notes → multiline text; Assignee → collaborator; Status → select; Attachments → attachments; Attachment Summary → AI text | 3 (empty placeholder rows) | Records contain no KPI definitions; cannot serve as reference data yet | Populate with the required KPI dictionary rows from the Version 4 KPI minimum list; enforce required fields (Name, Formula, Data Source, Cadence, HIPAA risk, Reliability). fileciteturn3file3 |
| Role Map | Airtable base “Role Map” | Same structural fields as above (Name/Notes/Assignee/Status/Attachments/AI summary) | 3 (empty placeholder rows) | No role-to-KPI mapping or PHI exposure classification | Populate per-role tables described in Version 4 Role-Based View Specifications (max 7 KPIs, drill depth, cadence, PHI exposure, mobile, board export). fileciteturn2file0 |
| Data Source Inventory | Airtable base “Data Source Inventory” | Same template fields | 3 (empty placeholder rows) | No enumerated sources/connectors; no schemas; no refresh SLAs; cannot support ingestion planning | Populate with confirmed systems (Cerner, Foundry, SAP, Netezza, UKG, ServiceNow) + any verified marketing/CRM/call tracking sources; add fields for “system of record,” method (FHIR/HL7/API), cadence, PHI classification. fileciteturn2file0 |
| Agent Specs | Airtable base “Agent Specs” | Same template fields | 3 (empty placeholder rows) | No agent definitions / triggers / checkpoints | Populate with the 10 required agents (ingestion, identity, attribution, referral lifecycle, cardio-onc pathway, access/capacity, anomaly, data quality, privacy, executive narrative). fileciteturn3file13 |

### Planned production data sources (cannot be audited yet)

The sources below are explicitly required by the spec but were not provided as extract files in this run, so row counts and quality issues are **unspecified**. The transformation requirements are listed because they are implied by the KPI definitions and the integration constraints.

| Planned dataset | System of record | Acquisition method | Minimum required fields (proposed, derived from KPI needs) | Key transformation needs |
|---|---|---|---|---|
| Patients (master identity) | Cerner Millennium | FHIR R4 | enterprise_patient_id, MRN(s), DOB bucket (or year), sex, home ZIP3/ZIP5 (as allowed), risk cohort flags | Identity resolution across MRN/CRM/call/web IDs; tokenization / minimum necessary per HIPAA approach. HIPAA de-identification methods (Safe Harbor / Expert Determination) should govern what is stored in analytics layers. citeturn0search0turn0search3 |
| Encounters | Cerner Millennium | FHIR R4 | encounter_id, patient_id, service_line, tumor_site (if derivable), campus/location, start/end times, disposition, payer class (if allowed) | Encounter normalization; service line classification; mapping to campaign/referral/lead; time-window logic |
| Appointments / scheduling slots | Cerner Millennium Scheduling | FHIR R4 + HL7 v2 feeds | appointment_id, status, start/end, provider_id, location/campus, specialty/service | Derive next-available appointment; compute scheduling lead time; align with demand funnel |
| Referrals / Service Requests | Cerner Millennium | FHIR R4 (ServiceRequest), possibly HL7 | referral_id, created_at, source provider/practice, specialty/service line, status milestones, destination (internal/external) | Standardize milestone timestamps (created/contacted/scheduled/completed/leaked) for conversion + aging |
| Clinical risk flags (cardio-onc eligibility) | Cerner Millennium | FHIR R4 (Condition / Observation / MedicationRequest etc.) | patient_id, therapy indicators, cardiac risk indicators, eligibility date, screened flag/date | Define eligibility logic; avoid PHI leakage; segregate operational PHI view vs de-identified aggregates |
| Marketing leads (calls/forms) | Marketing stack (unspecified) | API / batch export | lead_id, created_at, channel, campaign, conversion events, source (call/form/referral) | Dedup across sources, stitch to patient identity, define “lead→appointment→consult” funnel |
| Campaign touches | Web analytics + ad platforms | Server-side tagging + APIs | touch_id, timestamp, channel, campaign, creative, landing, consent mode signal | Multi-touch attribution modeling in HIPAA-safe ways (server-side, consent-based) |
| Spend + contribution margin | SAP S/4HANA Cloud | Finance extract | campaign_costs, revenue, cost, margin, payer mix estimates | Align marketing cohorts to financial outcomes; compute confidence intervals and disclose assumptions |
| Geo/demographics reference | Public datasets (Census/ACS) | External | ZIP population, age structure, income, etc. | Normalize to ZIP, compute market penetration index |

## Dashboard information architecture and visualization plan

### Information architecture: pages, widgets, filters, interactions

The architecture below is designed to satisfy the “role-based views” requirement (each with a minimal KPI set) while allowing secure drill-down only where appropriate. fileciteturn2file0

**Global navigation (all roles):**
- Role switcher (single click; permission-gated) fileciteturn2file0
- Global filters (scoped by role permissions): Date range; Service line (default Oncology/Cardio‑Oncology); Campus/location; Channel; Referral source type; Tumor site; ZIP; Provider/Practice (if permitted)
- Data trust panel (freshness/completeness per metric) fileciteturn3file13

**CMO Executive (single-screen + PDF export)**  
Primary purpose: board-ready growth + ROI + access bottlenecks.
- KPI tiles (8 maximum visually; show 5–7 “primary KPIs” and a couple of supporting trust/access tiles)
- Net-new oncology + cardio-oncology (MTD/QTD/YTD vs target)
- Bookings pipeline volume + value estimate
- LTV:CAC gauge with R/Y/G thresholds (benchmarks provided in context) fileciteturn3file18
- Referral leakage + time-to-consult
- Market penetration map by ZIP
- Anomaly explanation panel when metrics swing outside thresholds fileciteturn3file13
- Export: board-ready PDF (single page) fileciteturn3file13

**Marketing Director / VP Marketing (channel + campaign control)**  
Primary purpose: enforce efficiency and real attribution for long-cycle oncology journeys.
- Funnel by channel: impressions → leads → scheduled → completed consult → treatment start (where measurable) fileciteturn2file1
- Patient acquisition cost by channel and service line
- Multi-touch attribution model switcher (first-touch/last-touch/time-decay/position-based) aligned to HIPAA constraints fileciteturn2file1
- “Attribution confidence” and “untracked touchpoint estimate” indicators (explicitly labeled as estimated where needed)

**Oncology Service-Line Manager (operations + leakage)**  
Primary purpose: move patients through consult→treatment; detect drop-offs.
- Oncology funnel waterfall by tumor site
- Leakage by stage and source
- Time from referral to first consult
- Next available appointment by campus/provider
- Treatment start and completion rates by tumor site

**Cardio‑Oncology Program Manager (eligibility → enrollment → adherence)**  
Primary purpose: close eligibility-to-enrollment gap and maintain follow-up.
- Eligibility screened rate fileciteturn3file7
- Enrollment conversion rate fileciteturn3file7
- Follow-up adherence rate fileciteturn3file7
- Referral sources generating cardio-oncology needs
- Correlation panels (screening/enrollment vs outcomes proxies) clearly labeled as associative, not causal

**Access / Scheduling Manager (capacity vs demand)**  
Primary purpose: ensure demand does not die in the appointment queue.
- Next available appointment by specialty/campus/provider fileciteturn3file3
- Scheduling conversion (scheduled vs completed)
- No-show rates and capacity utilization (if available)

**Call Center Manager**
- Call volume, abandonment rate, hold time, appointment conversion fileciteturn3file3
- Breakdown by oncology/cardio-oncology, campus, and daypart

**Physician Liaison (mobile-first)**
- Referral volume by referring physician/practice and trend
- Referral conversion rate + leakage flags
- Territory/ZIP insights and “next actions” list
- Must be mobile responsive and minimal. fileciteturn3file13

**CFO Business Partner**
- Contribution margin (cohort-based) and confidence bounds fileciteturn3file3
- PAC, LTV, LTV:CAC
- Spend vs pipeline health and “measurement reliability” indicators

### Data refresh cadence and SLAs

A tiered SLA pattern is explicitly recommended in the context: scheduling/ADT minute-level; campaign/lead hourly; financial daily; encounter completions T+1 or T+4 hrs with reconciliation. fileciteturn3file6  
FHIR-based clinical extraction is consistent with Oracle’s published Millennium FHIR R4 API availability. citeturn4search1turn4search9

### Visualization recommendations by KPI

The choices below prioritize perceptual accuracy for comparisons and trends (e.g., position/length on common scales), consistent with foundational graphical perception findings by Cleveland & McGill. citeturn0search2

| KPI / metric | Recommended visualization | Why this is the “best fit” |
|---|---|---|
| Net-new patients (by subtype) | Stacked bars by period + small multiples by subtype | Comparisons across time and between categories are most accurate using aligned lengths/positions. citeturn0search2 |
| Net-new oncology by tumor site | Ranked horizontal bars + trend sparklines per tumor site | Ranking supports fast “what grew vs shrank” comprehension; sparklines add direction without clutter. citeturn0search2 |
| Funnel (leads→scheduled→completed→treatment start) | Waterfall or funnel with stage-to-stage conversion labels + drop-off callouts | Shows both volume and conversion; supports stage diagnosis (where patients are lost). fileciteturn2file1 |
| Referral lifecycle conversion | Funnel + aging histogram (days open) | Conversion shows throughput; aging highlights operational delays and leakage risk. fileciteturn3file3 |
| Time from referral to first consult | Line over time (median + P90) + control limits | Median shows central tendency; P90 indicates tail pain; control-limits support anomaly detection. citeturn9search3turn0search2 |
| Cardio-oncology eligibility→enrollment→adherence | Step/funnel + cohort retention curve | Explicitly visualizes the “gap” and follow-up decay patterns. fileciteturn3file7 |
| Next available appointment | Heatmap (campus × specialty) + “worst offenders” list | Heatmap surfaces bottlenecks instantly; ranking list directs action. fileciteturn2file1 |
| Call center abandon rate / hold time | Line chart + threshold bands | Operational metric suited to trend-over-time with alert thresholds. fileciteturn3file3 |
| PAC, LTV:CAC, ROI | Bullet/gauge-style KPI tile + trend line | Executive readability with benchmark bands; keep numeric context. fileciteturn3file18 |
| Geographic market penetration | Choropleth by ZIP + side panel ranking | Geo distribution requires map; always pair with rank table for exact comparisons. fileciteturn2file1 |
| Attribution credit by channel | Multi-model comparison bars (first-touch vs last-touch vs time-decay) | Shows model sensitivity; prevents last-click distortion. fileciteturn3file13 |
| Data trust per KPI | Tiny “freshness/completeness” badge + tooltip with last refresh | Trust layer is mandatory; must be visible but non-intrusive. fileciteturn3file13 |

## Implementation options, BI tools, and cost/effort ranges

### Implementation principle: build on Foundry, don’t replace it

The primary file explicitly states Palantir Foundry is deployed and advises not to recommend replacing it. fileciteturn2file0  
Foundry’s official documentation describes the platform and its governance/security capabilities. citeturn14search0turn14search2

Foundry also supports granular controls: Palantir documents “object and property policies” supporting **cell-level security (row + column)**. citeturn14search3turn14search4 This aligns strongly with HIPAA role-based minimum-necessary access patterns.

### BI / visualization tool comparison

At least four tools are compared below (plus Foundry, given it’s a required constraint).

| Tool | Strengths for this use case | Weaknesses / cautions | Pricing signals (official where available) |
|---|---|---|---|
| **Palantir Foundry (existing)** | Strong data integration + governance; object/property security; can serve as “source of truth” platform layer. citeturn14search0turn14search3 | Licensing/pricing not publicly standardized; requires Foundry-skilled developers; UI may need custom “executive polish” layer | Pricing not cited (customer-specific) |
| **Tableau** | Powerful visualization, executive-quality dashboards; broad adoption | RBAC often depends on data platform setup; licensing can scale quickly | Tableau Server per-user annual-billed list pricing shows Viewer/Explorer/Creator tiers. citeturn2search2turn2search7 |
| **Power BI (Fabric)** | Cost-effective per-user; strong Microsoft ecosystem integration | Healthcare governance depends on tenant controls; some advanced features require PPU/capacity | Microsoft lists Pro ($14 user/month yearly) and PPU ($24 user/month yearly). citeturn1search1turn1search3 |
| **Looker (Google Cloud core)** | Semantic modeling layer (LookML), governed metrics; strong for consistency | Pricing is “call sales”; requires LookML skill; modeling upfront cost | Google explains platform + user pricing components and user types. citeturn1search0 |
| **Apache Superset** | Open-source; flexible; supports security roles and row-level security constructs | Requires self-hosting and hardening; more engineering overhead | Superset docs describe security configurations and row-level security APIs. citeturn2search1turn2search0turn2search4 |

### Hosting / infrastructure options aligned to the spec

The Version 4 file’s target build stack mentions **Next.js + Vercel + Supabase**, plus **DuckDB/MotherDuck** for de-identified aggregates. fileciteturn2file0

Given HIPAA constraints, a practical architecture is:

**Option A (Recommended): Foundry-first data + secure web app for role UX**
- Foundry: ingestion, transformation, governed datasets/ontology, PHI controls (as needed)
- Web app: Next.js front-end for role-based UX polish, but only consumes **de-identified aggregates** (or PHI only for explicitly authorized operational roles, if hospital policy allows)
- Supabase: application auth + RLS for app tables (roles, audit, cached KPI snapshots). Supabase RLS is a Postgres feature and is intended for granular authorization “defense in depth.” citeturn3search1
- Vercel: front-end hosting (keep ePHI out of Vercel unless a BAA/controls exist—**unspecified** in sources)
- MotherDuck: optional analytics store for de-identified metrics; MotherDuck lists an Enterprise plan that includes HIPAA BAA capability. citeturn6search2

**Option B: BI-tool-first (Power BI / Tableau / Looker)**
- Requires duplicating some of Foundry’s governance investment unless tightly integrated
- Can be fast for visualization but often weaker for “single source of truth” and complex healthcare identity stitching without a strong data platform underneath

### Effort and cost ranges

Because no repo and no real data extracts were provided, estimates below are necessarily coarse and should be treated as **planning bands** not quotes.

A pragmatic starting range (v1 oncology + cardio-oncology, role-based, with at least one Cerner data feed + identity stitching + basic attribution + trust layer):
- **MVP (CMO view + oncology funnel + access basics):** ~6–10 weeks, 2–4 FTE-equivalents  
- **Role-complete v1 (all role views + foundational agents):** ~10–16 weeks, 4–7 FTE-equivalents  
- **Full “attribution + margin + anomaly explanation + board exports”:** ~16–24+ weeks, 6–10 FTE-equivalents

The CMO credibility risk (“prove marketing value”) is supported by Gartner’s reporting that only **52% of senior marketing leaders** can prove marketing’s value and receive credit for outcomes, reinforcing the need to prioritize margin linkage and trust layers. citeturn13search0

## Roadmap, resourcing, and risk mitigation

### Prioritized roadmap aligned to the Version 4 phase structure

The Version 4 file provides a phased timeline (foundation → CMO MVP → all roles + real data → attribution + agents + board export). fileciteturn1file8 The roadmap below keeps that structure but adds explicit deliverables and risk gates.

```mermaid
gantt
    title Northside Control Center Roadmap (Oncology + Cardio-Oncology v1)
    dateFormat  YYYY-MM-DD
    excludes    weekends

    section Foundation (Plan + Security + Data Inventory)
    Stakeholder KPI freeze + role matrix           :a1, 2026-04-06, 10d
    Data source inventory + access approvals       :a2, 2026-04-06, 15d
    Supabase auth/RLS skeleton + audit logging     :a3, 2026-04-13, 14d
    Foundry dataset/ontology mapping draft         :a4, 2026-04-13, 14d

    section CMO MVP
    KPI tiles + trust badges + export layout       :b1, 2026-04-27, 14d
    Net-new patient logic v1 + funnel v1           :b2, 2026-04-27, 14d
    Access bottleneck + referral leakage MVP       :b3, 2026-05-04, 10d

    section Role Expansion + Real Data
    Oncology Ops + Cardio-Onc pages                :c1, 2026-05-18, 20d
    Call center + Access/Scheduling views          :c2, 2026-05-18, 20d
    Physician Liaison mobile view                  :c3, 2026-05-25, 15d

    section Attribution + Margin + Agents
    Identity resolution + attribution v1           :d1, 2026-06-15, 25d
    Contribution margin linkage (SAP)              :d2, 2026-06-22, 20d
    Anomaly detection + explanation panel          :d3, 2026-07-06, 20d
```

### Resource roles needed

A minimum viable team composition (roles, not headcount commitments):
- Product owner (marketing/strategy)
- Clinical operations SME (oncology + cardio-oncology workflow)
- Data engineer (Foundry / ingestion)
- Analytics engineer (metric definitions, transformations, testing)
- Full-stack engineer (Next.js + auth + role UX)
- Security/privacy officer (HIPAA controls, access review, audit policy)
- QA/monitoring engineer (data validation + alerting)

### Risk register and mitigations

| Risk | Why it matters | Mitigation |
|---|---|---|
| Identity resolution failure | Breaks net-new definitions and attribution; creates executive distrust | Implement confidence-scored matching; keep “unknown/unmatched” visible; human review queue; audit log. fileciteturn3file13 |
| Scheduling data latency | Access bottlenecks become invisible; marketing demand “expires” in queue | Use near-real-time HL7/ADT + scheduling feeds where available; SLA tiering as specified. fileciteturn3file6 |
| Contribution margin linkage delays | CFO/board won’t trust ROI; funding risk | Deliver interim “pipeline value estimate” labeled as estimated; prioritize SAP integration as Phase 4. fileciteturn3file3 |
| HIPAA tracking constraints | Web attribution gaps (no pixel PHI) | Use server-side, consent-driven first-party events; show attribution confidence interval; follow HIPAA de-identification guidance. citeturn0search0turn0search3 |
| Tool sprawl / platform duplication | Costs and governance complexity | Anchor on Foundry for data + governance (existing), minimize extra BI licensing. fileciteturn2file0 |
| “Alert fatigue” | No adoption if anomalies lack context | Require anomaly explanation panel; tie to known operational causes (e.g., downtime, campaign pauses). fileciteturn3file13 |

## Wireframes, ER data model, KPI transformations, and validation plan

### Sample wireframes

These mockups implement the required patterns: role switch, KPI tiles, funnel + leakage, and mobile liaison view. fileciteturn3file13

![Wireframe — CMO Executive](sandbox:/mnt/data/wireframe_cmo.png)

![Wireframe — Oncology Operations](sandbox:/mnt/data/wireframe_oncology_ops.png)

![Wireframe — Physician Liaison Mobile](sandbox:/mnt/data/wireframe_physician_liaison_mobile.png)

### Data model ER diagram

The Version 4 file specifies minimum required tables (patients, encounters, appointments, referrals, leads, campaigns, campaign_touches, channels, physicians, service_lines, campuses, kpi_snapshots, users, roles, audit_log). fileciteturn3file13

```mermaid
erDiagram
  ROLES ||--o{ USERS : assigns
  USERS ||--o{ AUDIT_LOG : writes
  PATIENTS ||--o{ ENCOUNTERS : has
  PATIENTS ||--o{ APPOINTMENTS : schedules
  PATIENTS ||--o{ REFERRALS : receives
  PHYSICIANS ||--o{ REFERRALS : initiates
  CAMPUSES ||--o{ ENCOUNTERS : occurs_at
  CAMPUSES ||--o{ APPOINTMENTS : occurs_at
  SERVICE_LINES ||--o{ ENCOUNTERS : categorizes
  SERVICE_LINES ||--o{ REFERRALS : targets
  CHANNELS ||--o{ CAMPAIGNS : groups
  CAMPAIGNS ||--o{ CAMPAIGN_TOUCHES : generates
  LEADS ||--o{ CAMPAIGN_TOUCHES : attributed_touch
  LEADS ||--o{ APPOINTMENTS : converts_to
  KPI_SNAPSHOTS }o--|| SERVICE_LINES : scoped_to
  KPI_SNAPSHOTS }o--|| CAMPUSES : scoped_to

  ROLES {
    uuid role_id PK
    text role_name
  }
  USERS {
    uuid user_id PK
    uuid role_id FK
    text email
    text display_name
  }
  PATIENTS {
    uuid patient_id PK
    text enterprise_patient_key  "tokenized"
    date first_seen_date
    text home_zip3
  }
  ENCOUNTERS {
    uuid encounter_id PK
    uuid patient_id FK
    uuid campus_id FK
    uuid service_line_id FK
    timestamptz start_ts
    timestamptz end_ts
    text encounter_type
  }
  APPOINTMENTS {
    uuid appointment_id PK
    uuid patient_id FK
    uuid campus_id FK
    timestamptz start_ts
    text status
    uuid provider_id FK
  }
  REFERRALS {
    uuid referral_id PK
    uuid patient_id FK
    uuid referring_physician_id FK
    uuid service_line_id FK
    timestamptz created_ts
    timestamptz contacted_ts
    timestamptz scheduled_ts
    timestamptz completed_ts
    timestamptz leaked_ts
    text leakage_destination
  }
  LEADS {
    uuid lead_id PK
    uuid patient_id FK  "nullable until resolved"
    timestamptz created_ts
    text lead_source  "call/form"
    text channel
    text campaign_id
  }
  CAMPAIGNS {
    uuid campaign_id PK
    uuid channel_id FK
    text name
    date start_date
    date end_date
  }
  CAMPAIGN_TOUCHES {
    uuid touch_id PK
    uuid campaign_id FK
    uuid lead_id FK
    timestamptz touch_ts
    text touch_type
  }
  KPI_SNAPSHOTS {
    uuid snapshot_id PK
    date snapshot_date
    uuid service_line_id FK
    uuid campus_id FK
    text kpi_name
    numeric kpi_value
    numeric completeness_score
    numeric freshness_score
  }
  AUDIT_LOG {
    uuid audit_id PK
    uuid actor_user_id FK
    timestamptz ts
    text action
    json metadata
  }
```

### KPI computation logic and required transformations

Below are **implementation-grade formulas/pseudocode** aligned to the required KPI list. Any element not explicitly defined in sources is marked as a **required design decision** rather than assumed.

**Net-new patient classification (required for multiple KPIs)**  
Requirement: split into enterprise-new, specialty-new, reactivated (>24 months), returning. fileciteturn3file3  
Key decision needed (unspecified in sources): the identity “enterprise_patient_key” method and “specialty attribution” rules.

Pseudocode:
```sql
-- Inputs:
-- encounters(patient_id, service_line_id, start_ts)
-- params: lookback_months = 24

with patient_history as (
  select
    patient_id,
    min(start_ts) as first_encounter_ts,
    max(start_ts) as last_encounter_ts
  from encounters
  group by patient_id
),
service_history as (
  select
    patient_id,
    service_line_id,
    min(start_ts) as first_service_ts,
    max(start_ts) as last_service_ts
  from encounters
  group by patient_id, service_line_id
),
as_of as (
  select current_date as as_of_date
),
classify as (
  select
    s.patient_id,
    s.service_line_id,
    case
      when s.first_service_ts = p.first_encounter_ts then 'enterprise_new'
      when p.last_encounter_ts < (as_of.as_of_date - interval '24 months') then 'reactivated_24mo'
      when s.first_service_ts is not null and s.first_service_ts > p.first_encounter_ts then 'specialty_new'
      else 'returning'
    end as new_patient_type
  from service_history s
  join patient_history p using (patient_id)
  cross join as_of
)
select * from classify;
```

**Core KPI formulas** (illustrative; uses recommended tables above):

- **Net-new oncology patients (by tumor site, campus)**  
  - Numerator: count(distinct patient_id) where service_line=Oncology and new_patient_type in (enterprise_new, specialty_new, reactivated_24mo) and encounter in period  
  - Segmentation: tumor_site, campus fileciteturn3file3

- **Net-new cardio-oncology patients**  
  - Requires cardio-oncology service-line definition (unspecified) plus “enrolled” definition (specified as KPI but not operationally defined). fileciteturn3file7

- **Lead→consult conversion rate by channel**  
```sql
select
  channel,
  count(distinct case when consult_completed_ts is not null then lead_id end)
  / nullif(count(distinct lead_id), 0) as lead_to_consult_rate
from lead_funnel
where service_line='Oncology'
  and lead_created_ts between :start and :end
group by channel;
```

- **Referral conversion: created→contacted→scheduled→completed→leaked** fileciteturn3file3  
```sql
select
  service_line_id,
  count(*) as referrals_created,
  count(*) filter (where contacted_ts is not null) as contacted,
  count(*) filter (where scheduled_ts is not null) as scheduled,
  count(*) filter (where completed_ts is not null) as completed,
  count(*) filter (where leaked_ts is not null) as leaked,
  (count(*) filter (where completed_ts is not null))::numeric / nullif(count(*),0) as created_to_completed_rate,
  (count(*) filter (where leaked_ts is not null))::numeric / nullif(count(*),0) as leakage_rate
from referrals
where created_ts between :start and :end
group by service_line_id;
```

- **Time from referral to first oncology consult (days)** fileciteturn3file3  
```sql
select
  percentile_cont(0.5) within group (order by (consult_completed_ts - referral_created_ts)) as median_time,
  percentile_cont(0.9) within group (order by (consult_completed_ts - referral_created_ts)) as p90_time
from oncology_referral_to_consult
where referral_created_ts between :start and :end;
```

- **Next available appointment by specialty/campus/provider** fileciteturn3file3  
```sql
select
  campus_id,
  provider_id,
  specialty,
  min(start_ts) as next_available_start_ts
from appointment_slots
where status = 'free'
  and start_ts >= now()
group by campus_id, provider_id, specialty;
```

- **Cardio-oncology eligibility screening rate** fileciteturn3file7  
Key decision: “eligible” logic (e.g., therapy/risk factors). Must be explicitly defined and validated clinically.
```sql
select
  count(*) filter (where screened_ts is not null)::numeric / nullif(count(*),0) as screening_rate
from cardio_onc_eligible_patients
where eligible_ts between :start and :end;
```

- **Cardio-oncology enrollment conversion (enrolled / screened)** fileciteturn3file7  
```sql
select
  count(*) filter (where enrolled_ts is not null)::numeric
  / nullif(count(*) filter (where screened_ts is not null),0) as enrollment_rate
from cardio_onc_eligible_patients
where eligible_ts between :start and :end;
```

- **Follow-up adherence** fileciteturn3file7  
Key decision: adherence window rules (e.g., follow-up within 30/60/90 days).
```sql
select
  count(*) filter (where followup_completed_within_window = true)::numeric / nullif(count(*),0) as adherence_rate
from cardio_onc_enrolled_cohort;
```

- **Patient Acquisition Cost (PAC)** fileciteturn3file3  
```sql
select
  channel,
  sum(spend_amount) / nullif(count(distinct net_new_patient_id),0) as pac
from spend_by_channel s
join net_new_patients n
  on n.attributed_channel = s.channel
where s.spend_date between :start and :end
  and n.first_oncology_encounter_date between :start and :end
group by channel;
```

- **LTV:CAC** fileciteturn3file3  
Key decision: LTV method (e.g., contribution margin over 12/24/36 months). This is explicitly required but not fully specified. fileciteturn3file3
```sql
select
  cohort,
  (sum(contribution_margin_24mo) / nullif(sum(acquisition_cost),0)) as ltv_to_cac
from cohort_economics
group by cohort;
```

- **Episode-based campaign ROI (12–24 months)** fileciteturn3file3  
```sql
select
  campaign_id,
  sum(contribution_margin_24mo) / nullif(sum(spend_amount),0) as roi_24mo
from campaign_cohort_margin
where cohort_start between :start and :end
group by campaign_id;
```

- **Marketing-attributed contribution margin with confidence interval** fileciteturn3file3  
Key decision: method for uncertainty (e.g., bootstrap over attribution weights, or model-based). Must be explicit and auditable.

- **Geographic market penetration index by ZIP** fileciteturn3file3  
Requires external population baseline (unspecified).  
```sql
select
  zip,
  (new_oncology_patients / nullif(zip_population,0)) as penetration_rate,
  (new_oncology_patients / nullif(zip_population,0)) / nullif((total_new_oncology / total_population),0) as penetration_index
from zip_oncology_counts;
```

- **Physician referral relationship score (composite)** fileciteturn3file3  
Must be defined as a transparent composite (volume, conversion, recency, engagement). No definition exists in provided sources, so this is a required design decision.

### Testing, monitoring, and SLAs

**HIPAA/privacy controls**  
- Use HIPAA de-identification approaches (Safe Harbor or Expert Determination) and document the chosen method and risk basis. citeturn0search0turn0search3  
- Enforce “minimum necessary” access via role-based policy controls (Foundry supports cell-level security; Supabase supports Postgres RLS). citeturn14search3turn3search1

**Data validation checks (automated):**
- Schema checks: column existence/types, required fields present
- Completeness: not-null for keys and critical timestamp milestones
- Uniqueness: unique keys at each table grain
- Referential integrity: lead→appointment, referral→encounter, patient→encounter links
- Freshness checks: last-ingested timestamps within SLA per domain

Great Expectations is explicitly designed for expectation-based validation and can generate Data Docs for ongoing reporting. citeturn9search5turn9search6  
dbt-style testing practices emphasize basic checks such as uniqueness and non-nullness for primary keys, supporting regression prevention. citeturn12search8turn12search7

**Operational monitoring and alerting:**
- Pipeline SLAs by data type (minute-level scheduling/ADT; hourly leads; daily finance) as recommended in the context. fileciteturn3file6
- Metric-level anomaly detection using statistical process control (control limits) as a foundation for “when should we alert.” citeturn9search3
- Alert routing: role-based (call center alerts to call center manager; access alerts to scheduling; financial credibility alerts to CFO partner)

**Observability + audit:**
- Immutable audit log for data transformations and agent actions (explicitly required in the schema list). fileciteturn3file13
- “Data trust” badges on every KPI tile (freshness + completeness scores) are explicitly required. fileciteturn3file13

**SLA proposal (aligned to the provided guidance):**
- Scheduling + ADT availability metrics: ≤15 minutes latency target
- Lead/call events: ≤1 hour latency target
- Encounter completion/treatment events: T+1 day with reconciliation option (or T+4 hours where feasible)
- Finance/margin: daily refresh with month-end close reconciliation

These tiers match the source’s explicit tiering guidance. fileciteturn3file6
# Testing, Evaluation, and Agent Suite for the Northside Oncology + Cardio‑Oncology Control Center

## Executive context and what “good” looks like for a skeptical hospital CMO

From your Version 4 “Production Build Ready” master prompt and your supporting context, the dashboard’s purpose is not “marketing reporting,” but a **trusted, role-based control center** that connects demand generation to operational throughput and (eventually) contribution margin, while respecting HIPAA constraints and minimizing PHI exposure. Your prompt explicitly anticipates distrust: last‑click attribution failure, missing margin linkage, no role-based views, HIPAA limitations, dumb alerts without causes, cardio‑onc eligibility→enrollment gaps, and access bottlenecks that quietly kill demand.  

That means testing and evaluation cannot stop at “the page loads.” They must prove four things continuously:

- The numbers are **correct enough to bet a board meeting on** (data quality + KPI integrity).
- The experience is **simple at the top** but can drill down without breaking trust (UX + role controls).
- The system is **governed** (RLS/PHI controls + auditability).
- The “agents” are **safe and self‑improving with a visible ledger** (so a legacy‑systems CMO can trust them slowly, then deeply).

To keep this practical, below are two scripts:
- **Part one:** a **testing script** (smoke + data quality + KPI sanity + permission checks + optional UI smoke).
- **Part two:** an **evaluation script** (trust score trends + SLA compliance + anomaly quality + LLM/agent reliability + an “error ledger” report you can show to leadership).

Both scripts deliberately support:
- **dbt-style tests** (uniqueness, not_null, accepted_values, relationships) because these are the core “analytics checks” dbt emphasizes as foundational. citeturn4search3  
- **Great Expectations** suites/checkpoints because GE treats expectations as “unit tests for data” and operationalizes validation through Checkpoints with human-readable Data Docs. citeturn0search5turn0search3turn3search5turn0search6  
- **Playwright** optional UI smoke because it’s well-suited for end-to-end testing of role switching, filters, and export, and supports trace capture for debugging. citeturn0search4  
- **OpenRouter tool calling + structured outputs** for the “Ask the Dashboard” assistant in a way that is parseable and auditable. citeturn0search2turn5search3turn5search6turn5search0  
- **Safety evaluation aligned to OWASP’s Top 10 for LLM Apps** and broader risk governance aligned to **NIST AI RMF** (trustworthy AI risk management). citeturn2search2turn1search3  

## Part one: Testing script

### What it tests

This single script can run in “modes”:

- **Schema smoke:** required tables exist; required columns exist; column types are compatible (best-effort).
- **Data quality:** key constraints (unique/not-null), accepted values, referential integrity, freshness heuristics.
- **KPI sanity:** KPI queries return values; values are non-negative where expected; optional reconciliation vs `kpi_snapshots`.
- **Access control smoke:** verifies RLS basics by testing that “anonymous” can’t access restricted resources (optional).
- **UI smoke (optional):** calls Playwright to confirm the big promises: role switching works, key pages load, export endpoint returns success, mobile view loads.

### Files it expects

- `control_center_test_config.yml` (you can start with the sample below)
- Environment variables:
  - `DATABASE_URL` (Postgres connection string; Supabase DB URL works)
  - Optional: `SUPABASE_URL`, `SUPABASE_ANON_KEY` (for API-level RLS tests)
  - Optional: `RUN_PLAYWRIGHT=1` (to run UI smoke)
  - Optional: `RUN_DBT=1` (to run dbt tests)
  - Optional: `RUN_GE=1` (to run Great Expectations checkpoints)

### Testing script: `scripts/test_control_center.py`

```python
#!/usr/bin/env python3
"""
Control Center Test Harness (Northside Oncology + Cardio-Oncology)

Runs:
- Schema smoke tests (tables/columns)
- Data quality checks (unique/not null/accepted values/relationships)
- KPI sanity checks (queries return, basic invariants)
- Optional: dbt tests
- Optional: Great Expectations checkpoints
- Optional: Playwright UI smoke

Why these tools:
- Great Expectations treats expectations as data "unit tests" and produces Data Docs.  (GE docs)
- dbt highlights essential checks like uniqueness, non-nullness, accepted values, and relationships. (dbt Labs)
- Playwright can capture traces for debugging UI test failures. (Playwright docs)
"""

from __future__ import annotations

import os
import sys
import json
import time
import yaml
import shlex
import argparse
import subprocess
from dataclasses import dataclass
from typing import Any, Dict, List, Optional, Tuple

import sqlalchemy as sa


@dataclass
class TestResult:
    name: str
    ok: bool
    details: Dict[str, Any]


def _env(name: str, default: Optional[str] = None) -> Optional[str]:
    v = os.getenv(name, default)
    return v if v not in ("", None) else default


def load_config(path: str) -> Dict[str, Any]:
    with open(path, "r", encoding="utf-8") as f:
        return yaml.safe_load(f)


def pg_engine(database_url: str) -> sa.Engine:
    # pool_pre_ping helps when connections go stale in CI
    return sa.create_engine(database_url, pool_pre_ping=True)


def query_one(engine: sa.Engine, sql: str, params: Optional[Dict[str, Any]] = None) -> Any:
    with engine.connect() as conn:
        return conn.execute(sa.text(sql), params or {}).scalar()


def query_all(engine: sa.Engine, sql: str, params: Optional[Dict[str, Any]] = None) -> List[Tuple]:
    with engine.connect() as conn:
        return list(conn.execute(sa.text(sql), params or {}).fetchall())


def schema_tables(engine: sa.Engine, schema: str) -> List[str]:
    rows = query_all(
        engine,
        """
        select table_name
        from information_schema.tables
        where table_schema = :schema
        order by table_name
        """,
        {"schema": schema},
    )
    return [r[0] for r in rows]


def schema_columns(engine: sa.Engine, schema: str, table: str) -> Dict[str, Dict[str, Any]]:
    rows = query_all(
        engine,
        """
        select column_name, data_type, is_nullable
        from information_schema.columns
        where table_schema = :schema and table_name = :table
        order by ordinal_position
        """,
        {"schema": schema, "table": table},
    )
    return {r[0]: {"data_type": r[1], "is_nullable": r[2]} for r in rows}


def run_subprocess(label: str, cmd: str) -> TestResult:
    t0 = time.time()
    try:
        p = subprocess.run(
            shlex.split(cmd),
            capture_output=True,
            text=True,
            check=False,
        )
        ok = (p.returncode == 0)
        return TestResult(
            name=label,
            ok=ok,
            details={
                "cmd": cmd,
                "returncode": p.returncode,
                "stdout": p.stdout[-8000:],  # truncate
                "stderr": p.stderr[-8000:],
                "seconds": round(time.time() - t0, 2),
            },
        )
    except Exception as e:
        return TestResult(name=label, ok=False, details={"cmd": cmd, "error": str(e)})


def test_required_tables(engine: sa.Engine, schema: str, required: List[str]) -> TestResult:
    existing = set(schema_tables(engine, schema))
    missing = [t for t in required if t not in existing]
    return TestResult(
        name="schema.required_tables",
        ok=(len(missing) == 0),
        details={"schema": schema, "missing": missing, "found_count": len(existing)},
    )


def test_required_columns(engine: sa.Engine, schema: str, table_specs: Dict[str, Any]) -> List[TestResult]:
    results: List[TestResult] = []
    for table_name, spec in table_specs.items():
        req_cols: List[str] = spec.get("required_columns", [])
        cols = schema_columns(engine, schema, table_name)
        missing = [c for c in req_cols if c not in cols]
        results.append(
            TestResult(
                name=f"schema.required_columns.{table_name}",
                ok=(len(missing) == 0),
                details={"missing": missing, "existing_columns": sorted(list(cols.keys()))[:50]},
            )
        )
    return results


def test_unique(engine: sa.Engine, schema: str, table: str, column: str, where: Optional[str] = None) -> TestResult:
    where_sql = f"where {where}" if where else ""
    sql = f"""
        select count(*) as dup_count
        from (
            select {column}, count(*) c
            from {schema}.{table}
            {where_sql}
            group by {column}
            having count(*) > 1
        ) d
    """
    dup_count = int(query_one(engine, sql) or 0)
    return TestResult(
        name=f"dq.unique.{table}.{column}",
        ok=(dup_count == 0),
        details={"duplicates_groups": dup_count, "where": where},
    )


def test_not_null(engine: sa.Engine, schema: str, table: str, column: str, where: Optional[str] = None) -> TestResult:
    where_sql = f"and ({where})" if where else ""
    sql = f"""
        select count(*) as null_count
        from {schema}.{table}
        where {column} is null
        {where_sql}
    """
    null_count = int(query_one(engine, sql) or 0)
    return TestResult(
        name=f"dq.not_null.{table}.{column}",
        ok=(null_count == 0),
        details={"null_count": null_count, "where": where},
    )


def test_accepted_values(engine: sa.Engine, schema: str, table: str, column: str, values: List[Any]) -> TestResult:
    # Note: params binding for list is DB-driver specific; easiest is safe literalization here because values are controlled in config.
    safe_vals = ", ".join([sa.literal(v).compile(compile_kwargs={"literal_binds": True}) for v in values])
    sql = f"""
        select count(*) as bad_count
        from {schema}.{table}
        where {column} is not null
          and {column} not in ({safe_vals})
    """
    bad = int(query_one(engine, sql) or 0)
    return TestResult(
        name=f"dq.accepted_values.{table}.{column}",
        ok=(bad == 0),
        details={"bad_count": bad, "accepted_values": values},
    )


def test_relationship(engine: sa.Engine, schema: str, child_table: str, child_key: str, parent_table: str, parent_key: str) -> TestResult:
    # counts child rows whose FK isn't found in parent (excluding null)
    sql = f"""
        select count(*) as orphan_count
        from {schema}.{child_table} c
        left join {schema}.{parent_table} p
          on c.{child_key} = p.{parent_key}
        where c.{child_key} is not null
          and p.{parent_key} is null
    """
    orphan = int(query_one(engine, sql) or 0)
    return TestResult(
        name=f"dq.relationships.{child_table}.{child_key}_to_{parent_table}.{parent_key}",
        ok=(orphan == 0),
        details={"orphan_count": orphan},
    )


def test_kpi_query(engine: sa.Engine, kpi_name: str, sql: str, invariants: Dict[str, Any]) -> TestResult:
    val = query_one(engine, sql)
    ok = True
    problems = []

    if val is None:
        ok = False
        problems.append("kpi_returned_null")

    # Basic invariants: non_negative, min, max
    if val is not None:
        try:
            v = float(val)
            if invariants.get("non_negative") and v < 0:
                ok = False
                problems.append("negative_value")
            if "min" in invariants and v < float(invariants["min"]):
                ok = False
                problems.append("below_min")
            if "max" in invariants and v > float(invariants["max"]):
                ok = False
                problems.append("above_max")
        except Exception:
            # Some KPIs may be composite JSON; keep it simple
            pass

    return TestResult(
        name=f"kpi.{kpi_name}",
        ok=ok,
        details={"value": val, "problems": problems, "invariants": invariants},
    )


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--config", default="control_center_test_config.yml")
    ap.add_argument("--schema", default="public")
    ap.add_argument("--json-out", default="test_results.json")
    args = ap.parse_args()

    cfg = load_config(args.config)

    database_url = _env("DATABASE_URL")
    if not database_url:
        print("ERROR: DATABASE_URL is required", file=sys.stderr)
        return 2

    engine = pg_engine(database_url)

    results: List[TestResult] = []

    # 1) Schema checks
    required_tables = cfg.get("required_tables", [])
    results.append(test_required_tables(engine, args.schema, required_tables))

    table_specs = cfg.get("table_specs", {})
    results.extend(test_required_columns(engine, args.schema, table_specs))

    # 2) DQ checks
    for chk in cfg.get("dq_checks", []):
        t = chk["type"]
        if t == "unique":
            results.append(test_unique(engine, args.schema, chk["table"], chk["column"], chk.get("where")))
        elif t == "not_null":
            results.append(test_not_null(engine, args.schema, chk["table"], chk["column"], chk.get("where")))
        elif t == "accepted_values":
            results.append(test_accepted_values(engine, args.schema, chk["table"], chk["column"], chk["values"]))
        elif t == "relationships":
            results.append(
                test_relationship(engine, args.schema,
                                  chk["child_table"], chk["child_key"],
                                  chk["parent_table"], chk["parent_key"])
            )
        else:
            results.append(TestResult(name=f"dq.unknown.{t}", ok=False, details={"check": chk}))

    # 3) KPI sanity
    for k in cfg.get("kpi_checks", []):
        results.append(test_kpi_query(engine, k["name"], k["sql"], k.get("invariants", {})))

    # 4) Optional dbt tests (dbt emphasizes unique/not_null/accepted_values/relationships as core checks)
    if _env("RUN_DBT") == "1":
        results.append(run_subprocess("dbt.test", cfg.get("dbt_test_cmd", "dbt test")))

    # 5) Optional Great Expectations checkpoint (GE uses checkpoints as primary production validation abstraction)
    if _env("RUN_GE") == "1":
        checkpoint = cfg.get("ge_checkpoint", "default")
        results.append(run_subprocess("great_expectations.checkpoint", f"great_expectations checkpoint run {checkpoint}"))

    # 6) Optional UI smoke
    if _env("RUN_PLAYWRIGHT") == "1":
        results.append(run_subprocess("ui.playwright", cfg.get("playwright_cmd", "npx playwright test")))

    # Summarize
    ok = all(r.ok for r in results)
    out = {
        "ok": ok,
        "results": [r.__dict__ for r in results],
        "ts": int(time.time()),
    }
    with open(args.json_out, "w", encoding="utf-8") as f:
        json.dump(out, f, indent=2)

    print(f"Wrote {args.json_out}. Overall OK={ok}")
    return 0 if ok else 1


if __name__ == "__main__":
    raise SystemExit(main())
```

### Sample config: `control_center_test_config.yml`

This is deliberately minimal; expand as your actual schema solidifies.

```yaml
required_tables:
  - patients
  - encounters
  - appointments
  - referrals
  - leads
  - campaigns
  - campaign_touches
  - channels
  - physicians
  - service_lines
  - campuses
  - kpi_snapshots
  - users
  - roles
  - audit_log

table_specs:
  patients:
    required_columns: [patient_id, enterprise_patient_key, first_seen_date]
  referrals:
    required_columns: [referral_id, patient_id, created_ts]
  appointments:
    required_columns: [appointment_id, patient_id, start_ts, status]
  kpi_snapshots:
    required_columns: [snapshot_id, snapshot_date, kpi_name, kpi_value, freshness_score, completeness_score]

dq_checks:
  - type: not_null
    table: patients
    column: patient_id
  - type: unique
    table: patients
    column: patient_id

  - type: not_null
    table: referrals
    column: referral_id
  - type: unique
    table: referrals
    column: referral_id

  - type: relationships
    child_table: referrals
    child_key: patient_id
    parent_table: patients
    parent_key: patient_id

  - type: accepted_values
    table: appointments
    column: status
    values: ["free", "booked", "cancelled", "completed", "no_show"]

kpi_checks:
  - name: "referrals_created_last_7d"
    sql: |
      select count(*) from public.referrals
      where created_ts >= now() - interval '7 days'
    invariants:
      non_negative: true

  - name: "median_referral_to_consult_days_last_30d"
    sql: |
      select percentile_cont(0.5) within group
             (order by extract(epoch from (completed_ts - created_ts))/86400.0)
      from public.referrals
      where completed_ts is not null
        and created_ts >= now() - interval '30 days'
    invariants:
      non_negative: true
      min: 0
      max: 365

dbt_test_cmd: "dbt test"
ge_checkpoint: "control_center_default"
playwright_cmd: "npx playwright test"
```

## Part two: Evaluation script

### What “evaluation” means here

Testing answers: “Did we break it today?”  
Evaluation answers: “Is this system becoming **more trustworthy** over time—especially with agents and an LLM?”

This evaluation script produces:
- A **Dashboard Trust Report** (JSON + Markdown)
- KPI SLA compliance (freshness, completeness)
- “Anomaly quality” signal (how many alerts were actionable vs noise)
- Agent reliability (success rate, incident rate, mean time to detect/fix, “learning ledger” growth)
- LLM agent safety & usefulness score (structured output compliance, prompt injection resistance, PHI leakage checks)

This approach follows:
- GE’s notion of capturing validation outcomes over time (Data Docs / validation results). citeturn0search6turn3search5  
- dbt’s emphasis on essential DQ checks to protect downstream metric trust. citeturn4search3  
- OWASP LLM Top 10 framing for LLM app vulnerabilities (prompt injection, sensitive data leakage, etc.). citeturn2search2  
- NIST AI RMF’s intent: manage risks to support trustworthy AI usage in organizations. citeturn1search3  

### Evaluation script: `scripts/evaluate_control_center.py`

```python
#!/usr/bin/env python3
"""
Control Center Evaluation Harness

Produces a periodic evaluation report:
- KPI SLA compliance (freshness/completeness)
- Trend volatility and anomaly count
- Agent reliability and incident ledger metrics
- Optional: LLM assistant eval (OpenRouter) on a fixed question set

This script is designed to become the weekly "trust report" that wins over skeptical execs.
"""

from __future__ import annotations

import os
import json
import time
import math
import argparse
from dataclasses import dataclass
from typing import Any, Dict, List, Optional, Tuple

import requests
import sqlalchemy as sa


def _env(name: str, default: Optional[str] = None) -> Optional[str]:
    v = os.getenv(name, default)
    return v if v not in ("", None) else default


def pg_engine(database_url: str) -> sa.Engine:
    return sa.create_engine(database_url, pool_pre_ping=True)


def query_all(engine: sa.Engine, sql: str, params: Optional[Dict[str, Any]] = None) -> List[Tuple]:
    with engine.connect() as conn:
        return list(conn.execute(sa.text(sql), params or {}).fetchall())


def query_one(engine: sa.Engine, sql: str, params: Optional[Dict[str, Any]] = None) -> Any:
    with engine.connect() as conn:
        return conn.execute(sa.text(sql), params or {}).scalar()


def pct(n: float, d: float) -> float:
    return 0.0 if d == 0 else round(100.0 * n / d, 2)


def safe_float(x: Any) -> Optional[float]:
    try:
        return None if x is None else float(x)
    except Exception:
        return None


def compute_kpi_sla(engine: sa.Engine, days: int, freshness_min: float, completeness_min: float) -> Dict[str, Any]:
    rows = query_all(
        engine,
        """
        select
          kpi_name,
          count(*) as n,
          sum(case when freshness_score >= :fresh_ok then 1 else 0 end) as fresh_ok,
          sum(case when completeness_score >= :comp_ok then 1 else 0 end) as comp_ok,
          avg(freshness_score) as avg_fresh,
          avg(completeness_score) as avg_comp
        from public.kpi_snapshots
        where snapshot_date >= current_date - :days
        group by kpi_name
        order by kpi_name
        """,
        {"days": days, "fresh_ok": freshness_min, "comp_ok": completeness_min},
    )

    out = []
    for kpi, n, fresh_ok, comp_ok, avg_fresh, avg_comp in rows:
        out.append({
            "kpi_name": kpi,
            "n": int(n),
            "fresh_ok_pct": pct(float(fresh_ok or 0), float(n)),
            "comp_ok_pct": pct(float(comp_ok or 0), float(n)),
            "avg_freshness": round(float(avg_fresh or 0), 3),
            "avg_completeness": round(float(avg_comp or 0), 3),
        })
    return {"window_days": days, "freshness_min": freshness_min, "completeness_min": completeness_min, "kpis": out}


def compute_volatility(engine: sa.Engine, days: int) -> Dict[str, Any]:
    # Basic day-over-day volatility proxy for each KPI
    rows = query_all(
        engine,
        """
        with t as (
          select
            kpi_name,
            snapshot_date,
            kpi_value,
            lag(kpi_value) over (partition by kpi_name order by snapshot_date) as prev_value
          from public.kpi_snapshots
          where snapshot_date >= current_date - :days
        )
        select
          kpi_name,
          count(*) filter (where prev_value is not null) as n_changes,
          avg(abs((kpi_value - prev_value) / nullif(prev_value,0))) as avg_rel_change
        from t
        group by kpi_name
        order by kpi_name
        """,
        {"days": days},
    )
    out = []
    for kpi, n_changes, avg_rel_change in rows:
        out.append({
            "kpi_name": kpi,
            "n_changes": int(n_changes or 0),
            "avg_rel_change": None if avg_rel_change is None else round(float(avg_rel_change), 4),
        })
    return {"window_days": days, "volatility": out}


def compute_agent_reliability(engine: sa.Engine, days: int) -> Dict[str, Any]:
    """
    Expects tables (recommended to add if not present):
      agent_runs(agent_name, started_at, finished_at, status, error_code)
      agent_incidents(agent_name, incident_ts, severity, status, root_cause, fix_applied, reviewed_by)
    If missing, returns 'unavailable' without failing the whole report.
    """
    try:
        run_rows = query_all(
            engine,
            """
            select
              agent_name,
              count(*) as n,
              sum(case when status='success' then 1 else 0 end) as ok,
              sum(case when status='error' then 1 else 0 end) as err
            from public.agent_runs
            where started_at >= now() - (:days || ' days')::interval
            group by agent_name
            order by agent_name
            """,
            {"days": days},
        )
        inc_rows = query_all(
            engine,
            """
            select
              agent_name,
              count(*) as incidents,
              sum(case when status='open' then 1 else 0 end) as open_incidents
            from public.agent_incidents
            where incident_ts >= now() - (:days || ' days')::interval
            group by agent_name
            order by agent_name
            """,
            {"days": days},
        )
    except Exception as e:
        return {"window_days": days, "status": "unavailable", "reason": str(e)}

    inc_map = {r[0]: {"incidents": int(r[1]), "open_incidents": int(r[2] or 0)} for r in inc_rows}
    out = []
    for agent_name, n, ok, err in run_rows:
        a = str(agent_name)
        out.append({
            "agent_name": a,
            "runs": int(n),
            "success_pct": pct(float(ok or 0), float(n)),
            "error_pct": pct(float(err or 0), float(n)),
            **inc_map.get(a, {"incidents": 0, "open_incidents": 0}),
        })
    return {"window_days": days, "status": "ok", "agents": out}


def openrouter_chat(api_key: str, model: str, messages: List[Dict[str, str]], response_format: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
    """
    OpenRouter's chat completions endpoint is compatible with OpenAI-style messages,
    and supports structured outputs via response_format for compatible models.
    """
    url = "https://openrouter.ai/api/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
        # Optional attribution headers per OpenRouter docs:
        "HTTP-Referer": _env("APP_URL", "http://localhost"),
        "X-OpenRouter-Title": _env("APP_NAME", "Northside Control Center"),
    }
    payload: Dict[str, Any] = {"model": model, "messages": messages}
    if response_format is not None:
        payload["response_format"] = response_format

    r = requests.post(url, headers=headers, json=payload, timeout=60)
    r.raise_for_status()
    return r.json()


def evaluate_llm_assistant(engine: sa.Engine, days: int, eval_cases_path: str) -> Dict[str, Any]:
    """
    Runs a small offline evaluation against a fixed question set.
    Uses OpenRouter structured outputs when available to reduce parsing errors/hallucinated fields.
    """
    api_key = _env("OPENROUTER_API_KEY")
    if not api_key:
        return {"status": "skipped", "reason": "OPENROUTER_API_KEY not set"}

    # Model selection is intentionally externalized. See the model-selection helper in the next section.
    model = _env("OPENROUTER_MODEL", "openai/gpt-4")

    with open(eval_cases_path, "r", encoding="utf-8") as f:
        cases = json.load(f)

    # JSON schema we require from the assistant:
    schema = {
        "type": "object",
        "properties": {
            "route_to_page": {"type": "string"},
            "filters": {"type": "object"},
            "sql": {"type": "string"},
            "answer_summary": {"type": "string"},
            "safe_output": {"type": "boolean"},
            "notes": {"type": "string"},
        },
        "required": ["route_to_page", "filters", "sql", "answer_summary", "safe_output"],
        "additionalProperties": False,
    }

    response_format = {
        "type": "json_schema",
        "json_schema": {
            "name": "dashboard_query_plan",
            "schema": schema,
            "strict": True,
        }
    }

    results = []
    for c in cases:
        q = c["question"]
        expected_min = c.get("expected_min")
        expected_max = c.get("expected_max")

        messages = [
            {"role": "system", "content": "You are the Northside Control Center assistant. Never output PHI. Prefer aggregates. Provide a page route + filters + SQL."},
            {"role": "user", "content": q},
        ]

        try:
            resp = openrouter_chat(api_key, model, messages, response_format=response_format)
            content = resp["choices"][0]["message"]["content"]
            plan = json.loads(content)
        except Exception as e:
            results.append({"question": q, "ok": False, "error": str(e)})
            continue

        # Execute SQL (read-only) — your DB role should enforce least privilege.
        sql = plan["sql"]
        try:
            val = query_one(engine, sql)
        except Exception as e:
            results.append({"question": q, "ok": False, "error": f"sql_failed: {e}", "sql": sql})
            continue

        v = safe_float(val)
        ok = True
        if plan.get("safe_output") is not True:
            ok = False
        if v is not None and expected_min is not None and v < float(expected_min):
            ok = False
        if v is not None and expected_max is not None and v > float(expected_max):
            ok = False

        results.append({
            "question": q,
            "ok": ok,
            "plan": plan,
            "value": val,
            "model": model,
        })

    passed = sum(1 for r in results if r.get("ok"))
    return {"status": "ok", "model": model, "cases": len(results), "passed": passed, "pass_rate": pct(passed, len(results)), "results": results}


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--days", type=int, default=30)
    ap.add_argument("--freshness-min", type=float, default=0.85)
    ap.add_argument("--completeness-min", type=float, default=0.90)
    ap.add_argument("--llm-eval-cases", default="llm_eval_cases.json")
    ap.add_argument("--out-json", default="evaluation_report.json")
    ap.add_argument("--out-md", default="evaluation_report.md")
    args = ap.parse_args()

    database_url = _env("DATABASE_URL")
    if not database_url:
        print("ERROR: DATABASE_URL is required", file=sys.stderr)
        return 2

    engine = pg_engine(database_url)

    report: Dict[str, Any] = {
        "generated_ts": int(time.time()),
        "window_days": args.days,
        "kpi_sla": compute_kpi_sla(engine, args.days, args.freshness_min, args.completeness_min),
        "kpi_volatility": compute_volatility(engine, args.days),
        "agent_reliability": compute_agent_reliability(engine, args.days),
        "llm_eval": evaluate_llm_assistant(engine, args.days, args.llm_eval_cases),
    }

    with open(args.out_json, "w", encoding="utf-8") as f:
        json.dump(report, f, indent=2)

    # Minimal Markdown rendering (keep it board-readable)
    lines = []
    lines.append(f"# Control Center Trust Report (last {args.days} days)")
    lines.append("")
    lines.append("## KPI SLA summary")
    lines.append(f"- Freshness minimum: {args.freshness_min}")
    lines.append(f"- Completeness minimum: {args.completeness_min}")
    lines.append("")
    for k in report["kpi_sla"]["kpis"][:30]:
        lines.append(f"- {k['kpi_name']}: fresh_ok={k['fresh_ok_pct']}% comp_ok={k['comp_ok_pct']}%")

    lines.append("")
    lines.append("## Agent reliability (if enabled)")
    ar = report["agent_reliability"]
    lines.append(f"- Status: {ar.get('status')}")
    if ar.get("status") == "ok":
        for a in ar["agents"]:
            lines.append(f"- {a['agent_name']}: success={a['success_pct']}% incidents={a['incidents']} open={a['open_incidents']}")

    lines.append("")
    lines.append("## LLM assistant evaluation")
    le = report["llm_eval"]
    lines.append(f"- Status: {le.get('status')}")
    if le.get("status") == "ok":
        lines.append(f"- Model: {le.get('model')} pass_rate={le.get('pass_rate')}% ({le.get('passed')}/{le.get('cases')})")
    else:
        lines.append(f"- Reason: {le.get('reason')}")

    with open(args.out_md, "w", encoding="utf-8") as f:
        f.write("\n".join(lines))

    print(f"Wrote {args.out_json} and {args.out_md}")
    return 0


if __name__ == "__main__":
    import sys
    raise SystemExit(main())
```

### Sample LLM eval cases: `llm_eval_cases.json`

Keep this small at first, then grow it as your “error ledger” grows.

```json
[
  {
    "question": "How many referrals were created in the last 7 days for oncology?",
    "expected_min": 0,
    "expected_max": 100000
  },
  {
    "question": "What is the median days from referral creation to referral completion in the last 30 days?",
    "expected_min": 0,
    "expected_max": 365
  },
  {
    "question": "Show net-new oncology patients month-to-date by tumor site (aggregate only)."
  }
]
```

## LLM dashboard assistant using OpenRouter

### Why OpenRouter and how to do it safely

OpenRouter’s API is OpenAI-style and supports `/api/v1/chat/completions`, tool calling, and structured output enforcement via JSON Schema when the model supports it. citeturn0search2turn5search3turn5search6  
OpenRouter also supports listing models via `/api/v1/models`, which you can use to automatically select models that support the parameters you need (e.g., `tools`, `response_format`). citeturn5search0

### Key handling (your 1Password OpenRouter key)

I can’t access your 1Password vault directly. Operationally, the safest practice is:
- Retrieve the OpenRouter key from 1Password on your machine.
- Export it into your runtime as an environment variable **without pasting it into chat**:
  - `export OPENROUTER_API_KEY="..."`

### Model selection helper (auto-pick a tool-capable model)

This script queries `/api/v1/models` and selects a model that supports tool calling and structured outputs when possible.

```python
# scripts/select_openrouter_model.py
import os, requests

def pick_model(prefer_low_cost=True):
    api_key = os.environ["OPENROUTER_API_KEY"]
    r = requests.get(
        "https://openrouter.ai/api/v1/models",
        headers={"Authorization": f"Bearer {api_key}"}
    )
    r.raise_for_status()
    models = r.json()["data"]

    # Prefer models that advertise support for tools and response_format (structured outputs).
    candidates = []
    for m in models:
        sp = set((m.get("top_provider") or {}).get("supported_parameters", []) or [])
        # OpenRouter docs note supported_parameters may be union across providers; still a useful filter. citeturn5search1
        has_tools = ("tools" in sp)
        has_structured = ("response_format" in sp) or ("response_format" in (m.get("supported_parameters") or []))
        if has_tools:
            candidates.append((has_structured, m))

    if not candidates:
        return "openai/gpt-4"  # conservative fallback example from OpenRouter docs. citeturn0search2

    # Rank: structured outputs first, then context length, then (optionally) cost.
    def score(item):
        has_structured, m = item
        ctx = float((m.get("top_provider") or {}).get("context_length", 0) or 0)
        price_prompt = float(((m.get("pricing") or {}).get("prompt")) or 0.0)
        price_completion = float(((m.get("pricing") or {}).get("completion")) or 0.0)
        price = price_prompt + price_completion
        return (1 if has_structured else 0, ctx, -price if prefer_low_cost else 0)

    best = sorted(candidates, key=score, reverse=True)[0][1]
    return best["id"]

if __name__ == "__main__":
    print(pick_model())
```

### How the LLM assistant behaves (CMO-simple, drilldown-deep)

The assistant should never dump a wall of text. It should return:

- A **single sentence answer** (“Up 12% MTD; biggest driver is Breast at Cumming campus.”)
- A **button-like route** (“Open: Oncology → Funnel → Tumor Site: Breast → Campus: Cumming → Date: MTD”)
- Optional **one chart suggestion** (“Show waterfall funnel + driver table.”)
- A link to the **Data Trust** explanation for that number

Structured outputs help enforce this kind of deterministic interface. citeturn5search6

## Five high-value agents a CMO/CTO/CEO would trust, plus the monitoring stack

### The five “front-facing” agents

Each agent is deliberately narrow (so it is auditable) but impactful (so it feels like executive leverage).

| Agent | Primary user | What it does in plain language | What it touches across the stack |
|---|---|---|---|
| CMO Concierge (LLM “Ask the Control Center”) | CMO/CEO | Answers natural-language questions using **only approved aggregates**, routes you to the exact page/filter state, and shows the data-trust basis. Uses tool calling + structured outputs for reliability. citeturn5search3turn5search6 | Dashboard UI + read-only SQL views + KPI dictionary |
| Access Bottleneck Sentinel | COO/Access leader/CMO | Watches next-available appt, referral→consult time, call center abandon/hold; explains drops with likely causes; recommends operational actions (capacity shifts, routing, callback rules). | Scheduling feeds (FHIR/HL7), call center metrics, appointments |
| Referral Leakage Investigator | Service line leaders + physician liaisons | Finds where referrals leak (created→contacted→scheduled→completed→leaked) and which physicians/practices are most affected; produces “win-back” lists + scripts. Uses referral objects consistent with FHIR ServiceRequest patterns where relevant. citeturn1search0 | Referrals, provider directory, liaison activity log |
| Cardio‑Oncology Gap Closer | Cardio-onc program manager | Tracks eligibility→screening→enrollment→adherence; flags where the program is losing high‑risk patients; suggests specific operational workflow fixes. | EHR flags (FHIR), program registry, scheduling |
| Margin & Evidence Auditor | CFO partner + CMO | Produces board-ready “evidence packs” for ROI: cohort definitions, attribution method used, confidence signals, and reconciliation notes. Anchors credibility. | Finance (SAP extracts), cohort logic, attribution model outputs |

### The “stacked safety agents” that make the above trustworthy

To make a legacy-systems CMO trust agents, you need visible guardrails. These are backstage agents that monitor the five value agents.

| Monitoring agent | What it monitors | What it logs (for your “error ledger”) |
|---|---|---|
| PHI Gatekeeper | Scans outputs for disallowed identifiers/fields; blocks unsafe drilldowns | blocked_output_count, PHI_pattern_hits, role_violation_events |
| Evidence & Lineage Agent | Requires agents to attach SQL lineage / dataset timestamps / trust scores | missing_lineage_events, stale_data_events |
| Prompt Injection Firewall | Tests for OWASP-style injection patterns and tool-abuse attempts | injection_attempts, bypass_attempts, tool_misuse_events citeturn2search2 |
| Regression & Drift Monitor | Detects if KPI outputs drift due to data changes or model changes | drift_alerts, false_positive_rate, new_test_cases_added |
| Human Approval Gate (for actions) | Forces approvals for actions that change workflow (e.g., outreach lists) | approvals, rejections, rationale, reviewer |

This aligns with the spirit of NIST AI RMF: operational risk management to increase trustworthiness of AI systems. citeturn1search3

### Mermaid: agent stack visualization

```mermaid
flowchart TB
  subgraph UI["Dashboard UI"]
    A1["Ask the Control Center\n(LLM Concierge)"]
    A2["Agent Trust Drawer\n(quiet icon + drilldown)"]
  end

  subgraph ValueAgents["Front-facing Value Agents"]
    B1["Access Bottleneck Sentinel"]
    B2["Referral Leakage Investigator"]
    B3["Cardio-Onc Gap Closer"]
    B4["Margin & Evidence Auditor"]
  end

  subgraph SafetyStack["Stacked Safety + Monitoring Agents"]
    S1["PHI Gatekeeper"]
    S2["Evidence & Lineage Agent"]
    S3["Prompt Injection Firewall"]
    S4["Regression & Drift Monitor"]
    S5["Human Approval Gate\n(for actions)"]
  end

  subgraph Data["Data + Platforms"]
    D1["Supabase/Postgres\n(kpi_snapshots, audit_log, agent ledger)"]
    D2["Foundry / governed datasets"]
    D3["EHR feeds (FHIR/HL7)\nReferrals/Appts/Encounters"]
    D4["Finance (SAP)\nContribution margin inputs"]
  end

  A1 -->|tool calls| D1
  B1 --> D1
  B2 --> D1
  B3 --> D1
  B4 --> D1
  D2 --> D1
  D3 --> D2
  D4 --> D2

  B1 --> S1
  B2 --> S1
  B3 --> S1
  B4 --> S1

  S1 --> D1
  S2 --> D1
  S3 --> D1
  S4 --> D1
  S5 --> D1

  A2 --> D1
  A2 --> SafetyStack
```

## Where this shows up on the dashboard without being “in your face”

A 30-year CMO wants simplicity first. So the agent system should not dominate the UI.

Recommended placement:

- **A small “shield” icon** next to the existing **Data Trust** badge (top right).
- Clicking it opens an **Agent Trust Drawer** (side panel). The drawer has:
  - “Are agents healthy?” (green/yellow/red)
  - “Incidents last 7 days” and “Open incidents”
  - “New guardrails added this week” (proof of learning)
  - Drilldown: per-agent run log, blocked unsafe outputs, approvals, evidence packs

This mirrors what Foundry makes possible at the data platform level via granular object/property security policies (row/column/cell controls), and what Supabase encourages at the app DB layer via Postgres RLS defense-in-depth—useful because your system spans both governance planes. citeturn3search0turn2search1

## Web research sources used

OpenRouter API capabilities (chat completions endpoint, model listing, tool calling, structured outputs): citeturn0search2turn5search0turn5search3turn5search6  
Great Expectations concepts (expectation suites, checkpoints, data docs): citeturn0search3turn3search5turn0search6turn0search5  
Playwright tracing (debugging failed UI tests): citeturn0search4  
dbt’s recommended “essential” data quality checks (unique, not_null, accepted_values, relationships): citeturn4search3  
OWASP Top 10 for LLM Applications (security lens for LLM + agents): citeturn2search2  
NIST AI RMF 1.0 (trustworthy AI risk management framing): citeturn1search3  
FHIR ServiceRequest (referral-related modeling basis): citeturn1search0
