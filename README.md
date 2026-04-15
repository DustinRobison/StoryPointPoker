<p align="center">
  <a href="https://scrumstorypoints.com/" rel="noopener" target="_blank">
    <img width="150" src="https://scrumstorypoints.com/images/logo_white.png" alt="StoryPointPoker logo" />
  </a>
</p>

<h1 align="center">Scrum Story Points</h1>

<div align="center">

[Agile](https://en.wikipedia.org/wiki/Agile_software_development) tool for sharing task complexity estimates in real time.

<img width="300" src="/.github/lighthouse.png" alt="Lighthouse report" />

</div>

## Prerequisites

- [Node.js](https://nodejs.org/) v24 (see `.nvmrc`)

## Local setup

1. Clone and install:

   ```bash
   git clone git@github.com:DustinRobison/StoryPointPoker.git && cd StoryPointPoker
   npm install
   ```

2. Environment: copy `.env.example` to `.env` and set at least:

   - `PUBLIC_SUPABASE_URL`, `PUBLIC_SUPABASE_ANON_KEY`, `SECRET_SUPABASE_SERVICE_ROLE_KEY`
   - `PUBLIC_BASE_URL` (e.g. `http://localhost:5173` for dev)
   - Stripe and Umami keys if you use those features

3. Database: in the [Supabase](https://supabase.com/dashboard) SQL editor, run `supabase/schema.sql` on your project (including vote RPCs and grants if you use room voting).

4. Dev server:

   ```bash
   npm run dev
   ```

## Production build

```bash
npm run build
npm run preview
```

`npm run check` runs TypeScript/Svelte validation; `npm run lint` runs Prettier + ESLint.

## Deployment (Vercel + Supabase)

The app uses [`@sveltejs/adapter-vercel`](https://svelte.dev/docs/kit/adapter-vercel) (`nodejs24.x`). Connect the repo to Vercel and configure the same environment variables as in `.env.example`. Ensure production Supabase has the full schema applied and, after adding RPCs, reload the Supabase API schema if needed.
