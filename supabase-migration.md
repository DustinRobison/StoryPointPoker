# Supabase Migration + Vercel Release Plan

This document describes how to migrate the app from PocketBase on Fly.io to Supabase (free tier) and then move the web app to Vercel.

It is designed so you can deploy and fully test on **Vercel + Supabase** *before* changing DNS / making the production cutover.

## Non-negotiable goals

- Eliminate the PocketBase OOM crashes on Fly.io.
- Keep cost as low as possible (prefer $0).
- Ensure you can fully use and test the app on **Vercel (preview)** + **Supabase** before any DNS move.
- Use the git branch name `migrate-supabase` for all changes and pushes.

## Key context (what we’re replacing)

The current SvelteKit app uses PocketBase for:

- Auth + anonymous user creation (`src/hooks.server.ts`, `src/hooks.client.ts`, `src/lib/pocketbase.server.ts`)
- Data reads/writes (`src/routes/*`)
- Realtime subscriptions in the room page (`src/routes/room/[room]/+page.svelte`)
- Admin-only donation writes using PocketBase superuser (`src/routes/coffee/success/+page.server.ts`, `src/lib/pocketbase.server.ts`)
- PocketBase cron-style cleanup (`pb/pb_hooks/delete_old_rooms.pb.js`)

Supabase will replace that with:

- Supabase Auth (anonymous sign-in)
- Tables `rooms`, `users_public`, `posts`, `announcements`, `donators`, `featured_donators` from `supabase/schema.sql`
- Realtime on `rooms` + `users_public`
- Service role writes on the server for donation inserts
- A scheduled cleanup job (cron) replacing the PocketBase hook

## Overall flow (high level)

```mermaid
graph LR
  subgraph before[Before]
    WebFly[Web app on Fly.io] --> PB[PocketBase on Fly.io (OOM)]
  end
  subgraph during[During migration]
    WebPreview[Vercel preview] --> Supabase[Supabase free tier]
  end
  subgraph after[After cutover]
    WebProd[Vercel production] --> Supabase[Supabase free tier]
  end
  before --> during --> after
```

## Repo / branch rules

1. Create (or reuse) a branch named `migrate-supabase`.
2. Make all migration + Vercel changes on this branch.
3. Push to the remote so Vercel can automatically create preview deployments.

> Automation expectation: Vercel will create a new **Preview** deployment for each push to `migrate-supabase`.

### Git steps (manual)

1. `git checkout main`
2. `git pull`
3. `git checkout -b migrate-supabase` (or `git checkout migrate-supabase` if it already exists)
4. After each logical change chunk, commit and push:
   - `git add -A`
   - `git commit -m "..."` (small, meaningful messages)
   - `git push -u origin migrate-supabase`

### Automated steps (on push)

- Vercel builds and deploys the SvelteKit app for:
  - preview environments (every push)
  - production environment (only when you explicitly promote)

## Part 1: Prepare Supabase (free tier)

### Manual steps

1. Create a Supabase project.
2. Run the schema:
   - Open SQL editor and run `supabase/schema.sql`
3. Verify RLS/policies cover your usage:
   - Rooms: `select/insert/update` policies exist in `supabase/schema.sql`
   - Users_public: `select/insert/update` policies exist
   - Posts: `select/insert/update` policies exist
   - Announcements: only `select` policy exists (OK if you never update from client)
   - Donators: only `select/insert` policies exist (OK for service-role inserts)
4. Realtime enablement:
   - Enable Realtime replication for `public.rooms` and `public.users_public`
5. Anonymous user mapping (critical):
   - Supabase anonymous sign-in uses `auth.users.id` as the user UUID.
   - Your app needs a matching row in `public.users_public` for that UUID.

   Add a trigger so `users_public` auto-creates when an anonymous auth user is created.
   - Recommended approach (SQL): create a trigger function on `auth.users` insert and insert into `public.users_public`.
6. Replace PocketBase cron cleanup:
   - Create a scheduled task in Supabase (cron) to delete rooms older than 24 hours (mirrors `pb/pb_hooks/delete_old_rooms.pb.js`)
7. Create/confirm keys:
   - `PUBLIC_SUPABASE_URL`
   - `PUBLIC_SUPABASE_ANON_KEY`
   - `SECRET_SUPABASE_SERVICE_ROLE_KEY` (server-only)

### Automated steps (optional)

- If you use `supabase` CLI, you can automate:
  - applying `schema.sql`
  - setting up triggers and cron jobs

This is optional; the plan below assumes manual SQL for reliability.

## Part 2: Update the app to use Supabase (code migration)

This section describes what you will implement on `migrate-supabase`.

### Manual steps (implementation)

