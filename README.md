<p align="center">
  <a href="https://scrumstorypoints.com/" rel="noopener" target="_blank"><img width="150" src="/static/android-chrome-512x512.png" alt="StoryPointPoker logo"></a>
</p>
<h1 align="center">Scrum Story Points</h1>

<img width="150" src="/.github/lighthouse.png" alt="Lighthouse report">

<div align="center">

[Agile](https://en.wikipedia.org/wiki/Agile_software_development) tool for sharing task complexity estimates.

</div>

## Pre Requisites

- [Node v20](https://nodejs.org/en/)
- [Pocketbase](https://pocketbase.io/)


## Installation
1. Clone the repository and change directory into the project root

    - `git clone git@github.com:DustinRobison/StoryPointPoker.git && cd StoryPointPoker`

2. Install the dependencies with node package manager

    - `npm install`

3. Download pocketbase, extract it into the pb directory and serve it.

    - Download it from: `https://pocketbase.io/docs/`
    - Extract it so there is pb/pocketbase

4. Run Pocketbase and set up an adminstrator, the link should be in your console on first run

    - `pb/pocketbase serve`

5. Load the schema from `pb/pb_schema.json` into pocketbase Settings -> Import collections to setup your db schema

6. Start and ensure both both pocketbase server backend and svelte UI frontend are running

    - PB: `pb/pocketbase serve`
    - UI: `npm run dev`






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
