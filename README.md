# Financial Investment Group Website

Premium, mobile-first marketing website for Financial Investment Group (FIG), built with Next.js App Router, TypeScript, Tailwind CSS, Framer Motion, React Hook Form, Zod, and Google Sheets lead capture through a Google Apps Script endpoint.

## Stack

- Next.js 16 App Router
- TypeScript
- Tailwind CSS
- Framer Motion for subtle section reveals
- React Hook Form + Zod validation
- Google Apps Script lead capture proxy
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

## Google Sheets lead capture setup

The contact form posts to the local Next.js API route at `/api/enquiries`, and that route forwards the exact required JSON payload to the client-provided Google Apps Script endpoint.

This proxy is intentional: the live Apps Script endpoint currently responds to browser-style preflight `OPTIONS` requests with `405 Method Not Allowed`, so sending `application/json` to it directly from the browser would be unreliable. Routing the request through Next.js keeps the production form stable while preserving the exact payload keys required by the sheet workflow.

Required payload sent upstream:

```json
{
  "full_name": "string",
  "phone_number": "string",
  "email_address": "string",
  "investment_amount": "string",
  "message": "string",
  "page_url": "https://example.com/current-page"
}
```

The live Google Apps Script endpoint is configured in code from the business data layer and does not require secret credentials in this project.

## Project structure

```text
app/
  api/enquiries/route.ts     # Proxy to the Google Apps Script lead endpoint
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
  enquiry-payload.ts
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