1. Update dependencies:
   - Add `@supabase/ssr` and `@supabase/supabase-js`
   - Remove `pocketbase` (later, after all code paths are migrated)
2. Replace PocketBase client code:
   - Remove/replace `src/lib/pocketbase.ts`
   - Remove/replace `src/lib/pocketbase.server.ts`
3. Replace cookie/auth flow:
   - `src/hooks.server.ts`
     - Replace `pb.authStore` loading/refresh logic with Supabase SSR cookie/session handling.
     - Ensure cookies are set with `sameSite: 'lax'` and `secure: true` in production.
   - `src/hooks.client.ts`
     - Replace PocketBase `pb.authStore.onChange(...)` logic with Supabase `onAuthStateChange(...)`.
4. Update types:
   - `src/app.d.ts`
     - Replace `locals.pb` + `locals.user` types with Supabase equivalents.
5. Replace each route’s PocketBase data access:
   - `src/routes/+page.server.ts`
   - `src/routes/room/[room]/+page.server.ts`
   - `src/routes/guestbook/+page.server.ts`
   - `src/routes/profile/+page.server.ts`
   - `src/routes/coffee/+page.server.ts`
   - `src/routes/coffee/success/+page.server.ts`
   - `src/routes/api/room/[roomName]/+server.ts`
   - `src/routes/room/[room]/+page.svelte` (realtime + client mutations)
6. Donation endpoint migration:
   - `src/routes/coffee/success/+page.server.ts`
     - Replace `getPocketbaseAdmin()` usage with a Supabase **service role** client.
     - Insert into `public.donators` when Stripe payment is `paid`.
     - Ensure `donators.stripe_id` is unique or guarded against duplicates.

   - `src/routes/api/donate/+server.ts`
     - This endpoint only creates Stripe sessions and constructs `success_url` / `cancel_url`.
     - Ensure `PUBLIC_BASE_URL` is set correctly in Vercel environments.

7. Realtime subscriptions migration (most important for user experience):
   - `src/routes/room/[room]/+page.svelte`
     - Replace:
       - `pb.collection('rooms').subscribe(...)`
       - `pb.collection('users_public').subscribe(...)`
     - With Supabase Realtime `postgres_changes` channels:
       - `UPDATE` on `public.rooms` where `id = roomId`
       - `INSERT/UPDATE` on `public.users_public` where `room = roomId`
   - Verify client code properly updates:
     - `roomData`
     - `users[]` list
8. Update env references:
   - The app currently uses `$env/static/public` for:
     - `PUBLIC_SUPABASE_URL`, `PUBLIC_SUPABASE_ANON_KEY`
     - `PUBLIC_BASE_URL` (Stripe success/cancel URLs)
   - That means those variables must exist **at Vercel build time**.

### Automated steps (build/test)

- After each commit, Vercel runs:
  - `npm install`
  - `npm run build`
  - SvelteKit checks depending on your config

## Data migration (PocketBase -> Supabase)

If you have existing production data, you must migrate it.

### Manual steps (recommended path)

1. Use PocketBase admin credentials (currently stored in Fly for `scrumstorypoints-pb`) to export:
   - `rooms`
   - `users_public`
   - `posts`
   - `announcements` (if present)
   - `donators`
2. Transform exports to match Supabase schema column names:
   - PocketBase uses `voteTime`, `voteClear`, etc. in app layer; the database schema uses snake_case in Supabase.
3. Import into Supabase:
   - Small sets: use Supabase UI import if available.
   - Better: use SQL COPY/insert scripts.

### Automated steps (optional)

- If you prefer automation, you can write a one-off Node script that:
  - pulls PocketBase collections via admin API token
  - upserts into Supabase via service role

This plan does not require it.

## Part 3: Move the web app to Vercel

This is separate from Supabase setup. The ordering below keeps DNS safe.

### Manual steps (Vercel setup)

1. Create a Vercel project and connect the GitHub repo.
2. Configure deployment settings:
   - Ensure Vercel uses the SvelteKit build.
3. Switch adapter to Vercel in code:
   - Update `svelte.config.js`
     - replace `@sveltejs/adapter-node` with `@sveltejs/adapter-vercel`
4. Confirm your SvelteKit build output works on Vercel:
   - Vercel will usually handle this automatically once the adapter is correct.
5. Add environment variables in Vercel.

#### Required Vercel env vars (Preview and Production)

Client/public (must be available at build time):

- `PUBLIC_SUPABASE_URL`
- `PUBLIC_SUPABASE_ANON_KEY`
- `PUBLIC_BASE_URL` (must match the Vercel deployment domain you’re testing)

Server-only:

