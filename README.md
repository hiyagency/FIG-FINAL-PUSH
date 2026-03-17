# Lead.ai

Lead.ai is a production-oriented MVP for AI-assisted B2B lead discovery and prospecting. Users describe their ideal customer profile in natural language, review the parsed intent, and launch a compliant discovery pipeline that searches lawful public business sources, audits company websites, scores lead quality, and exports ranked results.

## Product scope

- Public-business-source lead discovery only
- AI prompt parsing with strict JSON output and deterministic fallback
- Modular connector layer for approved APIs and public websites
- Website audit heuristics for SEO, mobile UX, CTA, schema, and funnel signals
- Public business contact extraction only
- Dedupe, scoring, ranking, campaign/list saving, and CSV/XLSX export
- Authenticated dashboard, search workbench, results, lead detail, campaigns, and settings

## Stack

- Next.js 16 App Router
- TypeScript, Tailwind CSS, React Query, Zustand, Framer Motion-ready UI layer
- Prisma + PostgreSQL
- BullMQ + Redis for async search/export jobs
- NextAuth database sessions + credentials + custom email OTP auth
- OpenAI SDK for optional prompt parsing and outreach enrichment

## Main routes

- `/` landing page
- `/auth/login`
- `/auth/register`
- `/app` dashboard
- `/app/search` new search workbench
- `/app/searches/[searchId]` results and progress
- `/app/leads/[leadId]` lead detail
- `/app/campaigns`
- `/app/settings`

## Folder structure

```text
app/
  (auth)/
  (protected)/app/
  api/
components/
  lead-ai/
  ui/
lib/
  connectors/
  auth.ts
  db.ts
  env.ts
  queues.ts
modules/
  ai/
  lead-ai/
prisma/
  schema.prisma
  seed.ts
worker/
  index.ts
  processors/
```

## Core data model

The Prisma schema includes:

- `User`, `Account`, `Session`, `VerificationToken`, `PasswordCredential`
- `Search`, `ParsedQuery`, `SearchJob`
- `Lead`, `LeadSource`, `LeadScore`, `SearchLead`
- `Campaign`, `CampaignLead`
- `LeadList`, `LeadListLead`
- `Export`
- `LeadSettings`
- `AuditLog` (reused for compliance and traceability)

## Environment

Copy the template and fill in the values you need:

```powershell
Copy-Item .env.example .env.local
```

Important variables:

- `DATABASE_URL`
- `REDIS_URL`
- `NEXTAUTH_SECRET`
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_SECURE`
- `SMTP_USER`
- `SMTP_PASS`
- `SMTP_FROM`
- `OPENAI_API_KEY`
- `OPENAI_MODEL`
- `GOOGLE_MAPS_API_KEY`
- `SEARCH_API_PROVIDER`
- `SEARCH_API_KEY`
- `LEAD_AI_ENABLE_MOCK_DATA`
- `LEAD_AI_DISABLE_QUEUE`

## Local setup

1. Install dependencies.

   ```bash
   npm install
   ```

2. Generate Prisma client.

   ```bash
   npm run prisma:generate
   ```

3. Push schema to the database.

   ```bash
   npm run db:push
   ```

4. Seed the demo user and optional mock dataset.

   ```bash
   npm run prisma:seed
   ```

5. Start the app.

   ```bash
   npm run dev
   ```

6. Optional: run the worker in a second terminal if Redis-backed queues are enabled.

   ```bash
   npm run worker:dev
   ```

7. Configure email OTP delivery.

   - Local dev: point SMTP to Mailpit or another local SMTP inbox.
   - Low-volume production: Brevo SMTP works well on the free tier.
   - The app uses the standard Nodemailer SMTP variables from `.env.example`, so you can swap providers without changing code.

   Example Brevo configuration:

   ```env
   SMTP_HOST=smtp-relay.brevo.com
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=YOUR_BREVO_LOGIN
   SMTP_PASS=YOUR_BREVO_SMTP_KEY
   SMTP_FROM=Lead.ai <no-reply@yourdomain.com>
   ```

## Demo login

- Email: `founder@lead.ai`
- Password: `LeadAiDemoPassword123!`

These are controlled by `LEAD_AI_DEFAULT_USER_EMAIL` and `LEAD_AI_DEFAULT_USER_PASSWORD`.

## Search pipeline

1. Prompt parsing
2. Connector fan-out
3. Public website enrichment
4. Contact extraction
5. Dedupe and normalization
6. Scoring and ranking
7. AI outreach insight generation
8. Export and campaign/list actions

## Connector architecture

Lead.ai ships with a typed connector abstraction:

- `lib/connectors/base.ts`
- `lib/connectors/searchApi.ts`
- `lib/connectors/directoryA.ts`
- `lib/connectors/publicWeb.ts`
- `lib/connectors/companyWebsite.ts`

The production path uses approved APIs and public websites only. If connector credentials are not configured, the app can fall back to explicit mock mode for development.

## Commands

```bash
npm run dev
npm run worker:dev
npm run prisma:generate
npm run db:push
npm run prisma:seed
npm run lint
npm run typecheck
npm run test
npm run build
```

## Verification

The current repo passes:

- `npm run lint`
- `npm run typecheck`
- `npm run test`
- `npm run build`

## Compliance notes

- Only public business information or user-imported data should be collected
- No scraping behind logins, CAPTCHAs, or restricted flows
- No personal phone numbers or personal emails
- Every exported lead should remain source-backed and confidence-scored
