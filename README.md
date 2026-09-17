# Nettle Website

Marketing website for **Nettle** — the AI workspace for loss control.

The site is implemented from an approved Figma design into Next.js, with a strong focus on visual fidelity, a shared design foundation, and structural grid alignment.

## Tech stack

- [Next.js 16](https://nextjs.org) (App Router, Turbopack)
- React 19 and TypeScript (strict)
- Tailwind CSS v4 (CSS-first configuration in `src/app/globals.css`)
- ESLint 9
- pnpm 11 and Node.js 24

## Getting started

Requirements: Node.js 24 (see `.nvmrc`) and pnpm 11 (pinned via `packageManager`; enable with `corepack enable`).

```bash
pnpm install     # install dependencies
pnpm dev         # start the dev server at http://localhost:3000
pnpm lint        # run ESLint
pnpm typecheck   # generate route types and run tsc
pnpm build       # production build
pnpm start       # serve the production build
```

## Project structure

```
src/
  app/
    layout.tsx          root layout and font loading
    globals.css         design tokens, typography utilities, grid tokens
    page.tsx            homepage
    homepage/           internal homepage preview with a grid-overlay toggle
    design-system/      internal design foundation docs (color, typography, grid, review)
  components/
    layout/             grid primitives (Container, Grid, GridBand, overlays) and site header
    ui/                 small reusable UI (Button)
    sections/           page sections (Hero)
    visuals/            reusable illustrations (BrandAccent, ProductDashboard)
public/
  assets/               icons, images and logos exported from Figma
```

## Design foundation

- **Colors**: Figma color variables implemented as Tailwind theme tokens (`bg-brand-500`, `text-warm-gray-900`, …).
- **Typography**: Figma text styles implemented as utilities (`text-heading-h1`, `text-body-medium-regular`, …) using Crimson Pro and Suisse Int'l.
- **Grid**: 12 columns, 16px gutter, 32px margin (1376px content at a 1440px canvas), engineered with the Müller-Brockmann Grid Systems methodology.

Internal review pages (development only, not indexed):

| Route | Purpose |
|---|---|
| `/design-system` | Color, typography and grid foundation, plus design review notes |
| `/homepage` | Homepage preview with a grid overlay toggle |
| `/?grid=true` | Homepage with the column overlay enabled |

The **Grid** toggle and overlays run locally and on builds with `NEXT_PUBLIC_REVIEW_MODE=true` (staging and Vercel previews); they are stripped when that flag is off.

## Review Mode (internal)

Figma-style area comments for reviewing the site on staging (https://nettle-website.vercel.app/?review=true). Reviewers pick **Nettle Team** or **Blissful Team** (no login), open the white **Comment** button (bottom-right), drag over an area, comment, reply, resolve, reopen or delete. Comments are stored in Postgres (Neon) and shared across devices.

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_REVIEW_MODE` | `true` enables the tools and `/api/review/*` (build-time; redeploy after changing). Otherwise nothing renders and no review code ships. |
| `DATABASE_URL` | Postgres connection string (added by the Vercel Neon integration). Server-only, never commit it. |
| `REVIEW_ENVIRONMENT` | Optional scope label; defaults to `staging` on Vercel, `development` locally. |

Setup on Vercel: add the Neon Postgres integration to the project, set `NEXT_PUBLIC_REVIEW_MODE=true`, redeploy. Tables are created automatically on first use. Locally: copy `.env.example` to `.env.local`, fill both variables and run `pnpm dev`. Code lives in `src/review/` and `src/app/api/review/`.

## Status

- Project foundation, design foundation and grid system are in place.
- Site header and Hero section are implemented.
- Further homepage sections are in progress.
