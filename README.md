# Financial Investment Group Website

Premium, mobile-first marketing website for Financial Investment Group (FIG), built with Next.js App Router, TypeScript, Tailwind CSS, Framer Motion, React Hook Form, Zod, and Formspree lead capture.

## Stack

- Next.js 16 App Router
- TypeScript
- Tailwind CSS
- Framer Motion for subtle section reveals
- React Hook Form + Zod validation
- Formspree direct lead capture
- Vercel-ready deployment

## Local development

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a local environment file:

   ```bash
   cp .env.example .env.local
   ```

   On Windows PowerShell:

   ```powershell
   Copy-Item .env.example .env.local
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Build for production:

   ```bash
   npm run build
   npm run start
   ```

## Enquiry delivery setup

The contact form submits directly to Formspree using the configured endpoint:

`https://formspree.io/f/mdawloak`

Submitted payload shape:

```json
{
  "name": "string",
  "phone": "string",
  "email": "string",
  "investmentAmount": "string",
  "message": "string",
  "pageUrl": "https://example.com/contact"
}
```

The live form keeps the same UI and client-side validation while posting directly to Formspree with JSON.

## Project structure

```text
app/
  layout.tsx                 # Global metadata and fonts
  page.tsx                   # Single-page FIG experience
  opengraph-image.tsx        # Social preview image
  sitemap.ts                 # Sitemap route
  robots.ts                  # Robots route
components/
  contact-form.tsx
  mobile-action-bar.tsx
  reveal.tsx
  section-heading.tsx
  site-footer.tsx
  site-header.tsx
lib/
  contact-form-schema.ts
  fig-utils.ts
  site-data.ts
public/fig/
  brand/
  gallery/
  documents/
```

## Deployment notes

- The project is ready for Vercel with the included `vercel.json`.
- Set `NEXT_PUBLIC_SITE_URL` in the Vercel dashboard before deploying.
- After deployment, update `NEXT_PUBLIC_SITE_URL` to the final production domain so canonical tags, sitemap, and schema use the correct URL.

## GitHub-first workflow

This repository is intended to be the source of truth for the FIG website.

1. Make code changes in a branch or directly on the production branch.
2. Push the changes to GitHub.
3. Let Vercel build and deploy from the connected GitHub repository, or trigger a Vercel deployment from the dashboard if needed.
4. Verify the production site on `https://figburhar.co.in`.

The current production branch is `master`.

## Cloud-only readiness notes

- All production source files required by the live FIG website are tracked in Git and can be cloned from GitHub.
- Local files such as `.env`, `.env.local`, `.next`, `node_modules`, local database files, and editor/tooling folders are intentionally excluded from Git.
- The site has no runtime dependency on Supabase or Google Apps Script.
- The live form submits directly to Formspree, so no custom backend form service is required for the current production site.

## Fresh clone verification

This repo was verified by cloning it into a fresh temporary directory, copying `.env.example` to `.env.local`, installing dependencies with `npm ci`, and running:

```bash
npm run build
```

The clean clone built successfully without relying on hidden local source files.