- `SECRET_SUPABASE_SERVICE_ROLE_KEY`
- `SECRET_STRIPE_KEY`
- (if needed) any other private Stripe/secret values already used by the repo

Other considerations:

- If you use separate Supabase projects (recommended for dev/testing), set Vercel env vars per Vercel environment:
  - Preview uses testing Supabase project
  - Production uses production Supabase project

### Automated steps (Vercel)

- Every push to `migrate-supabase` should create a **Preview** deployment.
- Vercel preview builds are your safety net for testing before DNS.

## Part 4: Test fully on Vercel + Supabase (before DNS)

Do not change DNS until the full workflow works on Vercel Preview with Supabase.

### Manual test checklist (must pass)

Use the Vercel Preview URL for these tests.

1. Anonymous landing:
   - Load the homepage.
   - Ensure anonymous user session is created and stored.
2. Create room:
   - Create a room.
   - Confirm you land on `/room/<roomname>`.
3. Room page load:
   - Confirm room info renders (description, votes state, users list).
4. Voting:
   - Cast a vote.
   - Refresh and confirm vote is saved.
5. Realtime updates:
   - Open the same room in two browser windows.
   - One user updates description/vote.
   - Confirm the other updates without refresh.
6. Owner-only controls:
   - Toggle `restrictControl`.
   - Toggle `showVotes`.
   - Clear votes (owner-only).
7. Ban/unban behavior:
   - If kick/unban is implemented, verify the ban list updates and prevents actions.
8. Guestbook:
   - Load guestbook feed.
   - Create a post.
   - Like/unlike a post.
9. Profile:
   - Update name.
10. Donations:
   - Start donation checkout (`/api/donate`).
   - Complete checkout in Stripe test mode.
   - Verify you return to `/coffee/success` and a `donators` record is created in Supabase.
11. Room cleanup:
   - Wait (or temporarily adjust cron schedule in Supabase for testing) to verify old room deletion works.

### Automated tests (optional)

- If you have smoke tests or e2e tests, run them against the Vercel preview URL.

## Part 5: Production release without DNS changes (safe cutover)

### Manual steps

1. Promote deployment to Vercel **Production** *while DNS still points to Fly.io*:
   - Verify production environment variables are correct.
2. Smoke test production build on Vercel production URL:
   - Repeat the critical flows: room create + vote + realtime + donation.
3. Only after everything works:
   - move DNS to Vercel

### Automated steps

- Vercel production deploy runs automatically when you promote.

## Part 6: Post-cutover cleanup (optional but recommended)

### Manual steps

1. Once DNS is on Vercel and you confirm stable behavior:
   - stop/destroy the Fly PocketBase app (`scrumstorypoints-pb`) to avoid ongoing costs
2. Confirm Supabase still has:
   - realtime enabled
   - cron cleanup job enabled
3. Create a simple “keep-alive” ping if Supabase free tier can pause your project:
   - e.g. schedule a GitHub Action or use a Vercel Cron to hit the homepage every few days.

## Failure modes to watch (practical)

- Realtime filtering mistakes:
  - ensure the filter matches Supabase column names (`id`, `room`).
- Build-time env vars missing on Vercel:
  - anything from `$env/static/public` must be set before build.
- Cookie/session mismatch:
  - after auth migration, verify cookies are being set and refreshed correctly.

## Concrete file touchpoints (migration + Vercel)

Migration-sensitive files:

- `src/hooks.server.ts`
- `src/hooks.client.ts`
- `src/app.d.ts`
- `src/lib/pocketbase.ts` (to remove)
- `src/lib/pocketbase.server.ts` (to remove)
- `src/routes/+page.server.ts`
- `src/routes/room/[room]/+page.server.ts`
- `src/routes/room/[room]/+page.svelte`
- `src/routes/guestbook/+page.server.ts`
- `src/routes/profile/+page.server.ts`
- `src/routes/coffee/+page.server.ts`
- `src/routes/coffee/success/+page.server.ts`
- `src/routes/api/room/[roomName]/+server.ts`
- `src/routes/api/donate/+server.ts` (ensure `PUBLIC_BASE_URL` works)
- `svelte.config.js` (adapter-vercel change)

Supabase files:

- `supabase/schema.sql`
- `src/lib/supabase-mappers.ts` (extend beyond rooms/users_public as needed)
- `src/lib/supabase.ts` (already present; ensure build-time env vars exist)

## Where we are aiming to land

When this plan is done, you should have:

- PocketBase OOM resolved because you no longer rely on PocketBase on Fly.io
- A running app on Vercel, using Supabase for:
  - auth + anonymous sessions
  - realtime room updates
  - guestbook/posts
  - donations via Stripe success flow
- DNS moved only after end-to-end testing passes on Vercel Preview and/or Vercel Production.

