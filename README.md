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
