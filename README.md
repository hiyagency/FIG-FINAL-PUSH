# Financial Investment Group Website

Premium, mobile-first marketing website for Financial Investment Group (FIG), built with Next.js App Router, TypeScript, Tailwind CSS, Framer Motion, React Hook Form, Zod, and Google Sheets lead capture.

## Stack

- Next.js 16 App Router
- TypeScript
- Tailwind CSS
- Framer Motion for subtle section reveals
- React Hook Form + Zod validation
- Google Sheets API via service account
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

1. Create a Google Cloud project.
2. Enable the Google Sheets API for that project.
3. Create a service account and generate a JSON key.
4. Add the following values to `.env.local` or your Vercel environment settings:

   - `GOOGLE_PROJECT_ID`
   - `GOOGLE_CLIENT_EMAIL`
   - `GOOGLE_PRIVATE_KEY`
   - `GOOGLE_SHEET_ID`
   - `GOOGLE_SHEET_NAME`
   - `NEXT_PUBLIC_SITE_URL`

5. Create a Google Sheet and share it with the service account email from `GOOGLE_CLIENT_EMAIL`.
6. Create a sheet tab named `Leads` or set `GOOGLE_SHEET_NAME` to the tab you want to use.
7. Add this header row to the sheet:

   ```text
   Timestamp | Full Name | Phone Number | Email Address | Investment Amount | Message | Source Page / Website | User Agent
   ```

### Private key formatting

If you paste the private key into an environment variable, keep the `\n` newline escapes exactly as shown in `.env.example`. The backend converts them to real line breaks before authenticating.

## Project structure

```text
app/
  api/enquiries/route.ts     # Lead submission endpoint
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
  google-sheets.ts
  site-data.ts
public/fig/
  brand/
  gallery/
  documents/
```

## Deployment notes

- The project is ready for Vercel with the included `vercel.json`.
- Set the same environment variables in the Vercel dashboard before deploying.
- After deployment, update `NEXT_PUBLIC_SITE_URL` to the final production domain so canonical tags, sitemap, and schema use the correct URL.
