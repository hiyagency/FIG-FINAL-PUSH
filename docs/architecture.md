# REEL.ai Architecture

## High-level shape

REEL.ai is implemented as a modular monolith. The currently active operating mode is local-first and single-user, with no sign-in requirement.

- `app/`
  Next.js routes, layouts, API handlers, and page-level server actions.
- `components/`
  Reusable design system primitives and screen-level UI building blocks.
- `lib/`
  Cross-cutting runtime services: env validation, Prisma, auth, logging, Redis, storage, queues, encryption.
- `modules/`
  Domain slices with schemas and services: auth, workspaces, brands, uploads, diagnosis, editing, captions, publishing, analytics, engagement, billing, notifications, templates, approvals.
- `worker/`
  BullMQ workers and processors for heavy workflows.
- `prisma/`
  Schema, SQL migration, and seed data.
- `tests/`
  Unit, integration, worker, and smoke scaffolding.

## Core domains

### Local studio mode

- The app boots directly into one private workspace: `private-studio`
- Local state is persisted to `.reel-ai/state.json`
- Uploaded files are stored in `uploads/private-studio`
- Account creation, sign-in, and onboarding routes are redirected away from the active workflow
- Auth and multi-tenant modules remain scaffolded for future reactivation if needed

### Brands + Brand DNA

- In local mode, Brand DNA is managed as a singleton profile for the private studio.
- `BrandDnaProfile` stores generation defaults:
  caption style, hook style, pacing, subtitle preferences, font/color guidance, banned/preferred words, CTA tone, approval rules, compliance notes, and posting languages.

### Assets + Media Processing

- The active local flow persists uploads through a file-backed studio store.
- Prisma-backed asset/media models remain in the codebase for the broader production architecture.
- FFmpeg wrappers support:
  - media probing
  - proxy generation
  - thumbnail extraction
  - waveform generation
- Queue-backed ingestion is designed to extend into transcription, silence detection, beat sync, and audio cleanup.

### Projects + Variants + Editing

- `Project` represents a reel generation workflow.
- `ProjectVersion` stores non-destructive edit state:
  EDL, subtitle track, overlay track, audio track, cover frame, template version.
- `EditOperation` stores structured mutation history.
- `GeneratedVariant` stores render outcomes and strategy metadata.

### AI planners

Each planner is isolated and schema-validated:

- diagnosis planner
- prompt-to-edit planner
- caption/discovery generator
- originality evaluator
- engagement classifier

All planners:

- validate output with Zod
- use OpenAI only behind an abstraction
- fall back to deterministic heuristics when credentials are missing

### Publishing

- External publishing is scaffolded but not forced in local-private mode.
- The UI stays honest: publishing surfaces remain empty until real media processing and account connectivity are configured.

### Analytics + Growth Memory

- `AnalyticsSnapshot` stores periodic performance data.
- `GrowthMemory` stores best-performing hooks, caption tone, CTA family, post windows, and style guidance for future planning.

### Engagement + Approvals

- `EngagementThread`, `CommentEvent`, and `DmEvent` support moderation and lead intent workflows.
- `ApprovalRequest` and `ApprovalComment` support client review links, comments, and approval locking.

### Billing + Notifications + Admin

- These modules remain scaffolded, but the active local-private workflow hides multi-tenant admin and subscription requirements.

## Queue topology

- `media-ingestion`
- `content-diagnosis`
- `generation-planning`
- `rendering`
- `caption-discovery`
- `publishing`
- `analytics-sync`
- `engagement-sync`
- `notifications`

Workers are registered in [`worker/index.ts`](/Users/Abhigyan'Workstation/Documents/Playground/worker/index.ts).

## Storage + infra

- PostgreSQL for transactional data
- Redis for queues and caching primitives
- S3-compatible storage for media and generated derivatives
- Mailpit/SMTP for local auth and notification emails
- Optional OpenAI, Stripe, Google OAuth, Instagram Graph API credentials

## Security posture

- strict env parsing
- hashed passwords
- encrypted social tokens
- signed upload URLs
- RBAC checks at the service layer
- audit logs
- webhook signature verification
- safe fallback behavior for missing third-party capabilities

## Deployment model

- Web process: `npm run start`
- Worker process: `npm run worker`
- Shared services: Postgres, Redis, object storage, SMTP
- Recommended observability: Sentry + structured log shipping + health probes
