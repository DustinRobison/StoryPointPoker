<p align="center">
  <a href="https://scrumstorypoints.com/" rel="noopener" target="_blank">
  <img width="150" src="/static/android-chrome-512x512.png" alt="StoryPointPoker logo" />
  </a>
</p>
<h1 align="center">Scrum Story Points</h1>



<div align="center">

[Agile](https://en.wikipedia.org/wiki/Agile_software_development) tool for sharing task complexity estimates.

<img width="300" src="/.github/lighthouse.png" alt="Lighthouse report" />
</div>

## Pre Requisites

- [Node.js v24](https://nodejs.org/en/)


## Installation
1. Clone the repository and change directory into the project root

    - `git clone git@github.com:DustinRobison/StoryPointPoker.git && cd StoryPointPoker`

2. Install the dependencies with node package manager

    - `npm install`

3. Configure environment variables for Supabase.

    - Copy `.env.example` to `.env` and fill in `PUBLIC_SUPABASE_URL`, `PUBLIC_SUPABASE_ANON_KEY`, and `SECRET_SUPABASE_SERVICE_ROLE_KEY`
    - Make sure `PUBLIC_BASE_URL` is set to your local/dev URL

4. Create the database schema in Supabase.

    - Run `supabase/schema.sql` in the Supabase SQL editor

5. Start the UI.

    - `npm run dev`






# Boilerplate Svelte CLI docs:

Everything you need to build a Svelte project, powered by [`sv`](https://github.com/sveltejs/cli).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```bash
# create a new project in the current directory
npx sv create

# create a new project in my-app
npx sv create my-app
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.
