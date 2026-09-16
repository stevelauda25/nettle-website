# Nettle

Marketing website for Nettle — the AI workspace for Risk Control.

Built with Next.js (App Router), TypeScript, and Tailwind CSS.

## Requirements

- Node.js 24 (see `.nvmrc`)
- pnpm 11 (pinned via `packageManager`, enable with `corepack enable`)

## Scripts

```bash
pnpm install   # install dependencies
pnpm dev       # start the development server at http://localhost:3000
pnpm build     # create a production build
pnpm start     # serve the production build
pnpm lint      # run ESLint
```

## Structure

```
src/
  app/                 routes, root layout, global styles
  components/
    ui/                primitive, reusable UI elements
    layout/            header, footer, and page-level layout pieces
    sections/          homepage and marketing page sections
  lib/                 utilities and helpers
  types/               shared TypeScript types
public/
  images/ icons/ logos/ textures/
```
